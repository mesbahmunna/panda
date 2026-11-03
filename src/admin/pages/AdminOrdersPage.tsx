import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  Eye,
  Printer,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Truck
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getOrders, updateOrderStatus, deleteOrder, exportOrdersToCSV } from '../services/orderStorage';
import { AdminOrder, OrderStatus } from '../types/admin';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { PackagingSlipModal } from '../components/PackagingSlipModal';
import { CustomerFraudBadge } from '../components/CustomerFraudBadge';
import { SteadfastTrackingModal } from '../components/SteadfastTrackingModal';
import { fetchParcelStatus } from '../services/steadfastService';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminOrdersPage: React.FC = () => {
  const { onOpenMobileMenu } = useOutletContext<OutletContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') as OrderStatus | 'all' | null;

  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());
  const [activeTab, setActiveTab] = useState<string>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<'all' | 'inside_dhaka' | 'outside_dhaka'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [slipOrder, setSlipOrder] = useState<AdminOrder | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<AdminOrder | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const handleSyncAllCouriers = async () => {
    const inTransit = orders.filter(o => o.status === 'in_courier' && (o.courierTrackingId || o.steadfast?.trackingCode));
    if (inTransit.length === 0) {
      alert('No active parcels in transit with Steadfast tracking codes.');
      return;
    }

    setIsSyncingAll(true);
    let updatedCount = 0;

    for (const ord of inTransit) {
      const code = ord.courierTrackingId || ord.steadfast?.trackingCode;
      if (!code) continue;
      const res = await fetchParcelStatus(code);
      if (res.success && res.deliveryStatus) {
        const st = res.deliveryStatus.toLowerCase();
        if (st.includes('delivered') && !st.includes('return')) {
          updateOrderStatus(ord.id, 'delivered');
          updatedCount++;
        } else if (st.includes('cancelled') || st.includes('return')) {
          updateOrderStatus(ord.id, 'cancelled');
          updatedCount++;
        }
      }
    }

    setIsSyncingAll(false);
    refreshOrders();
    alert(`Steadfast status sync complete. Checked ${inTransit.length} in-transit parcels. ${updatedCount} orders updated.`);
  };

  const refreshOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    refreshOrders();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'baby_admin_orders') {
        refreshOrders();
      }
    };
    window.addEventListener('baby_orders_updated', refreshOrders);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('baby_orders_updated', refreshOrders);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync tab with URL query parameter if present
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      setActiveTab(statusFromUrl);
    }
  }, [searchParams]);

  // Status counters
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    packaging: orders.filter((o) => o.status === 'packaging').length,
    in_courier: orders.filter((o) => o.status === 'in_courier').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    // 1. Status Tab
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }

    // 2. Delivery Zone
    if (zoneFilter !== 'all' && order.deliveryZone !== zoneFilter) {
      return false;
    }

    // 3. Date Filter
    if (dateFilter !== 'all') {
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      if (dateFilter === 'today') {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        if (createdTime < todayMidnight.getTime()) return false;
      } else if (dateFilter === '7days') {
        if (now - createdTime > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (dateFilter === '30days') {
        if (now - createdTime > 30 * 24 * 60 * 60 * 1000) return false;
      }
    }

    // 4. Search Query (Order ID, Customer Name, Phone, Address, Thana, District)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        order.orderId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phoneNumber.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q) ||
        order.district.toLowerCase().includes(q) ||
        order.upazila.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Orders Processing Engine"
        subtitle={`Managing ${orders.length} total Cash on Delivery customer orders`}
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={counts.pending}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Phone (017...), Name, District or Street..."
                className="w-full text-xs py-2.5 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value as any)}
                className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Delivery Zones</option>
                <option value="inside_dhaka">Inside Dhaka (৳70)</option>
                <option value="outside_dhaka">Outside Dhaka (৳130)</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Time</option>
                <option value="today">Today Only</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>

              <button
                type="button"
                disabled={isSyncingAll}
                onClick={handleSyncAllCouriers}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors shrink-0 border border-indigo-200"
                title="Query Steadfast for delivery updates on all in-transit parcels"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncingAll ? 'Syncing...' : 'Sync Courier Status'}</span>
              </button>

              <button
                onClick={() => exportOrdersToCSV(filteredOrders)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors shrink-0"
                title="Export filtered orders to Excel/CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Status Tabs Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
            {[
              { id: 'all', label: 'All Orders', count: counts.all, color: 'bg-slate-200 text-slate-800' },
              { id: 'pending', label: 'Pending', count: counts.pending, color: 'bg-amber-100 text-amber-800' },
              { id: 'confirmed', label: 'Confirmed', count: counts.confirmed, color: 'bg-blue-100 text-blue-800' },
              { id: 'packaging', label: 'Packaging', count: counts.packaging, color: 'bg-purple-100 text-purple-800' },
              { id: 'in_courier', label: 'In Courier', count: counts.in_courier, color: 'bg-indigo-100 text-indigo-800' },
              { id: 'delivered', label: 'Delivered', count: counts.delivered, color: 'bg-emerald-100 text-emerald-800' },
              { id: 'cancelled', label: 'Cancelled', count: counts.cancelled, color: 'bg-rose-100 text-rose-800' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams(tab.id === 'all' ? {} : { status: tab.id });
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#0b0952] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : tab.color
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No orders match your filter criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting a different status filter above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setZoneFilter('all');
                  setDateFilter('all');
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Delivery Location</th>
                    <th className="py-3.5 px-4">Items & Variations</th>
                    <th className="py-3.5 px-4">Total COD</th>
                    <th className="py-3.5 px-4">Status & Courier</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const cleanPhone = order.phoneNumber.replace(/[\s-]/g, '');
                    const waPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
                    const waMessage = encodeURIComponent(
                      `আসসালামু আলাইকুম ${order.customerName}! Baby Panda থেকে আপনার অর্ডার ${order.orderId} (৳${order.total}) কনফার্ম করতে কল দেওয়া হয়েছে।`
                    );

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* 1. Order ID & Date */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="font-mono font-bold text-[#0b0952] hover:underline block text-left"
                          >
                            {order.orderId}
                          </button>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{order.orderDate}</span>
                          {order.assignedStaffName && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded mt-1">
                              👤 {order.assignedStaffName}
                            </span>
                          )}
                        </td>

                        {/* 2. Customer Name & Fast Phone */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-slate-600 font-mono text-[11px]">{order.phoneNumber}</span>
                            <a
                              href={`tel:${cleanPhone}`}
                              title="Call"
                              className="text-blue-600 hover:text-blue-800 p-0.5"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://wa.me/${waPhone}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp"
                              className="text-emerald-600 hover:text-emerald-800 p-0.5"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="mt-1">
                            <CustomerFraudBadge phone={order.phoneNumber} initialData={order.fraudScore} compact />
                          </div>
                        </td>

                        {/* 3. Delivery Location */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {order.district}
                            <span className="text-slate-400 font-normal"> ({order.upazila})</span>
                          </div>
                          <div className="text-slate-500 text-[11px] truncate max-w-[180px]" title={order.address}>
                            {order.address}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {order.deliveryZone === 'inside_dhaka' ? 'Inside (৳70)' : 'Outside (৳130)'}
                          </span>
                        </td>

                        {/* 4. Ordered Items */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 max-w-[220px] truncate" title={order.items.map((i) => i.product.name).join(', ')}>
                            {order.items.map((i) => i.product.name).join(', ')}
                          </div>
                          <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px]">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                              Qty: {order.items.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                            {order.items[0]?.selectedVariation && (
                              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                                {order.items[0].selectedVariation.split(' ')[0]}
                              </span>
                            )}
                            {order.items[0]?.selectedBundle && (
                              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-bold border border-amber-200">
                                {order.items[0].selectedBundle.title}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Total COD */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 text-sm">৳{order.total}</div>
                          <span className="text-[10px] text-emerald-600 font-semibold block">COD</span>
                        </td>

                        {/* 6. Status & Courier Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value as OrderStatus);
                              refreshOrders();
                            }}
                            className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border focus:outline-none ${
                              order.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : order.status === 'confirmed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'packaging'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : order.status === 'in_courier'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="packaging">Packaging</option>
                            <option value="in_courier">In Courier</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {(order.courierTrackingId || order.steadfast?.trackingCode) ? (
                            <button
                              type="button"
                              onClick={() => setTrackingModalOrder(order)}
                              className="text-[10px] text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-1.5 py-0.5 rounded font-mono font-bold block mt-1 transition-colors text-left"
                              title="View Steadfast live journey"
                            >
                              STDF • {order.courierTrackingId || order.steadfast?.trackingCode}
                            </button>
                          ) : order.courierName ? (
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {order.courierName}
                            </span>
                          ) : null}
                        </td>

                        {/* 7. Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSlipOrder(order)}
                              title="Print Packaging Slip"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="View & Edit Details"
                              className="p-1.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, status, courierInfo) => {
            updateOrderStatus(orderId, status, courierInfo);
            refreshOrders();
          }}
          onPrintSlip={(order) => {
            setSlipOrder(order);
          }}
          onDeleteOrder={(orderId) => {
            deleteOrder(orderId);
            refreshOrders();
          }}
        />
      )}

      {/* Printable Packaging Slip Modal */}
      {slipOrder && (
        <PackagingSlipModal
          order={slipOrder}
          onClose={() => setSlipOrder(null)}
        />
      )}

      {/* Steadfast Courier Tracking Journey Modal */}
      {trackingModalOrder && (
        <SteadfastTrackingModal
          isOpen={!!trackingModalOrder}
          onClose={() => setTrackingModalOrder(null)}
          invoice={trackingModalOrder.orderId}
          trackingCode={trackingModalOrder.courierTrackingId || trackingModalOrder.steadfast?.trackingCode}
          trackingLink={trackingModalOrder.steadfast?.trackingLink}
          orderStatus={trackingModalOrder.status}
        />
      )}
    </div>
  );
};
