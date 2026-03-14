import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

export interface TMHistoryEntry {
  id: string;
  exerciseId: string;
  weight: number;
  unit: string;
  cycleId?: string;
  recordedAt: string;
  notes?: string;
}

// GET - Fetch TM history for an exercise or all exercises
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const exerciseId = searchParams.get('exerciseId');

  try {
    const supabase = getSupabase();

    let query = supabase
      .from('gym_tm_history')
      .select('*')
      .eq('profile_id', profile.profileId)
      .order('recorded_at', { ascending: false });

    if (exerciseId) {
      query = query.eq('exercise_id', exerciseId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      history: (data || []).map(h => ({
        id: h.id,
        exerciseId: h.exercise_id,
        weight: parseFloat(h.weight),
        unit: h.unit,
        cycleId: h.cycle_id,
        recordedAt: h.recorded_at,
        notes: h.notes,
      })),
    });
  } catch (error) {
    console.error('GET /api/gym/history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// POST - Record a TM history entry
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { exerciseId, weight, cycleId, notes } = body;

    if (!exerciseId || weight === undefined) {
      return NextResponse.json(
        { error: 'Exercise ID and weight are required' },
        { status: 400 }
      );
    }

    // Deduplication: if a cycle_id is provided, check if an entry already exists
    if (cycleId) {
      const { data: existing } = await supabase
        .from('gym_tm_history')
        .select('id')
        .eq('exercise_id', exerciseId)
        .eq('cycle_id', cycleId)
        .eq('profile_id', profile.profileId)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, deduplicated: true });
      }
    }

    const { error } = await supabase
      .from('gym_tm_history')
      .insert({
        exercise_id: exerciseId,
        weight,
        unit: 'lbs',
        cycle_id: cycleId || null,
        notes: notes || null,
        profile_id: profile.profileId,
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/history error:', error);
    return NextResponse.json(
      { error: 'Failed to record history' },
      { status: 500 }
    );
  }
}

// DELETE - Remove TM history entries for a specific cycle
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cycleId = searchParams.get('cycleId');
  const id = searchParams.get('id');

  if (!cycleId && !id) {
    return NextResponse.json({ error: 'cycleId or id is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    if (id) {
      // Delete a specific entry
      const { error } = await supabase
        .from('gym_tm_history')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else if (cycleId) {
      // Delete all entries for a cycle
      const { error } = await supabase
        .from('gym_tm_history')
        .delete()
        .eq('cycle_id', cycleId);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym/history error:', error);
    return NextResponse.json(
      { error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}
