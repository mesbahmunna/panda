import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Save,
  Package,
  Layers,
  MapPin,
  Phone,
  User,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { AdminOrder, AdminOrderItem } from '../../admin/types/admin';
import { ProductBundleTier } from '../../types/product';
import { getAdminProductById } from '../../admin/services/productStorage';
import { updateOrderDetails } from '../../admin/services/orderStorage';

interface StaffOrderEditModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedOrder: AdminOrder) => void;
}

export const StaffOrderEditModal: React.FC<StaffOrderEditModalProps> = ({
  order,
  isOpen,
  onClose,
  onSaved
}) => {
  if (!isOpen || !order) return null;

  // Local state for editable items
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [deliveryFee, setDeliveryFee] = useState(70);
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setItems(JSON.parse(JSON.stringify(order.items || [])));
      setCustomerName(order.customerName || '');
      setPhoneNumber(order.phoneNumber || '');
      setAddress(order.address || '');
      setDistrict(order.district || 'Dhaka');
      setUpazila(order.upazila || '');
      setDeliveryZone(order.deliveryZone || (order.district === 'Dhaka' ? 'inside_dhaka' : 'outside_dhaka'));
      setDeliveryFee(order.deliveryFee ?? (order.district === 'Dhaka' ? 70 : 130));
      setNotes(order.notes || '');
      setNotification(null);
    }
  }, [order, isOpen]);

  // Recalculate delivery fee when zone changes
  const handleZoneChange = (zone: 'inside_dhaka' | 'outside_dhaka') => {
    setDeliveryZone(zone);
    setDeliveryFee(zone === 'inside_dhaka' ? 70 : 130);
  };

  // Adjust item quantity
  const handleQuantityChange = (index: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const nextQty = Math.max(1, target.quantity + delta);
      copy[index] = { ...target, quantity: nextQty };
      return copy;
    });
  };

  // Change variation option
  const handleVariationChange = (index: number, newVariation: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], selectedVariation: newVariation };
      return copy;
    });
  };

  // Change bundle tier
  const handleBundleChange = (index: number, tier: ProductBundleTier | null, baseProductPrice: number) => {
    setItems((prev) => {
      const copy = [...prev];
      if (tier) {
        copy[index] = {
          ...copy[index],
          selectedBundle: tier,
          unitPrice: tier.price
        };
      } else {
        copy[index] = {
          ...copy[index],
          selectedBundle: undefined,
          unitPrice: baseProductPrice
        };
      }
      return copy;
    });
  };

  // Live calculations
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleSave = () => {
    if (!customerName.trim() || !phoneNumber.trim()) {
      setNotification('Customer name and phone number cannot be empty.');
      return;
    }

    const updatedFields: Partial<AdminOrder> = {
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      district: district.trim(),
      upazila: upazila.trim(),
      deliveryZone,
      deliveryFee,
      items,
      subtotal,
      total,
      notes: notes.trim()
    };

    updateOrderDetails(order.id, updatedFields);
    onSaved({
      ...order,
      ...updatedFields
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b0952] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-gray-900 font-extrabold px-2 py-0.5 rounded">
                LIVE CALL EDIT
              </span>
              <span className="font-mono text-sm font-bold text-white/80">{order.orderId}</span>
            </div>
            <h3 className="font-extrabold text-lg leading-tight mt-0.5">
              Edit Order Items, Variation & Bundle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {notification && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* 1. Ordered Products Section (Quantity, Variation & Bundle controls) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              Customer Items ({items.length})
            </h4>

            <div className="space-y-4">
              {items.map((item, index) => {
                const product = getAdminProductById(item.product.id);
                const variationOptions = product?.variationGroup?.options || [];
                const bundleTiers = product?.bundleTiers || [];
                const basePrice = product?.price || item.product.price || 450;

                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3"
                  >
                    {/* Item Title & Price Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900 leading-snug">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">
                            Unit Price: <span className="font-bold text-indigo-700">৳{item.unitPrice}</span>
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-sm shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, 1)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Variations Row (e.g. Color) */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Color / Variation:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variationOptions.length > 0 ? (
                          variationOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => handleVariationChange(index, opt.name)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                item.selectedVariation === opt.name
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {opt.name}
                            </button>
                          ))
                        ) : (
                          <input
                            type="text"
                            value={item.selectedVariation || ''}
                            onChange={(e) => handleVariationChange(index, e.target.value)}
                            placeholder="e.g. Chocolate Brown"
                            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs w-full max-w-xs"
                          />
                        )}
                      </div>
                    </div>

                    {/* Bundle Tier Selector */}
                    {bundleTiers.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Bundle Package Tier:</span>
                          {item.selectedBundle && (
                            <span className="text-[11px] text-emerald-600 font-bold">
                              Active: {item.selectedBundle.title} (৳{item.selectedBundle.price})
                            </span>
                          )}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {bundleTiers.map((tier) => {
                            const isSelected = item.selectedBundle?.id === tier.id;
                            return (
                              <button
                                type="button"
                                key={tier.id}
                                onClick={() => handleBundleChange(index, tier, basePrice)}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200'
                                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold">{tier.title}</span>
                                  {tier.badge && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                                      {tier.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-black text-gray-900 mt-1">৳{tier.price}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Item Total */}
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Item subtotal ({item.quantity} × ৳{item.unitPrice}):</span>
                      <span className="font-bold text-gray-900 text-sm">৳{item.quantity * item.unitPrice}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Customer Contact & Delivery Info */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Customer Contact & Address Update
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Zone</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleZoneChange('inside_dhaka')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Inside Dhaka (৳70)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange('outside_dhaka')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Outside Dhaka (৳130)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Street Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area details..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Call Center Note / Customer Special Instructions
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call before delivery, prefers evening..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* 3. Live Recalculated Summary Card */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-gray-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-semibold text-gray-900">৳{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-[#0b0952] pt-2 border-t border-indigo-100">
              <span>Updated Total Payable (Cash on Delivery):</span>
              <span className="text-lg text-emerald-600">৳{total}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500">
            Changes will update COD parcel amount instantly.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Order Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
