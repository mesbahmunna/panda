import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { getHeroSlides, HeroSlide, DEFAULT_HERO_SLIDES } from '../../services/heroSliderService';

interface HeroBannerProps {
  onShopNow?: () => void;
  onExploreFeeding?: () => void;
  onExploreClothing?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const all = getHeroSlides();
    const active = all.filter((s) => s.isActive);
    return active.length > 0 ? active : DEFAULT_HERO_SLIDES;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const all = getHeroSlides();
      const active = all.filter((s) => s.isActive);
      setSlides(active.length > 0 ? active : DEFAULT_HERO_SLIDES);
      setCurrentSlide(0);
    };

    window.addEventListener('baby_hero_slides_updated', handleUpdate);
    return () => window.removeEventListener('baby_hero_slides_updated', handleUpdate);
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (slide: HeroSlide) => {
    if (!slide.redirectUrl) return;

    const url = slide.redirectUrl.trim();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      if (slide.target === '_blank') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    } else {
      navigate(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-3 sm:pt-4 pb-4 sm:pb-6">
      {/* Pure Image Hero Slider Banner (No text overlay, no button overlay) */}
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card bg-slate-100 group select-none aspect-[16/9] sm:aspect-[16/7] md:aspect-[2.2/1] lg:aspect-[2.4/1]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              onClick={() => handleSlideClick(slide)}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              title={slide.redirectUrl ? `ক্লিক করে ভিজিট করুন: ${slide.redirectUrl}` : undefined}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || `Baby Panda Banner ${index + 1}`}
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Previous Button */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(i);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-6 sm:w-7 h-2 bg-amber-400' : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4 Trust Signals Bar Below Banner */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">ক্যাশ অন ডেলিভারি</h4>
            <p className="text-[11px] text-slate-500">সমগ্র বাংলাদেশে ৬৪ জেলায় হোম ডেলিভারি</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">১০০% শিশুর জন্য নিরাপদ</h4>
            <p className="text-[11px] text-slate-500">বিপিএ-মুক্ত ও পরীক্ষিত প্রিমিয়াম কোয়ালিটি</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">সহজ ৭ দিনের রিটার্ন</h4>
            <p className="text-[11px] text-slate-500">পণ্য পছন্দ না হলে বা ত্রুটি থাকলে পরিবর্তন</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-500 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800">২৪/৭ কাস্টমার সহায়তা</h4>
            <p className="text-[11px] text-slate-500">যেকোনো প্রয়োজনে আমাদের হটলাইনে কল করুন</p>
          </div>
        </div>
      </div>
    </section>
  );
};
