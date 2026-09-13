import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { calculateBMI } from '../../data/mockAndReferenceData';
import { Scale, TrendingDown, TrendingUp, Plus, X, Activity, Check } from 'lucide-react';

interface WeightTrackerModalProps {
  onClose: () => void;
}

export const WeightTrackerModal: React.FC<WeightTrackerModalProps> = ({ onClose }) => {
  const { profile, weightHistory, addWeightRecord, currentWeight, previousWeight, weightChange, bmiData } = useHealth();

  const [inputWeight, setInputWeight] = useState<number>(profile.weight);
  const [justUpdated, setJustUpdated] = useState<boolean>(false);

  const handleUpdateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWeight > 0) {
      addWeightRecord(Number(inputWeight));
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    }
  };

  // Prepare graph points
  const points = weightHistory.map((rec, i) => ({
    x: i,
    date: rec.date,
    weight: rec.weight,
  }));

  const weights = points.map(p => p.weight);
  const minW = Math.floor(Math.min(...weights, 65) - 2);
  const maxW = Math.ceil(Math.max(...weights, 75) + 2);
  const range = maxW - minW || 1;

  // SVG dimensions
  const svgWidth = 440;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const getCoordinates = (index: number, weightVal: number) => {
    const x = paddingX + (index / Math.max(1, points.length - 1)) * plotWidth;
    const y = svgHeight - paddingY - ((weightVal - minW) / range) * plotHeight;
    return { x, y };
  };

  const pathD = points
    .map((p, idx) => {
      const { x, y } = getCoordinates(idx, p.weight);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = points.length > 0
    ? `${pathD} L ${getCoordinates(points.length - 1, points[points.length - 1].weight).x} ${svgHeight - paddingY} L ${paddingX} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Weight & Body Metrics</h2>
              <p className="text-xs text-slate-500">Track weight history, delta & BMI updates</p>
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
          {/* Weight Delta Card (matching user prompt) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Previous Weight</span>
                <strong className="text-lg font-extrabold text-slate-700 mt-0.5 block">
                  {previousWeight} kg
                </strong>
              </div>

              <div className="p-3 bg-white rounded-lg border-2 border-purple-200">
                <span className="text-[11px] text-purple-700 uppercase font-bold block">Current Weight</span>
                <strong className="text-xl font-black text-purple-950 mt-0.5 block">
                  {currentWeight} kg
                </strong>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Net Change</span>
                <div className="mt-0.5 flex items-center justify-center gap-1">
                  {weightChange < 0 ? (
                    <span className="text-lg font-black text-emerald-600 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-0.5" />
                      {weightChange} kg
                    </span>
                  ) : weightChange > 0 ? (
                    <span className="text-lg font-black text-rose-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-0.5" />
                      +{weightChange} kg
                    </span>
                  ) : (
                    <span className="text-lg font-black text-slate-600">0.0 kg</span>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic BMI Notice */}
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="w-4 h-4 text-emerald-600" />
                Updated BMI for Height ({profile.height} cm):
              </span>
              <span className="font-extrabold text-emerald-800">
                {bmiData.bmi} ({bmiData.category})
              </span>
            </div>
          </div>

          {/* Form to Update Weight */}
          <form onSubmit={handleUpdateWeight} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Log Today&apos;s Body Weight
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="input-new-weight"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  required
                  value={inputWeight}
                  onChange={e => setInputWeight(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[44px]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>

              <button
                id="btn-update-weight"
                type="submit"
                className={`px-4 sm:px-5 py-2.5 min-h-[44px] rounded-xl font-bold text-sm shadow-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  justUpdated ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {justUpdated ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Update Weight</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Weight Progress Graph: Date → Weight (Requested explicitly in user prompt!) */}
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                📈 Weight Progress Graph (Date → Weight)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {minW} kg to {maxW} kg range
              </span>
            </div>

            <div className="w-full overflow-x-auto py-1">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-44">
                {/* Defs for gradient */}
                <defs>
                  <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0, 0.5, 1].map(ratio => {
                  const y = paddingY + plotHeight * ratio;
                  const labelWeight = (maxW - ratio * range).toFixed(0);
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="3 3"
                      />
                      <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="9">
                        {labelWeight}k
                      </text>
                    </g>
                  );
                })}

                {/* Area under curve */}
                {areaD && <path d={areaD} fill="url(#weightAreaGrad)" />}

                {/* Line path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points & labels */}
                {points.map((pt, i) => {
                  const { x, y } = getCoordinates(i, pt.weight);
                  return (
                    <g key={pt.date}>
                      <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#9333ea" strokeWidth="2" />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fill="#f1f5f9"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {pt.weight}
                      </text>
                      <text
                        x={x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                      >
                        {pt.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-[11px] text-slate-400 mt-2 text-center">
              Visual weight tracking shows steady trajectory towards target weight.
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
