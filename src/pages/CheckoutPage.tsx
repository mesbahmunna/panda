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
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Cumilla', 'Brahmanbaria', 'Cox\'s Bazar', 'Bogura', 'Jessore',
  'Dinajpur', 'Feni', 'Tangail', 'Jamalpur', 'Kushtia', 'Pabna', 'Noakhali', 'Faridpur', 'Narsingdi'
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
      errs.customerName = 'Please enter your full name';
    }
    const cleanPhone = formData.phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phoneNumber = 'Phone number is required for delivery rider';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone) && cleanPhone.length < 11) {
      errs.phoneNumber = 'Please enter a valid 11-digit Bangladeshi phone number (e.g. 017XXXXXXXX)';
    }
    if (!formData.address.trim()) {
      errs.address = 'Full street address (house/road/area) is required';
    }
    if (!formData.district) {
      errs.district = 'Please select your delivery district';
    }
    if (!formData.upazila.trim()) {
      errs.upazila = 'Please enter your Thana / Upazila';
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
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          You don&apos;t have any baby products in your cart to checkout. Explore our collections to get started!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start Shopping</span>
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
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600 font-medium">Cart</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-brand-600 font-bold">Cash on Delivery Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Page Title */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cash on Delivery Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your delivery information below. You will pay in cash upon receiving your parcel.
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
                  100% Cash on Delivery — No Advance Needed
                </strong>
                You only pay after the delivery rider delivers your parcel. Feel free to inspect your package before handing over the cash payment!
              </div>
            </div>

            {/* Delivery Form Container */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-card text-left space-y-5">
              
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-brand-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Customer &amp; Delivery Address
                </h2>
              </div>

              {/* Delivery Zone Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Delivery Zone:
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
                    Inside Dhaka (৳ 70)
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">24 - 48 Hours</span>
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
                    Outside Dhaka (৳ 130)
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">2 - 4 Days</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Ayesha Siddiqua / Rafiqul Islam"
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
                    Mobile Phone Number *
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
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {bangladeshDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} {dist === 'Dhaka' ? '(Inside Dhaka)' : '(Outside Dhaka)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thana / Upazila / Area *
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    placeholder="e.g. Dhanmondi / Mirpur / Panchlaish"
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
                  Full Street Address (House, Road, Flat, Landmark) *
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House #14, Road #5, Flat 3B, Sector 7, Uttara"
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
                  Delivery Rider Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Please call before arriving or deliver after 4 PM"
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
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  + Add More
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
                              Age: {item.selectedVariation}
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
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove item"
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
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                  <span className="font-semibold text-slate-800">৳ {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Payable on Delivery:</span>
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
                <span>{submitting ? 'Confirming Order...' : `Confirm Order — ৳ ${total.toLocaleString()} (COD)`}</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
                🔒 <strong>100% Cash on Delivery Guarantee.</strong> No credit card or online payment required. Pay rider only upon arrival.
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
