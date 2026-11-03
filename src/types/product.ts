export interface ProductBundleTier {
  id: string;
  pieces: number; // e.g. 1, 2, 4, 8
  title: string;  // e.g. "1 Pcs", "2 Pcs", "4 Pcs", "8 Pcs"
  price: number;  // bundle price e.g. 100, 200, 400, 800
  originalPrice?: number;
  badge?: string; // e.g. "Regular", "Popular", "Best Value", "Save ৳50"
}

export interface ProductVariationOption {
  id: string;
  name: string; // e.g. "1 Year", "2 Year", "3 Year" or "Chocolate Brown"
  price?: number;
  imageIndex?: number;
}

export interface ProductVariationGroup {
  name: string; // e.g. "Select Age" or "Size"
  options: ProductVariationOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  features: string[];
  specifications: { [key: string]: string };
  isBestSeller?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isRecommended?: boolean;
  ageRange?: string;
  badge?: string;
  bundleTiers?: ProductBundleTier[];
  variationGroup?: ProductVariationGroup;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
  itemCount?: number;
  description: string;
  featured?: boolean;
}
