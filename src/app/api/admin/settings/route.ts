import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('settings').select('key, value');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map: Record<string, string> = {};
  for (const row of data || []) {
    map[row.key] = row.value;
  }
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updates: Record<string, string> = await req.json();
  const sb = getSupabaseAdmin();

  for (const [key, value] of Object.entries(updates)) {
    await sb
      .from('settings')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
  }

  return NextResponse.json({ success: true });
}
