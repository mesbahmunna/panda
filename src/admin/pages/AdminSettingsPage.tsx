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
  EyeOff,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link2,
  Sparkles,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getAdminSettings, saveAdminSettings } from '../services/settingsStorage';
import { AdminStoreSettings } from '../types/admin';
import { pingSteadfast } from '../services/steadfastService';
import {
  getHeroSlides,
  saveHeroSlides,
  HeroSlide,
  DEFAULT_HERO_SLIDES
} from '../../services/heroSliderService';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminSettingsPage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [activeTab, setActiveTab] = useState<'slider' | 'steadfast' | 'store' | 'security'>('slider');

  // Store & Courier Settings
  const [settings, setSettings] = useState<AdminStoreSettings>(() => getAdminSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  // Hero Slider State
  const [slides, setSlides] = useState<HeroSlide[]>(() => getHeroSlides());
  const [sliderSaved, setSliderSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Ping Test State
  const [pingLoading, setPingLoading] = useState(false);
  const [pingResult, setPingResult] = useState<{
    connected?: boolean;
    message?: string;
    latencyMs?: number;
    time?: string;
  } | null>(null);

  const handleSaveStoreSettings = (e: React.FormEvent) => {
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

  // Slider Actions
  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleImageFileUpload = async (slideId: string, file: File) => {
    setUploadingId(slideId);
    try {
      // 1. Try uploading to local PHP server if available
      const formData = new FormData();
      formData.append('image', file);
      const isBabySubdir = window.location.pathname.startsWith('/baby');
      const uploadEndpoint = isBabySubdir ? '/baby/api/upload.php' : '/api/upload.php';
      
      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          updateSlide(slideId, { imageUrl: data.url });
          setUploadingId(null);
          return;
        }
      }
    } catch {}

    // 2. Fallback to base64 Data URL (guaranteed offline/client-side storage)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateSlide(slideId, { imageUrl: e.target.result as string });
      }
      setUploadingId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title: `ব্যানার স্লাইড ${slides.length + 1}`,
      imageUrl: DEFAULT_HERO_SLIDES[0].imageUrl,
      redirectUrl: '/category/baby-clothing',
      target: '_self',
      isActive: true
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('কমপক্ষে একটি স্লাইড অবশ্যই থাকতে হবে।');
      return;
    }
    if (window.confirm('আপনি কি এই স্লাইডটি ডিলিট করতে চান?')) {
      setSlides(slides.filter((s) => s.id !== id));
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const next = [...slides];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setSlides(next);
  };

  const handleSaveSlider = () => {
    saveHeroSlides(slides);
    setSliderSaved(true);
    setTimeout(() => setSliderSaved(false), 3500);
  };

  const handleResetToDefaultSlides = () => {
    if (window.confirm('আপনি কি আসল ৩টি ডিফল্ট ব্যানারে রিসেট করতে চান?')) {
      setSlides(DEFAULT_HERO_SLIDES);
      saveHeroSlides(DEFAULT_HERO_SLIDES);
      setSliderSaved(true);
      setTimeout(() => setSliderSaved(false), 3500);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Store & System Settings"
        subtitle="Homepage hero slider banners, Steadfast courier API, hotline contacts, and security PIN"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('slider')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'slider'
                ? 'bg-[#0b0952] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>হিরো স্লাইডার ব্যানার ({slides.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steadfast')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'steadfast'
                ? 'bg-[#0b0952] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>স্টেডফাস্ট কুরিয়ার API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'store'
                ? 'bg-[#0b0952] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Store className="w-4 h-4 text-blue-400" />
            <span>স্টোর ও ডেলিভারি ফি</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-[#0b0952] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>মাস্টার সিকিউরিটি পিন</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HERO SLIDER BANNERS */}
        {/* ========================================================================= */}
        {activeTab === 'slider' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>হিরো স্লাইডার ব্যানার ব্যবস্থাপনা</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      হোমপেজ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ছবি পরিবর্তন করুন এবং গ্রাহক ব্যানারে ক্লিক করলে কোন ওয়েবসাইটে যাবে তা নির্ধারণ করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetToDefaultSlides}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  title="আসল ৩টি ব্যানারে রিসেট করুন"
                >
                  ডিফল্ট রিসেট
                </button>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্লাইড</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlider}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-md transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>সেভ করুন</span>
                </button>
              </div>
            </div>

            {/* Slider Saved Toast */}
            {sliderSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>হিরো স্লাইডার ব্যানার সফলভাবে সংরক্ষিত হয়েছে! ফ্রন্টএন্ডে রিলোড ছাড়াই কার্যকর হয়েছে।</span>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:underline"
                >
                  <span>হোমপেজ দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Slides List */}
            <div className="space-y-5">
              {slides.map((slide, index) => {
                const isUploading = uploadingId === slide.id;
                return (
                  <div
                    key={slide.id || index}
                    className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-sm ${
                      slide.isActive
                        ? 'border-slate-200 hover:border-amber-400/80'
                        : 'border-slate-200 opacity-60 bg-slate-50'
                    }`}
                  >
                    {/* Top Row: Slide title, order buttons, and active status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                          placeholder={`ব্যানার স্লাইড ${index + 1}`}
                          className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-400 focus:outline-none px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Active Toggle */}
                        <button
                          type="button"
                          onClick={() => updateSlide(slide.id, { isActive: !slide.isActive })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            slide.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {slide.isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                              <span>সক্রিয় (Active)</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 text-slate-400" />
                              <span>নিষ্ক্রিয় (Hidden)</span>
                            </>
                          )}
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Delete Slide */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                          title="স্লাইড মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Main Grid: Left is Image Preview, Right is Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      
                      {/* Left: Image Preview (5 cols) */}
                      <div className="lg:col-span-5 space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          ব্যানার ছবি প্রিভিউ (Banner Preview)
                        </label>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 aspect-[16/9] shadow-inner group">
                          {slide.imageUrl ? (
                            <img
                              src={slide.imageUrl}
                              alt={slide.title || 'Banner'}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <ImageIcon className="w-8 h-8 mb-1" />
                              <span className="text-xs">কোনো ছবি নেই</span>
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>আপলোড হচ্ছে...</span>
                            </div>
                          )}
                        </div>

                        {/* Upload & Quick Preset Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition-colors border border-brand-200">
                            <Upload className="w-3.5 h-3.5" />
                            <span>কম্পিউটার থেকে ছবি দিন</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleImageFileUpload(slide.id, f);
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const defaultImg = DEFAULT_HERO_SLIDES[index % DEFAULT_HERO_SLIDES.length]?.imageUrl;
                              if (defaultImg) updateSlide(slide.id, { imageUrl: defaultImg });
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors"
                          >
                            ডিফল্ট ছবি
                          </button>
                        </div>
                      </div>

                      {/* Right: Settings & Redirect Link (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        
                        {/* 1. Image URL or File Path */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>ইমেজ সোর্স (Image URL বা পাথ)</span>
                          </label>
                          <input
                            type="text"
                            value={slide.imageUrl.startsWith('data:') ? 'Custom Base64 Image (Uploaded)' : slide.imageUrl}
                            onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })}
                            placeholder="https://... অথবা /banners/slider-1.jpg"
                            className="w-full text-xs font-mono py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* 2. On-Click Redirect Website URL */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Link2 className="w-3.5 h-3.5 text-brand-600" />
                              <span>অন-ক্লিক রিডাইরেক্ট ওয়েবসাইট / পেজ লিংক</span>
                            </label>
                            {slide.redirectUrl && (
                              <a
                                href={slide.redirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <span>টেস্ট লিংক</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          
                          <input
                            type="text"
                            value={slide.redirectUrl || ''}
                            onChange={(e) => updateSlide(slide.id, { redirectUrl: e.target.value })}
                            placeholder="যেমন: https://facebook.com/yourpage বা /category/baby-clothing"
                            className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-500"
                          />

                          {/* Quick Shortcut Buttons for common links */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">শর্টকাট:</span>
                            <button
                              type="button"
                              onClick={() => updateSlide(slide.id, { redirectUrl: '/product/baby-sleeping-blanket-swaddle-wrap' })}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              ব্ল্যাঙ্কেট পেজ
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSlide(slide.id, { redirectUrl: '/category/baby-clothing' })}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              পোশাক কালেকশন
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSlide(slide.id, { redirectUrl: '/category/baby-feeding' })}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              ফিডিং সামগ্রী
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSlide(slide.id, { redirectUrl: '/category/baby-care' })}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              বেবি কেয়ার
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSlide(slide.id, { redirectUrl: 'https://facebook.com/' })}
                              className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              ফেসবুক লিংক
                            </button>
                          </div>
                        </div>

                        {/* 3. Open In New Tab Option */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id={`tab-${slide.id}`}
                            checked={slide.target === '_blank'}
                            onChange={(e) =>
                              updateSlide(slide.id, { target: e.target.checked ? '_blank' : '_self' })
                            }
                            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                          />
                          <label htmlFor={`tab-${slide.id}`} className="text-xs text-slate-700 font-medium cursor-pointer select-none">
                            নতুন ব্রাউজার ট্যাবে খুলুন (Open in new tab / window) — <span className="text-slate-400">ফেসবুক বা বাহ্যিক ওয়েবসাইটের জন্য প্রস্তাবিত</span>
                          </label>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ আরও একটি স্লাইড যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSlider}
                className="inline-flex items-center gap-2 px-7 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>স্লাইডার ব্যানার সেভ করুন</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STEADFAST COURIER SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'steadfast' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6 animate-fadeIn">
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>স্টেডফাস্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
              </div>
            )}

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
                        একমাত্র কুরিয়ার
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      সরাসরি বুকিং, ফ্রড চেক ও রিয়েলটাইম পার্সেল ট্র্যাকিং
                    </p>
                  </div>
                </div>

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
                      <span>{showKeys ? 'লুকান' : 'দেখুন'}</span>
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

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#0b0952] font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>স্টেডফাস্ট সেটিংস সেভ করুন</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STORE PROFILE & DELIVERY FEES */}
        {/* ========================================================================= */}
        {activeTab === 'store' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6 animate-fadeIn">
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>স্টোর প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!</span>
              </div>
            )}

            {/* Profile */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">স্টোর প্রোফাইল ও কন্টাক্ট ইনফো</h3>
                  <p className="text-xs text-slate-500">ইনভয়েস ও স্টোর ফুটারে প্রদর্শিত তথ্য</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">স্টোর নাম</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">হটলাইন হেল্পলাইন</label>
                  <input
                    type="text"
                    value={settings.hotlinePhone}
                    onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">হোয়াটসঅ্যাপ নম্বর</label>
                  <input
                    type="text"
                    value={settings.whatsappPhone}
                    onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">সাপোর্ট ইমেইল</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">শোরুম ও অফিস ঠিকানা</label>
                  <textarea
                    rows={2}
                    value={settings.showroomAddress}
                    onChange={(e) => setSettings({ ...settings, showroomAddress: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Fees */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">ডেলিভারি চার্জ নির্ধারণ</h3>
                  <p className="text-xs text-slate-500">চেকআউট পেজে অটোমেটিক প্রযোজ্য রেট</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ঢাকার ভেতরে ডেলিভারি চার্জ (৳)
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
                    ঢাকার বাইরে ডেলিভারি চার্জ (৳)
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
                    স্টেডফাস্ট COD হ্যান্ডলিং চার্জ (%)
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

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#0b0952] font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>স্টোর সেটিংস সেভ করুন</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY PIN */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6 animate-fadeIn">
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>মাস্টার পিন সফলভাবে আপডেট হয়েছে!</span>
              </div>
            )}

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">অ্যাডমিন পোর্টাল মাস্টার পিন</h3>
                  <p className="text-xs text-slate-500">এই ডিভাইসে অ্যাডমিন ড্যাশবোর্ড আনলক করার পিন</p>
                </div>
              </div>

              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ৪ বা ততোধিক ডিজিটের সিকিউরিটি পিন
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

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#0b0952] font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>পিন সেভ করুন</span>
              </button>
            </div>
          </form>
        )}

      </main>
    </div>
  );
};
