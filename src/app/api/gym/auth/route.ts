import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/passwords';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (typeof password !== 'string' || !password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('gym_profiles')
      .select('id, name, password');

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const match = data.find(row => verifyPassword(password, row.password));
    if (!match) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      profile: { id: match.id, name: match.name },
    });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
