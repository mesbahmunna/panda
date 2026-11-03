import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, PhoneCall, X } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { Product } from '../../types/product';

interface MainHeaderProps {
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
  onToggleMobileMenu: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  onSelectProduct,
  onNavigateHome,
}) => {
  const { totalItems, subtotal, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 50);
    }
  }, [isMobileSearchOpen]);

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
    setShowResults(false);
    setSearchQuery('');
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3.5">
        
        {/* If Mobile Search is Open: Hide Logo & Cart, Show Full-Width Search Input */}
        {isMobileSearchOpen ? (
          <div className="flex items-center gap-2 md:hidden animate-fadeIn py-0.5">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search baby clothes, feeding sets, toys..."
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5844ED]/20 focus:border-[#5844ED] text-slate-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setShowResults(false);
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg shrink-0"
            >
              Cancel
            </button>
          </div>
        ) : (
          /* Normal Header Row */
          <div className="flex items-center justify-between gap-3 md:gap-6">
            
            {/* Logo */}
            <div
              onClick={onNavigateHome}
              className="cursor-pointer transition-transform hover:opacity-95 shrink-0"
            >
              <Logo />
            </div>

            {/* Desktop Center Search Bar (Hidden on Mobile) */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Search for baby clothes, feeding sets, toys, bath care..."
                  className="w-full pl-4 pr-24 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-14 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Live Search Dropdown */}
              {showResults && searchQuery.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden z-50">
                  <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3 bg-slate-50">
                    <span>Found {searchResults.length} matching products</span>
                    <span className="text-[11px] text-brand-600 font-medium">Instant Preview</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-3 p-3 hover:bg-brand-50/50 cursor-pointer transition-colors group"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-100 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-brand-600 mb-0.5">{product.category}</p>
                            <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-slate-900">৳ {product.price}</span>
                              <span className="text-xs text-slate-400 line-through">৳ {product.originalPrice}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
                                -{product.discountPercent}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No baby products found matching &quot;{searchQuery}&quot;.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions: Search Icon + Inquiry + Cart */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
              
              {/* Mobile Search Icon Trigger (Right before cart icon, hidden on desktop) */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all md:hidden shrink-0 shadow-xs"
                aria-label="Search products"
                title="Search"
              >
                <Search className="w-4 h-4 text-slate-700" />
              </button>

              {/* Desktop Phone Order Inquiry Badge */}
              <a
                href="tel:+8809617100900"
                className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:bg-brand-50/40 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[11px] font-medium text-slate-500">Order Inquiry</span>
                  <span className="text-xs font-bold text-brand-900 tracking-tight">+880 9617-100900</span>
                </div>
              </a>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="h-9 px-2.5 sm:px-4 sm:h-auto sm:py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all group shrink-0"
                aria-label="Shopping Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-babyCoral text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[10px] uppercase font-semibold text-brand-100">Cart</span>
                  <span className="text-xs font-bold mt-0.5">৳ {subtotal.toLocaleString()}</span>
                </div>
              </button>
            </div>

          </div>
        )}

        {/* Mobile Live Search Dropdown */}
        {isMobileSearchOpen && showResults && searchQuery.trim() !== '' && (
          <div className="absolute left-3 right-3 top-full mt-1.5 bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden z-50 md:hidden">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3 bg-slate-50">
              <span>Found {searchResults.length} matching products</span>
            </div>
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-2.5 p-2.5 active:bg-slate-50 cursor-pointer"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-brand-600">৳ {product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">৳ {product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-slate-500 text-xs">
                No baby products found matching &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
