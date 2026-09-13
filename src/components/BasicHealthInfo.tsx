import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { calculateBMI } from '../data/mockAndReferenceData';
import { User, Activity, ArrowRight, CheckCircle2, Heart, Scale, Ruler, Sparkles } from 'lucide-react';

export const BasicHealthInfo: React.FC = () => {
  const { profile, updateProfile, setCurrentStep } = useHealth();

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState<number | string>(profile.age || '');
  const [gender, setGender] = useState(profile.gender || 'Male');
  const [height, setHeight] = useState<number | string>(profile.height || '');
  const [weight, setWeight] = useState<number | string>(profile.weight || '');

  // Live BMI calculation
  const calculatedBMI = weight && height ? calculateBMI(Number(weight), Number(height)) : null;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim() || 'Health Enthusiast',
      age: Number(age) || 25,
      gender,
      height: Number(height) || 170,
      weight: Number(weight) || 65,
      hasCompletedBasicInfo: true,
    });
    setCurrentStep('dashboard');
  };

  return (
    <div className="pt-4 pb-28 sm:py-12 max-w-2xl mx-auto px-3 sm:px-4">
      {/* Workflow Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 mb-5">
        <span className="text-slate-400">Home</span>
        <span>→</span>
        <span className="text-slate-400">Register</span>
        <span>→</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Step 1: Basic Info
        </span>
        <span>→</span>
        <span className="text-slate-400">Dashboard</span>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              STEP 1 OF THE WORKFLOW
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">NutriFit Baseline Calibration</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mt-2">
            Enter Your Basic Health Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            NutriFit uses your anthropometric metrics to compute BMI, calculate MET-based exercise calorie burn, and calibrate daily hydration targets.
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-info-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Suzette D'Cunha"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age (years)
              </label>
              <input
                id="input-info-age"
                type="number"
                min="10"
                max="120"
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                id="select-info-gender"
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800 bg-white min-h-[44px]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Height (cm)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setHeight(prev => Math.max(100, Number(prev) - 1))}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center"
                    aria-label="Decrease height"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeight(prev => Math.min(240, Number(prev) + 1))}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center"
                    aria-label="Increase height"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="relative">
                <Ruler className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-info-height"
                  type="number"
                  min="80"
                  max="250"
                  step="0.5"
                  required
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  placeholder="165"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {height ? `${(Number(height) / 30.48).toFixed(1)} feet approx.` : 'Enter your height in centimeters'}
              </p>
            </div>

            {/* Weight */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Weight (kg)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWeight(prev => Math.max(30, (Number(prev) || 60) - 0.5))}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center"
                    aria-label="Decrease weight"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeight(prev => Math.min(250, (Number(prev) || 60) + 0.5))}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center"
                    aria-label="Increase weight"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="relative">
                <Scale className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-info-weight"
                  type="number"
                  min="20"
                  max="300"
                  step="0.5"
                  required
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {weight ? `${(Number(weight) * 2.20462).toFixed(1)} lbs approx.` : 'Enter your weight in kilograms'}
              </p>
            </div>
          </div>

          {/* DYNAMIC CALCULATION CARD (Requested in prompt) */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Instant Calculated Baseline
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {height && weight ? `Height: ${height} cm • Weight: ${weight} kg` : 'Awaiting measurements'}
              </span>
            </div>

            {calculatedBMI ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-700 font-medium">Your BMI</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5 flex items-baseline gap-2">
                    <span>{calculatedBMI.bmi}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${calculatedBMI.badgeColor}`}>
                      {calculatedBMI.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-700 font-medium">Ideal Normal Weight</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {calculatedBMI.idealMin} – {calculatedBMI.idealMax} kg
                  </div>
                  <div className="text-[10px] text-slate-600">For {height} cm height</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-700 font-medium">Daily Water Target</div>
                  <div className="text-sm font-bold text-cyan-800 mt-1">
                    2.5 Liters / day
                  </div>
                  <div className="text-[10px] text-slate-600">Hydration baseline</div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-500 text-xs">
                Fill in your height and weight above to compute your live BMI and recommended weight range.
              </div>
            )}

            <p className="text-xs text-slate-600 mt-3 italic">
              &ldquo;This information becomes the basis for some of the later calculations.&rdquo;
            </p>
          </div>

          {/* Prominent Continue Button */}
          <button
            id="btn-info-continue"
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard →</span>
          </button>
        </form>
      </div>
    </div>
  );
};
