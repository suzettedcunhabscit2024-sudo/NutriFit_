import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ExerciseItem,
  SleepRecord,
  WaterEntry,
  NutritionEntry,
  WeightRecord,
  DailyGoals,
  DayStats
} from '../types';
import {
  calculateBMI,
  calculateCaloriesBurned,
  parseSleepTime
} from '../data/mockAndReferenceData';
import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  User
} from '../lib/firebase';

interface HealthContextType {
  // Navigation & View
  currentStep: 'home' | 'auth' | 'basic-info' | 'dashboard';
  setCurrentStep: (step: 'home' | 'auth' | 'basic-info' | 'dashboard') => void;
  activeFeatureTab: string | null;
  setActiveFeatureTab: (tab: string | null) => void;
  showDailyReportModal: boolean;
  setShowDailyReportModal: (show: boolean) => void;

  // Firebase Auth
  currentUser: User | null;
  isAuthLoading: boolean;
  logout: () => Promise<void>;

  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  bmiData: ReturnType<typeof calculateBMI>;

  // Exercise
  exercises: ExerciseItem[];
  addExercise: (name: string, durationMin: number, isCustom?: boolean) => Promise<ExerciseItem>;
  removeExercise: (id: string) => Promise<void>;
  totalExerciseMinutes: number;
  totalCaloriesBurned: number;

  // Sleep
  sleepRecord: SleepRecord;
  saveSleepRecord: (bedtime: string, wakeTime: string) => Promise<SleepRecord>;

  // Water
  waterLogs: WaterEntry[];
  addWater: (amountMl: number) => Promise<void>;
  removeWater: (id: string) => Promise<void>;
  resetWater: () => Promise<void>;
  totalWaterMl: number;

  // Nutrition
  nutritionLogs: NutritionEntry[];
  addNutrition: (
    meal: NutritionEntry['meal'],
    foodName: string,
    quantity: string,
    customMacros?: { calories: number; protein: number; carbs: number; fat: number }
  ) => Promise<void>;
  removeNutrition: (id: string) => Promise<void>;
  totalNutrition: { calories: number; protein: number; carbs: number; fat: number };

  // Weight & History
  weightHistory: WeightRecord[];
  currentWeight: number;
  previousWeight: number;
  weightChange: number;
  addWeightRecord: (newWeight: number) => Promise<void>;

  // Goals
  goals: DailyGoals;
  updateGoals: (newGoals: Partial<DailyGoals>) => Promise<void>;

  // Progress stats
  weekStats: DayStats[];
  dailyHealthScore: number;

  // State reset
  resetToCleanSlate: () => void;
}

const CLEAN_PROFILE: UserProfile = {
  name: '',
  email: '',
  age: 22,
  gender: 'Male',
  height: 170,
  weight: 68,
  isRegistered: false,
  hasCompletedBasicInfo: false,
};

const DEFAULT_GOALS: DailyGoals = {
  waterMl: 2500, // 2.5 L
  exerciseMinutes: 45, // 45 min
  sleepHours: 8.0, // 8 hours
  caloriesTarget: 1800, // 1800 kcal
  proteinGTarget: 65, // 65 g
};

