import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  X,
  Flame,
  Droplets,
  Utensils,
  Moon,
  Scale,
  Target,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenModal: (modalId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenModal }) => {
  const {
    currentStep,
    setCurrentStep,
    setShowDailyReportModal,
    addWater,
    totalWaterMl,
    goals
  } = useHealth();

  const [showQuickSheet, setShowQuickSheet] = useState(false);
  const [quickWaterAdded, setQuickWaterAdded] = useState(false);

  const handleQuickAddWater = () => {
    addWater(250);
    setQuickWaterAdded(true);
    setTimeout(() => setQuickWaterAdded(false), 1500);
  };

  const handleAction = (modalId: string) => {
    setShowQuickSheet(false);
    if (currentStep !== 'dashboard') {
      setCurrentStep('dashboard');
    }
    onOpenModal(modalId);
  };

  return (
    <>
      {/* Quick Log Bottom Sheet Drawer */}
      {showQuickSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowQuickSheet(false)}
            aria-label="Close action sheet backdrop"
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-5 border-t border-slate-200 shadow-2xl z-10 space-y-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] animate-in slide-in-from-bottom duration-250">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">Quick Log Activity</h3>
              </div>
              <button
                onClick={() => setShowQuickSheet(false)}
                className="p-2 -mr-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick One-Tap Water Button */}
            <button
              onClick={handleQuickAddWater}
              className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between text-sm font-bold transition-all ${
                quickWaterAdded
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : 'bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <span>Quick Log 1 Glass Water (+250 ml)</span>
              </div>
              <span className="text-xs bg-white/80 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-200">
                {quickWaterAdded ? 'Added! 💧' : `${totalWaterMl} / ${goals.waterMl} ml`}
              </span>
            </button>

            {/* Grid of Logging Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleAction('exercise')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  🏃
                </div>
                <div>
                  <div className="font-bold text-slate-900">Workout</div>
                  <div className="text-[11px] text-orange-700">Log Calorie Burn</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('nutrition')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  🥗
                </div>
                <div>
                  <div className="font-bold text-slate-900">Meal / Food</div>
                  <div className="text-[11px] text-emerald-700">Macros & Calories</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('water')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-cyan-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  💧
                </div>
                <div>
                  <div className="font-bold text-slate-900">Custom Water</div>
                  <div className="text-[11px] text-cyan-700">Enter Exact Milliliters</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('sleep')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  😴
                </div>
                <div>
                  <div className="font-bold text-slate-900">Sleep Times</div>
                  <div className="text-[11px] text-indigo-700">Bedtime & Wake Duration</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('weight')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  ⚖️
                </div>
                <div>
                  <div className="font-bold text-slate-900">Log Weight</div>
                  <div className="text-[11px] text-purple-700">Update BMI Trend</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('goals')}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 font-semibold text-xs text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  🎯
                </div>
                <div>
                  <div className="font-bold text-slate-900">Health Goals</div>
                  <div className="text-[11px] text-amber-700">Custom Targets</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg md:hidden px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] no-print"
      >
        <div className="grid grid-cols-4 items-center justify-items-center max-w-md mx-auto">
          {/* Dashboard Tab */}
          <button
            id="mobile-nav-dashboard"
            onClick={() => setCurrentStep('dashboard')}
            className={`flex flex-col items-center justify-center min-h-[48px] w-full py-1 rounded-xl transition-colors ${
              currentStep === 'dashboard'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${currentStep === 'dashboard' ? 'text-emerald-600' : ''}`} />
            <span className="text-[10px] mt-0.5 leading-none">Dashboard</span>
          </button>

          {/* Quick Log FAB Button */}
          <button
            id="mobile-nav-quick-add"
            onClick={() => setShowQuickSheet(prev => !prev)}
            className="flex flex-col items-center justify-center min-h-[48px] w-full py-1 text-emerald-600 hover:text-emerald-700 active:scale-95 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 text-emerald-800 leading-none">Log</span>
          </button>

          {/* Daily Report Tab */}
          <button
            id="mobile-nav-report"
            onClick={() => setShowDailyReportModal(true)}
            className="flex flex-col items-center justify-center min-h-[48px] w-full py-1 text-slate-500 hover:text-emerald-700 active:scale-95 transition-colors relative"
          >
            <div className="relative">
              <FileText className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <span className="text-[10px] mt-0.5 leading-none font-medium">Report ⭐</span>
          </button>

          {/* Profile / Biometrics Tab */}
          <button
            id="mobile-nav-profile"
            onClick={() => setCurrentStep('basic-info')}
            className={`flex flex-col items-center justify-center min-h-[48px] w-full py-1 rounded-xl transition-colors ${
              currentStep === 'basic-info'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 ${currentStep === 'basic-info' ? 'text-emerald-600' : ''}`} />
            <span className="text-[10px] mt-0.5 leading-none">Biometrics</span>
          </button>
        </div>
      </nav>
    </>
  );
};
