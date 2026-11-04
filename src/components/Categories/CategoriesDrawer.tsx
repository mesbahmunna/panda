import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { getStoredCategories } from '../../data/categories';
import { products as baseProducts } from '../../data/products';
import { CategoryIconView } from './CategoryIconView';
import { Product } from '../../types/product';

interface CategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between animate-slideInLeft">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-500 text-white">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>সকল ক্যাটাগরি</span>
            </h3>
            <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100 text-left">
            <div
              onClick={() => {
                onSelectCategory(null);
                onClose();
              }}
              className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer transition-colors ${
                selectedCategory === null ? 'bg-brand-50 text-brand-600' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>সব পণ্য ও কালেকশন</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
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
                    onClose();
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                    selectedCategory === cat.slug ? 'bg-brand-50 text-brand-600' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CategoryIconView category={cat} size="sm" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
            হটলাইন: <strong className="text-brand-600 font-bold">+880 9617-100900</strong>
          </div>

        </div>
      </div>
    </div>
  );
};