const DEFAULT_SLEEP: SleepRecord = {
  id: 'sleep-initial',
  bedtime: '11:00 PM',
  wakeTime: '07:00 AM',
  hours: 8,
  minutes: 0,
  totalHours: 8.0,
  date: new Date().toISOString().split('T')[0],
  timestamp: '07:00 AM',
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // App navigation state
  const [currentStep, setCurrentStep] = useState<'home' | 'auth' | 'basic-info' | 'dashboard'>('home');
  const [activeFeatureTab, setActiveFeatureTab] = useState<string | null>(null);
  const [showDailyReportModal, setShowDailyReportModal] = useState<boolean>(false);

  // Primary Health States
  const [profile, setProfile] = useState<UserProfile>(CLEAN_PROFILE);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [sleepRecord, setSleepRecord] = useState<SleepRecord>(DEFAULT_SLEEP);
  const [waterLogs, setWaterLogs] = useState<WaterEntry[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionEntry[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);

  // 1. Listen to Firebase Authentication lifecycle
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        setProfile(prev => ({
          ...prev,
          userId: user.uid,
          email: user.email || prev.email,
          name: prev.name || user.displayName || '',
          isRegistered: true,
        }));
      } else {
        // User logged out
        setProfile(CLEAN_PROFILE);
        setExercises([]);
        setWaterLogs([]);
        setNutritionLogs([]);
        setWeightHistory([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore synchronizations when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const uid = currentUser.uid;

    // A. Profile Document Listener
    const profileDocRef = doc(db, 'users', uid);
    const unsubProfile = onSnapshot(
      profileDocRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
            userId: uid,
            email: currentUser.email || data.email || '',
            name: data.name || currentUser.displayName || '',
            age: Number(data.age) || 22,
            gender: data.gender || 'Male',
            height: Number(data.height) || 170,
            weight: Number(data.weight) || 68,
            isRegistered: true,
            hasCompletedBasicInfo: Boolean(data.hasCompletedBasicInfo),
          });
          if (data.hasCompletedBasicInfo && currentStep === 'basic-info') {
            setCurrentStep('dashboard');
          }
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      }
    );

    // B. Goals Document Listener
    const goalsDocRef = doc(db, 'users', uid, 'goals', 'daily');
    const unsubGoals = onSnapshot(
      goalsDocRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setGoals({
            waterMl: Number(data.waterMl) || DEFAULT_GOALS.waterMl,
            exerciseMinutes: Number(data.exerciseMinutes) || DEFAULT_GOALS.exerciseMinutes,
            sleepHours: Number(data.sleepHours) || DEFAULT_GOALS.sleepHours,
            caloriesTarget: Number(data.caloriesTarget) || DEFAULT_GOALS.caloriesTarget,
            proteinGTarget: Number(data.proteinGTarget) || DEFAULT_GOALS.proteinGTarget,
          });
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, `users/${uid}/goals/daily`);
      }
    );

    // C. Sleep Document Listener
    const sleepDocRef = doc(db, 'users', uid, 'sleep', 'latest');
    const unsubSleep = onSnapshot(
      sleepDocRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSleepRecord({
            id: snapshot.id,
            bedtime: data.bedtime || '11:00 PM',
            wakeTime: data.wakeTime || '07:00 AM',
            hours: Number(data.hours) || 8,
            minutes: Number(data.minutes) || 0,
            totalHours: Number(data.totalHours) || 8.0,
            date: data.date || new Date().toISOString().split('T')[0],
            timestamp: data.timestamp || '07:00 AM',
          });
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, `users/${uid}/sleep/latest`);
      }
    );

    // D. Exercises Subcollection Listener
    const exercisesColRef = collection(db, 'users', uid, 'exercises');
    const unsubExercises = onSnapshot(
      exercisesColRef,
      snapshot => {
        const items: ExerciseItem[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            exerciseName: d.exerciseName || 'Workout',
            durationMinutes: Number(d.durationMinutes) || 0,
            caloriesBurned: Number(d.caloriesBurned) || 0,
            isCustom: Boolean(d.isCustom),
            timestamp: d.timestamp || '',
            date: d.date || '',
          });
        });
        // Sort newest first
        items.sort((a, b) => b.id.localeCompare(a.id));
        setExercises(items);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, `users/${uid}/exercises`);
      }
    );

    // E. Water Logs Subcollection Listener
    const waterColRef = collection(db, 'users', uid, 'waterLogs');
    const unsubWater = onSnapshot(
      waterColRef,
      snapshot => {
        const items: WaterEntry[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            amountMl: Number(d.amountMl) || 0,
            timestamp: d.timestamp || '',
            date: d.date || '',
          });
        });
        items.sort((a, b) => a.id.localeCompare(b.id));
        setWaterLogs(items);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, `users/${uid}/waterLogs`);
      }
    );

    // F. Nutrition / Meals Subcollection Listener
    const mealsColRef = collection(db, 'users', uid, 'meals');
    const unsubMeals = onSnapshot(
      mealsColRef,
      snapshot => {
        const items: NutritionEntry[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            meal: d.meal || 'General',
            foodName: d.foodName || '',
            quantity: d.quantity || '',
            calories: Number(d.calories) || 0,
            protein: Number(d.protein) || 0,
            carbs: Number(d.carbs) || 0,
            fat: Number(d.fat) || 0,
            timestamp: d.timestamp || '',
            date: d.date || '',
          });
        });
        items.sort((a, b) => a.id.localeCompare(b.id));
        setNutritionLogs(items);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, `users/${uid}/meals`);
      }
    );

    // G. Weight Records Subcollection Listener
    const weightColRef = collection(db, 'users', uid, 'weightRecords');
    const unsubWeight = onSnapshot(
      weightColRef,
      snapshot => {
        const items: WeightRecord[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            weight: Number(d.weight) || 0,
            date: d.date || '',
            change: Number(d.change) || 0,
            bmi: Number(d.bmi) || 0,
          });
        });
        items.sort((a, b) => a.id.localeCompare(b.id));
        setWeightHistory(items);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, `users/${uid}/weightRecords`);
      }
    );

    return () => {
      unsubProfile();
      unsubGoals();
      unsubSleep();
      unsubExercises();
      unsubWater();
      unsubMeals();
      unsubWeight();
    };
  }, [currentUser]);

  // Derived Calculations
  const bmiData = calculateBMI(profile.weight, profile.height);

  const totalExerciseMinutes = exercises.reduce((sum, item) => sum + item.durationMinutes, 0);
  const totalCaloriesBurned = exercises.reduce((sum, item) => sum + item.caloriesBurned, 0);
  const totalWaterMl = waterLogs.reduce((sum, item) => sum + item.amountMl, 0);

  const totalNutrition = nutritionLogs.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: Number((acc.protein + curr.protein).toFixed(1)),
      carbs: Number((acc.carbs + curr.carbs).toFixed(1)),
      fat: Number((acc.fat + curr.fat).toFixed(1)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const currentWeight = profile.weight;
  const previousWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 2].weight : profile.weight;
  const weightChange = Number((currentWeight - previousWeight).toFixed(1));

  // Daily Health Score (0 - 100%)
  const waterProgress = Math.min(1, totalWaterMl / (goals.waterMl || 2500));
  const exerciseProgress = Math.min(1, totalExerciseMinutes / (goals.exerciseMinutes || 45));
  const sleepProgress = Math.min(1, sleepRecord.totalHours / (goals.sleepHours || 8));
  const calRatio = totalNutrition.calories / (goals.caloriesTarget || 1800);
  const calScore = calRatio >= 0.8 && calRatio <= 1.15 ? 1 : Math.max(0, 1 - Math.abs(1 - calRatio));

  const dailyHealthScore = Math.round(
    (waterProgress * 0.25 + exerciseProgress * 0.3 + sleepProgress * 0.25 + calScore * 0.2) * 100
  );

  // Dynamic weekly stats computed from real user data
  const weekStats: DayStats[] = React.useMemo(() => {
    return [
      {
        date: 'Today',
        waterMl: totalWaterMl,
        exerciseMinutes: totalExerciseMinutes,
        caloriesBurned: totalCaloriesBurned,
        caloriesConsumed: totalNutrition.calories,
        sleepHours: sleepRecord.totalHours,
        weight: profile.weight,
      },
    ];
  }, [totalWaterMl, totalExerciseMinutes, totalCaloriesBurned, totalNutrition.calories, sleepRecord.totalHours, profile.weight]);

  // Firestore Sync Handlers
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}`;
      try {
        await setDoc(
          doc(db, 'users', currentUser.uid),
          {
            userId: currentUser.uid,
            email: currentUser.email || updated.email || '',
            name: updated.name,
            age: Number(updated.age),
            gender: updated.gender,
            height: Number(updated.height),
            weight: Number(updated.weight),
            isRegistered: true,
            hasCompletedBasicInfo: updated.hasCompletedBasicInfo,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }
  };

  const addExercise = async (name: string, durationMin: number, isCustom = false) => {
    const calc = calculateCaloriesBurned(name, durationMin, profile.weight);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `ex-${Date.now()}`;
    const newEntry: ExerciseItem = {
      id,
      exerciseName: name,
      durationMinutes: durationMin,
      caloriesBurned: calc.calories,
      isCustom,
      timestamp: timeStr,
      date: new Date().toISOString().split('T')[0],
    };

    setExercises(prev => [newEntry, ...prev]);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/exercises/${id}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'exercises', id), {
          id,
          userId: currentUser.uid,
          exerciseName: name,
          durationMinutes: durationMin,
          caloriesBurned: calc.calories,
          met: calc.met,
          isCustom,
          timestamp: timeStr,
          date: newEntry.date,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    }

    return newEntry;
  };

  const removeExercise = async (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/exercises/${id}`;
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'exercises', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const saveSleepRecord = async (bedtime: string, wakeTime: string) => {
    const calc = parseSleepTime(bedtime, wakeTime);
    const updated: SleepRecord = {
      id: `sleep-${Date.now()}`,
      bedtime,
      wakeTime,
      hours: calc.hours,
      minutes: calc.minutes,
      totalHours: calc.totalHours,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSleepRecord(updated);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/sleep/latest`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'sleep', 'latest'), {
          userId: currentUser.uid,
          bedtime,
          wakeTime,
          hours: calc.hours,
          minutes: calc.minutes,
          totalHours: calc.totalHours,
          date: updated.date,
          timestamp: updated.timestamp,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }

    return updated;
  };

  const addWater = async (amountMl: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `water-${Date.now()}`;
    const newLog: WaterEntry = {
      id,
      amountMl,
      timestamp: timeStr,
      date: new Date().toISOString().split('T')[0],
    };

    setWaterLogs(prev => [...prev, newLog]);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/waterLogs/${id}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'waterLogs', id), {
          id,
          userId: currentUser.uid,
          amountMl,
          timestamp: timeStr,
          date: newLog.date,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    }
  };

  const removeWater = async (id: string) => {
    setWaterLogs(prev => prev.filter(w => w.id !== id));

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/waterLogs/${id}`;
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'waterLogs', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const resetWater = async () => {
    const currentLogs = [...waterLogs];
    setWaterLogs([]);

    if (currentUser) {
      try {
        await Promise.all(
          currentLogs.map(w => deleteDoc(doc(db, 'users', currentUser.uid, 'waterLogs', w.id)))
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/waterLogs`);
      }
    }
  };

  const addNutrition = async (
    meal: NutritionEntry['meal'],
    foodName: string,
    quantity: string,
    customMacros?: { calories: number; protein: number; carbs: number; fat: number }
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `nut-${Date.now()}`;
    const newEntry: NutritionEntry = {
      id,
      meal,
      foodName,
      quantity,
      calories: customMacros?.calories || 250,
      protein: customMacros?.protein || 6,
      carbs: customMacros?.carbs || 40,
      fat: customMacros?.fat || 7,
      timestamp: timeStr,
      date: new Date().toISOString().split('T')[0],
    };

    setNutritionLogs(prev => [...prev, newEntry]);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/meals/${id}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'meals', id), {
          id,
          userId: currentUser.uid,
          meal,
          foodName,
          quantity,
          calories: newEntry.calories,
          protein: newEntry.protein,
          carbs: newEntry.carbs,
          fat: newEntry.fat,
          timestamp: timeStr,
          date: newEntry.date,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    }
  };

  const removeNutrition = async (id: string) => {
    setNutritionLogs(prev => prev.filter(n => n.id !== id));

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/meals/${id}`;
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'meals', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const addWeightRecord = async (newWeight: number) => {
    const currentW = profile.weight;
    const change = Number((newWeight - currentW).toFixed(1));
    const newBmi = calculateBMI(newWeight, profile.height).bmi;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const id = `weight-${Date.now()}`;

    const newRecord: WeightRecord = {
      id,
      weight: newWeight,
      date: dateStr,
      change,
      bmi: newBmi,
    };

    setWeightHistory(prev => [...prev, newRecord]);
    await updateProfile({ weight: newWeight });

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/weightRecords/${id}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'weightRecords', id), {
          id,
          userId: currentUser.uid,
          weight: newWeight,
          date: dateStr,
          change,
          bmi: newBmi,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      }
    }
  };

  const updateGoals = async (newGoals: Partial<DailyGoals>) => {
    const updated = { ...goals, ...newGoals };
    setGoals(updated);

    if (currentUser) {
      const docPath = `users/${currentUser.uid}/goals/daily`;
      try {
        await setDoc(
          doc(db, 'users', currentUser.uid, 'goals', 'daily'),
          {
            userId: currentUser.uid,
            ...updated,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(CLEAN_PROFILE);
      setExercises([]);
      setWaterLogs([]);
      setNutritionLogs([]);
      setWeightHistory([]);
      setCurrentStep('home');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const resetToCleanSlate = () => {
    setProfile(CLEAN_PROFILE);
    setExercises([]);
    setWaterLogs([]);
    setNutritionLogs([]);
    setSleepRecord(DEFAULT_SLEEP);
    setWeightHistory([]);
    setCurrentStep('home');
  };

  return (
    <HealthContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        activeFeatureTab,
        setActiveFeatureTab,
        showDailyReportModal,
        setShowDailyReportModal,
        currentUser,
        isAuthLoading,
        logout,
        profile,
        updateProfile,
        bmiData,
        exercises,
        addExercise,
        removeExercise,
        totalExerciseMinutes,
        totalCaloriesBurned,
        sleepRecord,
        saveSleepRecord,
        waterLogs,
        addWater,
        removeWater,
        resetWater,
        totalWaterMl,
        nutritionLogs,
        addNutrition,
        removeNutrition,
        totalNutrition,
        weightHistory,
        currentWeight,
        previousWeight,
        weightChange,
        addWeightRecord,
        goals,
        updateGoals,
        weekStats,
        dailyHealthScore,
        resetToCleanSlate,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
