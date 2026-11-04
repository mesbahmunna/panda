import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, Sparkles, Heart, ThumbsUp, X } from 'lucide-react';
import { products } from '../data/products';
import { getStoredCategories } from '../data/categories';
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

  const [categoryList, setCategoryList] = useState(() => getStoredCategories());

  useEffect(() => {
    const handleUpdate = () => setCategoryList(getStoredCategories());
    window.addEventListener('baby_categories_updated', handleUpdate);
    return () => window.removeEventListener('baby_categories_updated', handleUpdate);
  }, []);

  // Filtered Products for category view
  const categoryProducts = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : [];

  const currentCategoryObj = categoryList.find((c) => c.slug === selectedCategory);

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
                    বেবি ডিপার্টমেন্ট
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentCategoryObj ? currentCategoryObj.name : 'ক্যাটাগরি পণ্যসমূহ'}
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
                <span>ফিল্টার মুছুন (সব দেখুন)</span>
              </button>
            </div>
          </div>

          {/* Filtered Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
              <span>এই ক্যাটাগরিতে {categoryProducts.length} টি পণ্য রয়েছে</span>
              <span className="font-semibold text-emerald-600">সব পণ্যেই ক্যাশ অন ডেলিভারি সুবিধা প্রযোজ্য</span>
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
                <p className="text-slate-500 text-sm mb-4">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।</p>
                <button
                  onClick={() => onSelectCategory(null)}
                  className="px-5 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl"
                >
                  সব ক্যাটাগরি দেখুন
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
            title="বেস্ট সেলার পণ্যসমূহ"
            subtitle="বাংলাদেশ জুড়ে বাবা-মায়েদের সর্বাধিক পছন্দের ও বিশ্বস্ত বেবি কালেকশন।"
            icon={Trophy}
            badge="টপ চয়েস"
            badgeColor="bg-amber-50 text-amber-700 border-amber-200"
            products={products.filter((p) => p.isBestSeller)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Trending Baby Products */}
          <ProductGridSection
            title="ট্রেন্ডিং বেবি প্রোডাক্টস"
            subtitle="শিশুর পরিচর্যায় আধুনিক ও ট্রেন্ডিং নিত্যপ্রয়োজনীয় সামগ্রী।"
            icon={TrendingUp}
            badge="ট্রেন্ডিং"
            badgeColor="bg-rose-50 text-rose-600 border-rose-200"
            products={products.filter((p) => p.isTrending)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: New Arrivals */}
          <ProductGridSection
            title="নতুন কালেকশন"
            subtitle="নতুন আকর্ষণীয় ডিজাইনের আরামদায়ক পোশাক, কম্বল ও এক্সেসরিজ।"
            icon={Sparkles}
            badge="নতুন আগমন"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            products={products.filter((p) => p.isNewArrival)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Just For You */}
          <ProductGridSection
            id="featured-deals"
            title="আপনার জন্য বাছাইকৃত"
            subtitle="শিশুর প্রাত্যহিক যত্ন ও হাইজিনের জন্য প্রিমিয়াম কালেকশন।"
            icon={Heart}
            badge="বিশেষ অফার"
            badgeColor="bg-purple-50 text-brand-600 border-purple-200"
            products={products.slice(0, 8)}
            onSelectProduct={handleSelectProduct}
          />

          {/* Featured Section: Recommended Products */}
          <ProductGridSection
            title="পরামর্শকৃত পণ্যসমূহ"
            subtitle="শিশুর সঠিক বিকাশ, স্বাস্থ্য ও সুরক্ষায় বিশেষজ্ঞ প্রস্তাবিত পণ্য।"
            icon={ThumbsUp}
            badge="রেকমেন্ডেড"
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
