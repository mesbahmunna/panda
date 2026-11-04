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
                ক্যাশ অন ডেলিভারি
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                পার্সেল হাতে পেয়ে দেখে সম্পূর্ণ মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের ঝামেলা নেই।
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
                প্রিমিয়াম বেবি প্রোডাক্টস
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ১০০% ফুড-গ্রেড সিলিকন, বিপিএ-মুক্ত উপাদান এবং শিশুর সংবেদনশীল ত্বকের উপযোগী নরম সুতি ফেব্রিক।
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
                সারা দেশে দ্রুত ডেলিভারি
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                বাংলাদেশের ৬৪ জেলার যেকোনো প্রান্তে ২৪ থেকে ৭২ ঘণ্টার মধ্যে দ্রুততম হোম ডেলিভারি।
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
                সার্বক্ষণিক কাস্টমার কেয়ার
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                সাইজ বা পণ্য ব্যবহারের তথ্যের জন্য আমাদের কল বা হোয়াটসঅ্যাপে যেকোনো সময় পরামর্শ নিন।
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
