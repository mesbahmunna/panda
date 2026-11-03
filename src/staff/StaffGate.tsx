import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  KeyRound,
  Shield,
  ArrowRight,
  UserCheck,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  getActiveStaffSession,
  getStaffMembers,
  verifyStaffLogin,
  setActiveStaffSession
} from '../admin/services/staffStorage';
import logoImg from '../assets/logo.png';
import { StaffMember } from '../admin/types/staff';

interface StaffGateProps {
  children: React.ReactNode;
}

export const StaffGate: React.FC<StaffGateProps> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(getActiveStaffSession());
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStaffList(getStaffMembers());
    setSession(getActiveStaffSession());

    const handleSessionChange = () => {
      setSession(getActiveStaffSession());
    };
    window.addEventListener('baby_staff_session_changed', handleSessionChange);
    return () => window.removeEventListener('baby_staff_session_changed', handleSessionChange);
  }, []);

  // If already authenticated in session, display the staff portal
  if (session && session.staffId) {
    return <>{children}</>;
  }

  const handleQuickSelect = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setPin('');
    setError(null);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError('Please enter your 4-digit PIN.');
      return;
    }

    if (selectedStaff) {
      if (selectedStaff.pin === pin.trim()) {
        setActiveStaffSession(selectedStaff, false);
        return;
      } else {
        setError('Incorrect PIN for this staff member. Please try again.');
        return;
      }
    }

    // Try finding staff matching this PIN
    const verified = verifyStaffLogin(pin.trim());
    if (verified) {
      setActiveStaffSession(verified, false);
    } else {
      setError('Invalid PIN or account is inactive.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10">
        {/* Header Banner */}
        <div className="bg-[#0b0952] text-white p-7 text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20 shadow-inner">
            <PhoneCall className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Call Center Tele-Sales Login</h2>
          <p className="text-xs text-white/70 mt-1">
            Access your assigned customer verification order queue
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Staff Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              Select Your Name
            </label>
            <div className="grid grid-cols-1 gap-2">
              {staffList
                .filter((s) => s.isActive)
                .map((staff) => {
                  const isSelected = selectedStaff?.id === staff.id;
                  return (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => handleQuickSelect(staff)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-200'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                          style={{ backgroundColor: staff.avatarColor || '#3B82F6' }}
                        >
                          {staff.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 leading-tight">{staff.name}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{staff.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {staff.isAvailableToday ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            On Duty
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Off Duty
                          </span>
                        )}
                        {isSelected && <UserCheck className="w-5 h-5 text-indigo-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* PIN Input */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Enter Your 4-Digit PIN</span>
                {selectedStaff && (
                  <span className="text-xs text-indigo-600 font-semibold lowercase">
                    (PIN: {selectedStaff.pin})
                  </span>
                )}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-center text-2xl font-mono tracking-[0.5em] font-extrabold focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Call Center Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom link to Admin */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              <span>Store Manager? Open Master Admin Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
