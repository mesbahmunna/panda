import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Product } from './types/product';

// Header & Navigation
import { MainHeader } from './components/Header/MainHeader';
import { CategoryNav } from './components/Header/CategoryNav';
import { MobileNav } from './components/Header/MobileNav';
import { Footer } from './components/Footer/Footer';

// Drawers & Modals
import { CartDrawer } from './components/Cart/CartDrawer';
import { CategoriesDrawer } from './components/Categories/CategoriesDrawer';
import { PolicyModal } from './components/common/PolicyModal';

// Dedicated Customer Storefront Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

// Admin Portal Pages
import { AdminLayout } from './admin/pages/AdminLayout';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage';
import { AdminProductsPage } from './admin/pages/AdminProductsPage';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage';
import { AdminStaffPage } from './admin/pages/AdminStaffPage';
import { AdminFinancePage } from './admin/pages/AdminFinancePage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';

// Staff Call Center Desk
import { StaffGate } from './staff/StaffGate';
import { StaffDashboardPage } from './staff/StaffDashboardPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive selected category directly from URL (/category/:slug) for true SEO-friendly routing
  const selectedCategory = location.pathname.startsWith('/category/')
    ? decodeURIComponent(location.pathname.replace('/category/', ''))
    : null;

  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: string } | null>(null);

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.slug}`);
    window.scrollTo(0, 0);
  };

  const handleNavigateHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleSelectCategory = (catSlug: string | null) => {
    if (catSlug) {
      navigate(`/category/${catSlug}`);
    } else {
      navigate('/');
    }
    window.scrollTo(0, 0);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStaffRoute = location.pathname.startsWith('/staff');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-[#252a34]">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    );
  }

  if (isStaffRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-[#252a34]">
        <ScrollToTop />
        <StaffGate>
          <Routes>
            <Route path="/staff" element={<StaffDashboardPage />} />
            <Route path="/staff/*" element={<StaffDashboardPage />} />
            <Route path="*" element={<Navigate to="/staff" replace />} />
          </Routes>
        </StaffGate>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-[#252a34]">
      {/* Scroll to top immediately on route change */}
      <ScrollToTop />

      {/* 1. Header (Main Header + Category Nav) */}
      <MainHeader
        onSelectProduct={handleSelectProduct}
        onNavigateHome={handleNavigateHome}
        onToggleMobileMenu={() => setIsMobileCategoriesOpen(true)}
      />

      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Routes (Separate Dedicated Pages for Home, Categories, Products, Checkout & Confirmation) */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                selectedCategory={null}
                onSelectCategory={handleSelectCategory}
              />
            }
          />
          {/* Dedicated Separate Page for each category with proper URL (/category/:slug) */}
          <Route path="/category/:slug" element={<CategoryPage />} />

          {/* Dedicated Separate Page for each product */}
          <Route path="/product/:slug" element={<ProductPage />} />

          {/* Dedicated Separate Page for Checkout (NO POPUP!) */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Dedicated Separate Page for Order Confirmation */}
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <HomePage
                selectedCategory={null}
                onSelectCategory={handleSelectCategory}
              />
            }
          />
        </Routes>
      </main>

      {/* 3. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenPolicy={(title, content) => setActivePolicy({ title, content })}
      />

      {/* 4. Mobile Bottom Sticky Navigation (Curved Floating Dock) */}
      <MobileNav
        onNavigateHome={handleNavigateHome}
        onOpenCategories={() => setIsMobileCategoriesOpen(true)}
      />

      {/* 5. Drawers & Overlays */}
      <CartDrawer onSelectProduct={handleSelectProduct} />
      <CategoriesDrawer
        isOpen={isMobileCategoriesOpen}
        onClose={() => setIsMobileCategoriesOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <PolicyModal
        policy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
};

export function App() {
  const getBasename = () => {
    return window.location.pathname.startsWith('/baby') ? '/baby' : '';
  };

  return (
    <BrowserRouter basename={getBasename()}>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
