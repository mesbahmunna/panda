import React, { useState } from 'react';
import {
  X,
  FolderPlus,
  Palette,
  Sparkles,
  Check
} from 'lucide-react';
import { Category } from '../../types/product';
import {
  CategoryIconView,
  AVAILABLE_ICONS,
  COLOR_PALETTES,
  DEFAULT_CATEGORY_THEMES
} from '../../components/Categories/CategoryIconView';

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
  
  // Icon and colors
  const defaultTheme = DEFAULT_CATEGORY_THEMES[category?.slug || ''] || COLOR_PALETTES[0];
  const [icon, setIcon] = useState<string>(category?.icon || defaultTheme.icon || 'Shirt');
  const [iconColor, setIconColor] = useState<string>(category?.iconColor || defaultTheme.iconColor);
  const [bgColor, setBgColor] = useState<string>(category?.bgColor || defaultTheme.bgColor);
  const [featured, setFeatured] = useState<boolean>(category?.featured ?? true);

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

  const handleSelectPalette = (palette: { iconColor: string; bgColor: string }) => {
    setIconColor(palette.iconColor);
    setBgColor(palette.bgColor);
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
      icon,
      iconColor,
      bgColor,
      description: description.trim(),
      featured
    };

    onSave(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
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
                Choose category icon, custom color theme, name, and URL slug
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Live Icon & Banner Preview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
            <CategoryIconView
              icon={icon}
              iconColor={iconColor}
              bgColor={bgColor}
              size="lg"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Category Preview
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {name || 'Category Name'}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {description || 'Category description will appear here'}
              </p>
            </div>
          </div>

          {/* Category Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Baby Clothing, Baby Feeding..."
                className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug (/category/...) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. baby-clothing"
                className="w-full text-xs font-mono py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Category Icon
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {AVAILABLE_ICONS.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0b0952] text-white shadow-md scale-105 ring-2 ring-[#0b0952]/30'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                    title={iconName}
                  >
                    <CategoryIconView
                      icon={iconName}
                      iconColor={isSelected ? '#FFFFFF' : iconColor}
                      bgColor="transparent"
                      size="sm"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Palette className="w-4 h-4 text-purple-600" />
              <span>Choose Icon & Background Color Theme</span>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {COLOR_PALETTES.map((pal) => {
                const isSelected = iconColor === pal.iconColor && bgColor === pal.bgColor;
                return (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => handleSelectPalette(pal)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'border-slate-800 ring-2 ring-slate-800/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: pal.iconColor }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span className="text-slate-700">{pal.name}</span>
                  </button>
                );
              })}
            </div>
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
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-end gap-2.5 shrink-0">
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
