import { Product } from '../../types/product';
import { products as initialProducts } from '../../data/products';

const PRODUCTS_KEY = 'baby_admin_products';

export const getAdminProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to get products from storage', err);
    return initialProducts;
  }
};

export const getAdminProductById = (id: string): Product | undefined => {
  const all = getAdminProducts();
  return all.find((p) => p.id === id || p.slug === id);
};

export const saveAdminProduct = (product: Product): Product => {
  const current = getAdminProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];

  if (index > -1) {
    // Update existing
    updated = [...current];
    updated[index] = product;
  } else {
    // Add new product to top
    updated = [product, ...current];
  }

  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_products_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save product', err);
  }

  return product;
};

export const deleteAdminProduct = (id: string): void => {
  const current = getAdminProducts();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_products_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete product', err);
  }
};

export const duplicateAdminProduct = (id: string): Product | undefined => {
  const current = getAdminProducts();
  const target = current.find((p) => p.id === id);
  if (!target) return undefined;

  const newId = `prod-${Date.now()}`;
  const newSlug = `${target.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
  const duplicated: Product = {
    ...target,
    id: newId,
    slug: newSlug,
    name: `${target.name} (Copy)`
  };

  saveAdminProduct(duplicated);
  return duplicated;
};

export const resetProductsToDefault = (): void => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    window.dispatchEvent(new CustomEvent('baby_products_updated', { detail: initialProducts }));
  } catch (err) {
    console.error('Failed to reset products', err);
  }
};
