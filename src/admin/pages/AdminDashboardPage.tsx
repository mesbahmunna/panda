import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  Package,
  Layers,
  Phone,
  MessageSquare,
  Eye,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/orderStorage';
import { AdminOrder, OrderStatus } from '../types/admin';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { PackagingSlipModal } from '../components/PackagingSlipModal';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminDashboardPage: React.FC = () => {
  const { onOpenMobileMenu } = useOutletContext<OutletContextType>();
  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [slipOrder, setSlipOrder] = useState<AdminOrder | null>(null);

  const refreshData = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    refreshData();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'baby_admin_orders') {
        refreshData();
      }
    };
    window.addEventListener('baby_orders_updated', refreshData);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('baby_orders_updated', refreshData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Compute metrics
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inCourierOrders = orders.filter((o) => o.status === 'in_courier');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'packaging');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  // Revenue computations
  const totalRevenueAll = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const deliveredRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);

  // Today's orders
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= todayStart.getTime());
  const todayRevenue = todayOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  // Zone distribution
  const insideDhakaCount = orders.filter((o) => o.deliveryZone === 'inside_dhaka').length;
  const outsideDhakaCount = orders.filter((o) => o.deliveryZone === 'outside_dhaka').length;
  const insideDhakaPct = totalOrdersCount > 0 ? Math.round((insideDhakaCount / totalOrdersCount) * 100) : 50;

  // Bundle breakdown
  let pcs1Count = 0;
  let pcs2Count = 0;
  let pcs3Count = 0;
  let pcs4Count = 0;

  orders.forEach((o) => {
    o.items.forEach((item) => {
      const p = item.selectedBundle?.pieces || 1;
      if (p === 1) pcs1Count += item.quantity;
      else if (p === 2) pcs2Count += item.quantity;
      else if (p === 3) pcs3Count += item.quantity;
      else if (p >= 4) pcs4Count += item.quantity;
    });
  });

  const totalBundles = pcs1Count + pcs2Count + pcs3Count + pcs4Count || 1;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Store Overview"
        subtitle="Real-time Cash on Delivery performance & fulfillment pipeline"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingOrders.length}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Today's Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Revenue</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b0952]">
              ৳{todayRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>{todayOrders.length} orders today</span>
              <span className="text-emerald-600 font-semibold">100% COD</span>
            </div>
          </div>

          {/* Card 2: Pending Confirmations (Urgent) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Calls</span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {pendingOrders.length}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Awaiting phone check</span>
              {pendingOrders.length > 0 ? (
                <Link to="/admin/orders?status=pending" className="text-blue-600 font-bold hover:underline">
                  Call Now &rarr;
                </Link>
              ) : (
                <span className="text-emerald-600 font-semibold">Queue clear</span>
              )}
            </div>
          </div>

          {/* Card 3: Dispatched / In Transit */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Courier / Transit</span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {inCourierOrders.length}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Expected: ৳{inCourierOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</span>
              <span className="text-slate-400">Steadfast Courier</span>
            </div>
          </div>

          {/* Card 4: Delivered (Cash Collected) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cash Collected</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ৳{deliveredRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>{deliveredOrders.length} parcels delivered</span>
              <span className="text-slate-500">Closed</span>
            </div>
          </div>

        </div>

        {/* Analytics Grid: Zone Breakdown & Bundle Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Delivery Zone Distribution */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Courier Delivery Zones</h3>
                <p className="text-xs text-slate-500">Geographic distribution of customer delivery addresses</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#0b0952] transition-all duration-500"
                  style={{ width: `${insideDhakaPct}%` }}
                  title={`Inside Dhaka: ${insideDhakaPct}%`}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{ width: `${100 - insideDhakaPct}%` }}
                  title={`Outside Dhaka: ${100 - insideDhakaPct}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0b0952]" />
                  <span className="font-medium text-slate-700">Inside Dhaka (৳70)</span>
                  <span className="font-bold text-slate-900">{insideDhakaCount} ({insideDhakaPct}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="font-medium text-slate-700">Outside Dhaka (৳130)</span>
                  <span className="font-bold text-slate-900">{outsideDhakaCount} ({100 - insideDhakaPct}%)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Total Courier Fee Incurred:</span>
              <span className="font-bold text-slate-800">
                ৳{(insideDhakaCount * 70 + outsideDhakaCount * 130).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Panel 2: Bundle Tiers Popularity */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Bundle Tiers Performance</h3>
                <p className="text-xs text-slate-500">Volume sold across 1 Pcs, 2 Pcs, 3 Pcs, and 4 Pcs packs</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 block">1 Pcs Pack</span>
                <span className="text-lg font-bold text-slate-900">{pcs1Count}</span>
                <span className="text-[10px] text-slate-400 block">{Math.round((pcs1Count / totalBundles) * 100)}% share</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-[11px] font-semibold text-amber-800 block">2 Pcs Pack</span>
                <span className="text-lg font-bold text-amber-900">{pcs2Count}</span>
                <span className="text-[10px] text-amber-700 block">{Math.round((pcs2Count / totalBundles) * 100)}% share</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <span className="text-[11px] font-semibold text-blue-800 block">3 Pcs Pack</span>
                <span className="text-lg font-bold text-blue-900">{pcs3Count}</span>
                <span className="text-[10px] text-blue-700 block">{Math.round((pcs3Count / totalBundles) * 100)}% share</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] font-semibold text-emerald-800 block">4 Pcs Pack</span>
                <span className="text-lg font-bold text-emerald-900">{pcs4Count}</span>
                <span className="text-[10px] text-emerald-700 block">{Math.round((pcs4Count / totalBundles) * 100)}% share</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Multi-Pack Conversion Ratio:</span>
              <span className="font-bold text-emerald-600">
                {Math.round(((pcs2Count + pcs3Count + pcs4Count) / totalBundles) * 100)}% of orders chose 2+ items
              </span>
            </div>
          </div>

        </div>

        {/* Recent Orders Queue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Orders Queue</h3>
              <p className="text-xs text-slate-500">Latest customer orders awaiting processing</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b0952] hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">COD Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => {
                  const cleanPhone = order.phoneNumber.replace(/[\s-]/g, '');
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0b0952]">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="hover:underline text-left"
                        >
                          {order.orderId}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-slate-500 text-[11px]">{order.phoneNumber}</div>
                        {order.assignedStaffName && (
                          <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">
                            Agent: {order.assignedStaffName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{order.district}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[150px]">{order.address}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {order.items.map((i) => i.product.name).join(', ')}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) • {order.items[0]?.selectedBundle?.title || '1 Pcs'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        ৳{order.total}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : order.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'packaging'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : order.status === 'in_courier'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            title="Call customer"
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View details"
                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
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
        </div>

      </main>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, status, courierInfo) => {
            updateOrderStatus(orderId, status, courierInfo);
            refreshData();
          }}
          onPrintSlip={(order) => {
            setSlipOrder(order);
          }}
          onDeleteOrder={(orderId) => {
            deleteOrder(orderId);
            refreshData();
          }}
        />
      )}

      {slipOrder && (
        <PackagingSlipModal
          order={slipOrder}
          onClose={() => setSlipOrder(null)}
        />
      )}
    </div>
  );
};
