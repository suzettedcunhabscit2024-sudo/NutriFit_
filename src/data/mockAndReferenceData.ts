import { HealthTip, DayStats, WeightRecord } from '../types';

export interface ExerciseMET {
  name: string;
  met: number;
  description: string;
}

export const EXERCISE_MET_DATABASE: Record<string, ExerciseMET> = {
  'Walking': { name: 'Walking', met: 3.5, description: 'Moderate pace (4.5–5 km/h)' },
  'Running': { name: 'Running', met: 9.8, description: 'Jogging/running (9 km/h)' },
  'Cycling': { name: 'Cycling', met: 7.5, description: 'Moderate effort (16–19 km/h)' },
  'Swimming': { name: 'Swimming', met: 7.0, description: 'Freestyle or breaststroke moderate laps' },
  'Yoga': { name: 'Yoga', met: 3.0, description: 'Hatha or Vinyasa flow' },
  'Gym': { name: 'Gym', met: 5.5, description: 'Resistance training and conditioning' },
  'Dancing': { name: 'Dancing', met: 5.0, description: 'Aerobic or Zumba dance session' },
  'Skipping': { name: 'Skipping', met: 11.0, description: 'Moderate-to-fast jump rope' },
  'Running stairs': { name: 'Running stairs', met: 9.0, description: 'Stair climbing or stair runs' },
  'Other': { name: 'Other Activity', met: 4.5, description: 'General moderate physical activity estimate' },
};

export interface PredefinedFood {
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'General';
  defaultPortion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const PREDEFINED_FOODS: PredefinedFood[] = [
  { name: 'Poha', category: 'Breakfast', defaultPortion: '1 bowl (150g)', calories: 250, protein: 6, carbs: 40, fat: 7 },
  { name: 'Oatmeal with Milk', category: 'Breakfast', defaultPortion: '1 bowl (200g)', calories: 220, protein: 9, carbs: 35, fat: 5 },
  { name: 'Boiled Eggs', category: 'Breakfast', defaultPortion: '2 whole eggs', calories: 156, protein: 13, carbs: 1.1, fat: 10.6 },
  { name: 'Idli with Sambar', category: 'Breakfast', defaultPortion: '2 idlis + 1 cup sambar', calories: 210, protein: 7, carbs: 38, fat: 3 },
  { name: 'Masala Dosa', category: 'Breakfast', defaultPortion: '1 medium dosa', calories: 330, protein: 6, carbs: 45, fat: 14 },
  { name: 'Whole Wheat Roti / Chapati', category: 'Lunch', defaultPortion: '2 pieces', calories: 160, protein: 6, carbs: 32, fat: 1.5 },
  { name: 'Dal Tadka', category: 'Lunch', defaultPortion: '1 bowl (180g)', calories: 180, protein: 10, carbs: 24, fat: 5 },
  { name: 'Steamed Rice', category: 'Lunch', defaultPortion: '1 bowl (150g)', calories: 205, protein: 4.2, carbs: 45, fat: 0.5 },
  { name: 'Paneer Curry', category: 'Lunch', defaultPortion: '1 bowl (150g)', calories: 280, protein: 14, carbs: 10, fat: 21 },
  { name: 'Grilled Chicken Breast', category: 'Dinner', defaultPortion: '150g serving', calories: 248, protein: 46, carbs: 0, fat: 5.4 },
  { name: 'Mixed Green Salad', category: 'Dinner', defaultPortion: '1 large bowl', calories: 95, protein: 2.5, carbs: 8, fat: 6 },
  { name: 'Brown Rice with Vegetables', category: 'Dinner', defaultPortion: '1 bowl', calories: 240, protein: 5.5, carbs: 48, fat: 3 },
  { name: 'Apple', category: 'Snack', defaultPortion: '1 medium fruit (180g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana', category: 'Snack', defaultPortion: '1 medium fruit (120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Roasted Almonds', category: 'Snack', defaultPortion: '1 handful (28g)', calories: 160, protein: 6, carbs: 6, fat: 14 },
  { name: 'Greek Yogurt', category: 'Snack', defaultPortion: '1 cup (150g)', calories: 130, protein: 15, carbs: 8, fat: 4 },
  { name: 'Sprouted Moong Salad', category: 'Snack', defaultPortion: '1 bowl (120g)', calories: 140, protein: 9, carbs: 22, fat: 1.2 },
  { name: 'Vegetable Khichdi', category: 'Dinner', defaultPortion: '1 bowl (200g)', calories: 260, protein: 8, carbs: 46, fat: 4.5 },
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    category: 'Hydration',
    title: 'The 8-Glass Water Blueprint',
    summary: 'Drinking water 30 minutes before meals assists gastric motility and optimizes nutrient absorption.',
    details: 'Keep a reusable water bottle within arm’s reach during study and work hours. Even mild dehydration of 1–2% body mass reduces cognitive stamina, concentration, and physical performance.',
    badge: 'Daily Habit'
  },
  {
    id: 'tip-2',
    category: 'Exercise',
    title: 'Post-Meal Walking for Glucose Stability',
    summary: 'A 10–15 minute walk after lunch or dinner flattens postprandial glucose spikes significantly.',
    details: 'Light contractions of large skeletal muscles (quadriceps and hamstrings) pull glucose out of systemic circulation without requiring insulin surge, protecting metabolic health.',
    badge: 'Metabolic Health'
  },
  {
    id: 'tip-3',
    category: 'Nutrition',
    title: 'The Balanced Plate Formula',
    summary: 'Design your meal with 50% colorful vegetables, 25% lean protein, and 25% complex carbohydrates.',
    details: 'Adequate protein provides satiety and prevents muscle loss, while colorful fibers feed gut microbiota and maintain sustained mental energy without afternoon crashes.',
    badge: 'Nutritional Balance'
  },
  {
    id: 'tip-4',
    category: 'Sleep',
    title: 'Circadian Sleep Consistency',
    summary: 'Going to bed and waking up within the same 30-minute window regulates melatonin cycles.',
    details: 'Avoid blue-light emitting screens 45 minutes before sleep. Maintain room darkness and slightly cooler ambient temperature for deep non-REM restorative sleep.',
    badge: 'Rest & Recovery'
  },
  {
    id: 'tip-5',
    category: 'General',
    title: 'Stress Regulation via Box Breathing',
    summary: 'Practice 4-4-4-4 cyclic breathing for 2 minutes to activate parasympathetic vagal tone.',
    details: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. Repeat 4 cycles whenever feeling study or exam fatigue.',
    badge: 'Mental Wellness'
  }
];

