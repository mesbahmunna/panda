import { AdminOrder, OrderStatus } from '../types/admin';
import { getNextStaffForDistribution, recordStaffOrderAction } from './staffStorage';
import { broadcastNewOrderEvent } from '../../utils/audioAlert';

const ORDERS_KEY = 'baby_admin_orders';

// High quality realistic mock orders for initial admin experience
const SEED_ORDERS: AdminOrder[] = [
  {
    id: 'BABY-902144',
    orderId: 'BABY-902144',
    customerName: 'Tanzina Sultana',
    phoneNumber: '01712849301',
    address: 'House 14, Road 7, Sector 3, Uttara',
    district: 'Dhaka',
    upazila: 'Uttara',
    deliveryZone: 'inside_dhaka',
    notes: 'Please call before delivery. Infant sleeping blanket needed urgently.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 800,
        selectedVariation: 'চকলেট ব্রাউন (Chocolate Brown)',
        selectedBundle: {
          id: 'tier-2',
          pieces: 2,
          title: '২ পিছ (2 Pcs)',
          price: 800,
          originalPrice: 900,
          badge: 'জনপ্রিয় (Save ৳100)'
        }
      }
    ],
    subtotal: 800,
    deliveryFee: 70,
    discount: 0,
    total: 870,
    paymentMethod: 'Cash on Delivery',
    status: 'pending',
    orderDate: 'Today, 02:45 PM',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'BABY-901850',
    orderId: 'BABY-901850',
    customerName: 'Rafiqul Islam',
    phoneNumber: '01844295103',
    address: 'Flat 4B, Green Paradise, GEC Circle',
    district: 'Chittagong',
    upazila: 'Panchlaish',
    deliveryZone: 'outside_dhaka',
    notes: 'Confirming order via phone. Send via Steadfast.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 1500,
        selectedVariation: 'স্কাই ব্লু (Sky Blue)',
        selectedBundle: {
          id: 'tier-4',
          pieces: 4,
          title: '৪ পিছ (4 Pcs)',
          price: 1500,
          originalPrice: 1800,
          badge: 'মেগা সেভার (Save ৳300)'
        }
      }
    ],
    subtotal: 1500,
    deliveryFee: 130,
    discount: 0,
    total: 1630,
    paymentMethod: 'Cash on Delivery',
    status: 'confirmed',
    courierName: 'Steadfast',
    orderDate: 'Today, 11:20 AM',
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString()
  },
  {
    id: 'BABY-899401',
    orderId: 'BABY-899401',
    customerName: 'Farhana Akter',
    phoneNumber: '01911928472',
    address: 'Holding 82, Ambarkhana Point',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    deliveryZone: 'outside_dhaka',
    notes: 'Gift pack for baby shower.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 1150,
        selectedVariation: 'সফট পিঙ্ক (Soft Pink)',
        selectedBundle: {
          id: 'tier-3',
          pieces: 3,
          title: '৩ পিছ (3 Pcs)',
          price: 1150,
          originalPrice: 1350,
          badge: 'সেরা অফার (Save ৳200)'
        }
      }
    ],
    subtotal: 1150,
    deliveryFee: 130,
    discount: 115,
    total: 1165,
    paymentMethod: 'Cash on Delivery',
    status: 'packaging',
    orderDate: 'Yesterday, 04:15 PM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
  },
  {
    id: 'BABY-897210',
    orderId: 'BABY-897210',
    customerName: 'Mahmudul Hasan',
    phoneNumber: '01673829104',
    address: 'Block C, Bashundhara R/A',
    district: 'Dhaka',
    upazila: 'Bhatara',
    deliveryZone: 'inside_dhaka',
    notes: 'Office delivery after 2 PM.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 450,
        selectedVariation: 'ওয়ার্ম খাকি (Warm Khaki)',
        selectedBundle: {
          id: 'tier-1',
          pieces: 1,
          title: '১ পিছ (1 Pcs)',
          price: 450,
          originalPrice: 650,
          badge: 'নিয়মিত প্যাক'
        }
      }
    ],
    subtotal: 450,
    deliveryFee: 70,
    discount: 0,
    total: 520,
    paymentMethod: 'Cash on Delivery',
    status: 'in_courier',
    courierName: 'Pathao',
    courierTrackingId: 'PTH-8839210',
    orderDate: 'Nov 02, 01:10 PM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'BABY-895100',
    orderId: 'BABY-895100',
    customerName: 'Nusrat Jahan',
    phoneNumber: '01799837261',
    address: 'House 8, Road 2, Dhanmondi',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    deliveryZone: 'inside_dhaka',
    notes: 'Delivered and cash collected.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 800,
        selectedVariation: 'চকলেট ব্রাউন (Chocolate Brown)',
        selectedBundle: {
          id: 'tier-2',
          pieces: 2,
          title: '২ পিছ (2 Pcs)',
          price: 800,
          originalPrice: 900,
          badge: 'জনপ্রিয় (Save ৳100)'
        }
      }
    ],
    subtotal: 800,
    deliveryFee: 70,
    discount: 0,
    total: 870,
    paymentMethod: 'Cash on Delivery',
    status: 'delivered',
    courierName: 'Steadfast',
    courierTrackingId: 'ST-928371',
    orderDate: 'Nov 01, 05:40 PM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: 'BABY-893202',
    orderId: 'BABY-893202',
    customerName: 'Shakil Ahmed',
    phoneNumber: '01552391823',
    address: 'Station Road, Bogura Town',
    district: 'Bogura',
    upazila: 'Bogura Sadar',
    deliveryZone: 'outside_dhaka',
    notes: 'Customer changed mind over call.',
    items: [
      {
        product: {
          id: 'prod-sleeping-blanket',
          name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
          slug: 'baby-sleeping-blanket-swaddle-wrap',
          thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
          price: 450
        },
        quantity: 1,
        unitPrice: 450,
        selectedVariation: 'সফট পিঙ্ক (Soft Pink)',
        selectedBundle: {
          id: 'tier-1',
          pieces: 1,
          title: '১ পিছ (1 Pcs)',
          price: 450,
          originalPrice: 650
        }
      }
    ],
    subtotal: 450,
    deliveryFee: 130,
    discount: 0,
    total: 580,
    paymentMethod: 'Cash on Delivery',
    status: 'cancelled',
    orderDate: 'Oct 31, 03:25 PM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
  }
];

