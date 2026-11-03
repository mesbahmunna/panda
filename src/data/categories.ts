import { Category } from '../types/product';

export const initialCategories: Category[] = [
  {
    id: 'cat-clothing',
    name: 'Baby Clothing',
    slug: 'baby-clothing',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
    itemCount: 48,
    description: '100% Organic cotton rompers, sleepsuits, mittens & sets'
  },
  {
    id: 'cat-feeding',
    name: 'Baby Feeding',
    slug: 'baby-feeding',
    image: 'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=600',
    itemCount: 36,
    description: 'Anti-colic bottles, silicone bowls, bibs & sterilizers'
  },
  {
    id: 'cat-care',
    name: 'Baby Care',
    slug: 'baby-care',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    itemCount: 42,
    description: 'Gentle moisturizers, rash creams, wet wipes & manicure kits'
  },
  {
    id: 'cat-toys',
    name: 'Baby Toys',
    slug: 'baby-toys',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    itemCount: 54,
    description: 'Teething toys, developmental rattles, sensory mats & plushies'
  },
  {
    id: 'cat-bath',
    name: 'Baby Bath & Hygiene',
    slug: 'baby-bath-hygiene',
    image: 'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=600&q=80',
    itemCount: 29,
    description: 'Ergonomic bathtubs, organic tearless wash, soft hooded towels'
  },
  {
    id: 'cat-accessories',
    name: 'Baby Accessories',
    slug: 'baby-accessories',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    itemCount: 31,
    description: 'Multi-pocket diaper bags, ergonomic baby carriers & blankets'
  },
  {
    id: 'cat-safety',
    name: 'Baby Safety',
    slug: 'baby-safety',
    image: 'https://images.unsplash.com/photo-1595347097560-69238724e7bd?auto=format&fit=crop&w=600&q=80',
    itemCount: 24,
    description: 'Silicone corner guards, socket safety covers, bed rails & monitors'
  },
  {
    id: 'cat-mother',
    name: 'Mother & Baby Essentials',
    slug: 'mother-baby-essentials',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    itemCount: 38,
    description: 'Electric breast pumps, maternity pillows & postpartum care kits'
  }
];

export const getStoredCategories = (): Category[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_categories') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return initialCategories;
};

export const categories: Category[] = getStoredCategories();

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const current = getStoredCategories();
  return current.find((c) => c.slug === slug);
};
