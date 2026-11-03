import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Package,
  Layers,
  Edit3,
  Search,
  Filter,
  LogOut,
  Sparkles,
  PhoneCall,
  User,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../admin/types/admin';
import { StaffMember, StaffSession } from '../admin/types/staff';
import {
  getActiveStaffSession,
  getStaffById,
  clearStaffSession,
  toggleStaffAvailableToday,
  isImpersonatingAdmin
} from '../admin/services/staffStorage';
import { getOrders, updateOrderStatus } from '../admin/services/orderStorage';
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { StaffOrderEditModal } from './components/StaffOrderEditModal';
import { soundManager, subscribeToNewOrderEvents, NewOrderNotificationDetail } from '../utils/audioAlert';
import { NewOrderAlertBanner } from '../components/common/NewOrderAlertBanner';
import logoImg from '../assets/logo.png';

export const StaffDashboardPage: React.FC = () => {
  const [session, setSession] = useState<StaffSession | null>(getActiveStaffSession());
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'cancelled' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer cancelled on phone');
  const [isSoundOn, setIsSoundOn] = useState(() => soundManager.isEnabled());
  const [staffNotification, setStaffNotification] = useState<NewOrderNotificationDetail | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = () => {
    const s = getActiveStaffSession();
    setSession(s);
    if (s?.staffId) {
      const staffMember = getStaffById(s.staffId);
      if (staffMember) {
        setCurrentStaff(staffMember);
      }
    }
    setAllOrders(getOrders());
  };

  useEffect(() => {
    loadData();

    const handleOrdersUpdate = () => loadData();
    const handleStaffUpdate = () => loadData();
    const handleSoundPref = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      if (typeof custom.detail === 'boolean') {
        setIsSoundOn(custom.detail);
      }
    };

    window.addEventListener('baby_orders_updated', handleOrdersUpdate);
    window.addEventListener('baby_staff_updated', handleStaffUpdate);
    window.addEventListener('baby_sound_pref_changed', handleSoundPref);

    // Audio chime & notification banner on new assigned lead
    const unsubscribeAudio = subscribeToNewOrderEvents((detail) => {
      loadData();
      const s = getActiveStaffSession();
      const currentId = s?.staffId;
      const isForMe = !currentId || detail.assignedStaffId === currentId || s?.isImpersonatedByAdmin;

      if (isForMe) {
        soundManager.playStaffAssignedAlert();
        setStaffNotification(detail);
      }
    });

    return () => {
      window.removeEventListener('baby_orders_updated', handleOrdersUpdate);
      window.removeEventListener('baby_staff_updated', handleStaffUpdate);
      window.removeEventListener('baby_sound_pref_changed', handleSoundPref);
      unsubscribeAudio();
    };
  }, []);

  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setIsSoundOn(next);
  };

  const handleToggleDuty = () => {
    if (!currentStaff) return;
    const newState = toggleStaffAvailableToday(currentStaff.id);
    showToast(
      newState
        ? '🟢 You are now ON DUTY. Incoming orders will be routed to your desk.'
        : '⚪ You are now OFF DUTY. Shift paused.'
    );
  };

  const handleLogout = () => {
    clearStaffSession();
    window.location.reload();
  };

  const handleConfirmOrder = (order: AdminOrder) => {
    updateOrderStatus(order.id, 'confirmed');
    showToast(`✅ Order ${order.orderId} confirmed successfully!`);
  };

  const handleOpenCancel = (order: AdminOrder) => {
    setCancelModalOrder(order);
    setCancelReason('Customer cancelled on phone');
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    updateOrderStatus(cancelModalOrder.id, 'cancelled');
    showToast(`❌ Order ${cancelModalOrder.orderId} marked as Cancelled.`);
    setCancelModalOrder(null);
  };

  // Filter orders for the current staff member
  // Note: if assignedStaffId matches or assignedStaffName matches, or fallback to all if unassigned and admin monitoring
  const staffOrders = allOrders.filter((order) => {
    if (!currentStaff) return false;
    return (
      order.assignedStaffId === currentStaff.id ||
      order.assignedStaffName === currentStaff.name
    );
  });

  // Tab filtering
  const filteredOrders = staffOrders.filter((order) => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'confirmed') return order.status === 'confirmed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true; // 'all'
  }).filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query) ||
      order.district.toLowerCase().includes(query)
    );
  });

  const pendingCount = staffOrders.filter((o) => o.status === 'pending').length;
  const confirmedCount = staffOrders.filter((o) => o.status === 'confirmed').length;
  const cancelledCount = staffOrders.filter((o) => o.status === 'cancelled').length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-gray-900 pb-16">
      {/* 1. Admin Impersonation Top Banner (Sticky if active) */}
      <ImpersonationBanner staffName={currentStaff?.name} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#0b0952] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-fade-in text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Top Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Call Desk Title */}
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Baby Panda" className="h-9 w-auto object-contain" />
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm text-[#0b0952] tracking-wide block leading-tight">
                BABY PANDA
              </span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Call Center Tele-Sales Desk
              </span>
            </div>
          </div>

          {/* Current Staff & Duty Switch */}
          <div className="flex items-center gap-3">
            {currentStaff && (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                  style={{ backgroundColor: currentStaff.avatarColor || '#10B981' }}
                >
                  {currentStaff.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{currentStaff.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{currentStaff.phone}</p>
                </div>

                {/* Duty Toggle */}
                <button
                  type="button"
                  onClick={handleToggleDuty}
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all border ${
                    currentStaff.isAvailableToday
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Toggle your availability for today's order queue"
                >
                  {currentStaff.isAvailableToday ? '🟢 On Duty' : '⚪ Off Duty'}
                </button>
              </div>
            )}

            {/* Audio Alert Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl transition-all border ${
                isSoundOn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
              }`}
              title={isSoundOn ? 'Order Chime: ACTIVE (Click to mute)' : 'Order Chime: MUTED (Click to activate)'}
            >
              {isSoundOn ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Welcome & KPI metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('pending')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Pending Calls
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-700 mt-2">{pendingCount}</p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Calls to verify</p>
          </div>

          <div
            onClick={() => setActiveTab('confirmed')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'confirmed'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Confirmed
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2">{confirmedCount}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Ready for packaging</p>
          </div>

          <div
            onClick={() => setActiveTab('cancelled')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Cancelled
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-rose-700 mt-2">{cancelledCount}</p>
            <p className="text-[11px] text-rose-600/80 mt-0.5">Customer declined</p>
          </div>

          <div
            onClick={() => setActiveTab('all')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                Total Assigned
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-indigo-800 mt-2">{staffOrders.length}</p>
            <p className="text-[11px] text-indigo-600/80 mt-0.5">All customer orders</p>
          </div>
        </div>

        {/* 4. Controls Bar: Tabs & Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📞 My Pending Calls ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✅ Confirmed ({confirmedCount})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'cancelled'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ❌ Cancelled ({cancelledCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0b0952] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Orders ({staffOrders.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phone, name, order #..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>

        {/* 5. Order Queue Cards */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900">
                {activeTab === 'pending'
                  ? 'No pending calls in your queue!'
                  : 'No orders found matching this view.'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {activeTab === 'pending'
                  ? 'Great job! New customer orders will appear here automatically when placed.'
                  : 'Try selecting a different filter tab or clearing your search.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const cleanPhone = order.phoneNumber.replace(/[\s-]/g, '');
              const waPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
              const waMessage = encodeURIComponent(
                `আসসালামু আলাইকুম ${order.customerName}! Baby Panda শপ থেকে আপনার অর্ডার #${order.orderId} কনফার্ম করার জন্য মেসেজ দিয়েছি।\n` +
                `মোট বিল: ৳${order.total} (ক্যাশ অন ডেলিভারি)।\n` +
                `আপনার ডেলিভারি ঠিকানা: ${order.address}, ${order.district}। অর্ডারটি কি কনফার্ম করব?`
              );

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    order.status === 'pending'
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-indigo-950">
                        {order.orderId}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {order.orderDate}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {order.deliveryZone === 'inside_dhaka' ? 'Dhaka City (৳70)' : 'Outside Dhaka (৳130)'}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {order.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          Pending Phone Call
                        </span>
                      )}
                      {order.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Order Confirmed
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body: Customer details & Items */}
                  <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Customer Info Column (5 cols) */}
                    <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-base text-gray-900 leading-tight">
                            {order.customerName}
                          </h4>
                          <p className="font-mono text-sm font-bold text-indigo-700 mt-0.5">
                            {order.phoneNumber}
                          </p>
                        </div>
                      </div>

                      {/* 1-Click Communication Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02]"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Customer</span>
                        </a>

                        <a
                          href={`https://wa.me/${waPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Delivery Address */}
                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-start gap-1.5 text-gray-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span>
                            {order.address}, {order.upazila ? `${order.upazila}, ` : ''}
                            <strong className="text-gray-900">{order.district}</strong>
                          </span>
                        </div>
                        {order.notes && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded font-medium mt-1">
                            💬 Memo: {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items & Calculations (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.thumbnail}
                                alt={item.product.name}
                                className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  {item.product.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {item.selectedVariation && (
                                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">
                                      {item.selectedVariation}
                                    </span>
                                  )}
                                  {item.selectedBundle ? (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                      {item.selectedBundle.title}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-500 font-medium">
                                      Qty: {item.quantity}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-gray-900">
                                ৳{item.unitPrice * item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pricing Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <div className="text-gray-500 space-x-2">
                          <span>Subtotal: ৳{order.subtotal}</span>
                          <span>•</span>
                          <span>Delivery: ৳{order.deliveryFee}</span>
                        </div>
                        <div className="text-sm font-black text-[#0b0952] flex items-center gap-1">
                          <span>Total COD:</span>
                          <span className="text-base text-emerald-600">৳{order.total}</span>
                        </div>
                      </div>

                      {/* Staff Action Buttons: Edit Order, Confirm, Cancel */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        {/* 1. Edit Order (on call) */}
                        <button
                          type="button"
                          onClick={() => setEditingOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-sm"
                          title="Change quantity, color variation or bundle package if customer requests during call"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Edit Order (on call)</span>
                        </button>

                        {/* 2. Cancel Order */}
                        {order.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(order)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* 3. Confirm Order */}
                        {order.status !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleConfirmOrder(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Live Order Edit Modal */}
      <StaffOrderEditModal
        order={editingOrder}
        isOpen={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        onSaved={(updated) => {
          loadData();
          showToast(`Order #${updated.orderId} updated successfully.`);
        }}
      />

      {/* Cancellation Prompt Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Cancel Order #{cancelModalOrder.orderId}</h3>
                <p className="text-xs text-gray-500">Please select reason for cancellation</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 outline-none"
              >
                <option value="Customer cancelled on phone">Customer cancelled on phone</option>
                <option value="Customer unreachable after 3 calls">Customer unreachable after 3 calls</option>
                <option value="Fake order / wrong number">Fake order / wrong number</option>
                <option value="Delivery charge issue">Delivery charge issue</option>
                <option value="Customer ordered by mistake">Customer ordered by mistake</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff New Order Notification Audio & Visual Alert Banner */}
      <NewOrderAlertBanner
        notification={staffNotification}
        onDismiss={() => setStaffNotification(null)}
        role="staff"
      />
    </div>
  );
};
