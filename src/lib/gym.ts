import gymProgramData from '@/data/gym-program.json';

export type SetType = 'warmup' | 'working' | 'burnout' | 'dropset';

export interface SetSchemeItem {
  reps: number;
  percent: number;
  type?: SetType;
  isAmrap?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'plate';
  sets: number;
  reps: string;
  setScheme?: SetSchemeItem[]; // Custom set scheme with different reps/percents per set
  superset?: string;
  supersetEquipment?: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'plate';
  supersetReps?: string; // Target reps for superset
  supersetScheme?: SetSchemeItem[]; // Custom scheme for superset (like 15/12/10)
  notes: string;
}

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  dayOfWeek: string;
  exercises: Exercise[];
}

export interface GymProgram {
  days: WorkoutDay[];
  nutrition: {
    macros: {
      protein: number;
      carbs: number;
      fat: string;
      sugars: number;
      calories: number;
    };
    creatine: string;
  };
}

// Legacy types for backwards compatibility
export interface ExerciseLog {
  weight: string;
  reps: string;
  supersetWeight?: string;
  supersetReps?: string;
  completed: boolean;
}

export interface DayLog {
  [exerciseId: string]: ExerciseLog;
}

export interface WeekLog {
  weekStart: string; // ISO date string for Monday
  days: {
    [dayNumber: number]: DayLog;
  };
}

// New types for 5/3/1 style tracking
export interface SetLog {
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  targetPercent: number;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
  failed?: boolean; // User marked this set as failed - prevents TM progression
  isAmrap?: boolean; // "As Many Reps As Possible" for final set
  setType?: SetType; // warmup, working, burnout, dropset
}

export interface ExerciseWorkoutLog {
  exerciseId: string;
  exerciseName: string;
  trainingMax: number;
  sets: SetLog[];
  supersetId?: string;
  supersetName?: string;
  supersetSets?: SetLog[];
  notes?: string;
}

export interface WorkoutLog {
  id?: string;
  cycleId: string;
  workoutDate: string;
  dayNumber: number;
  dayName: string;
  exercises: ExerciseWorkoutLog[];
  completed: boolean;
  notes?: string;
}

export interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  cycleNumber: number;
  status: 'active' | 'completed';
  workouts: WorkoutLog[];
  totalWorkouts?: number;
  completedWorkouts?: number;
  totalSets?: number;
  completedSets?: number;
  setCompletion?: number;
  notes?: string;
}

export interface TrainingMax {
  exerciseId: string;
  weight: number;
  unit: 'lbs' | 'kg';
}

export interface ExerciseSettings {
  exerciseId: string;
  basePercent: number;
  percentIncrement: number;
  tmIncrement: number;
  autoProgress: boolean;
  minRepsForProgress: number | null;
  targetSets: number | null; // Override default sets from program
  targetReps: number | null; // Override default reps from program
}

export interface SupersetConfig {
  id?: string;
  primaryExerciseId: string;
  supersetExerciseId: string;
  supersetName: string;
  supersetEquipment: string;
  supersetReps: string;
  dayNumber: number;
}

// Default settings for exercises
export const DEFAULT_EXERCISE_SETTINGS: Omit<ExerciseSettings, 'exerciseId'> = {
  basePercent: 75,
  percentIncrement: 2.5,
  tmIncrement: 5,
  autoProgress: true,
  minRepsForProgress: null, // null means always progress on cycle complete
  targetSets: null, // null means use program default
  targetReps: null, // null means use program default
};

// Calculate weight from percentage and training max
export function calculateWeight(trainingMax: number, percentage: number): number {
  const weight = trainingMax * (percentage / 100);
  // Round to nearest 5 for barbells, 2.5 for dumbbells
  return Math.round(weight / 5) * 5;
}

// Round to nearest increment (5 for barbells, 2.5 for dumbbells)
export function roundWeight(weight: number, increment: number = 5): number {
  return Math.round(weight / increment) * increment;
}

// Generate working sets based on rep scheme and training max
export function generateWorkingSets(
  trainingMax: number,
  repScheme: { reps: number; percent: number; isAmrap?: boolean }[]
): SetLog[] {
  return repScheme.map((scheme, index) => ({
    setNumber: index + 1,
    targetReps: scheme.reps,
    targetWeight: calculateWeight(trainingMax, scheme.percent),
    targetPercent: scheme.percent,
    actualReps: null,
    actualWeight: null,
    completed: false,
    isAmrap: scheme.isAmrap,
  }));
}

