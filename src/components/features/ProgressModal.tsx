import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { TrendingUp, Activity, Flame, Droplets, Moon, Utensils, Scale, Heart, X } from 'lucide-react';

interface ProgressModalProps {
  onClose: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ onClose }) => {
  const {
    totalNutrition,
    totalCaloriesBurned,
    totalWaterMl,
    goals,
    totalExerciseMinutes,
    sleepRecord,
    profile,
    bmiData,
    weekStats
  } = useHealth();

  const [activeChartTab, setActiveChartTab] = useState<'calories' | 'water' | 'exercise'>('calories');

  const netCalories = totalNutrition.calories - totalCaloriesBurned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Health & Activity Progress</h2>
              <p className="text-xs text-slate-500">Holistic performance & multi-day trends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {/* Key Summary Cards (Exact items requested in user prompt) */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Today&apos;s Aggregate Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Calories Consumed vs Burned */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Calories (Intake/Burn)</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {totalNutrition.calories} <span className="text-xs font-normal text-slate-500">in</span>
                </div>
                <div className="text-xs font-bold text-orange-600">
                  Burned: {totalCaloriesBurned} kcal
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Net: {netCalories > 0 ? `+${netCalories}` : netCalories} kcal
                </div>
              </div>

              {/* Water */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span>Water Intake</span>
                </div>
                <div className="text-lg font-black text-cyan-800">
                  {(totalWaterMl / 1000).toFixed(1)} / {(goals.waterMl / 1000).toFixed(1)} L
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {Math.round((totalWaterMl / goals.waterMl) * 100)}% of daily goal
                </div>
              </div>

              {/* Exercise */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Exercise Duration</span>
                </div>
                <div className="text-lg font-black text-emerald-700">
                  {totalExerciseMinutes} <span className="text-xs font-normal text-slate-500">minutes</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Target: {goals.exerciseMinutes} minutes
                </div>
              </div>

              {/* Sleep */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Sleep Duration</span>
                </div>
                <div className="text-lg font-black text-indigo-800">
                  {sleepRecord.hours}h {sleepRecord.minutes}m
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {sleepRecord.bedtime} → {sleepRecord.wakeTime}
                </div>
              </div>

              {/* Weight */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Body Weight</span>
                </div>
                <div className="text-lg font-black text-purple-900">
                  {profile.weight} <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Height: {profile.height} cm
                </div>
              </div>

              {/* BMI */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Calculated BMI</span>
                </div>
                <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                  <span>{bmiData.bmi}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${bmiData.badgeColor}`}>
                    {bmiData.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Healthy: {bmiData.idealMin}-{bmiData.idealMax} kg
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Trend Chart (Charts showing user's previous days) */}
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                📈 7-Day Performance Trends
              </span>

              {/* Chart tabs */}
              <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setActiveChartTab('calories')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeChartTab === 'calories' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Calories
                </button>
                <button
                  onClick={() => setActiveChartTab('water')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeChartTab === 'water' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Water
                </button>
                <button
                  onClick={() => setActiveChartTab('exercise')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeChartTab === 'exercise' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exercise
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-2">
              {activeChartTab === 'calories' && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                    <span>Intake (Orange) vs Exercise Burn (Green) [kcal]</span>
                    <span className="text-emerald-400 font-bold">Today: +{totalNutrition.calories} / -{totalCaloriesBurned}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-slate-800 pb-1">
                    {weekStats.map(day => {
                      const intakeHeight = Math.min(100, Math.round((day.caloriesConsumed / 2200) * 100));
                      const burnHeight = Math.min(100, Math.round((day.caloriesBurned / 600) * 100));
                      return (
                        <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                          <div className="flex gap-1 items-end h-full">
                            <div
                              className="w-2.5 sm:w-4 bg-orange-400/80 rounded-t-sm transition-all"
                              style={{ height: `${intakeHeight}%` }}
                              title={`${day.date} Intake: ${day.caloriesConsumed} kcal`}
                            />
                            <div
                              className="w-2.5 sm:w-4 bg-emerald-400/90 rounded-t-sm transition-all"
                              style={{ height: `${burnHeight}%` }}
                              title={`${day.date} Burned: ${day.caloriesBurned} kcal`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 font-medium">{day.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeChartTab === 'water' && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                    <span>Daily Water Intake [ml] vs 2,500 ml Target</span>
                    <span className="text-cyan-400 font-bold">Today: {totalWaterMl} ml</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-slate-800 pb-1">
                    {weekStats.map(day => {
                      const ml = day.date === 'Today' ? totalWaterMl : day.waterMl;
                      const heightPct = Math.min(100, Math.round((ml / 3000) * 100));
                      return (
                        <div key={day.date} className="flex flex-col items-center h-full justify-end">
                          <div className="text-[9px] text-cyan-300 font-mono mb-1">{(ml / 1000).toFixed(1)}L</div>
                          <div
                            className="w-5 sm:w-7 bg-cyan-400 rounded-t-sm transition-all"
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[10px] text-slate-400 mt-1 font-medium">{day.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeChartTab === 'exercise' && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                    <span>Active Workout Time [minutes]</span>
                    <span className="text-amber-400 font-bold">Today: {totalExerciseMinutes} min</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-slate-800 pb-1">
                    {weekStats.map(day => {
                      const mins = day.date === 'Today' ? totalExerciseMinutes : day.exerciseMinutes;
                      const heightPct = Math.min(100, Math.round((mins / 100) * 100));
                      return (
                        <div key={day.date} className="flex flex-col items-center h-full justify-end">
                          <div className="text-[9px] text-amber-300 font-mono mb-1">{mins}m</div>
                          <div
                            className="w-5 sm:w-7 bg-amber-400 rounded-t-sm transition-all"
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[10px] text-slate-400 mt-1 font-medium">{day.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
