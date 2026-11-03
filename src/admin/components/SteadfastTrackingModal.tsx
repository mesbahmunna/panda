import React, { useState, useEffect } from 'react';
import { X, ExternalLink, RefreshCw, CheckCircle2, Clock, AlertTriangle, ArrowRight, Truck } from 'lucide-react';
import { fetchParcelTimeline, SteadfastTrackingEvent, recallParcelRequest } from '../services/steadfastService';

interface SteadfastTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: string;
  trackingCode?: string;
  trackingLink?: string;
  orderStatus?: string;
  onRecallSuccess?: () => void;
}

export const SteadfastTrackingModal: React.FC<SteadfastTrackingModalProps> = ({
  isOpen,
  onClose,
  invoice,
  trackingCode,
  trackingLink,
  orderStatus,
  onRecallSuccess
}) => {
  const [events, setEvents] = useState<SteadfastTrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recalling, setRecalling] = useState(false);
  const [showRecallConfirm, setShowRecallConfirm] = useState(false);
  const [recallReason, setRecallReason] = useState('Customer requested order cancellation');

  const loadTimeline = async () => {
    if (!invoice) return;
    setLoading(true);
    setError(null);
    const res = await fetchParcelTimeline(invoice);
    if (res.success) {
      setEvents(res.events);
    } else {
      setError(res.error || 'No tracking history recorded yet');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && invoice) {
      loadTimeline();
    }
  }, [isOpen, invoice]);

  if (!isOpen) return null;

  const handleRecall = async () => {
    if (!invoice) return;
    setRecalling(true);
    const res = await recallParcelRequest(invoice, recallReason);
    setRecalling(false);
    if (res.success) {
      alert(res.message || 'Parcel recall request submitted to Steadfast!');
      setShowRecallConfirm(false);
      if (onRecallSuccess) onRecallSuccess();
      loadTimeline();
    } else {
      alert('Recall failed: ' + res.error);
    }
  };

  const directLink = trackingLink || (trackingCode ? `https://steadfast.com.bd/t/${trackingCode}` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5844ED] to-[#7B61FF] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Steadfast Live Journey
              </h3>
              <p className="text-xs text-white/80 font-mono">Invoice: {invoice}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tracking Reference Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Tracking Code: </span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {trackingCode || 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadTimeline}
              disabled={loading}
              className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-white transition-colors"
              title="Refresh timeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {directLink && (
              <a
                href={directLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold text-xs"
              >
                Steadfast Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading && (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-500 mb-2" />
              <p className="text-xs font-medium">Fetching journey steps from Steadfast...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-8 text-center text-slate-500">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Parcel In Review / Registered</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {error}. Full hub milestone scans appear once the rider collects the parcel.
              </p>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {events.map((ev, idx) => {
                const isLatest = idx === events.length - 1;
                return (
                  <div key={idx} className="relative group">
                    {/* Bullet */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isLatest
                          ? 'border-brand-600 bg-brand-50 ring-4 ring-brand-100'
                          : 'border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLatest ? 'bg-brand-600' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isLatest ? 'text-brand-900' : 'text-slate-700'
                        }`}
                      >
                        {ev.text}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(ev.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Emergency Recall Box */}
          {orderStatus !== 'delivered' && orderStatus !== 'cancelled' && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              {!showRecallConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowRecallConfirm(true)}
                  className="w-full py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergency Recall (Stop Parcel & Return to Store)
                </button>
              ) : (
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <p className="text-xs font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Confirm Parcel Return Request
                  </p>
                  <p className="text-[11px] text-rose-700">
                    This will instruct Steadfast to stop delivery and return the package to you.
                  </p>
                  <input
                    type="text"
                    value={recallReason}
                    onChange={(e) => setRecallReason(e.target.value)}
                    placeholder="Reason for return..."
                    className="w-full text-xs p-2 rounded-xl border border-rose-300 bg-white"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowRecallConfirm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={recalling}
                      onClick={handleRecall}
                      className="px-3 py-1.5 text-xs bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50"
                    >
                      {recalling ? 'Submitting...' : 'Confirm Recall'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
