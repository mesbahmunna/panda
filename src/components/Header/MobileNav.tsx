import React from 'react';
import { Home, Grid, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileNavProps {
  onNavigateHome: () => void;
  onOpenCategories: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onNavigateHome,
  onOpenCategories,
}) => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
      
      {/* Curved Background with Center Notch (Pixel-Perfect Match to Reference Image) */}
      <div className="relative w-full h-[64px] pointer-events-auto">
        
        {/* Layer 1: Seamless Dark Background with Continuous Curved Notch */}
        <div className="absolute inset-0 flex items-stretch">
          {/* Left flat bar */}
          <div className="flex-1 h-full bg-[#111827]" />
          
          {/* Center Smooth Curved Notch SVG */}
          <svg
            viewBox="0 0 120 64"
            className="w-[120px] h-[64px] shrink-0 fill-[#111827] -mx-[0.5px]"
            preserveAspectRatio="none"
          >
            {/* Buttery-smooth G1/C1 continuous bezier scoop */}
            <path d="M 0 0 L 12 0 C 32 0 40 32 60 32 C 80 32 88 0 108 0 L 120 0 L 120 64 L 0 64 Z" />
          </svg>
          
          {/* Right flat bar */}
          <div className="flex-1 h-full bg-[#111827]" />
        </div>

        {/* Layer 2: Icons & Nav Actions (Sitting exactly in place) */}
        <div className="relative z-10 w-full h-full flex items-center justify-between px-2">
          
          {/* HOME */}
          <button
            onClick={onNavigateHome}
            className="flex-1 h-full flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors py-1 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-extrabold tracking-wider mt-1">
              হোম
            </span>
          </button>

          {/* MENU / CATEGORIES */}
          <button
            onClick={onOpenCategories}
            className="flex-1 h-full flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors py-1 group"
          >
            <Grid className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-extrabold tracking-wider mt-1">
              মেনু
            </span>
          </button>

          {/* CENTER: Floating Elevated Cart Button inside the scoop (Matching Image 3) */}
          <div className="w-[120px] h-full relative flex flex-col items-center justify-end pb-1.5 shrink-0">
            {/* Floating Elevated Circular Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full bg-[#5844ED] text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 ring-4 ring-[#111827] group transform active:scale-95 transition-all focus:outline-none"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />

              {/* Counter Badge at top-right (Matching Image 3) */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#111827] shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CART label sitting comfortably inside the bottom of the bar */}
            <span className="text-[10px] font-black uppercase text-slate-200 tracking-wider">
              কার্ট
            </span>
          </div>

          {/* CALL */}
          <a
            href="tel:+8809617100900"
            className="flex-1 h-full flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors py-1 group"
          >
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-extrabold tracking-wider mt-1">
              কল
            </span>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/8809617100900"
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-full flex flex-col items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors py-1 group"
          >
            <svg className="w-5 h-5 fill-[#25D366] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="text-[10px] font-extrabold tracking-wider mt-1 text-[#25D366]">
              হোয়াটসঅ্যাপ
            </span>
          </a>

        </div>

      </div>

    </div>
  );
};
