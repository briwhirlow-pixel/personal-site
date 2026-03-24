import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

// Public client — uses anon key, respects RLS. Use for contact form inserts.
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars are not set.");
    supabase = createClient(url, key);
  }
  return supabase;
}

// Admin client — uses service role key, bypasses RLS. Server-side only. Never expose to browser.
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
    supabaseAdmin = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabaseAdmin;
}

// Alias used by contact route (anon key — INSERT only allowed by RLS)
export function getSupabaseClient(): SupabaseClient {
  return getSupabase();
}

// Re-export for legacy route compatibility
export type { WeekLog } from '@/lib/gym';
