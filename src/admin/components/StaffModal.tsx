import React, { useState, useEffect } from 'react';
import { X, User, Phone, KeyRound, Check, ShieldCheck } from 'lucide-react';
import { StaffMember } from '../types/staff';
import { saveStaffMember } from '../services/staffStorage';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
  onSaved: (staff: StaffMember) => void;
}

const AVATAR_COLORS = [
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1'  // Indigo
];

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit,
  onSaved
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [isActive, setIsActive] = useState(true);
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setPhone(staffToEdit.phone);
      setPin(staffToEdit.pin);
      setAvatarColor(staffToEdit.avatarColor || AVATAR_COLORS[0]);
      setIsActive(staffToEdit.isActive);
      setIsAvailableToday(staffToEdit.isAvailableToday);
    } else {
      setName('');
      setPhone('');
      setPin('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setIsActive(true);
      setIsAvailableToday(true);
    }
    setError(null);
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Staff member name is required.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    const cleanPin = pin.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      setError('Staff login PIN must be exactly 4 digits (e.g. 1234).');
      return;
    }

    const newStaff: StaffMember = {
      id: staffToEdit ? staffToEdit.id : `staff-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: cleanPhone,
      pin: cleanPin,
      role: 'tele_sales',
      isActive,
      isAvailableToday,
      avatarColor,
      createdAt: staffToEdit ? staffToEdit.createdAt : new Date().toISOString(),
      stats: staffToEdit ? staffToEdit.stats : {
        confirmedCount: 0,
        cancelledCount: 0,
        totalAssigned: 0
      }
    };

    saveStaffMember(newStaff);
    onSaved(newStaff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b0952] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-base"
              style={{ backgroundColor: avatarColor }}
            >
              {name ? name.slice(0, 1).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {staffToEdit ? 'Edit Tele-Sales Staff' : 'Add New Tele-Sales Staff'}
              </h3>
              <p className="text-xs text-white/70">
                Call center agent for phone verification & order confirmations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Staff Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanzim Ahmed"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number (Contact & ID) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01712000001"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          {/* 4-digit PIN */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Staff Login PIN (4 Digits) *</span>
              <span className="text-[11px] text-gray-400 font-normal">Used to log in at /staff</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 1111"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-base font-mono tracking-widest font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Give this 4-digit PIN to the agent so they can access their assigned orders queue.
            </p>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Badge & Avatar Color
            </label>
            <div className="flex items-center gap-2.5">
              {AVATAR_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    avatarColor === color ? 'ring-4 ring-indigo-200 scale-110 shadow' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {avatarColor === color && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
            {/* Available Today Switch */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Available on Shift Today</p>
                <p className="text-xs text-gray-500">
                  When enabled, incoming orders will be automatically assigned to this staff member.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailableToday}
                  onChange={(e) => setIsAvailableToday(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Is Active Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-800">Active Account</p>
                <p className="text-xs text-gray-500">Allow agent to sign in to call center portal</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {staffToEdit ? 'Save Changes' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
