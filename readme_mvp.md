# 🧾 Kolzo E-Commerce Frontend Specification (Inspired by Gucci)

---

## 🎯 Brand Vision

Kolzo is a luxury fashion and makeup brand. Its web presence must reflect **minimalism, elegance, and spaciousness** — much like Gucci’s, but with **subtle modern differences** to maintain originality. This frontend will be built entirely using:

- **React + TailwindCSS + Vite**
- Focus is **only on the frontend**: layout, responsiveness, and animations.
- **No backend or real data needed yet**

---

## 🌐 General UI/UX Principles

- Clean, white, airy layout with generous spacing  
- Neutral color palette: **#FFFFFF**, **#000000**, soft grays  
- **Luxurious serif fonts** for titles, **clean sans-serif** for body  
- Smooth, subtle **animations and transitions** (hover, scroll, menu)  
- Full-width crisp image tiles with minimal overlays  
- Fully **responsive** and **mobile-first** design  

---

## 📐 Page Structure Overview

### 🏠 `/` Homepage

#### 🧩 Hero Banner (Top)
- Fullscreen banner (image or video)
- Centered Kolzo logo
- Centered or bottom-aligned CTA: “Shop Now”
- **Fade-in on load**, subtle zoom on scroll or hover

---

### 🔁 Sticky Header Behavior
- Initially: **Large centered logo overlapping the hero banner**
- On scroll:
  - Shrinks logo
  - Sticky white top bar slides down
  - Bar includes:
    - Smaller Kolzo logo
    - Icons: Search, Account, Wishlist, Cart
    - Hamburger menu on mobile

---

### 🖼️ Featured Collections Section — *"Curated by Kolzo"*
- **2x2 Grid** featuring 4 curated tiles:
  - Lipsticks
  - Handbags
  - Wallets
  - Perfumes
- Each tile:
  - Square image
  - Hover: smooth zoom-in
  - Click: routes to category page

---

### 🧍‍♀️🧍 Gender-Specific Entry Buttons
- Displayed below curated grid
- Two clean, elegant buttons:
  - **Shop Women → `/collections/women`**
  - **Shop Men → `/collections/men`**

---

## 🧭 Category Pages

### 👩 `/collections/women`

- 8 sections:
  - Lipstick
  - Handbags
  - Perfumes
  - Blush
  - Compact
  - Lip Balm
  - Wallet
  - *(Optional Add-on)* Eyeliner

### 👨 `/collections/men`

- 8 sections:
  - Fragrance
  - Wallet
  - Belts
  - Face Wash
  - Backpacks
  - Shoes
  - Sunglasses
  - Shaving Kit

### Layout for Each:
- Title banner (e.g. “Handbags”)
- Product grid:
  - 2–4 column responsive layout
  - Filters & Sort controls:
    - Filter by category, price, material
    - Sort by Newest, Price (asc/desc)
  - Product cards with:
    - Image
    - Hover zoom or image-swap
    - Name, Price
    - Wishlist icon

---

## 🛍️ `/product/:id` Product Detail Page

- Hero gallery with:
  - Main image + thumbnails
  - Swipe or click to view
- Product Info:
  - Title
  - Description
  - Price
  - Variant selectors (size, color)
- CTA: Add to Cart
- Wishlist heart icon
- Tabs: Details | Shipping | Returns
- Carousel: Related Products

---

## 🧺 `/cart`

- Cart Summary:
  - Product thumbnails
  - Quantity controls
  - Price, Subtotal
  - Remove icon
- Right (or bottom on mobile):
  - Cart total
  - Checkout button (dummy for now)
  - “Continue Shopping” link
- Stored in **localStorage or Zustand**

---

## ❤️ `/wishlist`

- Grid of favorited products
- Remove from wishlist icon
- Empty state message

---

## 🔍 `/search`

- Triggered by icon in sticky nav
- Opens modal or overlay
- Filters as user types (client-side)
- Suggests matching products

---

## 📩 Newsletter Section (Homepage/Footer)

- Dark background section
- Headline: *“Sign up for Kolzo Updates”*
- Email input
- Button: “Subscribe”
- Terms/consent text

---

## 🦶 Footer (Sticky at Bottom or Page End)

- Responsive 3-column layout:
  - Help: Contact Us, FAQs, Shipping Info
  - Brand: About, Careers, Policies
  - Location selector with globe icon
  - Social media icons
- Mobile: collapses into accordion
- Copyright

---

## 📱 Mobile Menu

### Trigger:
- Hamburger icon ☰

### Behavior:
- Full-screen overlay from right
- Items stacked vertically:
  - New In
  - Women
  - Men
  - Handbags
  - Fragrances and Makeup
  - Jewelry & Watches
  - Décor & Lifestyle
  - Gifts
  - Kolzo Services
  - Store Locator
  - Saved Items
  - Contact Us
- Close icon: ×
- Smooth **slide-in and fade** animations

---

## ⚙️ Components Overview

```txt
<Navbar />         → Scroll-reactive, sticky, responsive
<HeroBanner />     → Image + CTA overlay
<ProductCard />    → Hover animations, wishlist
<ProductGrid />    → 2–4 column layout, responsive
<Filters />        → Sorting + filtering logic
<Footer />         → Email + links + socials


src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroBanner.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   └── Filters.jsx
├── pages/
│   ├── Home.jsx
│   ├── ProductDetail.jsx
│   ├── CategoryPage.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   └── Search.jsx
├── assets/        # Static images, logos
├── data/          # Dummy product data JSON
├── App.jsx
├── main.jsx
└── index.css


| Package          | Purpose               |
| ---------------- | --------------------- |
| react            | UI framework          |
| react-router-dom | Routing               |
| tailwindcss      | Styling               |
| framer-motion    | Animations            |
| zustand/context  | State (cart/wishlist) |
| clsx (optional)  | ClassName management  |


{
  "id": "kolzo-001",
  "name": "Kolzo Signature Bag",
  "price": 2700,
  "image": "/assets/bag-1.jpg",
  "category": "Handbags",
  "description": "Crafted with the finest vegan leather."
}


✅ MVP Checklist
 Sticky header with scroll-triggered logo

 Responsive homepage with curated + gender buttons

 Category pages with filtering and product grid

 Product detail page with gallery + wishlist

 Cart functionality (local storage)

 Wishlist page

 Search modal

 Full-screen mobile menu

 Smooth hover + scroll animations

 Responsive and mobile-first layout


 🧭 Brand Distinction vs Gucci
Kolzo borrows inspiration from Gucci’s minimal elegance, but includes:

Custom logo (not Gucci’s serif)

More modern icons and UI spacing

Subtle rounded corners, shadows

Unique filters and transitions

Carefully chosen fonts and image tones

Out of Scope for MVP: (These things will be added once the frontend is fully ready, leave placeholders for now)
User login / auth

Payment or checkout

Real backend / API

Inventory or admin panel

CMS / blog

Language selection

