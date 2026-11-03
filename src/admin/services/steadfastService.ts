import { AdminOrder, SteadfastConsignment, SteadfastFraudData } from '../types/admin';
import { getAdminSettings } from './settingsStorage';

// Endpoints to attempt for the PHP proxy bridge
const getProxyEndpoints = (): string[] => {
  if (typeof window !== 'undefined') {
    const isVitePort = window.location.port === '5173' || window.location.port === '3000' || window.location.port === '5174';
    if (isVitePort) {
      return [
        'http://localhost/baby/api/steadfast.php',
        '/baby/api/steadfast.php',
        '/api/steadfast.php'
      ];
    }
  }
  return [
    '/baby/api/steadfast.php',
    'api/steadfast.php',
    '/api/steadfast.php',
    'http://localhost/baby/api/steadfast.php'
  ];
};

/**
 * Strips characters banned by Steadfast: { } ; < > $
 * and truncates to max length
 */
export const sanitizeSteadfastString = (input?: string, maxLength = 100): string => {
  if (!input) return '';
  const sanitized = input.replace(/[{};<>$]/g, ' ').trim();
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
};

/**
 * Normalizes Bangladesh phone number to 11 digits: 01XXXXXXXXX
 */
export const formatSteadfastPhone = (phone?: string): string => {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('8801')) {
    digits = digits.substring(2);
  } else if (digits.startsWith('880')) {
    digits = digits.substring(2);
  } else if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits;
  }
  return digits.substring(0, 11);
};

/**
 * Cleans invoice string: only letters, digits, hyphens, and underscores
 */
export const formatSteadfastInvoice = (invoice?: string): string => {
  if (!invoice) return '';
  const clean = invoice.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').trim();
  return clean.substring(0, 100);
};

/**
 * Internal helper to dispatch requests to the proxy bridge
 */
async function callProxy<T = any>(
  action: string,
  method = 'GET',
  body?: any,
  queryParams?: Record<string, string | number>
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const settings = getAdminSettings();
  const apiKey = settings.steadfastApiKey || '5a6jjgtod15mg68pdp3pewjae9zu4k8g';
  const secretKey = settings.steadfastSecretKey || 'rygkmut7erremcmoeczyewi3';

  // Build query string
  const params = new URLSearchParams();
  params.set('action', action);
  if (queryParams) {
    Object.entries(queryParams).forEach(([k, v]) => {
      params.set(k, String(v));
    });
  }

  const queryString = params.toString();

  for (const baseEndpoint of getProxyEndpoints()) {
    try {
      const url = `${baseEndpoint}?${queryString}`;
      const headers: Record<string, string> = {
        'Api-Key': apiKey,
        'Secret-Key': secretKey,
        'Accept': 'application/json'
      };
      if (method === 'POST') {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      // If 404 on static/dev server, try next fallback endpoint (e.g. Apache PHP)
      if (res.status === 404) {
        continue;
      }

      const json = await res.json().catch(() => null);

      if (res.ok) {
        return { ok: true, status: res.status, data: json };
      } else {
        const errorMsg = json?.message || json?.error || `HTTP ${res.status}`;
        return { ok: false, status: res.status, error: errorMsg, data: json };
      }
    } catch {
      // Continue trying next endpoint
    }
  }

  return { ok: false, status: 0, error: 'Could not connect to Steadfast proxy bridge' };
}

/**
 * Health check: Ping Steadfast API
 */
export const pingSteadfast = async (): Promise<{
  connected: boolean;
  message: string;
  latencyMs: number;
  time?: string;
}> => {
  const start = performance.now();
  const result = await callProxy('ping');
  const latencyMs = Math.round(performance.now() - start);

  if (result.ok && result.data?.message === 'pong') {
    return {
      connected: true,
      message: 'Steadfast API connected successfully (pong)',
      latencyMs,
      time: result.data?.time
    };
  }

  return {
    connected: false,
    message: result.error || 'Connection failed',
    latencyMs
  };
};

/**
 * Check customer fraud and delivery track record
 * Caches results in localStorage for 24 hours to preserve API quota
 */
export const checkCustomerFraud = async (
  rawPhone: string,
  forceRefresh = false
): Promise<SteadfastFraudData> => {
  const phone = formatSteadfastPhone(rawPhone);
  const cacheKey = `baby_sf_fraud_${phone}`;

  // Check 24-hr cache if not forced
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: { timestamp: number; data: SteadfastFraudData } = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        if (age < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (err) {
      console.warn('Failed reading fraud cache', err);
    }
  }

  const result = await callProxy('fraud_check', 'GET', null, { phone });

  // Handle Account Inactive / KYC Pending (403)
  if (result.status === 403) {
    const kycPendingData: SteadfastFraudData = {
      phone,
      deliveryRatio: null,
      cancellationRatio: null,
      volumeBand: 'none',
      volumeRange: null,
      deliveredCount: null,
      cancelledCount: null,
      totalReports: 0,
      fraudCategories: {},
      isInactiveAccount: true,
      statusMessage: 'Steadfast Account KYC Activation Pending',
      checkedAt: new Date().toISOString()
    };
    return kycPendingData;
  }

  if (result.ok && result.data) {
    const d = result.data;
    const fraudData: SteadfastFraudData = {
      phone,
      deliveryRatio: typeof d.delivery_ratio === 'number' ? d.delivery_ratio : null,
      cancellationRatio: typeof d.cancellation_ratio === 'number' ? d.cancellation_ratio : null,
      volumeBand: d.volume_band || 'none',
      volumeRange: d.volume_range || null,
      deliveredCount: typeof d.delivered_count === 'number' ? d.delivered_count : null,
      cancelledCount: typeof d.cancelled_count === 'number' ? d.cancelled_count : null,
      totalReports: typeof d.total_reports === 'number' ? d.total_reports : 0,
      fraudCategories: d.fraud_categories || {},
      doubtfulReports: !!d.doubtful_reports,
      checkedAt: new Date().toISOString()
    };

    // Cache for 24h
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: fraudData }));
    } catch {
      // Storage full or private mode
    }

    return fraudData;
  }

  // Fallback if unreachable
  return {
    phone,
    deliveryRatio: null,
    cancellationRatio: null,
    volumeBand: 'none',
    volumeRange: null,
    deliveredCount: null,
    cancelledCount: null,
    totalReports: 0,
    fraudCategories: {},
    statusMessage: result.error || 'Fraud check unavailable',
    checkedAt: new Date().toISOString()
  };
};