export const INITIAL_DEMO_WEIGHT_HISTORY: WeightRecord[] = [];

export const INITIAL_DEMO_WEEK_STATS: DayStats[] = [];

// Helper calculations
export function calculateBMI(weightKg: number, heightCm: number) {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, category: 'Unknown', color: 'text-slate-400', badgeColor: 'bg-slate-100 text-slate-700', idealMin: 0, idealMax: 0 };
  }
  const heightM = heightCm / 100;
  const bmiVal = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  let color = 'text-emerald-600';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (bmiVal < 18.5) {
    category = 'Underweight';
    color = 'text-amber-600';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
    category = 'Normal Weight';
    color = 'text-emerald-600';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (bmiVal >= 25.0 && bmiVal <= 29.9) {
    category = 'Overweight';
    color = 'text-orange-600';
    badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
  } else {
    category = 'Obese';
    color = 'text-rose-600';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  // Ideal weight range for 18.5 - 24.9 BMI
  const idealMin = Number((18.5 * heightM * heightM).toFixed(1));
  const idealMax = Number((24.9 * heightM * heightM).toFixed(1));

  return { bmi: bmiVal, category, color, badgeColor, idealMin, idealMax };
}

// MET formula: Calories = MET * Weight(kg) * (Duration(mins) / 60)
export function calculateCaloriesBurned(exerciseName: string, durationMinutes: number, weightKg: number) {
  const normWeight = weightKg > 0 ? weightKg : 70; // fallback to 70kg standard if not set
  let met = 4.5;
  let isEstimate = false;

  const matched = EXERCISE_MET_DATABASE[exerciseName];
  if (matched) {
    met = matched.met;
    isEstimate = exerciseName === 'Other';
  } else {
    // Custom exercise name
    const lower = exerciseName.toLowerCase();
    if (lower.includes('stair') || lower.includes('step')) met = 9.0;
    else if (lower.includes('run') || lower.includes('sprint')) met = 10.0;
    else if (lower.includes('walk')) met = 3.8;
    else if (lower.includes('hiit') || lower.includes('crossfit')) met = 8.5;
    else if (lower.includes('badminton') || lower.includes('tennis')) met = 6.5;
    else if (lower.includes('football') || lower.includes('cricket')) met = 6.0;
    else {
      met = 4.5;
      isEstimate = true;
    }
  }

  const hours = durationMinutes / 60;
  const burned = Math.round(met * normWeight * hours);

  return { calories: burned, met, isEstimate };
}

// Sleep duration calculation
export function parseSleepTime(bedtimeStr: string, wakeTimeStr: string): { hours: number; minutes: number; totalHours: number; display: string } {
  // bedtimeStr and wakeTimeStr can be in HH:MM 24hr or "11:00 PM" format
  function toMinutes(t: string): number {
    const clean = t.trim().toUpperCase();
    if (clean.includes('AM') || clean.includes('PM')) {
      const isPM = clean.includes('PM');
      const isAM = clean.includes('AM');
      const timePart = clean.replace(/[AP]M/, '').trim();
      const [hStr, mStr] = timePart.split(':');
      let h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;
      if (isPM && h !== 12) h += 12;
      if (isAM && h === 12) h = 0;
      return h * 60 + m;
    } else {
      const [hStr, mStr] = clean.split(':');
      return (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
    }
  }

  const bedMin = toMinutes(bedtimeStr);
  const wakeMin = toMinutes(wakeTimeStr);

  let diff = wakeMin - bedMin;
  if (diff < 0) {
    // Crosses midnight (e.g. 11:00 PM to 6:30 AM = 23:00 to 06:30)
    diff += 24 * 60;
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  const totalHours = Number((hours + minutes / 60).toFixed(2));
  const display = `${hours} hours ${minutes > 0 ? `${minutes} minutes` : ''}`.trim();

  return { hours, minutes, totalHours, display };
}
