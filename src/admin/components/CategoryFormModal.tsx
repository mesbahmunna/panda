import React, { useState, useRef } from 'react';
import {
  X,
  FolderPlus,
  UploadCloud,
  ImageIcon,
  Loader2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Category } from '../../types/product';
import { uploadImageFile } from '../services/imageUpload';

interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  category,
  onClose,
  onSave
}) => {
  const isEditing = !!category;

  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [itemCount, setItemCount] = useState<number>(category?.itemCount || 20);
  const [image, setImage] = useState(
    category?.image ||
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80'
  );
  const [featured, setFeatured] = useState<boolean>(category?.featured ?? true);

  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageFile(file);
      setImage(uploadedUrl);
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `cat-${Date.now()}`;

    const newCategory: Category = {
      id: category?.id || `cat-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      image: image.trim() || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
      description: description.trim(),
      itemCount: Number(itemCount) || 0,
      featured
    };

    onSave(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Modal Header */}
        <div className="bg-[#0b0952] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
              <FolderPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h2>
              <p className="text-white/60 text-xs">
                Manage name, URL slug, banner photo, and description
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Category Name & Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Baby Winter Collection, Baby Toys..."
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug (/category/...) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. baby-winter-collection"
                className="w-full text-xs font-mono py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Item Count
              </label>
              <input
                type="number"
                min="0"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Category Image Upload */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Category Cover Image *
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlInput ? 'Hide URL' : 'Use URL'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border border-slate-300 overflow-hidden bg-white shrink-0 relative flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-2.5 px-3 bg-[#0b0952] hover:bg-[#120f66] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  <span>{isUploading ? 'Uploading Image...' : 'Choose Image to Upload'}</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Recommended size: 600×600 px (JPG, PNG, WEBP)
                </p>
              </div>
            </div>

            {showUrlInput && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualUrl.trim()) {
                      setImage(manualUrl.trim());
                      setManualUrl('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description / Subtitle
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 100% Organic cotton rompers, sleepsuits, mittens & sets"
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          {/* Featured on Homepage */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Display as Featured Category on Homepage Grid & Nav
              </span>
            </label>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs font-bold text-[#0b0952] bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md transition-all active:scale-95"
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>

      </div>
    </div>
  );
};
