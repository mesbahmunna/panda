import React from 'react';
import {
  Shirt,
  Baby,
  Milk,
  Utensils,
  HeartPulse,
  Heart,
  Sparkles,
  Smile,
  Gamepad2,
  Droplets,
  Bath,
  ShoppingBag,
  Package,
  ShieldCheck,
  Sun,
  HeartHandshake,
  Gift,
  Star,
  Folder
} from 'lucide-react';
import { Category } from '../../types/product';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shirt,
  Baby,
  Milk,
  Utensils,
  HeartPulse,
  Heart,
  Sparkles,
  Smile,
  Gamepad2,
  Droplets,
  Bath,
  ShoppingBag,
  Package,
  ShieldCheck,
  Sun,
  HeartHandshake,
  Gift,
  Star,
  Folder
};

export const DEFAULT_CATEGORY_THEMES: Record<
  string,
  { icon: string; iconColor: string; bgColor: string }
> = {
  'baby-clothing': { icon: 'Shirt', iconColor: '#E11D48', bgColor: '#FFE4E6' },       // Rose/Pink
  'baby-feeding': { icon: 'Milk', iconColor: '#0284C7', bgColor: '#E0F2FE' },         // Sky Blue
  'baby-care': { icon: 'HeartPulse', iconColor: '#059669', bgColor: '#D1FAE5' },      // Emerald
  'baby-toys': { icon: 'Smile', iconColor: '#7C3AED', bgColor: '#EDE9FE' },          // Purple/Violet
  'baby-bath-hygiene': { icon: 'Bath', iconColor: '#0891B2', bgColor: '#CFFAFE' },   // Cyan/Aqua
  'baby-accessories': { icon: 'ShoppingBag', iconColor: '#D97706', bgColor: '#FEF3C7' }, // Amber
  'baby-safety': { icon: 'ShieldCheck', iconColor: '#DC2626', bgColor: '#FEE2E2' },   // Coral Red
  'mother-baby-essentials': { icon: 'HeartHandshake', iconColor: '#4F46E5', bgColor: '#E0E7FF' } // Indigo
};

export const AVAILABLE_ICONS = [
  'Shirt',
  'Baby',
  'Milk',
  'Utensils',
  'HeartPulse',
  'Heart',
  'Smile',
  'Sparkles',
  'Gamepad2',
  'Bath',
  'Droplets',
  'ShoppingBag',
  'Package',
  'ShieldCheck',
  'Sun',
  'HeartHandshake',
  'Gift',
  'Star'
];

export const COLOR_PALETTES = [
  { name: 'Rose', iconColor: '#E11D48', bgColor: '#FFE4E6' },
  { name: 'Sky Blue', iconColor: '#0284C7', bgColor: '#E0F2FE' },
  { name: 'Emerald', iconColor: '#059669', bgColor: '#D1FAE5' },
  { name: 'Purple', iconColor: '#7C3AED', bgColor: '#EDE9FE' },
  { name: 'Cyan', iconColor: '#0891B2', bgColor: '#CFFAFE' },
  { name: 'Amber', iconColor: '#D97706', bgColor: '#FEF3C7' },
  { name: 'Coral Red', iconColor: '#DC2626', bgColor: '#FEE2E2' },
  { name: 'Indigo', iconColor: '#4F46E5', bgColor: '#E0E7FF' },
  { name: 'Pink', iconColor: '#DB2777', bgColor: '#FCE7F3' },
  { name: 'Teal', iconColor: '#0D9488', bgColor: '#CCFBF1' }
];

interface CategoryIconViewProps {
  category?: Partial<Category>;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CategoryIconView: React.FC<CategoryIconViewProps> = ({
  category,
  icon,
  iconColor,
  bgColor,
  size = 'md',
  className = ''
}) => {
  const slug = category?.slug || '';
  const defaultTheme = DEFAULT_CATEGORY_THEMES[slug] || {
    icon: 'Folder',
    iconColor: '#4F46E5',
    bgColor: '#EEF2FF'
  };

  const finalIconName = icon || category?.icon || defaultTheme.icon;
  const finalIconColor = iconColor || category?.iconColor || defaultTheme.iconColor;
  const finalBgColor = bgColor || category?.bgColor || defaultTheme.bgColor;

  const IconComponent = ICON_MAP[finalIconName] || Folder;

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl'
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: finalBgColor,
        color: finalIconColor
      }}
    >
      <IconComponent className={iconSizes[size]} />
    </div>
  );
};
