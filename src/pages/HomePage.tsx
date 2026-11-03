import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, Sparkles, Heart, ThumbsUp, X } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { Product } from '../types/product';

// Components
import { HeroBanner } from '../components/Hero/HeroBanner';
import { CategoryGrid } from '../components/Categories/CategoryGrid';
import { ProductGridSection } from '../components/Product/ProductGridSection';
import { TrustFeatures } from '../components/Trust/TrustFeatures';
import { ProductCard } from '../components/Product/ProductCard';

interface HomePageProps {
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBestSellers = () => {
    const el = document.getElementById('best-sellers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered Products for category view
  const categoryProducts = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : [];

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div>
      {/* If Category is active, show category header & filtered grid */}
      {selectedCategory ? (
        <div id="category-products-view" className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card mb-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {currentCategoryObj && (
                  <img
                    src={currentCategoryObj.image}
                    alt={currentCategoryObj.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Baby Department
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentCategoryObj ? currentCategoryObj.name : 'Category Products'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentCategoryObj?.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory(null)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
                <span>Clear Filter (Show All)</span>
              </button>
            </div>
          </div>

          {/* Filtered Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
              <span>Showing {categoryProducts.length} items in this category</span>
              <span className="font-semibold text-emerald-600">All items eligible for Cash on Delivery</span>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {categoryProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={handleSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <p className="text-slate-500 text-sm mb-4">No products currently in this category.</p>
                <button
                  onClick={() => onSelectCategory(null)}
                  className="px-5 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl"
                >
                  Browse All Categories
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Full Homepage Sections
        <div>
          {/* Hero / Promotional Banner Section */}
          <HeroBanner
            onShopNow={scrollToBestSellers}
            onExploreFeeding={() => onSelectCategory('baby-feeding')}
            onExploreClothing={() => onSelectCategory('baby-clothing')}
          />

          {/* Categories Department Cards */}
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />

          {/* Featured Section: Best Sellers */}
          <ProductGridSection
            id="best-sellers-section"
            title="Best Sellers"
            subtitle="Parent-favorite baby staples trusted by families across Bangladesh."
            icon={Trophy}
            badge="TOP CHOICES"
            badgeColor="bg-amber-50 text-amber-700 border-amber-200"
            products={products.filter((p) => p.isBestSeller)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Trending Baby Products */}
          <ProductGridSection
            title="Trending Baby Products"
            subtitle="Innovative gadgets and everyday parent problem solvers."
            icon={TrendingUp}
            badge="TRENDING"
            badgeColor="bg-rose-50 text-rose-600 border-rose-200"
            products={products.filter((p) => p.isTrending)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: New Arrivals */}
          <ProductGridSection
            title="New Arrivals"
            subtitle="Fresh nursery designs, soothing bath towels, and baby shower favorites."
            icon={Sparkles}
            badge="JUST IN"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            products={products.filter((p) => p.isNewArrival)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Just For You */}
          <ProductGridSection
            id="featured-deals"
            title="Just For You"
            subtitle="Curated collection of everyday baby care and hygiene essentials."
            icon={Heart}
            badge="CURATED"
            badgeColor="bg-purple-50 text-brand-600 border-purple-200"
            products={products.slice(0, 8)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Recommended Products */}
          <ProductGridSection
            title="Recommended Products"
            subtitle="Safe feeding bottles, grooming sets, and toddler safety essentials."
            icon={ThumbsUp}
            badge="RECOMMENDED"
            badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200"
            products={products.filter((p) => p.isRecommended)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Trust & Benefits Pillars */}
          <TrustFeatures />
        </div>
      )}
    </div>
  );
};
