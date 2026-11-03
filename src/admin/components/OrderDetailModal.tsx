import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Printer,
  Truck,
  CheckCircle2,
  Package,
  AlertCircle,
  FileText,
  User,
  Trash2,
  ExternalLink,
  RefreshCw,
  Send,
  ShieldAlert
} from 'lucide-react';
import { AdminOrder, OrderStatus, SteadfastConsignment } from '../types/admin';
import { CustomerFraudBadge } from './CustomerFraudBadge';
import { SteadfastTrackingModal } from './SteadfastTrackingModal';
import { bookParcelWithSteadfast, fetchParcelStatus } from '../services/steadfastService';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    status: OrderStatus,
    courierInfo?: { courierName?: string; trackingId?: string; steadfast?: SteadfastConsignment }
  ) => void;
  onPrintSlip: (order: AdminOrder) => void;
  onDeleteOrder: (orderId: string) => void;
}

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; desc: string }> = {
  pending: {
    label: 'Pending Verification',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Customer placed order; call to confirm delivery address.'
  },
  confirmed: {
    label: 'Order Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'Verified over phone / WhatsApp. Ready for packaging.'
  },
  packaging: {
    label: 'Packaging',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: 'Parcel is packed and ready for courier handover.'
  },
  in_courier: {
    label: 'In Courier / Transit',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    desc: 'Handed over to courier rider for final delivery.'
  },
  delivered: {
    label: 'Delivered (COD Collected)',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Customer received parcel and cash collected.'
  },
  cancelled: {
    label: 'Cancelled / Returned',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    desc: 'Order cancelled by customer or returned by courier.'
  }
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onPrintSlip,
  onDeleteOrder
}) => {
  if (!order) return null;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [courierName, setCourierName] = useState<string>(order.courierName || 'Steadfast');
  const [trackingId, setTrackingId] = useState<string>(order.courierTrackingId || order.steadfast?.trackingCode || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isBookingSteadfast, setIsBookingSteadfast] = useState(false);
  const [steadfastError, setSteadfastError] = useState<string | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isSyncingStatus, setIsSyncingStatus] = useState(false);

  const cleanPhone = order.phoneNumber.replace(/[\s-]/g, '');
  // WhatsApp international format: 01712... -> 8801712...
  const waPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
  
  const waMessage = encodeURIComponent(
    `আসসালামু আলাইকুম ${order.customerName}!\n` +
    `Baby Panda থেকে আপনার অর্ডারটি (${order.orderId}) গ্রহণ করা হয়েছে।\n\n` +
    `অর্ডারের বিবরণ:\n` +
    order.items.map((i) => `• ${i.product.name} [${i.selectedVariation || 'Default'} - ${i.selectedBundle?.title || '1 Pcs'}] x ${i.quantity}`).join('\n') +
    `\n\nডেলিভারি ঠিকানা: ${order.address}, ${order.upazila}, ${order.district}\n` +
    `মোট ক্যাশ অন ডেলিভারি: ৳${order.total}\n\n` +
    `অর্ডারটি কনফার্ম করতে দয়া করে 'Yes' লিখে রিপ্লাই দিন। ধন্যবাদ!`
  );

  const handleSaveStatus = () => {
    setIsSaving(true);
    onUpdateStatus(order.id, selectedStatus, {
      courierName: selectedStatus === 'in_courier' || selectedStatus === 'delivered' ? courierName : order.courierName,
      trackingId: trackingId.trim() || undefined
    });
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 200);
  };

  const handleBookWithSteadfast = async () => {
    setIsBookingSteadfast(true);
    setSteadfastError(null);

    const res = await bookParcelWithSteadfast(order);
    setIsBookingSteadfast(false);

    if (res.success && res.consignment) {
      setTrackingId(res.consignment.trackingCode);
      setCourierName('Steadfast');
      setSelectedStatus('in_courier');

      onUpdateStatus(order.id, 'in_courier', {
        courierName: 'Steadfast',
        trackingId: res.consignment.trackingCode,
        steadfast: res.consignment
      });
    } else {
      setSteadfastError(res.error || 'Steadfast booking failed. Check connection or keys.');
    }
  };

  const handleSyncCourierStatus = async () => {
    const code = trackingId || order.steadfast?.trackingCode;
    if (!code) return;

    setIsSyncingStatus(true);
    const res = await fetchParcelStatus(code);
    setIsSyncingStatus(false);

    if (res.success && res.deliveryStatus) {
      const st = res.deliveryStatus.toLowerCase();
      let newMappedStatus: OrderStatus = order.status;

      if (st.includes('delivered') && !st.includes('return')) {
        newMappedStatus = 'delivered';
      } else if (st.includes('cancelled') || st.includes('return')) {
        newMappedStatus = 'cancelled';
      } else {
        newMappedStatus = 'in_courier';
      }

      setSelectedStatus(newMappedStatus);
      onUpdateStatus(order.id, newMappedStatus, {
        courierName: 'Steadfast',
        trackingId: code
      });
      alert(`Courier Status: "${res.deliveryStatus}". Order updated to: ${STATUS_LABELS[newMappedStatus].label}`);
    } else {
      alert(res.error || 'Could not fetch status update from Steadfast.');
    }
  };

  const hasSteadfastBooking = !!order.steadfast || (order.courierName === 'Steadfast' && !!order.courierTrackingId);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
        <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-[#0b0952] text-white p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                <Package className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-wide">{order.orderId}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_LABELS[order.status].color}`}>
                    {STATUS_LABELS[order.status].label}
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Placed: {order.orderDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPrintSlip(order)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/15"
                title="Print Courier Packaging Slip"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Packing Slip</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Customer Fast-Action Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0b0952] font-bold text-base flex-wrap">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{order.customerName}</span>
                  {order.assignedStaffName && (
                    <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      Agent: {order.assignedStaffName}
                    </span>
                  )}
                  {/* Courier Fraud & Delivery Track Record Badge */}
                  <CustomerFraudBadge phone={order.phoneNumber} initialData={order.fraudScore} />
                </div>
                <div className="text-slate-600 text-xs font-medium flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-800">Phone: {order.phoneNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span className="capitalize">{order.district} ({order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                </div>
              </div>

              {/* Direct Phone & WhatsApp Call Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Customer
                </a>
                <a
                  href={`https://wa.me/${waPhone}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp Confirm
                </a>
              </div>
            </div>

            {/* Delivery Address & Customer Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Delivery Address
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">{order.address}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Thana/Upazila: <span className="font-semibold text-slate-800">{order.upazila}</span>, District: <span className="font-semibold text-slate-800">{order.district}</span>
                </p>
                <div className="mt-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700">
                    {order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳130)'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  Order Notes / Special Instructions
                </div>
                <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200 min-h-[58px]">
                  {order.notes || 'No special delivery instructions provided by customer.'}
                </p>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-indigo-500" />
                Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </div>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div key={index} className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-600">
                          {item.selectedVariation && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              Var: {item.selectedVariation}
                            </span>
                          )}
                          {item.selectedBundle && (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              Tier: {item.selectedBundle.title}
                            </span>
                          )}
                          <span>Qty: <strong className="text-slate-900">{item.quantity}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">৳{item.unitPrice} each</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        ৳{item.unitPrice * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Delivery Fee:</span>
                <span className="font-semibold text-slate-800">+ ৳{order.deliveryFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>- ৳{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900 uppercase">Total Cash on Delivery:</span>
                <span className="font-black text-lg text-emerald-600">৳{order.total}</span>
              </div>
            </div>

            {/* Steadfast Courier Integration Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-2xl border border-indigo-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  Steadfast Courier Logistics & Dispatch
                </div>
                {hasSteadfastBooking && (
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Booked on Steadfast
                  </span>
                )}
              </div>

              {/* Booking Actions */}
              {!hasSteadfastBooking ? (
                <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Ready to Ship with Steadfast?</p>
                      <p className="text-[11px] text-slate-500">
                        1-Click push to Steadfast. Auto-generates consignment ID & tracking number.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isBookingSteadfast || order.status === 'cancelled'}
                      onClick={handleBookWithSteadfast}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isBookingSteadfast ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Booking Parcel...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Book with Steadfast (1-Click)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {steadfastError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{steadfastError}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Already Booked Box */
                <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Consignment ID:</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        #{order.steadfast?.consignmentId || 'Registered'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Tracking Code:</span>
                      <span className="font-mono font-black text-brand-600 text-sm bg-brand-50 px-2 py-0.5 rounded border border-brand-200 inline-block">
                        {trackingId || order.steadfast?.trackingCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowTrackingModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Live Journey Steps</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSyncingStatus}
                      onClick={handleSyncCourierStatus}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingStatus ? 'animate-spin' : ''}`} />
                      <span>Sync Status</span>
                    </button>

                    <a
                      href={order.steadfast?.trackingLink || `https://steadfast.com.bd/t/${trackingId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-brand-600 hover:text-brand-700 text-xs font-bold transition-colors ml-auto"
                    >
                      <span>Steadfast Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Status Selector & Manual Courier Overrides */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Store Order Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['pending', 'confirmed', 'packaging', 'in_courier', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        selectedStatus === st
                          ? `${STATUS_LABELS[st].color} ring-2 ring-blue-500 shadow-sm`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{STATUS_LABELS[st].label}</span>
                      {selectedStatus === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Partner & Tracking Input Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Courier Partner:
                  </label>
                  <div className="w-full text-xs font-bold py-2 px-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 flex items-center justify-between">
                    <span>Steadfast Courier</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                      Exclusive Partner
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Courier Tracking / Consignment Code:
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g. STDF-8839201"
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete order ${order.orderId}? This cannot be undone.`)) {
                  onDeleteOrder(order.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Order
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Steadfast Tracking Modal */}
      {showTrackingModal && (
        <SteadfastTrackingModal
          isOpen={showTrackingModal}
          onClose={() => setShowTrackingModal(false)}
          invoice={order.orderId}
          trackingCode={trackingId || order.steadfast?.trackingCode}
          trackingLink={order.steadfast?.trackingLink}
          orderStatus={order.status}
        />
      )}
    </>
  );
};
