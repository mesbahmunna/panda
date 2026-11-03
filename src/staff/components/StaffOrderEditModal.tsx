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
  AlertCircle,
  Check
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

// Fallback variations for products
const DEFAULT_VARIATIONS = [
  { id: 'v-brown', name: 'Chocolate Brown' },
  { id: 'v-pink', name: 'Soft Pink' },
  { id: 'v-blue', name: 'Sky Blue' },
  { id: 'v-khaki', name: 'Warm Khaki' }
];

// Fallback bundle tiers
const DEFAULT_BUNDLES: ProductBundleTier[] = [
  { id: 'b-1', pieces: 1, title: '1 Pcs', price: 450, badge: 'Standard' },
  { id: 'b-2', pieces: 2, title: '2 Pcs', price: 800, badge: 'Save ৳100' },
  { id: 'b-3', pieces: 3, title: '3 Pcs', price: 1150, badge: 'Save ৳200' },
  { id: 'b-4', pieces: 4, title: '4 Pcs', price: 1500, badge: 'Save ৳300' }
];

export const StaffOrderEditModal: React.FC<StaffOrderEditModalProps> = ({
  order,
  isOpen,
  onClose,
  onSaved
}) => {
  if (!isOpen || !order) return null;

  const currentOrderId = order.id || order.orderId;

  // Local editable states
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [deliveryFee, setDeliveryFee] = useState(70);
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize ONLY on modal open or when target order ID changes (prevents wiping out edits during parent re-render!)
  useEffect(() => {
    if (isOpen && order) {
      setItems(JSON.parse(JSON.stringify(order.items || [])));
      setCustomerName(order.customerName || '');
      setPhoneNumber(order.phoneNumber || '');
      setAddress(order.address || '');
      setDistrict(order.district || 'Dhaka');
      setUpazila(order.upazila || '');
      const zone = order.deliveryZone || (order.district === 'Dhaka' ? 'inside_dhaka' : 'outside_dhaka');
      setDeliveryZone(zone);
      setDeliveryFee(order.deliveryFee ?? (zone === 'inside_dhaka' ? 70 : 130));
      setNotes(order.notes || '');
      setNotification(null);
    }
  }, [isOpen, currentOrderId]);

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
  const handleBundleChange = (index: number, tier: ProductBundleTier, baseProductPrice: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        selectedBundle: tier,
        unitPrice: tier.price
      };
      return copy;
    });
  };

  // Check if variation is active (fuzzy matching for English and Bengali names)
  const isVariationSelected = (current: string | undefined, optionName: string) => {
    if (!current) return false;
    if (current === optionName) return true;
    const cLow = current.toLowerCase();
    const oLow = optionName.toLowerCase();
    return cLow.includes(oLow) || oLow.includes(cLow);
  };

  // Check if bundle is active
  const isBundleSelected = (currentBundle: ProductBundleTier | undefined, tier: ProductBundleTier) => {
    if (!currentBundle) return tier.pieces === 1;
    return (
      currentBundle.id === tier.id ||
      currentBundle.pieces === tier.pieces ||
      currentBundle.price === tier.price ||
      currentBundle.title === tier.title
    );
  };

  // Live calculations
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    const targetId = order.id || order.orderId;
    updateOrderDetails(targetId, updatedFields);

    onSaved({
      ...order,
      ...updatedFields
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0b0952] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-400 text-gray-950 font-black px-2 py-0.5 rounded uppercase">
                Order Editor
              </span>
              <span className="font-mono text-xs font-bold text-white/80">{order.orderId}</span>
            </div>
            <h3 className="font-bold text-base mt-0.5 text-white">
              Edit Quantity, Variations &amp; Customer Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {notification && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* 1. Items List */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ordered Product ({items.length})</span>
            </h4>

            {items.map((item, index) => {
              const product = getAdminProductById(item.product.id);
              const variationOptions =
                product?.variationGroup?.options?.length ? product.variationGroup.options : DEFAULT_VARIATIONS;
              const bundleTiers = product?.bundleTiers?.length ? product.bundleTiers : DEFAULT_BUNDLES;
              const basePrice = product?.price || item.product.price || 450;

              return (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3"
                >
                  {/* Item Title & Qty Stepper */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 leading-tight truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          Price: <strong className="text-indigo-700">৳{item.unitPrice}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(index, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(index, 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Variation Options */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                      Color / Variation:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {variationOptions.map((opt) => {
                        const isSelected = isVariationSelected(item.selectedVariation, opt.name);
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => handleVariationChange(index, opt.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bundle Tier Options */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                      Package Bundle Tier:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {bundleTiers.map((tier) => {
                        const isSelected = isBundleSelected(item.selectedBundle, tier);
                        return (
                          <button
                            type="button"
                            key={tier.id}
                            onClick={() => handleBundleChange(index, tier, basePrice)}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-200'
                                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span>{tier.title}</span>
                              {tier.badge && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-black text-gray-900 mt-0.5">৳{tier.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Customer Information */}
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h4 className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Customer Contact &amp; Delivery Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:border-indigo-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Delivery Zone</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleZoneChange('inside_dhaka')}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    Inside Dhaka (৳70)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange('outside_dhaka')}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    Outside Dhaka (৳130)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Call Memo / Customer Note</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call before delivery, requested morning delivery..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* 3. Live Price Calculation Summary */}
          <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-bold text-gray-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-bold text-gray-900">৳{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-[#0b0952] pt-2 border-t border-indigo-200/60">
              <span>Updated Total Payable (COD):</span>
              <span className="text-base text-emerald-600">৳{total}</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
