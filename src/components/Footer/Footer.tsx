import React from 'react';
import { PhoneCall, Mail, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Logo } from '../common/Logo';
import { categories } from '../../data/categories';
import footerPattern from '../../assets/footer-pattern.jpg';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenPolicy: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenPolicy }) => {
  const openShippingPolicy = () => {
    onOpenPolicy(
      'Shipping & Delivery Policy',
      'We deliver nationwide across all 64 districts in Bangladesh using trusted courier services. Inside Dhaka delivery is ৳70 within 24-48 hours. Outside Dhaka delivery is ৳130 within 2-4 business days. All orders are strictly Cash on Delivery: you inspect your parcel at your doorstep before paying the delivery rider.'
    );
  };

  const openReturnPolicy = () => {
    onOpenPolicy(
      'Return & Refund Policy',
      'We offer a 7-day hassle-free replacement guarantee. If you receive a damaged, defective, or incorrect baby product, simply notify our parenting hotline at +880 9617-100900. Our team will arrange an instant free pickup and replacement.'
    );
  };

  const openPrivacyPolicy = () => {
    onOpenPolicy(
      'Privacy Policy',
      'Your privacy is sacred to us. We only collect your name, phone number, and delivery address to process your Cash on Delivery orders. We never share, sell, or rent your personal data to third parties.'
    );
  };

  const openTerms = () => {
    onOpenPolicy(
      'Terms & Conditions',
      'All products listed on Baby Panda are genuine and baby-safe. Prices are in Bangladeshi Taka (BDT ৳) and include applicable taxes. We reserve the right to verify orders via a quick verification call before dispatch.'
    );
  };

  return (
    <footer
      className="relative text-slate-200 text-xs pt-10 pb-24 md:pb-8 border-t border-white/10 overflow-hidden bg-[#241066]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 10, 58, 0.35), rgba(15, 8, 48, 0.50)), url(${footerPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 380px auto',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Top Minimal Highlights Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Logo variant="light" />
            <span className="hidden sm:inline text-white/30">|</span>
            <p className="text-xs text-slate-300 font-medium">
              Carefully curated baby essentials, delivered across Bangladesh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-semibold text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Cash on Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-300">
              <Truck className="w-3.5 h-3.5" /> Nationwide Shipping
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-purple-200">
              <RotateCcw className="w-3.5 h-3.5" /> 7-Day Easy Return
            </span>
          </div>
        </div>

        {/* Minimal 3-Column Navigation & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 text-left">
          
          {/* Col 1: Quick Categories */}
          <div className="md:col-span-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3.5">
              Popular Categories
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="text-left text-slate-300 hover:text-white transition-colors truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Policies */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3.5">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={openShippingPolicy} className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Info
                </button>
              </li>
              <li>
                <button onClick={openReturnPolicy} className="hover:text-white transition-colors">
                  Return &amp; Replacement Policy
                </button>
              </li>
              <li>
                <button onClick={openPrivacyPolicy} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={openTerms} className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Helpline / Quick Contact */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">
              Order Hotline &amp; Support
            </h4>
            <p className="text-[11px] text-slate-300 mb-3">
              Need help choosing the right size or tracking your COD order?
            </p>
            
            <a
              href="tel:+8809617100900"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-95 mb-2.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+880 9617-100900</span>
            </a>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Mail className="w-3.5 h-3.5 text-brand-300 shrink-0" />
              <span>support@babypanda.com.bd</span>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div>
            <span>&copy; {new Date().getFullYear()} <strong>Baby Panda</strong>. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span>Cash on Delivery Available in all 64 Districts</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
