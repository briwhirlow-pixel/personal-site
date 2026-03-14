import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';
import gymProgramData from '@/data/gym-program.json';

// Calculate expected sets per workout day from the program definition
function getExpectedSetsPerDay(): Map<number, number> {
  const perDay = new Map<number, number>();
  for (const day of gymProgramData.days) {
    if (day.exercises.length === 0) continue; // Skip rest days
    let sets = 0;
    for (const exercise of day.exercises) {
      sets += exercise.sets;
      if (exercise.superset) {
        sets += exercise.sets; // default: superset has same count as main
      }
    }
    perDay.set(day.dayNumber, sets);
  }
  return perDay;
}

// Count total and completed sets from logged workouts
// For logged days, use actual set counts (accounts for customized settings)
// For unlogged workout days, use program definition as the expected total
function countCycleSets(
  workouts: Array<{ day_number?: number; exercises: unknown }>,
  expectedPerDay: Map<number, number>,
): { total: number; completed: number } {
  let total = 0;
  let completed = 0;
  const loggedDays = new Set<number>();

  for (const workout of workouts) {
    if (workout.day_number) loggedDays.add(workout.day_number);
    const exercises = (workout.exercises as Array<{ sets?: Array<{ completed?: boolean }>; supersetSets?: Array<{ completed?: boolean }> }>) || [];
    for (const exercise of exercises) {
      const sets = exercise.sets || [];
      total += sets.length;
      completed += sets.filter(s => s.completed).length;

      const supersetSets = exercise.supersetSets || [];
      total += supersetSets.length;
      completed += supersetSets.filter(s => s.completed).length;
    }
  }

  // Add expected sets for unlogged workout days
  for (const [dayNum, expectedSets] of expectedPerDay) {
    if (!loggedDays.has(dayNum)) {
      total += expectedSets;
    }
  }

  return { total, completed };
}

// GET - Fetch all cycles or a specific cycle
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cycleId = searchParams.get('id');

  try {
    const supabase = getSupabase();

    if (cycleId) {
      // Get specific cycle with its workouts
      const { data: cycle, error: cycleError } = await supabase
        .from('gym_cycles')
        .select('*')
        .eq('id', cycleId)
        .eq('profile_id', profile.profileId)
        .single();

      if (cycleError) throw cycleError;

      // Get workouts for this cycle
      const { data: workouts, error: workoutsError } = await supabase
        .from('gym_workout_logs')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('day_number', { ascending: true });

      if (workoutsError) throw workoutsError;

      return NextResponse.json({
        cycle: {
          id: cycle.id,
          startDate: cycle.start_date,
          endDate: cycle.end_date,
          cycleNumber: cycle.cycle_number,
          status: cycle.status,
          notes: cycle.notes,
          workouts: (workouts || []).map(w => ({
            id: w.id,
            cycleId: w.cycle_id,
            workoutDate: w.workout_date,
            dayNumber: w.day_number,
            exercises: w.exercises,
            completed: w.completed,
            notes: w.notes,
          })),
        },
      });
    } else {
      // Get all cycles
      const { data: cycles, error } = await supabase
        .from('gym_cycles')
        .select('*')
        .eq('profile_id', profile.profileId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const expectedPerDay = getExpectedSetsPerDay();

      // Get workout data for each cycle to calculate set-level completion
      const cyclesWithCounts = await Promise.all(
        (cycles || []).map(async (cycle) => {
          const { data: workouts } = await supabase
            .from('gym_workout_logs')
            .select('day_number, exercises, completed')
            .eq('cycle_id', cycle.id);

          const totalWorkouts = workouts?.length || 0;
          const completedWorkouts = workouts?.filter(w => w.completed).length || 0;

          // Count sets: actual data for logged days, program definition for unlogged days
          const { total: totalSets, completed: completedSets } = countCycleSets(workouts || [], expectedPerDay);
          const setCompletion = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

          return {
            id: cycle.id,
            startDate: cycle.start_date,
            endDate: cycle.end_date,
            cycleNumber: cycle.cycle_number,
            status: cycle.status,
            notes: cycle.notes,
            totalWorkouts,
            completedWorkouts,
            totalSets,
            completedSets,
            setCompletion,
            workouts: [],
          };
        })
      );

      return NextResponse.json({ cycles: cyclesWithCounts });
    }
  } catch (error) {
    console.error('GET /api/gym/cycles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cycles' },
      { status: 500 }
    );
  }
}

// POST - Create or complete a cycle
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { action, cycleId } = body;

    if (action === 'create') {
      // Get the next cycle number
      const { data: existingCycles } = await supabase
        .from('gym_cycles')
        .select('cycle_number')
        .eq('profile_id', profile.profileId)
        .order('cycle_number', { ascending: false })
        .limit(1);

      const nextCycleNumber = existingCycles && existingCycles.length > 0
        ? existingCycles[0].cycle_number + 1
        : 1;

      // Create new cycle
      const { data: newCycle, error } = await supabase
        .from('gym_cycles')
        .insert({
          start_date: new Date().toISOString().split('T')[0],
          cycle_number: nextCycleNumber,
          status: 'active',
          profile_id: profile.profileId,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        cycle: {
          id: newCycle.id,
          startDate: newCycle.start_date,
          endDate: newCycle.end_date,
          cycleNumber: newCycle.cycle_number,
          status: newCycle.status,
          workouts: [],
        },
      });
    } else if (action === 'complete' && cycleId) {
      // Complete the cycle
      const { error } = await supabase
        .from('gym_cycles')
        .update({
          status: 'completed',
          end_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', cycleId)
        .eq('profile_id', profile.profileId);

      if (error) throw error;

      // Bump training maxes by 5 lbs (handled in separate endpoint)
      return NextResponse.json({ success: true });
    } else if (action === 'updateStartDate' && cycleId) {
      const { startDate } = body;
      if (!startDate) {
        return NextResponse.json({ error: 'Start date is required' }, { status: 400 });
      }

      const { error } = await supabase
        .from('gym_cycles')
        .update({ start_date: startDate })
        .eq('id', cycleId)
        .eq('profile_id', profile.profileId);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/gym/cycles error:', error);
    return NextResponse.json(
      { error: 'Failed to process cycle' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a cycle and its workouts
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cycleId = searchParams.get('id');

  if (!cycleId) {
    return NextResponse.json({ error: 'Missing cycle id' }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    // Delete workouts first (should cascade but being explicit)
    await supabase
      .from('gym_workout_logs')
      .delete()
      .eq('cycle_id', cycleId)
      .eq('profile_id', profile.profileId);

    // Delete the cycle
    const { error } = await supabase
      .from('gym_cycles')
      .delete()
      .eq('id', cycleId)
      .eq('profile_id', profile.profileId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym/cycles error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cycle' },
      { status: 500 }
    );
  }
}
