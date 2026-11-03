import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminGate } from '../components/AdminGate';
import { getOrders } from '../services/orderStorage';
import { soundManager, subscribeToNewOrderEvents, NewOrderNotificationDetail } from '../../utils/audioAlert';
import { NewOrderAlertBanner } from '../../components/common/NewOrderAlertBanner';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return window.innerWidth < 1200;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [latestNotification, setLatestNotification] = useState<NewOrderNotificationDetail | null>(null);
  const location = useLocation();

  const refreshPending = () => {
    const orders = getOrders();
    const pending = orders.filter((o) => o.status === 'pending').length;
    setPendingCount(pending);
  };

  useEffect(() => {
    refreshPending();
    const handleOrdersUpdated = () => refreshPending();
    window.addEventListener('baby_orders_updated', handleOrdersUpdated);

    // Audio chime & notification banner on new incoming customer orders
    const unsubscribeAudio = subscribeToNewOrderEvents((detail) => {
      soundManager.playNewOrderAlert();
      setLatestNotification(detail);
      refreshPending();
    });

    return () => {
      window.removeEventListener('baby_orders_updated', handleOrdersUpdated);
      unsubscribeAudio();
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <AdminGate>
      <div className="min-h-screen bg-[#F8F9FD] text-[#252a34] flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            pendingCount={pendingCount}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 w-72 bg-[#0b0952] h-full shadow-2xl">
              <AdminSidebar
                collapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
                pendingCount={pendingCount}
              />
            </div>
          </div>
        )}

        {/* Content Container */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <Outlet context={{ onOpenMobileMenu: () => setMobileOpen(true), pendingCount }} />
        </div>

        {/* Global New Order Notification Audio & Visual Alert Banner */}
        <NewOrderAlertBanner
          notification={latestNotification}
          onDismiss={() => setLatestNotification(null)}
          role="admin"
        />
      </div>
    </AdminGate>
  );
};
