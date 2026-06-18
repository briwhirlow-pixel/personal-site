import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
