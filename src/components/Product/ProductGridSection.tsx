import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  viewAllAction?: () => void;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-brand-50 text-brand-600 border-brand-200',
  products,
  onSelectProduct,
  viewAllAction,
}) => {
  if (products.length === 0) return null;

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 py-7">
      {/* Section Header */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {viewAllAction && (
          <button
            onClick={viewAllAction}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0 group"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Grid of Product Cards (HT Bazar 4-column layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
};
