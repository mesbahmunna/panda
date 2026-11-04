import { Category } from '../types/product';
import { DEFAULT_CATEGORY_THEMES } from '../components/Categories/CategoryIconView';

export const categoryNameBanglaMap: Record<string, { name: string; description: string }> = {
  'baby-clothing': {
    name: 'বেবি পোশাক',
    description: '১০০% সুতি আরামদায়ক রম্পার, স্লিপস্যুট, টুপি ও কম্বল সেট'
  },
  'baby-feeding': {
    name: 'বেবি ফিডিং',
    description: 'অ্যান্টি-কলিক ফিডার, ফুড-গ্রেড সিলিকন বাটি ও চামচ সেট'
  },
  'baby-care': {
    name: 'বেবি কেয়ার',
    description: 'শব্দহীন নেইল ট্রিমার, লোশন, র‍্যাশ ক্রিম ও বেবি ওয়াইপস'
  },
  'baby-toys': {
    name: 'বেবি খেলনা',
    description: 'টিথিং টয়, সংবেদনশীল র‍্যাটল ও শিক্ষণীয় খেলনা সামগ্রী'
  },
  'baby-bath-hygiene': {
    name: 'গোসল ও হাইজিন',
    description: 'আরামদায়ক ফোল্ডিং বাথটাব, বেবি ওয়াশ ও নরম হুডেড তোয়ালে'
  },
  'baby-accessories': {
    name: 'বেবি এক্সেসরিজ',
    description: 'মাল্টি-পকেট ডায়াপার ব্যাগ, বেবি ক্যারিয়ার ও আরামদায়ক ব্ল্যাঙ্কেট'
  },
  'baby-safety': {
    name: 'বেবি সেফটি',
    description: 'সিলিকন কর্নার গার্ড, সকেট প্রটেক্টর ও সেফটি লক'
  },
  'mother-baby-essentials': {
    name: 'মা ও শিশুর যত্ন',
    description: 'ইলেকট্রিক ব্রেস্ট পাম্প, মেটারনিটি পিলো ও প্রসবোত্তর কেয়ার কিট'
  }
};

export const englishToBanglaCategoryMap: Record<string, string> = {
  'baby clothing': 'বেবি পোশাক',
  'baby feeding': 'বেবি ফিডিং',
  'baby care': 'বেবি কেয়ার',
  'baby toys': 'বেবি খেলনা',
  'baby bath & hygiene': 'গোসল ও হাইজিন',
  'baby bath': 'গোসল ও হাইজিন',
  'baby accessories': 'বেবি এক্সেসরিজ',
  'baby safety': 'বেবি সেফটি',
  'mother & baby essentials': 'মা ও শিশুর যত্ন'
};

export const getCategoryDisplayName = (nameOrSlug: string): string => {
  if (!nameOrSlug) return '';
  const lower = nameOrSlug.toLowerCase().trim();
  if (categoryNameBanglaMap[lower]) {
    return categoryNameBanglaMap[lower].name;
  }
  if (englishToBanglaCategoryMap[lower]) {
    return englishToBanglaCategoryMap[lower];
  }
  return nameOrSlug;
};

export const initialCategories: Category[] = [
  {
    id: 'cat-clothing',
    name: 'বেবি পোশাক',
    slug: 'baby-clothing',
    icon: 'Shirt',
    iconColor: '#E11D48',
    bgColor: '#FFE4E6',
    description: '১০০% সুতি আরামদায়ক রম্পার, স্লিপস্যুট, টুপি ও কম্বল সেট'
  },
  {
    id: 'cat-feeding',
    name: 'বেবি ফিডিং',
    slug: 'baby-feeding',
    icon: 'Milk',
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    description: 'অ্যান্টি-কলিক ফিডার, ফুড-গ্রেড সিলিকন বাটি ও চামচ সেট'
  },
  {
    id: 'cat-care',
    name: 'বেবি কেয়ার',
    slug: 'baby-care',
    icon: 'HeartPulse',
    iconColor: '#059669',
    bgColor: '#D1FAE5',
    description: 'শব্দহীন নেইল ট্রিমার, লোশন, র‍্যাশ ক্রিম ও বেবি ওয়াইপস'
  },
  {
    id: 'cat-toys',
    name: 'বেবি খেলনা',
    slug: 'baby-toys',
    icon: 'Smile',
    iconColor: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'টিথিং টয়, সংবেদনশীল র‍্যাটল ও শিক্ষণীয় খেলনা সামগ্রী'
  },
  {
    id: 'cat-bath',
    name: 'গোসল ও হাইজিন',
    slug: 'baby-bath-hygiene',
    icon: 'Bath',
    iconColor: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'আরামদায়ক ফোল্ডিং বাথটাব, বেবি ওয়াশ ও নরম হুডেড তোয়ালে'
  },
  {
    id: 'cat-accessories',
    name: 'বেবি এক্সেসরিজ',
    slug: 'baby-accessories',
    icon: 'ShoppingBag',
    iconColor: '#D97706',
    bgColor: '#FEF3C7',
    description: 'মাল্টি-পকেট ডায়াপার ব্যাগ, বেবি ক্যারিয়ার ও আরামদায়ক ব্ল্যাঙ্কেট'
  },
  {
    id: 'cat-safety',
    name: 'বেবি সেফটি',
    slug: 'baby-safety',
    icon: 'ShieldCheck',
    iconColor: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'সিলিকন কর্নার গার্ড, সকেট প্রটেক্টর ও সেফটি লক'
  },
  {
    id: 'cat-mother',
    name: 'মা ও শিশুর যত্ন',
    slug: 'mother-baby-essentials',
    icon: 'HeartHandshake',
    iconColor: '#4F46E5',
    bgColor: '#E0E7FF',
    description: 'ইলেকট্রিক ব্রেস্ট পাম্প, মেটারনিটি পিলো ও প্রসবোত্তর কেয়ার কিট'
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
      // Auto-translate if English defaults were stored
      const mappedBangla = categoryNameBanglaMap[c.slug];
      const displayName = mappedBangla ? mappedBangla.name : getCategoryDisplayName(c.name);
      const displayDesc = mappedBangla && (!c.description || c.description.includes('Organic') || c.description.includes('Anti-colic'))
        ? mappedBangla.description
        : c.description;

      return {
        ...c,
        name: displayName,
        description: displayDesc,
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
