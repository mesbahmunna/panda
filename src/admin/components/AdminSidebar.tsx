import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Folder,
  Users,
  TrendingUp,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { setPinAuthenticated } from '../services/settingsStorage';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  pendingCount = 0
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setPinAuthenticated(false);
    navigate('/admin');
    window.location.reload();
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? `${pendingCount} new` : null
    },
    {
      to: '/admin/products',
      label: 'Products',
      icon: Package,
      badge: null
    },
    {
      to: '/admin/categories',
      label: 'Categories',
      icon: Folder,
      badge: null
    },
    {
      to: '/admin/staff',
      label: 'Staff Team',
      icon: Users,
      badge: null
    },
    {
      to: '/admin/finance',
      label: 'Finance & COD',
      icon: TrendingUp,
      badge: null
    },
    {
      to: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0b0952] text-white flex flex-col border-r border-white/10 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={logoImg} alt="Baby Panda" className="h-9 w-auto object-contain shrink-0" />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-wide text-white leading-tight truncate">
                BABY PANDA
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Admin Center
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-amber-400 text-[#0b0952] font-bold shadow-md shadow-amber-400/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-500 text-white animate-pulse">
                {item.badge}
              </span>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 shrink-0 space-y-1">
        {/* Visit Live Store */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'View Live Store' : undefined}
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-emerald-400" />
          {!collapsed && <span>View Live Store</span>}
        </a>

        {/* Lock / Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 text-xs font-medium transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Lock Admin' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Lock Portal</span>}
        </button>
      </div>
    </aside>
  );
};
