import { Product, ProductBundleTier, ProductVariationGroup } from '../../types/product';

export type OrderStatus = 'pending' | 'confirmed' | 'packaging' | 'in_courier' | 'delivered' | 'cancelled';

export interface AdminOrderItem {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  selectedVariation?: string;
  selectedBundle?: ProductBundleTier;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  district: string;
  upazila: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  notes?: string;
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  courierName?: 'Steadfast' | 'Pathao' | 'RedX' | 'Paperfly' | string;
  courierTrackingId?: string;
  orderDate: string;
  createdAt: string; // ISO 8601 string
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Ad Spend' | 'Sourcing' | 'Packaging' | 'Courier Return' | 'Office/Utility' | 'Other';
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface AdminStoreSettings {
  adminPin: string;
  storeName: string;
  hotlinePhone: string;
  whatsappPhone: string;
  supportEmail: string;
  showroomAddress: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  courierHandlingFeePercent: number;
}
