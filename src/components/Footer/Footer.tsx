import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
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
      'All products listed on Baby Panda are genuine and baby-safe. Prices are in Bangladeshi Taka (BDT ৳) and include applicable taxes. We reserve the right to verify high-value orders via a quick verification phone call before dispatch.'
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
              Bangladesh’s most trusted online store for premium baby products, mother care essentials, and gentle nursery gear. We bring joy and safety to every step of your parenting journey with 100% Cash on Delivery nationwide.
            </p>
            
            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-300 shrink-0 mt-0.5" />
                <span>House 42, Road 11, Block D, Banani / New Market City Complex, Dhaka-1205</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-300 shrink-0" />
                <span>Hotline: <strong className="text-white">+880 9617-100900</strong> / 01700-000000</span>
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
              Shop By Category
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
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
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <button onClick={openShippingPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>Shipping Policy</span>
                </button>
              </li>
              <li>
                <button onClick={openReturnPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>Return &amp; Refund Policy</span>
                </button>
              </li>
              <li>
                <button onClick={openPrivacyPolicy} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={openTerms} className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>Terms &amp; Conditions</span>
                </button>
              </li>
              <li>
                <a href="#best-sellers-section" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <span className="text-brand-300">›</span>
                  <span>Best Selling Products</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Payment Notice */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Payment &amp; Trust
            </h4>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Cash on Delivery</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                Check and inspect your baby items at your doorstep before paying the delivery agent. No credit card or advance mobile banking fee required!
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 font-medium">
                ⚡ Dhaka: 24-48 Hours | All Districts: 2-4 Days
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            <span>Copyright &copy; 2026 <strong>Baby Panda</strong>. All rights reserved.</span>
            <Link to="/admin" className="ml-3 text-white/30 hover:text-amber-300 transition-colors text-[11px] underline">
              Admin Portal
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">Follow Us:</span>
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
