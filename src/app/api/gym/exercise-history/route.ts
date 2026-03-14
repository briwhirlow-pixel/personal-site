import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// GET - Fetch most recent completed sets for an exercise from a previous cycle
// Looks through completed cycles (excluding the given cycle) to find the most
// recent workout where this exercise was performed on the given day.
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const exerciseId = searchParams.get('exerciseId');
  const dayNumber = searchParams.get('dayNumber');
  const excludeCycleId = searchParams.get('excludeCycleId');

  if (!exerciseId || !dayNumber) {
    return NextResponse.json(
      { error: 'exerciseId and dayNumber are required' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    // Get all cycles for this profile, ordered by most recent first
    // Include both completed and active cycles (to find data from any prior cycle)
    let cyclesQuery = supabase
      .from('gym_cycles')
      .select('id, cycle_number, start_date, status')
      .eq('profile_id', profile.profileId)
      .order('start_date', { ascending: false });

    const { data: cycles, error: cyclesError } = await cyclesQuery;
    if (cyclesError) throw cyclesError;

    if (!cycles || cycles.length === 0) {
      return NextResponse.json({ history: null });
    }

    // Filter out the current cycle if specified
    const candidateCycles = excludeCycleId
      ? cycles.filter(c => c.id !== excludeCycleId)
      : cycles;

    // Search through cycles from most recent to oldest
    for (const cycle of candidateCycles) {
      const { data: workout, error: workoutError } = await supabase
        .from('gym_workout_logs')
        .select('exercises, workout_date, completed')
        .eq('cycle_id', cycle.id)
        .eq('day_number', parseInt(dayNumber))
        .single();

      if (workoutError && workoutError.code !== 'PGRST116') throw workoutError;
      if (!workout) continue;

      // Look for the exercise in this workout's exercises array
      const exercises = workout.exercises as Array<{
        exerciseId: string;
        exerciseName: string;
        trainingMax?: number;
        sets: Array<{
          setNumber: number;
          targetReps: number;
          targetWeight: number;
          actualReps: number | null;
          actualWeight: number | null;
          completed: boolean;
          failed?: boolean;
          isAmrap?: boolean;
          setType?: string;
        }>;
        supersetId?: string;
        supersetName?: string;
        supersetSets?: Array<{
          setNumber: number;
          targetReps: number;
          targetWeight: number;
          actualReps: number | null;
          actualWeight: number | null;
          completed: boolean;
          failed?: boolean;
        }>;
      }>;

      const exerciseData = exercises?.find(e => e.exerciseId === exerciseId);
      if (!exerciseData) continue;

      // Check if any sets have actual data logged
      const hasData = exerciseData.sets.some(
        s => s.actualReps !== null || s.actualWeight !== null || s.completed
      );
      if (!hasData) continue;

      // Found the most recent cycle with data for this exercise
      return NextResponse.json({
        history: {
          cycleNumber: cycle.cycle_number,
          cycleDate: cycle.start_date,
          workoutDate: workout.workout_date,
          sets: exerciseData.sets,
          trainingMax: exerciseData.trainingMax,
          supersetName: exerciseData.supersetName,
          supersetSets: exerciseData.supersetSets,
        },
      });
    }

    // No history found
    return NextResponse.json({ history: null });
  } catch (error) {
    console.error('GET /api/gym/exercise-history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise history' },
      { status: 500 }
    );
  }
}
