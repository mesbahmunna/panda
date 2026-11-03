import React from 'react';
import { Truck, ShieldCheck, HelpCircle } from 'lucide-react';

interface TopBarProps {
  onNavigateHome: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  return (
    <div className="bg-[#0b0952] text-slate-200 text-xs py-2 px-4 border-b border-indigo-950/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Free delivery / COD notice */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Cash on Delivery Available Across Bangladesh</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Genuine Baby &amp; Mother Care</span>
          </div>
        </div>

        {/* Right: Quick Info (Hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-4 md:gap-6 text-[11px] sm:text-xs text-slate-300">
          <a href="#footer-faq" className="hidden lg:flex items-center gap-1 hover:text-white transition-colors">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>FAQs</span>
          </a>

          <div className="text-slate-400 text-[11px]">
            🕒 9:00 AM – 11:00 PM (Everyday)
          </div>
        </div>
      </div>
    </div>
  );
};
