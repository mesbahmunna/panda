import React from 'react';
import { Truck, ShieldCheck, MapPin, HeadphonesIcon, Award, HeartHandshake } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  return (
    <section className="bg-white border-y border-slate-200/60 py-10 my-6">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Cash on Delivery */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Cash on Delivery
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pay only when your parcel arrives safely at your doorstep. No advance payment needed.
              </p>
            </div>
          </div>

          {/* 2. Quality Baby Products */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Quality Baby Products
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% Food-grade silicone, BPA-free plastics, and organic hypoallergenic baby-safe cotton.
              </p>
            </div>
          </div>

          {/* 3. Nationwide Delivery */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Nationwide Delivery
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fast doorstep courier delivery across all 64 districts in Bangladesh within 24 to 72 hours.
              </p>
            </div>
          </div>

          {/* 4. Customer Support */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <HeadphonesIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Parenting Customer Support
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have questions about sizes or usage? Friendly phone and WhatsApp support 9 AM to 11 PM.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
