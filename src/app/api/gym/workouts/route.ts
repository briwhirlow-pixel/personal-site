import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// GET - Fetch workouts for a cycle
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cycleId = searchParams.get('cycleId');
  const dayNumber = searchParams.get('dayNumber');

  try {
    const supabase = getSupabase();

    if (cycleId && dayNumber) {
      // Get specific workout for a day in a cycle
      const { data, error } = await supabase
        .from('gym_workout_logs')
        .select('*')
        .eq('cycle_id', cycleId)
        .eq('day_number', parseInt(dayNumber))
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return NextResponse.json({ workout: null });
      }

      return NextResponse.json({
        workout: {
          id: data.id,
          cycleId: data.cycle_id,
          workoutDate: data.workout_date,
          dayNumber: data.day_number,
          exercises: data.exercises,
          completed: data.completed,
          notes: data.notes,
        },
      });
    } else if (cycleId) {
      // Get all workouts for a cycle
      const { data, error } = await supabase
        .from('gym_workout_logs')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('day_number', { ascending: true });

      if (error) throw error;

      return NextResponse.json({
        workouts: (data || []).map(w => ({
          id: w.id,
          cycleId: w.cycle_id,
          workoutDate: w.workout_date,
          dayNumber: w.day_number,
          exercises: w.exercises,
          completed: w.completed,
          notes: w.notes,
        })),
      });
    }

    return NextResponse.json({ error: 'cycleId required' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/gym/workouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST - Save or update a workout log
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { workout } = body;

    if (!workout || !workout.cycleId || workout.dayNumber === undefined) {
      return NextResponse.json(
        { error: 'Missing workout data' },
        { status: 400 }
      );
    }

    // Check if workout already exists for this cycle/day
    const { data: existing } = await supabase
      .from('gym_workout_logs')
      .select('id')
      .eq('cycle_id', workout.cycleId)
      .eq('day_number', workout.dayNumber)
      .single();

    if (existing) {
      // Update existing workout
      const { error } = await supabase
        .from('gym_workout_logs')
        .update({
          workout_date: workout.workoutDate || new Date().toISOString().split('T')[0],
          exercises: workout.exercises,
          completed: workout.completed,
          notes: workout.notes,
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new workout
      const { error } = await supabase
        .from('gym_workout_logs')
        .insert({
          cycle_id: workout.cycleId,
          workout_date: workout.workoutDate || new Date().toISOString().split('T')[0],
          day_number: workout.dayNumber,
          exercises: workout.exercises,
          completed: workout.completed || false,
          notes: workout.notes,
          profile_id: profile.profileId,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/workouts error:', error);
    return NextResponse.json(
      { error: 'Failed to save workout' },
      { status: 500 }
    );
  }
}