// Default rep schemes for different exercises
export function getDefaultRepScheme(
  _exerciseId: string,
  programSets: number,
  repsString: string,
  customSettings?: ExerciseSettings,
  setScheme?: SetSchemeItem[]
): { reps: number; percent: number; isAmrap?: boolean; type?: SetType }[] {
  // If there's a custom setScheme in the program data, use it directly
  if (setScheme && setScheme.length > 0) {
    return setScheme.map(s => ({
      reps: s.reps,
      percent: customSettings?.basePercent && s.type === 'working'
        ? customSettings.basePercent
        : s.percent,
      isAmrap: s.isAmrap,
      type: s.type,
    }));
  }

  // Use custom sets/reps if provided, otherwise use program defaults
  const sets = customSettings?.targetSets ?? programSets;

  // Parse the reps string to determine scheme (use custom targetReps if set)
  let targetReps: number;
  if (customSettings?.targetReps) {
    targetReps = customSettings.targetReps;
  } else {
    const repRange = parseRepRange(repsString);
    targetReps = repRange ? repRange.max : 8;
  }

  // Use custom settings if provided, otherwise calculate based on rep range
  let basePercent: number;
  let percentIncrement: number;

  if (customSettings) {
    basePercent = customSettings.basePercent;
    percentIncrement = customSettings.percentIncrement;
  } else {
    // Default percentages based on target reps (higher reps = lower percentage)
    basePercent = targetReps <= 5 ? 85 : targetReps <= 8 ? 75 : targetReps <= 12 ? 65 : 55;
    percentIncrement = 2.5;
  }

  const scheme: { reps: number; percent: number; isAmrap?: boolean; type?: SetType }[] = [];
  for (let i = 0; i < sets; i++) {
    scheme.push({
      reps: targetReps,
      percent: basePercent + (i * percentIncrement),
      isAmrap: i === sets - 1, // Last set is AMRAP
      type: 'working',
    });
  }

  return scheme;
}

// Get completion percentage for a workout
export function getWorkoutCompletion(workout: WorkoutLog): number {
  let totalSets = 0;
  let completedSets = 0;

  for (const exercise of workout.exercises) {
    totalSets += exercise.sets.length;
    completedSets += exercise.sets.filter(s => s.completed).length;

    if (exercise.supersetSets) {
      totalSets += exercise.supersetSets.length;
      completedSets += exercise.supersetSets.filter(s => s.completed).length;
    }
  }

  return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
}

// Get completion percentage for a cycle
export function getCycleCompletion(cycle: Cycle): number {
  if (cycle.workouts.length === 0) return 0;

  const totalCompletion = cycle.workouts.reduce((sum, w) => sum + getWorkoutCompletion(w), 0);
  return Math.round(totalCompletion / cycle.workouts.length);
}

// Calculate new training max after completing a cycle
export function calculateNewTrainingMax(
  currentMax: number,
  equipment: string
): number {
  // Standard 5/3/1 progression: +5 lbs for upper body, +10 lbs for lower body
  // We'll use +5 for all since we're doing a mix
  const increment = equipment === 'barbell' ? 5 : 2.5;
  return currentMax + increment;
}

export function getGymProgram(): GymProgram {
  return gymProgramData as GymProgram;
}

export function getWorkoutDay(dayNumber: number): WorkoutDay | undefined {
  const program = getGymProgram();
  return program.days.find(d => d.dayNumber === dayNumber);
}

// Get the Monday of the current week
export function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

// Get the Monday of a specific week
export function getWeekStartFromDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

// Get today's day number (1-7, Monday = 1)
export function getTodayDayNumber(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day; // Sunday becomes 7
}

// Session storage keys
const AUTH_KEY = 'gym_auth';
const PROFILE_KEY = 'gym_profile';

export interface GymProfile {
  id: string;
  name: string;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEY);
}

export function getGymProfile(): GymProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function setGymSession(password: string, profile: GymProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, password);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearGymSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null && getGymProfile() !== null;
}

