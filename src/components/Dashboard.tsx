import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Flame,
  Moon,
  Droplets,
  Utensils,
  Scale,
  Heart,
  Target,
  TrendingUp,
  BookOpen,
  FileText,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';
import { ExerciseTrackerModal } from './features/ExerciseTrackerModal';
import { SleepTrackerModal } from './features/SleepTrackerModal';
import { WaterTrackerModal } from './features/WaterTrackerModal';
import { NutritionTrackerModal } from './features/NutritionTrackerModal';
import { WeightTrackerModal } from './features/WeightTrackerModal';
import { BMICalculatorModal } from './features/BMICalculatorModal';
import { GoalsManagerModal } from './features/GoalsManagerModal';
import { ProgressModal } from './features/ProgressModal';
import { HealthTipsModal } from './features/HealthTipsModal';

export const Dashboard: React.FC = () => {
  const {
    profile,
    bmiData,
    exercises,
    totalExerciseMinutes,
    totalCaloriesBurned,
    sleepRecord,
    waterLogs,
    totalWaterMl,
    totalNutrition,
    goals,
    dailyHealthScore,
    activeFeatureTab,
    setActiveFeatureTab,
    setShowDailyReportModal
  } = useHealth();

  const activeModal = activeFeatureTab;
  const setActiveModal = (tab: string | null) => setActiveFeatureTab(tab);

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const waterL = (totalWaterMl / 1000).toFixed(1);
  const goalWaterL = (goals.waterMl / 1000).toFixed(1);
  const waterPct = Math.min(100, Math.round((totalWaterMl / goals.waterMl) * 100));

  // The 10 feature cards as explicitly defined in prompt
  const featureCards = [
    {
      id: 'exercise',
      name: 'Exercise',
      icon: '🏃',
      tagline: 'Enter activity + duration → calories burned',
      currentValue: `${totalExerciseMinutes} min • ${totalCaloriesBurned} kcal`,
      statusBadge: `${exercises.length} logged today`,
      bgColor: 'bg-orange-50/80',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      actionText: 'Track Workouts',
    },
    {
      id: 'sleep',
      name: 'Sleep',
      icon: '😴',
      tagline: 'Enter sleep/wake time → sleep duration',
      currentValue: `${sleepRecord.hours}h ${sleepRecord.minutes}m (${sleepRecord.totalHours} hrs)`,
      statusBadge: sleepRecord.totalHours >= 7 && sleepRecord.totalHours <= 9 ? 'Optimal' : 'Logged',
      bgColor: 'bg-indigo-50/80',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      actionText: 'Log Sleep Times',
    },
    {
      id: 'water',
      name: 'Water',
      icon: '💧',
      tagline: 'Enter glasses/ml → hydration progress',
      currentValue: `${waterL} L / ${goalWaterL} L (${waterPct}%)`,
      statusBadge: `${totalWaterMl} ml logged`,
      bgColor: 'bg-cyan-50/80',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      actionText: 'Add Water (+ml)',
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: '🥗',
      tagline: 'Enter meals → calories & nutrients',
      currentValue: `${totalNutrition.calories} kcal • ${totalNutrition.protein}g Protein`,
      statusBadge: `${totalNutrition.carbs}g C • ${totalNutrition.fat}g F`,
      bgColor: 'bg-emerald-50/80',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      actionText: 'Log Meals & Foods',
    },
    {
      id: 'weight',
      name: 'Weight',
      icon: '⚖️',
      tagline: 'Enter weight → weight progress',
      currentValue: `${profile.weight} kg`,
      statusBadge: `Height: ${profile.height} cm`,
      bgColor: 'bg-purple-50/80',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      actionText: 'Update Weight',
    },
    {
      id: 'bmi',
      name: 'BMI',
      icon: '❤️',
      tagline: 'Calculate and monitor BMI',
      currentValue: `${bmiData.bmi} (${bmiData.category})`,
      statusBadge: `Ideal: ${bmiData.idealMin}-${bmiData.idealMax} kg`,
      bgColor: 'bg-rose-50/80',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
      actionText: 'View BMI Gauge',
    },
    {
      id: 'goals',
      name: 'Goals',
      icon: '🎯',
      tagline: 'Set daily health goals',
      currentValue: `${goals.caloriesTarget} kcal • ${goals.exerciseMinutes} min exercise`,
      statusBadge: `${(goals.waterMl / 1000).toFixed(1)}L water target`,
      bgColor: 'bg-amber-50/80',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      actionText: 'Adjust Goals',
    },
    {
      id: 'progress',
      name: 'Progress',
      icon: '📈',
      tagline: 'See charts and improvements',
      currentValue: `${totalNutrition.calories} in vs ${totalCaloriesBurned} burned`,
      statusBadge: '7-day analytics',
      bgColor: 'bg-teal-50/80',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      actionText: 'View Charts',
    },
    {
      id: 'tips',
      name: 'Health Tips',
      icon: '📚',
      tagline: 'Get relevant health information',
      currentValue: '5 Core Wellness Directives',
      statusBadge: 'Community Guidelines',
      bgColor: 'bg-blue-50/80',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      actionText: 'Read Tips',
    },
    {
      id: 'daily-report',
      name: 'Daily Report',
      icon: '📋',
      tagline: "Get complete day's summary ⭐",
      currentValue: `Daily Health Score: ${dailyHealthScore}%`,
      statusBadge: 'Printable & Downloadable',
      bgColor: 'bg-gradient-to-br from-emerald-100/90 to-teal-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-800',
      actionText: 'Generate Report ⭐',
      highlight: true,
    },
  ];

  return (
    <div className="pt-4 pb-24 sm:py-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Welcome Banner (Explicitly requested in prompt) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
            <Calendar className="w-3.5 h-3.5 text-emerald-200" />
            <span>Today is {formattedDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-xs p-0.5 shrink-0 hidden sm:flex items-center justify-center">
              <img
                src="/nutrifit-logo.png"
                alt="NutriFit"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome to NutriFit 👋
              </h1>
              <p className="mt-1 text-sm sm:text-base text-emerald-100 font-medium">
                Track • Nourish • Be Your Best
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar on Hero */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-emerald-200 block text-[11px]">Hydration</span>
              <strong className="text-sm sm:text-base text-white">{waterL} / {goalWaterL} L</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-emerald-200 block text-[11px]">Exercise Burn</span>
              <strong className="text-sm sm:text-base text-white">{totalCaloriesBurned} kcal</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-emerald-200 block text-[11px]">Meals Consumed</span>
              <strong className="text-sm sm:text-base text-white">{totalNutrition.calories} kcal</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-emerald-200 block text-[11px]">Health Score</span>
              <strong className="text-sm sm:text-base text-amber-300 font-black">{dailyHealthScore}%</strong>
            </div>
          </div>
        </div>

        {/* Generate Report Quick Button */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 z-10">
          <button
            id="btn-hero-generate-report"
            onClick={() => setShowDailyReportModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs shadow-lg transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Generate My Daily Health Report ⭐</span>
          </button>
        </div>
      </div>

      {/* 10 Feature Cards Grid (Requested in Step 2: "I'd make 10 feature cards") */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Personal Tracking Dashboard</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any feature card to enter data, calculate values, and log into today&apos;s report.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            10 Active Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featureCards.map((card) => (
            <div
              key={card.id}
              id={`card-${card.id}`}
              onClick={() => {
                if (card.id === 'daily-report') {
                  setShowDailyReportModal(true);
                } else {
                  setActiveModal(card.id);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${card.bgColor} ${card.borderColor} ${
                card.highlight ? 'ring-2 ring-emerald-400 ring-offset-2' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-1 rounded-xl bg-white/70 shadow-2xs group-hover:scale-110 transition-transform inline-block">
                    {card.icon}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200/60 shadow-2xs">
                    {card.statusBadge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
                  {card.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  {card.tagline}
                </p>

                <div className="mt-3 p-2 bg-white/90 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] uppercase font-bold text-slate-600">Current Status</div>
                  <div className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">
                    {card.currentValue}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold">
                <span className={card.textColor}>{card.actionText}</span>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${card.textColor}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render Active Feature Modal when open */}
      {activeModal === 'exercise' && (
        <ExerciseTrackerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'sleep' && (
        <SleepTrackerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'water' && (
        <WaterTrackerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'nutrition' && (
        <NutritionTrackerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'weight' && (
        <WeightTrackerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'bmi' && (
        <BMICalculatorModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'goals' && (
        <GoalsManagerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'progress' && (
        <ProgressModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'tips' && (
        <HealthTipsModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};
