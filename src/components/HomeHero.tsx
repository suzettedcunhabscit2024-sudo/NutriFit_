import React from 'react';
import { useHealth } from '../context/HealthContext';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  LayoutDashboard
} from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setCurrentStep, currentUser, profile } = useHealth();

  const workflowSteps = [
    { number: '01', title: 'Home', desc: 'Project overview & community vision' },
    { number: '02', title: 'Register / Login', desc: 'Secure Firebase Auth access' },
    { number: '03', title: 'Basic Health Info', desc: 'Height, Weight, Age, BMI baseline' },
    { number: '04', title: 'Personal Dashboard', desc: '10 interactive tracking cards' },
    { number: '05', title: 'Track Activities', desc: 'Exercise, meals, water, and sleep logs' },
    { number: '06', title: 'Calculate Results', desc: 'MET caloric burn & macro distribution' },
    { number: '07', title: 'Show Progress', desc: 'Visual comparisons & daily goal meters' },
    { number: '08', title: 'Daily Health Report', desc: 'Comprehensive printable diagnostic summary' },
  ];

  return (
    <div className="pt-6 pb-28 sm:py-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-5">
          <img
            src="/nutrifit-logo.png"
            alt="NutriFit"
            className="w-5 h-5 rounded-md object-cover"
            referrerPolicy="no-referrer"
          />
          <span>NutriFit Health &amp; Nutrition System • Track • Nourish • Be Your Best</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-100 bg-white p-1">
            <img
              src="/nutrifit-logo.png"
              alt="NutriFit Emblem"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Track Your Nutrition. <br />
          <span className="text-[#65a30d]">Elevate Your Everyday Health.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A personal health and nutrition tracking platform engineered for community use.
          Calculate exact calorie expenditure with MET formulas, monitor macros, log hydration,
          track sleep cycles, and generate comprehensive daily health reports.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            id="btn-home-start"
            onClick={() => setCurrentStep(currentUser ? 'dashboard' : 'auth')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02]"
          >
            <span>{currentUser ? 'Open Your Dashboard' : 'Get Started & Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-home-dashboard"
            onClick={() => setCurrentStep('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-all hover:border-slate-400"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            <span>View Health Dashboard</span>
          </button>
        </div>
      </div>

      {/* System Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-12">
        <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              NutriFit System Workflow Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Complete end-to-end data pipeline: Input → Calculation → Tracking → Reporting
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
            8 Sequential Stages
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.number}
              className="relative p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col items-center justify-between hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors group"
            >
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                {step.number}
              </span>
              <h3 className="mt-2 text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                {step.title}
              </h3>
              <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                {step.desc}
              </p>
              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 10 Core Health Feature Pillars Grid */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            The 10 Integrated Health Tracking Modules
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Carefully engineered calculations based on peer-reviewed MET standards and nutritional databases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: '🏃', name: 'Exercise Tracking', desc: 'MET energy formula calibrated to user body weight' },
            { icon: '😴', name: 'Sleep Monitoring', desc: 'Bedtime and wake-up duration with 7-9h target' },
            { icon: '💧', name: 'Hydration Log', desc: 'Intake in ml with graphical progress against 2.5L' },
            { icon: '🥗', name: 'Macro Nutrition', desc: 'Meal breakdown: calories, protein, carbs & fat' },
            { icon: '⚖️', name: 'Weight Tracking', desc: 'Weight delta recording and trend tracking' },
            { icon: '❤️', name: 'BMI Analytics', desc: 'Real-time BMI calculation & ideal weight ranges' },
            { icon: '🎯', name: 'Daily Goals', desc: 'Custom targets for water, workouts, sleep & calories' },
            { icon: '📈', name: 'Progress Charts', desc: 'Visual day-by-day comparison and analytics' },
            { icon: '📚', name: 'Health Tips', desc: 'Curated wellness advice for community longevity' },
            { icon: '📋', name: 'Daily Report ⭐', desc: 'Printable summary with health score and advice' },
          ].map((card) => (
            <div
              key={card.name}
              className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-xs transition-all"
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="text-sm font-bold text-slate-900">{card.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Community Health System Ready</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Ready to experience NutriFit in action?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Register with your email or Google account to track workouts with MET formulas, log hydration, monitor macronutrients, and store records securely in Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-banner-start"
            onClick={() => setCurrentStep(currentUser ? 'dashboard' : 'auth')}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all hover:scale-105 shadow-md flex items-center gap-2"
          >
            <span>{currentUser ? 'Go to Dashboard' : 'Get Started Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
