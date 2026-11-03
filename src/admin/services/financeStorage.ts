import { ExpenseItem, AdminOrder } from '../types/admin';

const EXPENSES_KEY = 'baby_admin_expenses';

const SEED_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Baby Sleeping Blanket Batch 1 Import & Sourcing',
    category: 'Sourcing',
    amount: 18500,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10),
    note: '50 units initial batch imported'
  },
  {
    id: 'exp-2',
    title: 'Meta Facebook Video Ads Campaign',
    category: 'Ad Spend',
    amount: 4200,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
    note: 'Blanket conversion ad targeting new parents'
  },
  {
    id: 'exp-3',
    title: 'Custom Polybags & Bubble Wrap Roll',
    category: 'Packaging',
    amount: 1150,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10),
    note: 'Packaging material for 100 parcels'
  }
];

export const getExpenses = (): ExpenseItem[] => {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(SEED_EXPENSES));
      return SEED_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(SEED_EXPENSES));
      return SEED_EXPENSES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to get expenses', err);
    return SEED_EXPENSES;
  }
};

export const addExpense = (item: Omit<ExpenseItem, 'id'>): ExpenseItem => {
  const current = getExpenses();
  const newItem: ExpenseItem = {
    ...item,
    id: `exp-${Date.now()}`
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_expenses_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save expense', err);
  }
  return newItem;
};

export const deleteExpense = (id: string): void => {
  const current = getExpenses();
  const updated = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_expenses_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete expense', err);
  }
};

export interface FinanceSummary {
  grossSales: number;           // All non-cancelled orders
  deliveredRevenue: number;     // Cash collected
  inTransitRevenue: number;     // Cash expected
  pendingRevenue: number;       // Orders not yet dispatched
  totalCourierFees: number;     // Delivery fees paid
  courierHandlingFee: number;   // 1% COD fee
  netCourierDisbursement: number; // Delivered Revenue - (Delivery Fees + 1% COD fee)
  totalExpenses: number;        // Ad spend, sourcing, packaging
  sourcingExpense: number;
  adSpendExpense: number;
  packagingExpense: number;
  otherExpense: number;
  netEstimatedProfit: number;
}

export const calculateFinanceSummary = (
  orders: AdminOrder[],
  expenses: ExpenseItem[],
  courierFeePercent: number = 1.0
): FinanceSummary => {
  const nonCancelled = orders.filter((o) => o.status !== 'cancelled');
  const delivered = orders.filter((o) => o.status === 'delivered');
  const inTransit = orders.filter((o) => o.status === 'in_courier');
  const pendingOrPackaging = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'packaging');

  const grossSales = nonCancelled.reduce((sum, o) => sum + o.total, 0);
  const deliveredRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
  const inTransitRevenue = inTransit.reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = pendingOrPackaging.reduce((sum, o) => sum + o.total, 0);

  // Delivery courier fees on shipped/delivered orders
  const shippedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'in_courier');
  const totalCourierFees = shippedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const courierHandlingFee = Math.round((deliveredRevenue * courierFeePercent) / 100);
  const netCourierDisbursement = Math.max(0, deliveredRevenue - totalCourierFees - courierHandlingFee);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sourcingExpense = expenses.filter((e) => e.category === 'Sourcing').reduce((sum, e) => sum + e.amount, 0);
  const adSpendExpense = expenses.filter((e) => e.category === 'Ad Spend').reduce((sum, e) => sum + e.amount, 0);
  const packagingExpense = expenses.filter((e) => e.category === 'Packaging').reduce((sum, e) => sum + e.amount, 0);
  const otherExpense = totalExpenses - sourcingExpense - adSpendExpense - packagingExpense;

  // Net Profit: Delivered revenue minus COGS/Sourcing, Courier fees, Ad spend, Packaging
  const netEstimatedProfit = deliveredRevenue - (totalCourierFees + courierHandlingFee + totalExpenses);

  return {
    grossSales,
    deliveredRevenue,
    inTransitRevenue,
    pendingRevenue,
    totalCourierFees,
    courierHandlingFee,
    netCourierDisbursement,
    totalExpenses,
    sourcingExpense,
    adSpendExpense,
    packagingExpense,
    otherExpense,
    netEstimatedProfit
  };
};
