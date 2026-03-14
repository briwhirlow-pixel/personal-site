import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

export interface ExerciseSettings {
  exerciseId: string;
  basePercent: number;
  percentIncrement: number;
  tmIncrement: number;
  autoProgress: boolean;
  minRepsForProgress: number | null;
  targetSets: number | null;
  targetReps: number | null;
}

// GET - Fetch all exercise settings
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('gym_exercise_settings')
      .select('*')
      .eq('profile_id', profile.profileId)
      .order('exercise_id');

    if (error) throw error;

    return NextResponse.json({
      settings: (data || []).map(s => ({
        exerciseId: s.exercise_id,
        basePercent: parseFloat(s.base_percent),
        percentIncrement: parseFloat(s.percent_increment),
        tmIncrement: parseFloat(s.tm_increment),
        autoProgress: s.auto_progress,
        minRepsForProgress: s.min_reps_for_progress,
        targetSets: s.target_sets,
        targetReps: s.target_reps,
      })),
    });
  } catch (error) {
    console.error('GET /api/gym/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Save or update exercise settings
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const settings: ExerciseSettings = body.settings;

    if (!settings || !settings.exerciseId) {
      return NextResponse.json(
        { error: 'Missing settings or exerciseId' },
        { status: 400 }
      );
    }

    // Upsert the settings
    const { error } = await supabase
      .from('gym_exercise_settings')
      .upsert(
        {
          exercise_id: settings.exerciseId,
          base_percent: settings.basePercent,
          percent_increment: settings.percentIncrement,
          tm_increment: settings.tmIncrement,
          auto_progress: settings.autoProgress,
          min_reps_for_progress: settings.minRepsForProgress,
          target_sets: settings.targetSets,
          target_reps: settings.targetReps,
          profile_id: profile.profileId,
        },
        { onConflict: 'profile_id,exercise_id' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// DELETE - Delete exercise settings (reset to defaults)
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const exerciseId = searchParams.get('exerciseId');

  if (!exerciseId) {
    return NextResponse.json(
      { error: 'Missing exerciseId' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('gym_exercise_settings')
      .delete()
      .eq('exercise_id', exerciseId)
      .eq('profile_id', profile.profileId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to delete settings' },
      { status: 500 }
    );
  }
}
