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
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getAdminSettings, saveAdminSettings } from '../services/settingsStorage';
import { AdminStoreSettings } from '../types/admin';
import { pingSteadfast } from '../services/steadfastService';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminSettingsPage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [settings, setSettings] = useState<AdminStoreSettings>(() => getAdminSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  // Ping Test State
  const [pingLoading, setPingLoading] = useState(false);
  const [pingResult, setPingResult] = useState<{
    connected?: boolean;
    message?: string;
    latencyMs?: number;
    time?: string;
  } | null>(null);

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

  const handleTestPing = async () => {
    setPingLoading(true);
    setPingResult(null);
    const res = await pingSteadfast();
    setPingResult(res);
    setPingLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Store & Logistics Settings"
        subtitle="Manage master security PIN, hotline contact info, and Steadfast courier API"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Store settings and Steadfast credentials saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Steadfast Courier (Packzy API v1) Integration */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-xl text-brand-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Steadfast Courier (Packzy API v1)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active Partner
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official nationwide COD booking, fraud scoring, and real-time tracking
                  </p>
                </div>
              </div>

              {/* Ping Connection Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={pingLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-brand-700 font-bold text-xs transition-colors border border-indigo-200"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingLoading ? 'animate-spin' : ''}`} />
                  <span>{pingLoading ? 'Pinging...' : 'Test Connection (Ping)'}</span>
                </button>
                <a
                  href="https://steadfast.com.bd/user/api"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Steadfast API Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Ping Result Banner */}
            {pingResult && (
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                  pingResult.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {pingResult.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">{pingResult.message}</span>
                    {pingResult.time && (
                      <span className="text-[11px] block text-emerald-700/80">
                        Steadfast Server Time: {new Date(pingResult.time).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                {pingResult.latencyMs !== undefined && (
                  <span className="font-mono font-bold text-[11px] bg-white/70 px-2 py-0.5 rounded">
                    {pingResult.latencyMs} ms
                  </span>
                )}
              </div>
            )}

            {/* Credential Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Steadfast Api-Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                  >
                    {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKeys ? 'Mask' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={settings.steadfastApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, steadfastApiKey: e.target.value })}
                  placeholder="e.g. 5a6jjgtod15mg68pdp3pewjae9zu4k8g"
                  className="w-full text-xs font-mono font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Steadfast Secret-Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={settings.steadfastSecretKey || ''}
                  onChange={(e) => setSettings({ ...settings, steadfastSecretKey: e.target.value })}
                  placeholder="e.g. rygkmut7erremcmoeczyewi3"
                  className="w-full text-xs font-mono font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={settings.steadfastBaseUrl || 'https://portal.packzy.com/api/v1'}
                  onChange={(e) => setSettings({ ...settings, steadfastBaseUrl: e.target.value })}
                  className="w-full text-xs font-mono font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Rider Instruction Note
                </label>
                <input
                  type="text"
                  value={settings.steadfastDefaultNote || 'Handle with care - Baby Panda'}
                  onChange={(e) => setSettings({ ...settings, steadfastDefaultNote: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Admin Security PIN */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Admin Portal Master PIN</h3>
                <p className="text-xs text-slate-500">Used to unlock the Admin Dashboard on this device</p>
              </div>
            </div>

            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={settings.adminPin}
                onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                className="w-full text-center tracking-widest text-lg font-mono font-extrabold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section 3: Store Profile & Public Contact Info */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Store Profile & Contacts</h3>
                <p className="text-xs text-slate-500">Contact information displayed on invoices and store footer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Helpline Phone</label>
                <input
                  type="text"
                  value={settings.hotlinePhone}
                  onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={settings.whatsappPhone}
                  onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warehouse & Showroom Address</label>
                <textarea
                  rows={2}
                  value={settings.showroomAddress}
                  onChange={(e) => setSettings({ ...settings, showroomAddress: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Nationwide Delivery Fees */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Standard Delivery Fees</h3>
                <p className="text-xs text-slate-500">Shipping rates calculated automatically at checkout</p>
              </div>
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
                  Steadfast COD Collection Charge (%)
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
