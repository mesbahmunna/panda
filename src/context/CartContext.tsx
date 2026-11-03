import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductBundleTier } from '../types/product';
import { CartItem, DeliveryZone, OrderDetails } from '../types/cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariation?: string,
    selectedBundle?: ProductBundleTier,
    openDrawer?: boolean
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  deliveryFee: number;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastOrder: OrderDetails | null;
  submitOrder: (formData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    district: string;
    upazila: string;
    notes?: string;
  }) => OrderDetails;
  buyNow: (
    product: Product,
    quantity?: number,
    selectedVariation?: string,
    selectedBundle?: ProductBundleTier
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('baby_cart_items');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        id: item.id || `${item.product.id}__${item.selectedVariation || 'none'}__${item.selectedBundle?.id || 'none'}`,
        product: item.product,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || item.selectedBundle?.price || item.product.price,
        selectedVariation: item.selectedVariation,
        selectedBundle: item.selectedBundle
      }));
    } catch {
      return [];
    }
  });

  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('baby_cart_items', JSON.stringify(items));
    } catch {
      // storage quota or error
    }
  }, [items]);

  const deliveryFee = deliveryZone === 'inside_dhaka' ? 70 : 130;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || item.product.price) * item.quantity,
    0
  );

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariation?: string,
    selectedBundle?: ProductBundleTier,
    openDrawer: boolean = true
  ) => {
    const unitPrice = selectedBundle ? selectedBundle.price : product.price;
    const cartItemId = `${product.id}__${selectedVariation || 'none'}__${selectedBundle?.id || 'none'}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === cartItemId || (!item.id && item.product.id === product.id)
      );
      if (existingIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: cartItemId,
          product,
          quantity,
          unitPrice,
          selectedVariation,
          selectedBundle
        }
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    } else {
      setIsCartOpen(false);
    }
  };

  const buyNow = (
    product: Product,
    quantity: number = 1,
    selectedVariation?: string,
    selectedBundle?: ProductBundleTier
  ) => {
    addToCart(product, quantity, selectedVariation, selectedBundle, false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId && item.product.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId || item.product.id === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setAppliedCoupon('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BABY10' || clean === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCoupon(clean);
      return { success: true, message: `Coupon ${clean} applied! 10% discount saved ৳${disc}` };
    }
    if (clean === 'FREESHIP') {
      setDiscount(deliveryFee);
      setAppliedCoupon(clean);
      return { success: true, message: 'Free Delivery coupon applied successfully!' };
    }
    return { success: false, message: 'Invalid coupon code. Try BABY10 for 10% OFF' };
  };

  const submitOrder = (formData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    district: string;
    upazila: string;
    notes?: string;
  }): OrderDetails => {
    const orderId = `BABY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderDetails = {
      orderId,
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      district: formData.district,
      upazila: formData.upazila,
      deliveryZone,
      notes: formData.notes,
      items: [...items],
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod: 'Cash on Delivery',
      orderDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryZone,
        setDeliveryZone,
        deliveryFee,
        discount,
        applyCoupon,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastOrder,
        submitOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
