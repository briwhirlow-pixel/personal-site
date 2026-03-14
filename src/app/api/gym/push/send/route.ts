import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import webpush from 'web-push';

// Configure VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:noreply@example.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// POST - Process and send due push notifications (called by pg_cron)
export async function POST(request: Request) {
  // Authenticate with CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const supabase = getSupabase();

    // Fetch due notifications
    const { data: dueNotifications, error: fetchError } = await supabase
      .from('gym_scheduled_notifications')
      .select('*')
      .eq('sent', false)
      .lte('scheduled_at', new Date().toISOString())
      .limit(50);

    if (fetchError) throw fetchError;
    if (!dueNotifications || dueNotifications.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    let sentCount = 0;

    for (const notification of dueNotifications) {
      // Get push subscriptions for this profile
      const { data: subscriptions, error: subError } = await supabase
        .from('gym_push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('profile_id', notification.profile_id);

      if (subError) {
        console.error('Error fetching subscriptions:', subError);
        continue;
      }

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
      });

      // Send to all subscriptions for this profile
      for (const sub of subscriptions || []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
            { TTL: 60, urgency: 'high' }
          );
          sentCount++;
        } catch (pushError: unknown) {
          const statusCode = (pushError as { statusCode?: number })?.statusCode;
          if (statusCode === 410 || statusCode === 404) {
            // Subscription expired — remove it
            await supabase
              .from('gym_push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
          } else {
            console.error('Push send error:', pushError);
          }
        }
      }

      // Mark as sent
      await supabase
        .from('gym_scheduled_notifications')
        .update({ sent: true })
        .eq('id', notification.id);
    }

    return NextResponse.json({ sent: sentCount });
  } catch (error) {
    console.error('POST /api/gym/push/send error:', error);
    return NextResponse.json(
      { error: 'Failed to process notifications' },
      { status: 500 }
    );
  }
}
