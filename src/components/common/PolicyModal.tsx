import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  policy: { title: string; content: string } | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policy, onClose }) => {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="min-h-screen px-4 text-center flex items-center justify-center py-8">
        <div className="inline-block w-full max-w-lg bg-white rounded-3xl text-left overflow-hidden shadow-2xl relative z-10 p-6 sm:p-8 animate-scaleUp">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2 text-brand-600">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{policy.title}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {policy.content}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-colors"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
