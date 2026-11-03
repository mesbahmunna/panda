import { Product, ProductBundleTier } from './product';

export interface CartItem {
  id: string; // unique item id: e.g. `${product.id}__${selectedVariation || 'none'}__${selectedBundle?.id || 'none'}`
  product: Product;
  quantity: number;
  unitPrice: number;
  selectedVariation?: string;
  selectedBundle?: ProductBundleTier;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  district: string;
  upazila: string;
  deliveryZone: DeliveryZone;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  orderDate: string;
}
