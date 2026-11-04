import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Gift } from 'lucide-react';

interface PromoBannerProps {
  variant?: 'starter-kit' | 'playtime';
  onCtaClick: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  variant = 'starter-kit',
  onCtaClick,
}) => {
  if (variant === 'starter-kit') {
    return (
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-6 sm:p-10 shadow-lg border border-brand-700/40">
          {/* Subtle Background Pattern */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold mb-3 border border-white/10">
                <Gift className="w-3.5 h-3.5" />
                <span>নবজাতকের স্পেশাল কেয়ার বক্স</span>
              </div>
              
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2">
                নিউবর্ন স্টার্টার বান্ডেল (১২টি নিত্যপ্রয়োজনীয় সামগ্রী)
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl mb-4 leading-relaxed">
                শিশুর প্রথম ৯০ দিনের সুরক্ষায় চিকিৎসকদের পরামর্শ অনুযায়ী তৈরি: ১০০% অর্গানিক সুতি সোয়াডেল, অ্যান্টি-কলিক ফিডার, ইলেকট্রিক নেইল ট্রিমার ও মাইল্ড বেবি ওয়াশ।
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-300 mb-6">
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ১০০% ক্যাশ অন ডেলিভারি
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  ⚡ ২৪-৪৮ ঘণ্টায় এক্সপ্রেস ডেলিভারি
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onCtaClick}
                  className="px-6 py-3 bg-babyCoral hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>বান্ডেল অর্ডার করুন (৳১,২০০ সাশ্রয়)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80"
                  alt="Newborn Bundle"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20 transform md:rotate-2 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute -top-3 -right-3 bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                  ফ্ল্যাট ৪০% ছাড়
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white p-6 sm:p-10 shadow-lg border border-teal-700/40">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-8 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>শিশুর মানসিক ও শারীরিক বিকাশ</span>
            </div>
            
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2">
              নিরাপদ খেলনা ও দাঁতের ব্যথানাশক টিথার কালেকশন
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl mb-4 leading-relaxed">
              শতভাগ নন-টক্সিক কাঠের মন্টেসরি কিউব, নরম ফুড-গ্রেড সিলিকন টিথার এবং আকর্ষণীয় মিউজিক্যাল র‍্যাটল।
            </p>

            <button
              onClick={onCtaClick}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-emerald-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>লার্নিং খেলনাসমূহ দেখুন</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=500&q=80"
              alt="Baby Sensory Toys"
              className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