// API functions for Supabase
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function verifyPassword(password: string): Promise<GymProfile | null> {
  try {
    const response = await fetch('/api/gym/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function fetchWeekLog(weekStart: string): Promise<WeekLog | null> {
  try {
    const response = await fetchWithAuth(`/api/gym?weekStart=${weekStart}`);
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    return data.weekLog || null;
  } catch (error) {
    console.error('Error fetching week log:', error);
    throw error;
  }
}

export async function fetchAllWeeks(): Promise<{ week_start: string; updated_at: string }[]> {
  try {
    const response = await fetchWithAuth('/api/gym');
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    return data.weeks || [];
  } catch (error) {
    console.error('Error fetching all weeks:', error);
    throw error;
  }
}

export async function saveWeekLogToCloud(log: WeekLog): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym', {
      method: 'POST',
      body: JSON.stringify({ weekLog: log }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to save');
    }
  } catch (error) {
    console.error('Error saving week log:', error);
    throw error;
  }
}

// Get available past weeks for the date picker
export function getAvailablePastWeeks(count: number = 12): { weekStart: string; label: string }[] {
  const weeks: { weekStart: string; label: string }[] = [];
  const currentWeekStart = getCurrentWeekStart();

  for (let i = 0; i <= count; i++) {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) - (i * 7);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toISOString().split('T')[0];

    const end = new Date(monday);
    end.setDate(end.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const isCurrent = weekStart === currentWeekStart;

    weeks.push({
      weekStart,
      label: isCurrent
        ? `This Week (${monday.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)})`
        : `${monday.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
    });
  }

  return weeks;
}

// Helper to format week date range
export function formatWeekLabel(weekStart: string): string {
  const monday = new Date(weekStart + 'T00:00:00');
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)}`;
}

// Auto-progression logic
export function parseRepRange(repString: string): { min: number; max: number } | null {
  // Handle various formats: "8", "8-12", "3x8", "10-12", "1x20 + 3x10", etc.
  // We focus on the main rep target, not warmup sets

  // Clean the string
  const cleaned = repString.toLowerCase().trim();

  // Check for range like "8-12" or "10-12"
  const rangeMatch = cleaned.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }

  // Check for single number like "8" or "15"
  const singleMatch = cleaned.match(/^(\d+)$/);
  if (singleMatch) {
    const num = parseInt(singleMatch[1]);
    return { min: num, max: num };
  }

  // Check for "3x8" format - extract the rep count
  const setsRepsMatch = cleaned.match(/\d+x(\d+)/);
  if (setsRepsMatch) {
    const num = parseInt(setsRepsMatch[1]);
    return { min: num, max: num };
  }

  return null;
}

export function parseLoggedReps(repsString: string): number[] {
  // Parse comma-separated reps like "10, 10, 8" or "10,10,8"
  if (!repsString) return [];
  return repsString
    .split(',')
    .map(r => parseInt(r.trim()))
    .filter(r => !isNaN(r));
}

export function parseLoggedWeights(weightString: string): number[] {
  // Parse comma-separated weights like "135, 155, 155" or "135,155,155"
  if (!weightString) return [];
  return weightString
    .split(',')
    .map(w => parseFloat(w.trim()))
    .filter(w => !isNaN(w));
}

export function shouldProgress(
  exercise: Exercise,
  log: ExerciseLog
): { shouldProgress: boolean; newWeight: string } {
  const repRange = parseRepRange(exercise.reps);
  if (!repRange) {
    return { shouldProgress: false, newWeight: log.weight };
  }

  const loggedReps = parseLoggedReps(log.reps);
  const loggedWeights = parseLoggedWeights(log.weight);

  // Need at least one logged set
  if (loggedReps.length === 0 || loggedWeights.length === 0) {
    return { shouldProgress: false, newWeight: log.weight };
  }

  // All sets must hit the max of the rep range
  const allSetsHitMax = loggedReps.every(reps => reps >= repRange.max);

  if (!allSetsHitMax) {
    return { shouldProgress: false, newWeight: log.weight };
  }

  // Calculate new weights based on equipment type
  const increment = exercise.equipment === 'dumbbell' ? 2.5 : 5;

  const newWeights = loggedWeights.map(w => w + increment);
  const newWeight = newWeights.join(', ');

  return { shouldProgress: true, newWeight };
}

export function shouldProgressSuperset(
  exercise: Exercise,
  log: ExerciseLog
): { shouldProgress: boolean; newWeight: string } {
  if (!exercise.superset || !exercise.supersetEquipment) {
    return { shouldProgress: false, newWeight: log.supersetWeight || '' };
  }

  // For supersets, we don't have a specific rep range in the exercise data
  // So we'll just check if all reps are logged and weights are logged
  const loggedReps = parseLoggedReps(log.supersetReps || '');
  const loggedWeights = parseLoggedWeights(log.supersetWeight || '');

  if (loggedReps.length === 0 || loggedWeights.length === 0) {
    return { shouldProgress: false, newWeight: log.supersetWeight || '' };
  }

  // For supersets, progress if all sets have reps logged
  // Using a simple heuristic: if they logged it, they completed it
  const increment = exercise.supersetEquipment === 'dumbbell' ? 2.5 : 5;

  const newWeights = loggedWeights.map(w => w + increment);
  const newWeight = newWeights.join(', ');

  return { shouldProgress: true, newWeight };
}

export function calculateProgressedWeekLog(
  previousWeekLog: WeekLog,
  program: GymProgram
): WeekLog {
  const newWeekLog: WeekLog = {
    weekStart: getCurrentWeekStart(),
    days: {},
  };

  // Go through each day in the program
  for (const day of program.days) {
    if (day.exercises.length === 0) continue; // Skip rest days

    const previousDayLog = previousWeekLog.days[day.dayNumber];
    if (!previousDayLog) continue; // No previous data for this day

    newWeekLog.days[day.dayNumber] = {};

    for (const exercise of day.exercises) {
      const previousExerciseLog = previousDayLog[exercise.id];
      if (!previousExerciseLog || !previousExerciseLog.completed) continue;

      // Calculate progression for main exercise
      const mainProgression = shouldProgress(exercise, previousExerciseLog);

      // Calculate progression for superset if exists
      const supersetProgression = shouldProgressSuperset(exercise, previousExerciseLog);

      // Pre-fill the new week with progressed weights (or same weights if not progressing)
      newWeekLog.days[day.dayNumber][exercise.id] = {
        weight: mainProgression.newWeight,
        reps: '', // Don't pre-fill reps, user needs to log them
        supersetWeight: supersetProgression.newWeight || '',
        supersetReps: '',
        completed: false,
      };
    }
  }

  return newWeekLog;
}

// =====================================================
// New API functions for cycles and workout tracking
// =====================================================

// Fetch all cycles
export async function fetchCycles(): Promise<Cycle[]> {
  try {
    const response = await fetchWithAuth('/api/gym/cycles');
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch cycles');
    }
    const data = await response.json();
    return data.cycles || [];
  } catch (error) {
    console.error('Error fetching cycles:', error);
    throw error;
  }
}

// Fetch a specific cycle with its workouts
export async function fetchCycle(cycleId: string): Promise<Cycle | null> {
  try {
    const response = await fetchWithAuth(`/api/gym/cycles?id=${cycleId}`);
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch cycle');
    }
    const data = await response.json();
    return data.cycle || null;
  } catch (error) {
    console.error('Error fetching cycle:', error);
    throw error;
  }
}

