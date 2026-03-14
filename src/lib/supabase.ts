import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars are not set.");
    supabase = createClient(url, key);
  }
  return supabase;
}

// Alias used by contact route
export function getSupabaseClient(): SupabaseClient {
  return getSupabase();
}

// Re-export for legacy route compatibility
export type { WeekLog } from '@/lib/gym';
