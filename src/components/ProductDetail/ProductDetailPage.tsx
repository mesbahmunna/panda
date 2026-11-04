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
            হোম
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
                    -{product.discountPercent}% ছাড়
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
                      title="শেয়ার করুন"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{copiedShare ? 'লিংক কপি হয়েছে!' : 'শেয়ার'}</span>
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
                      ৳ {currentSavings.toLocaleString()} সাশ্রয় ({discountPct}% ছাড়)
                    </span>
                  </>
                )}
                {selectedBundle && (
                  <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60 ml-auto">
                    {selectedBundle.title} প্যাক
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
                          onClick={() => {
                            setSelectedVariation(opt.name);
                            if (opt.imageIndex !== undefined) {
                              setActiveImageIndex(opt.imageIndex);
                            }
                          }}
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
                      <span>স্পেশাল অফার প্যাক সিলেক্ট করুন:</span>
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
                                (সাশ্রয় ৳{savings.toLocaleString()})
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
                      aria-label="পরিমাণ কমান"
                    >
                      -
                    </button>
                    <span className="text-white font-black text-sm sm:text-base px-1 text-center min-w-[1.2rem]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white hover:bg-slate-50 active:scale-95 text-[#5844ED] font-black text-lg flex items-center justify-center shadow-xs transition-all"
                      aria-label="পরিমাণ বাড়ান"
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
                    <span>কার্টে যোগ করুন</span>
                  </button>

                </div>

                {/* ROW 2: ORDER NOW - 100% width, Deep Navy, Animated & Shiny, Matching Image 1 */}
                <button
                  onClick={handleOrderNow}
                  className="w-full h-12 sm:h-13 bg-[#080638] hover:bg-[#0c094f] active:scale-98 text-white font-black text-sm sm:text-base tracking-wider uppercase rounded-xl shadow-xl shadow-indigo-950/40 flex items-center justify-center transition-all btn-shiny"
                >
                  <span>এখনই অর্ডার করুন</span>
                </button>

              </div>

              {/* SEPARATE: Hotline Quick Order Bar with Distinct Breathing Room Gap */}
              <div className="pt-3 sm:pt-4">
                <div className="w-full rounded-2xl bg-indigo-50/70 border border-indigo-100/90 p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 shadow-xs">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Phone className="w-4 h-4 text-[#5844ED] shrink-0" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      সরাসরি অর্ডার করতে কল বা হোয়াটসঅ্যাপ করুন (২৪/৭)
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
                <span>পণ্যের বিবরণ ও বৈশিষ্ট্য</span>
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
                    <h4 className="font-bold text-slate-900 mb-2">প্রধান আকর্ষণসমূহ:</h4>
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
                <span>স্পেসিফিকেশন ও বিবরণ</span>
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
                <span>ক্যাশ অন ডেলিভারি নিয়মাবলী</span>
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
                  Baby Panda-তে আমরা বাংলাদেশের সকল ৬৪ জেলায় <strong>১০০% ক্যাশ অন ডেলিভারি (COD)</strong> সুবিধা প্রদান করি। পার্সেল হাতে পেয়ে নিশ্চিত হয়ে মূল্য পরিশোধ করুন।
                </p>
                <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 space-y-1.5 text-[11px]">
                  <p><strong>• ঢাকার ভেতরে:</strong> ৳৭০ ডেলিভারি চার্জ (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)।</p>
                  <p><strong>• ঢাকার বাইরে:</strong> ৳১৩০ ডেলিভারি চার্জ (২-৪ দিনের মধ্যে ডেলিভারি)।</p>
                  <p><strong>• পার্সেল চেক:</strong> ডেলিভারি রাইডারের সামনে পার্সেল খুলে দেখে মূল্য পরিশোধ করবেন।</p>
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
                <span>৭ দিনের রিটার্ন ও এক্সচেঞ্জ</span>
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
                  যদি কোনো কারণে ত্রুটিপূর্ণ বা ভুল পণ্য পেয়ে থাকেন, তবে পার্সেল পাওয়ার ৭ দিনের মধ্যে আমাদের হটলাইনে কল করুন। আমরা সম্পূর্ণ বিনামূল্যে পণ্য পরিবর্তন করে নতুন পণ্য পৌঁছে দেব।
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
              পণ্যের বিবরণ ও বৈশিষ্ট্য
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              স্পেসিফিকেশন ও বিবরণ
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ক্যাশ অন ডেলিভারি পলিসি
            </button>

            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'returns'
                  ? 'border-brand-500 text-brand-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ৭ দিনের রিটার্ন ও এক্সচেঞ্জ
            </button>
          </div>

          {/* Tab Body Content */}
          <div className="p-5 sm:p-8 text-left">
            
            {/* 1. Description Tab */}
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">পণ্যটির বিস্তারিত বিবরণ</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {product.features.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">মূল বৈশিষ্ট্য ও সুবিধাসমূহ:</h4>
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
                <h3 className="text-base font-bold text-slate-900 mb-4">প্রযুক্তিগত স্পেসিফিকেশন</h3>
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
                <h3 className="text-base font-bold text-slate-900">সমগ্র বাংলাদেশে হোম ডেলিভারিতে ক্যাশ অন ডেলিভারি</h3>
                <p>
                  Baby Panda-তে আমরা সম্পূর্ণ <strong>১০০% ক্যাশ অন ডেলিভারি (COD)</strong> ভিত্তিতে সার্ভিস প্রদান করি। পার্সেল হাতে পেয়ে নিশ্চিত হয়ে টাকা পরিশোধ করুন।
                </p>
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 space-y-2 text-xs">
                  <p><strong>• ঢাকা সিটির ভেতরে:</strong> ৳৭০ ডেলিভারি চার্জ। ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি।</p>
                  <p><strong>• ঢাকার বাইরে (সকল ৬৩ জেলা):</strong> ৳১৩০ ডেলিভারি চার্জ। ২ থেকে ৪ কার্যদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ারে হোম ডেলিভারি।</p>
                  <p><strong>• অর্ডার ভেরিফিকেশন:</strong> অর্ডার করার পর আমাদের কাস্টমার প্রতিনিধি কল দিয়ে আপনার ঠিকানা ও তথ্য নিশ্চিত করবেন।</p>
                </div>
              </div>
            )}

            {/* 4. Returns Tab */}
            {activeTab === 'returns' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">৭ দিনের সহজ পণ্য প্রতিস্থাপন গ্যারান্টি</h3>
                <p>
                  আমরা প্রতিটি পণ্য নিখুঁতভাবে চেক করে প্যাকেজিং করি। তবুও পার্সেল পাওয়ার পর কোনো ত্রুটি দেখা গেলে:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>পার্সেল গ্রহণের ৭ দিনের মধ্যে আমাদের কাস্টমার হটলাইনে জানান।</li>
                  <li>আমাদের কুরিয়ার পার্টনার বিনামূল্যে আপনার বাসা থেকে ত্রুটিযুক্ত পণ্য সংগ্রহ করবে।</li>
                  <li>আমরা অবিলম্বে নতুন ইনট্যাক্ট পণ্য পাঠিয়ে দেব অথবা আপনার টাকা ফেরত প্রদান করব।</li>
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mb-12 px-4 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              সম্পর্কিত অন্যান্য পণ্য
            </h2>
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              সব পণ্য দেখুন &rsaquo;
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
              আপনার জন্য আরও পছন্দ হতে পারে
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