// Create a new cycle
export async function createCycle(): Promise<Cycle> {
  try {
    const response = await fetchWithAuth('/api/gym/cycles', {
      method: 'POST',
      body: JSON.stringify({ action: 'create' }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to create cycle');
    }
    const data = await response.json();
    return data.cycle;
  } catch (error) {
    console.error('Error creating cycle:', error);
    throw error;
  }
}

// Complete a cycle (marks it as completed and bumps training maxes)
export async function completeCycle(cycleId: string): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/cycles', {
      method: 'POST',
      body: JSON.stringify({ action: 'complete', cycleId }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to complete cycle');
    }
  } catch (error) {
    console.error('Error completing cycle:', error);
    throw error;
  }
}

// Delete a cycle and its workouts
export async function deleteCycle(cycleId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`/api/gym/cycles?id=${cycleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to delete cycle');
    }
  } catch (error) {
    console.error('Error deleting cycle:', error);
    throw error;
  }
}

// Update a cycle's start date
export async function updateCycleStartDate(cycleId: string, startDate: string): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/cycles', {
      method: 'POST',
      body: JSON.stringify({ action: 'updateStartDate', cycleId, startDate }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to update cycle start date');
    }
  } catch (error) {
    console.error('Error updating cycle start date:', error);
    throw error;
  }
}

// Seed gym data (training maxes and settings)
export async function seedGymData(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchWithAuth('/api/seed?table=gym', {
      method: 'POST',
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      const data = await response.json();
      throw new Error(data.error || 'Failed to seed gym data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error seeding gym data:', error);
    throw error;
  }
}

// Fetch all training maxes
export async function fetchTrainingMaxes(): Promise<TrainingMax[]> {
  try {
    const response = await fetchWithAuth('/api/gym/training-max');
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch training maxes');
    }
    const data = await response.json();
    return data.trainingMaxes || [];
  } catch (error) {
    console.error('Error fetching training maxes:', error);
    throw error;
  }
}

// Save a training max for an exercise
export async function saveTrainingMax(exerciseId: string, weight: number): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/training-max', {
      method: 'POST',
      body: JSON.stringify({ exerciseId, weight }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to save training max');
    }
  } catch (error) {
    console.error('Error saving training max:', error);
    throw error;
  }
}

// Fetch a workout log for a specific day in a cycle
export async function fetchWorkoutLog(cycleId: string, dayNumber: number): Promise<WorkoutLog | null> {
  try {
    const response = await fetchWithAuth(`/api/gym/workouts?cycleId=${cycleId}&dayNumber=${dayNumber}`);
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch workout');
    }
    const data = await response.json();
    return data.workout || null;
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
}

// Save a workout log
export async function saveWorkoutLog(workout: WorkoutLog): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/workouts', {
      method: 'POST',
      body: JSON.stringify({ workout }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to save workout');
    }
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
}

// Fetch all exercise settings
export async function fetchExerciseSettings(): Promise<ExerciseSettings[]> {
  try {
    const response = await fetchWithAuth('/api/gym/settings');
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch settings');
    }
    const data = await response.json();
    return data.settings || [];
  } catch (error) {
    console.error('Error fetching exercise settings:', error);
    throw error;
  }
}

// Save exercise settings
export async function saveExerciseSettings(settings: ExerciseSettings): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/settings', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to save settings');
    }
  } catch (error) {
    console.error('Error saving exercise settings:', error);
    throw error;
  }
}

// Delete exercise settings (reset to defaults)
export async function deleteExerciseSettings(exerciseId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`/api/gym/settings?exerciseId=${exerciseId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to delete settings');
    }
  } catch (error) {
    console.error('Error deleting exercise settings:', error);
    throw error;
  }
}

