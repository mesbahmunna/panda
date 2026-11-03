import { Category } from '../../types/product';
import { initialCategories } from '../../data/categories';
import { DEFAULT_CATEGORY_THEMES } from '../../components/Categories/CategoryIconView';

const CATEGORIES_KEY = 'baby_admin_categories';

export const getAdminCategories = (): Category[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CATEGORIES_KEY) : null;
    let list: Category[] = initialCategories;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.map((c) => {
      const defaultTheme = DEFAULT_CATEGORY_THEMES[c.slug] || {
        icon: 'Folder',
        iconColor: '#4F46E5',
        bgColor: '#EEF2FF'
      };
      return {
        ...c,
        icon: c.icon || defaultTheme.icon,
        iconColor: c.iconColor || defaultTheme.iconColor,
        bgColor: c.bgColor || defaultTheme.bgColor
      };
    });
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
