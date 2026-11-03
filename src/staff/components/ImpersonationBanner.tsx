import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowLeft, Shield } from 'lucide-react';
import { clearStaffSession, isImpersonatingAdmin } from '../../admin/services/staffStorage';

interface ImpersonationBannerProps {
  staffName?: string;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({ staffName }) => {
  const navigate = useNavigate();
  const impersonating = isImpersonatingAdmin();

  if (!impersonating) return null;

  const handleReturnToAdmin = () => {
    clearStaffSession();
    navigate('/admin/staff');
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-900 text-white shadow-lg border-b border-amber-300/30 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-wide">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
          </span>
          <Eye className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>
            Admin Impersonation Mode: Monitoring{' '}
            <span className="underline decoration-yellow-300 font-extrabold">
              {staffName || 'Staff Member'}
            </span>
            's Live Call Desk
          </span>
        </div>

        <button
          onClick={handleReturnToAdmin}
          className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-700" />
          <span>Return to Master Admin</span>
        </button>
      </div>
    </div>
  );
};