/**
 * 1-Click Parcel Booking with Steadfast
 */
export const bookParcelWithSteadfast = async (
  order: AdminOrder
): Promise<{
  success: boolean;
  consignment?: SteadfastConsignment;
  error?: string;
}> => {
  const settings = getAdminSettings();

  const invoice = formatSteadfastInvoice(order.orderId || `ORD-${order.id.slice(0, 8)}`);
  const recipientName = sanitizeSteadfastString(order.customerName, 100);
  const recipientPhone = formatSteadfastPhone(order.phoneNumber);

  // Build clean address with district & upazila
  let addressCombined = order.address;
  if (order.upazila && !addressCombined.toLowerCase().includes(order.upazila.toLowerCase())) {
    addressCombined += `, ${order.upazila}`;
  }
  if (order.district && !addressCombined.toLowerCase().includes(order.district.toLowerCase())) {
    addressCombined += `, ${order.district}`;
  }
  const recipientAddress = sanitizeSteadfastString(addressCombined, 490);

  const note = sanitizeSteadfastString(
    order.notes ? `${order.notes} (${settings.steadfastDefaultNote})` : settings.steadfastDefaultNote,
    480
  );

  // Build item description
  const itemDesc = sanitizeSteadfastString(
    order.items.map(i => `${i.product.name} x${i.quantity}`).join(', '),
    250
  );

  const totalLot = order.items.reduce((sum, i) => sum + i.quantity, 0) || 1;

  const payload = {
    invoice,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    recipient_address: recipientAddress,
    cod_amount: Math.round(order.total),
    note,
    item_description: itemDesc,
    total_lot: totalLot,
    delivery_type: 0 // Home delivery
  };

  const result = await callProxy('create_order', 'POST', payload);

  if (result.ok && result.data?.consignment) {
    const c = result.data.consignment;
    const consignment: SteadfastConsignment = {
      consignmentId: c.consignment_id,
      invoice: c.invoice || invoice,
      trackingCode: c.tracking_code,
      trackingLink: c.tracking_link || `https://steadfast.com.bd/t/${c.tracking_code}`,
      codAmount: c.cod_amount || payload.cod_amount,
      status: c.status || 'in_review',
      recipientName: c.recipient_name || recipientName,
      recipientPhone: c.recipient_phone || recipientPhone,
      recipientAddress: c.recipient_address || recipientAddress,
      bookedAt: c.created_at || new Date().toISOString(),
      note: c.note || note
    };

    return { success: true, consignment };
  }

  // Handle errors
  let errorMsg = result.error || 'Failed to book parcel with Steadfast';
  if (result.data?.errors) {
    const fieldErrors = Object.entries(result.data.errors)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join(' | ');
    errorMsg = fieldErrors;
  }

  return { success: false, error: errorMsg };
};

/**
 * Fetch detailed parcel timeline / journey steps
 */
export interface SteadfastTrackingEvent {
  consignment_id: number;
  tracking_type: number;
  text: string;
  created_at: string;
}

export const fetchParcelTimeline = async (
  invoice: string
): Promise<{ success: boolean; events: SteadfastTrackingEvent[]; error?: string }> => {
  const result = await callProxy('trackings_by_invoice', 'GET', null, { invoice });
  if (result.ok && Array.isArray(result.data?.tracking)) {
    return { success: true, events: result.data.tracking };
  }
  return { success: false, events: [], error: result.error || 'No tracking history found' };
};

/**
 * Fetch live status of a parcel by tracking code
 */
export const fetchParcelStatus = async (
  trackingCode: string
): Promise<{ success: boolean; deliveryStatus?: string; error?: string }> => {
  const result = await callProxy('status_by_tracking', 'GET', null, { code: trackingCode });
  if (result.ok && result.data?.delivery_status) {
    return { success: true, deliveryStatus: result.data.delivery_status };
  }
  return { success: false, error: result.error || 'Failed to fetch status' };
};

/**
 * Fetch live COD wallet balance
 */
export const fetchMerchantBalance = async (): Promise<{
  success: boolean;
  currentBalance: number;
  error?: string;
}> => {
  const result = await callProxy('balance');
  if (result.ok && typeof result.data?.current_balance === 'number') {
    return { success: true, currentBalance: result.data.current_balance };
  }
  return { success: false, currentBalance: 0, error: result.error || 'Failed to fetch balance' };
};

/**
 * Recall / Return a parcel before delivery
 */
export const recallParcelRequest = async (
  invoice: string,
  reason: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  const payload = {
    invoice,
    reason: sanitizeSteadfastString(reason, 490)
  };
  const result = await callProxy('create_return_request', 'POST', payload);
  if (result.ok) {
    return { success: true, message: result.data?.message || 'Return request placed successfully' };
  }
  return { success: false, error: result.error || 'Return request rejected' };
};
