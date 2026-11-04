import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const bangladeshDistricts = [
  { en: 'Dhaka', label: 'ঢাকা (Dhaka)' },
  { en: 'Chittagong', label: 'চট্টগ্রাম (Chittagong)' },
  { en: 'Sylhet', label: 'সিলেট (Sylhet)' },
  { en: 'Rajshahi', label: 'রাজশাহী (Rajshahi)' },
  { en: 'Khulna', label: 'খুলনা (Khulna)' },
  { en: 'Barishal', label: 'বরিশাল (Barishal)' },
  { en: 'Rangpur', label: 'রংপুর (Rangpur)' },
  { en: 'Mymensingh', label: 'ময়মনসিংহ (Mymensingh)' },
  { en: 'Gazipur', label: 'গাজীপুর (Gazipur)' },
  { en: 'Narayanganj', label: 'নারায়ণগঞ্জ (Narayanganj)' },
  { en: 'Cumilla', label: 'কুমিল্লা (Cumilla)' },
  { en: 'Brahmanbaria', label: 'ব্রাহ্মণবাড়িয়া (Brahmanbaria)' },
  { en: "Cox's Bazar", label: "কক্সবাজার (Cox's Bazar)" },
  { en: 'Bogura', label: 'বগুড়া (Bogura)' },
  { en: 'Jessore', label: 'যশোর (Jessore)' },
  { en: 'Dinajpur', label: 'দিনাজপুর (Dinajpur)' },
  { en: 'Feni', label: 'ফেনী (Feni)' },
  { en: 'Tangail', label: 'টাঙ্গাইল (Tangail)' },
  { en: 'Jamalpur', label: 'জামালপুর (Jamalpur)' },
  { en: 'Kushtia', label: 'কুষ্টিয়া (Kushtia)' },
  { en: 'Pabna', label: 'পাবনা (Pabna)' },
  { en: 'Noakhali', label: 'নোয়াখালী (Noakhali)' },
  { en: 'Faridpur', label: 'ফরিদপুর (Faridpur)' },
  { en: 'Narsingdi', label: 'নরসিংদী (Narsingdi)' }
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    total,
    submitOrder,
    setIsCartOpen,
  } = useCart();

  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    district: 'Dhaka',
    upazila: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন';
    }
    const cleanPhone = formData.phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phoneNumber = 'ডেলিভারি রাইডারের যোগাযোগের জন্য মোবাইল নম্বর আবশ্যক';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone) && cleanPhone.length < 11) {
      errs.phoneNumber = 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
    }
    if (!formData.address.trim()) {
      errs.address = 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) বিস্তারিত লিখুন';
    }
    if (!formData.district) {
      errs.district = 'অনুগ্রহ করে আপনার জেলা নির্বাচন করুন';
    }
    if (!formData.upazila.trim()) {
      errs.upazila = 'অনুগ্রহ করে আপনার থানা বা উপজেলা লিখুন';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDistrictChange = (dist: string) => {
    setFormData((prev) => ({ ...prev, district: dist }));
    if (dist === 'Dhaka') {
      setDeliveryZone('inside_dhaka');
    } else {
      setDeliveryZone('outside_dhaka');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      const order = submitOrder(formData);
      setSubmitting(false);
      navigate(`/order-success/${order.orderId}`, { state: { order } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#F8F9FD] min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mb-4 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">আপনার কার্ট খালি</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          চেকআউট করার জন্য আপনার কার্টে কোনো পণ্য নেই। আমাদের সেরা কালেকশন দেখতে এখনই কেনাকাটা শুরু করুন!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেনাকাটা শুরু করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen pb-16">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigate('/')} className="hover:text-brand-600 transition-colors font-medium">
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600 font-medium">কার্ট</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-brand-600 font-bold">ক্যাশ অন ডেলিভারি চেকআউট</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Page Title */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ক্যাশ অন ডেলিভারি চেকআউট
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            নিচের ফর্মে আপনার ডেলিভারির ঠিকানা দিন। পার্সেল হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করবেন।
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Delivery Details Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 100% COD Notice Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5 text-emerald-950 text-left">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="block font-extrabold text-slate-900 text-sm sm:text-base mb-0.5">
                  ১০০% ক্যাশ অন ডেলিভারি — কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই
                </strong>
                ডেলিভারি ম্যানের থেকে পণ্য হাতে পেয়ে দেখে তারপর সম্পূর্ণ টাকা পরিশোধ করবেন! কোনো অগ্রিম বা বিকাশ ফি ছাড়াই নিশ্চিন্তে অর্ডার করুন।
              </div>
            </div>

            {/* Delivery Form Container */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-card text-left space-y-5">
              
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-brand-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা
                </h2>
              </div>

              {/* Delivery Zone Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryZone('inside_dhaka');
                      setFormData((prev) => ({ ...prev, district: 'Dhaka' }));
                    }}
                    className={`py-3 px-3 rounded-2xl border text-center font-bold transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    ঢাকার ভেতরে (৳ ৭০)
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">২৪ - ৪৮ ঘণ্টা</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryZone('outside_dhaka');
                      if (formData.district === 'Dhaka') {
                        setFormData((prev) => ({ ...prev, district: 'Chittagong' }));
                      }
                    }}
                    className={`py-3 px-3 rounded-2xl border text-center font-bold transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    ঢাকার বাইরে (৳ ১৩০)
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">২ - ৪ কার্যদিবস</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার পুরো নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="যেমন: আব্দুল্লাহ আল মামুন"
                      className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border ${
                        errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল ফোন নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border ${
                        errors.phoneNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    জেলা *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {bangladeshDistricts.map((dist) => (
                      <option key={dist.en} value={dist.en}>
                        {dist.label} {dist.en === 'Dhaka' ? '(ঢাকার ভেতরে)' : '(ঢাকার বাইরে)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    থানা / উপজেলা / এলাকা *
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    placeholder="যেমন: ধানমন্ডি / মিরপুর / বাড্ডা"
                    className={`w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border ${
                      errors.upazila ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  />
                  {errors.upazila && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.upazila}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সম্পূর্ণ ঠিকানা (বাসা নং, রোড নং, ফ্ল্যাট, এলাকা) *
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="যেমন: বাসা #১৪, রোড #৫, ফ্ল্যাট ৩বি, সেক্টর ৭, উত্তরা, ঢাকা"
                  className={`w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border ${
                    errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.address}
                  </p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডেলিভারি রাইডার নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="যেমন: আসার আগে ফোন করবেন অথবা বিকেল ৪টার পর ডেলিভারি দিন"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Confirmation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card text-left space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-500" />
                  <h3 className="text-base font-bold text-slate-900">
                    অর্ডার বিবরণী ({items.reduce((s, i) => s + i.quantity, 0)} টি পণ্য)
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  + আরও যোগ করুন
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                {items.map((item) => {
                  const effectivePrice = item.unitPrice || item.selectedBundle?.price || item.product.price;
                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>

                        {/* Variation & Bundle info */}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.selectedVariation && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#5844ED] text-[9.5px] font-bold">
                              {item.selectedVariation}
                            </span>
                          )}
                          {item.selectedBundle && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9.5px] font-bold">
                              {item.selectedBundle.title}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-brand-600 font-bold mt-0.5">
                          ৳ {effectivePrice.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-200 text-slate-600"
                              aria-label="পরিমাণ কমান"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-200 text-slate-600"
                              aria-label="পরিমাণ বাড়ান"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="পণ্যটি মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 shrink-0">
                        ৳ {(effectivePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-slate-800">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ ({deliveryZone === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):</span>
                  <span className="font-semibold text-slate-800">৳ {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>সর্বমোট প্রদেয় মূল্য (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-brand-600">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Confirmation Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 btn-shiny"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{submitting ? 'অর্ডার নিশ্চিত হচ্ছে...' : `অর্ডার কনফার্ম করুন — ৳ ${total.toLocaleString()} (ক্যাশ অন ডেলিভারি)`}</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
                🔒 <strong>১০০% ক্যাশ অন ডেলিভারি সুবিধা।</strong> কোনো বিকাশ বা অগ্রিম ফি নেই। পার্সেল পাওয়ার পর দেখে মূল্য পরিশোধ করুন।
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
