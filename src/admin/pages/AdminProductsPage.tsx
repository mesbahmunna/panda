import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Layers,
  Palette,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import {
  getAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
  duplicateAdminProduct,
  resetProductsToDefault
} from '../services/productStorage';
import { Product } from '../../types/product';
import { categories } from '../../data/categories';
import { ProductFormModal } from '../components/ProductFormModal';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminProductsPage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [products, setProducts] = useState<Product[]>(() => getAdminProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const refreshProducts = () => {
    setProducts(getAdminProducts());
  };

  useEffect(() => {
    refreshProducts();
    window.addEventListener('baby_products_updated', refreshProducts);
    return () => window.removeEventListener('baby_products_updated', refreshProducts);
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    duplicateAdminProduct(p.id);
    refreshProducts();
  };

  const handleDelete = (p: Product) => {
    if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
      deleteAdminProduct(p.id);
      refreshProducts();
    }
  };

  const handleSave = (savedProduct: Product) => {
    saveAdminProduct(savedProduct);
    refreshProducts();
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to initial default products? Custom products will be restored.')) {
      resetProductsToDefault();
      refreshProducts();
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Products Catalog Manager"
        subtitle={`Managing ${products.length} products with variation and bundle matrix support`}
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full text-xs py-2.5 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Product</span>
            </button>
          </div>

        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No products match "{searchQuery}". Try a different keyword or create a new product.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-[#0b0952] text-white text-xs font-bold rounded-xl"
              >
                Add New Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Pricing & Discount</th>
                    <th className="py-3.5 px-4">Variations</th>
                    <th className="py-3.5 px-4">Bundle Tiers</th>
                    <th className="py-3.5 px-4">Badge</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const varCount = product.variationGroup?.options?.length || 0;
                    const bundleCount = product.bundleTiers?.length || 0;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* 1. Thumbnail & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 line-clamp-1 max-w-[240px]">
                                {product.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                /{product.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg text-[11px]">
                            {product.category}
                          </span>
                        </td>

                        {/* 3. Pricing */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">
                            ৳{product.price}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400 line-through">
                                ৳{product.originalPrice}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                                -{product.discountPercent}%
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 4. Variations */}
                        <td className="py-3.5 px-4">
                          {varCount > 0 ? (
                            <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-[11px] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 inline-flex">
                              <Palette className="w-3 h-3 shrink-0" />
                              <span>{varCount} Colors</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* 5. Bundle Tiers */}
                        <td className="py-3.5 px-4">
                          {bundleCount > 0 ? (
                            <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-flex">
                              <Layers className="w-3 h-3 shrink-0" />
                              <span>{bundleCount} Tiers (1-4 Pcs)</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* 6. Promotional Badge */}
                        <td className="py-3.5 px-4">
                          {product.badge ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-full uppercase">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Standard</span>
                          )}
                        </td>

                        {/* 7. Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Live Storefront Link */}
                            <Link
                              to={`/product/${product.slug}`}
                              target="_blank"
                              title="View on Storefront"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(product)}
                              title="Duplicate Product"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(product)}
                              title="Edit Product"
                              className="p-1.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(product)}
                              title="Delete Product"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Reset Tool */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing {filteredProducts.length} of {products.length} products in catalog</span>
          <button
            onClick={handleResetCatalog}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore default demo products</span>
          </button>
        </div>

      </main>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
