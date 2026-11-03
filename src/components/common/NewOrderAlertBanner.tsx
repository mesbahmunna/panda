import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Volume2,
  X,
  ExternalLink,
  PhoneCall,
  User,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { NewOrderNotificationDetail } from '../../utils/audioAlert';

interface NewOrderAlertBannerProps {
  notification: NewOrderNotificationDetail | null;
  onDismiss: () => void;
  role: 'admin' | 'staff';
}

export const NewOrderAlertBanner: React.FC<NewOrderAlertBannerProps> = ({
  notification,
  onDismiss,
  role
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 10000); // Auto-dismiss after 10s
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification || !visible) return null;

  const handleAction = () => {
    setVisible(false);
    onDismiss();
    if (role === 'admin') {
      navigate('/admin/orders');
    }
  };

  return (
    <div className="fixed top-4 right-4 sm:right-6 z-[9999] max-w-md w-full animate-bounce-subtle">
      <div className="bg-[#0b0952] text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400/90 overflow-hidden relative">
        {/* Glowing background aura */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3 relative z-10">
          {/* Animated Bell Badge */}
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/30">
            <Bell className="w-6 h-6 animate-wiggle" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-amber-400 text-gray-950">
                {role === 'staff' ? 'NEW ASSIGNED CALL' : 'NEW ORDER RECEIVED'}
              </span>
              <span className="text-xs font-mono font-bold text-white/90">
                {notification.orderId}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white mt-1 leading-snug flex items-center gap-1.5 truncate">
              <span>{notification.customerName || 'New Customer'}</span>
              {notification.total && (
                <span className="text-amber-300 font-black">— ৳{notification.total} COD</span>
              )}
            </h4>

            <p className="text-xs text-white/75 mt-0.5 flex items-center gap-2 truncate">
              {notification.phoneNumber && (
                <span className="font-mono text-amber-200">{notification.phoneNumber}</span>
              )}
              {notification.district && (
                <>
                  <span className="text-white/40">•</span>
                  <span>{notification.district}</span>
                </>
              )}
            </p>

            {notification.assignedStaffName && (
              <p className="text-[11px] text-indigo-200 mt-1 font-semibold flex items-center gap-1">
                <span>Routing:</span>
                <span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">
                  {notification.assignedStaffName}
                </span>
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
              {role === 'admin' ? (
                <button
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs transition-colors shadow-sm"
                >
                  <span>View in Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                notification.phoneNumber && (
                  <a
                    href={`tel:${notification.phoneNumber.replace(/[\s-]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-colors shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Customer Now</span>
                  </a>
                )
              )}

              <span className="text-[10px] text-white/50 flex items-center gap-1 ml-auto">
                <Volume2 className="w-3 h-3 text-amber-300" />
                <span>Sound Alert Played</span>
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
