import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/product';

interface CartDrawerProps {
  onSelectProduct: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onSelectProduct }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[92vw] sm:max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideInRight">
          
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#5844ED] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List - Compact Responsive List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Explore our cute and safe baby essentials to fill your shopping cart!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#5844ED] hover:bg-[#4936d9] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const effectivePrice = item.unitPrice || item.selectedBundle?.price || item.product.price;
                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center text-left">
                      {/* Thumbnail */}
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        onClick={() => {
                          onSelectProduct(item.product);
                          setIsCartOpen(false);
                        }}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-slate-100 shrink-0 cursor-pointer hover:opacity-90"
                      />
                      
                      {/* Details & Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <h4
                            onClick={() => {
                              onSelectProduct(item.product);
                              setIsCartOpen(false);
                            }}
                            className="text-xs font-bold text-slate-800 truncate hover:text-[#5844ED] cursor-pointer"
                            title={item.product.name}
                          >
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variation & Bundle Badges */}
                        {(item.selectedVariation || item.selectedBundle) && (
                          <div className="flex flex-wrap gap-1 mt-0.5 mb-1">
                            {item.selectedVariation && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#5844ED] text-[9.5px] font-bold">
                                Age: {item.selectedVariation}
                              </span>
                            )}
                            {item.selectedBundle && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9.5px] font-bold">
                                {item.selectedBundle.title}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Quantity & Price Row */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-7">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            ৳ {(effectivePrice * item.quantity).toLocaleString()}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clean Minimalist Footer (Delivery selected at checkout) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              {/* Subtotal Only */}
              <div className="flex items-center justify-between text-slate-900">
                <span className="text-sm font-bold text-slate-600">Subtotal:</span>
                <span className="text-lg sm:text-xl font-black text-[#5844ED]">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-100/80 p-2 rounded-xl">
                <span className="text-xs">🚚</span>
                <span>Delivery zone &amp; charges are selected on the Checkout page.</span>
              </div>

              {/* COD Guarantee */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Cash on Delivery: Inspect before payment</span>
              </div>

              {/* Action Button: Proceed to Checkout */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-[#5844ED] hover:bg-[#4936d9] active:scale-98 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all btn-shiny"
              >
                <span>Proceed to Checkout (COD)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
