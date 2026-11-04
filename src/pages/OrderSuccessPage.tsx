import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Truck, Phone, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderDetails } from '../types/cart';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { lastOrder } = useCart();

  const order: OrderDetails | null = (location.state as { order?: OrderDetails })?.order || lastOrder;

  return (
    <div className="bg-[#F8F9FD] min-h-[85vh] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 text-left animate-scaleUp">
        
        {/* Success Checkmark Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            আপনার অর্ডারের জন্য আন্তরিক ধন্যবাদ!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            অর্ডার রেফারেন্স আইডি: <strong className="font-mono text-slate-800 text-base">{order?.orderId || orderId}</strong>
          </p>
        </div>

        {/* Verification Call Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-6 flex items-start gap-3">
          <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold block text-slate-900">পরবর্তী ধাপ: ফোন কল ভেরিফিকেশন</span>
            আমাদের কাস্টমার প্রতিনিধি শীঘ্রই
            {order?.phoneNumber && (
              <> আপনার <strong className="font-semibold text-slate-900">{order.phoneNumber}</strong> নম্বরে</>
            )} কল করে ঠিকানা ও অর্ডার কনফার্ম করে পার্সেলটি পাঠিয়ে দেবেন।
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6 space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">গ্রাহকের নাম</span>
                <span className="font-bold text-slate-800">{order.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">পেমেন্ট পদ্ধতি</span>
                <span className="font-bold text-emerald-600">ক্যাশ অন ডেলিভারি (COD)</span>
              </div>
            </div>

            <div className="pb-3 border-b border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">ডেলিভারি ঠিকানা</span>
              <p className="font-medium text-slate-800 mt-0.5">
                {order.address}, {order.upazila}, {order.district}
              </p>
            </div>

            {/* Items summary */}
            {order.items && order.items.length > 0 && (
              <div className="pb-3 border-b border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">
                  অর্ডারকৃত পণ্যসমূহ ({order.items.reduce((s, i) => s + i.quantity, 0)} টি)
                </span>
                <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100">
                  {order.items.map((item) => {
                    const effectivePrice = item.unitPrice || item.selectedBundle?.price || item.product.price;
                    return (
                      <div key={item.id || item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <img src={item.product.thumbnail} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <span className="truncate font-medium text-slate-800 block">{item.product.name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              {item.selectedVariation && (
                                <span className="text-[#5844ED] font-bold">{item.selectedVariation}</span>
                              )}
                              {item.selectedBundle && (
                                <span className="text-emerald-700 font-bold">• {item.selectedBundle.title}</span>
                              )}
                              <span>• x{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          ৳ {(effectivePrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payable Amount */}
            <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-900 pt-1">
              <span>কুরিয়ার রাইডারকে প্রদেয় মোট টাকা:</span>
              <span className="text-brand-600">৳ {order.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Delivery Guarantee Notice */}
        <div className="flex items-center gap-2 text-slate-500 text-xs mb-6 px-1">
          <Truck className="w-4 h-4 text-brand-500 shrink-0" />
          <span>
            সম্ভাব্য ডেলিভারি সময়: <strong>{order?.district === 'Dhaka' ? '২৪ - ৪৮ ঘণ্টা' : '২ - ৪ কার্যদিবস'}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>আরও কেনাকাটা করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
