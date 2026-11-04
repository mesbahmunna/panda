import { Product } from '../types/product';
import { getCategoryDisplayName } from './categories';
import blanketBrown from '../assets/products/baby-sleeping-blanket/brown.jpeg';
import blanketPink from '../assets/products/baby-sleeping-blanket/pink.jpeg';
import blanketBlue from '../assets/products/baby-sleeping-blanket/blue.jpeg';
import blanketKhaki from '../assets/products/baby-sleeping-blanket/khaki.jpeg';

const initialProductsList: Product[] = [
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
      name: 'কালার নির্বাচন করুন',
      options: [
        { id: 'c-brown', name: 'চকলেট ব্রাউন', imageIndex: 0 },
        { id: 'c-pink', name: 'সফট পিঙ্ক', imageIndex: 1 },
        { id: 'c-blue', name: 'স্কাই ব্লু', imageIndex: 2 },
        { id: 'c-khaki', name: 'ওয়ার্ম খাকি', imageIndex: 3 }
      ]
    },
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '১ পিস', price: 450, originalPrice: 650, badge: 'স্ট্যান্ডার্ড' },
      { id: 'b-2', pieces: 2, title: '২ পিস কম্বো', price: 800, originalPrice: 1300, badge: '৳১০০ ছাড়' },
      { id: 'b-3', pieces: 3, title: '৩ পিস কম্বো', price: 1150, originalPrice: 1950, badge: '৳২০০ ছাড়' },
      { id: 'b-4', pieces: 4, title: '৪ পিস ফ্যামিলি প্যাক', price: 1500, originalPrice: 2600, badge: '৳৩০০ ছাড়' }
    ]
  },
  {
    id: 'prod-1',
    name: 'স্মার্ট বেবি ইলেকট্রিক নেইল ট্রিমার উইথ এলইডি লাইট (৬টি গ্রাইন্ডিং হেড)',
    slug: 'smart-baby-electric-nail-trimmer-led',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 890,
    originalPrice: 1550,
    discountPercent: 43,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'শব্দহীন বেবি নেইল ট্রিমার ও সফট এলইডি লাইট। শিশুর নরম নখ নিখুঁতভাবে ট্রিম করে ত্বকে কোনো আঘাত ছাড়াই।',
    description: `স্মার্ট বেবি ইলেকট্রিক নেইল ট্রিমার শিশুর নখ কাটার ভীতি দূর করতে একটি আধুনিক ডিভাইস। মাত্র ৩৫ ডেসিবেলের কম শব্দহীন মোটর এবং ফ্রন্ট এলইডি লাইট থাকায় শিশু ঘুমিয়ে থাকা অবস্থাতেও নিরাপদে নখ ট্রিম করা যায়।

এতে রয়েছে ৬টি কুশনযুক্ত গ্রাইন্ডিং হেড যা নবজাতক থেকে শুরু করে টডলার এবং বড়দের নখ ট্রিম করার জন্যও উপযোগী। দ্বিমুখী রোটেশন ও ২-স্পিড কন্ট্রোল নখকে মসৃণ ও ঝুঁকিমুক্ত রাখে।`,
    features: [
      'আল্ট্রা-সাইলেন্ট মোটর (<35dB) ঘুমের কোনো ব্যাঘাত ঘটায় না',
      'রাতে সহজে ব্যবহারের জন্য বিল্ট-ইন সফট এলইডি লাইট',
      '৬টি রঙিন কুশন হেড (নবজাতক থেকে বড়দের ব্যবহারের উপযোগী)',
      '৩৬০ ডিগ্রি দ্বিমুখী রোটেশন ও ২-স্পিড কন্ট্রোল সুইচ',
      'হালকা ও আরামদায়ক অ্যান্টি-স্লিপ গ্রিপ ডিজাইন',
      '২টি এএ ব্যাটারিতে চালিত এবং অটো-স্টপ সেফটি সেন্সর'
    ],
    specifications: {
      'উপাদান': 'নন-টক্সিক এবিএস প্লাস্টিক ও মেডিকেল গ্রেড সিলিকন',
      'বয়সসীমা': '০ মাস থেকে ৩+ বছর (বড়দের হেড সহ)',
      'শব্দের মাত্রা': '৩৫ ডেসিবেলের নিচে (অত্যন্ত শান্ত)',
      'পাওয়ার': '২টি AA ব্যাটারি',
      'সার্টিফিকেশন': 'CE, RoHS, FDA অনুমোদিত মান'
    },
    isBestSeller: true,
    isTrending: true,
    badge: 'POPULAR'
  },
  {
    id: 'prod-2',
    name: 'ফুড-গ্রেড সিলিকন সাকশন বেবি ফিডিং সেট (৮ পিস কমপ্লিট কিট)',
    slug: 'silicone-suction-baby-feeding-set-8pcs',
    category: 'Baby Feeding',
    categorySlug: 'baby-feeding',
    price: 1450,
    originalPrice: 2200,
    discountPercent: 34,
    images: [
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=600',
    shortDescription: '১০০% ফুড-গ্রেড সিলিকন ডিভাইডেড প্লেট, বাটি, সফট চামচ-কাঁটাচামচ, অ্যাডজাস্টেবল বিব এবং ওয়াটার কাপ।',
    description: `শিশুর নিজে নিজে খাবার খাওয়ার অভ্যাস গড়ে তুলতে ৮ পিসের সম্পূর্ণ সিলিকন ফিডিং সেট। শক্তিশালী সাকশন বেসের কারণে প্লেট বা বাটি টেবিল থেকে পড়ে যায় না বা উল্টে যায় না।

১০০% প্ল্যাটিনাম ফুড-গ্রেড সিলিকন দ্বারা তৈরি, যা বিপিএ, পিভিসি এবং ক্ষতিকর রাসায়নিক মুক্ত। মাইক্রোওয়েভ, ফ্রিজার এবং ডিশওয়াশার নিরাপদ।`,
    features: [
      'শক্তিশালী সাকশন গ্রিপ যা টেবিল বা হাই-চেয়ারে শক্তভাবে আটকে থাকে',
      '১০০% ফুড-গ্রেড প্ল্যাটিনাম সিলিকন (BPA ও টক্সিন মুক্ত)',
      'মাইনাস ৪০°C থেকে ২২০°C পর্যন্ত তাপমাত্রা সহনশীল',
      'গভীর খাবার ক্যাচার বিব ও ৪-ধাপে অ্যাডজাস্টেবল সাইজ',
      'কোমল চামচ ও কাঁটাচামচ যা শিশুর মাড়ির জন্য সম্পূর্ণ নিরাপদ',
      'স্পিল-প্রুফ ফোল্ডিং স্ন্যাক কাপ ও ঢাকনা অন্তর্ভুক্ত'
    ],
    specifications: {
      'উপাদান': '১০০% প্ল্যাটিনাম ফুড-গ্রেড সিলিকন ও বিচউড',
      'বয়সসীমা': '৬ মাস থেকে ৪ বছর',
      'তাপমাত্রা সহনশীলতা': '-৪০°C থেকে ২২০°C',
      'পরিষ্কার পদ্ধতি': 'হাতে বা ডিশওয়াশারে সহজে ধোয়া যায় / ফুটানো নিরাপদ',
      'আইটেম সংখ্যা': '৮টি পিস (প্লেট, বাটি, বিব, চামচ, কাঁটাচামচ, সিপ্পি কাপ, ঢাকনা)'
    },
    isBestSeller: true,
    isTrending: true,
    badge: 'WEANING SET'
  },
  {
    id: 'prod-3',
    name: '১০০% অর্গানিক ব্যাম্বু কটন বেবি রম্পার ও স্লিপস্যুট সেট',
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
    shortDescription: 'অতি নরম ও আরামদায়ক ব্যাম্বু কটন সুট। শিশুর ত্বকের জন্য ১০০% নিরাপদ ও অ্যালার্জি-মুক্ত।',
    description: `আপনার প্রিয় সন্তানের জন্য নিয়ে এলো প্রিমিয়াম অর্গানিক ব্যাম্বু কটন বেবি সুট। গরমের দিনে শরীর ঠান্ডা রাখে এবং এসি রুমে পরম উষ্ণতা দেয়।

বয়সভিত্তিক মাপ (১ বছর, ২ বছর, ৩ বছর) এবং আকর্ষণীয় বান্ডেল অফারে পাওয়া যাচ্ছে।`,
    features: [
      '৭০% সিল্কি ব্যাম্বু রেয়ন + ৩০% অর্গানিক কটন ব্লেন্ড',
      'টু-ওয়ে সেফটি জিপার ও চিবুক প্রটেক্টর গার্ড',
      'বারবার ওয়াশ করলেও ফেব্রিকের মসৃণতা অক্ষুণ্ণ থাকে',
      'শ্বাস-প্রশ্বাস উপযোগী ফেব্রিক র‍্যাশ ও ঘামাচি রোধ করে',
      'নন-টক্সিক অর্গানিক ডাই ও প্রিমিয়াম ফিনিশ'
    ],
    specifications: {
      'ফেব্রিক': '৭০% ব্যাম্বু রেয়ন, ৩০% অর্গানিক কটন মাসলিন',
      'উপলব্ধ সাইজ': '১ বছর, ২ বছর, ৩ বছর',
      'ওয়াশ কেয়ার': 'মেশিন ওয়াশ ও নরমাল ওয়াশ উপযোগী'
    },
    isBestSeller: true,
    isRecommended: true,
    badge: 'BUNDLE & SIZES',
    variationGroup: {
      name: 'বয়স নির্বাচন করুন',
      options: [
        { id: 'v-1y', name: '১ বছর' },
        { id: 'v-2y', name: '২ বছর' },
        { id: 'v-3y', name: '৩ বছর' }
      ]
    },
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '১ পিস', price: 450, originalPrice: 650, badge: 'স্ট্যান্ডার্ড' },
      { id: 'b-2', pieces: 2, title: '২ পিস প্যাক', price: 850, originalPrice: 1300, badge: '৳৫০ ছাড়' },
      { id: 'b-4', pieces: 4, title: '৪ পিস প্যাক', price: 1600, originalPrice: 2600, badge: 'জনপ্রিয়' },
      { id: 'b-8', pieces: 8, title: '৮ পিস মেগা প্যাক', price: 3000, originalPrice: 5200, badge: 'সুপার সেভার' }
    ]
  },
  {
    id: 'prod-4',
    name: 'পোর্টেবল রিচার্জেবল হোয়াইট নয়েজ মেশিন ও বেবি নাইট লাইট',
    slug: 'portable-baby-white-noise-sound-machine',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 1250,
    originalPrice: 1990,
    discountPercent: 37,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    shortDescription: '২৪টি প্রশান্তিময় সুর ও মায়ের গর্ভের মৃদু আওয়াজ। শিশুর গভীর ও নিশ্চিন্ত ঘুমের জন্য উপযোগী।',
    description: `শিশুকে দ্রুত এবং গভীর ঘুমে আচ্ছন্ন করতে বিশেষ হোয়াইট নয়েজ সাউন্ড মেশিন। বাইরের অপ্রীতিকর শব্দ যেমন গাড়ির হর্ন বা দরজার আওয়াজ দূর করে একটি শান্ত পরিবেশ তৈরি করে।

২৪টি সুরের মধ্যে রয়েছে হোয়াইট নয়েজ, ফ্যান সাউন্ড, বৃষ্টির রিমঝিম শব্দ এবং মিষ্টি ঘুমপাড়ানি গান। সাথে রয়েছে হালকা নাইট লাইট।`,
    features: [
      '২৪টি হাই-ফিডেলিটি শান্তিময় সাউন্ড প্রোফাইল',
      'মায়ের গর্ভের হার্টবিট ও সুদিং রেকর্ডিং',
      'চোখের ক্ষতি করে না এমন নরম ওয়ার্ম নাইট লাইট',
      'অটোমেটিক টাইমার: ৩০, ৬০, ৯০ মিনিট বা একটানা প্লে',
      '১২০০ মিলিঅ্যাম্পিয়ার রিচার্জেবল ব্যাটারি (১৬ ঘণ্টা পর্যন্ত ব্যাকআপ)',
      'স্ট্রোলার বা বেবি কটের সাথে ঝোলানোর সিলিকন স্ট্র্যাপ'
    ],
    specifications: {
      'সাউন্ড মোড': '২৪টি শান্তিময় অডিও ট্র্যাক',
      'ব্যাটারি': '১২০০mAh রিচার্জেবল লিথিয়াম (Type-C USB)',
      'ব্যাটারি লাইফ': '১২ - ১৬ ঘণ্টা একটানা প্লেব্যাক',
      'টাইমার অপশন': '৩০ মি. / ৬০ মি. / ৯০ মি. / একটানা'
    },
    isRecommended: true
  },
  {
    id: 'prod-5',
    name: '৬-ইন-১ এরগনোমিক বেবি হিপসিট ক্যারিয়ার উইথ লাম্বার সাপোর্ট',
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
    shortDescription: 'ডাক্তারদের প্রস্তাবিত এম-পজিশন হিপসিট। শিশুর সুরক্ষার পাশাপাশি বাবা-মায়ের কোমর ও কাঁধের ব্যথা কমায়।',
    description: `ঘণ্টার পর ঘণ্টা শিশুকে কোলে নিয়ে ঘোরার পরও কোমর বা কাঁধে কোনো ব্যথা হবে না! আন্তর্জাতিক হিপ ডিসপ্লাসিয়া ইনস্টিটিউটের মান অনুযায়ী ৩০ ডিগ্রি ইনক্লাইন সিট যা শিশুর মেরুদণ্ডকে সঠিক অবস্থানে রাখে।

৬টি ভিন্ন মোডে ব্যবহার করা যায়: বুকের সাথে, সামনের দিকে মুখ করে, পিঠে নিয়ে অথবা শুধু হিপসিট হিসেবে। বাতাস চলাচলের জন্য থ্রিডি ব্রিদেবল মেশ প্যানেল রয়েছে।`,
    features: [
      '৩০° অ্যাঙ্গেল হিপসিট যা মেরুদণ্ডের ওপর বাড়তি চাপ পড়তে দেয় না',
      'শিশু চিকিৎসকদের প্রস্তাবিত স্বাস্থ্যকর "M-Shape" পজিশন',
      '৬টি বহুমুখী ক্যারিং মোড (নবজাতক থেকে ৩৬ মাস পর্যন্ত)',
      'বাতাস চলাচলের জন্য ব্রিদেবল থ্রিডি মেশ রোল-আপ প্যানেল',
      'এক্সট্রা-ওয়াইড প্যাডেড ওয়েস্টব্যান্ড (৪৮ ইঞ্চি পর্যন্ত কোমর উপযোগী)',
      'মোবাইল, চাবি ও ফিডার রাখার সাইড জিপার পকেট'
    ],
    specifications: {
      'ওজন ধারণ ক্ষমতা': '৩.৫ কেজি থেকে ২০ কেজি (নবজাতক থেকে ৩৬ মাস)',
      'কোমরের পরিধি': '৬৫ সেমি থেকে ১১৮ সেমি (২৫.৫ থেকে ৪৬.৫ ইঞ্চি)',
      'ফেব্রিক': '১০০% কটন ও ব্রিদেবল থ্রিডি পলিয়েস্টার মেশ',
      'সিট কোর': 'EPP হাই ডেনসিটি অ্যান্টি-শক কোর'
    },
    isBestSeller: true,
    isRecommended: true,
    badge: 'BEST SELLER'
  },
  {
    id: 'prod-6',
    name: 'মাল্টিফাংশন ওয়াটারপ্রুফ ডায়াপার ব্যাকপ্যাক ও ফোল্ডেবল বেবি বেড',
    slug: 'multi-function-diaper-backpack-crib-bed',
    category: 'Baby Accessories',
    categorySlug: 'baby-accessories',
    price: 1890,
    originalPrice: 2950,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'প্রয়োজনীয় সবকিছু রাখার জন্য ১৬টি পকেট এবং যেকোনো জায়গায় শিশুর ডায়াপার পরিবর্তন ও ঘুমের জন্য বহনযোগ্য বেড।',
    description: `ভ্রমণ কিংবা বাইরে যাওয়ার সময় শিশুর সব জিনিসপত্র গুছিয়ে রাখা এবং অনায়াসে একটি আরামদায়ক বেডে পরিণত করার জন্য উদ্ভাবনী ব্যাকপ্যাক।

১৬টি সুবিন্যস্ত পকেট রয়েছে যার মধ্যে ৩টি ইনসুলেটেড পকেট যা দুধ ৪ ঘণ্টা পর্যন্ত গরম রাখে। ওয়াটারপ্রুফ অক্সফোর্ড ফেব্রিক যা ভেজা কাপড় দিয়ে সহজেই মুছে ফেলা যায়।`,
    features: [
      'সহজে খোলা যায় এমন ট্রাভেল ক্রিব বেড ও নরম ম্যাট্রেস প্যাড',
      '৩টি থার্মাল ইনসুলেটেড ফিডিং বোতল পকেট',
      'ডায়াপার, জামাকাপড় ও প্রয়োজনীয় জিনিসের জন্য ১৬টি পকেট',
      'উচ্চ ঘনত্বের ৯০০ডি ওয়াটারপ্রুফ অক্সফোর্ড ফেব্রিক',
      'স্ট্রোলার বাকল স্ট্র্যাপ ও এক্সটারনাল ইউএসবি চার্জিং পোর্ট'
    ],
    specifications: {
      'উপাদান': '৯০০ডি ওয়াটারপ্রুফ অক্সফোর্ড ফেব্রিক ও অ্যালুমিনিয়াম ফয়েল',
      'ধারণক্ষমতা': '৩৫ লিটার',
      'বেডের পরিমাপ': '৭০ সেমি x ৩০ সেমি (খোলার পর)'
    },
    isBestSeller: true
  },
  {
    id: 'prod-7',
    name: 'অ্যান্টি-কলিক ন্যাচারাল গ্লাস বেবি ফিডিং বোতল (২৪০ মিলি)',
    slug: 'anti-colic-natural-glass-baby-feeding-bottle-240ml',
    category: 'Baby Feeding',
    categorySlug: 'baby-feeding',
    price: 780,
    originalPrice: 1250,
    discountPercent: 38,
    images: [
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=600',
    shortDescription: 'তাপ সহনশীল বোরোসিলিকেট গ্লাস ও নরম সিলিকন নিপল। শিশুর গ্যাস ও পেট ফাঁপার সমস্যা প্রতিরোধ করে।',
    description: `উচ্চমানের বোরোসিলিকেট গ্লাসে তৈরি এই ফিডিং বোতলটি স্ক্র্যাচ-প্রতিরোধী ও দুর্গন্ধমুক্ত। ফ্রিজ থেকে সরাসরি গরম পানিতে নিলেও এটি ফেটে যায় না।

মায়ের বুকের দুধ পানের মতোই কোমল ফ্লেক্সিবল নিপল এবং ডুয়েল অ্যান্টি-কলিক ভেন্ট সিস্টেম শিশুর পেটে বাতাস ঢোকা বন্ধ করে গ্যাস ও অস্বস্তি থেকে রক্ষা করে।`,
    features: [
      '১০০% মেডিকেল গ্রেড থার্মাল শক প্রুফ বোরোসিলিকেট গ্লাস',
      'বুকের মতো প্রাকৃতিক ফ্লেক্সিবল সিলিকন নিপল',
      'ডুয়েল অ্যান্টি-কলিক এয়ার ভালভ যা গ্যাস ও বমি ভাব রোধ করে',
      'স্পষ্ট ও স্থায়ী মিলিমিটার এবং আউন্স দাগাঙ্কিত মাপ',
      'ধরে রাখার সুবিধা ও সুরক্ষার জন্য ফুড-গ্রেড সিলিকন হাতা অন্তর্ভুক্ত'
    ],
    specifications: {
      'ধারণক্ষমতা': '২৪০ মিলি (৮.১ আউন্স)',
      'গ্লাসের ধরন': 'হাই বোরোসিলিকেট গ্লাস (৬০০°C তাপ সহনশীল)',
      'নিপল ফ্লো': 'মিডিয়াম ফ্লো (৩ মাস+ শিশুর জন্য উপযোগী)'
    },
    isBestSeller: true,
    isRecommended: true
  },
  {
    id: 'prod-8',
    name: 'জেন্টল অর্গানিক হেড-টু-টো বেবি ওয়াশ ও ল্যাভেন্ডার শ্যাম্পু (৪০০ মিলি)',
    slug: 'organic-gentle-baby-wash-shampoo-400ml',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 650,
    originalPrice: 950,
    discountPercent: 32,
    images: [
      'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'টিয়ার-ফ্রি ও সালফেট-মুক্ত ফর্মুলা। শিশুর কোমল ত্বক ও চুলের গভীর যত্নে চিকিৎসকদের পরীক্ষিত।',
    description: `শিশুর সংবেদনশীল ত্বক ও চুল কোমলভাবে পরিষ্কার করতে হাইপোঅ্যালার্জেনিক ও টিয়ার-ফ্রি বেবি ওয়াশ। এতে রয়েছে অর্গানিক ক্যামোমাইল, ওট কার্নেল ও সুইট আমন্ড অয়েল।

ত্বকের প্রাকৃতিক আর্দ্রতা বজায় রাখে এবং কোনো ধরনের ক্ষতিকর সালফেট, প্যারাবেন কিংবা কৃত্রিম সুগন্ধি নেই।`,
    features: [
      '১০০% টিয়ার-ফ্রি ফর্মুলা যা চোখে জ্বালাপোড়া করে না',
      'অর্গানিক ক্যামোমাইল ও শান্তিময় বুনো ল্যাভেন্ডার সমৃদ্ধ',
      'pH ৫.৫ ব্যালান্সড যা নবজাতকের কোমল ত্বক সুরক্ষিত রাখে',
      'এক হাতে ব্যবহারের উপযোগী সেফটি লকযুক্ত পাম্প ডিসপেন্সার',
      'শিশুরোগ বিশেষজ্ঞ ও চর্মরোগ বিশেষজ্ঞদের দ্বারা চিকিৎসাগতভাবে পরীক্ষিত'
    ],
    specifications: {
      'পরিমাণ': '৪০০ মিলি',
      'ফর্মুলা': 'সালফেট-মুক্ত, প্যারাবেন-মুক্ত ও ক্ষতিকর কেমিক্যাল মুক্ত',
      'ত্বকের উপযোগিতা': 'সংবেদনশীল, শুষ্ক ও একজিমা প্রবণ ত্বকের জন্য উপযোগী'
    },
    isBestSeller: true
  },
  {
    id: 'prod-9',
    name: 'মন্টেসরি উডেন সেন্সরি বিজি বোর্ড ও অ্যাক্টিভিটি কিউব (৮-ইন-১)',
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
    shortDescription: '৮টি আকর্ষণীয় ইন্টারঅ্যাক্টিভ অ্যাক্টিভিটি যা শিশুর মেধা, মনোযোগ ও হাতের পেশির সঠিক বিকাশ ঘটায়।',
    description: `মন্টেসরি শিখন পদ্ধতির আলোকে তৈরি এই কাঠের অ্যাক্টিভিটি কিউব শিশুকে মোবাইল ও টিভি স্ক্রিন থেকে দূরে রেখে দীর্ঘক্ষণ আনন্দময় খেলায় ব্যস্ত রাখে।

এতে রয়েছে স্প্রিং ল্যাচ, ঘূর্ণায়মান গিয়ার, অ্যানালগ ঘড়ির কাঁটা, জুতার ফিতা বাঁধার বোর্ড এবং স্পিনার বিডস। মসৃণ বিচউড ও পরিবেশবান্ধব রঙে তৈরি।`,
    features: [
      'একটি কমপ্যাক্ট কাঠের কিউবে ৮টি ভিন্ন ট্যাকটাইল অ্যাক্টিভিটি',
      'মসৃণভাবে পলিশ করা কোনো ধারালো কোণা বা স্প্লিন্টার নেই',
      'যুক্তিসঙ্গত চিন্তা ও সূক্ষ্ম মোটর দক্ষতার দ্রুত বিকাশ ঘটায়',
      'ভ্রমণ বা রেস্তোরাঁয় নিয়ে যাওয়ার মতো কমপ্যাক্ট সাইজ'
    ],
    specifications: {
      'উপাদান': 'প্রাকৃতিক বিচউড ও মরিচারোধক মেটাল হার্ডওয়্যার',
      'বয়সসীমা': '১০ মাস থেকে ৪ বছর',
      'আকার': '১৫ সেমি x ১৫ সেমি x ১৫ সেমি',
      'ওজন': '৬৫০ গ্রাম'
    },
    isTrending: true,
    badge: 'TRENDING'
  },
  {
    id: 'prod-10',
    name: 'স্মার্ট ডিজিটাল টেম্পারেচার সেন্সর ফোল্ডিং বেবি বাথটাব',
    slug: 'foldable-baby-bath-tub-smart-temperature-sensor',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 2450,
    originalPrice: 3800,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'রিয়েল-টাইম পানির তাপমাত্রা প্রদর্শনকারী ফোল্ডিং বাথটাব এবং নবজাতকের ভাসমান আরামদায়ক কুশন।',
    description: `বাথটাবের বিল্ট-ইন ডিজিটাল থার্মোমিটারের সাহায্যে পানির তাপমাত্রা সবসময় সঠিক (৩৭°C-৩৮°C) রাখা সম্ভব। ব্যবহারের পর ভাঁজ করে মাত্র ৯ সেন্টিমিটার পুরুত্বে রাখা যায়।

সাথে রয়েছে নরম ফ্লোটিং বাথ কুশন যা নবজাতককে নিরাপদে পানির উপরে ধরে রাখে এবং শিশুর কান ও ঘাড়ে পানি ঢুকতে দেয় না।`,
    features: [
      'ওয়াটারপ্রুফ রিয়েল-টাইম ডিজিটাল থার্মোমিটার',
      'ভাঁজ করে মাত্র ৯ সেমি ফ্ল্যাট করা যায় ও ওয়ালে ঝোলানোর সুবিধা',
      'নবজাতকের জন্য আরামদায়ক প্যাডেড ফ্লোটিং বাথ কুশন অন্তর্ভুক্ত',
      'অ্যান্টি-স্লিপ রাবার বটম ও রিইনফোর্সড সেফটি ব্র্যাকেট লক',
      'তাপ সংবেদনশীল দ্রুত পানি নিষ্কাশনের ড্রেন প্লাগ'
    ],
    specifications: {
      'উপাদান': 'পরিবেশবান্ধব পিপি + টিপিই ফ্লেক্সিবল রাবার',
      'খোলার পর আকার': '৮২ সেমি x ৫০ সেমি x ২২ সেমি',
      'ভাঁজ করা উচ্চতা': '৯ সেমি',
      'বয়সসীমা': '০ থেকে ৩৬ মাস'
    },
    isTrending: true,
    badge: 'TRENDING'
  },
  {
    id: 'prod-11',
    name: 'হ্যান্ডস-ফ্রি ইলেকট্রিক ডাবল ওয়্যারেবল ব্রেস্ট পাম্প (স্মার্ট এলইডি)',
    slug: 'electric-double-wearable-breast-pump-hands-free',
    category: 'Mother & Baby Essentials',
    categorySlug: 'mother-baby-essentials',
    price: 3200,
    originalPrice: 4900,
    discountPercent: 35,
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'শব্দহীন, হালকা ও পোশাকের ভেতরে ব্যবহারের উপযোগী। দুধ অপচয় ছাড়াই দ্রুত ও আরামদায়ক এক্সপ্রেশন।',
    description: `আধুনিক কর্মজীবী ও ব্যস্ত মায়েদের জন্য ডিজাইন করা ওয়্যারলেস ব্রেস্ট পাম্প। কোনো তারের ঝামেলা নেই, নার্সিং ব্রায়ের ভেতরে সহজেই পরে কাজ করা বা বিশ্রাম নেওয়া যায়।

৩টি মোড (ম্যাসাজ, এক্সপ্রেশন ও মিক্সড) এবং ৯টি অ্যাডজাস্টেবল সাকশন লেভেল রয়েছে। অ্যান্টি-ব্যাকফ্লো সিলিকন সিস্টেম দুধের লিকেজ রোধ করে।`,
    features: [
      'সম্পূর্ণ ওয়্যারলেস ও স্ট্যান্ডার্ড ব্রা-এর ভেতর সহজে পরা যায়',
      '৩টি ফিজিওলজিক্যাল মোড ও ৯টি ইনটেনসিটি লেভেল',
      'অ্যান্টি-ব্যাকফ্লো সিলড সিস্টেম যা দুধের স্বাস্থ্যবিধি বজায় রাখে',
      'শব্দহীন মোটর (<40 dB) রাতে ব্যবহারের জন্য অত্যন্ত শান্ত',
      'দ্রুত ইউএসবি টাইপ-সি চার্জিং ও ১৮০ মিলি ক্যাপাসিটি কাপ'
    ],
    specifications: {
      'ধারণক্ষমতা': '১৮০ মিলি (৬ আউন্স)',
      'মোড': '৩টি মোড ও ৯টি লেভেল',
      'ব্যাটারি': '১২০০mAh রিচার্জেবল লিথিয়াম (Type-C)',
      'ফ্ল্যাঞ্জ সাইজ': '২৪মিমি ও ২৭মিমি সিলিকন ইনসার্ট অন্তর্ভুক্ত'
    },
    isTrending: true,
    badge: 'MOM ESSENTIAL'
  },
  {
    id: 'prod-12',
    name: 'চাইল্ড-প্রুফ ম্যাগনেটিক ক্যাবিনেট ও ড্রয়ার লক (১০টি লক + ২টি চাবি)',
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
    shortDescription: 'ড্রিল ছাড়া ৩M আঠাযুক্ত অদৃশ্য সেফটি লক। ঘর ও রান্নাঘরের ঝুঁকিপূর্ণ জিনিস থেকে শিশুর শতভাগ সুরক্ষা।',
    description: `ঘরে হাঁটতে শেখা ছোট্ট শিশুর সুরক্ষা নিশ্চিত করতে ম্যাগনেটিক ক্যাবিনেট লক সেট। ড্রয়ার বা ক্যাবিনেটের ভেতরে লাগানো হয় বলে বাইরে থেকে কোনো লক দেখা যায় না এবং আসবাবপত্রের সৌন্দর্য নষ্ট হয় না।

বাইরে থেকে শক্তিশালী ম্যাগনেটিক চাবি স্পর্শ করলেই লক খুলে যায়।`,
    features: [
      'বাইরে থেকে দেখা যায় না এমন ইনভিজিবল সিকিউরিটি লক',
      'কোনো ড্রিল বা স্ক্রু লাগবে না - শক্তিশালী ৩M অ্যাডহেসিভ টেপ',
      '৩৫ মিমি পর্যন্ত পুরু কাঠের দরজা ভেদ করে কাজ করে',
      'প্রয়োজনে লক ডিঅ্যাক্টিভেট করে রাখার সুবিধাজনক সুইচ'
    ],
    specifications: {
      'প্যাকেজ অন্তর্ভুক্ত': '১০টি ম্যাগনেটিক লক, ২টি মাস্টার কি, ইন্সটলেশন গাইড',
      'উপাদান': 'হাই-গ্রেড বিপিএ-মুক্ত এবিএস ও নিওডিমিয়াম ম্যাগনেট'
    },
    isNewArrival: true
  },
  {
    id: 'prod-13',
    name: '১০০% পিওর অর্গানিক কটন কিমোনো রমপার ও বিনি সেট',
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
    shortDescription: 'সাইড-স্ন্যাপ কিমোনো স্টাইল রমপার - বাচ্চার মাথার ওপর দিয়ে টানার ঝামেলা ছাড়া সহজে পরানো যায়। সাইজ নির্বাচন করুন।',
    description: `নবজাতক ও ছোট্ট সোনামণিকে কাপড় পরানো এখন আরও সহজ ও আরামদায়ক! নরম জাপানি কিমোনো কাটিং এবং নিকেল-মুক্ত বোতামের কারণে বাচ্চার সংবেদনশীল মাথার ওপর দিয়ে টানার কোনো ঝামেলা নেই।

হাতে রয়েছে ফোল্ড-ওভার মিটেন গ্লাভস যা বাচ্চার মুখের নরম ত্বকে নখের আঁচড় লাগা থেকে রক্ষা করে। বিভিন্ন বয়সের সাইজে পাওয়া যাচ্ছে: ১ বছর, ২ বছর, ও ৩ বছর।`,
    features: [
      'GOTS সার্টিফাইড ১০০% খাঁটি কম্বড অর্গানিক রিবড কটন',
      'সাইড-স্ন্যাপ কিমোনো র‍্যাপ ডিজাইন - সহজে পরানো ও খোলা যায়',
      'হাতের কব্জিতে ইন-বিল্ট স্ক্র্যাচ প্রটেকশন মিটেন',
      'ট্যাগ-লেস নেক লেবেল - ঘাড় ও ত্বকে চুলকানি বা লালচে ভাব রোধ করে'
    ],
    specifications: {
      'কাপড়': '১০০% GOTS সার্টিফাইড অর্গানিক কটন',
      'উপলব্ধ বয়স': '১ বছর, ২ বছর, ৩ বছর',
      'রঙসমূহ': 'সেজ গ্রিন, সফট ওট, পাউডার রোজ, স্কাই ব্লু'
    },
    isNewArrival: true,
    badge: 'বয়সের সাইজ',
    variationGroup: {
      name: 'বয়স নির্বাচন করুন',
      options: [
        { id: 'v-1y', name: '১ বছর' },
        { id: 'v-2y', name: '২ বছর' },
        { id: 'v-3y', name: '৩ বছর' }
      ]
    }
  },
  {
    id: 'prod-14',
    name: 'আল্ট্রা-সফট হুডেড ব্যাম্বু অ্যানিমেল বেবি বাথ টাওয়েল (৯০x৯০ সেমি)',
    slug: 'ultra-soft-hooded-bamboo-baby-bath-towel',
    category: 'Baby Bath & Hygiene',
    categorySlug: 'baby-bath-hygiene',
    price: 920,
    originalPrice: 1450,
    discountPercent: 37,
    images: [
      'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1641913337604-7b040a87fc88?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'এক্সট্রা নরম ও পুরু ৫০০ জিএসএম ব্যাম্বু টেরি তোয়ালে। সাধারণ সুতি তোয়ালের চেয়ে ৩ গুণ দ্রুত পানি শুষে নেয়।',
    description: `গোসলের পরপরই আপনার সোনামণিকে দিন তুলতুলে উষ্ণতার পরম পরশ! ৫০০ জিএসএম প্রিমিয়াম প্রাকৃতিক বাঁশের ফাইবার দিয়ে তৈরি এই তোয়ালে মাত্র কয়েক সেকেন্ডের মধ্যে পানি শুকিয়ে ফেলে শিশুকে ঠান্ডা লাগা থেকে বাঁচায়।

বড় আকারের ৯০ সেমি x ৯০ সেমি তোয়ালেটি নবজাতক থেকে শুরু করে ৫ বছর বয়স পর্যন্ত আরামে ব্যবহার উপযোগী।`,
    features: [
      'অত্যন্ত পুরু ও নরম ৫০০ জিএসএম ব্যাম্বু টেরি ফেব্রিক',
      'আকর্ষণীয় ভালুকের কানওয়ালা হুড - ভেজা মাথা ঢেকে ঠান্ডা লাগা আটকায়',
      'অ্যান্টিব্যাকটেরিয়াল ও হাইপোঅ্যালার্জেনিক ন্যাচারাল ব্যাম্বু ফাইবার',
      'সাথে থাকছে স্পেশাল বোনাস ডাবল-সাইডেড বেবি ওয়াশক্লথ'
    ],
    specifications: {
      'সাইজ': '৯০ সেমি x ৯০ সেমি (৩৫.৪ x ৩৫.৪ ইঞ্চি)',
      'ঘনত্ব': '৫০০ জিএসএম আল্ট্রা প্লাশ',
      'উপাদান': '১০০% ন্যাচারাল ব্যাম্বু ফাইবার'
    },
    isNewArrival: true,
    badge: 'নতুন কালেকশন'
  },
  {
    id: 'prod-15',
    name: 'আল্ট্রা-সফট অর্গানিক কটন বেবি ওয়াশক্লথ সেট',
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
    shortDescription: 'উচ্চ শোষণক্ষমতাসম্পন্ন ১০০% অর্গানিক কটন ওয়াশক্লথ। ১টি, ২টি, ৪টি ও ৮টির সাশ্রয়ী বান্ডেল প্যাকে পাওয়া যাচ্ছে।',
    description: `নবজাতকের অতি সংবেদনশীল ত্বকের যত্নে বিশেষভাবে তৈরি! আমাদের আল্ট্রা-সফট অর্গানিক কটন ওয়াশক্লথ সাধারণ তোয়ালের চেয়েও অনেক বেশি নরম ও মোলায়েম।

বেশি নিলে বেশি সাশ্রয়: ১ পিস (৳১০০), ২ পিস (৳২০০), ৪ পিস (৳৪০০), অথবা ৮ পিস (৳৮০০)। গোসলের সময়, দুধ খাওয়ানোর পর মুখ মোছা বা লালা পরিষ্কারের জন্য অপরিহার্য।`,
    features: [
      '১০০% জিওটিএস সার্টিফাইড অর্গানিক কটন মসলিন ফেব্রিক',
      'অতিরিক্ত শোষণক্ষমতা সম্পন্ন ৬ লেয়ার হানিকম্ব নরম বুনন',
      '১ পিস, ২ পিস, ৪ পিস বা ৮ পিস সাশ্রয়ী বান্ডেল অফার',
      'মেশিনে ধোয়া যায় এবং ৫০+ ওয়াশের পরেও নরম থাকে'
    ],
    specifications: {
      'উপাদান': '১০০% পিওর অর্গানিক মসলিন কটন',
      'সাইজ': '২৫ সেমি x ২৫ সেমি (৯.৮ x ৯.৮ ইঞ্চি)',
      'পরিষ্কার': 'মেশিন ওয়াশ উপযোগী'
    },
    isNewArrival: true,
    badge: 'বান্ডেল অফার',
    bundleTiers: [
      { id: 'b-1', pieces: 1, title: '১ পিস', price: 100, originalPrice: 150, badge: 'স্ট্যান্ডার্ড' },
      { id: 'b-2', pieces: 2, title: '২ পিস', price: 200, originalPrice: 300, badge: '৳২০ ছাড়' },
      { id: 'b-4', pieces: 4, title: '৪ পিস', price: 400, originalPrice: 600, badge: 'সেরা মান' },
      { id: 'b-8', pieces: 8, title: '৮ পিস', price: 800, originalPrice: 1200, badge: 'সুপার সেভার' }
    ]
  },
  {
    id: 'prod-16',
    name: 'কমপ্লিট ১০-পিস বেবি হেলথকেয়ার ও গ্রুমিং নার্সারি কেয়ার কিট',
    slug: 'complete-baby-grooming-healthcare-nursery-kit',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 990,
    originalPrice: 1550,
    discountPercent: 36,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.pexels.com/photos/7282619/pexels-photo-7282619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'নবজাতকের প্রাথমিক চিকিৎসা ও সাজসজ্জার প্রয়োজনীয় ১০টি সামগ্রী একসাথে মজবুত ট্রাভেল ব্যাগে: থার্মোমিটার, নেজাল অ্যাসপিরেটর, নখ কাটার ও ব্রাশ।',
    description: `ছোট্ট সোনামণির প্রতিদিনের স্বাস্থ্য ও রূপচর্চায় প্রস্তুত থাকুন পূর্ণাঙ্গ ১০ পিসের এই প্রিমিয়াম কেয়ার কিট নিয়ে। এতে রয়েছে ডিজিটাল থার্মোমিটার, নরম সিলিকনের নেজাল অ্যাসপিরেটর (নাকের শ্লেষ্মা পরিষ্কারের জন্য), আল্ট্রা-সফট ব্রাশ, গোল মাথার নিরাপদ কাঁচি, ড্রপার ও ফিঙ্গার টুথব্রাশ।`,
    features: [
      '১০টি জরুরি স্বাস্থ্য ও সাজসজ্জার সামগ্রী জিপারসহ ট্রাভেল ব্যাগে সাজানো',
      'শিশুর সংবেদনশীল নাকের জন্য নরম সিলিকন বাল্ব নেজাল অ্যাসপিরেটর',
      'দ্রুত শরীরের তাপমাত্রা পরিমাপে ডিজিটাল ফিভার থার্মোমিটার',
      'নবজাতকের নরম মাথার তালু ও চুলের উপযোগী সুপার সফট ব্রাশ'
    ],
    specifications: {
      'সেট অন্তর্ভুক্ত': '১০টি প্রয়োজনীয় নার্সারি কেয়ার সামগ্রী + স্টোরেজ ব্যাগ',
      'নিরাপত্তা': 'বিপিএ-মুক্ত, জং-রোধী স্টেইনলেস স্টিল, শিশুদের নিরাপদ গোলাকার প্রান্ত',
      'উপযুক্ততা': 'বেবি শাওয়ার গিফট ও নবজাতকের প্রাথমিক সেট হিসেবে সেরা'
    },
    isNewArrival: true,
    isRecommended: true
  }
];

const getStoredProducts = (): Product[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_products') : null;
    let list = initialProductsList;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.map(p => ({
      ...p,
      category: getCategoryDisplayName(p.category || p.categorySlug)
    }));
  } catch {}
  return initialProductsList;
};

export const products: Product[] = getStoredProducts();

export const getProductById = (id: string): Product | undefined => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_products') : null;
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      const found = parsed.find(p => p.id === id);
      if (found) {
        return {
          ...found,
          category: getCategoryDisplayName(found.category || found.categorySlug)
        };
      }
    }
  } catch {}
  const found = products.find(p => p.id === id);
  return found ? { ...found, category: getCategoryDisplayName(found.category || found.categorySlug) } : undefined;
};

export const getProductBySlug = (slug: string): Product | undefined => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('baby_admin_products') : null;
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      const found = parsed.find(p => p.slug === slug);
      if (found) {
        return {
          ...found,
          category: getCategoryDisplayName(found.category || found.categorySlug)
        };
      }
    }
  } catch {}
  const found = products.find(p => p.slug === slug);
  return found ? { ...found, category: getCategoryDisplayName(found.category || found.categorySlug) } : undefined;
};
