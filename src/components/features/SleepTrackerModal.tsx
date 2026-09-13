import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { parseSleepTime } from '../../data/mockAndReferenceData';
import { Moon, Clock, Check, X, Sparkles, ShieldCheck } from 'lucide-react';

interface SleepTrackerModalProps {
  onClose: () => void;
}

export const SleepTrackerModal: React.FC<SleepTrackerModalProps> = ({ onClose }) => {
  const { sleepRecord, saveSleepRecord, goals } = useHealth();

  const [bedtime, setBedtime] = useState(sleepRecord.bedtime || '11:00 PM');
  const [wakeTime, setWakeTime] = useState(sleepRecord.wakeTime || '06:30 AM');
  const [calculated, setCalculated] = useState<{
    hours: number;
    minutes: number;
    totalHours: number;
    display: string;
  } | null>({
    hours: sleepRecord.hours,
    minutes: sleepRecord.minutes,
    totalHours: sleepRecord.totalHours,
    display: `${sleepRecord.hours} hours ${sleepRecord.minutes > 0 ? `${sleepRecord.minutes} minutes` : ''}`,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCalculateSleep = () => {
    const result = parseSleepTime(bedtime, wakeTime);
    setCalculated(result);
  };

  const handleSave = () => {
    saveSleepRecord(bedtime, wakeTime);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const currentTotalHours = calculated ? calculated.totalHours : sleepRecord.totalHours;
  const goalTarget = goals.sleepHours || 8;
  const progressPercent = Math.min(100, Math.round((currentTotalHours / goalTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Sleep Tracking</h2>
              <p className="text-xs text-slate-500">Circadian rhythm & duration analysis</p>
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

        {/* Inputs */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bedtime
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-sleep-bedtime"
                  type="text"
                  value={bedtime}
                  onChange={e => {
                    setBedtime(e.target.value);
                    setCalculated(null);
                  }}
                  placeholder="11:00 PM"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
              <span className="text-[10px] text-slate-600">e.g. 11:00 PM or 23:00</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Wake-up Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-sleep-waketime"
                  type="text"
                  value={wakeTime}
                  onChange={e => {
                    setWakeTime(e.target.value);
                    setCalculated(null);
                  }}
                  placeholder="6:30 AM"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
              <span className="text-[10px] text-slate-600">e.g. 6:30 AM or 06:30</span>
            </div>
          </div>

          <button
            id="btn-calculate-sleep"
            type="button"
            onClick={handleCalculateSleep}
            className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Moon className="w-4 h-4" />
            <span>Calculate Sleep</span>
          </button>

          {/* Result Card (exact format from user prompt) */}
          {calculated && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-base sm:text-lg">
                <span className="text-2xl">😴</span>
                <span>You slept for {calculated.display}.</span>
              </div>

              {/* Sleep Goal recommendation */}
              <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Sleep Goal</span>
                  <span className="text-slate-500 font-medium">
                    Recommended personal target: 7–9 hours
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-900">
                    Progress: {calculated.totalHours} / {goalTarget} hours
                  </span>
                  <span className="text-indigo-600 font-bold">{progressPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
              </div>

              <button
                id="btn-save-sleep"
                type="button"
                onClick={handleSave}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sleep Record Saved!</span>
                  </>
                ) : (
                  <span>Save Sleep Record</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
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
