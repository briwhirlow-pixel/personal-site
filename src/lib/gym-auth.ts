import { getSupabase } from '@/lib/supabase';

export interface GymProfileInfo {
  profileId: string;
  profileName: string;
}

// Simple in-memory cache: password -> { profile, expiresAt }
const profileCache = new Map<string, { profile: GymProfileInfo; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function verifyGymAuth(request: Request): Promise<GymProfileInfo | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const password = authHeader.substring(7);
  if (!password) return null;

  // Check cache first
  const cached = profileCache.get(password);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  // Query DB for matching profile
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gym_profiles')
    .select('id, name')
    .eq('password', password)
    .single();

  if (error || !data) return null;

  const profile: GymProfileInfo = {
    profileId: data.id,
    profileName: data.name,
  };

  // Cache the result
  profileCache.set(password, { profile, expiresAt: Date.now() + CACHE_TTL });
  return profile;
}
