import { Product } from '../types/product';
import blanketBrown from '../assets/products/baby-sleeping-blanket/brown.jpeg';
import blanketPink from '../assets/products/baby-sleeping-blanket/pink.jpeg';
import blanketBlue from '../assets/products/baby-sleeping-blanket/blue.jpeg';
import blanketKhaki from '../assets/products/baby-sleeping-blanket/khaki.jpeg';

export const products: Product[] = [
  {
    id: 'prod-sleeping-blanket',
    name: 'বেবি স্লিপিং ব্ল্যাঙ্কেট - Baby Sleeping Blanket Swaddle Wrap',
    slug: 'baby-sleeping-blanket-swaddle-wrap',
    category: 'Baby Clothing',
    categorySlug: 'baby-clothing',
    price: 450,
    originalPrice: 650,
    discountPercent: 31,
    images: [
      blanketBrown,
      blanketPink,
      blanketBlue,
      blanketKhaki
    ],
    thumbnail: blanketBrown,
    shortDescription: 'শীতে আপনার শিশুর জন্য আরাম ও উষ্ণতার নিশ্চয়তা। চায়না থেকে আমদানিকৃত নরম ও মোলায়েম কাপড়ে তৈরি বেবি স্লিপিং ব্ল্যাঙ্কেট।',
    description: `আপনার প্রিয় সোনামণিকে শীতের ঠান্ডা আবহাওয়া থেকে সুরক্ষিত এবং উষ্ণ রাখতে নিয়ে এলো চায়না থেকে আমদানিকৃত প্রিমিয়াম কোয়ালিটির বেবি স্লিপিং ব্ল্যাঙ্কেট। নরম, মোলায়েম এবং তুলতুলে কাপড়ে তৈরি যা শিশুর কোমল ও সংবেদনশীল ত্বকের জন্য সম্পূর্ণ নিরাপদ।

সুন্দর কার্টুন র্যাবিট ডিজাইন এবং আরামদায়ক সোয়াডেল মোড়ক শিশুকে মায়ের কোলের মতো পরম উষ্ণতা ও প্রশান্তির অনুভূতি দেয়, যা শিশুকে নিশ্চিন্তে ঘুমাতে সাহায্য করে।

• শীতে রাখে আরামদায়ক গরম
• নরম ও মোলায়েম প্রিমিয়াম ফেব্রিক
• শিশুর ত্বকের জন্য শতভাগ নিরাপদ ও অ্যালার্জি-মুক্ত
• সহজে ধোয়া যায় (মেশিন বা হাতে ওয়াশ করা উপযোগী)
• চায়না থেকে সরাসরি আমদানিকৃত কোয়ালিটি নিশ্চয়তা`,
    features: [
      'শীতের দিনে শিশুকে পরম আরাম ও উষ্ণতায় সুরক্ষিত রাখে',
      'প্রিমিয়াম নরম ও মোলায়েম তুলতুলে ফ্লিচ ফেব্রিক',
      'শিশুর সংবেদনশীল ত্বকের জন্য ১০০% নিরাপদ ও পরিবেশবান্ধব',
      'চতুর খরগোশ কার্টুন এমব্রয়ডারি ও 3D পুতুল পা ডিজাইন',
      'মেশিন ও হ্যান্ড ওয়াশ উপযোগী - সহজে পরিষ্কার করা যায়',
      'চায়না থেকে সরাসরি আমদানিকৃত প্রিমিয়াম এক্সপোর্ট কোয়ালিটি'
    ],
    specifications: {
      'পণ্যের নাম': 'বেবি স্লিপিং ব্ল্যাঙ্কেট (Baby Sleeping Blanket)',
      'উপাদান (Material)': 'Ultra-Soft Coral Fleece / Premium Velvet Plush',
      'বয়স (Age Range)': 'Newborn to Infant (সোয়াডেল র্যাপ উপযোগী)',
      'সিজন (Season)': 'Winter & All-Season AC Room',
      'রঙ (Colors)': 'চকলেট ব্রাউন, সফট পিঙ্ক, স্কাই ব্লু, ওয়ার্ম খাকি',
      'ওয়াশ কেয়ার': 'মেশিন ওয়াশ ও হ্যান্ড ওয়াশ উপযোগী',
      'উৎপত্তি (Origin)': 'Imported Quality (চায়না থেকে আমদানিকৃত)'
    },
    isBestSeller: true,
    isTrending: true,
    isNewArrival: true,
    badge: 'HOT DEAL',
    variationGroup: {
      name: 'Select Color',
      options: [
        { id: 'c-brown', name: 'Chocolate Brown', imageIndex: 0 },
        { id: 'c-pink', name: 'Soft Pink', imageIndex: 1 },
        { id: 'c-blue', name: 'Sky Blue', imageIndex: 2 },
        { id: 'c-khaki', name: 'Warm Khaki', imageIndex: 3 }
      ]
    },
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '1 Pcs', price: 450, originalPrice: 650, badge: 'Standard' },
      { id: 'b-2', pieces: 2, title: '2 Pcs', price: 800, originalPrice: 1300, badge: 'Save ৳100' },
      { id: 'b-3', pieces: 3, title: '3 Pcs', price: 1150, originalPrice: 1950, badge: 'Save ৳200' },
      { id: 'b-4', pieces: 4, title: '4 Pcs', price: 1500, originalPrice: 2600, badge: 'Save ৳300' }
    ]
  },
  {
    id: 'prod-1',
    name: 'Smart Baby Electric Nail Trimmer with LED Light (6 Grinding Heads)',
    slug: 'smart-baby-electric-nail-trimmer-led',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 890,
    originalPrice: 1550,
    discountPercent: 43,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Whisper-quiet baby nail filer with soft LED night light. Safely trims delicate baby nails without cutting sensitive cuticles.',
    description: `The Smart Baby Electric Nail Trimmer is an essential parenting gadget designed to eliminate the anxiety of clipping tiny, soft baby fingernails. Equipped with a whisper-quiet motor (less than 35dB) and a built-in soft front LED light, you can easily groom your baby's nails even while they sleep peacefully without waking them.

Includes 6 cushioned color-coded grinding heads designed for different baby development stages from newborn (0-3 months) up to toddlers, plus adult attachment heads for mommy and daddy! Dual-speed rotation settings and bidirectional rotation ensure clean, snag-free edges every single time.`,
    features: [
      'Whisper-quiet motor (<35dB) won’t wake sleeping babies',
      'Built-in soft LED light for precise night trimming',
      '6 cushioned sandpaper heads tailored for 0m to adult',
      'Dual speed & bidirectional 360° rotation switch',
      'Ergonomic, lightweight slip-resistant grip',
      'Operates on 2 AA batteries with safety auto-stop sensor'
    ],
    specifications: {
      'Material': 'Non-toxic ABS Plastic & Medical-Grade Silicone',
      'Age Range': '0 Months to 3+ Years (Includes Adult Attachments)',
      'Noise Level': 'Under 35 dB (Ultra Silent)',
      'Power Source': '2x AA Batteries (Not Included)',
      'Dimensions': '13.2 cm x 4.2 cm',
      'Certification': 'CE, RoHS, FDA Approved Materials',
      'Country of Origin': 'Imported Quality Grade'
    },
    isBestSeller: true,
    isTrending: true,
    badge: 'POPULAR'
  },
  {
    id: 'prod-2',
    name: 'Food-Grade Silicone Suction Feeding Set - 8 Pcs Complete Weaning Kit',
    slug: 'silicone-suction-baby-feeding-set-8pcs',
    category: 'Baby Feeding',
    categorySlug: 'baby-feeding',
    price: 1450,
    originalPrice: 2200,
    discountPercent: 34,
    images: [
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=600&q=80',
    shortDescription: '100% Food-grade silicone divided suction plate, spill-proof suction bowl, soft spoon & fork set, adjustable bib and snack cup.',
    description: `Make your baby's weaning journey mess-free and delightful with our Complete 8-Piece Food-Grade Silicone Baby Feeding Set. Engineered with ultra-strong suction bases on both the divided plate and the deep bowl, curious little hands won't be able to flip or fling their food across the dining table or high chair.

Crafted from 100% premium Platinum Silicone that is completely BPA, PVC, Phthalate, and Lead-free. Microwave safe, freezer friendly, and dishwasher safe for effortless cleaning for busy parents.`,
    features: [
      'Super-grip suction base sticks firmly to highchair trays and tables',
      '100% Platinum food-grade silicone (BPA, PVC & Phthalate free)',
      'Microwave safe up to 220°C and freezer safe down to -40°C',
      'Deep catcher bib with 4 adjustable neck buttons',
      'Gentle silicone spoon and fork protect tender gums',
      'Includes spill-proof collapsible snack cup with dust lid'
    ],
    specifications: {
      'Material': '100% Platinum Food-Grade Silicone & Natural Beechwood',
      'Age Range': '6 Months to 4 Years',
      'Heat Resistance': '-40°C to 220°C',
      'Cleaning': 'Dishwasher Safe / Boil Sterilizable',
      'Items in Pack': '8 Pieces (Plate, Bowl, Bib, Spoon, Fork, Sippy Cup, Snack Lid)',
      'Safety Standards': 'LFGB & FDA Certified Food Contact Safe'
    },
    isBestSeller: true,
    isTrending: true,
    badge: 'WEANING SET'
  },
  {
    id: 'prod-3',
    name: '100% Organic Bamboo Cotton Baby Romper & Sleepsuit Set',
    slug: 'organic-bamboo-baby-swaddle-pack-of-3',
    category: 'Baby Clothing',
    categorySlug: 'baby-clothing',
    price: 450,
    originalPrice: 750,
    discountPercent: 40,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Silky smooth, ultra-breathable organic bamboo cotton suit. Gentle on delicate baby skin with both age variations and money-saving bundle packs.',
    description: `Wrap your precious child in clouds of unmatched comfort with our luxurious Organic Bamboo Cotton Baby Suit. The proprietary bamboo-cotton blend offers superior thermoregulation, keeping toddlers cool during hot summer days and cozy during air-conditioned nights.

Available in age-calibrated sizing (1 Year, 2 Year, 3 Year) and money-saving quantity bundle packs (1 Pcs, 2 Pcs, 4 Pcs, 8 Pcs) designed for maximum savings!`,
    features: [
      '70% silky Bamboo Rayon + 30% Certified Organic Cotton',
      'Soft 2-way safety zipper with neck chin protection guard',
      'Pre-washed softness that gets softer with every laundry cycle',
      'Breathable hypoallergenic weave prevents rashes and overheating',
      'Non-toxic organic dye prints safe for chewing'
    ],
    specifications: {
      'Fabric': '70% Bamboo Rayon, 30% Organic Cotton Muslin',
      'Available Sizes': '1 Year, 2 Year, 3 Year',
      'Care': 'Machine wash cold on gentle cycle, tumble dry low'
    },
    isBestSeller: true,
    isRecommended: true,
    badge: 'BUNDLE & SIZES',
    variationGroup: {
      name: 'Select Age',
      options: [
        { id: 'v-1y', name: '1 Year' },
        { id: 'v-2y', name: '2 Year' },
        { id: 'v-3y', name: '3 Year' }
      ]
    },
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '1 Pcs', price: 450, originalPrice: 650, badge: 'Standard' },
      { id: 'b-2', pieces: 2, title: '2 Pcs', price: 850, originalPrice: 1300, badge: 'Save ৳50' },
      { id: 'b-4', pieces: 4, title: '4 Pcs', price: 1600, originalPrice: 2600, badge: 'Most Popular' },
      { id: 'b-8', pieces: 8, title: '8 Pcs', price: 3000, originalPrice: 5200, badge: 'Super Saver' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Portable USB Rechargeable White Noise Machine & Nursery Night Light',
    slug: 'portable-baby-white-noise-sound-machine',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 1250,
    originalPrice: 1990,
    discountPercent: 37,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    shortDescription: '24 soothing sounds including womb heartbeat, rain & lullabies. Built-in warm ambient night light with sleep timer & clip-on loop.',
    description: `Help your infant drift into deep, restorative sleep anywhere with this compact White Noise Sound Machine. Clinically shown to mimic the maternal womb acoustic environment, it masks jarring household noises like doorbells, barking dogs, and street traffic.

Features 24 calming sounds: 7 white noises, 7 fan sounds, and 10 relaxing nature and lullaby tracks. The warm dimmable night light is perfect for midnight feeds without disturbing your baby's sleep hormones.`,
    features: [
      '24 non-looping high-fidelity soothing sound profiles',
      'Rhythmic maternal heartbeat & shusher recordings',
      'Warm dimmable night light (breathing light mode available)',
      'Automatic shutoff timer: 30, 60, or 90 minutes or continuous',
      'Built-in 1200mAh battery delivers up to 16 hours on one charge',
      'Includes silicone hanging strap for strollers and cribs'
    ],
    specifications: {
      'Sound Modes': '24 High-Fidelity Audio Tracks',
      'Battery': '1200mAh Lithium Rechargeable (Type-C USB)',
      'Battery Life': '12 - 16 Hours Continuous Play',
      'Timer Options': '30m / 60m / 90m / Continuous',
      'Light Colors': 'Warm Yellow Dimmable & Breathing Glow'
    },
    isRecommended: true
  },
  {
    id: 'prod-5',
    name: 'Ergonomic 6-in-1 All-Season Baby Hipseat Carrier with Lumbar Support',
    slug: 'ergonomic-baby-hipseat-carrier-lumbar-support',
    category: 'Baby Accessories',
    categorySlug: 'baby-accessories',
    price: 2190,
    originalPrice: 3450,
    discountPercent: 37,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Doctor-recommended ergonomic M-position carrier with cushioned memory-foam hip seat. Reduces back and shoulder strain for parents.',
    description: `Carry your growing baby comfortably for hours without aching back, shoulder, or hip strain! Our 6-in-1 Ergonomic Baby Carrier features a medical-grade slanted hipseat (30-degree incline) that keeps your baby's hips and spine positioned in the healthy pediatric recommended "M-shape".

Can be used in 6 versatile configurations: inward facing, front outward, back carry, or standalone hipseat for quick hip carries at home. Breathable 3D honeycomb air-mesh keeps both parent and baby sweat-free in humid climates.`,
    features: [
      '30° angled hip seat distributes weight away from lumbar spine',
      'International Hip Dysplasia Institute (IHDI) compliant M-position',
      '6 versatile carrying configurations for newborn to 36 months',
      'Breathable 3D mesh roll-up panel for all-weather ventilation',
      'Extra-wide padded waistband (fits waist sizes up to 48 inches)',
      'Side zippered pocket for phone, keys, feeding bottle & wipes'
    ],
    specifications: {
      'Weight Capacity': '3.5 kg to 20 kg (Newborn to 36 Months)',
      'Waistband Range': '65 cm to 118 cm (25.5 to 46.5 inches)',
      'Fabric': '100% Cotton & Breathable 3D Polyester Mesh',
      'Seat Core': 'EPP High Density Anti-Shock Core',
      'Safety Buckles': 'Heavy Duty Dual-Locking Safety Clasp'
    },
    isBestSeller: true,
    isRecommended: true,
    badge: 'BEST SELLER'
  },
  {
    id: 'prod-6',
    name: 'Multi-Function Waterproof Diaper Backpack with Foldable Bassinet Bed',
    slug: 'multi-function-diaper-backpack-crib-bed',
    category: 'Baby Accessories',
    categorySlug: 'baby-accessories',
    price: 1890,
    originalPrice: 2950,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Spacious diaper bag that effortlessly transforms into an expandable baby changing crib and shaded nap bed anywhere you go.',
    description: `Never worry about unhygienic public changing tables or naptime on the road again. This innovative 3-in-1 Diaper Backpack features a built-in expandable crib bed with breathable mesh sides and a soft shaded sun canopy.

Boasts 16 organized compartments including 3 composite insulated bottle pockets that keep warm milk ready for up to 4 hours. Oxford waterproof fabric wipes clean instantly with a damp cloth.`,
    features: [
      'Quick unfold travel crib with breathable mesh and mattress pad',
      '3 thermal insulated bottle pockets fit wide-neck feeding bottles',
      '16 organized pockets for diapers, clothes, wipes & laptop/tablet',
      'High-density 900D waterproof Oxford fabric with anti-tear zippers',
      'Stroller buckle straps & external USB charging pass-through port'
    ],
    specifications: {
      'Material': '900D Waterproof Oxford Fabric + Thermal Aluminum Foil',
      'Capacity': '35 Liters',
      'Bed Dimensions': '70 cm x 30 cm when expanded',
      'Included': 'Backpack, Padded Mattress Pad, 2 Stroller Straps'
    },
    isBestSeller: true
  },
  {
    id: 'prod-7',
    name: 'Anti-Colic Natural Glass Feeding Bottle with Soft Silicone Nipple (240ml)',
    slug: 'anti-colic-natural-glass-baby-feeding-bottle-240ml',
    category: 'Baby Feeding',
    categorySlug: 'baby-feeding',
    price: 780,
    originalPrice: 1250,
    discountPercent: 38,
    images: [
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Thermal shock resistant borosilicate glass with breast-like silicone teat and dual anti-colic ventilation valves.',
    description: `Crafted from pure pharmaceutical-grade borosilicate glass, this feeding bottle is scratch-resistant, odour-resistant, and can transition directly from refrigerator to hot bottle warmer without cracking.

The ultra-soft spiral silicone teat mimics the natural flex and feel of breastfeeding, facilitating seamless breast-to-bottle transitions while the dual anti-colic valves vent air away from baby's tummy to prevent painful gas and burps.`,
    features: [
      '100% Medical-grade thermal shock proof borosilicate glass',
      'Breast-shaped flexible silicone nipple promotes natural latch',
      'Dual anti-colic air valve reduces gas, spit-up and reflux',
      'Clear, embossed milliliter and ounce measurement markings',
      'Protective food-grade silicone sleeve included for grip & drop protection'
    ],
    specifications: {
      'Capacity': '240 ml (8.1 oz)',
      'Glass Type': 'High Borosilicate Glass (Heat resistant to 600°C)',
      'Nipple Flow': 'Medium Flow (Ideal for 3M+)',
      'Compatibility': 'Fits standard wide-neck sterilizers & warmers'
    },
    isBestSeller: true,
    isRecommended: true
  },
  {
    id: 'prod-8',
    name: 'Gentle Organic Head-to-Toe Baby Wash & Calming Lavender Shampoo (400ml)',
    slug: 'organic-gentle-baby-wash-shampoo-400ml',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 650,
    originalPrice: 950,
    discountPercent: 32,
    images: [
      'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Tear-free, sulfate-free formula with organic aloe vera, calendula, and French lavender. Pediatrician and dermatologist approved.',
    description: `Gently cleanse and nourish your infant's skin and fine hair with this hypoallergenic, tear-free baby wash. Enriched with natural plant botanicals including calming chamomile, organic oat kernel extract, and sweet almond oil.

Maintains the delicate natural skin barrier without stripping away essential moisture. Free of sulfates, parabens, phthalates, synthetic dyes, and artificial perfumes.`,
    features: [
      '100% Tear-free proven gentle formula',
      'Infused with organic chamomile and calming wild lavender',
      'pH 5.5 balanced to protect fragile newborn skin barrier',
      'Pump dispenser with safety lock for single-handed bath time ease',
      'Hypoallergenic & clinically pediatrician tested'
    ],
    specifications: {
      'Volume': '400 ml',
      'Formula': 'Sulfate-Free, Paraben-Free, Cruelty-Free',
      'Skin Suitability': 'Sensitive, Dry & Eczema-Prone Newborn Skin',
      'Expiry': '24 Months from Manufacturing Date'
    },
    isBestSeller: true
  },
  {
    id: 'prod-9',
    name: 'Montessori Wooden Sensory Busy Board & Activity Cube (8-in-1)',
    slug: 'montessori-wooden-sensory-busy-board-cube',
    category: 'Baby Toys',
    categorySlug: 'baby-toys',
    price: 1350,
    originalPrice: 2100,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Develops fine motor skills, hand-eye coordination, and cognitive problem-solving with 8 tactile interactive locks and gears.',
    description: `Inspired by authentic Montessori sensory learning methods, this handcrafted Wooden Activity Cube captivates toddler attention for hours without electronic screens!

Features spring latches, revolving gears, interactive fingertip switches, analog clock dials, shoelace threading board, and mini spinner beads. Crafted from smooth basswood with rounded child-safe bevels and eco-friendly water-based paint.`,
    features: [
      '8 engaging tactile activities in one compact wooden cube',
      'Smooth hand-polished corners, zero splinters or sharp edges',
      'Encourages logical thinking and hand dexterity',
      'Compact travel size ideal for car rides and restaurant dining'
    ],
    specifications: {
      'Material': 'Natural Beechwood & Rust-Resistant Metal Hardware',
      'Age Range': '10 Months to 4 Years',
      'Dimensions': '15 cm x 15 cm x 15 cm',
      'Weight': '650 grams'
    },
    isTrending: true,
    badge: 'TRENDING'
  },
  {
    id: 'prod-10',
    name: 'Foldable Non-Slip Baby Bath Tub with Smart Digital Temperature Sensor',
    slug: 'foldable-baby-bath-tub-smart-temperature-sensor',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 2450,
    originalPrice: 3800,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Space-saving collapsible tub with real-time water temperature digital readout and soft suspended newborn bath cushion.',
    description: `Ensure your baby’s bath water is always at the safe, comfortable temperature (37°C-38°C) with the integrated real-time digital thermometer! The tub folds flat down to just 9cm thickness for effortless storage in compact apartments.

Includes a soft floating bath cushion that cradles newborn babies securely above the water level, protecting delicate ears and neck.`,
    features: [
      'Built-in waterproof digital thermometer prevents hot water scalds',
      'Collapses to 9cm flat with built-in wall-hook hanging hole',
      'Includes padded ergonomic newborn floating bath cushion',
      'Non-slip rubber feet and reinforced safety bracket lock',
      'Quick drain plug with heat-sensitive color indicator'
    ],
    specifications: {
      'Material': 'Eco-Friendly PP + TPE Flexible Rubber',
      'Expanded Size': '82 cm x 50 cm x 22 cm',
      'Folded Height': '9 cm',
      'Age Range': '0 to 36 Months'
    },
    isTrending: true,
    badge: 'TRENDING'
  },
  {
    id: 'prod-11',
    name: 'Electric Double Wearable Hands-Free Breast Pump with Smart LED Screen',
    slug: 'electric-double-wearable-breast-pump-hands-free',
    category: 'Mother & Baby Essentials',
    categorySlug: 'mother-baby-essentials',
    price: 3200,
    originalPrice: 4900,
    discountPercent: 35,
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Ultra-quiet invisible in-bra wireless breast pump. 3 modes and 9 suction levels for pain-free, discrete pumping anywhere.',
    description: `Designed for busy, modern mothers! Slip this ultra-lightweight breast pump directly into your standard nursing bra and pump hands-free while working, driving, or relaxing.

Features 3 physiological pumping modes (Massage, Expression, and Mixed Bionic) with 9 adjustable vacuum strengths. Anti-backflow silicone membrane prevents milk contamination and leakage.`,
    features: [
      'Completely wireless and fits discreetly inside standard nursing bras',
      '3 pumping modes (Massage, Expression, Bionic) & 9 intensity levels',
      'Anti-backflow sealed system ensures hygiene and prevents spillover',
      'Whisper-quiet operation (<40 dB) allows discreet night pumping',
      'Fast USB Type-C charging with 180ml capacity collection cup'
    ],
    specifications: {
      'Milk Capacity': '180 ml (6 oz) per pump',
      'Modes': '3 Modes & 9 Levels',
      'Battery': '1200mAh Lithium Rechargeable (Type-C USB)',
      'Suction Range': 'Up to 280-300 mmHg',
      'Flange Sizes': 'Includes 24mm & 27mm silicone inserts'
    },
    isTrending: true,
    badge: 'MOM ESSENTIAL'
  },
  {
    id: 'prod-12',
    name: 'Child-Proof Magnetic Cabinet & Drawer Locks - 10 Locks + 2 Keys Set',
    slug: 'child-proof-magnetic-cabinet-locks-set',
    category: 'Baby Safety',
    categorySlug: 'baby-safety',
    price: 990,
    originalPrice: 1600,
    discountPercent: 38,
    images: [
      'https://images.unsplash.com/photo-1595347097560-69238724e7bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1595347097560-69238724e7bd?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Invisible child safety locks installed inside cabinets with ultra-strong 3M adhesive. No drilling or furniture damage required.',
    description: `Keep curious toddlers away from dangerous chemicals, knives, and fragile items with these invisible magnetic locks. Installed completely inside the cabinets or drawers, maintaining your furniture's aesthetic beauty without exterior latches.

Unlocks instantly with the powerful magnetic master key through wood up to 35mm thick. Includes normal open mode switch for when baby is asleep.`,
    features: [
      'Invisible from outside, preserving furniture elegance',
      'Extreme hold genuine 3M adhesive tape (no screws or drilling)',
      'Works through cabinet doors up to 35mm (1.4 inches) thick',
      'Disengage toggle switch allows temporary unlocked access'
    ],
    specifications: {
      'Set Includes': '10 Locks, 10 Catches, 2 Magnetic Keys, 1 Alignment Cradle',
      'Installation': 'Tool-Free 3M Industrial Adhesive',
      'Material': 'Reinforced ABS Plastic & Neodymium Magnets'
    },
    isTrending: true
  },
  {
    id: 'prod-13',
    name: '100% Pure Organic Cotton Kimono Romper & Beanie Set',
    slug: 'organic-cotton-kimono-romper-beanie-set',
    category: 'Baby Clothing',
    categorySlug: 'baby-clothing',
    price: 850,
    originalPrice: 1290,
    discountPercent: 34,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Side-snap wrap style kimono romper that avoids pulling clothing over delicate heads. Select preferred age size.',
    description: `Dressing a baby has never been easier! The wrap-around Japanese kimono cut with nickel-free snaps allows you to dress your baby without struggling to pull fabric over their sensitive head.

Features fold-over cuff mittens to protect baby from accidental facial scratches and soft breathable footies. Available in multiple age variations: 1 Year, 2 Year, and 3 Year.`,
    features: [
      'GOTS Certified 100% combed organic ribbed cotton',
      'Side-snap wrap closure avoids pulling garments over head',
      'Built-in fold-over scratch mittens on wrists',
      'Tagless neck label eliminates itching or skin redness'
    ],
    specifications: {
      'Fabric': '100% GOTS Certified Organic Cotton',
      'Available Sizes': '1 Year, 2 Year, 3 Year',
      'Colors': 'Sage Green, Soft Oat, Powder Rose, Sky Blue'
    },
    isNewArrival: true,
    badge: 'AGE OPTIONS',
    variationGroup: {
      name: 'Select Age',
      options: [
        { id: 'v-1y', name: '1 Year' },
        { id: 'v-2y', name: '2 Year' },
        { id: 'v-3y', name: '3 Year' }
      ]
    }
  },
  {
    id: 'prod-14',
    name: 'Ultra-Soft Hooded Bamboo Animal Bath Towel with Washcloth (90x90 cm)',
    slug: 'ultra-soft-hooded-bamboo-baby-bath-towel',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 920,
    originalPrice: 1450,
    discountPercent: 37,
    images: [
      'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1584839401701-a1e64e9a06ec?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Extra plush 500 GSM bamboo terry towel with cute bear ears hood. Absorbs water 3x faster than traditional cotton.',
    description: `Wrap your little one in plush warmth immediately after bath time! Made from 500 GSM premium bamboo fabric, this hooded towel absorbs moisture in seconds to prevent post-bath chills.

Generously sized at 90cm x 90cm to comfortably wrap newborns and toddlers alike up to 5 years old.`,
    features: [
      'Super thick 500 GSM bamboo terry cloth',
      'Cute stitched bear ear hood keeps wet head warm',
      'Antibacterial and hypoallergenic natural bamboo fibers',
      'Includes matching bonus double-sided baby washcloth'
    ],
    specifications: {
      'Dimensions': '90 cm x 90 cm (35.4 x 35.4 in)',
      'Density': '500 GSM Ultra Plush',
      'Material': '100% Natural Bamboo Fiber'
    },
    isNewArrival: true,
    badge: 'NEW ARRIVAL'
  },
  {
    id: 'prod-15',
    name: 'Ultra-Soft Organic Cotton Baby Washcloth & Teething Set',
    slug: 'silicone-baby-teething-mitten-crinkle',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 100,
    originalPrice: 150,
    discountPercent: 33,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Super-absorbent, hypoallergenic organic cotton washcloth set. Available in 1 Pcs, 2 Pcs, 4 Pcs, and 8 Pcs value bundle packs.',
    description: `Designed for sensitive newborn and toddler skin! Our Ultra-Soft Organic Cotton Baby Washcloths are made from 100% natural organic cotton fibers that are gentler than standard terry towels.

Choose your bundle pack to save more: 1 Pcs (৳100), 2 Pcs (৳200), 4 Pcs (৳400), or 8 Pcs (৳800). Perfect for bath time, feeding burps, quick wipes, and drool cleanups.`,
    features: [
      '100% GOTS Certified Organic Cotton terry muslin',
      'Super absorbent 6-layer honeycomb softness',
      'Choose from 1 Pcs, 2 Pcs, 4 Pcs, or 8 Pcs bundle savings',
      'Machine washable and stays soft after 50+ wash cycles'
    ],
    specifications: {
      'Material': '100% Pure Organic Muslin Cotton',
      'Dimensions': '25 cm x 25 cm (9.8 x 9.8 inches)',
      'Cleaning': 'Machine Washable'
    },
    isNewArrival: true,
    badge: 'BUNDLE PACK',
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '1 Pcs', price: 100, originalPrice: 150, badge: 'Standard' },
      { id: 'b-2', pieces: 2, title: '2 Pcs', price: 200, originalPrice: 300, badge: 'Save ৳20' },
      { id: 'b-4', pieces: 4, title: '4 Pcs', price: 400, originalPrice: 600, badge: 'Best Value' },
      { id: 'b-8', pieces: 8, title: '8 Pcs', price: 800, originalPrice: 1200, badge: 'Super Saver' }
    ]
  },
  {
    id: 'prod-16',
    name: 'Complete 10-Piece Baby Healthcare & Grooming Nursery Care Kit',
    slug: 'complete-baby-grooming-healthcare-nursery-kit',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 990,
    originalPrice: 1550,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584839401736-621f375fca9f?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'All essential newborn medical & grooming tools in a durable zippered organizer case: thermometer, nasal aspirator, dropper, brush & more.',
    description: `Be fully prepared for every infant care moment with this comprehensive 10-piece nursery set. Includes digital oral thermometer, nasal aspirator with soft silicone tip, gentle goat hair cradle-cap brush, round-tip safety scissors, medicine dropper, and finger toothbrush.`,
    features: [
      '10 pediatric health & hygiene tools in one zippered travel case',
      'Soft silicone bulb nasal aspirator with mucus catcher',
      'Digital fever thermometer with fever alarm beep',
      'Ultra-soft natural bristle hairbrush gentle on cradle cap'
    ],
    specifications: {
      'Kit Contents': '10 Essential Nursery Care Tools + Storage Bag',
      'Safety': 'BPA-Free, Rustproof Stainless Steel, Rounded Edges',
      'Ideal For': 'Baby Shower Gift & Newborn Starter Set'
    },
    isNewArrival: true,
    isRecommended: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
