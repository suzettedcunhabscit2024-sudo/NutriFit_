import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Droplets, Plus, Trash2, X, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerModalProps {
  onClose: () => void;
}

export const WaterTrackerModal: React.FC<WaterTrackerModalProps> = ({ onClose }) => {
  const { waterLogs, addWater, removeWater, resetWater, totalWaterMl, goals } = useHealth();
  const [inputMl, setInputMl] = useState<number>(250);

  const goalMl = goals.waterMl || 2500;
  const currentL = (totalWaterMl / 1000).toFixed(1);
  const goalL = (goalMl / 1000).toFixed(1);
  const percentage = Math.min(100, Math.round((totalWaterMl / goalMl) * 100));

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputMl > 0) {
      addWater(inputMl);
      if (totalWaterMl + inputMl >= goalMl && totalWaterMl < goalMl) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  const handleQuickAdd = (amount: number) => {
    addWater(amount);
    if (totalWaterMl + amount >= goalMl && totalWaterMl < goalMl) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Hydration Tracking</h2>
              <p className="text-xs text-slate-500">Monitor fluid balance & daily water intake</p>
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
        <div className="overflow-y-auto py-3 sm:py-4 space-y-4 sm:space-y-5 flex-1 pr-1">
          {/* Main Visual Progress Card (matching user prompt) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <span className="text-xl sm:text-2xl font-black">
                  {currentL} L <span className="text-sm sm:text-base font-normal text-cyan-100">/ {goalL} L</span>
                </span>
              </div>
              <span className="text-xs font-extrabold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-white">
                {percentage}% Done
              </span>
            </div>

            {/* Graphical Progress Bar (Prompt: ████████████████░░░) */}
            <div className="mt-4 w-full bg-cyan-900/40 rounded-full h-3.5 p-0.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-cyan-100">
              <span>{totalWaterMl} ml logged</span>
              <span>Target: {goalMl} ml</span>
            </div>
          </div>

          {/* User Input Section (How much water did you drink?) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              How much water did you drink?
            </label>

            <form onSubmit={handleAddCustom} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="input-water-ml"
                  type="number"
                  min="50"
                  max="3000"
                  step="50"
                  value={inputMl}
                  onChange={e => setInputMl(Number(e.target.value))}
                  placeholder="250"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white min-h-[44px]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ml
                </span>
              </div>

              <button
                id="btn-add-water"
                type="submit"
                className="px-4 sm:px-5 py-2.5 min-h-[44px] rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add</span>
              </button>
            </form>

            {/* Quick Add Presets */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '+150 ml Cup', amount: 150 },
                { label: '+250 ml Glass', amount: 250 },
                { label: '+500 ml Bottle', amount: 500 },
                { label: '+750 ml Flask', amount: 750 },
              ].map(chip => (
                <button
                  key={chip.amount}
                  type="button"
                  onClick={() => handleQuickAdd(chip.amount)}
                  className="p-2 min-h-[40px] rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-800 transition-colors text-center"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Water Addition History List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Today&apos;s Water Log ({waterLogs.length} entries)
              </h3>
              {waterLogs.length > 0 && (
                <button
                  onClick={resetWater}
                  className="text-xs text-slate-600 hover:text-rose-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Today</span>
                </button>
              )}
            </div>

            {waterLogs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No water logged yet today. Click &ldquo;+ Add&rdquo; to start tracking!
              </div>
            ) : (
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200 space-y-1.5 max-h-48 overflow-y-auto">
                {waterLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white border border-slate-100 text-xs text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-600 font-bold">
                        {index === 0 ? '' : '+ '}
                        {log.amountMl} ml
                      </span>
                      <span className="text-[10px] text-slate-600">at {log.timestamp}</span>
                    </div>

                    <button
                      onClick={() => removeWater(log.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900 px-2">
                  <span>Total Recorded Intake</span>
                  <span className="text-cyan-700">{totalWaterMl.toLocaleString()} ml</span>
                </div>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
