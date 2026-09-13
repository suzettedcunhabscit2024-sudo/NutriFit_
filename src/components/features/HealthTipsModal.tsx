import React, { useState } from 'react';
import { HEALTH_TIPS } from '../../data/mockAndReferenceData';
import { BookOpen, X, Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface HealthTipsModalProps {
  onClose: () => void;
}

export const HealthTipsModal: React.FC<HealthTipsModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', 'Nutrition', 'Hydration', 'Exercise', 'Sleep', 'General'];

  const filteredTips = HEALTH_TIPS.filter(tip => {
    const matchesCat = selectedCategory === 'All' || tip.category === selectedCategory;
    const matchesSearch =
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Health & Wellness Knowledge Base</h2>
              <p className="text-xs text-slate-500">Evidence-based guidelines for community vitality</p>
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
        <div className="overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 flex-1 pr-1">
          {/* Search and Categories */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search health tips, keywords, habits..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[44px]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tip Cards */}
          <div className="space-y-3">
            {filteredTips.map(tip => (
              <div
                key={tip.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {tip.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {tip.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {tip.title}
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                  {tip.summary}
                </p>
                <p className="text-xs text-slate-500 mt-2 border-t border-slate-200/60 pt-2 leading-relaxed">
                  {tip.details}
                </p>
              </div>
            ))}
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
