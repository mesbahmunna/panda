import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings,
  KeyRound,
  Store,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle2,
  Save,
  AlertCircle
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getAdminSettings, saveAdminSettings } from '../services/settingsStorage';
import { AdminStoreSettings } from '../types/admin';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminSettingsPage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [settings, setSettings] = useState<AdminStoreSettings>(() => getAdminSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.adminPin.trim()) {
      alert('Security PIN cannot be blank.');
      return;
    }
    saveAdminSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Store & Logistics Settings"
        subtitle="Manage master security PIN, hotline contact info, and delivery rates"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Store settings saved successfully and updated live across the portal!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Admin Security PIN */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Admin Portal Security PIN</h3>
            </div>
            
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Master Security Access PIN *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={settings.adminPin}
                onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                className="w-full font-mono text-center text-lg font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Required each time you access <code className="text-slate-600 font-bold">/admin</code>.
              </span>
            </div>
          </div>

          {/* Section 2: Contact & Storefront Info */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Store Identity & Customer Hotline</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parenting Hotline Number</label>
                <input
                  type="text"
                  value={settings.hotlinePhone}
                  onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Support Number</label>
                <input
                  type="text"
                  value={settings.whatsappPhone}
                  onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Office / Showroom Address</label>
                <input
                  type="text"
                  value={settings.showroomAddress}
                  onChange={(e) => setSettings({ ...settings, showroomAddress: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Fees & Courier Charges */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Delivery Rates & Courier Rates</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inside Dhaka Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.insideDhakaFee}
                  onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                  className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outside Dhaka Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.outsideDhakaFee}
                  onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                  className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Courier COD Handling Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={settings.courierHandlingFeePercent}
                  onChange={(e) => setSettings({ ...settings, courierHandlingFeePercent: Number(e.target.value) })}
                  className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#0b0952] font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Store Settings</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
};
