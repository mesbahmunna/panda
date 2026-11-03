import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StaffMember } from '../types/staff';
import {
  getStaffMembers,
  deleteStaffMember,
  toggleStaffAvailableToday,
  setActiveStaffSession
} from '../services/staffStorage';
import { StaffModal } from '../components/StaffModal';
import { AdminHeader } from '../components/AdminHeader';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminStaffPage: React.FC = () => {
  const navigate = useNavigate();
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [revealedPins, setRevealedPins] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadStaff = () => {
    setStaffList(getStaffMembers());
  };

  useEffect(() => {
    loadStaff();
    const handleUpdate = () => loadStaff();
    window.addEventListener('baby_staff_updated', handleUpdate);
    return () => window.removeEventListener('baby_staff_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleDuty = (staffId: string, staffName: string) => {
    const newState = toggleStaffAvailableToday(staffId);
    showToast(
      newState
        ? `🟢 ${staffName} is now ON DUTY today and receiving orders.`
        : `⚪ ${staffName} is now OFF DUTY today.`
    );
  };

  const handleLoginAsStaff = (staff: StaffMember) => {
    // Impersonate staff and open call desk
    setActiveStaffSession(staff, true);
    navigate('/staff');
  };

  const handleDelete = (staff: StaffMember) => {
    if (window.confirm(`Are you sure you want to remove staff member "${staff.name}"?`)) {
      deleteStaffMember(staff.id);
      showToast(`Removed staff member ${staff.name}`);
    }
  };

  const togglePinVisibility = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeTodayStaff = staffList.filter((s) => s.isActive && s.isAvailableToday);
  const totalConfirmed = staffList.reduce((acc, s) => acc + (s.stats?.confirmedCount || 0), 0);
  const totalCancelled = staffList.reduce((acc, s) => acc + (s.stats?.cancelledCount || 0), 0);
  const totalAssigned = staffList.reduce((acc, s) => acc + (s.stats?.totalAssigned || 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Staff Call Center & Duty Management"
        subtitle="Manage tele-sales agents, set daily shifts, and monitor live performance"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#0b0952] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-fade-in text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-600" />
              Tele-Sales Team & Duty Roster
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure which agents receive orders today and monitor call performance.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingStaff(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add New Staff
          </button>
        </div>

      {/* Today's Shift & Round-Robin Routing Banner */}
      <div className="bg-gradient-to-r from-[#0b0952] to-indigo-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-gray-900">
                AUTOMATED ORDER ROUTING
              </span>
              <span className="text-xs text-white/70">Fair-Share Equal Distribution</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {activeTodayStaff.length > 0
                ? `${activeTodayStaff.length} Agent${activeTodayStaff.length > 1 ? 's' : ''} On Duty for Today's Shift`
                : 'No Agents On Duty Today!'}
            </h2>
            <p className="text-sm text-white/80 max-w-2xl">
              {activeTodayStaff.length > 0 ? (
                <>
                  Incoming checkout orders will be evenly distributed sequentially across:{' '}
                  <span className="font-semibold text-amber-300">
                    {activeTodayStaff.map((s) => s.name).join(' ⇄ ')}
                  </span>
                  .
                </>
              ) : (
                <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Please toggle at least one agent "Available Today" below so orders can be routed to staff.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-amber-300">{activeTodayStaff.length}</span>
              <span className="text-[11px] font-medium text-white/70 uppercase">On Duty</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-white">{staffList.length}</span>
              <span className="text-[11px] font-medium text-white/70 uppercase">Total Roster</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Agents</p>
            <p className="text-2xl font-black text-gray-900">{staffList.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active On Shift</p>
            <p className="text-2xl font-black text-emerald-600">{activeTodayStaff.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staff Confirmed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-blue-600">{totalConfirmed}</p>
              <span className="text-xs font-medium text-gray-400">
                ({totalAssigned > 0 ? Math.round((totalConfirmed / totalAssigned) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staff Cancelled</p>
            <p className="text-2xl font-black text-rose-600">{totalCancelled}</p>
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Call Center Tele-Sales Agents</h3>
            <p className="text-xs text-gray-500">
              Flip the "Available Today" switch to include/exclude agents from the automated order distribution queue.
            </p>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {staffList.length} Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-6">Agent Name</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Login PIN (4-Digit)</th>
                <th className="py-3.5 px-4 text-center">Available Today</th>
                <th className="py-3.5 px-4 text-center">Assigned / Done</th>
                <th className="py-3.5 px-4 text-center">Success Rate</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {staffList.map((staff) => {
                const assigned = staff.stats?.totalAssigned || 0;
                const confirmed = staff.stats?.confirmedCount || 0;
                const cancelled = staff.stats?.cancelledCount || 0;
                const successRate = assigned > 0 ? Math.round((confirmed / assigned) * 100) : 0;
                const isPinRevealed = revealedPins[staff.id];

                return (
                  <tr key={staff.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Agent Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                          style={{ backgroundColor: staff.avatarColor || '#3B82F6' }}
                        >
                          {staff.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            <span>{staff.name}</span>
                            {!staff.isActive && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                                Inactive
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 font-medium capitalize">
                            Tele-Sales Agent
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-4 px-4 font-mono text-xs text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{staff.phone}</span>
                      </div>
                    </td>

                    {/* PIN */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold tracking-widest text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {isPinRevealed ? staff.pin : '••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePinVisibility(staff.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          title={isPinRevealed ? 'Hide PIN' : 'Reveal PIN'}
                        >
                          {isPinRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                    {/* Available Today Switch */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={staff.isAvailableToday}
                            onChange={() => handleToggleDuty(staff.id, staff.name)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                        <span
                          className={`text-[10px] font-bold ${
                            staff.isAvailableToday ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        >
                          {staff.isAvailableToday ? 'On Duty' : 'Off Duty'}
                        </span>
                      </div>
                    </td>

                    {/* Stats Assigned / Done */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-bold text-gray-900">
                        {assigned} <span className="text-gray-400 font-normal">orders</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        <span className="text-emerald-600 font-semibold">{confirmed} conf</span> /{' '}
                        <span className="text-rose-500 font-semibold">{cancelled} canc</span>
                      </div>
                    </td>

                    {/* Success Rate */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-sm text-gray-800">
                        <span>{successRate}%</span>
                      </div>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(successRate, 100)}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Monitor Profile / Login as Staff */}
                        <button
                          onClick={() => handleLoginAsStaff(staff)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors shadow-sm"
                          title={`Log in as ${staff.name} to view their live call desk`}
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Monitor Desk</span>
                        </button>

                        {/* Edit Staff */}
                        <button
                          onClick={() => {
                            setEditingStaff(staff);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Staff */}
                        <button
                          onClick={() => handleDelete(staff)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {staffList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">No staff members found.</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add New Staff" to register your first agent.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffToEdit={editingStaff}
        onSaved={(saved) => {
          loadStaff();
          showToast(`Staff member "${saved.name}" saved successfully.`);
        }}
      />
      </main>
    </div>
  );
};