// Check if exercise should progress based on AMRAP performance and failed sets
export function shouldExerciseProgress(
  settings: ExerciseSettings | undefined,
  amrapReps: number | null,
  targetReps: number,
  sets?: SetLog[]
): boolean {
  // Use defaults when no settings exist (autoProgress defaults to true)
  const autoProgress = settings?.autoProgress ?? DEFAULT_EXERCISE_SETTINGS.autoProgress;
  if (!autoProgress) {
    return false;
  }

  // If any set was marked as failed or was never completed (skipped), don't progress
  if (sets && sets.some(s => s.failed || !s.completed)) {
    return false;
  }

  // If minRepsForProgress is set, check if AMRAP hit the minimum
  const minReps = settings?.minRepsForProgress ?? DEFAULT_EXERCISE_SETTINGS.minRepsForProgress;
  if (minReps !== null && amrapReps !== null) {
    return amrapReps >= minReps;
  }

  // If no minimum set, progress if they at least hit target reps
  if (amrapReps !== null) {
    return amrapReps >= targetReps;
  }

  // Default to progressing
  return true;
}

// Get today's date as ISO string
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format date short (for mobile)
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// =====================================================
// Superset Configuration API Functions
// =====================================================

// Fetch all superset configurations
export async function fetchSupersets(): Promise<SupersetConfig[]> {
  try {
    const response = await fetchWithAuth('/api/gym/supersets');
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch supersets');
    }
    const data = await response.json();
    return data.supersets || [];
  } catch (error) {
    console.error('Error fetching supersets:', error);
    throw error;
  }
}

