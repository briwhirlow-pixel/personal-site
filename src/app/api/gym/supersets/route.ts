import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

export interface SupersetConfig {
  id?: string;
  primaryExerciseId: string;
  supersetExerciseId: string;
  supersetName: string;
  supersetEquipment: string;
  supersetReps: string;
  dayNumber: number;
}

// GET - Fetch all superset configurations
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('gym_supersets')
      .select('*')
      .eq('profile_id', profile.profileId)
      .order('day_number', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      supersets: (data || []).map(s => ({
        id: s.id,
        primaryExerciseId: s.primary_exercise_id,
        supersetExerciseId: s.superset_exercise_id,
        supersetName: s.superset_name,
        supersetEquipment: s.superset_equipment,
        supersetReps: s.superset_reps,
        dayNumber: s.day_number,
      })),
    });
  } catch (error) {
    console.error('GET /api/gym/supersets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supersets' },
      { status: 500 }
    );
  }
}

// POST - Create or update a superset configuration
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { superset } = body as { superset: SupersetConfig };

    if (!superset.primaryExerciseId || !superset.supersetExerciseId) {
      return NextResponse.json(
        { error: 'Primary exercise and superset exercise are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('gym_supersets')
      .upsert(
        {
          primary_exercise_id: superset.primaryExerciseId,
          superset_exercise_id: superset.supersetExerciseId,
          superset_name: superset.supersetName,
          superset_equipment: superset.supersetEquipment || 'dumbbell',
          superset_reps: superset.supersetReps || '15',
          day_number: superset.dayNumber,
          profile_id: profile.profileId,
        },
        { onConflict: 'profile_id,primary_exercise_id,day_number' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/supersets error:', error);
    return NextResponse.json(
      { error: 'Failed to save superset' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a superset configuration
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const primaryExerciseId = searchParams.get('primaryExerciseId');
  const dayNumber = searchParams.get('dayNumber');

  if (!primaryExerciseId || !dayNumber) {
    return NextResponse.json(
      { error: 'Primary exercise ID and day number are required' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('gym_supersets')
      .delete()
      .eq('primary_exercise_id', primaryExerciseId)
      .eq('day_number', parseInt(dayNumber))
      .eq('profile_id', profile.profileId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym/supersets error:', error);
    return NextResponse.json(
      { error: 'Failed to delete superset' },
      { status: 500 }
    );
  }
}
