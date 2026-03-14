'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  getGymProgram,
  getTodayDayNumber,
  isAuthenticated,
  setGymSession,
  clearGymSession,
  getGymProfile,
  verifyPassword,
  fetchCycles,
  fetchCycle,
  createCycle,
  completeCycle,
  deleteCycle,
  updateCycleStartDate,
  seedGymData,
  fetchTrainingMaxes,
  saveTrainingMax,
  saveWorkoutLog,
  getWorkoutCompletion,
  calculateWeight,
  getDefaultRepScheme,
  fetchExerciseSettings,
  saveExerciseSettings,
  fetchSupersets,
  saveSuperset,
  deleteSuperset,
  fetchTMHistory,
  recordTMHistory,
  deleteTMHistoryForCycle,
  shouldExerciseProgress,
  fetchExerciseHistory,
  subscribeToPush,
  schedulePushNotification,
  cancelPushNotification,
  DEFAULT_EXERCISE_SETTINGS,
  Cycle,
  WorkoutLog,
  ExerciseWorkoutLog,
  SetLog,
  ExerciseSettings,
  SupersetConfig,
  TMHistoryEntry,
  ExerciseHistoryData,
  SetType,
} from '@/lib/gym';

type View = 'cycles' | 'cycle' | 'builder' | 'exercise' | 'settings' | 'history';

// Builder step: 1=muscle groups, 2=day type, 3=exercise selection
type BuilderStep = 1 | 2 | 3;

// Reusable Activity Ring component (like Apple Fitness)
function ActivityRing({
  percent,
  size = 48,
  color = '#30D158',
  trackOpacity = 0.12,
  strokeWidth,
}: {
  percent: number;
  size?: number;
  color?: string;
  trackOpacity?: number;
  strokeWidth?: number;
}) {
  const sw = strokeWidth ?? Math.max(size / 9, 3);
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(Math.max(percent, 0), 100) / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw} opacity={trackOpacity} />
      <circle
        cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#0A84FF',
  back: '#30D158',
  shoulders: '#FF9F0A',
  biceps: '#BF5AF2',
  triceps: '#FF6B35',
  legs: '#FF453A',
  abs: '#32ADE6',
  cardio: '#FFD60A',
  calisthenics: '#5AC8FA',
};

