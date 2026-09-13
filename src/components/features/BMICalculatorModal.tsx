import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Heart, Activity, Ruler, Scale, X, Info } from 'lucide-react';

interface BMICalculatorModalProps {
  onClose: () => void;
}

export const BMICalculatorModal: React.FC<BMICalculatorModalProps> = ({ onClose }) => {
  const { profile, bmiData } = useHealth();

  // BMR calculation (Mifflin-St Jeor formula)
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const isMale = profile.gender === 'Male';
  const bmr = Math.round(
    10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (isMale ? 5 : -161)
  );
  const maintenanceCalories = Math.round(bmr * 1.375); // Light active multiplier

  // Calculate percentage pointer on BMI bar (from 15 to 35)
  const clampedBmi = Math.min(35, Math.max(15, bmiData.bmi));
  const pointerPercent = ((clampedBmi - 15) / (35 - 15)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">BMI & Metabolic Analysis</h2>
              <p className="text-xs text-slate-500">Body Mass Index & Energy Expenditure</p>
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
          {/* Main BMI Score Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center relative overflow-hidden">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Body Mass Index
            </div>
            <div className="text-5xl font-black mt-1 text-white tracking-tight">
              {bmiData.bmi}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/10 text-white border border-white/20">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Category: {bmiData.category}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-around text-xs text-slate-300">
              <span>Height: <strong className="text-white">{profile.height} cm</strong></span>
              <span>Weight: <strong className="text-white">{profile.weight} kg</strong></span>
              <span>Age: <strong className="text-white">{profile.age} yrs</strong></span>
            </div>
          </div>

          {/* Visual BMI Gauge Spectrum */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>BMI Spectrum Indicator</span>
              <span className="font-mono text-slate-500">{bmiData.bmi} kg/m²</span>
            </div>

            {/* Spectrum Bar */}
            <div className="relative pt-4 pb-2">
              {/* Pointer */}
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                style={{ left: `${pointerPercent}%` }}
              >
                <div className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                  {bmiData.bmi}
                </div>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900" />
              </div>

              {/* Color segments */}
              <div className="h-3.5 rounded-full flex overflow-hidden shadow-inner">
                <div className="bg-amber-400 w-[17.5%]" title="Underweight (<18.5)" />
                <div className="bg-emerald-500 w-[32%]" title="Normal (18.5-24.9)" />
                <div className="bg-orange-500 w-[25%]" title="Overweight (25-29.9)" />
                <div className="bg-rose-600 w-[25.5%]" title="Obese (≥30)" />
              </div>

              {/* Range labels */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-600 mt-1.5">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5-24.9)</span>
                <span>Overweight (25-29.9)</span>
                <span>Obese (&ge;30)</span>
              </div>
            </div>
          </div>

          {/* Ideal Weight & Basal Metabolism */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Healthy Weight Range
              </span>
              <div className="text-lg font-black text-slate-900 mt-1">
                {bmiData.idealMin} – {bmiData.idealMax} kg
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                Based on WHO BMI guidelines (18.5 to 24.9) for {profile.height} cm height.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Estimated BMR
              </span>
              <div className="text-lg font-black text-indigo-600 mt-1">
                {bmr.toLocaleString()} kcal/day
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                Basal rate at rest. Maintenance approx: <strong>{maintenanceCalories} kcal</strong>.
              </p>
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
