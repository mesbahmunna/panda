import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, RefreshCw, X } from 'lucide-react';
import { SteadfastFraudData } from '../types/admin';
import { checkCustomerFraud } from '../services/steadfastService';

interface CustomerFraudBadgeProps {
  phone: string;
  initialData?: SteadfastFraudData;
  compact?: boolean;
  onDataLoaded?: (data: SteadfastFraudData) => void;
}

export const CustomerFraudBadge: React.FC<CustomerFraudBadgeProps> = ({
  phone,
  initialData,
  compact = false,
  onDataLoaded
}) => {
  const [data, setData] = useState<SteadfastFraudData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData && !!phone);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      return;
    }

    if (!phone) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    checkCustomerFraud(phone)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
          if (onDataLoaded) onDataLoaded(res);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [phone, initialData]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    setLoading(true);
    checkCustomerFraud(phone, true).then((res) => {
      setData(res);
      setLoading(false);
      if (onDataLoaded) onDataLoaded(res);
    });
  };

  if (!phone) return null;

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 animate-pulse">
        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
        Checking courier history...
      </span>
    );
  }

  // Account inactive / KYC pending
  if (data?.isInactiveAccount) {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShowPopover(!showPopover)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          title="Steadfast KYC pending"
        >
          <Info className="w-3 h-3 text-amber-600" />
          <span>Courier KYC Pending</span>
        </button>

        {showPopover && (
          <div className="absolute left-0 top-full mt-1.5 z-50 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" /> Steadfast Account Notice
              </span>
              <button
                type="button"
                onClick={() => setShowPopover(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Steadfast responded: <em>"Your account is inactive. Please contact support."</em>
            </p>
            <p className="mt-1 text-slate-500">
              Your API keys are authenticated, but Steadfast requires business KYC verification in their portal before opening nationwide fraud data lookups.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Determine risk level & styles
  const deliveryRatio = data?.deliveryRatio;
  const isNewCustomer = deliveryRatio === null || deliveryRatio === undefined;
  const isHighRisk =
    !isNewCustomer &&
    (deliveryRatio < 70 || (data?.totalReports ?? 0) > 0);
  const isModerateRisk =
    !isNewCustomer &&
    !isHighRisk &&
    deliveryRatio < 85;
  const isSafe = !isNewCustomer && !isHighRisk && !isModerateRisk;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all shadow-sm ${
          isHighRisk
            ? 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200 animate-pulse'
            : isModerateRisk
            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
            : isNewCustomer
            ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            : 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
        }`}
      >
        {isHighRisk ? (
          <>
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>High Risk ({data?.deliveryRatio !== null ? `${data?.deliveryRatio}%` : 'Reports'})</span>
          </>
        ) : isModerateRisk ? (
          <>
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>{data?.deliveryRatio}% Delivery</span>
          </>
        ) : isNewCustomer ? (
          <>
            <Info className="w-3 h-3 text-slate-400" />
            <span>New Customer</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{data?.deliveryRatio}% Delivery ({data?.volumeRange || 'Safe'})</span>
          </>
        )}
      </button>

      {/* Popover Breakdown */}
      {showPopover && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-80 p-3.5 bg-white rounded-2xl shadow-2xl border border-slate-200 text-xs text-slate-700 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">Customer Courier Track</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                Steadfast
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRefresh}
                title="Force refresh"
                className="p-1 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowPopover(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Details */}
          {isNewCustomer ? (
            <div className="py-2.5">
              <p className="font-semibold text-slate-800">No Prior Delivery History</p>
              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                This customer number has no completed deliveries or cancellations on record across Bangladesh couriers.
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 uppercase font-semibold">Delivery Rate</p>
                  <p className="text-base font-extrabold text-emerald-700">
                    {data?.deliveryRatio !== null ? `${data?.deliveryRatio}%` : 'N/A'}
                  </p>
                  {data?.deliveredCount !== null && (
                    <p className="text-[10px] text-emerald-600">{data?.deliveredCount} delivered</p>
                  )}
                </div>

                <div className="bg-rose-50 rounded-xl p-2 border border-rose-100">
                  <p className="text-[10px] text-rose-600 uppercase font-semibold">Cancellation Rate</p>
                  <p className="text-base font-extrabold text-rose-700">
                    {data?.cancellationRatio !== null ? `${data?.cancellationRatio}%` : 'N/A'}
                  </p>
                  {data?.cancelledCount !== null && (
                    <p className="text-[10px] text-rose-600">{data?.cancelledCount} cancelled</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Order Volume:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {data?.volumeRange ? `${data.volumeRange} parcels` : data?.volumeBand || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Merchant Fraud Reports:</span>
                  <span
                    className={`font-semibold ${
                      (data?.totalReports ?? 0) > 0 ? 'text-rose-600' : 'text-slate-700'
                    }`}
                  >
                    {data?.totalReports ?? 0}
                  </span>
                </div>
              </div>

              {/* Fraud Categories if any */}
              {data?.fraudCategories && Object.keys(data.fraudCategories).length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-2">
                  <p className="text-[10px] font-bold text-rose-800 uppercase">Reported Issues</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(data.fraudCategories).map(([cat, count]) => (
                      <span
                        key={cat}
                        className="bg-white text-rose-700 px-2 py-0.5 rounded text-[10px] font-medium border border-rose-200"
                      >
                        {cat}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div
                className={`p-2 rounded-xl text-[11px] leading-tight font-medium ${
                  isHighRisk
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : isModerateRisk
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {isHighRisk ? (
                  <span>
                    ⚠️ <strong>High Cancellation Risk!</strong> Recommended to collect advance delivery charge (৳130) before shipping.
                  </span>
                ) : isModerateRisk ? (
                  <span>
                    ℹ️ <strong>Moderate Return Risk.</strong> Verify recipient phone and delivery address carefully before dispatching.
                  </span>
                ) : (
                  <span>
                    ✅ <strong>Trusted Customer.</strong> Consistently accepts deliveries across Bangladesh. Safe for 100% COD.
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Checked: {data?.checkedAt ? new Date(data.checkedAt).toLocaleDateString() : 'Just now'}</span>
            <span className="font-mono text-slate-500">{phone}</span>
          </div>
        </div>
      )}
    </div>
  );
};
