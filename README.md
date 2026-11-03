# BabyBazar - Baby Products E-Commerce Platform
> Built with reference to [HT Bazar](https://htbazar.com/)'s layout, visual hierarchy, and conversion structure, adapted specifically for baby products, mother care essentials, and 100% Cash on Delivery (COD) across Bangladesh.

---

## 🌟 Refined Highlights (Streamlined & Clean)

### 1. Brand Identity & Header
- **Top Utility Bar**: Hotline phone inquiry (`+880 9617-100900`), FAQs, and nationwide delivery banner.
- **Brand Identity**: Modern SVG baby logo emblem with soothing violet-purple (`#6044f0`), deep navy (`#0b0952`), and baby coral accents.
- **Instant Search**: Centered search bar with live autocomplete dropdown preview showing product thumbnails, BDT prices, and discount badges.
- **Category Navigation**: "All Categories" mega dropdown menu and horizontal department navigation bar.
- **Mobile Experience**: Responsive mobile header and sticky bottom navigation bar (Home, Categories, Cart, Call Now).

### 2. Homepage Architecture (HT Bazar Layout)
- **Hero Promotional Carousel**: 3 interactive slides featuring organic cotton sets, anti-colic feeding gear, and smart care gadgets, flanked by two quick-order promo tiles.
- **Product Categories (8 Departments)**:
  1. Baby Clothing
  2. Baby Feeding
  3. Baby Care
  4. Baby Toys
  5. Baby Bath & Hygiene
  6. Baby Accessories
  7. Baby Safety
  8. Mother & Baby Essentials
- **Featured Product Sections (HT Bazar 4-Column Grid)**:
  - Best Sellers
  - Trending Baby Products
  - New Arrivals
  - Just For You
  - Recommended Products
- **Promotional Inter-Section Banners**:
  - Newborn Starter Bundle (12 essentials, save ৳1,200)
  - Sensory Montessori Toys & Teething relief
- **Trust & Benefits Section**: 4 pillars: Cash on Delivery, Quality Baby Products, Nationwide Delivery, and Customer Support.
- **HT Bazar-Style Footer**: Brand description, hotline, Dhaka office address, category links, policies, and newsletter subscription.

### 3. Dedicated Single Product Page
- **Product Gallery**: High-resolution image view with clickable thumbnail carousel and zoom preview.
- **Pricing**: Bangladeshi Taka (BDT ৳) pricing, previous price strikethrough, discount pill, and savings calculation.
- **Conversion CTAs**:
  - **"Order Now (Cash on Delivery)"**: Opens instant COD express checkout.
  - **"Add to Cart"**: Smoothly updates cart with drawer slide-out.
  - **Phone Hotline**: Direct call badge for parents who prefer phone ordering.
- **Delivery Assurance Box**: Clear fee breakdown for Inside Dhaka (৳70) and Outside Dhaka (৳130), with parcel inspection guarantee.
- **Detailed Tabbed Information**:
  - Description & Parent usage tips
  - Technical Specifications table (Materials, Age range, Certifications, Origin)
  - Cash on Delivery procedure
  - 7-Day Easy Replacement Policy
- **Related & Recommended Grids**: 4-column product recommendations.

### 4. Shopping Cart & 100% Cash on Delivery (COD) Checkout
- **Slide-out Cart Drawer**:
  - Update quantities (`+` / `-`) or remove items.
  - Delivery zone toggle (Inside Dhaka ৳70 / Outside Dhaka ৳130) with automatic total recalculation.
  - Promo coupon support (e.g. `BABY10` for 10% OFF).
  - Subtotal, delivery fee, discount, and order total in BDT (৳).
- **Cash on Delivery Checkout Modal**:
  - Full Name
  - Mobile Phone Number (11-digit BD validation)
  - Full Address (House, Road, Area)
  - District dropdown (all BD districts)
  - Thana / Upazila
  - Delivery rider notes (optional)
  - **Strictly COD**: No online payment gateways.
- **Order Confirmation Modal**:
  - Generated Order ID (e.g. `BABY-829103`)
  - Order summary & payable amount
  - Delivery timeline and verification call notice.

---

## 🚀 How to Run

### Development Server:
```bash
npm.cmd run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Production Preview:
```bash
npm.cmd run build
npm.cmd run preview -- --port 5173
```
