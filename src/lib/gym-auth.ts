import { createHash } from 'crypto';
import { getSupabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/passwords';

export interface GymProfileInfo {
  profileId: string;
  profileName: string;
}

// Cache key is sha256(password) so the raw password is never retained in memory.
const profileCache = new Map<string, { profile: GymProfileInfo; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cacheKey(password: string): string {
  return createHash('sha256').update(`gym-cache:${password}`).digest('hex');
}

export async function verifyGymAuth(request: Request): Promise<GymProfileInfo | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const password = authHeader.substring(7);
  if (!password) return null;

  const key = cacheKey(password);
  const cached = profileCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  // Fetch all profiles and constant-time compare against each stored password.
  // (The set is small — typically 1-3 profiles — so a full scan is fine and
  // avoids running an indexable equality on a sensitive column.)
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gym_profiles')
    .select('id, name, password');

  if (error || !data) return null;

  const match = data.find(row => verifyPassword(password, row.password));
  if (!match) return null;

  const profile: GymProfileInfo = {
    profileId: match.id,
    profileName: match.name,
  };

  profileCache.set(key, { profile, expiresAt: Date.now() + CACHE_TTL });
  return profile;
}
