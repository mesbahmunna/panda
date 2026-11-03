import { Category } from '../../types/product';
import { initialCategories } from '../../data/categories';

const CATEGORIES_KEY = 'baby_admin_categories';

export const getAdminCategories = (): Category[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CATEGORIES_KEY) : null;
    if (!raw) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
      }
      return initialCategories;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
      }
      return initialCategories;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to get categories from storage', err);
    return initialCategories;
  }
};

export const getAdminCategoryById = (id: string): Category | undefined => {
  const all = getAdminCategories();
  return all.find((c) => c.id === id || c.slug === id);
};

export const saveAdminCategory = (category: Category): Category => {
  const current = getAdminCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: Category[];

  if (index > -1) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }

  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_categories_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save category', err);
  }

  return category;
};

export const deleteAdminCategory = (id: string): void => {
  const current = getAdminCategories();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_categories_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete category', err);
  }
};

export const resetCategoriesToDefault = (): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
    window.dispatchEvent(new CustomEvent('baby_categories_updated', { detail: initialCategories }));
  } catch (err) {
    console.error('Failed to reset categories', err);
  }
};
