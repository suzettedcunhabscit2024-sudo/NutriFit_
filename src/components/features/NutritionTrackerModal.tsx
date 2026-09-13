import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { PREDEFINED_FOODS, PredefinedFood } from '../../data/mockAndReferenceData';
import { MealType } from '../../types';
import { Utensils, Plus, Trash2, X, Search, Sparkles, Check } from 'lucide-react';

interface NutritionTrackerModalProps {
  onClose: () => void;
}

export const NutritionTrackerModal: React.FC<NutritionTrackerModalProps> = ({ onClose }) => {
  const { nutritionLogs, addNutrition, removeNutrition, totalNutrition, goals } = useHealth();

  const [selectedMeal, setSelectedMeal] = useState<MealType>('Breakfast');
  const [selectedFoodName, setSelectedFoodName] = useState<string>('Poha');
  const [quantity, setQuantity] = useState<string>('1 bowl');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Custom food fields
  const [customName, setCustomName] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<number>(200);
  const [customProtein, setCustomProtein] = useState<number>(10);
  const [customCarbs, setCustomCarbs] = useState<number>(30);
  const [customFat, setCustomFat] = useState<number>(5);

  const [foodSearch, setFoodSearch] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  // Filter foods by search or category
  const filteredFoods = PREDEFINED_FOODS.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const activeFoodObj = PREDEFINED_FOODS.find(f => f.name === selectedFoodName) || PREDEFINED_FOODS[0];

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCustomMode) {
      if (!customName.trim()) return;
      addNutrition(selectedMeal, customName.trim(), quantity || '1 serving', {
        calories: customCalories,
        protein: customProtein,
        carbs: customCarbs,
        fat: customFat,
      });
      setCustomName('');
    } else {
      addNutrition(selectedMeal, activeFoodObj.name, quantity || activeFoodObj.defaultPortion, {
        calories: activeFoodObj.calories,
        protein: activeFoodObj.protein,
        carbs: activeFoodObj.carbs,
        fat: activeFoodObj.fat,
      });
    }

    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Nutrition Tracking</h2>
              <p className="text-xs text-slate-500">Meal logging & macronutrient breakdown</p>
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
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {/* Today's Nutrition Overview (Exact banner requested in user prompt) */}
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                🥗 Today&apos;s Nutrition Summary
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Goal: {goals.caloriesTarget} kcal
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Calories Consumed</div>
                <div className="text-xl font-black text-white mt-1">
                  {totalNutrition.calories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-emerald-400 uppercase font-semibold">Protein</div>
                <div className="text-xl font-black text-emerald-300 mt-1">
                  {totalNutrition.protein} <span className="text-xs font-normal text-slate-400">g</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-amber-400 uppercase font-semibold">Carbohydrates</div>
                <div className="text-xl font-black text-amber-300 mt-1">
                  {totalNutrition.carbs} <span className="text-xs font-normal text-slate-400">g</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-rose-400 uppercase font-semibold">Fat</div>
                <div className="text-xl font-black text-rose-300 mt-1">
                  {totalNutrition.fat} <span className="text-xs font-normal text-slate-400">g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Food Form (exact inputs requested) */}
          <form onSubmit={handleAddFood} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Add Food to Meal
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    !isCustomMode ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-200'
                  }`}
                >
                  Database Food
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    isCustomMode ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-200'
                  }`}
                >
                  Custom Entry
                </button>
              </div>
            </div>

            {/* Meal Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Meal Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Breakfast', 'Lunch', 'Snack', 'Dinner'] as MealType[]).map(meal => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setSelectedMeal(meal)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedMeal === meal
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            {!isCustomMode ? (
              <>
                {/* Food Selection from Database */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Select Food Item
                    </label>
                    <select
                      id="select-nutrition-food"
                      value={selectedFoodName}
                      onChange={e => {
                        setSelectedFoodName(e.target.value);
                        const matched = PREDEFINED_FOODS.find(f => f.name === e.target.value);
                        if (matched) setQuantity(matched.defaultPortion);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800 min-h-[44px]"
                    >
                      {PREDEFINED_FOODS.map(food => (
                        <option key={food.name} value={food.name}>
                          {food.name} ({food.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Portion / Quantity
                    </label>
                    <input
                      id="input-nutrition-quantity"
                      type="text"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      placeholder="e.g. 1 bowl"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-medium min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Retrieved Nutritional Values Preview (Poha example) */}
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 mb-1">
                    Retrieved Nutritional Values: <span className="text-slate-900">{activeFoodObj.name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-1.5 bg-slate-50 rounded">
                      <span className="text-slate-500 block text-[10px]">Calories</span>
                      <strong className="text-slate-900">{activeFoodObj.calories} kcal</strong>
                    </div>
                    <div className="p-1.5 bg-emerald-50 rounded">
                      <span className="text-emerald-700 block text-[10px]">Protein</span>
                      <strong className="text-emerald-800">{activeFoodObj.protein} g</strong>
                    </div>
                    <div className="p-1.5 bg-amber-50 rounded">
                      <span className="text-amber-700 block text-[10px]">Carbs</span>
                      <strong className="text-amber-800">{activeFoodObj.carbs} g</strong>
                    </div>
                    <div className="p-1.5 bg-rose-50 rounded">
                      <span className="text-rose-700 block text-[10px]">Fat</span>
                      <strong className="text-rose-800">{activeFoodObj.fat} g</strong>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Custom Food Entry */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Custom Food Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="e.g. Protein Smoothie"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Portion Description
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      placeholder="1 glass (300ml)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Calories (kcal)</label>
                    <input
                      type="number"
                      value={customCalories}
                      onChange={e => setCustomCalories(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-600">Protein (g)</label>
                    <input
                      type="number"
                      value={customProtein}
                      onChange={e => setCustomProtein(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-600">Carbs (g)</label>
                    <input
                      type="number"
                      value={customCarbs}
                      onChange={e => setCustomCarbs(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-rose-600">Fat (g)</label>
                    <input
                      type="number"
                      value={customFat}
                      onChange={e => setCustomFat(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add Food Button */}
            <button
              id="btn-add-food"
              type="submit"
              className={`w-full py-3 px-4 min-h-[44px] rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                addSuccess ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {addSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Item Logged to Today&apos;s Nutrition!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>[ Add Food ]</span>
                </>
              )}
            </button>
          </form>

          {/* Today's Logged Items by Meal */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Logged Meals Today ({nutritionLogs.length})
            </h3>

            {nutritionLogs.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500">
                No food logged yet today. Select a meal and add your items above!
              </div>
            ) : (
              <div className="space-y-2">
                {nutritionLogs.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:border-emerald-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.meal}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{item.foodName}</span>
                        <span className="text-xs text-slate-500 font-medium">({item.quantity})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                        <span>P: <strong className="text-emerald-700">{item.protein}g</strong></span>
                        <span>•</span>
                        <span>C: <strong className="text-amber-700">{item.carbs}g</strong></span>
                        <span>•</span>
                        <span>F: <strong className="text-rose-700">{item.fat}g</strong></span>
                        <span className="text-slate-400">• {item.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-slate-900">
                        {item.calories} kcal
                      </span>
                      <button
                        onClick={() => removeNutrition(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete meal entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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
