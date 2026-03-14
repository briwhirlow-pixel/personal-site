import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// Training Max calculations:
// Working weight is typically 75-85% of TM
// So TM = working weight / 0.80 (using 80% as middle ground)
// For lighter accessory work, we'll use the actual weight as TM since they don't progress the same way

interface ExerciseData {
  id: string;
  tm: number;          // Training Max
  sets?: number;       // Override sets
  reps?: number;       // Override reps
  basePercent?: number;
  tmIncrement?: number;
  autoProgress?: boolean;
}

// Sample exercise data for the PPL program
// Edit these values to match your actual training maxes
const exerciseData: ExerciseData[] = [
  // === PUSH DAY ===
  { id: 'bench-press', tm: 185, sets: 4, reps: 8, basePercent: 80, tmIncrement: 5 },
  { id: 'overhead-press', tm: 135, sets: 3, reps: 8, basePercent: 75, tmIncrement: 5 },
  { id: 'incline-db-press', tm: 60, sets: 3, reps: 10, basePercent: 80, tmIncrement: 5 },
  { id: 'incline-db-press-superset', tm: 20, sets: 3, reps: 15, basePercent: 75, tmIncrement: 2.5, autoProgress: false },
  { id: 'tricep-pushdowns', tm: 50, sets: 3, reps: 12, basePercent: 80, tmIncrement: 2.5 },

  // === PULL DAY ===
  { id: 'barbell-rows', tm: 155, sets: 4, reps: 8, basePercent: 80, tmIncrement: 5 },
  { id: 'lat-pulldowns', tm: 130, sets: 3, reps: 10, basePercent: 80, tmIncrement: 5 },
  { id: 'barbell-curls', tm: 65, sets: 3, reps: 10, basePercent: 80, tmIncrement: 5 },
  { id: 'barbell-curls-superset', tm: 40, sets: 3, reps: 15, basePercent: 75, tmIncrement: 2.5, autoProgress: false },
  { id: 'hammer-curls', tm: 30, sets: 3, reps: 12, basePercent: 80, tmIncrement: 2.5 },

  // === LEG DAY ===
  { id: 'squats', tm: 225, sets: 4, reps: 8, basePercent: 80, tmIncrement: 5 },
  { id: 'rdls', tm: 185, sets: 3, reps: 8, basePercent: 75, tmIncrement: 5 },
  { id: 'leg-press', tm: 300, sets: 3, reps: 10, basePercent: 80, tmIncrement: 10 },
  { id: 'leg-curls', tm: 100, sets: 3, reps: 12, basePercent: 80, tmIncrement: 5 },
  { id: 'calf-raises', tm: 150, sets: 3, reps: 15, basePercent: 80, tmIncrement: 5 },
];

// POST - Seed initial data
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const results = {
      trainingMaxes: { inserted: 0, errors: [] as string[] },
      settings: { inserted: 0, errors: [] as string[] },
    };

    // Insert training maxes
    for (const exercise of exerciseData) {
      try {
        const { error } = await supabase
          .from('gym_training_maxes')
          .upsert(
            {
              exercise_id: exercise.id,
              weight: exercise.tm,
              unit: 'lbs',
              profile_id: profile.profileId,
            },
            { onConflict: 'profile_id,exercise_id' }
          );

        if (error) {
          results.trainingMaxes.errors.push(`${exercise.id}: ${error.message}`);
        } else {
          results.trainingMaxes.inserted++;
        }
      } catch (err) {
        results.trainingMaxes.errors.push(`${exercise.id}: ${err}`);
      }
    }

    // Insert exercise settings
    for (const exercise of exerciseData) {
      try {
        const { error } = await supabase
          .from('gym_exercise_settings')
          .upsert(
            {
              exercise_id: exercise.id,
              base_percent: exercise.basePercent ?? 75,
              percent_increment: 0, // No increment between sets since working sets are all same weight
              tm_increment: exercise.tmIncrement ?? 5,
              auto_progress: exercise.autoProgress ?? true,
              min_reps_for_progress: null,
              target_sets: exercise.sets ?? null,
              target_reps: exercise.reps ?? null,
              profile_id: profile.profileId,
            },
            { onConflict: 'profile_id,exercise_id' }
          );

        if (error) {
          results.settings.errors.push(`${exercise.id}: ${error.message}`);
        } else {
          results.settings.inserted++;
        }
      } catch (err) {
        results.settings.errors.push(`${exercise.id}: ${err}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Seeded ${results.trainingMaxes.inserted} training maxes and ${results.settings.inserted} exercise settings`,
    });
  } catch (error) {
    console.error('POST /api/gym/seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}

// GET - Check current seed status
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();

    const [tmResult, settingsResult] = await Promise.all([
      supabase.from('gym_training_maxes').select('exercise_id, weight').eq('profile_id', profile.profileId),
      supabase.from('gym_exercise_settings').select('exercise_id').eq('profile_id', profile.profileId),
    ]);

    return NextResponse.json({
      trainingMaxes: tmResult.data?.length ?? 0,
      settings: settingsResult.data?.length ?? 0,
      expectedExercises: exerciseData.length,
    });
  } catch (error) {
    console.error('GET /api/gym/seed error:', error);
    return NextResponse.json(
      { error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
