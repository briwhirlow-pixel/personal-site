import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import webpush from 'web-push';

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:noreply@example.com';
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  vapidConfigured = true;
  return true;
}

// POST - Process and send due push notifications (called by pg_cron)
export async function POST(request: Request) {
  // Authenticate with CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ensureVapidConfigured()) {
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

      let deliveredAtLeastOne = false;
      let hadActiveSubscription = false;

      // Send to all subscriptions for this profile
      for (const sub of subscriptions || []) {
        hadActiveSubscription = true;
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
          deliveredAtLeastOne = true;
        } catch (pushError: unknown) {
          const statusCode = (pushError as { statusCode?: number })?.statusCode;
          if (statusCode === 410 || statusCode === 404) {
            // Subscription expired — remove it; this counts as a "won't retry" outcome.
            await supabase
              .from('gym_push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
          } else {
            console.error('Push send error:', pushError);
          }
        }
      }

      // Mark as sent only if we delivered at least once OR there were no
      // subscriptions to deliver to in the first place (nothing to retry).
      if (deliveredAtLeastOne || !hadActiveSubscription) {
        await supabase
          .from('gym_scheduled_notifications')
          .update({ sent: true })
          .eq('id', notification.id);
      }
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
