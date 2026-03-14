import { NextResponse } from 'next/server';
import { getSupabase, WeekLog } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// GET - Fetch all week logs or a specific week
export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get('weekStart');

  try {
    const supabase = getSupabase();

    if (weekStart) {
      // Get specific week
      const { data, error } = await supabase
        .from('gym_week_logs')
        .select('*')
        .eq('week_start', weekStart)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      return NextResponse.json({ weekLog: data?.log_data || null });
    } else {
      // Get all weeks (for listing available past weeks)
      const { data, error } = await supabase
        .from('gym_week_logs')
        .select('week_start, updated_at')
        .order('week_start', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ weeks: data || [] });
    }
  } catch (error) {
    console.error('GET /api/gym error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gym data' },
      { status: 500 }
    );
  }
}

// POST - Save or update a week log
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const weekLog: WeekLog = body.weekLog;

    if (!weekLog || !weekLog.weekStart) {
      return NextResponse.json(
        { error: 'Missing weekLog or weekStart' },
        { status: 400 }
      );
    }

    // Upsert the week log (insert if not exists, update if exists)
    const { data, error } = await supabase
      .from('gym_week_logs')
      .upsert(
        {
          week_start: weekLog.weekStart,
          log_data: weekLog,
        },
        {
          onConflict: 'week_start',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, weekLog: data?.log_data });
  } catch (error) {
    console.error('POST /api/gym error:', error);
    return NextResponse.json(
      { error: 'Failed to save gym data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific week log (optional, for cleanup)
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get('weekStart');

  if (!weekStart) {
    return NextResponse.json(
      { error: 'Missing weekStart parameter' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('gym_week_logs')
      .delete()
      .eq('week_start', weekStart);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gym data' },
      { status: 500 }
    );
  }
}
