import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

interface SetLog {
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  targetPercent: number;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
  failed?: boolean;
  isAmrap?: boolean;
}

interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

/**
 * Server-side version of shouldExerciseProgress from lib/gym.ts
 * Checks if an exercise should have its TM bumped based on performance.
 */
function shouldExerciseProgress(
  settings: { autoProgress: boolean; minRepsForProgress: number | null } | null,
  amrapReps: number | null,
  targetReps: number,
  sets?: SetLog[]
): boolean {
  // Default: autoProgress is true if no settings exist
  const autoProgress = settings?.autoProgress ?? true;
  if (!autoProgress) return false;

  // If any set was marked as failed or was never completed, don't progress
  if (sets && sets.some(s => s.failed || !s.completed)) return false;

  // If minRepsForProgress is set, check if AMRAP hit the minimum
  const minReps = settings?.minRepsForProgress ?? null;
  if (minReps !== null && amrapReps !== null) {
    return amrapReps >= minReps;
  }

  // If no minimum set, progress if they at least hit target reps
  if (amrapReps !== null) {
    return amrapReps >= targetReps;
  }

  // Default to progressing (no workout data = assume success)
  return true;
}

// Vercel Cron runs this every Monday at 5:00 AM UTC (midnight EST)
// It closes any open (active) cycles, runs TM progression, and creates new ones for each profile.
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Hobby plan runs cron daily — only rotate cycles on Mondays
  const now = new Date();
  if (now.getUTCDay() !== 1) {
    return NextResponse.json({ message: 'Not Monday, skipping cycle rotation' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const today = now.toISOString().split('T')[0];
    const results: string[] = [];

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('gym_profiles')
      .select('id, name');

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No profiles found', results: [] });
    }

    for (const profile of profiles) {
      // Find any active cycles for this profile
      const { data: activeCycles, error: activeCyclesError } = await supabase
        .from('gym_cycles')
        .select('id, cycle_number')
        .eq('profile_id', profile.id)
        .eq('status', 'active');

      if (activeCyclesError) throw activeCyclesError;

      // Close out any active cycles and run TM progression
      if (activeCycles && activeCycles.length > 0) {
        for (const cycle of activeCycles) {
          // Fetch all workouts for this cycle to evaluate progression
          const { data: workouts, error: workoutsError } = await supabase
            .from('gym_workout_logs')
            .select('exercises')
            .eq('cycle_id', cycle.id);
          if (workoutsError) throw workoutsError;

          // Fetch exercise settings for this profile
          const { data: settingsRows, error: settingsError } = await supabase
            .from('gym_exercise_settings')
            .select('exercise_id, auto_progress, min_reps_for_progress, tm_increment')
            .eq('profile_id', profile.id);
          if (settingsError) throw settingsError;

          const settingsMap = new Map<string, { autoProgress: boolean; minRepsForProgress: number | null; tmIncrement: number }>();
          for (const row of settingsRows || []) {
            settingsMap.set(row.exercise_id, {
              autoProgress: row.auto_progress ?? true,
              minRepsForProgress: row.min_reps_for_progress,
              tmIncrement: parseFloat(row.tm_increment) || 5,
            });
          }

          // Fetch current training maxes for this profile
          const { data: tmRows } = await supabase
            .from('gym_training_maxes')
            .select('exercise_id, weight')
            .eq('profile_id', profile.id);

          const tmMap = new Map<string, number>();
          for (const row of tmRows || []) {
            tmMap.set(row.exercise_id, parseFloat(row.weight));
          }

          // Collect the latest workout data for each exercise
          // (if same exercise appears in multiple workouts, use the last one)
          const exerciseMap = new Map<string, ExerciseLog>();
          for (const workout of workouts || []) {
            const exercises = workout.exercises as ExerciseLog[];
            for (const exercise of exercises) {
              exerciseMap.set(exercise.exerciseId, exercise);
            }
          }

          let progressedCount = 0;

          for (const [, exercise] of exerciseMap) {
            const settings = settingsMap.get(exercise.exerciseId) || null;
            const amrapSet = exercise.sets.find(s => s.isAmrap);
            const amrapReps = amrapSet?.actualReps ?? null;
            const targetReps = amrapSet?.targetReps ?? 8;

            if (shouldExerciseProgress(settings, amrapReps, targetReps, exercise.sets)) {
              const currentTM = tmMap.get(exercise.exerciseId) || 0;
              if (currentTM === 0) continue; // No TM set, skip

              const increment = settings?.tmIncrement ?? 5;
              const newTM = currentTM + increment;

              // Update training max
              const { error: tmError } = await supabase
                .from('gym_training_maxes')
                .update({ weight: newTM })
                .eq('profile_id', profile.id)
                .eq('exercise_id', exercise.exerciseId);

              if (tmError) {
                console.error(`Failed to bump TM for ${exercise.exerciseId}:`, tmError);
                continue;
              }

              // Record TM history
              await supabase
                .from('gym_tm_history')
                .insert({
                  exercise_id: exercise.exerciseId,
                  weight: newTM,
                  cycle_id: cycle.id,
                  profile_id: profile.id,
                  notes: 'Auto-progression from cycle rotation',
                });

              progressedCount++;
            }
          }

          // Close the cycle
          const { error: closeError } = await supabase
            .from('gym_cycles')
            .update({
              status: 'completed',
              end_date: today,
            })
            .eq('id', cycle.id);

          if (closeError) throw closeError;
          results.push(`Closed cycle ${cycle.cycle_number} for ${profile.name} (${progressedCount} TMs bumped)`);
        }
      }

      // Get the next cycle number
      const { data: existingCycles } = await supabase
        .from('gym_cycles')
        .select('cycle_number')
        .eq('profile_id', profile.id)
        .order('cycle_number', { ascending: false })
        .limit(1);

      const nextCycleNumber = existingCycles && existingCycles.length > 0
        ? existingCycles[0].cycle_number + 1
        : 1;

      // Create new cycle
      const { error: createError } = await supabase
        .from('gym_cycles')
        .insert({
          start_date: today,
          cycle_number: nextCycleNumber,
          status: 'active',
          profile_id: profile.id,
        });

      if (createError) throw createError;
      results.push(`Created cycle ${nextCycleNumber} for ${profile.name}`);
    }

    return NextResponse.json({
      message: 'Cycle rotation complete',
      results,
    });
  } catch (error) {
    console.error('Cron gym-cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to rotate cycles' },
      { status: 500 }
    );
  }
}
