"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  HeartHandshake, 
  ShieldCheck, 
  Phone, 
  Star, 
  CheckCircle, 
  BookOpen, 
  ChevronRight,
  Clock
} from "lucide-react";
import { 
  getBanners, 
  getCategories, 
  getProducts, 
  getSpiritualServices, 
  getWelfareProjects, 
  getBlogArticles 
} from "@/lib/db";
import { Banner, Category, Product, SpiritualService, WelfareProject, BlogArticle } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [spiritualServices, setSpiritualServices] = useState<SpiritualService[]>([]);
  const [welfareProjects, setWelfareProjects] = useState<WelfareProject[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          fetchedBanners,
          fetchedCats,
          flashRes,
          featRes,
          services,
          welfare,
          blogList
        ] = await Promise.all([
          getBanners(true),
          getCategories(true),
          getProducts({ isFlashDeal: true, limit: 4 }), // Max 4 on home
          getProducts({ isFeatured: true, limit: 8 }),   // Max 8 on home
          getSpiritualServices(),
          getWelfareProjects(),
          getBlogArticles()
        ]);

        setBanners(fetchedBanners);
        setCategories(fetchedCats);
        setFlashDeals(flashRes.products);
        setFeaturedProducts(featRes.products);
        setSpiritualServices(services.slice(0, 4));
        setWelfareProjects(welfare.slice(0, 3));
        setArticles(blogList.slice(0, 3));
      } catch (err) {
        console.error("Home load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Auto banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-8 sm:pb-12">
      {/* 1. HERO BANNER (Pure Image Mode - Zero Text Overlay) */}
      <section className="relative w-full overflow-hidden bg-emerald-950">
        {loading || banners.length === 0 ? (
          <div className="aspect-[16/9] sm:aspect-[2.7/1] w-full flash-shimmer" />
        ) : (
          <div className="relative w-full">
            <div className="relative aspect-[16/9] sm:aspect-[2.7/1] w-full overflow-hidden flex items-center justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 640px)"
                  srcSet={banners[activeBannerIdx]?.mobile_image_url || banners[activeBannerIdx]?.desktop_image_url}
                />
                <img
                  src={banners[activeBannerIdx]?.desktop_image_url}
                  alt={banners[activeBannerIdx]?.title || "Al-Murtaza Spiritual Center Banner"}
                  className="h-full w-full object-cover object-center transition-all duration-700"
                />
              </picture>
            </div>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-2.5 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveBannerIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeBannerIdx ? "w-6 bg-amber-400" : "w-2 bg-white/60 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. INTRODUCTION & CORE VALUES */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-900 to-emerald-950 p-5 sm:p-8 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/80 px-3 py-1 text-xs font-semibold text-amber-300 border border-emerald-700/60">
                <Sparkles className="h-3.5 w-3.5" /> 17+ Years of Sincere Dedication
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Al-Murtaza Spiritual Center
              </h1>

              <p className="font-arabic text-base sm:text-xl text-amber-300 font-bold" dir="rtl">
                المرتضیٰ مرکزِ روحانیت — یقین، دعا، نسبت اور خدمتِ انسانیت
              </p>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Under the spiritual guidance of <strong>Hazrat Peer Muhammad Usman Alvi Sahib</strong>, Al-Murtaza Spiritual Center has served thousands across Pakistan and abroad through authentic Quranic teachings, spiritual healing (Rohani Ilaj), Istikhara guidance, and humanitarian welfare projects.
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  href="/services"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all active:scale-95"
                >
                  Explore Spiritual Services
                </Link>
                <Link
                  href="/shop"
                  className="rounded-lg bg-emerald-800/90 px-4 py-2 text-xs font-bold text-white border border-emerald-600 hover:bg-emerald-800 transition-all active:scale-95"
                >
                  Visit Herbal Store
                </Link>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                <span className="block text-2xl font-black text-amber-300">17+</span>
                <span className="text-[11px] text-emerald-100 font-medium">Years Serving Humanity</span>
              </div>
              <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                <span className="block text-2xl font-black text-amber-300">100%</span>
                <span className="text-[11px] text-emerald-100 font-medium">Pure Herbal Products</span>
              </div>
              <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                <span className="block text-2xl font-black text-amber-300">Daily</span>
                <span className="text-[11px] text-emerald-100 font-medium">Langar & Hospitality</span>
              </div>
              <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                <span className="block text-2xl font-black text-amber-300">Monthly</span>
                <span className="text-[11px] text-emerald-100 font-medium">Ration Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOP CATEGORIES (Continuous Smooth Auto-Scroll Carousel) */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-end justify-between mb-3.5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Explore Categories</span>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">Explore Main Categories</h2>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel Container */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-xl flash-shimmer" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-3 min-w-max">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group flex flex-col items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-xs transition-all hover:border-emerald-600/40 hover:shadow-md w-36 sm:w-44 flex-none"
                >
                  <div className="aspect-square w-24 sm:w-28 overflow-hidden rounded-full bg-emerald-50 border border-emerald-100 p-1">
                    <img
                      src={cat.image_url || "/images/logo.png"}
                      alt={cat.name}
                      className="h-full w-full rounded-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                      {cat.name}
                    </h3>
                    {cat.name_ur && (
                      <p className="font-arabic text-[11px] text-emerald-700 mt-0.5 line-clamp-1" dir="rtl">
                        {cat.name_ur}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. FLASH DEALS SECTION (Only 4 on Home, Compact 2-per-row) */}
      {flashDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-500/10 via-amber-50 to-emerald-50/50 p-4 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-xs">
                  <Zap className="h-4 w-4 fill-slate-950" />
                </span>
                <div>
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-none">
                    Flash Deals & Limited Offers
                  </h2>
                  <p className="text-[11px] text-slate-600 mt-1">Special introductory discounts on premium herbal remedies</p>
                </div>
              </div>

              <Link
                href="/shop?filter=flash"
                className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                View All Deals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 4 Flash Deals Grid (Compact 2-col on mobile) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {flashDeals.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED HERBAL PRODUCTS (Max 8 Products) */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-end justify-between mb-3.5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Pure & Natural</span>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">Featured Herbal Products</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
            View All ({featuredProducts.length}) <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-3/4 rounded-xl flash-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 6. SPIRITUAL SERVICES SECTION */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-5 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Spiritual Healing & Guidance
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">
              خدماتِ روحانی و اصلاحِ باطن
            </h2>
            <p className="text-xs text-slate-600 mt-1.5">
              All spiritual guidance, Istikhara, and Ruqyah are conducted strictly in accordance with the Quran and Sunnah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {spiritualServices.map((srv) => (
              <div
                key={srv.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-emerald-500/60 transition-all hover:shadow-md"
              >
                <div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold mb-3">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{srv.title}</h3>
                  {srv.title_ur && (
                    <p className="font-arabic text-xs font-semibold text-emerald-700 mt-0.5" dir="rtl">
                      {srv.title_ur}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20I%20would%20like%20spiritual%20guidance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ABOUT HAZRAT PEER MUHAMMAD USMAN ALVI SAHIB */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Owner Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-64 sm:w-80 overflow-hidden rounded-2xl border-4 border-emerald-800/20 shadow-xl bg-slate-100">
                <img
                  src="/images/owner.webp"
                  alt="Hazrat Peer Muhammad Usman Alvi Sahib"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Profile Bio */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Founder & Spiritual Mentor
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                Hazrat Peer Muhammad Usman Alvi Sahib
              </h2>
              <p className="font-arabic text-sm text-emerald-800 font-semibold" dir="rtl">
                پیرِ طریقت حضرت پیر محمد عثمان علوی صاحب
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For over <strong>17 years</strong>, Peer Muhammad Usman Alvi Sahib has devoted his life to guiding individuals seeking spiritual solace, healing, and moral upliftment. Under his patronage, Al-Murtaza Spiritual Center remains a sanctuary of hope, education, and humanitarian relief.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                  <span>Quran & Sunnah Rohani Ilaj</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                  <span>Istikhara Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                  <span>Monthly Family Ration Drives</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                  <span>Langar & Welfare Hospitality</span>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <Link
                  href="/about"
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-all"
                >
                  Read Full Journey
                </Link>
                <a
                  href="https://wa.me/923299888909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-emerald-700 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-all"
                >
                  Direct WhatsApp Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WELFARE & LANGAR PROJECTS */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-end justify-between mb-3.5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Service to Humanity</span>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">Welfare & Community Projects</h2>
          </div>
          <Link href="/welfare" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
            View All Projects <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {welfareProjects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all"
            >
              <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden">
                <img
                  src={proj.image_url}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1.5">
                    {proj.status}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                  {proj.title_ur && (
                    <p className="font-arabic text-xs font-semibold text-emerald-700 mt-0.5" dir="rtl">
                      {proj.title_ur}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{proj.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Locations: Rawalpindi & Chakwal</span>
                  <Link href="/welfare" className="text-emerald-700 hover:underline">
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ISLAMIC ARTICLES & HERBAL WELLNESS GUIDES */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex items-end justify-between mb-3.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Knowledge & Sunnah</span>
              <h2 className="text-base sm:text-xl font-bold text-slate-900">Articles & Wellness Guides</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              Read All Articles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="group flex flex-col sm:flex-row gap-3.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all"
              >
                <div className="aspect-16/10 sm:aspect-square w-full sm:w-36 flex-none rounded-lg bg-slate-100 overflow-hidden">
                  <img
                    src={art.cover_image_url || "/images/banner-main.png"}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">
                      {art.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-2 mt-0.5">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{art.excerpt}</p>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                    <span>By {art.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
