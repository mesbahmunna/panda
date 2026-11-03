import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Truck,
  CheckCircle2,
  PieChart,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { getOrders } from '../services/orderStorage';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  calculateFinanceSummary,
  FinanceSummary
} from '../services/financeStorage';
import { ExpenseItem, AdminOrder } from '../types/admin';
import { ExpenseModal } from '../components/ExpenseModal';
import { getAdminSettings } from '../services/settingsStorage';
import { fetchMerchantBalance } from '../services/steadfastService';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminFinancePage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getExpenses());
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [sfBalance, setSfBalance] = useState<number | null>(null);
  const [sfBalanceLoading, setSfBalanceLoading] = useState(false);
  const settings = getAdminSettings();

  const loadSteadfastBalance = async () => {
    setSfBalanceLoading(true);
    const res = await fetchMerchantBalance();
    if (res.success) {
      setSfBalance(res.currentBalance);
    }
    setSfBalanceLoading(false);
  };

  const refreshAll = () => {
    setOrders(getOrders());
    setExpenses(getExpenses());
  };

  useEffect(() => {
    refreshAll();
    loadSteadfastBalance();
    window.addEventListener('baby_orders_updated', refreshAll);
    window.addEventListener('baby_expenses_updated', refreshAll);
    return () => {
      window.removeEventListener('baby_orders_updated', refreshAll);
      window.removeEventListener('baby_expenses_updated', refreshAll);
    };
  }, []);

  const summary: FinanceSummary = calculateFinanceSummary(
    orders,
    expenses,
    settings.courierHandlingFeePercent || 1.0
  );

  const handleSaveExpense = (item: Omit<ExpenseItem, 'id'>) => {
    addExpense(item);
    refreshAll();
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Delete this expense record?')) {
      deleteExpense(id);
      refreshAll();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Type', 'Title / Ref', 'Category', 'Date', 'Amount (BDT)'];
    const expenseRows = expenses.map((e) => [
      'EXPENSE',
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.date}"`,
      `-${e.amount}`
    ]);

    const orderRows = orders
      .filter((o) => o.status === 'delivered')
      .map((o) => [
        'COD_COLLECTED',
        `"${o.orderId} - ${o.customerName}"`,
        `"Delivered COD"`,
        `"${o.orderDate}"`,
        `+${o.total}`
      ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...orderRows.map((r) => r.join(',')), ...expenseRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `baby_panda_finance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Finance & COD Reconciliation"
        subtitle="Tracking Cash on Delivery disbursements, courier charges, and net profitability"
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* Top Financial KPI Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Delivered COD Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivered COD Collected
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ৳{summary.deliveredRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Closed Cash</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Disbursed
              </span>
            </div>
          </div>

          {/* Card 2: In-Transit Pipeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                In-Transit COD Expected
              </span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              ৳{summary.inTransitRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>With Courier Riders</span>
              <span className="text-indigo-600 font-semibold">Expected Soon</span>
            </div>
          </div>

          {/* Card 3: Courier Delivery & COD Fees */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Courier Charges Deducted
              </span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600">
              - ৳{(summary.totalCourierFees + summary.courierHandlingFee).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Delivery + 1% COD Fee</span>
              <span className="text-rose-500 font-semibold">Logistics Cost</span>
            </div>
          </div>

          {/* Card 4: Operating Expenses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Operating Expenses
              </span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ৳{summary.totalExpenses.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>{expenses.length} expense entries</span>
              <span className="text-amber-600 font-semibold">Ad Spend / Sourcing</span>
            </div>
          </div>

        </div>

        {/* Steadfast Courier COD Merchant Wallet Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-[#0b0952] text-white p-5 sm:p-6 rounded-3xl border border-indigo-700/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Steadfast Merchant COD Balance</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live API
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Delivered COD collected by riders, less delivery charges & 1% collection fee. Available for payout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
            <div className="text-right">
              <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">Available Balance</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {sfBalanceLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin inline text-white/60" />
                ) : (
                  `৳${(sfBalance ?? 0).toLocaleString()}`
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSteadfastBalance}
                disabled={sfBalanceLoading}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Refresh Steadfast Balance"
              >
                <RefreshCw className={`w-4 h-4 ${sfBalanceLoading ? 'animate-spin' : ''}`} />
              </button>
              <a
                href="https://steadfast.com.bd/user/payouts"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Request Payout</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Net Profit & Courier Payout Card */}
        <div className="bg-gradient-to-br from-[#0b0952] to-[#171378] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Estimated Net Cash Profit
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {summary.netEstimatedProfit >= 0 ? '+' : ''}৳{summary.netEstimatedProfit.toLocaleString()}
            </div>
            <p className="text-xs text-white/70 max-w-xl">
              Formula: Delivered COD Revenue (৳{summary.deliveredRevenue}) − Courier Deductions (৳{summary.totalCourierFees + summary.courierHandlingFee}) − Total Recorded Expenses (৳{summary.totalExpenses})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-[#0b0952] font-bold text-xs rounded-2xl transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-2xl transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Expenses List & Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Operational Expenses Log</h3>
              <p className="text-xs text-slate-500">Tracked ad spend, wholesale product sourcing, and packaging supplies</p>
            </div>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Expense</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4">Amount (৳)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 font-medium">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.category === 'Ad Spend'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.category === 'Sourcing'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.category === 'Packaging'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-[200px] truncate">
                      {item.note || '-'}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                      ৳{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(item.id)}
                        title="Delete expense"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};
