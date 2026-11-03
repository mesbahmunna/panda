import React, { useState, useEffect } from 'react';
import { Menu, Bell, Shield, Calendar, Store, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { soundManager } from '../../utils/audioAlert';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  pendingOrdersCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  pendingOrdersCount = 0
}) => {
  const [isSoundOn, setIsSoundOn] = useState(() => soundManager.isEnabled());

  useEffect(() => {
    const handlePref = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      if (typeof custom.detail === 'boolean') {
        setIsSoundOn(custom.detail);
      }
    };
    window.addEventListener('baby_sound_pref_changed', handlePref);
    return () => window.removeEventListener('baby_sound_pref_changed', handlePref);
  }, []);

  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setIsSoundOn(next);
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0b0952] leading-tight flex items-center gap-2">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>

        {/* Audio Alert Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isSoundOn
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-sm'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
          title={isSoundOn ? 'Order Audio Chime: ACTIVE (Click to mute)' : 'Order Audio Chime: MUTED (Click to activate)'}
        >
          {isSoundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Alert Sound ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Muted</span>
            </>
          )}
        </button>

        {/* Pending Orders Pill */}
        {pendingOrdersCount > 0 ? (
          <Link
            to="/admin/orders?status=pending"
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingOrdersCount} Pending Verification</span>
          </Link>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Orders Verified
          </span>
        )}

        {/* Storefront Link */}
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0952]/5 hover:bg-[#0b0952]/10 text-[#0b0952] transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        {/* Security badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0b0952] text-amber-400 flex items-center justify-center font-bold text-xs shadow-sm">
            BP
          </div>
          <div className="hidden xl:block text-left text-xs leading-none">
            <div className="font-semibold text-slate-800">Admin</div>
            <div className="text-[10px] text-emerald-600 font-medium">Verified</div>
          </div>
        </div>
      </div>
    </header>
  );
};
