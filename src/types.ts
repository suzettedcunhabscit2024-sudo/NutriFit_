export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  userId?: string;
  email?: string;
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  isRegistered: boolean;
  hasCompletedBasicInfo: boolean;
}

export interface ExerciseItem {
  id: string;
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  isCustom: boolean;
  timestamp: string;
  date: string;
}

export interface SleepRecord {
  id: string;
  bedtime: string;
  wakeTime: string;
  hours: number;
  minutes: number;
  totalHours: number;
  date: string;
  timestamp: string;
}

export interface WaterEntry {
  id: string;
  amountMl: number;
  timestamp: string;
  date: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';

export interface NutritionEntry {
  id: string;
  meal: MealType;
  foodName: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  date: string;
}

export interface WeightRecord {
  id: string;
  weight: number;
  date: string;
  change: number; // vs previous weight
  bmi: number;
}

export interface DailyGoals {
  waterMl: number;
  exerciseMinutes: number;
  sleepHours: number;
  caloriesTarget: number;
  proteinGTarget: number;
}

export interface HealthTip {
  id: string;
  category: 'Nutrition' | 'Exercise' | 'Hydration' | 'Sleep' | 'General';
  title: string;
  summary: string;
  details: string;
  badge: string;
}

export interface DayStats {
  date: string;
  waterMl: number;
  exerciseMinutes: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  sleepHours: number;
  weight: number;
}
