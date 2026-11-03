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

export interface SteadfastConsignment {
  consignmentId: number;
  invoice: string;
  trackingCode: string;
  trackingLink?: string;
  codAmount: number;
  status: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  bookedAt: string;
  note?: string;
}

export interface SteadfastFraudData {
  phone: string;
  deliveryRatio: number | null; // whole percent or null for new customers
  cancellationRatio: number | null; // whole percent or null
  volumeBand: 'none' | 'low' | 'medium' | 'high' | 'very_high' | string;
  volumeRange: string | null; // "7", "10+", "25+", "50+", "100+", or null
  deliveredCount: number | null;
  cancelledCount: number | null;
  totalReports: number;
  fraudCategories: Record<string, number>;
  doubtfulReports?: boolean;
  isInactiveAccount?: boolean;
  statusMessage?: string;
  checkedAt: string;
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
  steadfast?: SteadfastConsignment;
  fraudScore?: SteadfastFraudData;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  resolvedAt?: string;
  clearedFromStaff?: boolean;
  clearedFromStaffAt?: string;
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
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastBaseUrl: string;
  steadfastEnabled: boolean;
  steadfastDefaultNote: string;
}