// Save a superset configuration
export async function saveSuperset(superset: SupersetConfig): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/supersets', {
      method: 'POST',
      body: JSON.stringify({ superset }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to save superset');
    }
  } catch (error) {
    console.error('Error saving superset:', error);
    throw error;
  }
}

// Delete a superset configuration
export async function deleteSuperset(primaryExerciseId: string, dayNumber: number): Promise<void> {
  try {
    const response = await fetchWithAuth(
      `/api/gym/supersets?primaryExerciseId=${primaryExerciseId}&dayNumber=${dayNumber}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to delete superset');
    }
  } catch (error) {
    console.error('Error deleting superset:', error);
    throw error;
  }
}

// =====================================================
// Training Max History API Functions
// =====================================================

export interface TMHistoryEntry {
  id: string;
  exerciseId: string;
  weight: number;
  unit: string;
  cycleId?: string;
  recordedAt: string;
  notes?: string;
}

// Fetch TM history for an exercise
export async function fetchTMHistory(exerciseId?: string): Promise<TMHistoryEntry[]> {
  try {
    const url = exerciseId
      ? `/api/gym/history?exerciseId=${exerciseId}`
      : '/api/gym/history';
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch TM history');
    }
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error fetching TM history:', error);
    throw error;
  }
}

// Record a TM history entry
export async function recordTMHistory(
  exerciseId: string,
  weight: number,
  cycleId?: string,
  notes?: string
): Promise<void> {
  try {
    const response = await fetchWithAuth('/api/gym/history', {
      method: 'POST',
      body: JSON.stringify({ exerciseId, weight, cycleId, notes }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to record TM history');
    }
  } catch (error) {
    console.error('Error recording TM history:', error);
    throw error;
  }
}

// Delete TM history entries for a specific cycle
export async function deleteTMHistoryForCycle(cycleId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`/api/gym/history?cycleId=${cycleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to delete TM history for cycle');
    }
  } catch (error) {
    console.error('Error deleting TM history for cycle:', error);
    throw error;
  }
}

// =====================================================
// Exercise History API Functions
// =====================================================

export interface ExerciseHistoryData {
  cycleNumber: number;
  cycleDate: string;
  workoutDate: string;
  sets: SetLog[];
  trainingMax?: number;
  supersetName?: string;
  supersetSets?: SetLog[];
}

// Fetch the most recent completed sets for an exercise from a previous cycle
export async function fetchExerciseHistory(
  exerciseId: string,
  dayNumber: number,
  excludeCycleId?: string
): Promise<ExerciseHistoryData | null> {
  try {
    let url = `/api/gym/exercise-history?exerciseId=${exerciseId}&dayNumber=${dayNumber}`;
    if (excludeCycleId) {
      url += `&excludeCycleId=${excludeCycleId}`;
    }
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      if (response.status === 401) {
        clearGymSession();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch exercise history');
    }
    const data = await response.json();
    return data.history || null;
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    throw error;
  }
}

// Push notification helpers

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    if (!VAPID_PUBLIC_KEY) return false;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;

    // Use getRegistration instead of navigator.serviceWorker.ready which hangs on iOS PWA
    let registration = await navigator.serviceWorker.getRegistration('/gym');
    if (!registration) {
      registration = await navigator.serviceWorker.register('/gym/sw.js', { scope: '/gym/' });
      if (registration.installing || registration.waiting) {
        await new Promise<void>((resolve) => {
          const sw = registration!.installing || registration!.waiting;
          if (!sw) { resolve(); return; }
          sw.addEventListener('statechange', () => {
            if (sw.state === 'activated') resolve();
          });
          if (sw.state === 'activated') resolve();
        });
      }
    }
    if (!registration?.active) return false;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY).buffer as ArrayBuffer,
    });

    const json = subscription.toJSON();
    const response = await fetchWithAuth('/api/gym/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        endpoint: json.endpoint,
        keys: json.keys,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return false;
  }
}

export async function schedulePushNotification(scheduledAt: string): Promise<void> {
  try {
    await fetchWithAuth('/api/gym/push/schedule', {
      method: 'POST',
      body: JSON.stringify({ scheduledAt }),
    });
  } catch (error) {
    console.error('Error scheduling push notification:', error);
  }
}

export async function cancelPushNotification(): Promise<void> {
  try {
    await fetchWithAuth('/api/gym/push/schedule', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error cancelling push notification:', error);
  }
}
