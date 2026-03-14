import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// GET - Fetch all training maxes
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('gym_training_maxes')
      .select('*')
      .eq('profile_id', profile.profileId)
      .order('exercise_id');

    if (error) throw error;

    return NextResponse.json({
      trainingMaxes: (data || []).map(tm => ({
        exerciseId: tm.exercise_id,
        weight: parseFloat(tm.weight),
        unit: tm.unit,
      })),
    });
  } catch (error) {
    console.error('GET /api/gym/training-max error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training maxes' },
      { status: 500 }
    );
  }
}

// POST - Save or update a training max
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { exerciseId, weight, unit = 'lbs' } = body;

    if (!exerciseId || weight === undefined) {
      return NextResponse.json(
        { error: 'Missing exerciseId or weight' },
        { status: 400 }
      );
    }

    // Upsert the training max
    const { error } = await supabase
      .from('gym_training_maxes')
      .upsert(
        {
          exercise_id: exerciseId,
          weight: weight,
          unit: unit,
          profile_id: profile.profileId,
        },
        { onConflict: 'profile_id,exercise_id' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/training-max error:', error);
    return NextResponse.json(
      { error: 'Failed to save training max' },
      { status: 500 }
    );
  }
}

// PUT - Bump all training maxes (used after completing a cycle)
export async function PUT(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { increment = 5 } = body;

    // Get all current training maxes
    const { data: currentMaxes, error: fetchError } = await supabase
      .from('gym_training_maxes')
      .select('*')
      .eq('profile_id', profile.profileId);

    if (fetchError) throw fetchError;

    // Update each one with the increment
    for (const tm of (currentMaxes || [])) {
      const { error: updateError } = await supabase
        .from('gym_training_maxes')
        .update({ weight: parseFloat(tm.weight) + increment })
        .eq('id', tm.id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true, updated: currentMaxes?.length || 0 });
  } catch (error) {
    console.error('PUT /api/gym/training-max error:', error);
    return NextResponse.json(
      { error: 'Failed to bump training maxes' },
      { status: 500 }
    );
  }
}
