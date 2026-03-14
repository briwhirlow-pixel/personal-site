import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyGymAuth } from '@/lib/gym-auth';

// POST - Schedule a push notification for when the rest timer completes
export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { scheduledAt } = body;

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Missing scheduledAt' }, { status: 400 });
    }

    // Remove any existing unsent notifications for this profile first
    await supabase
      .from('gym_scheduled_notifications')
      .delete()
      .eq('profile_id', profile.profileId)
      .eq('sent', false);

    // Insert the new scheduled notification
    const { error } = await supabase
      .from('gym_scheduled_notifications')
      .insert({
        profile_id: profile.profileId,
        title: 'Rest Timer Complete',
        body: 'Time to start your next set!',
        scheduled_at: scheduledAt,
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/gym/push/schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule notification' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel any pending notifications (when timer is manually cleared)
export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();

    const { error } = await supabase
      .from('gym_scheduled_notifications')
      .delete()
      .eq('profile_id', profile.profileId)
      .eq('sent', false);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gym/push/schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel notification' },
      { status: 500 }
    );
  }
}