export const getOrders = (): AdminOrder[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    // Backfill any existing legacy orders in localStorage with staff assignments
    const staffMap = [
      { id: 'staff-101', name: 'Tanzim Ahmed' },
      { id: 'staff-102', name: 'Nusrat Jahan' },
      { id: 'staff-103', name: 'Shakil Hossain' }
    ];
    let needsResave = false;
    const mapped = parsed.map((o: AdminOrder, idx: number) => {
      if (!o.assignedStaffId) {
        needsResave = true;
        const assigned = staffMap[idx % staffMap.length];
        return {
          ...o,
          assignedStaffId: assigned.id,
          assignedStaffName: assigned.name
        };
      }
      return o;
    });
    if (needsResave) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(mapped));
    }
    return mapped;
  } catch (err) {
    console.error('Failed to parse admin orders', err);
    return SEED_ORDERS;
  }
};

export const getOrderById = (id: string): AdminOrder | undefined => {
  const orders = getOrders();
  return orders.find((o) => o.id === id || o.orderId === id);
};

export const addOrder = (orderData: Partial<AdminOrder>): AdminOrder => {
  const orders = getOrders();
  const orderId = orderData.orderId || `BABY-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Fair-share equal round-robin distribution to staff available today
  const assignedStaff = orderData.assignedStaffId ? undefined : getNextStaffForDistribution();

  const newOrder: AdminOrder = {
    id: orderId,
    orderId,
    customerName: orderData.customerName || 'Anonymous Customer',
    phoneNumber: orderData.phoneNumber || '',
    address: orderData.address || '',
    district: orderData.district || 'Dhaka',
    upazila: orderData.upazila || '',
    deliveryZone: orderData.deliveryZone || (orderData.district === 'Dhaka' ? 'inside_dhaka' : 'outside_dhaka'),
    notes: orderData.notes || '',
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    deliveryFee: orderData.deliveryFee || 70,
    discount: orderData.discount || 0,
    total: orderData.total || 0,
    paymentMethod: 'Cash on Delivery',
    status: orderData.status || 'pending',
    courierName: orderData.courierName,
    courierTrackingId: orderData.courierTrackingId,
    assignedStaffId: orderData.assignedStaffId || (assignedStaff ? assignedStaff.id : undefined),
    assignedStaffName: orderData.assignedStaffName || (assignedStaff ? assignedStaff.name : 'Unassigned'),
    assignedAt: orderData.assignedAt || (assignedStaff ? new Date().toISOString() : undefined),
    orderDate: orderData.orderDate || new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    createdAt: new Date().toISOString()
  };

  const updatedOrders = [newOrder, ...orders];
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('baby_orders_updated', { detail: updatedOrders }));
    
    // Broadcast notification sound alert and event across admin and staff windows
    broadcastNewOrderEvent({
      orderId: newOrder.orderId,
      customerName: newOrder.customerName,
      phoneNumber: newOrder.phoneNumber,
      total: newOrder.total,
      assignedStaffId: newOrder.assignedStaffId,
      assignedStaffName: newOrder.assignedStaffName,
      district: newOrder.district
    });
  } catch (err) {
    console.error('Failed to save new order', err);
  }

  return newOrder;
};

export const updateOrderStatus = (
  orderId: string,
  newStatus: OrderStatus,
  courierInfo?: { courierName?: string; trackingId?: string }
): void => {
  const orders = getOrders();
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId || order.orderId === orderId) {
      if ((newStatus === 'confirmed' || newStatus === 'cancelled') && order.assignedStaffId) {
        recordStaffOrderAction(order.assignedStaffId, newStatus);
      }
      return {
        ...order,
        status: newStatus,
        courierName: courierInfo?.courierName !== undefined ? courierInfo.courierName : order.courierName,
        courierTrackingId: courierInfo?.trackingId !== undefined ? courierInfo.trackingId : order.courierTrackingId
      };
    }
    return order;
  });

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('baby_orders_updated', { detail: updatedOrders }));
  } catch (err) {
    console.error('Failed to update order status', err);
  }
};

export const updateOrderDetails = (
  orderId: string,
  updatedFields: Partial<AdminOrder>
): void => {
  const orders = getOrders();
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId || order.orderId === orderId) {
      return {
        ...order,
        ...updatedFields
      };
    }
    return order;
  });

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('baby_orders_updated', { detail: updatedOrders }));
  } catch (err) {
    console.error('Failed to update order details', err);
  }
};

export const deleteOrder = (orderId: string): void => {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== orderId && o.orderId !== orderId);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('baby_orders_updated', { detail: filtered }));
  } catch (err) {
    console.error('Failed to delete order', err);
  }
};

export const exportOrdersToCSV = (orders: AdminOrder[]): void => {
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Phone',
    'District',
    'Upazila',
    'Address',
    'Items Count',
    'Items Summary',
    'Subtotal',
    'Delivery Fee',
    'Discount',
    'Total COD Payable',
    'Status',
    'Courier',
    'Tracking ID'
  ];

  const rows = orders.map((o) => {
    const itemsSummary = o.items
      .map((i) => `${i.product.name} (Qty: ${i.quantity}, ${i.selectedVariation || 'No Var'}, ${i.selectedBundle?.title || 'No Bundle'})`)
      .join('; ')
      .replace(/"/g, '""');

    return [
      o.orderId,
      `"${o.orderDate}"`,
      `"${o.customerName}"`,
      `"${o.phoneNumber}"`,
      `"${o.district}"`,
      `"${o.upazila}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.items.reduce((sum, item) => sum + item.quantity, 0),
      `"${itemsSummary}"`,
      o.subtotal,
      o.deliveryFee,
      o.discount,
      o.total,
      o.status.toUpperCase(),
      `"${o.courierName || 'Unassigned'}"`,
      `"${o.courierTrackingId || ''}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `baby_panda_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
