import React from 'react';
import { X, Printer, Package, Check, Phone, MapPin } from 'lucide-react';
import { AdminOrder } from '../types/admin';
import logoImg from '../../assets/logo.png';
import { getAdminSettings } from '../services/settingsStorage';

interface PackagingSlipModalProps {
  order: AdminOrder | null;
  onClose: () => void;
}

export const PackagingSlipModal: React.FC<PackagingSlipModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const settings = getAdminSettings();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Outer Card */}
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Control Bar (Hidden during printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Courier Packaging Slip & Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#0b0952] rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Packaging Slip Area */}
        <div className="p-6 sm:p-8 bg-white print:p-4 text-slate-900" id="courier-packing-slip">
          
          {/* Slip Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-[#0b0952]">BABY PANDA</span>
                <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">COD PARCEL</span>
              </div>
              <p className="text-[11px] text-slate-500">{settings.showroomAddress}</p>
              <p className="text-[11px] text-slate-500 font-semibold">Hotline: {settings.hotlinePhone} | WhatsApp: {settings.whatsappPhone}</p>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-mono font-bold tracking-widest mb-1">
                {order.orderId}
              </div>
              <p className="text-[10px] text-slate-500">Date: {order.orderDate}</p>
              {order.courierName && (
                <p className="text-xs font-bold text-indigo-700 mt-0.5">Courier: {order.courierName}</p>
              )}
            </div>
          </div>

          {/* Bold COD Amount to Collect Box (Primary Courier Instruction) */}
          <div className="border-2 border-dashed border-slate-800 bg-amber-50/60 p-4 rounded-xl mb-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                CASH TO COLLECT (C.O.D.)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ৳{order.total}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (Inclusive of delivery fee: ৳{order.deliveryFee})
              </span>
            </div>

            <div className="text-right border-l-2 border-slate-300 pl-4">
              <span className="text-[11px] font-bold uppercase text-slate-600 block">Payment Method</span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md inline-block mt-0.5">
                CASH ON DELIVERY
              </span>
            </div>
          </div>

          {/* Delivery Recipient Box */}
          <div className="border border-slate-300 rounded-xl p-4 mb-5 bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Deliver To (Recipient Details)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  {order.customerName}
                </p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {order.phoneNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-800 font-medium leading-snug">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 inline mr-1" />
                  {order.address}
                </p>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  Thana: {order.upazila} | District: {order.district}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-700 italic">
                <span className="font-semibold not-italic text-slate-900">Delivery Instructions:</span> {order.notes}
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="mb-5">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-600 uppercase font-bold text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Variation</th>
                  <th className="py-2 text-center">Bundle</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-bold text-slate-900">{item.product.name}</td>
                    <td className="py-2.5 text-center text-slate-600">{item.selectedVariation || '-'}</td>
                    <td className="py-2.5 text-center text-slate-600">{item.selectedBundle?.title || '1 Pcs'}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">৳{item.unitPrice * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Slip Footer / Barcode representation */}
          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Thank you for ordering with Baby Panda!</p>
              <p>For order queries, call our helpline: {settings.hotlinePhone}</p>
            </div>
            <div className="text-right">
              {/* Fake visual barcode stripes */}
              <div className="inline-flex gap-0.5 h-7 items-center bg-slate-100 p-1 rounded">
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2].map((w, i) => (
                  <div key={i} className={`h-full bg-slate-900 rounded-sm`} style={{ width: `${w * 1.5}px` }} />
                ))}
              </div>
              <span className="block font-mono text-[9px] text-slate-400 mt-0.5">{order.orderId}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
