import { Category } from '../types/product';
import { DEFAULT_CATEGORY_THEMES } from '../components/Categories/CategoryIconView';

export const initialCategories: Category[] = [
  {
    id: 'cat-clothing',
    name: 'Baby Clothing',
    slug: 'baby-clothing',
    icon: 'Shirt',
    iconColor: '#E11D48',
    bgColor: '#FFE4E6',
    description: '100% Organic cotton rompers, sleepsuits, mittens & sets'
  },
  {
    id: 'cat-feeding',
    name: 'Baby Feeding',
    slug: 'baby-feeding',
    icon: 'Milk',
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'Anti-colic bottles, silicone bowls, bibs & sterilizers'
  },
  {
    id: 'cat-care',
    name: 'Baby Care',
    slug: 'baby-care',
    icon: 'HeartPulse',
    iconColor: '#059669',
    bgColor: '#D1FAE5',
    description: 'Gentle moisturizers, rash creams, wet wipes & manicure kits'
  },
  {
    id: 'cat-toys',
    name: 'Baby Toys',
    slug: 'baby-toys',
    icon: 'Smile',
    iconColor: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'Teething toys, developmental rattles, sensory mats & plushies'
  },
  {
    id: 'cat-bath',
    name: 'Baby Bath & Hygiene',
    slug: 'baby-bath-hygiene',
    icon: 'Bath',
    iconColor: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'Ergonomic bathtubs, organic tearless wash, soft hooded towels'
  },
  {
    id: 'cat-accessories',
    name: 'Baby Accessories',
    slug: 'baby-accessories',
    icon: 'ShoppingBag',
    iconColor: '#D97706',
    bgColor: '#FEF3C7',
    description: 'Multi-pocket diaper bags, ergonomic baby carriers & blankets'
  },
  {
    id: 'cat-safety',
    name: 'Baby Safety',
    slug: 'baby-safety',
    icon: 'ShieldCheck',
    iconColor: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'Silicone corner guards, socket safety covers, bed rails & monitors'
  },
  {
    id: 'cat-mother',
    name: 'Mother & Baby Essentials',
    slug: 'mother-baby-essentials',
    icon: 'HeartHandshake',
    iconColor: '#4F46E5',
    bgColor: '#E0E7FF',
    description: 'Electric breast pumps, maternity pillows & postpartum care kits'
  }
];

export const getStoredCategories = (): Category[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_categories') : null;
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
  } catch {}
  return initialCategories;
};

export const categories: Category[] = getStoredCategories();

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const current = getStoredCategories();
  return current.find((c) => c.slug === slug);
};

export const getCategoryProductCount = (categorySlug: string): number => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_products') : null;
    let list: any[] = [];
    if (raw) {
      list = JSON.parse(raw);
    }
    if (!Array.isArray(list) || list.length === 0) {
      // Fallback to checking localStorage or return count from active products
      return 0;
    }
    return list.filter((p) => p.categorySlug === categorySlug || p.category?.toLowerCase() === categorySlug.toLowerCase()).length;
  } catch {
    return 0;
  }
};
