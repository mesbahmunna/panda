import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../data/products';
import { ProductDetailPage } from '../components/ProductDetail/ProductDetailPage';
import { Product } from '../types/product';
import { ArrowLeft, Search } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The baby product you are looking for may have been moved or is currently unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>
      </div>
    );
  }

  const handleSelectProduct = (selected: Product) => {
    navigate(`/product/${selected.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProductDetailPage
      product={product}
      onSelectProduct={handleSelectProduct}
      onBackToHome={handleBackToHome}
    />
  );
};
