import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { getStoredCategories } from '../data/categories';
import { products } from '../data/products';
import { Product } from '../types/product';
import { ProductCard } from '../components/Product/ProductCard';
import { CategoryIconView } from '../components/Categories/CategoryIconView';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState(() => getStoredCategories());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const handleUpdate = () => setCategoryList(getStoredCategories());
    window.addEventListener('baby_categories_updated', handleUpdate);
    return () => window.removeEventListener('baby_categories_updated', handleUpdate);
  }, []);

  const currentCategory = categoryList.find((c) => c.slug === slug);
  const categoryProducts = slug
    ? products.filter((p) => p.categorySlug === slug)
    : [];

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-24 md:pb-16 text-slate-800">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link
            to="/"
            className="hover:text-brand-600 transition-colors font-medium flex items-center gap-1"
          >
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500">ক্যাটাগরিসমূহ</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-brand-600 font-bold">
            {currentCategory ? currentCategory.name : 'ক্যাটাগরি'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Category Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              {currentCategory && (
                <CategoryIconView category={currentCategory} size="xl" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                    বেবি ডিপার্টমেন্ট
                  </span>
                  <span className="text-xs text-slate-400">
                    {categoryProducts.length} টি পণ্য
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentCategory ? currentCategory.name : 'ক্যাটাগরি পণ্যসমূহ'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                  {currentCategory?.description ||
                    'আমাদের প্রিমিয়াম ও শিশুবান্ধব নিরাপদ পণ্যের কালেকশন। সমগ্র বাংলাদেশে ১০০% ক্যাশ অন ডেলিভারি প্রযোজ্য।'}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors self-start sm:self-auto shrink-0 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমে ফিরে যান</span>
            </Link>
          </div>

          {/* Quick Notice Pill */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>ক্যাশ অন ডেলিভারি প্রযোজ্য</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>১০০% খাঁটি ও নিরাপদ যত্ন</span>
            </div>
          </div>
        </div>

        {/* Filtered Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-5 text-xs text-slate-500">
            <span>
              <strong className="text-brand-600">{currentCategory?.name || 'এই ক্যাটাগরিতে'}</strong> মোট{' '}
              <strong className="text-slate-800">{categoryProducts.length}</strong> টি পণ্য রয়েছে
            </span>
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
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-card">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                আমরা নিয়মিত নতুন প্রিমিয়াম বেবি প্রোডাক্টস যুক্ত করছি। অনুগ্রহ করে আমাদের অন্যান্য কালেকশন ঘুরে দেখুন!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>সব পণ্য দেখুন</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
