/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { AuthView } from './components/AuthView';
import { BasicHealthInfo } from './components/BasicHealthInfo';
import { Dashboard } from './components/Dashboard';
import { DailyReportModal } from './components/features/DailyReportModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeartPulse, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    showDailyReportModal,
    setShowDailyReportModal,
    setActiveFeatureTab
  } = useHealth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-16 md:pb-0">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentStep === 'home' && <HomeHero />}
        {currentStep === 'auth' && <AuthView />}
        {currentStep === 'basic-info' && <BasicHealthInfo />}
        {currentStep === 'dashboard' && <Dashboard />}
      </main>

      {/* Global Daily Report Modal (Star Feature ⭐) */}
      {showDailyReportModal && (
        <DailyReportModal onClose={() => setShowDailyReportModal(false)} />
      )}

      {/* Mobile Sticky Bottom Navigation (Phone / Mobile View) */}
      <MobileBottomNav onOpenModal={setActiveFeatureTab} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm">
                  Nutri<span className="text-emerald-600">Track</span>
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  Track. Understand. Improve.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <button
                onClick={() => setCurrentStep('home')}
                className="hover:text-emerald-600 transition-colors"
              >
                Workflow Overview
              </button>
              <button
                onClick={() => setCurrentStep('auth')}
                className="hover:text-emerald-600 transition-colors"
              >
                Register / Login
              </button>
              <button
                onClick={() => setCurrentStep('basic-info')}
                className="hover:text-emerald-600 transition-colors"
              >
                Basic Health Info
              </button>
              <button
                onClick={() => setCurrentStep('dashboard')}
                className="hover:text-emerald-600 transition-colors"
              >
                Personal Dashboard
              </button>
              <button
                onClick={() => setShowDailyReportModal(true)}
                className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Daily Health Report</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </button>
            </div>

            <div className="text-xs text-slate-600 text-center md:text-right flex items-center justify-center md:justify-end gap-2.5">
              <img
                src="/nutrifit-logo.png"
                alt="NutriFit"
                className="w-6 h-6 rounded-md object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-bold text-slate-800">NutriFit</span>
                <p className="text-[11px] text-slate-500">
                  Track • Nourish • Be Your Best
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}
