import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Zap,
  Truck,
  Check,
  ChevronRight,
  Share2,
  Phone,
  ChevronDown
} from 'lucide-react';
import { Product, ProductBundleTier } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { ProductCard } from '../Product/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBackToHome: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onSelectProduct,
  onBackToHome,
}) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string | undefined>(
    product.variationGroup?.options[0]?.name
  );
  const [selectedBundle, setSelectedBundle] = useState<ProductBundleTier | undefined>(
    product.bundleTiers && product.bundleTiers.length > 0 ? product.bundleTiers[0] : undefined
  );
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'returns'>('desc');
  const [copiedShare, setCopiedShare] = useState(false);

  // Mobile Collapsible FAQ Accordion State (closed by default)
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    desc: false,
    specs: false,
    shipping: false,
    returns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Scroll to top and reset variation/bundle when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedVariation(product.variationGroup?.options[0]?.name);
    setSelectedBundle(
      product.bundleTiers && product.bundleTiers.length > 0 ? product.bundleTiers[0] : undefined
    );
    setOpenAccordions({
      desc: false,
      specs: false,
      shipping: false,
      returns: false,
    });
  }, [product.id]);

  const handleOrderNow = () => {
    addToCart(product, quantity, selectedVariation, selectedBundle, false);
    setIsCartOpen(false);
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Price calculations based on selected bundle or regular product price
  const currentPrice = selectedBundle ? selectedBundle.price : product.price;
  const currentOriginalPrice = selectedBundle
    ? selectedBundle.originalPrice || Math.round(selectedBundle.price * 1.4)
    : product.originalPrice > product.price
    ? product.originalPrice
    : undefined;
  const currentSavings = currentOriginalPrice ? currentOriginalPrice - currentPrice : 0;
  const discountPct = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : product.discountPercent;

  // Related products from same category or fallback
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isRecommended))
    .slice(0, 4);

  // Recently viewed / recommended products
  const recentlyViewed = products
    .filter((p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen pb-16">
      
      {/* Breadcrumb Navigation (HT Bazar style) */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <button
            onClick={onBackToHome}
            className="hover:text-brand-600 transition-colors font-medium"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600 font-medium">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-brand-600 font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-8">
        
        {/* Main Product Hero Box (Clean edge-to-edge white on mobile, card on desktop) */}
        <div className="bg-white p-4 sm:p-7 md:p-8 md:rounded-3xl md:border md:border-slate-100 md:shadow-card mb-6 md:mb-8 border-b border-slate-100 md:border-b-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Main Active Image with Zoom/Hover */}
              <div className="relative w-full pt-[100%] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-xs group">
                <img
                  src={product.images[activeImageIndex] || product.thumbnail}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges on image */}
                {product.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-babyCoral text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-brand-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT: Product Information & Action (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between text-left space-y-5">
              
              <div>
                {/* Category & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {product.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="text-slate-400 hover:text-brand-600 p-1 flex items-center gap-1 text-xs"
                      title="Share Product"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{copiedShare ? 'Copied Link!' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Price Block (HT Bazar BDT format - Dynamic for Bundle/Single) */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-wrap items-baseline gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl font-black text-brand-600 tracking-tight">
                  ৳ {currentPrice.toLocaleString()}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ৳ {currentOriginalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-extrabold text-babyCoral bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                      Save ৳ {currentSavings.toLocaleString()} ({discountPct}% OFF)
                    </span>
                  </>
                )}
                {selectedBundle && (
                  <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60 ml-auto">
                    {selectedBundle.title} Pack
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* VARIATIONS (e.g. 1 Year, 2 Year, 3 Year) */}
              {product.variationGroup && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{product.variationGroup.name}:</span>
                    <span className="text-[#5844ED] font-black">{selectedVariation}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {product.variationGroup.options.map((opt) => {
                      const isSelected = selectedVariation === opt.name;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedVariation(opt.name)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#5844ED] text-white border-[#5844ED] shadow-md shadow-indigo-500/25 scale-[1.02]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BUNDLE OPTIONS (Matching reference image with optimized size & space) */}
              {product.bundleTiers && product.bundleTiers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Choose Bundle:</span>
                    </span>
                    {selectedBundle && (
                      <span className="text-slate-900 font-extrabold">
                        {selectedBundle.title} (৳{selectedBundle.price.toLocaleString()})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {product.bundleTiers.map((tier) => {
                      const isSelected = selectedBundle?.id === tier.id;
                      const singlePiecePrice = product.bundleTiers![0].price;
                      const baseTotalPrice = singlePiecePrice * tier.pieces;
                      const savings = tier.pieces > 1 && baseTotalPrice > tier.price
                        ? baseTotalPrice - tier.price
                        : 0;

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedBundle(tier)}
                          className={`relative py-2.5 px-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[64px] sm:min-h-[70px] ${
                            isSelected
                              ? 'bg-[#F0EEFF] border-2 border-[#5844ED] shadow-sm'
                              : 'bg-white hover:bg-slate-50/70 border border-slate-200'
                          }`}
                        >
                          {/* Radio Circle in Top-Left */}
                          <div
                            className={`absolute top-2.5 left-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[#5844ED] bg-white'
                                : 'border-slate-300 bg-white/50'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#5844ED]" />
                            )}
                          </div>

                          {/* Line 1: Title + (Save ৳X) */}
                          <div className="flex items-center justify-center flex-wrap gap-1 leading-tight mb-1">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                              {tier.title}
                            </span>
                            {savings > 0 && (
                              <span className="text-[10px] sm:text-[11px] font-bold text-rose-600">
                                (Save ৳{savings.toLocaleString()})
                              </span>
                            )}
                          </div>

                          {/* Line 2: Strike-through Original Price + Current Price */}
                          <div className="flex items-center justify-center gap-1.5 leading-none">
                            {savings > 0 && (
                              <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                                ৳{baseTotalPrice.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={`text-sm sm:text-base font-black ${
                                isSelected && savings === 0
                                  ? 'text-[#5844ED]'
                                  : 'text-slate-900'
                              }`}
                            >
                              ৳{tier.price.toLocaleString()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS: Quantity, Add to Cart & ORDER NOW */}
              <div className="space-y-2.5 pt-2">
                
                {/* ROW 1: Quantity (30% width) + Add to Cart (70% width) - Matching Image 1 exactly */}
                <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                  
                  {/* Quantity Selector: 30% width */}
                  <div className="w-[30%] sm:w-[28%] h-12 sm:h-13 bg-[#5844ED] rounded-xl p-1 sm:p-1.5 flex items-center justify-between shadow-md shadow-indigo-500/20 select-none">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/25 hover:bg-white/35 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-white font-black text-sm sm:text-base px-1 text-center min-w-[1.2rem]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white hover:bg-slate-50 active:scale-95 text-[#5844ED] font-black text-lg flex items-center justify-center shadow-xs transition-all"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart: 70% width */}
                  <button
                    onClick={() => addToCart(product, quantity, selectedVariation, selectedBundle, true)}
                    className="w-[70%] sm:w-[72%] h-12 sm:h-13 bg-[#5844ED] hover:bg-[#4936d9] active:scale-98 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5 text-white shrink-0" />
                    <span>Add to Cart</span>
                  </button>

                </div>

                {/* ROW 2: ORDER NOW - 100% width, Deep Navy, Animated & Shiny, Matching Image 1 */}
                <button
                  onClick={handleOrderNow}
                  className="w-full h-12 sm:h-13 bg-[#080638] hover:bg-[#0c094f] active:scale-98 text-white font-black text-sm sm:text-base tracking-wider uppercase rounded-xl shadow-xl shadow-indigo-950/40 flex items-center justify-center transition-all btn-shiny"
                >
                  <span>ORDER NOW</span>
                </button>

              </div>

              {/* SEPARATE: Hotline Quick Order Bar with Distinct Breathing Room Gap */}
              <div className="pt-3 sm:pt-4">
                <div className="w-full rounded-2xl bg-indigo-50/70 border border-indigo-100/90 p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 shadow-xs">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Phone className="w-4 h-4 text-[#5844ED] shrink-0" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Order via call or whatsapp (24/7)
                    </span>
                  </div>
                  <a
                    href="tel:+8809617100900"
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-[#5844ED] hover:bg-[#4936d9] text-white font-extrabold text-xs sm:text-sm text-center shrink-0 shadow-sm shadow-indigo-500/25 transition-all hover:scale-102 active:scale-95 whitespace-nowrap"
                  >
                    +880 9617-100900
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ================= MOBILE COLLAPSIBLE FAQ ACCORDION ================= */}
        <div className="md:hidden space-y-3 mb-10 px-4">
          
          {/* 1. Description & Highlights Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('desc')}
              className="w-full flex items-center justify-between p-4 text-left font-extrabold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span>Description &amp; Highlights</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  openAccordions.desc ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>
            {openAccordions.desc && (
              <div className="p-4 pt-1 border-t border-slate-100 text-left text-xs text-slate-700 leading-relaxed space-y-4">
                <p className="whitespace-pre-line">{product.description}</p>
                {product.features.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Key Highlights:</h4>
                    <div className="space-y-1.5">
                      {product.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Specifications & Materials Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('specs')}
              className="w-full flex items-center justify-between p-4 text-left font-extrabold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Specifications &amp; Materials</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  openAccordions.specs ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>
            {openAccordions.specs && (
              <div className="p-4 pt-1 border-t border-slate-100 text-left text-xs text-slate-800">
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`p-2.5 ${idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}`}
                    >
                      <span className="font-bold text-slate-600 block text-[11px]">{key}:</span>
                      <span className="font-medium text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Cash on Delivery Policy Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('shipping')}
              className="w-full flex items-center justify-between p-4 text-left font-extrabold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Cash on Delivery Policy</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  openAccordions.shipping ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>
            {openAccordions.shipping && (
              <div className="p-4 pt-1 border-t border-slate-100 text-left text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  At BabyBazar, we operate strictly on a <strong>100% Cash on Delivery (COD)</strong> system across all 64 districts in Bangladesh.
                </p>
                <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 space-y-1.5 text-[11px]">
                  <p><strong>• Inside Dhaka:</strong> ৳70 delivery fee (24-48 hours).</p>
                  <p><strong>• Outside Dhaka:</strong> ৳130 delivery fee (2-4 days).</p>
                  <p><strong>• Inspection:</strong> Open and verify your parcel with the delivery rider before paying.</p>
                </div>
              </div>
            )}
          </div>

          {/* 4. 7-Day Return & Exchange Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('returns')}
              className="w-full flex items-center justify-between p-4 text-left font-extrabold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>7-Day Return &amp; Exchange</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  openAccordions.returns ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>
            {openAccordions.returns && (
              <div className="p-4 pt-1 border-t border-slate-100 text-left text-xs text-slate-700 leading-relaxed space-y-1.5">
                <p>
                  If you receive a defective or incorrect item, notify our hotline within 7 days. We provide free doorstep return pickup and instant replacement.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ================= DESKTOP DETAILED TABS SECTION ================= */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden mb-12">
          
          {/* Tab Navigation Headers */}
          <div className="flex items-center overflow-x-auto border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 scrollbar-none">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Description &amp; Highlights
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Specifications &amp; Materials
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Cash on Delivery Policy
            </button>

            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'returns'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              7-Day Return &amp; Exchange
            </button>
          </div>

          {/* Tab Body Content */}
          <div className="p-5 sm:p-8 text-left">
            
            {/* 1. Description Tab */}
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">About This Baby Product</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {product.features.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Key Features &amp; Benefits:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <h3 className="text-base font-bold text-slate-900 mb-4">Technical Specifications</h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-700">{key}</span>
                      <span className="sm:col-span-2 text-slate-800 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">Doorstep Cash on Delivery Across Bangladesh</h3>
                <p>
                  At BabyBazar, we operate strictly on a <strong>100% Cash on Delivery (COD)</strong> system. You only pay after you receive and inspect your parcel.
                </p>
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 space-y-2 text-xs">
                  <p><strong>• Inside Dhaka City:</strong> ৳70 delivery fee. Delivered within 24 to 48 hours.</p>
                  <p><strong>• Outside Dhaka (All 63 Districts):</strong> ৳130 delivery fee via trusted express courier. Delivered to your doorstep within 2 to 4 business days.</p>
                  <p><strong>• Order Verification:</strong> You will receive a quick verification phone call after ordering to confirm address and details.</p>
                </div>
              </div>
            )}

            {/* 4. Returns Tab */}
            {activeTab === 'returns' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">7-Day Easy Replacement Guarantee</h3>
                <p>
                  We inspect all baby items before packaging. However, if your order arrives damaged, defective, or does not match the product description:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Please notify our support hotline within 7 days of receiving the parcel.</li>
                  <li>Our courier partner will pick up the item from your home for free.</li>
                  <li>We will immediately dispatch a fresh replacement unit or issue a full cash refund.</li>
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mb-12 px-4 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Related Baby Products
            </h2>
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Browse All Products &rsaquo;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* Recently Viewed Products Grid */}
        <div className="px-4 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recommended For You
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((recProduct) => (
              <ProductCard
                key={recProduct.id}
                product={recProduct}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
