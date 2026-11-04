import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';
import { getStoredCategories } from '../../data/categories';
import footerPattern from '../../assets/footer-pattern.jpg';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenPolicy: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenPolicy }) => {
  const [categoryList, setCategoryList] = useState(() => getStoredCategories());

  useEffect(() => {
    const handleUpdate = () => setCategoryList(getStoredCategories());
    window.addEventListener('baby_categories_updated', handleUpdate);
    return () => window.removeEventListener('baby_categories_updated', handleUpdate);
  }, []);
  const openShippingPolicy = () => {
    onOpenPolicy(
      'ডেলিভারি ও শিপিং পলিসি',
      'আমরা সমগ্র বাংলাদেশের ৬৪ জেলায় নির্ভরযোগ্য কুরিয়ারের মাধ্যমে হোম ডেলিভারি প্রদান করি। ঢাকার ভেতরে ডেলিভারি চার্জ মাত্র ৳৭০ (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি) এবং ঢাকার বাইরে ৳১৩০ (২-৪ কার্যদিবস)। আমাদের সব অর্ডার ১০০% ক্যাশ অন ডেলিভারি: ডেলিভারি রাইডারের সামনে পার্সেল খুলে চেক করে টাকা পরিশোধ করবেন।'
    );
  };

  const openReturnPolicy = () => {
    onOpenPolicy(
      'রিটার্ন ও রিফান্ড পলিসি',
      'আমাদের প্রতিটি পণ্যে রয়েছে ৭ দিনের সহজ প্রতিস্থাপন নিশ্চয়তা। যদি পণ্যটিতে কোনো সমস্যা বা ত্রুটি থাকে, আমাদের হটলাইন +880 9617-100900 নম্বরে জানান। আমরা সম্পূর্ণ বিনামূল্যে পণ্য রিটার্ন নিয়ে নতুন পণ্য বদলে দেব।'
    );
  };

  const openPrivacyPolicy = () => {
    onOpenPolicy(
      'প্রাইভেসি পলিসি',
      'আপনার ব্যক্তিগত তথ্যের গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমরা কেবল আপনার ক্যাশ অন ডেলিভারি অর্ডার সম্পন্ন করতে নাম, মোবাইল নম্বর এবং ঠিকানা সংগ্রহ করি। আমরা কখনোই কোনো তৃতীয় পক্ষের সাথে আপনার তথ্য শেয়ার বা বিক্রয় করি না।'
    );
  };

  const openTerms = () => {
    onOpenPolicy(
      'শর্তাবলী ও নিয়মাবলী',
      'Baby Panda-তে প্রদর্শিত সকল পণ্য ১০০% আসল ও শিশুদের জন্য সম্পূর্ণ নিরাপদ। পণ্যের মূল্য বাংলাদেশি টাকায় (৳) নির্ধারিত। প্রতিটি অর্ডারের সত্যতা নিশ্চিত করতে পাঠানোর আগে আমরা ফোন কল দিয়ে থাকি।'
    );
  };

  return (
    <footer
      className="relative text-slate-200 text-xs pt-12 pb-24 md:pb-8 border-t border-indigo-950 overflow-hidden bg-[#241066]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(16, 8, 55, 0.35), rgba(11, 9, 82, 0.50)), url(${footerPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 480px auto',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 text-left">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <Logo variant="light" className="mb-4" />
            <p className="text-xs text-slate-200 leading-relaxed max-w-sm mb-5 drop-shadow-xs">
              বাংলাদেশে শিশুদের প্রিমিয়াম পণ্য, যত্ন সামগ্রী ও প্রয়োজনীয় পোশাকের সবচেয়ে বিশ্বস্ত অনলাইন শপ। সমগ্র বাংলাদেশে ১০০% ক্যাশ অন ডেলিভারি সুবিধাসহ নিশ্চিন্ত কেনাকাটার অভিজ্ঞতা।
            </p>
            
            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-300 shrink-0 mt-0.5" />
                <span>হাউস ৪২, রোড ১১, ব্লক ডি, বনানী / নিউ মার্কেট সিটি কমপ্লেক্স, ঢাকা-১২০৫</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-300 shrink-0" />
                <span>হটলাইন: <strong className="text-white">+880 9617-100900</strong> / 01700-000000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-300 shrink-0" />
                <span>support@babypanda.com.bd</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop By Category */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              ক্যাটাগরিসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              {categoryList.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-brand-300 transition-colors flex items-center gap-1.5 text-slate-200"
                  >
                    <span className="text-brand-300">›</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Policies */}
          <div id="footer-faq">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              কাস্টমার পলিসি
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <button onClick={openShippingPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>ডেলিভারি পলিসি</span>
                </button>
              </li>
              <li>
                <button onClick={openReturnPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>রিটার্ন ও রিফান্ড পলিসি</span>
                </button>
              </li>
              <li>
                <button onClick={openPrivacyPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>প্রাইভেসি পলিসি</span>
                </button>
              </li>
              <li>
                <button onClick={openTerms} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>শর্তাবলী ও নিয়মাবলী</span>
                </button>
              </li>
              <li>
                <a href="#best-sellers-section" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>বেস্ট সেলার পণ্যসমূহ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Payment Notice */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              পেমেন্ট ও নিরাপত্তা
            </h4>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>১০০% ক্যাশ অন ডেলিভারি</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                ডেলিভারি ম্যানের থেকে পার্সেল বুঝে পেয়ে দেখে তারপর মূল্য পরিশোধ করুন। কোনো ক্রেডিট কার্ড বা অগ্রিম পেমেন্টের প্রয়োজন নেই!
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 font-medium">
                ⚡ ঢাকা: ২৪-৪৮ ঘণ্টা | সারা দেশ: ২-৪ কার্যদিবস
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            <span>কপিরাইট &copy; ২০২৬ <strong>Baby Panda</strong>। সর্বস্বত্ব সংরক্ষিত।</span>
            <Link to="/admin" className="ml-3 text-white/30 hover:text-amber-300 transition-colors text-[11px] underline">
              Admin Portal
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">আমাদের ফলো করুন:</span>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/15 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors">
                f
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/15 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors">
                ig
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/15 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors">
                yt
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
