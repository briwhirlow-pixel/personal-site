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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-[#1a1a24] rounded-2xl p-8 shadow-xl border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white">Gym Tracker</h1>
              <p className="text-gray-400 text-sm mt-1">Enter password to access</p>
            </div>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                autoFocus
                disabled={isAuthenticating}
              />
              {authError && (
                <p className="text-red-400 text-sm mb-4 text-center">{authError}</p>
              )}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isAuthenticating ? 'Verifying...' : 'Enter'}
              </button>
            </form>

            <Link
              href="/admin"
              className="block text-center text-gray-500 hover:text-gray-400 text-sm mt-4 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cycles list view
  if (view === 'cycles') {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Manage Cycles</h1>
              {profileName && (
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{profileName}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('history')}
                className="text-gray-500 hover:text-white transition-colors"
                title="TM History"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('settings')}
                className="text-gray-500 hover:text-white transition-colors"
                title="Program Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              <Link href="/admin" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-600/20 border-b border-red-600/30 px-4 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 py-6 pb-24">
          {/* Create New Cycle Button */}
          <button
            onClick={handleCreateCycle}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-xl mb-6 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                  className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden"
                >
                  {isConfirmingDelete ? (
                    <div className="p-4">
                      <p className="text-white mb-3">Delete Cycle {cycle.cycleNumber}?</p>
                      <p className="text-gray-500 text-sm mb-4">This will delete all workout logs for this cycle. This action cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          disabled={isDeleting}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setDeletingCycleId(null)}
                          disabled={isDeleting}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex-1 p-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => handleSelectCycle(cycle)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Cycle {cycle.cycleNumber}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cycle.status === 'active'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-gray-600/20 text-gray-400'
                          }`}>
                            {cycle.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          {isEditingDate ? (
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className="bg-[#0a0a0f] border border-green-500/50 rounded px-2 py-1 text-white text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdateStartDate(cycle.id, dateInput)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDateCycleId(null);
                                  setDateInput('');
                                }}
                                className="text-gray-400 hover:text-gray-300"
                              >
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
                              className="text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                              title="Click to edit start date"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Started {cycle.startDate}
                            </button>
                          )}
                          <span className="text-gray-400">{completion}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setDeletingCycleId(cycle.id)}
                        className="px-4 text-gray-500 hover:text-red-400 hover:bg-red-600/10 transition-colors border-l border-white/10"
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
                <p className="text-gray-500">No cycles yet. Start your first cycle!</p>
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
      <div className="min-h-screen bg-[#0a0a0f]">
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToCycles}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
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
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      restTimeRemaining <= 10
                        ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                        : restTimeRemaining <= 30
                        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50'
                        : 'bg-green-600/20 text-green-400 border border-green-500/50'
                    }`}
                    title="Click to dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {restTimeRemaining}s
                  </button>
                )}
                {isSaving && (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                    Saving
                  </span>
                )}
                {activeCycle.status === 'active' && (
                  <button
                    onClick={handleCompleteCycle}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Complete Cycle
                  </button>
                )}
              </div>
            </div>
            <h1 className="text-xl font-bold text-white mt-3">Cycle {activeCycle.cycleNumber}</h1>
          </div>
        </header>

        {error && (
          <div className="bg-red-600/20 border-b border-red-600/30 px-4 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 py-4 pb-24">
          {/* Active workout in progress */}
          {currentWorkout && currentWorkout.exercises.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">{currentWorkout.dayName}</h2>
                  <p className="text-gray-500 text-sm">{currentWorkout.workoutDate}</p>
                </div>
                <button
                  onClick={startBuilder}
                  className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
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
                      className={`w-full bg-[#1a1a24] border rounded-xl p-4 text-left transition-colors ${
                        isComplete ? 'border-green-500/50' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{exercise.exerciseName}</h3>
                          {exercise.supersetName && (
                            <p className="text-orange-400 text-sm truncate">+ {exercise.supersetName}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-3">
                          <span className="text-gray-400 text-sm">{completedSets}/{totalSets}</span>
                          {isComplete ? (
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-green-600'}`}
                          style={{ width: `${(completedSets / totalSets) * 100}%` }}
                        />
                      </div>
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Workout
              </button>

              {activeCycle.workouts.length > 0 && (
                <div>
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">This Cycle</h3>
                  <div className="space-y-2">
                    {[...activeCycle.workouts]
                      .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())
                      .map((workout) => {
                        const completion = getWorkoutCompletion(workout);
                        return (
                          <div
                            key={workout.id ?? workout.workoutDate}
                            className="bg-[#1a1a24] border border-white/10 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-white font-medium">{workout.dayName}</p>
                                <p className="text-gray-500 text-xs">{workout.workoutDate}</p>
                              </div>
                              <span className={`text-sm font-medium ${completion === 100 ? 'text-green-400' : 'text-gray-400'}`}>
                                {completion}%
                              </span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                              {workout.exercises.map(e => e.exerciseName).join(', ')}
                            </p>
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
      <div className="min-h-screen bg-[#0a0a0f]">
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                if (builderStep === 1) {
                  setView('cycle');
                } else {
                  setBuilderStep((builderStep - 1) as BuilderStep);
                }
              }}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
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
                    step <= builderStep ? 'bg-green-500' : 'bg-white/10'
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
              <h2 className="text-2xl font-bold text-white mb-1">What are you training?</h2>
              <p className="text-gray-400 mb-6">Select one or more muscle groups</p>
              <div className="grid grid-cols-2 gap-3">
                {gymExercises.muscleGroups.map(group => {
                  const isSelected = selectedMuscleGroups.includes(group.id);
                  return (
                    <button
                      key={group.id}
                      onClick={() => toggleMuscleGroup(group.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-green-600/20 border-green-500 text-white'
                          : 'bg-[#1a1a24] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{group.icon}</div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{group.exercises.length} exercises</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Day type */}
          {builderStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">What kind of day?</h2>
              <p className="text-gray-400 mb-6">Choose your training focus</p>
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
                      className={`w-full p-5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-green-600/20 border-green-500'
                          : 'bg-[#1a1a24] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{dayType.name}</h3>
                          <p className="text-gray-400 text-sm mt-0.5">{dayType.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        dayType.id === 'rep' ? 'bg-blue-600/20 text-blue-400' : 'bg-orange-600/20 text-orange-400'
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
              <h2 className="text-2xl font-bold text-white mb-1">Pick your exercises</h2>
              <p className="text-gray-400 mb-6">
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
                      className={`bg-[#1a1a24] border rounded-xl overflow-hidden transition-all ${
                        isSelected ? 'border-green-500/70' : 'border-white/10'
                      }`}
                    >
                      <button
                        onClick={() => toggleExercise(exercise.id, exercise.name)}
                        className="w-full p-4 text-left flex items-center gap-3"
                      >
                        {/* Exercise image / placeholder */}
                        <div className="w-14 h-14 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{exercise.name}</p>
                          <p className="text-gray-500 text-xs capitalize">{exercise.equipment}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-green-600 border-green-600' : 'border-white/20'
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
                          <span className="text-gray-400 text-sm">Sets:</span>
                          {[1, 2, 3, 4].map(n => (
                            <button
                              key={n}
                              onClick={() => setExerciseSetCounts(prev => new Map(prev).set(exercise.id, n))}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                setCount === n
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
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
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-[#0a0a0f] to-transparent">
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={startWorkout}
              disabled={builderSelectedExercises.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
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
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleBackToCycle}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex items-center gap-3">
                {/* Rest Timer */}
                {restTimeRemaining > 0 && (
                  <button
                    onClick={clearRestTimer}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      restTimeRemaining <= 10
                        ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                        : restTimeRemaining <= 30
                        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50'
                        : 'bg-green-600/20 text-green-400 border border-green-500/50'
                    }`}
                    title="Click to dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {restTimeRemaining}s
                  </button>
                )}
                {isSaving && (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                    Saving
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">{exercise.exerciseName}</h1>
            {programExercise?.notes && (
              <p className="text-gray-500 text-sm mt-1">{programExercise.notes}</p>
            )}
          </div>
        </header>

        <main className="px-4 py-6 pb-24">
          {/* Training Max */}
          <div className="bg-[#1a1a24] border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Training Max</span>
              {editingTM === exercise.exerciseId ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tmInput}
                    onChange={(e) => setTmInput(e.target.value)}
                    className="w-24 bg-[#0a0a0f] border border-white/20 rounded px-2 py-1 text-white text-right"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveTrainingMax(exercise.exerciseId, parseFloat(tmInput))}
                    className="text-green-400 hover:text-green-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setEditingTM(null); setTmInput(''); }}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="text-2xl font-bold text-white hover:text-green-400 transition-colors"
                >
                  {exercise.trainingMax > 0 ? `${exercise.trainingMax} lbs` : 'Set TM'}
                </button>
              )}
            </div>
          </div>

          {/* History Button */}
          <button
            onClick={() => handleLoadExerciseHistory(exercise.exerciseId, selectedDay)}
            className={`w-full mb-6 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors ${
              showExerciseHistory
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                : 'bg-[#1a1a24] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showExerciseHistory ? 'Hide Previous Performance' : 'Previous Performance'}
          </button>

          {/* Exercise History Panel */}
          {showExerciseHistory && (
            <div className="mb-6 bg-[#1a1a24] border border-blue-500/30 rounded-xl p-4">
              {isLoadingExerciseHistory ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  <span className="text-gray-400 text-sm ml-2">Loading history...</span>
                </div>
              ) : exerciseHistory ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-sm font-medium">
                        Cycle {exerciseHistory.cycleNumber}
                      </span>
                      {exerciseHistory.trainingMax != null && exerciseHistory.trainingMax > 0 && (
                        <span className="text-gray-400 text-xs">
                          TM: {exerciseHistory.trainingMax} lbs
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
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
                        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                          isFailed ? 'bg-red-600/10 border border-red-500/20' : 'bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs w-10">Set {set.setNumber}</span>
                          {isSkipped ? (
                            <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded">SKIP</span>
                          ) : set.failed ? (
                            <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded">FAIL</span>
                          ) : (
                            <span className="text-xs bg-green-600/20 text-green-400 px-1.5 py-0.5 rounded">PASS</span>
                          )}
                          {set.isAmrap && (
                            <span className="text-xs bg-orange-600/20 text-orange-400 px-1.5 py-0.5 rounded">AMRAP</span>
                          )}
                        </div>
                        <span className="text-white text-sm">
                          {isSkipped ? 0 : (set.actualReps ?? set.targetReps)} reps @ {isSkipped ? 0 : (set.actualWeight ?? set.targetWeight)} lbs
                        </span>
                      </div>
                      );
                    })}
                    {exerciseHistory.sets.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-2">No sets recorded</p>
                    )}
                  </div>
                  {/* Superset history */}
                  {exerciseHistory.supersetName && exerciseHistory.supersetSets && exerciseHistory.supersetSets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-orange-400 text-xs font-medium block mb-2">
                        Superset: {exerciseHistory.supersetName}
                      </span>
                      <div className="space-y-2">
                        {exerciseHistory.supersetSets.map((set, i) => {
                          const isSkipped = !set.completed;
                          const isFailed = set.failed || isSkipped;
                          return (
                          <div
                            key={i}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                              isFailed ? 'bg-red-600/10 border border-red-500/20' : 'bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-gray-500 text-xs w-10">Set {set.setNumber}</span>
                              {isSkipped ? (
                                <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded">SKIP</span>
                              ) : set.failed ? (
                                <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded">FAIL</span>
                              ) : (
                                <span className="text-xs bg-green-600/20 text-green-400 px-1.5 py-0.5 rounded">PASS</span>
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
                <p className="text-gray-500 text-sm text-center py-4">No previous data found for this exercise</p>
              )}
            </div>
          )}

          {/* Working Sets */}
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm mb-3">Sets</h2>
            <div className="space-y-3">
              {exercise.sets.map((set, setIndex) => {
                // Determine set type styling
                const setType = set.setType || 'working';
                const isWarmup = setType === 'warmup';
                const isBurnout = setType === 'burnout' || setType === 'dropset';

                return (
                <div
                  key={set.setNumber}
                  className={`bg-[#1a1a24] border rounded-xl p-4 transition-colors ${
                    set.failed
                      ? 'border-red-500/50'
                      : set.completed
                      ? isWarmup
                        ? 'border-blue-500/50'
                        : isBurnout
                        ? 'border-purple-500/50'
                        : 'border-green-500/50'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">Set {set.setNumber}</span>
                      {set.failed && (
                        <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">FAILED</span>
                      )}
                      {isWarmup && !set.failed && (
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">WARM-UP</span>
                      )}
                      {isBurnout && !set.failed && (
                        <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded">
                          {setType === 'dropset' ? 'DROP SET' : 'BURNOUT'}
                        </span>
                      )}
                      {set.isAmrap && !set.failed && (
                        <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded">AMRAP</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {set.targetReps} × {set.targetWeight} lbs ({set.targetPercent}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-gray-500 text-xs block mb-1">Reps</label>
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
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-500 text-xs block mb-1">Weight</label>
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
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    {/* Pass/Fail buttons */}
                    <div className="flex gap-1">
                      {/* Pass button (checkmark) */}
                      <button
                        onClick={() => handleSetUpdate(
                          selectedExerciseIndex,
                          setIndex,
                          'completed',
                          !set.completed || !!set.failed
                        )}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                          set.completed && !set.failed
                            ? isWarmup
                              ? 'bg-blue-600 text-white'
                              : isBurnout
                              ? 'bg-purple-600 text-white'
                              : 'bg-green-600 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-green-600/50 hover:text-white'
                        }`}
                        title="Pass"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      {/* Fail button (X) */}
                      <button
                        onClick={() => handleSetUpdate(
                          selectedExerciseIndex,
                          setIndex,
                          'failed',
                          !set.failed
                        )}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                          set.failed
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-red-600/50 hover:text-white'
                        }`}
                        title="Fail (prevents TM increase)"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
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
              <div className="bg-[#1a1a24] border border-white/10 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 text-sm font-medium">Superset:</span>
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
                          className="w-24 bg-[#0a0a0f] border border-orange-500/30 rounded px-2 py-1 text-white text-right"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTrainingMax(exercise.supersetId!, parseFloat(tmInput))}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setEditingTM(null); setTmInput(''); }}
                          className="text-gray-400 hover:text-gray-300"
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
                        className="text-orange-400 font-bold hover:text-orange-300 transition-colors"
                      >
                        {supersetTm > 0 ? `TM: ${supersetTm} lbs` : 'Set TM'}
                      </button>
                    );
                  })()}
                </div>
              </div>
              <div className="space-y-3">
                {exercise.supersetSets.map((set, setIndex) => (
                  <div
                    key={set.setNumber}
                    className={`bg-[#1a1a24] border rounded-xl p-4 transition-colors ${
                      set.failed
                        ? 'border-red-500/50'
                        : set.completed
                        ? 'border-orange-500/50'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Set {set.setNumber}</span>
                        {set.failed && (
                          <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">FAILED</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {set.targetReps} × {set.targetWeight} lbs
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-gray-500 text-xs block mb-1">Reps</label>
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
                          className="w-full bg-[#0a0a0f] border border-orange-500/30 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-gray-500 text-xs block mb-1">Weight</label>
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
                          className="w-full bg-[#0a0a0f] border border-orange-500/30 rounded-lg px-3 py-2 text-white text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      {/* Pass/Fail buttons */}
                      <div className="flex gap-1">
                        {/* Pass button (checkmark) */}
                        <button
                          onClick={() => handleSupersetUpdate(
                            selectedExerciseIndex,
                            setIndex,
                            'completed',
                            !set.completed || !!set.failed
                          )}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            set.completed && !set.failed
                              ? 'bg-orange-600 text-white'
                              : 'bg-white/10 text-gray-400 hover:bg-orange-600/50 hover:text-white'
                          }`}
                          title="Pass"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        {/* Fail button (X) */}
                        <button
                          onClick={() => handleSupersetUpdate(
                            selectedExerciseIndex,
                            setIndex,
                            'failed',
                            !set.failed
                          )}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            set.failed
                              ? 'bg-red-600 text-white'
                              : 'bg-white/10 text-gray-400 hover:bg-red-600/50 hover:text-white'
                          }`}
                          title="Fail (prevents TM increase)"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
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
    // Filter to only workout days (not rest days)
    const workoutDays = program.days.filter(d => d.exercises.length > 0);

    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setView('cycles')}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-xl font-bold text-white">Program Settings</h1>
            <p className="text-gray-500 text-sm">Edit training maxes, supersets, and progression</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-600/20 border-b border-red-600/30 px-4 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 py-6 pb-24">
          {/* Seed Data Button */}
          <div className="bg-[#1a1a24] border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Initial Data Setup</h3>
            <p className="text-gray-500 text-sm mb-3">
              Load your training maxes and exercise settings. This will overwrite existing values.
            </p>
            <button
              onClick={handleSeedGymData}
              disabled={isSeeding}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
              <p className={`text-sm mt-2 ${seedResult.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                {seedResult}
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <h3 className="text-blue-400 font-medium text-sm mb-2">Quick Reference</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• <span className="text-white">Training Max</span>: Base weight for calculating sets</li>
              <li>• <span className="text-white">Superset</span>: Pair exercises to perform back-to-back</li>
              <li>• <span className="text-white">TM Bump</span>: Weight added after completing a cycle</li>
            </ul>
          </div>

          {/* Exercise list by day */}
          <div className="space-y-3">
            {workoutDays.map(day => {
              const isExpanded = expandedSettingsDays.has(day.dayNumber);
              const toggleDay = () => {
                setExpandedSettingsDays(prev => {
                  const next = new Set(prev);
                  if (next.has(day.dayNumber)) {
                    next.delete(day.dayNumber);
                  } else {
                    next.add(day.dayNumber);
                  }
                  return next;
                });
              };

              return (
              <div key={day.dayNumber} className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden">
                {/* Day header - clickable accordion trigger */}
                <button
                  onClick={toggleDay}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                      {day.dayOfWeek}
                    </span>
                    <h2 className="text-white font-medium">{day.name}</h2>
                    <span className="text-gray-500 text-sm">({day.exercises.length} exercises)</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                <div className="border-t border-white/10 p-4 space-y-3">
                  {day.exercises.map(exercise => {
                    const settings = exerciseSettings.get(exercise.id);
                    const supersetSettingsId = `${exercise.id}-superset`;
                    const ssSettings = exerciseSettings.get(supersetSettingsId);
                    const tm = trainingMaxes.get(exercise.id) || 0;
                    const isEditing = editingSettings?.exerciseId === exercise.id;
                    const isEditingSuperset = editingSettings?.exerciseId === supersetSettingsId;
                    const isEditingTM = editingTM === exercise.id;

                    // Check for superset config - database first, then JSON fallback
                    const dbSuperset = supersetConfigs.find(
                      s => s.primaryExerciseId === exercise.id && s.dayNumber === day.dayNumber
                    );
                    const currentSuperset = dbSuperset?.supersetName || exercise.superset;
                    const isEditingSupersetFor = editingSuperset?.exerciseId === exercise.id && editingSuperset?.dayNumber === day.dayNumber;

                    // Get other exercises on this day for superset options
                    const otherExercises = day.exercises.filter(e => e.id !== exercise.id);

                    return (
                      <div
                        key={exercise.id}
                        className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden"
                      >
                        {/* Exercise header */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{exercise.name}</h3>
                              <p className="text-gray-500 text-xs">{exercise.sets} sets × {exercise.reps}</p>
                            </div>
                            <div className="text-right ml-3">
                              {isEditingTM ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={tmInput}
                                    onChange={(e) => setTmInput(e.target.value)}
                                    className="w-20 bg-[#0a0a0f] border border-green-500/50 rounded px-2 py-1 text-white text-right text-sm"
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
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => { setEditingTM(null); setTmInput(''); }}
                                    className="text-gray-400 hover:text-gray-300"
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
                                  <div className="text-green-400 font-bold group-hover:text-green-300 transition-colors">
                                    {tm > 0 ? `${tm} lbs` : 'Set TM'}
                                  </div>
                                  <div className="text-gray-500 text-xs group-hover:text-gray-400">
                                    Training Max
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Superset configuration */}
                          <div className="mt-3 pt-3 border-t border-white/5">
                            {isEditingSupersetFor ? (
                              <div className="space-y-2">
                                <label className="text-orange-400 text-xs font-medium">Select superset exercise:</label>
                                <select
                                  value={supersetSelection}
                                  onChange={(e) => setSupersetSelection(e.target.value)}
                                  className="w-full bg-[#0a0a0f] border border-orange-500/30 rounded px-3 py-2 text-white text-sm"
                                >
                                  <option value="">None (no superset)</option>
                                  {otherExercises.map(other => (
                                    <option key={other.id} value={other.id}>
                                      {other.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (supersetSelection) {
                                        const selectedEx = otherExercises.find(e => e.id === supersetSelection);
                                        if (selectedEx) {
                                          handleSaveSuperset(exercise.id, supersetSelection, selectedEx.name, day.dayNumber);
                                        }
                                      } else {
                                        // Remove superset
                                        handleRemoveSuperset(exercise.id, day.dayNumber);
                                        setEditingSuperset(null);
                                        setSupersetSelection('');
                                      }
                                    }}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-1.5 rounded text-xs font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingSuperset(null);
                                      setSupersetSelection('');
                                    }}
                                    className="px-3 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : currentSuperset ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-1 rounded">
                                      Superset
                                    </span>
                                    <span className="text-orange-300 text-sm">{currentSuperset}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditingSuperset({ exerciseId: exercise.id, dayNumber: day.dayNumber });
                                      // Find the current superset exercise id
                                      const currentSupersetEx = otherExercises.find(e => e.name === currentSuperset);
                                      setSupersetSelection(currentSupersetEx?.id || dbSuperset?.supersetExerciseId || '');
                                    }}
                                    className="text-xs text-orange-400 hover:text-orange-300"
                                  >
                                    Change
                                  </button>
                                </div>
                                {/* Superset Training Max */}
                                {(() => {
                                  const supersetTmId = `${exercise.id}-superset`;
                                  const supersetTm = trainingMaxes.get(supersetTmId) || 0;
                                  const isEditingSupersetTM = editingTM === supersetTmId;

                                  return (
                                    <div className="flex items-center justify-between pl-4 border-l-2 border-orange-500/30">
                                      <span className="text-gray-400 text-xs">Superset TM:</span>
                                      {isEditingSupersetTM ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number"
                                            value={tmInput}
                                            onChange={(e) => setTmInput(e.target.value)}
                                            className="w-16 bg-[#0a0a0f] border border-orange-500/50 rounded px-2 py-1 text-white text-right text-xs"
                                            autoFocus
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleSaveTrainingMax(supersetTmId, parseFloat(tmInput));
                                              } else if (e.key === 'Escape') {
                                                setEditingTM(null);
                                                setTmInput('');
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={() => handleSaveTrainingMax(supersetTmId, parseFloat(tmInput))}
                                            className="text-orange-400 hover:text-orange-300"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => { setEditingTM(null); setTmInput(''); }}
                                            className="text-gray-400 hover:text-gray-300"
                                          >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setEditingTM(supersetTmId);
                                            setTmInput(supersetTm.toString());
                                          }}
                                          className="text-orange-400 text-xs font-medium hover:text-orange-300"
                                        >
                                          {supersetTm > 0 ? `${supersetTm} lbs` : 'Set TM'}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* Superset settings tags */}
                                <div className="flex flex-wrap gap-2 text-xs mt-2 pl-4 border-l-2 border-orange-500/30">
                                  {(ssSettings?.targetSets || ssSettings?.targetReps) && (
                                    <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                                      {ssSettings?.targetSets ?? exercise.sets}x{ssSettings?.targetReps ?? exercise.reps}
                                    </span>
                                  )}
                                  <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                                    Base: {ssSettings?.basePercent ?? DEFAULT_EXERCISE_SETTINGS.basePercent}%
                                  </span>
                                  <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                                    TM +{ssSettings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement} lbs
                                  </span>
                                  {ssSettings?.autoProgress === false && (
                                    <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded">
                                      No auto-progress
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => setEditingSettings(ssSettings || {
                                    exerciseId: supersetSettingsId,
                                    ...DEFAULT_EXERCISE_SETTINGS
                                  })}
                                  className="text-xs text-orange-400 hover:text-orange-300 mt-1 pl-4 border-l-2 border-orange-500/30"
                                >
                                  {isEditingSuperset ? 'Editing...' : 'Edit Superset Settings'}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingSuperset({ exerciseId: exercise.id, dayNumber: day.dayNumber });
                                  setSupersetSelection('');
                                }}
                                className="text-xs text-gray-500 hover:text-orange-400 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add superset
                              </button>
                            )}
                          </div>

                          {/* Settings tags */}
                          <div className="flex flex-wrap gap-2 text-xs mt-3">
                            {(settings?.targetSets || settings?.targetReps) && (
                              <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                                {settings?.targetSets ?? exercise.sets}x{settings?.targetReps ?? exercise.reps}
                              </span>
                            )}
                            <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                              Base: {settings?.basePercent ?? DEFAULT_EXERCISE_SETTINGS.basePercent}%
                            </span>
                            <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                              TM +{settings?.tmIncrement ?? DEFAULT_EXERCISE_SETTINGS.tmIncrement} lbs
                            </span>
                            {settings?.autoProgress === false && (
                              <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded">
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
                            className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                          >
                            {isEditing ? 'Editing...' : 'Edit Progression Settings'}
                          </button>
                        </div>

                        {/* Edit form */}
                        {isEditing && editingSettings && (
                          <div className="border-t border-white/10 bg-[#0a0a0f] p-4 space-y-4">
                            {/* Sets/Reps Override */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">
                                  Sets <span className="text-gray-600">(default: {exercise.sets})</span>
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={editingSettings.targetSets ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetSets: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder={exercise.sets.toString()}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">
                                  Reps <span className="text-gray-600">(default: {exercise.reps})</span>
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={editingSettings.targetReps ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetReps: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder={exercise.reps.toString()}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                            </div>

                            {/* Percentage Settings */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">Base Percentage (%)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.basePercent}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    basePercent: parseFloat(e.target.value) || 75
                                  })}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">TM Bump (lbs)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.tmIncrement}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    tmIncrement: parseFloat(e.target.value) || 5
                                  })}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
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
                                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500"
                              />
                              <span className="text-gray-300 text-sm">Auto-progress TM on cycle complete</span>
                            </label>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveSettings(editingSettings)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSettings(null)}
                                className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Superset edit form */}
                        {isEditingSuperset && editingSettings && (
                          <div className="border-t border-orange-500/20 bg-[#0a0a0f] p-4 space-y-4">
                            <p className="text-orange-400 text-xs font-medium">Superset: {currentSuperset}</p>
                            {/* Sets/Reps Override */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">
                                  Sets <span className="text-gray-600">(default: {exercise.sets})</span>
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={editingSettings.targetSets ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetSets: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder={exercise.sets.toString()}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">
                                  Reps <span className="text-gray-600">(default: {exercise.reps})</span>
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={editingSettings.targetReps ?? ''}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    targetReps: e.target.value ? parseInt(e.target.value) : null
                                  })}
                                  placeholder={exercise.reps.toString()}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                            </div>

                            {/* Percentage Settings */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">Base Percentage (%)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.basePercent}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    basePercent: parseFloat(e.target.value) || 75
                                  })}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">TM Bump (lbs)</label>
                                <input
                                  type="number"
                                  step="2.5"
                                  value={editingSettings.tmIncrement}
                                  onChange={(e) => setEditingSettings({
                                    ...editingSettings,
                                    tmIncrement: parseFloat(e.target.value) || 5
                                  })}
                                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
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
                                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-orange-500"
                              />
                              <span className="text-gray-300 text-sm">Auto-progress TM on cycle complete</span>
                            </label>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveSettings(editingSettings)}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSettings(null)}
                                className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
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
    // Get all exercises from program (including supersets)
    const allExercises: { id: string; name: string; dayName: string; isSuperset?: boolean; parentId?: string }[] = [];
    program.days.forEach(day => {
      day.exercises.forEach(ex => {
        allExercises.push({ id: ex.id, name: ex.name, dayName: day.name });
        // Add superset exercises
        if (ex.superset) {
          allExercises.push({
            id: `${ex.id}-superset`,
            name: ex.superset,
            dayName: day.name,
            isSuperset: true,
            parentId: ex.id,
          });
        }
      });
    });
    // Also add database supersets
    supersetConfigs.forEach(sc => {
      const exists = allExercises.find(e => e.id === `${sc.primaryExerciseId}-superset`);
      if (!exists) {
        const day = program.days.find(d => d.dayNumber === sc.dayNumber);
        allExercises.push({
          id: `${sc.primaryExerciseId}-superset`,
          name: sc.supersetName,
          dayName: day?.name || 'Unknown',
          isSuperset: true,
          parentId: sc.primaryExerciseId,
        });
      }
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
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setView('cycles')}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-xl font-bold text-white">Training Max History</h1>
            <p className="text-gray-500 text-sm">Track your progression over time</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-600/20 border-b border-red-600/30 px-4 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <main className="px-4 py-6 pb-24">
          {/* Exercise selector */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm block mb-2">Select Exercise</label>
            <select
              value={selectedHistoryExercise}
              onChange={(e) => handleLoadHistory(e.target.value)}
              className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Choose an exercise...</option>
              {allExercises.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} {ex.isSuperset ? '(Superset)' : ''} - {ex.dayName}
                </option>
              ))}
            </select>
          </div>

          {isLoadingHistory && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-white/20 border-t-green-500 rounded-full animate-spin" />
            </div>
          )}

          {selectedHistoryExercise && !isLoadingHistory && (
            <>
              {/* Chart */}
              <div className="bg-[#1a1a24] border border-white/10 rounded-xl p-4 mb-6">
                <h3 className="text-white font-medium mb-1">Training Max Progression</h3>
                <p className="text-green-400 text-sm mb-4">{selectedExInfo?.name}</p>

                {sortedHistory.length > 0 ? (
                  <div className="relative" style={{ height: chartHeight }}>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-gray-500 text-xs">
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
                          stroke="#22c55e"
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
                            fill="#22c55e"
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    {sortedHistory.length > 0 && (
                      <div className="ml-14 mt-2 flex justify-between text-gray-500 text-xs">
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
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    No history recorded yet
                  </div>
                )}
              </div>

              {/* History list */}
              <div className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-medium">History</h3>
                </div>
                {sortedHistory.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {[...sortedHistory].reverse().map((entry) => (
                      <div key={entry.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">
                            {new Date(entry.recordedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">{entry.weight} lbs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No history recorded yet. Update your training max to start tracking.
                  </div>
                )}
              </div>
            </>
          )}

          {!selectedHistoryExercise && !isLoadingHistory && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Select an exercise to view its history</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}
