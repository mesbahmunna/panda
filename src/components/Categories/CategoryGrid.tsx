import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shop By Department</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Popular Baby Categories
          </h2>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* Grid of 8 categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`group cursor-pointer rounded-2xl p-3 bg-white border text-center transition-all duration-300 hover:shadow-card-hover flex flex-col items-center justify-between ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md bg-brand-50/20'
                  : 'border-slate-100 hover:border-brand-200 shadow-card'
              }`}
            >
              {/* Image with circle ring */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-brand-100 to-indigo-50 group-hover:from-brand-500 group-hover:to-indigo-500 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title & Items Count */}
              <div className="mt-2.5 w-full">
                <h3
                  className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                    isSelected ? 'text-brand-600' : 'text-slate-800 group-hover:text-brand-600'
                  }`}
                >
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {cat.itemCount}+ items
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
