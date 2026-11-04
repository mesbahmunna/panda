import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Sparkles } from 'lucide-react';
import { getStoredCategories } from '../../data/categories';
import { products as baseProducts } from '../../data/products';
import { CategoryIconView } from '../Categories/CategoryIconView';
import { Product } from '../../types/product';

interface CategoryNavProps {
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(() => getStoredCategories());
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem('baby_admin_products');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return baseProducts;
  });

  const refreshData = () => {
    setCategoryList(getStoredCategories());
    try {
      const raw = localStorage.getItem('baby_admin_products');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductList(parsed);
          return;
        }
      }
    } catch {}
    setProductList(baseProducts);
  };

  useEffect(() => {
    window.addEventListener('baby_categories_updated', refreshData);
    window.addEventListener('baby_products_updated', refreshData);
    return () => {
      window.removeEventListener('baby_categories_updated', refreshData);
      window.removeEventListener('baby_products_updated', refreshData);
    };
  }, []);

  return (
    <div className="bg-[#080638] border-b border-indigo-950/80 hidden md:block text-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
        
        {/* All Categories Dropdown Trigger */}
        <div className="relative py-2 shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={() => setDropdownOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors shadow-sm text-xs md:text-sm"
          >
            <Menu className="w-4 h-4" />
            <span>সকল ক্যাটাগরি</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Categories Mega Dropdown Menu */}
          {dropdownOpen && (
            <div
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-floating border border-slate-100 py-2 z-50 animate-fadeIn text-slate-700"
            >
              <div
                onClick={() => {
                  onSelectCategory(null);
                  setDropdownOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors ${
                  selectedCategory === null ? 'bg-brand-50 text-brand-600' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>সব পণ্য</span>
                </div>
              </div>

              {categoryList.map((cat) => {
                const count = productList.filter(
                  (p) => p.categorySlug === cat.slug || p.category?.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-xs font-medium cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors ${
                      selectedCategory === cat.slug ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CategoryIconView category={cat} size="xs" />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full font-mono">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Horizontal Category Navigation Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs md:text-sm">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedCategory === null
                ? 'text-white font-bold bg-white/15'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            হোম
          </button>

          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'text-white font-bold bg-white/15'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Helpline right badge */}
        <div className="hidden xl:flex items-center gap-2 shrink-0 py-2 text-xs font-semibold text-slate-300">
          <span>হটলাইন:</span>
          <span className="text-amber-400 font-bold tracking-wide">+880 9617-100900</span>
        </div>

      </div>
    </div>
  );
};
