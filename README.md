# Al-Murtaza Spiritual Center (المرتضیٰ مرکزِ روحانیت)

Official web portal and e-commerce platform for **Al-Murtaza Spiritual Center** (`almurtazamarkaz.com`), founded by **Peer Muhammad Usman Alvi**. Providing authentic Tibb-e-Nabawi herbal healthcare, certified spiritual consultation & guidance (Istikhara, Ruqyah, Rohani Ilaj), and humanitarian welfare initiatives across Pakistan.

---

## 🌟 Key Highlights & Architecture

- **Framework**: [Next.js](https://nextjs.org/) 16 App Router (React 19, TypeScript).
- **Styling**: Tailwind CSS v4 with custom emerald & gold spiritual Islamic palette.
- **Backend & Database**: [Supabase](https://supabase.com/) Postgres with Row Level Security (RLS) & real-time client.
- **Media & CDN**: Supabase Storage Buckets (`banners`, `products`, `categories`, `gallery`, `content`) serving ultra-optimized WebP assets.
- **Hosting / Edge**: Configured for Cloudflare Pages / Vercel with static export (`output: 'export'`).
- **Mobile-First UX**:
  - Responsive 2-column mobile product cards with quick "Add to Cart" and "Buy Now".
  - Floating curved bottom dock navigation with active indicator dots.
  - Floating official WhatsApp quick-connect button (`#25D366`) with hover tooltips and active pulse ring.
  - Fast localized search with instant filtering.
- **Security**:
  - Protected Admin Dashboard (`/admin`) for full inventory, orders, welfare, and blog management.
  - Hardened master access controls with zero client-side credential exposure.
  - Rate-limit friendly with client-side cached dataset fallbacks to avoid hitting API quotas.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or yarn

### 2. Environment Variables
Copy `.env.example` to `.env.local` and set your credentials:

```bash
cp .env.example .env.local
```

Required keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_ADMIN_PIN=<secure-admin-password>
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
```
Generates a fully pre-rendered, optimized static export in `./out` ready for deployment to Cloudflare Pages, Vercel, or any high-performance static CDN.

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx         # Root layout with SEO metadata, favicons, CartProvider
│   ├── page.tsx           # High-converting Homepage (Banners, Categories, Featured Products, Welfare, Blog)
│   ├── shop/              # Full catalog with category filters and price range
│   ├── product/[slug]/    # Product detail page with image gallery and reviews
│   ├── checkout/          # Streamlined Cash on Delivery (COD) & EasyPaisa/JazzCash checkout
│   ├── services/          # Spiritual services (Istikhara, Ruqyah, Consultation)
│   ├── welfare/           # Welfare projects & humanitarian donation transparency
│   ├── blog/              # Educational health & spiritual articles
│   ├── about/             # Mission, vision, and biography of Peer Muhammad Usman Alvi
│   ├── contact/           # Contact form and physical office guidance
│   ├── policies/          # Shipping, Returns, Privacy, and Terms
│   └── admin/             # Secure portal for Orders, Products, Blog, and Welfare
├── components/            # Header, Footer, HeroBanner, MobileBottomNav, FloatingWhatsApp, CartDrawer
├── lib/
│   ├── supabase.ts        # Supabase client singleton
│   ├── types.ts           # TypeScript interfaces (Product, Category, Order, etc.)
│   ├── store.ts           # Cart state management
│   └── data.ts            # High-fidelity fallback database for 100% offline uptime
└── public/
    ├── favicon.ico        # Multi-resolution binary Windows favicon
    ├── icon.png           # 512x512 PWA app icon
    └── images/            # Static local image fallbacks
```

---

## 📱 Social & Contact Details

- **Website**: [almurtazamarkaz.com](https://almurtazamarkaz.com)
- **WhatsApp / Call**: `+92 329 9888909`
- **Email**: `almurtazamarkaz1@gmail.com`
- **YouTube**: [@AlmurtazaMarkaz](https://www.youtube.com/@AlmurtazaMarkaz)
- **Instagram**: [@almurtazamarkaz](https://www.instagram.com/almurtazamarkaz)
- **TikTok**: [@almurtazamarkaz](https://www.tiktok.com/@almurtazamarkaz)
- **Facebook**: [Al-Murtaza Spiritual Center](https://www.facebook.com/profile.php?id=61595790195208)

---

## 📄 License
All rights reserved © Al-Murtaza Spiritual Center.
