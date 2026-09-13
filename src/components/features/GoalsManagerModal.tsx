import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Target, Check, X, Droplets, Flame, Moon, Utensils } from 'lucide-react';

interface GoalsManagerModalProps {
  onClose: () => void;
}

export const GoalsManagerModal: React.FC<GoalsManagerModalProps> = ({ onClose }) => {
  const {
    goals,
    updateGoals,
    totalWaterMl,
    totalExerciseMinutes,
    sleepRecord,
    totalNutrition
  } = useHealth();

  const [waterL, setWaterL] = useState<number>(Number((goals.waterMl / 1000).toFixed(1)));
  const [exerciseMin, setExerciseMin] = useState<number>(goals.exerciseMinutes);
  const [sleepH, setSleepH] = useState<number>(goals.sleepHours);
  const [calTarget, setCalTarget] = useState<number>(goals.caloriesTarget);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoals({
      waterMl: Math.round(waterL * 1000),
      exerciseMinutes: Number(exerciseMin),
      sleepHours: Number(sleepH),
      caloriesTarget: Number(calTarget),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Live progress metrics
  const waterPct = Math.min(100, Math.round((totalWaterMl / (waterL * 1000)) * 100));
  const exercisePct = Math.min(100, Math.round((totalExerciseMinutes / exerciseMin) * 100));
  const sleepPct = Math.min(100, Math.round((sleepRecord.totalHours / sleepH) * 100));
  const nutritionPct = Math.min(100, Math.round((totalNutrition.calories / calTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Daily Health Goals</h2>
              <p className="text-xs text-slate-500">Configure personal wellness targets</p>
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
        <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {/* Today's Goals Progress Card (exact format from user prompt) */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                🎯 Today&apos;s Goal Attainment
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
            </div>

            {/* Water Goal Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Droplets className="w-3.5 h-3.5" /> Water
                </span>
                <span>{(totalWaterMl / 1000).toFixed(1)} / {waterL} L ({waterPct}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
            </div>

            {/* Exercise Goal Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-orange-300">
                  <Flame className="w-3.5 h-3.5" /> Exercise
                </span>
                <span>{totalExerciseMinutes} / {exerciseMin} min ({exercisePct}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${exercisePct}%` }}
                />
              </div>
            </div>

            {/* Sleep Goal Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Moon className="w-3.5 h-3.5" /> Sleep
                </span>
                <span>{sleepRecord.totalHours} / {sleepH} hrs ({sleepPct}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${sleepPct}%` }}
                />
              </div>
            </div>

            {/* Nutrition Goal Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Utensils className="w-3.5 h-3.5" /> Nutrition Calories
                </span>
                <span>{totalNutrition.calories} / {calTarget} kcal ({nutritionPct}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${nutritionPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Goal Adjustment Inputs */}
          <form onSubmit={handleSaveGoals} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Set Daily Health Targets
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Water Target (Liters/day)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="6.0"
                  value={waterL}
                  onChange={e => setWaterL(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Exercise Target (min/day)
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  step="5"
                  value={exerciseMin}
                  onChange={e => setExerciseMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Sleep Target (hours/day)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="5.0"
                  max="12.0"
                  value={sleepH}
                  onChange={e => setSleepH(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Calorie Target (kcal/day)
                </label>
                <input
                  type="number"
                  min="1200"
                  max="4000"
                  step="50"
                  value={calTarget}
                  onChange={e => setCalTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white min-h-[44px]"
                />
              </div>
            </div>

            <button
              id="btn-save-goals"
              type="submit"
              className={`w-full py-3 px-4 min-h-[44px] rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                savedSuccess ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Goals Updated Successfully!</span>
                </>
              ) : (
                <span>Save Daily Goals</span>
              )}
            </button>
          </form>
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
