import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const hasOptions = Boolean(
    product.variationGroup || (product.bundleTiers && product.bundleTiers.length > 0)
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions) {
      navigate(`/product/${product.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToCart(product, 1, undefined, undefined, true);
    }
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions) {
      // If product has size or bundle, navigate to product page so user selects their preferred option
      navigate(`/product/${product.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Instant order without opening sidecart
      addToCart(product, 1, undefined, undefined, false);
      setIsCartOpen(false);
      navigate('/checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative w-full pt-[100%] bg-slate-50 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge (Coral badge) */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-babyCoral text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
            -{product.discountPercent}%
          </div>
        )}

        {/* Badge: e.g. NEW / POPULAR */}
        {product.badge && product.discountPercent === 0 && (
          <div className="absolute top-2.5 left-2.5 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm uppercase">
            {product.badge}
          </div>
        )}
      </div>

      {/* Card Body Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Category */}
          <div className="text-[11px] font-semibold text-brand-600 tracking-wide truncate mb-1">
            {product.category}
          </div>

          {/* Product Title: Max 2 lines with ellipsis */}
          <h3
            className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors mb-2 h-9 sm:h-10 overflow-hidden"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ৳ {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ৳ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Square Add to Cart + Rest of Width Order Now */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-1 mt-auto">
          {/* Square Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            title={hasOptions ? "Choose Options & Add to Cart" : "Add to Cart"}
            aria-label="Add to Cart"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-[#5844ED]/10 text-slate-700 hover:text-[#5844ED] active:scale-95 flex items-center justify-center shrink-0 border border-slate-200/80 transition-all shadow-xs group/btn"
          >
            <ShoppingBag className="w-4 h-4 text-[#5844ED] group-hover/btn:scale-110 transition-transform" />
          </button>

          {/* Order Now Button (Takes the rest of the width) */}
          <button
            type="button"
            onClick={handleOrderNow}
            className="flex-1 h-9 sm:h-10 px-2 sm:px-3 rounded-xl bg-[#5844ED] hover:bg-[#4936d9] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap"
          >
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
