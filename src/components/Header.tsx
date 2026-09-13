import React from 'react';
import { useHealth } from '../context/HealthContext';
import { FileText, RotateCcw, User, HeartPulse, LogOut, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    profile,
    bmiData,
    setShowDailyReportModal,
    resetToCleanSlate,
    dailyHealthScore,
    currentUser,
    logout
  } = useHealth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            id="brand-logo"
            onClick={() => setCurrentStep('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-emerald-100/80 bg-white group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <img
                src="/nutrifit-logo.png"
                alt="NutriFit Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  Nutri<span className="text-[#65a30d]">Fit</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none">
                Track • Nourish • Be Your Best
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (when user has completed info) */}
          {profile.hasCompletedBasicInfo && currentStep === 'dashboard' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100/90 py-1.5 px-3 rounded-full border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700">{profile.name || currentUser?.displayName || 'User'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-800">Ht: <strong className="text-slate-900">{profile.height} cm</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-800">Wt: <strong className="text-slate-900">{profile.weight} kg</strong></span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1">
                BMI: <strong className={bmiData.color}>{bmiData.bmi}</strong>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${bmiData.badgeColor}`}>
                  {bmiData.category}
                </span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                Score: {dailyHealthScore}%
              </span>
            </div>
          )}

          {/* Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentStep === 'dashboard' && (
              <button
                id="btn-nav-daily-report"
                onClick={() => setShowDailyReportModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-700/20 transition-all hover:shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daily Report</span>
                <span className="sm:hidden">Report</span>
                <span className="bg-emerald-500/50 text-[10px] px-1 rounded">⭐</span>
              </button>
            )}

            {/* User Auth Info & Logout / Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[120px] truncate">{currentUser.displayName || currentUser.email}</span>
                </div>
                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  title="Sign out from Firebase"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-signin"
                onClick={() => setCurrentStep('auth')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <button
              id="btn-reset-clean"
              onClick={resetToCleanSlate}
              title="Reset view to start"
              className="flex items-center p-1.5 text-xs font-medium rounded-lg text-slate-500 hover:text-rose-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="sr-only">Reset</span>
            </button>

            {/* Step Navigation Indicator */}
            {currentStep !== 'dashboard' ? (
              <button
                id="btn-nav-dashboard"
                onClick={() => setCurrentStep('dashboard')}
                className="text-xs font-medium text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <button
                id="btn-nav-home"
                onClick={() => setCurrentStep('home')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
