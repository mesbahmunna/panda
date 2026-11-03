import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreFeeding: () => void;
  onExploreClothing: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onExploreFeeding,
  onExploreClothing,
}) => {
  const slides = [
    {
      id: 1,
      badge: '👶 Newborn Comfort Collection',
      title: 'Gentle, Safe & Pure For Your Little Angel',
      subtitle: '100% Organic Bamboo & Combed Cotton swaddles, rompers and nursery sets designed with love.',
      discount: 'UP TO 45% OFF',
      ctaText: 'Shop Baby Clothing',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80',
      action: onExploreClothing,
      bgGradient: 'from-indigo-900/90 via-brand-900/80 to-transparent'
    },
    {
      id: 2,
      badge: '🍼 Hassle-Free Weaning & Feeding',
      title: 'Pediatrician Approved Anti-Colic Feeding Sets',
      subtitle: '100% Food-grade Platinum Silicone suction bowls, teats and glass bottles for easy transitions.',
      discount: 'FLAT 35% OFF',
      ctaText: 'Explore Feeding Essentials',
      image: 'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=1200&q=80',
      action: onExploreFeeding,
      bgGradient: 'from-sky-950/90 via-slate-900/80 to-transparent'
    },
    {
      id: 3,
      badge: '✨ Smart Baby Care & Wellness',
      title: 'Pediatric Care & Gentle Grooming Essentials',
      subtitle: 'Whisper-quiet LED nail trimmers, soothing sound machines, and collapsible bathtubs.',
      discount: 'UP TO 40% OFF',
      ctaText: 'Explore Baby Care',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
      action: onShopNow,
      bgGradient: 'from-purple-950/90 via-brand-900/80 to-transparent'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 pb-6">
      
      {/* Hero Grid: Main Slider (left/center) + 2 Promo Tiles (right) - HT Bazar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Slider (8 cols on desktop) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-card group min-h-[360px] md:min-h-[420px] bg-slate-900 flex items-center">
          
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />

              {/* Slide Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-12 max-w-xl text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold w-fit mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{slide.badge}</span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-md bg-babyCoral font-black text-xs sm:text-sm tracking-wider uppercase mb-2 w-fit shadow-sm">
                  {slide.discount}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white mb-2.5 text-left">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 mb-6 line-clamp-2 text-left">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={slide.action}
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-500/40 hover:shadow-brand-500/60 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onShopNow}
                    className="px-3.5 py-2.5 sm:px-5 sm:py-3 bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm font-semibold text-xs sm:text-sm rounded-xl border border-white/30 transition-colors"
                  >
                    Cash On Delivery
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Prev / Next Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Dot Indicators */}
          <div className="absolute bottom-4 left-6 sm:left-12 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-7 h-2 bg-brand-400' : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Promotion Tiles (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          
          {/* Card 1: Feeding set promo */}
          <div
            onClick={onExploreFeeding}
            className="flex-1 relative rounded-2xl overflow-hidden shadow-card group cursor-pointer bg-amber-50 border border-amber-100 p-5 flex flex-col justify-between min-h-[175px] hover:shadow-card-hover transition-all"
          >
            <div className="relative z-10 max-w-[65%] text-left">
              <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Hot Weaning
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-snug group-hover:text-brand-600 transition-colors">
                Silicone Suction Dining Sets
              </h3>
              <p className="text-xs text-slate-600 mt-1">Starting from ৳ 780</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-600">
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=400&q=80"
              alt="Baby Feeding"
              className="absolute right-0 bottom-0 w-36 h-36 object-cover rounded-tl-3xl transform group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Card 2: Baby Carrier promo */}
          <div
            onClick={onShopNow}
            className="flex-1 relative rounded-2xl overflow-hidden shadow-card group cursor-pointer bg-indigo-50 border border-indigo-100 p-5 flex flex-col justify-between min-h-[175px] hover:shadow-card-hover transition-all"
          >
            <div className="relative z-10 max-w-[65%] text-left">
              <span className="text-[11px] font-bold text-brand-700 bg-brand-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Mom Favorite
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-snug group-hover:text-brand-600 transition-colors">
                6-in-1 Ergonomic Baby Carrier
              </h3>
              <p className="text-xs text-slate-600 mt-1">Flat 37% Discount</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-600">
                <span>Shop Carrier</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
              alt="Baby Carrier"
              className="absolute right-0 bottom-0 w-36 h-36 object-cover rounded-tl-3xl transform group-hover:scale-105 transition-transform"
            />
          </div>

        </div>

      </div>

      {/* 4 Trust Signals Bar (Below Hero) */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">Cash on Delivery</h4>
            <p className="text-[11px] text-slate-500">All 64 districts in Bangladesh</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">100% Baby Safe</h4>
            <p className="text-[11px] text-slate-500">BPA free &amp; certified safe</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">Easy 7-Day Return</h4>
            <p className="text-[11px] text-slate-500">Hassle-free replacement</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-500 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">Help &amp; Advice</h4>
            <p className="text-[11px] text-slate-500">Friendly parenting hotline</p>
          </div>
        </div>

      </div>

    </section>
  );
};
