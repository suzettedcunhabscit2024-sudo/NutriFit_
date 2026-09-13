import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { EXERCISE_MET_DATABASE, calculateCaloriesBurned } from '../../data/mockAndReferenceData';
import { Flame, Activity, Plus, Trash2, X, Info, Check } from 'lucide-react';

interface ExerciseTrackerModalProps {
  onClose: () => void;
}

export const ExerciseTrackerModal: React.FC<ExerciseTrackerModalProps> = ({ onClose }) => {
  const { profile, addExercise, exercises, removeExercise, totalExerciseMinutes, totalCaloriesBurned } = useHealth();

  const [selectedExercise, setSelectedExercise] = useState('Walking');
  const [customExerciseName, setCustomExerciseName] = useState('Running stairs');
  const [durationMinutes, setDurationMinutes] = useState(45);

  const [calculatedResult, setCalculatedResult] = useState<{
    calories: number;
    met: number;
    isEstimate: boolean;
  } | null>({
    calories: 180,
    met: 3.5,
    isEstimate: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const exerciseOptions = [
    'Walking',
    'Running',
    'Cycling',
    'Swimming',
    'Yoga',
    'Gym',
    'Dancing',
    'Skipping',
    'Other',
  ];

  const handleCalculate = () => {
    const actName = selectedExercise === 'Other' ? customExerciseName.trim() || 'Other Activity' : selectedExercise;
    const res = calculateCaloriesBurned(actName, durationMinutes, profile.weight);
    setCalculatedResult(res);
  };

  const handleSaveActivity = () => {
    const actName = selectedExercise === 'Other' ? customExerciseName.trim() || 'Other Activity' : selectedExercise;
    addExercise(actName, durationMinutes, selectedExercise === 'Other');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Exercise Tracking</h2>
              <p className="text-xs text-slate-500">Calculate caloric expenditure & log workouts</p>
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

        {/* Content Scrollable */}
        <div className="overflow-y-auto py-3 sm:py-4 space-y-4 sm:space-y-5 flex-1 pr-1">
          {/* Calorie Calculator Section */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              What exercise did you do?
            </h3>

            <div className="space-y-3">
              {/* Exercise Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Select Exercise
                </label>
                <select
                  id="select-exercise-type"
                  value={selectedExercise}
                  onChange={e => {
                    setSelectedExercise(e.target.value);
                    setCalculatedResult(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-slate-800 min-h-[44px]"
                >
                  {exerciseOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* If "Other" selected */}
              {selectedExercise === 'Other' && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Enter Exercise Name
                  </label>
                  <input
                    id="input-custom-exercise"
                    type="text"
                    value={customExerciseName}
                    onChange={e => {
                      setCustomExerciseName(e.target.value);
                      setCalculatedResult(null);
                    }}
                    placeholder="e.g. Running stairs"
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-800 min-h-[44px]"
                  />
                  <div className="flex items-start gap-1.5 mt-2 text-[11px] text-amber-800">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      For activities outside our core database, NutriFit uses an estimated metabolic equivalent (MET).
                    </span>
                  </div>
                </div>
              )}

              {/* Duration and Weight row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    id="input-exercise-duration"
                    type="number"
                    min="1"
                    max="600"
                    value={durationMinutes}
                    onChange={e => {
                      setDurationMinutes(Math.max(1, Number(e.target.value)));
                      setCalculatedResult(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-slate-800 font-medium min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    User Weight (kg)
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 min-h-[44px] flex items-center">
                    {profile.weight} kg
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                id="btn-calculate-calories"
                type="button"
                onClick={handleCalculate}
                className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>Calculate Calories</span>
              </button>
            </div>

            {/* Result Display Banner */}
            {calculatedResult && (
              <div className="mt-4 p-4 rounded-xl bg-white border-2 border-orange-300 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-baseline justify-between">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Result
                  </div>
                  {calculatedResult.isEstimate && (
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Approximate Estimation
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-orange-600">
                    🔥 Estimated Calories Burned:
                  </span>
                  <span className="text-3xl font-black text-slate-900">
                    {calculatedResult.calories} <span className="text-base font-semibold text-slate-600">kcal</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-2">
                  Calorie expenditure formula: MET ({calculatedResult.met}) × Weight ({profile.weight} kg) × Duration ({(durationMinutes / 60).toFixed(2)} hrs).
                </p>

                {/* Save Activity Button */}
                <button
                  id="btn-save-activity"
                  type="button"
                  onClick={handleSaveActivity}
                  className={`w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                    saveSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Today&apos;s Report!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save Activity</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Today's Logged Activities List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Today&apos;s Recorded Activities ({exercises.length})
              </h3>
              <div className="text-xs font-bold text-orange-600">
                Total: {totalExerciseMinutes} min • {totalCaloriesBurned} kcal
              </div>
            </div>

            {exercises.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500">
                No exercise recorded today. Use the calculator above to add an activity!
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.map(ex => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                        🏃
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ex.exerciseName}</span>
                          {ex.isCustom && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              custom
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {ex.durationMinutes} min • {ex.timestamp}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-orange-600">
                        {ex.caloriesBurned} kcal
                      </span>
                      <button
                        onClick={() => removeExercise(ex.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
