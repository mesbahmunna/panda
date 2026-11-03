import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isPinAuthenticated, verifyAdminPin } from '../services/settingsStorage';
import logoImg from '../../assets/logo.png';

interface AdminGateProps {
  children: React.ReactNode;
}

export const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isPinAuthenticated());
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [shake, setShake] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 4-digit Security PIN');
      triggerShake();
      return;
    }

    const isValid = verifyAdminPin(pin);
    if (isValid) {
      setError('');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect Security PIN. Please try again.');
      triggerShake();
      setPin('');
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-[#0b0952] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Return Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Live Store
      </button>

      {/* Login Card */}
      <div className={`w-full max-w-md bg-[#110e5e]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl relative z-10 transition-transform ${shake ? 'animate-bounce' : ''}`}>
        
        {/* Brand & Security Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-3 border border-white/10 shadow-inner">
            <img src={logoImg} alt="Baby Panda" className="h-10 w-auto object-contain brightness-110" />
          </div>
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Merchant Operations Portal
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Security Access</h1>
          <p className="text-white/60 text-xs mt-1">Enter your master PIN to access orders, products & finance.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3.5 px-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              <KeyRound className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-medium mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick PIN Keypad for touch/mobile */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (btn === 'C') setPin('');
                  else if (btn === '⌫') handleBackspace();
                  else handleDigitClick(btn);
                }}
                className={`py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                  btn === 'C'
                    ? 'text-rose-300 hover:bg-rose-500/20 bg-white/5'
                    : btn === '⌫'
                    ? 'text-amber-300 hover:bg-amber-500/20 bg-white/5'
                    : 'text-white hover:bg-white/15 bg-white/5 border border-white/5 shadow-sm'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b0952] font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Lock className="w-4 h-4" />
            Unlock Admin Portal
          </button>
        </form>

        {/* Demo PIN Reminder */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-white/40 text-[11px]">
            Default security PIN is <span className="text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">1234</span> (configurable in Settings)
          </p>
        </div>
      </div>
    </div>
  );
};