export default function GymPage() {
  const program = getGymProgram();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth state
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [profileName, setProfileName] = useState('');

  // Navigation state
  const [view, setView] = useState<View>('cycles');
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<Cycle | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(getTodayDayNumber());
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWorkoutLog | null>(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  // Training max state
  const [trainingMaxes, setTrainingMaxes] = useState<Map<string, number>>(new Map());
  const [editingTM, setEditingTM] = useState<string | null>(null);
  const [tmInput, setTmInput] = useState('');

  // Exercise settings state
  const [exerciseSettings, setExerciseSettings] = useState<Map<string, ExerciseSettings>>(new Map());
  const [editingSettings, setEditingSettings] = useState<ExerciseSettings | null>(null);

  // Workout state
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutLog | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete cycle state
  const [deletingCycleId, setDeletingCycleId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit cycle start date state
  const [editingDateCycleId, setEditingDateCycleId] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState<string>('');

  // Seed state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Superset configuration state
  const [supersetConfigs, setSupersetConfigs] = useState<SupersetConfig[]>([]);
  const [editingSuperset, setEditingSuperset] = useState<{ exerciseId: string; dayNumber: number } | null>(null);
  const [supersetSelection, setSupersetSelection] = useState<string>('');

  // Workout builder state
  const [builderStep, setBuilderStep] = useState<BuilderStep>(1);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedDayType, setSelectedDayType] = useState<'rep' | 'strength' | null>(null);
  const [builderSelectedExercises, setBuilderSelectedExercises] = useState<string[]>([]);
  const [exerciseSetCounts, setExerciseSetCounts] = useState<Map<string, number>>(new Map());
  const [exerciseImages, setExerciseImages] = useState<Map<string, string | null>>(new Map());

  // History state
  const [tmHistory, setTmHistory] = useState<TMHistoryEntry[]>([]);
  const [selectedHistoryExercise, setSelectedHistoryExercise] = useState<string>('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Exercise history state (previous cycle data)
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryData | null>(null);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);
  const [isLoadingExerciseHistory, setIsLoadingExerciseHistory] = useState(false);

  // Settings accordion state - track which day(s) are expanded
  const [expandedSettingsDays, setExpandedSettingsDays] = useState<Set<number>>(new Set());

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Rest timer state - persistent across navigation and browser backgrounding
  const [restTimeRemaining, setRestTimeRemaining] = useState<number>(0);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const REST_TIMER_KEY = 'gym_rest_timer_end';

  // Calculate remaining time from stored end time
  const calculateRemainingTime = useCallback(() => {
    const storedEndTime = localStorage.getItem(REST_TIMER_KEY);
    if (!storedEndTime) return 0;

    const endTime = parseInt(storedEndTime, 10);
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, []);

  // Request notification permission and subscribe to push (lazy, on first timer start)
  const pushSubscribedRef = useRef(false);
  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    // Subscribe to web push if not already done
    if (!pushSubscribedRef.current && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      pushSubscribedRef.current = true;
      await subscribeToPush();
    }
  }, []);

  // Play a short beep sound for timer completion
  const playTimerBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // Play 3 short beeps
      [0, 0.2, 0.4].forEach(delay => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start(audioCtx.currentTime + delay);
        oscillator.stop(audioCtx.currentTime + delay + 0.15);
      });
    } catch {
      // AudioContext not available
    }
  }, []);

  // Send a notification when rest timer completes
  const sendTimerNotification = useCallback(() => {
    // Play audio beep (works even without notification permission)
    playTimerBeep();

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      // Try service worker notification first (works better when backgrounded)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Rest Timer Complete', {
            body: 'Time to start your next set!',
            icon: '/gym/icon.png',
            tag: 'rest-timer',
            requireInteraction: false,
          });
        }).catch(() => {
          // Fallback to regular Notification API
          new Notification('Rest Timer Complete', {
            body: 'Time to start your next set!',
            icon: '/gym/icon.png',
            tag: 'rest-timer',
          });
        });
      } else {
        new Notification('Rest Timer Complete', {
          body: 'Time to start your next set!',
          icon: '/gym/icon.png',
          tag: 'rest-timer',
        });
      }
    }
  }, [playTimerBeep]);

  // Schedule notification for when timer ends
  const scheduleTimerNotification = useCallback((durationMs: number) => {
    // Clear any existing scheduled notification
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    notificationTimerRef.current = setTimeout(() => {
      sendTimerNotification();
      notificationTimerRef.current = null;
    }, durationMs);
  }, [sendTimerNotification]);

  // Start or restart the rest timer
  const startRestTimer = useCallback(async () => {
    // Clear any existing timer
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }

    // Store end time in localStorage (60 seconds from now)
    const durationMs = 60 * 1000;
    const endTime = Date.now() + durationMs;
    localStorage.setItem(REST_TIMER_KEY, endTime.toString());

    // Set initial time
    setRestTimeRemaining(60);

    // Schedule client-side notification (works if app stays in memory)
    scheduleTimerNotification(durationMs);

    // Schedule server-side push notification (works even if app is suspended)
    schedulePushNotification(new Date(endTime).toISOString());

    // Start countdown that checks actual time remaining
    restTimerRef.current = setInterval(() => {
      const remaining = calculateRemainingTime();
      setRestTimeRemaining(remaining);

      if (remaining <= 0) {
        if (restTimerRef.current) {
          clearInterval(restTimerRef.current);
          restTimerRef.current = null;
        }
        localStorage.removeItem(REST_TIMER_KEY);
      }
    }, 1000);

    // Request notification permission and subscribe to push (awaited to preserve
    // iOS user gesture context for pushManager.subscribe)
    await requestNotificationPermission();
  }, [calculateRemainingTime, requestNotificationPermission, scheduleTimerNotification]);

  // Clear the rest timer
  const clearRestTimer = useCallback(() => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    localStorage.removeItem(REST_TIMER_KEY);
    setRestTimeRemaining(0);
    // Cancel any server-side scheduled notification
    cancelPushNotification();
  }, []);

  // Initialize timer on mount - check for existing timer
  useEffect(() => {
    const remaining = calculateRemainingTime();
    if (remaining > 0) {
      setRestTimeRemaining(remaining);

      // Schedule notification for remaining time
      scheduleTimerNotification(remaining * 1000);

      // Start interval to keep updating
      restTimerRef.current = setInterval(() => {
        const newRemaining = calculateRemainingTime();
        setRestTimeRemaining(newRemaining);

        if (newRemaining <= 0) {
          if (restTimerRef.current) {
            clearInterval(restTimerRef.current);
            restTimerRef.current = null;
          }
          localStorage.removeItem(REST_TIMER_KEY);
        }
      }, 1000);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, [calculateRemainingTime, scheduleTimerNotification]);

  // Eagerly subscribe to push on page load if permission already granted
  // This ensures the subscription exists in the DB before any timer fires
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && !pushSubscribedRef.current) {
      pushSubscribedRef.current = true;
      subscribeToPush();
    }
  }, []);

  // Handle visibility change - recalculate time when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const remaining = calculateRemainingTime();
        setRestTimeRemaining(remaining);

        if (remaining > 0 && !restTimerRef.current) {
          // Restart the interval if timer is still active
          restTimerRef.current = setInterval(() => {
            const newRemaining = calculateRemainingTime();
            setRestTimeRemaining(newRemaining);

            if (newRemaining <= 0) {
              if (restTimerRef.current) {
                clearInterval(restTimerRef.current);
                restTimerRef.current = null;
              }
              localStorage.removeItem(REST_TIMER_KEY);
            }
          }, 1000);
        } else if (remaining <= 0) {
          localStorage.removeItem(REST_TIMER_KEY);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateRemainingTime]);

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuthed(true);
      const profile = getGymProfile();
      if (profile) setProfileName(profile.name);
    }
    setIsLoaded(true);
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (!isAuthed) return;
    loadData();
  }, [isAuthed]);

  const loadData = async () => {
    try {
      setError(null);
      const [cyclesData, tmData, settingsData, supersetsData] = await Promise.all([
        fetchCycles(),
        fetchTrainingMaxes(),
        fetchExerciseSettings(),
        fetchSupersets(),
      ]);
      setCycles(cyclesData);
      setSupersetConfigs(supersetsData);

      const tmMap = new Map<string, number>();
      tmData.forEach(tm => tmMap.set(tm.exerciseId, tm.weight));
      setTrainingMaxes(tmMap);

      const settingsMap = new Map<string, ExerciseSettings>();
      settingsData.forEach(s => settingsMap.set(s.exerciseId, s));
      setExerciseSettings(settingsMap);

      // If there's an active cycle, load it and navigate directly to it
      const active = cyclesData.find(c => c.status === 'active');
      if (active) {
        const fullCycle = await fetchCycle(active.id);
        if (fullCycle) {
          setActiveCycle(fullCycle);
          setSelectedDay(getTodayDayNumber());
          setView('cycle');
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      if (err instanceof Error && err.message === 'Session expired') {
        setIsAuthed(false);
        setAuthError('Session expired. Please log in again.');
      } else {
        setError('Failed to load data. Please try again.');
      }
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const profile = await verifyPassword(password);
      if (profile) {
        setGymSession(password, profile);
        setIsAuthed(true);
        setProfileName(profile.name);
        setPassword('');
      } else {
        setAuthError('Incorrect password');
        setPassword('');
      }
    } catch {
      setAuthError('Failed to verify password');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearGymSession();
    setIsAuthed(false);
    setProfileName('');
    setCycles([]);
    setActiveCycle(null);
    setTrainingMaxes(new Map());
  };

  // Create new cycle
  const handleCreateCycle = async () => {
    try {
      const newCycle = await createCycle();
      setCycles([newCycle, ...cycles]);
      setActiveCycle(newCycle);
      setView('cycle');
    } catch (err) {
      setError('Failed to create cycle');
    }
  };

  // Select a cycle
  const handleSelectCycle = async (cycle: Cycle) => {
    try {
      // If we already have this cycle loaded with workouts, just use it
      // This prevents losing unsaved data when navigating back
      if (activeCycle && activeCycle.id === cycle.id) {
        setView('cycle');
        return;
      }

      const fullCycle = await fetchCycle(cycle.id);
      if (fullCycle) {
        setActiveCycle(fullCycle);
        setView('cycle');
      }
    } catch (err) {
      setError('Failed to load cycle');
    }
  };

  // Flush any pending saves
  const flushPendingSaves = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (currentWorkout) {
      try {
        await saveWorkoutLog(currentWorkout);
      } catch (err) {
        console.error('Error saving workout:', err);
      }
    }
  };

  // Navigate back to cycles list, flushing any pending saves first and refreshing cycles
  const handleBackToCycles = async () => {
    await flushPendingSaves();
    // Refresh cycles to get updated completion percentages
    try {
      const cyclesData = await fetchCycles();
      setCycles(cyclesData);
    } catch (err) {
      console.error('Error refreshing cycles:', err);
    }
    setView('cycles');
  };

  // Navigate back to cycle view from exercise view
  const handleBackToCycle = async () => {
    await flushPendingSaves();
    setView('cycle');
  };

  // Initialize workout for a day
  const initializeWorkout = useCallback((dayNumber: number): WorkoutLog | null => {
    if (!activeCycle) return null;

    const day = program.days.find(d => d.dayNumber === dayNumber);
    if (!day || day.exercises.length === 0) return null;

    // Check if workout already exists in cycle
    const existingWorkout = activeCycle.workouts.find(w => w.dayNumber === dayNumber);
    if (existingWorkout) {
      return existingWorkout;
    }

    // Create new workout with exercises
    const exercises: ExerciseWorkoutLog[] = day.exercises.map(exercise => {
      const tm = trainingMaxes.get(exercise.id) || 0;
      const customSettings = exerciseSettings.get(exercise.id);
      // Pass setScheme from program data if available
      const repScheme = getDefaultRepScheme(
        exercise.id,
        exercise.sets,
        exercise.reps,
        customSettings,
        exercise.setScheme
      );

      const sets: SetLog[] = repScheme.map((scheme, index) => ({
        setNumber: index + 1,
        targetReps: scheme.reps,
        targetWeight: tm > 0 ? calculateWeight(tm, scheme.percent) : 0,
        targetPercent: scheme.percent,
        actualReps: null,
        actualWeight: null,
        completed: false,
        isAmrap: scheme.isAmrap,
        setType: scheme.type,
      }));

      // Check for database superset config first, then fall back to JSON
      const dbSuperset = supersetConfigs.find(
        s => s.primaryExerciseId === exercise.id && s.dayNumber === dayNumber
      );
      const hasSuperset = dbSuperset || exercise.superset;

      let supersetSets: SetLog[] | undefined;
      let supersetName: string | undefined;
      let supersetId: string | undefined;

      if (hasSuperset) {
        const supersetTm = trainingMaxes.get(`${exercise.id}-superset`) || 0;
        const supersetSettings = exerciseSettings.get(`${exercise.id}-superset`);
        const supersetBasePercent = supersetSettings?.basePercent || 75;

        // Use database config if available, otherwise use JSON
        if (dbSuperset) {
          supersetName = dbSuperset.supersetName;
          supersetId = `${exercise.id}-superset`;
          const defaultReps = parseInt(dbSuperset.supersetReps) || 15;
          const supersetReps = supersetSettings?.targetReps ?? defaultReps;
          // Match the number of working sets (exclude warmup/burnout from main exercise)
          const workingSets = repScheme.filter(s => s.type === 'working' || !s.type);
          const numSets = supersetSettings?.targetSets ?? workingSets.length;
          supersetSets = Array.from({ length: numSets }, (_, index) => ({
            setNumber: index + 1,
            targetReps: supersetReps,
            targetWeight: supersetTm > 0 ? calculateWeight(supersetTm, supersetBasePercent) : 0,
            targetPercent: supersetBasePercent,
            actualReps: null,
            actualWeight: null,
            completed: false,
            isAmrap: index === numSets - 1,
          }));
        } else if (exercise.superset) {
          supersetName = exercise.superset;
          supersetId = `${exercise.id}-superset`;

          // Check if there's a custom superset scheme in JSON
          if (exercise.supersetScheme && exercise.supersetScheme.length > 0) {
            supersetSets = exercise.supersetScheme.map((scheme, index) => ({
              setNumber: index + 1,
              targetReps: scheme.reps,
              targetWeight: supersetTm > 0 ? calculateWeight(supersetTm, scheme.percent) : 0,
              targetPercent: scheme.percent,
              actualReps: null,
              actualWeight: null,
              completed: false,
              isAmrap: index === exercise.supersetScheme!.length - 1,
            }));
          } else {
            // Parse supersetReps if provided, otherwise default to 15
            const defaultReps = exercise.supersetReps ? parseInt(exercise.supersetReps) || 15 : 15;
            const supersetReps = supersetSettings?.targetReps ?? defaultReps;
            // Match the number of working sets (exclude warmup/burnout from main exercise)
            const workingSets = repScheme.filter(s => s.type === 'working' || !s.type);
            const numSets = supersetSettings?.targetSets ?? workingSets.length;
            supersetSets = Array.from({ length: numSets }, (_, index) => ({
              setNumber: index + 1,
              targetReps: supersetReps,
              targetWeight: supersetTm > 0 ? calculateWeight(supersetTm, supersetBasePercent) : 0,
              targetPercent: supersetBasePercent,
              actualReps: null,
              actualWeight: null,
              completed: false,
              isAmrap: index === numSets - 1,
            }));
          }
        }
      }

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        trainingMax: tm,
        sets,
        supersetId,
        supersetName,
        supersetSets,
        notes: exercise.notes,
      };
    });

    return {
      cycleId: activeCycle.id,
      workoutDate: new Date().toISOString().split('T')[0],
      dayNumber,
      dayName: day.name,
      exercises,
      completed: false,
    };
  }, [activeCycle, program.days, trainingMaxes, exerciseSettings, supersetConfigs]);

  // Initialize a flexible workout from builder selections
  const initializeFlexibleWorkout = useCallback((
    exerciseList: Array<{ id: string; name: string; equipment: string }>,
    dayType: 'rep' | 'strength',
    setCounts: Map<string, number>,
    muscleGroupNames: string[]
  ): WorkoutLog | null => {
    if (!activeCycle) return null;

    const repConfig = dayType === 'rep'
      ? { reps: 12, percent: 65, sets: 3 }
      : { reps: 5, percent: 85, sets: 5 };

    const dayNumber = getTodayDayNumber();
    const dayName = muscleGroupNames.join(' / ');

    const exercises: ExerciseWorkoutLog[] = exerciseList.map(exercise => {
      const tm = trainingMaxes.get(exercise.id) || 0;
      const customSettings = exerciseSettings.get(exercise.id);
      const numSets = setCounts.get(exercise.id) ?? repConfig.sets;
      const basePercent = customSettings?.basePercent ?? repConfig.percent;
      const targetReps = customSettings?.targetReps ?? repConfig.reps;

      const sets: SetLog[] = Array.from({ length: numSets }, (_, index) => ({
        setNumber: index + 1,
        targetReps,
        targetWeight: tm > 0 ? calculateWeight(tm, basePercent) : 0,
        targetPercent: basePercent,
        actualReps: null,
        actualWeight: null,
        completed: false,
        isAmrap: index === numSets - 1,
        setType: 'working' as SetType,
      }));

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        trainingMax: tm,
        sets,
        supersetId: undefined,
        supersetName: undefined,
        supersetSets: undefined,
        notes: undefined,
      };
    });

    return {
      cycleId: activeCycle.id,
      workoutDate: new Date().toISOString().split('T')[0],
      dayNumber,
      dayName,
      exercises,
      completed: false,
    };
  }, [activeCycle, trainingMaxes, exerciseSettings]);

  // Select a day
  const handleSelectDay = async (dayNumber: number) => {
    // Flush any pending save before switching days
    await flushPendingSaves();

    setSelectedDay(dayNumber);
    const workout = initializeWorkout(dayNumber);
    setCurrentWorkout(workout);
  };

  // Select an exercise
  const handleSelectExercise = (exercise: ExerciseWorkoutLog, index: number) => {
    setSelectedExercise(exercise);
    setSelectedExerciseIndex(index);
    setExerciseHistory(null);
    setShowExerciseHistory(false);
    setView('exercise');
  };

  // Load exercise history from previous cycle
  const handleLoadExerciseHistory = async (exerciseId: string, dayNumber: number) => {
    if (showExerciseHistory) {
      setShowExerciseHistory(false);
      return;
    }
    setIsLoadingExerciseHistory(true);
    setShowExerciseHistory(true);
    try {
      const history = await fetchExerciseHistory(exerciseId, dayNumber, activeCycle?.id);
      setExerciseHistory(history);
    } catch {
      setExerciseHistory(null);
    } finally {
      setIsLoadingExerciseHistory(false);
    }
  };

  // Save workout with debounce
  const saveWorkout = useCallback(async (workout: WorkoutLog) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Update local state immediately (optimistic update) using functional update
    // This ensures we always have the latest state and avoids stale closure issues
    setActiveCycle(prevCycle => {
      if (!prevCycle) return prevCycle;
      const updatedWorkouts = [...prevCycle.workouts];
      const existingIndex = updatedWorkouts.findIndex(w => w.dayNumber === workout.dayNumber);
      if (existingIndex >= 0) {
        updatedWorkouts[existingIndex] = workout;
      } else {
        updatedWorkouts.push(workout);
      }
      return { ...prevCycle, workouts: updatedWorkouts };
    });

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveWorkoutLog(workout);
      } catch (err) {
        console.error('Error saving workout:', err);
      } finally {
        setIsSaving(false);
      }
    }, 500);
  }, []);

  // Update a set
  const handleSetUpdate = (exerciseIndex: number, setIndex: number, field: 'actualReps' | 'actualWeight' | 'completed' | 'failed', value: number | boolean | null) => {
    if (!currentWorkout) return;

    const newWorkout = { ...currentWorkout };
    const newExercises = [...newWorkout.exercises];
    const newSets = [...newExercises[exerciseIndex].sets];

    newSets[setIndex] = { ...newSets[setIndex], [field]: value };

    // If marking as completed (pass), auto-fill with target values if not set and start rest timer
    if (field === 'completed' && value === true) {
      if (newSets[setIndex].actualReps === null) {
        newSets[setIndex].actualReps = newSets[setIndex].targetReps;
      }
      if (newSets[setIndex].actualWeight === null) {
        newSets[setIndex].actualWeight = newSets[setIndex].targetWeight;
      }
      // Clear failed status when passing
      newSets[setIndex].failed = false;
      // Start the rest timer
      startRestTimer();
    }

    // If marking as failed, also mark as completed but with failed flag
    if (field === 'failed' && value === true) {
      newSets[setIndex].completed = true;
      newSets[setIndex].failed = true;
      // Start the rest timer
      startRestTimer();
    }

    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
    newWorkout.exercises = newExercises;

    // Check if all sets are completed (passed or failed both count as completed)
    const allCompleted = newExercises.every(ex =>
      ex.sets.every(s => s.completed) &&
      (!ex.supersetSets || ex.supersetSets.every(s => s.completed))
    );
    newWorkout.completed = allCompleted;

    setCurrentWorkout(newWorkout);
    setSelectedExercise(newExercises[exerciseIndex]);
    saveWorkout(newWorkout);
  };

  // Update superset set
  const handleSupersetUpdate = (exerciseIndex: number, setIndex: number, field: 'actualReps' | 'actualWeight' | 'completed' | 'failed', value: number | boolean | null) => {
    if (!currentWorkout) return;

    const newWorkout = { ...currentWorkout };
    const newExercises = [...newWorkout.exercises];
    const newSupersetSets = [...(newExercises[exerciseIndex].supersetSets || [])];

    newSupersetSets[setIndex] = { ...newSupersetSets[setIndex], [field]: value };

    if (field === 'completed' && value === true) {
      if (newSupersetSets[setIndex].actualReps === null) {
        newSupersetSets[setIndex].actualReps = newSupersetSets[setIndex].targetReps;
      }
      if (newSupersetSets[setIndex].actualWeight === null) {
        newSupersetSets[setIndex].actualWeight = newSupersetSets[setIndex].targetWeight;
      }
      // Clear failed status when passing
      newSupersetSets[setIndex].failed = false;
      // Start the rest timer
      startRestTimer();
    }

    // If marking as failed, also mark as completed but with failed flag
    if (field === 'failed' && value === true) {
      newSupersetSets[setIndex].completed = true;
      newSupersetSets[setIndex].failed = true;
      // Start the rest timer
      startRestTimer();
    }

    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], supersetSets: newSupersetSets };
    newWorkout.exercises = newExercises;

    setCurrentWorkout(newWorkout);
    setSelectedExercise(newExercises[exerciseIndex]);
    saveWorkout(newWorkout);
  };

  // Save training max
  const handleSaveTrainingMax = async (exerciseId: string, weight: number) => {
    try {
      await saveTrainingMax(exerciseId, weight);
      // Also record in history
      await recordTMHistory(exerciseId, weight, activeCycle?.id);

      const newMap = new Map(trainingMaxes);
      newMap.set(exerciseId, weight);
      setTrainingMaxes(newMap);
      setEditingTM(null);
      setTmInput('');

      // Directly update the current workout and selected exercise with new TM
      // (initializeWorkout returns the existing workout from activeCycle which has the old TM)
      if (currentWorkout) {
        const newWorkout = { ...currentWorkout };
        const newExercises = [...newWorkout.exercises];
        const exIndex = newExercises.findIndex(e => e.exerciseId === exerciseId);
        if (exIndex >= 0) {
          const updatedExercise = { ...newExercises[exIndex], trainingMax: weight };
          // Recalculate target weights for sets that haven't been completed yet
          updatedExercise.sets = updatedExercise.sets.map(set => ({
            ...set,
            targetWeight: weight > 0 ? calculateWeight(weight, set.targetPercent) : 0,
          }));
          newExercises[exIndex] = updatedExercise;
          newWorkout.exercises = newExercises;
          setCurrentWorkout(newWorkout);
          setSelectedExercise(updatedExercise);
          saveWorkout(newWorkout);
        }
      }
    } catch (err) {
      setError('Failed to save training max');
    }
  };

  // Save exercise settings
  const handleSaveSettings = async (settings: ExerciseSettings) => {
    try {
      await saveExerciseSettings(settings);
      const newMap = new Map(exerciseSettings);
      newMap.set(settings.exerciseId, settings);
      setExerciseSettings(newMap);
      setEditingSettings(null);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  // Complete current cycle with smart progression
  const handleCompleteCycle = async () => {
    if (!activeCycle) return;
    // Guard against double-completion
    if (activeCycle.status === 'completed') {
      setError('This cycle is already completed');
      return;
    }
    try {
      // Flush any pending workout save first
      await flushPendingSaves();

      await completeCycle(activeCycle.id);

      // Smart progression: only bump TMs for exercises that should progress
      for (const workout of activeCycle.workouts) {
        for (const exercise of workout.exercises) {
          const settings = exerciseSettings.get(exercise.exerciseId);

          // Find the AMRAP set (last set)
          const amrapSet = exercise.sets.find(s => s.isAmrap);
          const amrapReps = amrapSet?.actualReps ?? null;
          const targetReps = amrapSet?.targetReps ?? 8;

          // Check if this exercise should progress (also checks for failed sets)
          const shouldProgress = shouldExerciseProgress(settings, amrapReps, targetReps, exercise.sets);

          if (shouldProgress) {
            const currentTM = trainingMaxes.get(exercise.exerciseId) || 0;
            const increment = settings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement;
            const newTM = currentTM + increment;

            // Save the new training max and record history
            await saveTrainingMax(exercise.exerciseId, newTM);
            await recordTMHistory(exercise.exerciseId, newTM, activeCycle.id, 'Cycle completion progression');
          }

          // Check superset progression separately
          if (exercise.supersetId && exercise.supersetSets) {
            const supersetSettings = exerciseSettings.get(exercise.supersetId);
            const supersetAmrapSet = exercise.supersetSets.find(s => s.isAmrap);
            const supersetAmrapReps = supersetAmrapSet?.actualReps ?? null;
            const supersetTargetReps = supersetAmrapSet?.targetReps ?? exercise.supersetSets[0]?.targetReps ?? 15;

            const supersetShouldProgress = shouldExerciseProgress(
              supersetSettings, supersetAmrapReps, supersetTargetReps, exercise.supersetSets
            );

            if (supersetShouldProgress) {
              const currentSupersetTM = trainingMaxes.get(exercise.supersetId) || 0;
              const supersetIncrement = supersetSettings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement;
              const newSupersetTM = currentSupersetTM + supersetIncrement;

              await saveTrainingMax(exercise.supersetId, newSupersetTM);
              await recordTMHistory(exercise.supersetId, newSupersetTM, activeCycle.id, 'Cycle completion progression (superset)');
            }
          }
        }
      }

      await loadData();
      setView('cycles');
    } catch (err) {
      setError('Failed to complete cycle');
    }
  };

  // Delete a cycle
  const handleDeleteCycle = async (cycleId: string) => {
    setIsDeleting(true);
    try {
      // Check if this was a completed cycle — if so, revert TM bumps
      const cycleToDelete = cycles.find(c => c.id === cycleId);
      if (cycleToDelete?.status === 'completed' && cycleToDelete.workouts) {
        for (const workout of cycleToDelete.workouts) {
          for (const exercise of workout.exercises) {
            const settings = exerciseSettings.get(exercise.exerciseId);
            const increment = settings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement;
            const currentTM = trainingMaxes.get(exercise.exerciseId) || 0;

            // Check if this exercise would have progressed
            const amrapSet = exercise.sets.find(s => s.isAmrap);
            const amrapReps = amrapSet?.actualReps ?? null;
            const targetReps = amrapSet?.targetReps ?? 8;
            const wouldHaveProgressed = shouldExerciseProgress(settings, amrapReps, targetReps, exercise.sets);

            if (wouldHaveProgressed && currentTM > 0) {
              const revertedTM = currentTM - increment;
              await saveTrainingMax(exercise.exerciseId, revertedTM);
              await recordTMHistory(exercise.exerciseId, revertedTM, undefined, 'Reverted: deleted completed cycle');
            }

            // Revert superset TM if it would have progressed
            if (exercise.supersetId && exercise.supersetSets) {
              const supersetSettings = exerciseSettings.get(exercise.supersetId);
              const supersetIncrement = supersetSettings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement;
              const currentSupersetTM = trainingMaxes.get(exercise.supersetId) || 0;

              const supersetAmrapSet = exercise.supersetSets.find(s => s.isAmrap);
              const supersetAmrapReps = supersetAmrapSet?.actualReps ?? null;
              const supersetTargetReps = supersetAmrapSet?.targetReps ?? exercise.supersetSets[0]?.targetReps ?? 15;
              const supersetWouldHaveProgressed = shouldExerciseProgress(
                supersetSettings, supersetAmrapReps, supersetTargetReps, exercise.supersetSets
              );

              if (supersetWouldHaveProgressed && currentSupersetTM > 0) {
                const revertedSupersetTM = currentSupersetTM - supersetIncrement;
                await saveTrainingMax(exercise.supersetId, revertedSupersetTM);
                await recordTMHistory(exercise.supersetId, revertedSupersetTM, undefined, 'Reverted: deleted completed cycle (superset)');
              }
            }
          }
        }
        // Clean up duplicate history entries for this cycle
        await deleteTMHistoryForCycle(cycleId);
      }

      await deleteCycle(cycleId);
      setCycles(cycles.filter(c => c.id !== cycleId));
      if (activeCycle?.id === cycleId) {
        setActiveCycle(null);
        setView('cycles');
      }
      setDeletingCycleId(null);
      await loadData();
    } catch (err) {
      setError('Failed to delete cycle');
    } finally {
      setIsDeleting(false);
    }
  };

  // Update cycle start date
  const handleUpdateStartDate = async (cycleId: string, newDate: string) => {
    try {
      await updateCycleStartDate(cycleId, newDate);
      setCycles(cycles.map(c =>
        c.id === cycleId ? { ...c, startDate: newDate } : c
      ));
      setEditingDateCycleId(null);
      setDateInput('');
    } catch (err) {
      setError('Failed to update start date');
    }
  };

  // Seed gym data
  const handleSeedGymData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedGymData();
      setSeedResult(result.message);
      // Reload data after seeding
      await loadData();
    } catch (err) {
      setSeedResult(err instanceof Error ? err.message : 'Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  // Save superset configuration
  const handleSaveSuperset = async (
    primaryExerciseId: string,
    supersetExerciseId: string,
    supersetName: string,
    dayNumber: number
  ) => {
    try {
      // Find the exercise to get equipment info
      const day = program.days.find(d => d.dayNumber === dayNumber);
      const supersetExercise = day?.exercises.find(e => e.id === supersetExerciseId);

      await saveSuperset({
        primaryExerciseId,
        supersetExerciseId,
        supersetName,
        supersetEquipment: supersetExercise?.equipment || 'dumbbell',
        supersetReps: '15',
        dayNumber,
      });

      // Reload supersets
      const supersetsData = await fetchSupersets();
      setSupersetConfigs(supersetsData);
      setEditingSuperset(null);
      setSupersetSelection('');
    } catch (err) {
      setError('Failed to save superset');
    }
  };

  // Remove superset configuration
  const handleRemoveSuperset = async (primaryExerciseId: string, dayNumber: number) => {
    try {
      await deleteSuperset(primaryExerciseId, dayNumber);
      // Reload supersets
      const supersetsData = await fetchSupersets();
      setSupersetConfigs(supersetsData);
    } catch (err) {
      setError('Failed to remove superset');
    }
  };

  // Load history for selected exercise
  const handleLoadHistory = async (exerciseId: string) => {
    setSelectedHistoryExercise(exerciseId);
    if (!exerciseId) {
      setTmHistory([]);
      return;
    }
    setIsLoadingHistory(true);
    try {
      const history = await fetchTMHistory(exerciseId);
      setTmHistory(history);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Initialize workout when navigating to cycle view from the cycles list (not from builder)
  useEffect(() => {
    if (activeCycle && view === 'cycle' && !currentWorkout) {
      const workout = initializeWorkout(selectedDay);
      if (workout) setCurrentWorkout(workout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCycle, view]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/[0.12] border-t-[#30D158] rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        {/* Stacked activity rings — Apple Fitness style logo */}
        <div className="relative mb-10" style={{ width: 96, height: 96 }}>
          <div className="absolute inset-0">
            <ActivityRing percent={82} size={96} color="#30D158" strokeWidth={8} trackOpacity={0.14} />
          </div>
          <div className="absolute" style={{ inset: 13 }}>
            <ActivityRing percent={61} size={70} color="#0A84FF" strokeWidth={7} trackOpacity={0.14} />
          </div>
          <div className="absolute" style={{ inset: 24 }}>
            <ActivityRing percent={44} size={48} color="#FF453A" strokeWidth={6} trackOpacity={0.14} />
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-white tracking-tight mb-1">Gym Tracker</h1>
        <p className="text-white/40 text-[15px] mb-10">Your personal training log</p>

        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-4 bg-[#1C1C1E] rounded-2xl text-white text-[17px] placeholder-white/25 border-0 focus:outline-none focus:ring-2 focus:ring-[#30D158]"
              autoFocus
              disabled={isAuthenticating}
            />
            {authError && (
              <p className="text-[#FF453A] text-[13px] text-center">{authError}</p>
            )}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#30D158] active:bg-[#28BD4E] active:scale-[0.98] disabled:opacity-40 text-white text-[17px] font-semibold py-4 rounded-2xl transition-all"
            >
              {isAuthenticating ? 'Verifying…' : 'Sign In'}
            </button>
          </form>
          <Link
            href="/admin"
            className="block text-center text-white/30 text-[13px] mt-5"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  // Cycles list view
  if (view === 'cycles') {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {profileName && (
                <span className="text-[13px] text-white/40">{profileName}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView('history')}
                className="text-[#0A84FF] text-[15px] font-medium"
              >
                History
              </button>
              <button
                onClick={() => setView('settings')}
                className="text-[#0A84FF] text-[15px] font-medium"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-[#FF453A] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-[#FF453A]/15 border-b border-[#FF453A]/25 px-4 py-2">
            <p className="text-[#FF453A] text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 pt-2 pb-24">
          {/* Large title */}
          <h1 className="text-[34px] font-bold text-white tracking-tight mb-6">Cycles</h1>

          {/* Create New Cycle Button */}
          <button
            onClick={handleCreateCycle}
            className="w-full bg-[#30D158] active:bg-[#28BD4E] active:scale-[0.98] text-white font-semibold text-[17px] py-4 rounded-2xl mb-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#30D158]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Start New Cycle
          </button>

          {/* Cycles List */}
          <div className="space-y-3">
            {cycles.map(cycle => {
              // Use set-level completion from API
              const completion = cycle.setCompletion ?? 0;
              const isConfirmingDelete = deletingCycleId === cycle.id;
              const isEditingDate = editingDateCycleId === cycle.id;

              return (
                <div
                  key={cycle.id}
                  className="bg-[#1C1C1E] rounded-2xl overflow-hidden"
                >
                  {isConfirmingDelete ? (
                    <div className="p-4">
                      <p className="text-white mb-3">Delete Cycle {cycle.cycleNumber}?</p>
                      <p className="text-white/40 text-sm mb-4">This will delete all workout logs for this cycle. This action cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          disabled={isDeleting}
                          className="flex-1 bg-[#FF453A] active:bg-[#D93830] disabled:opacity-40 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setDeletingCycleId(null)}
                          disabled={isDeleting}
                          className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-xl text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex-1 p-4 text-left active:bg-white/[0.04] transition-colors cursor-pointer"
                        onClick={() => handleSelectCycle(cycle)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Activity ring showing completion */}
                          <div className="flex-shrink-0 relative">
                            <ActivityRing
                              percent={completion}
                              size={52}
                              color={cycle.status === 'active' ? '#30D158' : '#8E8E93'}
                              trackOpacity={0.12}
                              strokeWidth={5}
                            />
                            {completion === 100 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="16" height="16" fill="none" stroke={cycle.status === 'active' ? '#30D158' : '#8E8E93'} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {completion < 100 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white/50">{completion}%</span>
                              </div>
                            )}
                          </div>

                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-semibold text-[17px]">Cycle {cycle.cycleNumber}</span>
                              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                                cycle.status === 'active'
                                  ? 'bg-[#30D158]/20 text-[#30D158]'
                                  : 'bg-white/[0.08] text-white/40'
                              }`}>
                                {cycle.status === 'active' ? 'Active' : 'Done'}
                              </span>
                            </div>
                            {isEditingDate ? (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="date"
                                  value={dateInput}
                                  onChange={(e) => setDateInput(e.target.value)}
                                  className="bg-[#2C2C2E] border-0 rounded-lg px-2 py-1 text-white text-xs"
                                  autoFocus
                                />
                                <button onClick={() => handleUpdateStartDate(cycle.id, dateInput)} className="text-[#30D158]">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button onClick={() => { setEditingDateCycleId(null); setDateInput(''); }} className="text-white/40">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDateCycleId(cycle.id);
                                  setDateInput(cycle.startDate);
                                }}
                                className="text-white/35 text-[13px]"
                              >
                                Started {cycle.startDate}
                              </button>
                            )}
                          </div>

                          <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeletingCycleId(cycle.id)}
                        className="px-4 text-white/40 hover:text-[#FF453A] hover:bg-[#FF453A]/10 transition-colors border-l border-white/[0.08]"
                        title="Delete cycle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {cycles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/40">No cycles yet. Start your first cycle!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Cycle detail view
  if (view === 'cycle' && activeCycle) {
    const startBuilder = () => {
      setCurrentWorkout(null);
      setBuilderStep(1);
      setSelectedMuscleGroups([]);
      setSelectedDayType(null);
      setBuilderSelectedExercises([]);
      setExerciseSetCounts(new Map());
      setView('builder');
    };

    return (
      <div className="min-h-screen bg-black">
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleBackToCycles}
              className="text-[#0A84FF] transition-colors flex items-center gap-1 text-[17px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Cycles
            </button>
            <div className="flex items-center gap-2">
              {restTimeRemaining > 0 && (
                <button
                  onClick={clearRestTimer}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    restTimeRemaining <= 10
                      ? 'bg-[#FF453A]/15 text-[#FF453A]'
                      : restTimeRemaining <= 30
                      ? 'bg-[#FFD60A]/15 text-[#FFD60A]'
                      : 'bg-[#30D158]/15 text-[#30D158]'
                  }`}
                  title="Click to dismiss"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {restTimeRemaining}s
                </button>
              )}
              {isSaving && (
                <span className="text-[#30D158] text-xs flex items-center gap-1">
                  <div className="w-3 h-3 border border-[#30D158] border-t-transparent rounded-full animate-spin" />
                  Saving
                </span>
              )}
              {activeCycle.status === 'active' && (
                <button
                  onClick={handleCompleteCycle}
                  className="text-sm bg-[#30D158] active:bg-[#25A244] text-white px-4 py-1.5 rounded-full font-medium transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-[#FF453A]/15 border-b border-[#FF453A]/25 px-4 py-2">
            <p className="text-[#FF453A] text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 pt-2 pb-24">
          {/* Active workout in progress */}
          {currentWorkout && currentWorkout.exercises.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">{currentWorkout.dayName}</h1>
                  <p className="text-white/40 text-sm mt-0.5">{currentWorkout.workoutDate}</p>
                </div>
                <button
                  onClick={startBuilder}
                  className="text-sm text-[#0A84FF] transition-colors font-medium pb-1"
                >
                  New Workout
                </button>
              </div>
              <div className="space-y-3">
                {currentWorkout.exercises.map((exercise, index) => {
                  const completedSets = exercise.sets.filter(s => s.completed).length;
                  const totalSets = exercise.sets.length;
                  const isComplete = completedSets === totalSets;
                  return (
                    <button
                      key={exercise.exerciseId}
                      onClick={() => handleSelectExercise(exercise, index)}
                      className="w-full bg-[#1C1C1E] rounded-2xl p-4 text-left active:bg-[#2C2C2E] transition-colors flex items-center gap-4"
                    >
                      {/* Activity ring */}
                      <div className="flex-shrink-0 relative">
                        <ActivityRing
                          percent={(completedSets / totalSets) * 100}
                          size={44}
                          color="#30D158"
                          trackOpacity={0.1}
                          strokeWidth={4}
                        />
                        {isComplete && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="14" height="14" fill="none" stroke="#30D158" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {!isComplete && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white/40">{completedSets}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-[17px] truncate">{exercise.exerciseName}</h3>
                        {exercise.supersetName ? (
                          <p className="text-[#FF9F0A] text-[13px] truncate mt-0.5">+ {exercise.supersetName}</p>
                        ) : (
                          <p className="text-white/35 text-[13px] mt-0.5">{completedSets} of {totalSets} sets</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* No active workout — show history + start button */
            <div className="space-y-6">
              <button
                onClick={startBuilder}
                className="w-full bg-[#30D158] active:bg-[#28BD4E] active:scale-[0.98] text-white font-semibold text-[17px] py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#30D158]/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Workout
              </button>

              {activeCycle.workouts.length > 0 && (
                <div>
                  <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">This Cycle</h3>
                  <div className="space-y-2">
                    {[...activeCycle.workouts]
                      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())
                      .map((workout) => {
                        const completion = getWorkoutCompletion(workout);
                        return (
                          <div
                            key={workout.id ?? workout.workoutDate}
                            className="bg-[#1C1C1E] rounded-2xl p-4 flex items-center gap-4"
                          >
                            <div className="flex-shrink-0 relative">
                              <ActivityRing percent={completion} size={44} color="#30D158" trackOpacity={0.1} strokeWidth={4} />
                              {completion === 100 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg width="14" height="14" fill="none" stroke="#30D158" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-[15px]">{workout.dayName}</p>
                              <p className="text-white/35 text-[12px] mt-0.5">{workout.workoutDate}</p>
                              <p className="text-white/25 text-[11px] mt-1 truncate">
                                {workout.exercises.map((e: { exerciseName: string }) => e.exerciseName).join(' · ')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Workout builder view
  if (view === 'builder' && activeCycle) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const gymExercises = require('@/data/gym-exercises.json') as {
      muscleGroups: Array<{ id: string; name: string; icon: string; exercises: Array<{ id: string; name: string; equipment: string; isCompound: boolean }> }>;
      dayTypes: Array<{ id: string; name: string; description: string; defaultSets: number }>;
    };

    const availableExercises = gymExercises.muscleGroups
      .filter(g => selectedMuscleGroups.includes(g.id))
      .flatMap(g => g.exercises);

    const fetchExerciseImage = async (exerciseName: string) => {
      if (exerciseImages.has(exerciseName)) return;
      try {
        const res = await fetch(`/api/gym/exercise-image?name=${encodeURIComponent(exerciseName)}`);
        const data = await res.json();
        setExerciseImages(prev => new Map(prev).set(exerciseName, data.imageUrl ?? null));
      } catch {
        setExerciseImages(prev => new Map(prev).set(exerciseName, null));
      }
    };

    const toggleMuscleGroup = (id: string) => {
      setSelectedMuscleGroups(prev =>
        prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
      );
    };

    const toggleExercise = (exerciseId: string, exerciseName: string) => {
      setBuilderSelectedExercises(prev => {
        if (prev.includes(exerciseId)) return prev.filter(e => e !== exerciseId);
        fetchExerciseImage(exerciseName);
        return [...prev, exerciseId];
      });
      if (!exerciseSetCounts.has(exerciseId)) {
        setExerciseSetCounts(prev => new Map(prev).set(exerciseId, 3));
      }
    };

    const startWorkout = () => {
      if (!selectedDayType || builderSelectedExercises.length === 0) return;
      const selectedExerciseDefs = availableExercises.filter(e => builderSelectedExercises.includes(e.id));
      const muscleGroupNames = gymExercises.muscleGroups
        .filter(g => selectedMuscleGroups.includes(g.id))
        .map(g => g.name);
      const workout = initializeFlexibleWorkout(selectedExerciseDefs, selectedDayType, exerciseSetCounts, muscleGroupNames);
      if (workout) {
        setCurrentWorkout(workout);
        setView('cycle');
      }
    };

    return (
      <div className="min-h-screen bg-black">
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                if (builderStep === 1) {
                  setView('cycle');
                } else {
                  setBuilderStep((builderStep - 1) as BuilderStep);
                }
              }}
              className="text-[#0A84FF] transition-colors flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {builderStep === 1 ? 'Back' : 'Previous'}
            </button>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    step <= builderStep ? 'bg-[#30D158]' : 'bg-white/[0.08]'
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 pb-32">
          {/* Step 1: Muscle group selection */}
          {builderStep === 1 && (
            <div>
              <h2 className="text-[32px] font-bold text-white mb-2 tracking-tight">What are you training?</h2>
              <p className="text-white/50 text-[17px] mb-8">Select one or more muscle groups</p>
              <div className="grid grid-cols-2 gap-3">
                {gymExercises.muscleGroups.map(group => {
                  const isSelected = selectedMuscleGroups.includes(group.id);
                  const accentColor = MUSCLE_COLORS[group.id] || '#30D158';
                  return (
                    <button
                      key={group.id}
                      onClick={() => toggleMuscleGroup(group.id)}
                      className={`p-4 rounded-2xl text-left transition-all active:scale-[0.96] relative overflow-hidden ${
                        isSelected ? 'bg-[#1C1C1E]' : 'bg-[#1C1C1E]'
                      }`}
                      style={isSelected ? { boxShadow: `0 0 0 1.5px ${accentColor}` } : {}}
                    >
                      {/* iOS app icon style */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: isSelected ? accentColor : `${accentColor}22` }}
                      >
                        <span className="text-[24px] leading-none">{group.icon}</span>
                      </div>
                      <div className="font-semibold text-white text-[15px]">{group.name}</div>
                      <div className="text-[12px] text-white/35 mt-0.5">{group.exercises.length} exercises</div>
                      {/* Selection checkmark */}
                      {isSelected && (
                        <div
                          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: accentColor }}
                        >
                          <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Day type */}
          {builderStep === 2 && (
            <div>
              <h2 className="text-[32px] font-bold text-white mb-2 tracking-tight">What kind of day?</h2>
              <p className="text-white/50 text-[17px] mb-8">Choose your training focus</p>
              <div className="space-y-3">
                {gymExercises.dayTypes.map(dayType => {
                  const isSelected = selectedDayType === dayType.id;
                  const config = dayType.id === 'rep'
                    ? { label: '3 × 12 @ 65% TM', color: 'blue' }
                    : { label: '5 × 5 @ 85% TM', color: 'orange' };
                  return (
                    <button
                      key={dayType.id}
                      onClick={() => setSelectedDayType(dayType.id as 'rep' | 'strength')}
                      className={`w-full p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#30D158]/20 border-[#30D158]'
                          : 'bg-[#1C1C1E] border-white/[0.08] hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{dayType.name}</h3>
                          <p className="text-white/50 text-sm mt-0.5">{dayType.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-[#30D158] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        dayType.id === 'rep' ? 'bg-[#0A84FF]/15 text-[#0A84FF]' : 'bg-[#FF9F0A]/15 text-[#FF9F0A]'
                      }`}>
                        Default: {config.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Exercise selection */}
          {builderStep === 3 && (
            <div>
              <h2 className="text-[32px] font-bold text-white mb-2 tracking-tight">Pick your exercises</h2>
              <p className="text-white/50 text-[17px] mb-8">
                {builderSelectedExercises.length > 0
                  ? `${builderSelectedExercises.length} selected`
                  : 'Tap to add an exercise'}
              </p>
              <div className="space-y-2">
                {availableExercises.map(exercise => {
                  const isSelected = builderSelectedExercises.includes(exercise.id);
                  const imageUrl = exerciseImages.get(exercise.name);
                  const setCount = exerciseSetCounts.get(exercise.id) ?? 3;

                  return (
                    <div
                      key={exercise.id}
                      className={`bg-[#1C1C1E] border rounded-2xl overflow-hidden transition-all ${
                        isSelected ? 'border-[#30D158]/50' : 'border-white/[0.08]'
                      }`}
                    >
                      <button
                        onClick={() => toggleExercise(exercise.id, exercise.name)}
                        className="w-full p-4 text-left flex items-center gap-3"
                      >
                        {/* Exercise image / placeholder */}
                        <div className="w-14 h-14 bg-white/[0.05] rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{exercise.name}</p>
                          <p className="text-white/40 text-xs capitalize">{exercise.equipment}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-[#30D158] border-[#30D158]' : 'border-white/[0.12]'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* Set count picker — shown only when selected */}
                      {isSelected && (
                        <div className="px-4 pb-4 flex items-center gap-3">
                          <span className="text-white/50 text-sm">Sets:</span>
                          {[1, 2, 3, 4].map(n => (
                            <button
                              key={n}
                              onClick={() => setExerciseSetCounts(prev => new Map(prev).set(exercise.id, n))}
                              className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${
                                setCount === n
                                  ? 'bg-[#30D158] text-white'
                                  : 'bg-white/[0.08] text-white/50 hover:bg-white/20'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* Bottom action button */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-black to-transparent">
          {builderStep < 3 ? (
            <button
              onClick={() => {
                if (builderStep === 1 && selectedMuscleGroups.length === 0) return;
                if (builderStep === 2 && !selectedDayType) return;
                setBuilderStep((builderStep + 1) as BuilderStep);
              }}
              disabled={
                (builderStep === 1 && selectedMuscleGroups.length === 0) ||
                (builderStep === 2 && !selectedDayType)
              }
              className="w-full bg-[#30D158] active:bg-[#28BD4E] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-[17px] py-4 rounded-2xl transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={startWorkout}
              disabled={builderSelectedExercises.length === 0}
              className="w-full bg-[#30D158] active:bg-[#28BD4E] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-[17px] py-4 rounded-2xl transition-all"
            >
              {builderSelectedExercises.length === 0
                ? 'Select at least one exercise'
                : `Start Workout (${builderSelectedExercises.length} exercise${builderSelectedExercises.length !== 1 ? 's' : ''})`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Exercise detail view
  if (view === 'exercise' && selectedExercise && currentWorkout) {
    const exercise = selectedExercise;
    // Notes come from the workout log itself (set during initializeFlexibleWorkout or legacy program)
    const programExercise = { notes: exercise.notes ?? null };

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleBackToCycle}
              className="text-[#0A84FF] transition-colors flex items-center gap-1 text-[17px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Workout
            </button>
            <div className="flex items-center gap-3">
              {/* Rest Timer */}
              {restTimeRemaining > 0 && (
                <button
                  onClick={clearRestTimer}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    restTimeRemaining <= 10
                      ? 'bg-[#FF453A]/15 text-[#FF453A]'
                      : restTimeRemaining <= 30
                      ? 'bg-[#FFD60A]/15 text-[#FFD60A]'
                      : 'bg-[#30D158]/15 text-[#30D158]'
                  }`}
                  title="Click to dismiss"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {restTimeRemaining}s
                </button>
              )}
              {isSaving && (
                <span className="text-[#30D158] text-xs flex items-center gap-1">
                  <div className="w-3 h-3 border border-[#30D158] border-t-transparent rounded-full animate-spin" />
                  Saving
                </span>
              )}
            </div>
          </div>
        </header>
        {/* Large title for exercise */}
        <div className="px-4 pt-5 pb-1">
          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">{exercise.exerciseName}</h1>
          {programExercise?.notes && (
            <p className="text-white/40 text-sm mt-1">{programExercise.notes}</p>
          )}
        </div>

        {/* Prominent rest timer banner */}
        {restTimeRemaining > 0 && (
          <div
            className="mx-4 mt-3 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{
              backgroundColor: restTimeRemaining <= 10 ? 'rgba(255,69,58,0.12)' : restTimeRemaining <= 30 ? 'rgba(255,214,10,0.08)' : 'rgba(48,209,88,0.08)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: restTimeRemaining <= 10 ? '#FF453A' : restTimeRemaining <= 30 ? '#FFD60A' : '#30D158' }}
              />
              <span className="text-white/60 text-[14px] font-medium">Rest</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-[28px] font-bold tracking-tight tabular-nums"
                style={{ color: restTimeRemaining <= 10 ? '#FF453A' : restTimeRemaining <= 30 ? '#FFD60A' : '#30D158' }}
              >
                {restTimeRemaining}s
              </span>
              <button
                onClick={clearRestTimer}
                className="text-white/35 text-[13px] font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <main className="px-4 pt-4 pb-24">
          {/* Training Max — Hero display */}
          <div className="text-center mb-6 py-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Training Max</p>
            {editingTM === exercise.exerciseId ? (
              <div className="flex items-center justify-center gap-3">
                <input
                  type="number"
                  value={tmInput}
                  onChange={(e) => setTmInput(e.target.value)}
                  className="w-32 bg-[#2C2C2E] rounded-2xl px-4 py-3 text-white text-2xl text-center font-bold border-0 focus:outline-none focus:ring-2 focus:ring-[#30D158]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTrainingMax(exercise.exerciseId, parseFloat(tmInput));
                    if (e.key === 'Escape') { setEditingTM(null); setTmInput(''); }
                  }}
                />
                <button
                  onClick={() => handleSaveTrainingMax(exercise.exerciseId, parseFloat(tmInput))}
                  className="w-11 h-11 bg-[#30D158] rounded-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => { setEditingTM(null); setTmInput(''); }}
                  className="w-11 h-11 bg-white/[0.08] rounded-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingTM(exercise.exerciseId);
                  setTmInput(exercise.trainingMax.toString());
                }}
                className="group"
              >
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-[56px] font-bold text-white leading-none tracking-tight">
                    {exercise.trainingMax > 0 ? exercise.trainingMax : '—'}
                  </span>
                  {exercise.trainingMax > 0 && (
                    <span className="text-[24px] font-semibold text-white/40">lbs</span>
                  )}
                </div>
                <p className="text-white/30 text-xs mt-2 group-active:text-[#0A84FF] transition-colors">
                  {exercise.trainingMax > 0 ? 'Tap to edit' : 'Tap to set training max'}
                </p>
              </button>
            )}
          </div>

          {/* History Button */}
          <button
            onClick={() => handleLoadExerciseHistory(exercise.exerciseId, selectedDay)}
            className={`w-full mb-6 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-colors ${
              showExerciseHistory
                ? 'bg-[#0A84FF]/15 border-[#0A84FF]/40 text-[#0A84FF]'
                : 'bg-[#1C1C1E] border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.12]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showExerciseHistory ? 'Hide Previous Performance' : 'Previous Performance'}
          </button>

          {/* Exercise History Panel */}
          {showExerciseHistory && (
            <div className="mb-6 bg-[#1C1C1E] border border-[#0A84FF]/25 rounded-2xl p-4">
              {isLoadingExerciseHistory ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-[#0A84FF]/25 border-t-[#0A84FF] rounded-full animate-spin" />
                  <span className="text-white/50 text-sm ml-2">Loading history...</span>
                </div>
              ) : exerciseHistory ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#0A84FF] text-sm font-medium">
                        Cycle {exerciseHistory.cycleNumber}
                      </span>
                      {exerciseHistory.trainingMax != null && exerciseHistory.trainingMax > 0 && (
                        <span className="text-white/50 text-xs">
                          TM: {exerciseHistory.trainingMax} lbs
                        </span>
                      )}
                    </div>
                    <span className="text-white/40 text-xs">
                      {new Date(exerciseHistory.workoutDate + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {exerciseHistory.sets.map((set, i) => {
                      const isSkipped = !set.completed;
                      const isFailed = set.failed || isSkipped;
                      return (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                          isFailed ? 'bg-[#FF453A]/10 border border-red-500/20' : 'bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white/40 text-xs w-10">Set {set.setNumber}</span>
                          {isSkipped ? (
                            <span className="text-xs bg-[#FF453A]/15 text-[#FF453A] px-1.5 py-0.5 rounded">SKIP</span>
                          ) : set.failed ? (
                            <span className="text-xs bg-[#FF453A]/15 text-[#FF453A] px-1.5 py-0.5 rounded">FAIL</span>
                          ) : (
                            <span className="text-xs bg-[#30D158]/20 text-[#30D158] px-1.5 py-0.5 rounded">PASS</span>
                          )}
                          {set.isAmrap && (
                            <span className="text-xs bg-[#FF9F0A]/15 text-[#FF9F0A] px-1.5 py-0.5 rounded">AMRAP</span>
                          )}
                        </div>
                        <span className="text-white text-sm">
                          {isSkipped ? 0 : (set.actualReps ?? set.targetReps)} reps @ {isSkipped ? 0 : (set.actualWeight ?? set.targetWeight)} lbs
                        </span>
                      </div>
                      );
                    })}
                    {exerciseHistory.sets.length === 0 && (
                      <p className="text-white/40 text-sm text-center py-2">No sets recorded</p>
                    )}
                  </div>
                  {/* Superset history */}
                  {exerciseHistory.supersetName && exerciseHistory.supersetSets && exerciseHistory.supersetSets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08]">
                      <span className="text-[#FF9F0A] text-xs font-medium block mb-2">
                        Superset: {exerciseHistory.supersetName}
                      </span>
                      <div className="space-y-2">
                        {exerciseHistory.supersetSets.map((set, i) => {
                          const isSkipped = !set.completed;
                          const isFailed = set.failed || isSkipped;
                          return (
                          <div
                            key={i}
                            className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                              isFailed ? 'bg-[#FF453A]/10 border border-red-500/20' : 'bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-white/40 text-xs w-10">Set {set.setNumber}</span>
                              {isSkipped ? (
                                <span className="text-xs bg-[#FF453A]/15 text-[#FF453A] px-1.5 py-0.5 rounded">SKIP</span>
                              ) : set.failed ? (
                                <span className="text-xs bg-[#FF453A]/15 text-[#FF453A] px-1.5 py-0.5 rounded">FAIL</span>
                              ) : (
                                <span className="text-xs bg-[#30D158]/20 text-[#30D158] px-1.5 py-0.5 rounded">PASS</span>
                              )}
                            </div>
                            <span className="text-white text-sm">
                              {isSkipped ? 0 : (set.actualReps ?? set.targetReps)} reps @ {isSkipped ? 0 : (set.actualWeight ?? set.targetWeight)} lbs
                            </span>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-white/40 text-sm text-center py-4">No previous data found for this exercise</p>
              )}
            </div>
          )}

          {/* Working Sets — iOS table view style */}
          <div className="mb-6">
            {/* Column headers */}
            <div className="flex items-center gap-2 px-1 mb-2">
              <div className="w-8 flex-shrink-0" />
              <div className="w-20 flex-shrink-0 text-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest">Target</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest">Reps</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest">lbs</span>
              </div>
              <div className="w-[88px] flex-shrink-0" />
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
              {exercise.sets.map((set, setIndex) => {
                const setType = set.setType || 'working';
                const isWarmup = setType === 'warmup';
                const isBurnout = setType === 'burnout' || setType === 'dropset';
                const setColor = set.failed
                  ? '#FF453A'
                  : set.completed
                  ? isWarmup ? '#0A84FF' : isBurnout ? '#BF5AF2' : '#30D158'
                  : undefined;

                return (
                <div
                  key={set.setNumber}
                  className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                    setIndex > 0 ? 'border-t border-white/[0.06]' : ''
                  } ${set.failed ? 'bg-[#FF453A]/[0.05]' : set.completed ? 'bg-[#30D158]/[0.04]' : ''}`}
                >
                  {/* Set number + type badge */}
                  <div className="w-8 flex-shrink-0 flex flex-col items-center">
                    <span className="text-sm font-bold" style={{ color: setColor ?? 'rgba(255,255,255,0.35)' }}>
                      {set.setNumber}
                    </span>
                    {isWarmup && (
                      <span className="text-[9px] text-[#0A84FF] leading-tight">WU</span>
                    )}
                    {set.isAmrap && !set.failed && (
                      <span className="text-[9px] text-[#FF9F0A] leading-tight">+</span>
                    )}
                  </div>

                  {/* Target */}
                  <div className="w-20 flex-shrink-0 text-center">
                    <span className="text-white/30 text-xs">{set.targetReps}×{set.targetWeight}</span>
                  </div>

                  {/* Reps input */}
                  <div className="flex-1">
                    <input
                      type="number"
                      value={set.actualReps ?? ''}
                      onChange={(e) => handleSetUpdate(
                        selectedExerciseIndex,
                        setIndex,
                        'actualReps',
                        e.target.value ? parseInt(e.target.value) : null
                      )}
                      placeholder={set.targetReps.toString()}
                      className="w-full bg-[#2C2C2E] rounded-xl px-2 py-2.5 text-white text-center text-[17px] font-semibold border-0 focus:outline-none focus:ring-1 focus:ring-[#30D158]"
                    />
                  </div>

                  {/* Weight input */}
                  <div className="flex-1">
                    <input
                      type="number"
                      value={set.actualWeight ?? ''}
                      onChange={(e) => handleSetUpdate(
                        selectedExerciseIndex,
                        setIndex,
                        'actualWeight',
                        e.target.value ? parseFloat(e.target.value) : null
                      )}
                      placeholder={set.targetWeight.toString()}
                      className="w-full bg-[#2C2C2E] rounded-xl px-2 py-2.5 text-white text-center text-[17px] font-semibold border-0 focus:outline-none focus:ring-1 focus:ring-[#30D158]"
                    />
                  </div>

                  {/* Pass / Fail */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleSetUpdate(
                        selectedExerciseIndex,
                        setIndex,
                        'completed',
                        !set.completed || !!set.failed
                      )}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        set.completed && !set.failed
                          ? isWarmup ? 'bg-[#0A84FF]' : isBurnout ? 'bg-[#BF5AF2]' : 'bg-[#30D158]'
                          : 'bg-white/[0.08]'
                      }`}
                    >
                      <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSetUpdate(
                        selectedExerciseIndex,
                        setIndex,
                        'failed',
                        !set.failed
                      )}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        set.failed ? 'bg-[#FF453A]' : 'bg-white/[0.08]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          {/* Superset if exists */}
          {exercise.supersetName && exercise.supersetSets && (
            <div>
              {/* Superset header with TM */}
              <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF9F0A] text-sm font-medium">Superset:</span>
                    <span className="text-white font-medium">{exercise.supersetName}</span>
                  </div>
                  {exercise.supersetId && (() => {
                    const supersetTm = trainingMaxes.get(exercise.supersetId) || 0;
                    const isEditingSupersetTM = editingTM === exercise.supersetId;
                    return isEditingSupersetTM ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tmInput}
                          onChange={(e) => setTmInput(e.target.value)}
                          className="w-24 bg-black border border-[#FF9F0A]/25 rounded px-2 py-1 text-white text-right"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTrainingMax(exercise.supersetId!, parseFloat(tmInput))}
                          className="text-[#FF9F0A] hover:text-[#FFB340]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setEditingTM(null); setTmInput(''); }}
                          className="text-white/50 hover:text-white/70"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTM(exercise.supersetId!);
                          setTmInput(supersetTm.toString());
                        }}
                        className="text-[#FF9F0A] font-bold hover:text-[#FFB340] transition-colors"
                      >
                        {supersetTm > 0 ? `TM: ${supersetTm} lbs` : 'Set TM'}
                      </button>
                    );
                  })()}
                </div>
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
                {exercise.supersetSets.map((set, setIndex) => (
                  <div
                    key={set.setNumber}
                    className={`flex items-center gap-2 px-4 py-3 ${
                      setIndex > 0 ? 'border-t border-white/[0.06]' : ''
                    } ${set.failed ? 'bg-[#FF453A]/[0.05]' : set.completed ? 'bg-[#FF9F0A]/[0.04]' : ''}`}
                  >
                    <div className="w-8 flex-shrink-0 text-center">
                      <span className={`text-sm font-bold ${set.failed ? 'text-[#FF453A]' : set.completed ? 'text-[#FF9F0A]' : 'text-white/35'}`}>
                        {set.setNumber}
                      </span>
                    </div>
                    <div className="w-20 flex-shrink-0 text-center">
                      <span className="text-white/30 text-xs">{set.targetReps}×{set.targetWeight}</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.actualReps ?? ''}
                        onChange={(e) => handleSupersetUpdate(
                          selectedExerciseIndex,
                          setIndex,
                          'actualReps',
                          e.target.value ? parseInt(e.target.value) : null
                        )}
                        placeholder={set.targetReps.toString()}
                        className="w-full bg-[#2C2C2E] rounded-xl px-2 py-2.5 text-white text-center text-[17px] font-semibold border-0 focus:outline-none focus:ring-1 focus:ring-[#FF9F0A]"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.actualWeight ?? ''}
                        onChange={(e) => handleSupersetUpdate(
                          selectedExerciseIndex,
                          setIndex,
                          'actualWeight',
                          e.target.value ? parseFloat(e.target.value) : null
                        )}
                        placeholder={set.targetWeight.toString()}
                        className="w-full bg-[#2C2C2E] rounded-xl px-2 py-2.5 text-white text-center text-[17px] font-semibold border-0 focus:outline-none focus:ring-1 focus:ring-[#FF9F0A]"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleSupersetUpdate(selectedExerciseIndex, setIndex, 'completed', !set.completed || !!set.failed)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${set.completed && !set.failed ? 'bg-[#FF9F0A]' : 'bg-white/[0.08]'}`}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSupersetUpdate(selectedExerciseIndex, setIndex, 'failed', !set.failed)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${set.failed ? 'bg-[#FF453A]' : 'bg-white/[0.08]'}`}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Settings view (Program Editor)
  if (view === 'settings') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const gymExercisesData = require('@/data/gym-exercises.json') as {
      muscleGroups: Array<{ id: string; name: string; icon: string; exercises: Array<{ id: string; name: string; equipment: string }> }>;
    };

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setView('cycles')}
                className="text-[#0A84FF] transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-[17px] font-semibold text-white">Settings</h1>
            <p className="text-white/40 text-sm">Edit training maxes, supersets, and progression</p>
          </div>
        </header>

        {error && (
          <div className="bg-[#FF453A]/15 border-b border-[#FF453A]/25 px-4 py-2">
            <p className="text-[#FF453A] text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 pt-2 pb-24">
          <h1 className="text-[34px] font-bold text-white tracking-tight mb-6">Settings</h1>
          {/* Seed Data Button */}
          <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Initial Data Setup</h3>
            <p className="text-white/40 text-sm mb-3">
              Load your training maxes and exercise settings. This will overwrite existing values.
            </p>
            <button
              onClick={handleSeedGymData}
              disabled={isSeeding}
              className="w-full bg-[#BF5AF2] active:bg-[#A044D4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {isSeeding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Load My Training Data
                </>
              )}
            </button>
            {seedResult && (
              <p className={`text-sm mt-2 ${seedResult.includes('Failed') ? 'text-[#FF453A]' : 'text-[#30D158]'}`}>
                {seedResult}
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/25 rounded-2xl p-4 mb-6">
            <h3 className="text-[#0A84FF] font-medium text-sm mb-2">Quick Reference</h3>
            <ul className="text-white/50 text-xs space-y-1">
              <li>• <span className="text-white">Training Max</span>: Base weight for calculating sets</li>
              <li>• <span className="text-white">Superset</span>: Pair exercises to perform back-to-back</li>
              <li>• <span className="text-white">TM Bump</span>: Weight added after completing a cycle</li>
            </ul>
          </div>

          {/* Exercise list by muscle group */}
          <div className="space-y-3">
            {gymExercisesData.muscleGroups.map((group, groupIndex) => {
              const isExpanded = expandedSettingsDays.has(groupIndex);
              const toggleGroup = () => {
                setExpandedSettingsDays(prev => {
                  const next = new Set(prev);
                  if (next.has(groupIndex)) {
                    next.delete(groupIndex);
                  } else {
                    next.add(groupIndex);
                  }
                  return next;
                });
              };

              return (
              <div key={group.id} className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
                <button
                  onClick={toggleGroup}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{group.icon}</span>
                    <h2 className="text-white font-medium">{group.name}</h2>
                    <span className="text-white/40 text-sm">({group.exercises.length} exercises)</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                <div className="border-t border-white/[0.05] px-4 pt-4 pb-2 space-y-3">
                  {group.exercises.map(exercise => {
                    const settings = exerciseSettings.get(exercise.id);
                    const tm = trainingMaxes.get(exercise.id) || 0;
                    const isEditing = editingSettings?.exerciseId === exercise.id;
                    const isEditingTM = editingTM === exercise.id;

                    return (
                      <div
                        key={exercise.id}
                        className="bg-black/20 rounded-2xl overflow-hidden border border-white/[0.05]"
                      >
                        {/* Exercise header */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{exercise.name}</h3>
                              <p className="text-white/40 text-xs capitalize">{exercise.equipment}</p>
                            </div>
                            <div className="text-right ml-3">
                              {isEditingTM ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={tmInput}
                                    onChange={(e) => setTmInput(e.target.value)}
                                    className="w-20 bg-black border border-[#30D158]/40 rounded px-2 py-1 text-white text-right text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveTrainingMax(exercise.id, parseFloat(tmInput));
                                      } else if (e.key === 'Escape') {
                                        setEditingTM(null);
                                        setTmInput('');
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleSaveTrainingMax(exercise.id, parseFloat(tmInput))}
                                    className="text-[#30D158] hover:text-[#57E57A]"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => { setEditingTM(null); setTmInput(''); }}
                                    className="text-white/50 hover:text-white/70"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingTM(exercise.id);
                                    setTmInput(tm.toString());
                                  }}
                                  className="group"
                                >
                                  <div className="text-[#30D158] font-bold group-hover:text-[#57E57A] transition-colors">
                                    {tm > 0 ? `${tm} lbs` : 'Set TM'}
                                  </div>
                                  <div className="text-white/40 text-xs group-hover:text-white/50">
                                    Training Max
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Settings tags */}
                          <div className="flex flex-wrap gap-2 text-xs mt-3">
                            {(settings?.targetSets || settings?.targetReps) && (
                              <span className="bg-[#FFD60A]/15 text-[#FFD60A] px-2 py-1 rounded">
                                {settings?.targetSets ?? '—'}x{settings?.targetReps ?? '—'}
                              </span>
                            )}
                            <span className="bg-[#3A3A3C]/50 text-white/70 px-2 py-1 rounded">
                              Base: {settings?.basePercent ?? DEFAULT_EXERCISE_SETTINGS.basePercent}%
                            </span>
                            <span className="bg-[#3A3A3C]/50 text-white/70 px-2 py-1 rounded">
                              TM +{settings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement} lbs
                            </span>
                            {settings?.autoProgress === false && (
                              <span className="bg-[#FF453A]/15 text-[#FF453A] px-2 py-1 rounded">
                                No auto-progress
                              </span>
                            )}
                          </div>

                          {/* Edit progression button */}
                          <button
                            onClick={() => setEditingSettings(settings || {
                              exerciseId: exercise.id,
                              ...DEFAULT_EXERCISE_SETTINGS
                            })}
                            className="text-xs text-[#0A84FF] hover:text-[#3D9BFF] mt-2"
                          >
                            {isEditing ? 'Editing...' : 'Edit Progression Settings'}
                          </button>
                        </div>

                        {/* Edit form */}
                        {isEditing && editingSettings && (
                          <div className="border-t border-white/[0.08] bg-black p-4 space-y-4">
                            {/* Sets/Reps Override */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-white/50 text-xs block mb-1">Sets override</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={editingSettings.targetSets ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetSets: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder="default"
                                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-white/50 text-xs block mb-1">Reps override</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={editingSettings.targetReps ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetReps: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder="default"
                                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                            </div>

                            {/* Percentage Settings */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-white/50 text-xs block mb-1">Base Percentage (%)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.basePercent}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    basePercent: parseFloat(e.target.value) || 75
                                  })}
                                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-white/50 text-xs block mb-1">TM Bump (lbs)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.tmIncrement}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    tmIncrement: parseFloat(e.target.value) || 5
                                  })}
                                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingSettings.autoProgress}
                                onChange={(e) => setEditingSettings({
                                  ...editingSettings,
                                  autoProgress: e.target.checked
                                })}
                                className="w-4 h-4 rounded bg-[#3A3A3C] border-transparent text-[#30D158]"
                              />
                              <span className="text-white/70 text-sm">Auto-progress TM on cycle complete</span>
                            </label>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveSettings(editingSettings)}
                                className="flex-1 bg-[#30D158] active:bg-[#25A244] text-white py-2 rounded-xl text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSettings(null)}
                                className="px-4 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-xl text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
                )}
              </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // History view
  if (view === 'history') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const gymExercisesForHistory = require('@/data/gym-exercises.json') as {
      muscleGroups: Array<{ id: string; name: string; exercises: Array<{ id: string; name: string }> }>;
    };
    const allExercises: { id: string; name: string; dayName: string }[] = [];
    gymExercisesForHistory.muscleGroups.forEach(group => {
      group.exercises.forEach(ex => {
        allExercises.push({ id: ex.id, name: ex.name, dayName: group.name });
      });
    });

    // Get selected exercise info
    const selectedExInfo = allExercises.find(e => e.id === selectedHistoryExercise);

    // Calculate chart dimensions
    const chartWidth = 100; // percentage
    const chartHeight = 200;
    const sortedHistory = [...tmHistory].sort((a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );

    let minWeight = 0;
    let maxWeight = 100;
    if (sortedHistory.length > 0) {
      const weights = sortedHistory.map(h => h.weight);
      minWeight = Math.floor(Math.min(...weights) * 0.9);
      maxWeight = Math.ceil(Math.max(...weights) * 1.1);
    }

    // Generate chart points
    const chartPoints = sortedHistory.map((entry, index) => {
      const x = sortedHistory.length > 1
        ? (index / (sortedHistory.length - 1)) * 100
        : 50;
      const y = maxWeight > minWeight
        ? 100 - ((entry.weight - minWeight) / (maxWeight - minWeight)) * 100
        : 50;
      return { x, y, weight: entry.weight, date: entry.recordedAt };
    });

    const pathD = chartPoints.length > 1
      ? chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      : '';

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/80 border-b border-white/[0.06] sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setView('cycles')}
                className="text-[#0A84FF] transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-[17px] font-semibold text-white">TM History</h1>
            <p className="text-white/40 text-sm">Track your progression over time</p>
          </div>
        </header>

        {error && (
          <div className="bg-[#FF453A]/15 border-b border-[#FF453A]/25 px-4 py-2">
            <p className="text-[#FF453A] text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 pt-2 pb-24">
          <h1 className="text-[34px] font-bold text-white tracking-tight mb-6">TM History</h1>
          {/* Exercise selector */}
          <div className="mb-6">
            <label className="text-white/50 text-sm block mb-2">Select Exercise</label>
            <select
              value={selectedHistoryExercise}
              onChange={(e) => handleLoadHistory(e.target.value)}
              className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white border-0"
            >
              <option value="">Choose an exercise...</option>
              {allExercises.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} - {ex.dayName}
                </option>
              ))}
            </select>
          </div>

          {isLoadingHistory && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-white/[0.12] border-t-[#30D158] rounded-full animate-spin" />
            </div>
          )}

          {selectedHistoryExercise && !isLoadingHistory && (
            <>
              {/* Chart */}
              <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-6">
                <h3 className="text-white font-medium mb-1">Training Max Progression</h3>
                <p className="text-[#30D158] text-sm mb-4">{selectedExInfo?.name}</p>

                {sortedHistory.length > 0 ? (
                  <div className="relative" style={{ height: chartHeight }}>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-white/40 text-xs">
                      <span>{maxWeight}</span>
                      <span>{Math.round((maxWeight + minWeight) / 2)}</span>
                      <span>{minWeight}</span>
                    </div>

                    {/* Chart area */}
                    <div className="ml-14 h-full relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="border-b border-white/5" />
                        <div className="border-b border-white/5" />
                        <div className="border-b border-white/5" />
                      </div>

                      {/* Line chart */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {/* Line */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#30D158"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                        {/* Dots */}
                        {chartPoints.map((p, i) => (
                          <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill="#30D158"
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    {sortedHistory.length > 0 && (
                      <div className="ml-14 mt-2 flex justify-between text-white/40 text-xs">
                        <span>
                          {new Date(sortedHistory[0].recordedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                        </span>
                        {sortedHistory.length > 1 && (
                          <span>
                            {new Date(sortedHistory[sortedHistory.length - 1].recordedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-white/40">
                    No history recorded yet
                  </div>
                )}
              </div>

              {/* History list */}
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/[0.08]">
                  <h3 className="text-white font-medium">History</h3>
                </div>
                {sortedHistory.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {[...sortedHistory].reverse().map((entry) => (
                      <div key={entry.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-white/50 text-sm">
                            {new Date(entry.recordedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#30D158] font-bold">{entry.weight} lbs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-white/40">
                    No history recorded yet. Update your training max to start tracking.
                  </div>
                )}
              </div>
            </>
          )}

          {!selectedHistoryExercise && !isLoadingHistory && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-white/40">Select an exercise to view its history</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/40">Loading...</p>
    </div>
  );
}
