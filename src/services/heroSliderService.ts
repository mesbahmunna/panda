import slider1 from '../assets/banners/slider-1.jpg';
import slider2 from '../assets/banners/slider-2.jpg';
import slider3 from '../assets/banners/slider-3.jpg';

export interface HeroSlide {
  id: string;
  title: string;
  imageUrl: string;
  redirectUrl: string;
  target?: '_blank' | '_self';
  isActive: boolean;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'ব্যানার ১ - বেবি স্লিপিং ব্ল্যাঙ্কেট',
    imageUrl: slider1,
    redirectUrl: '/product/baby-sleeping-blanket-swaddle-wrap',
    target: '_self',
    isActive: true
  },
  {
    id: 'slide-2',
    title: 'ব্যানার ২ - বেবি কালেকশন',
    imageUrl: slider2,
    redirectUrl: '/category/baby-clothing',
    target: '_self',
    isActive: true
  },
  {
    id: 'slide-3',
    title: 'ব্যানার ৩ - বেবি কেয়ার ও অফার',
    imageUrl: slider3,
    redirectUrl: '/category/baby-care',
    target: '_self',
    isActive: true
  }
];

export const HERO_SLIDES_STORAGE_KEY = 'baby_hero_slides';

export const getHeroSlides = (): HeroSlide[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(HERO_SLIDES_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to get hero slides from localStorage', err);
  }
  return DEFAULT_HERO_SLIDES;
};

export const saveHeroSlides = (slides: HeroSlide[]): void => {
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new CustomEvent('baby_hero_slides_updated', { detail: slides }));
  } catch (err) {
    console.error('Failed to save hero slides to localStorage', err);
  }
};
