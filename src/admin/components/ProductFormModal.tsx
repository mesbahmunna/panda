import React, { useState, useRef } from 'react';
import {
  X,
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Sparkles,
  Check,
  Palette,
  Percent,
  ListPlus,
  UploadCloud,
  Star,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';
import { Product, ProductBundleTier, ProductVariationOption } from '../../types/product';
import { getStoredCategories } from '../../data/categories';
import { uploadImageFile } from '../services/imageUpload';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const isEditing = !!product;
  const categoryList = getStoredCategories();

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || categoryList[0]?.name || 'Baby Clothing');
  const [price, setPrice] = useState<number>(product?.price || 450);
  const [originalPrice, setOriginalPrice] = useState<number>(product?.originalPrice || 650);
  const [badge, setBadge] = useState<string>(product?.badge || '');
  
  // Images state
  const [thumbnail, setThumbnail] = useState(
    product?.thumbnail || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.thumbnail ? [product.thumbnail] : []
  );
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const variationFileInputRef = useRef<HTMLInputElement>(null);
  const [targetVariationId, setTargetVariationId] = useState<string | null>(null);

  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  
  // Features list
  const [features, setFeatures] = useState<string[]>(
    product?.features && product.features.length > 0
      ? product.features
      : ['১০০% নরম ও আরামদায়ক ফেব্রিক', 'শিশুর ত্বকের জন্য সম্পূর্ণ নিরাপদ', 'সহজে পরিষ্কার ও ওয়াশ করা যায়']
  );
  const [newFeature, setNewFeature] = useState('');

  // Variations
  const [hasVariations, setHasVariations] = useState<boolean>(!!product?.variationGroup?.options?.length);
  const [variationGroupName, setVariationGroupName] = useState<string>(
    product?.variationGroup?.name || 'কালার পছন্দ করুন (Select Color)'
  );
  const [variationOptions, setVariationOptions] = useState<ProductVariationOption[]>(
    product?.variationGroup?.options || [
      { id: 'var-1', name: 'চকলেট ব্রাউন (Chocolate Brown)', imageIndex: 0 },
      { id: 'var-2', name: 'সফট পিঙ্ক (Soft Pink)', imageIndex: 1 }
    ]
  );
  const [newVarName, setNewVarName] = useState('');

  // Tiered Bundles
  const [hasBundles, setHasBundles] = useState<boolean>(!!product?.bundleTiers?.length);
  const [bundleTiers, setBundleTiers] = useState<ProductBundleTier[]>(
    product?.bundleTiers && product.bundleTiers.length > 0
      ? product.bundleTiers
      : [
          { id: 'b-1', pieces: 1, title: '১ পিছ (1 Pcs)', price: 450, originalPrice: 650, badge: 'নিয়মিত প্যাক' },
          { id: 'b-2', pieces: 2, title: '২ পিছ (2 Pcs)', price: 800, originalPrice: 900, badge: 'জনপ্রিয় (Save ৳100)' },
          { id: 'b-3', pieces: 3, title: '৩ পিছ (3 Pcs)', price: 1150, originalPrice: 1350, badge: 'সেরা অফার (Save ৳200)' },
          { id: 'b-4', pieces: 4, title: '৪ পিছ (4 Pcs)', price: 1500, originalPrice: 1800, badge: 'মেগা সেভার (Save ৳300)' }
        ]
  );

  // Auto calculate discount percentage
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Upload Thumbnail Handler
  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingThumb(true);
      const uploadedUrl = await uploadImageFile(file);
      setThumbnail(uploadedUrl);
      if (!galleryImages.includes(uploadedUrl)) {
        setGalleryImages([uploadedUrl, ...galleryImages]);
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  // Upload Multiple Gallery Images Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingGallery(true);
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map((file) => uploadImageFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      setGalleryImages((prev) => {
        const next = [...prev, ...uploadedUrls];
        if (!thumbnail && next.length > 0) {
          setThumbnail(next[0]);
        }
        return next;
      });
    } catch (err) {
      alert('Failed to upload gallery images.');
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Upload Specific Image for a Variation Color
  const handleVariationImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetVariationId) return;

    try {
      const uploadedUrl = await uploadImageFile(file);
      // Append to gallery images
      const nextGallery = [...galleryImages, uploadedUrl];
      setGalleryImages(nextGallery);
      const newIndex = nextGallery.length - 1;

      // Map to the variation option
      setVariationOptions((prev) =>
        prev.map((v) => (v.id === targetVariationId ? { ...v, imageIndex: newIndex } : v))
      );
    } catch (err) {
      alert('Failed to upload variation image.');
    } finally {
      setTargetVariationId(null);
      if (variationFileInputRef.current) variationFileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (manualImageUrl.trim()) {
      const url = manualImageUrl.trim();
      setGalleryImages((prev) => [...prev, url]);
      if (!thumbnail) setThumbnail(url);
      setManualImageUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const removedUrl = galleryImages[index];
    const next = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(next);
    if (thumbnail === removedUrl) {
      setThumbnail(next[0] || '');
    }
  };

  const handleSetAsThumbnail = (url: string) => {
    setThumbnail(url);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddVariationOption = () => {
    if (newVarName.trim()) {
      setVariationOptions([
        ...variationOptions,
        {
          id: `var-${Date.now()}`,
          name: newVarName.trim(),
          imageIndex: Math.min(variationOptions.length, Math.max(0, galleryImages.length - 1))
        }
      ]);
      setNewVarName('');
    }
  };

  const handleRemoveVariationOption = (id: string) => {
    setVariationOptions(variationOptions.filter((v) => v.id !== id));
  };

  const handleBundlePriceChange = (pieces: number, newPrice: number) => {
    setBundleTiers((prev) =>
      prev.map((b) => {
        if (b.pieces === pieces) {
          const expectedRegular = price * pieces;
          const savings = expectedRegular - newPrice;
          return {
            ...b,
            price: newPrice,
            originalPrice: expectedRegular,
            badge: savings > 0 ? `Save ৳${savings}` : 'Standard'
          };
        }
        return b;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product title');
      return;
    }

    const matchedCat = categoryList.find((c) => c.name === category);
    const categorySlug = matchedCat ? matchedCat.slug : category.toLowerCase().replace(/\s+/g, '-');

    const finalGallery = galleryImages.length > 0 ? galleryImages : [thumbnail];
    const finalThumb = thumbnail || finalGallery[0];
    const finalSlug = product?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`;

    const updatedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      category,
      categorySlug,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent,
      thumbnail: finalThumb,
      images: finalGallery,
      shortDescription: shortDescription.trim() || name.trim(),
      description: description.trim() || shortDescription.trim() || name.trim(),
      features,
      specifications: product?.specifications || {
        'Category': category,
        'Brand': 'Baby Panda',
        'Delivery Time': 'Inside Dhaka 24-48 Hours, Outside Dhaka 2-3 Days',
        'Payment': 'Cash on Delivery (COD)'
      },
      badge: badge.trim() || undefined,
      isBestSeller: badge === 'BEST SELLER',
      isTrending: badge === 'HOT DEAL',
      isNewArrival: badge === 'NEW ARRIVAL',
      variationGroup: hasVariations && variationOptions.length > 0
        ? {
            name: variationGroupName.trim() || 'Select Option',
            options: variationOptions
          }
        : undefined,
      bundleTiers: hasBundles && bundleTiers.length > 0 ? bundleTiers : undefined
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={thumbInputRef}
          accept="image/*"
          onChange={handleThumbUpload}
          className="hidden"
        />
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
        <input
          type="file"
          ref={variationFileInputRef}
          accept="image/*"
          onChange={handleVariationImageUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="bg-[#0b0952] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
              <Package className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-white/60 text-xs">
                Upload product photos, set variations & configure tiered bundle discounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Basic Product Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Title (English / Bengali) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap"
                  className="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0b0952]"
                >
                  {categoryList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sale Price (৳ BDT) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">৳</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-sm font-bold pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0b0952]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Regular / Strike Price (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">৳</span>
                  <input
                    type="number"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full text-sm pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0b0952]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Promotional Tag / Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full text-sm py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0b0952]"
                >
                  <option value="">No Badge</option>
                  <option value="HOT DEAL">HOT DEAL 🔥</option>
                  <option value="POPULAR">POPULAR ⭐</option>
                  <option value="BEST SELLER">BEST SELLER 🏆</option>
                  <option value="NEW ARRIVAL">NEW ARRIVAL ✨</option>
                </select>
                {discountPercent > 0 && (
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                    Calculated Discount: {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Product Image Uploader */}
          <div className="space-y-4 p-4 sm:p-5 bg-blue-50/40 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Product Photos & Image Upload
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload photos directly from your phone / computer (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'Hide URL Box' : 'Add via URL'}</span>
              </button>
            </div>

            {/* Thumbnail and Multi-upload Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Main Thumbnail Upload Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Main Display Thumbnail *
                  </span>
                  <p className="text-[11px] text-slate-500 mb-3">
                    This is the primary cover image displayed on product cards.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 relative shrink-0 flex items-center justify-center">
                      {isUploadingThumb ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      ) : thumbnail ? (
                        <img
                          src={thumbnail}
                          alt="Main thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <button
                        type="button"
                        onClick={() => thumbInputRef.current?.click()}
                        disabled={isUploadingThumb}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{isUploadingThumb ? 'Uploading...' : 'Choose File to Upload'}</span>
                      </button>

                      <p className="text-[10px] text-slate-400 text-center">
                        Auto-optimized for instant mobile load
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Multi-Photo Upload Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Product Gallery Images
                  </span>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Upload multiple angles, packaging shots, and color views.
                  </p>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="w-full py-3 px-4 border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUploadingGallery ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{isUploadingGallery ? 'Processing Uploads...' : 'Upload Photos (Select Multiple)'}</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Hold Ctrl / Shift to select multiple photos at once
                  </p>
                </div>
              </div>

            </div>

            {/* Optional Manual URL Input */}
            {showUrlInput && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900"
                >
                  Add URL
                </button>
              </div>
            )}

            {/* Gallery Images Strip */}
            {galleryImages.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Uploaded Gallery Photos ({galleryImages.length})</span>
                  <span className="text-[11px] text-slate-500 font-normal">Click ★ to set as main thumbnail</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {galleryImages.map((imgUrl, idx) => {
                    const isMain = thumbnail === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-xl overflow-hidden border-2 bg-white aspect-square shadow-sm ${
                          isMain ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Photo Number Badge */}
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                          #{idx + 1}
                        </div>

                        {/* Main Star Badge */}
                        {isMain && (
                          <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            Main
                          </div>
                        )}

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetAsThumbnail(imgUrl)}
                              title="Set as Main Thumbnail"
                              className="p-1.5 bg-amber-400 text-[#0b0952] rounded-lg hover:bg-amber-500 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            title="Remove Photo"
                            className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Color / Option Variations Manager */}
          <div className="space-y-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Color / Option Variations
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariations}
                  onChange={(e) => setHasVariations(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-700">Enable Variations</span>
              </label>
            </div>

            {hasVariations && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Variation Label (e.g. "Select Color", "Select Age", "Size")
                  </label>
                  <input
                    type="text"
                    value={variationGroupName}
                    onChange={(e) => setVariationGroupName(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Variation Items with Photo Association & Upload */}
                <div className="space-y-2 pt-1">
                  {variationOptions.map((opt) => {
                    const mappedImg = galleryImages[opt.imageIndex ?? 0];
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between gap-3 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {/* Photo preview for this color */}
                          <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0 relative">
                            {mappedImg ? (
                              <img src={mappedImg} alt={opt.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">No Img</div>
                            )}
                          </div>

                          <span className="font-bold text-slate-800 truncate">{opt.name}</span>
                        </div>

                        {/* Change Image Mapping or Upload specifically for this variation */}
                        <div className="flex items-center gap-2">
                          {galleryImages.length > 0 && (
                            <select
                              value={opt.imageIndex ?? 0}
                              onChange={(e) => {
                                const newIdx = Number(e.target.value);
                                setVariationOptions(
                                  variationOptions.map((v) => (v.id === opt.id ? { ...v, imageIndex: newIdx } : v))
                                );
                              }}
                              className="text-[11px] py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700"
                            >
                              {galleryImages.map((_, i) => (
                                <option key={i} value={i}>
                                  Photo #{i + 1}
                                </option>
                              ))}
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setTargetVariationId(opt.id);
                              variationFileInputRef.current?.click();
                            }}
                            className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] flex items-center gap-1 border border-purple-200"
                            title="Upload image for this color"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Upload</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveVariationOption(opt.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add new variation input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddVariationOption();
                      }
                    }}
                    placeholder="Enter color name (e.g. চকলেট ব্রাউন / Chocolate Brown)"
                    className="flex-1 text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariationOption}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Option
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Tiered Bundle Pricing Matrix */}
          <div className="space-y-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Tiered Bundle Pricing Matrix (Quantity Offers)
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBundles}
                  onChange={(e) => setHasBundles(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-900">Enable Bundle Tiers</span>
              </label>
            </div>

            {hasBundles && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-amber-800">
                  Configure package discounts for 1 Pcs, 2 Pcs, 3 Pcs, and 4 Pcs bundles. Customer savings are automatically calculated and shown on product cards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((pcs) => {
                    const tier = bundleTiers.find((b) => b.pieces === pcs) || {
                      id: `tier-${pcs}`,
                      pieces: pcs,
                      title: `${pcs} Pcs`,
                      price: price * pcs,
                      originalPrice: price * pcs,
                      badge: pcs === 1 ? 'Regular' : 'Save'
                    };

                    const savings = price * pcs - tier.price;

                    return (
                      <div key={pcs} className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{pcs} Pcs Bundle</span>
                          {savings > 0 ? (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              Save ৳{savings}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Regular</span>
                          )}
                        </div>

                        <label className="block text-[11px] text-slate-500 mb-1">Bundle Price (৳)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleBundlePriceChange(pcs, Number(e.target.value))}
                          className="w-full text-xs font-bold py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Descriptions & Features */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ListPlus className="w-4 h-4 text-emerald-500" />
              Descriptions & Bullet Features
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description (Summary)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief high-impact product summary for cards..."
                className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description (Supports multi-paragraph Bengali/English)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full product overview, benefits, material details..."
                className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            {/* Bullet features */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bullet Features Checklist
              </label>
              <div className="space-y-2 mb-3">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="flex-1 text-slate-800">• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Add a bullet point feature..."
                  className="flex-1 text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs font-bold text-[#0b0952] bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md transition-all active:scale-95"
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </button>
        </div>

      </div>
    </div>
  );
};
