import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Folder,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  UploadCloud,
  ImageIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import {
  getAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  resetCategoriesToDefault
} from '../services/categoryStorage';
import { Category } from '../../types/product';
import { CategoryFormModal } from '../components/CategoryFormModal';

interface OutletContextType {
  onOpenMobileMenu: () => void;
  pendingCount: number;
}

export const AdminCategoriesPage: React.FC = () => {
  const { onOpenMobileMenu, pendingCount } = useOutletContext<OutletContextType>();
  const [categories, setCategories] = useState<Category[]>(() => getAdminCategories());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const refreshCategories = () => {
    setCategories(getAdminCategories());
  };

  useEffect(() => {
    refreshCategories();
    window.addEventListener('baby_categories_updated', refreshCategories);
    return () => window.removeEventListener('baby_categories_updated', refreshCategories);
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setIsModalOpen(true);
  };

  const handleDelete = (c: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${c.name}"? Products under this category will need reassignment.`)) {
      deleteAdminCategory(c.id);
      refreshCategories();
    }
  };

  const handleSave = (saved: Category) => {
    saveAdminCategory(saved);
    refreshCategories();
  };

  const handleReset = () => {
    if (window.confirm('Reset all categories back to default baby store categories?')) {
      resetCategoriesToDefault();
      refreshCategories();
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Category Manager"
        subtitle={`Managing ${categories.length} store categories with custom cover banners`}
        onOpenMobileMenu={onOpenMobileMenu}
        pendingOrdersCount={pendingCount}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories by name or slug..."
              className="w-full text-xs py-2.5 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Category</span>
          </button>

        </div>

        {/* Categories Grid Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Folder className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No categories found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No categories match "{searchQuery}". Create a new category to organize products.
              </p>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-[#0b0952] text-white text-xs font-bold rounded-xl"
              >
                Create Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Cover Image</th>
                    <th className="py-3.5 px-4">Category Name & Slug</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-center">Items Count</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Cover Photo */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="font-bold text-slate-900 text-sm hover:underline text-left block"
                        >
                          {cat.name}
                        </button>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          /category/{cat.slug}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-[280px]">
                        <p className="line-clamp-2 text-xs">
                          {cat.description || 'No description added.'}
                        </p>
                      </td>

                      {/* Item Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs">
                          {cat.itemCount} items
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center">
                        {cat.featured !== false ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Standard</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Category Storefront Link */}
                          <Link
                            to={`/category/${cat.slug}`}
                            target="_blank"
                            title="View on Live Store"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit / Change Image */}
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            title="Edit Category & Change Image"
                            className="p-1.5 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(cat)}
                            title="Delete Category"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Reset Tool */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing {filteredCategories.length} categories</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore default demo categories</span>
          </button>
        </div>

      </main>

      {/* Category Modal */}
      {isModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
