import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Product } from './types/product';

// Header & Navigation
import { TopBar } from './components/Header/TopBar';
import { MainHeader } from './components/Header/MainHeader';
import { CategoryNav } from './components/Header/CategoryNav';
import { MobileNav } from './components/Header/MobileNav';
import { Footer } from './components/Footer/Footer';

// Drawers & Modals
import { CartDrawer } from './components/Cart/CartDrawer';
import { CategoriesDrawer } from './components/Categories/CategoriesDrawer';
import { PolicyModal } from './components/common/PolicyModal';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-[#252a34]">
      {/* Scroll to top immediately on route change */}
      <ScrollToTop />

      {/* 1. Header (HT Bazar Top Bar + Main Header + Category Nav) */}
      <TopBar onNavigateHome={handleNavigateHome} />

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
