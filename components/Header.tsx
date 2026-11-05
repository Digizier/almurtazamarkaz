"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  HeartHandshake, 
  Sparkles, 
  Store,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { Product, SiteSettings, Category } from "@/lib/types";
import { getCart, getSiteSettings, getProducts, getCategories } from "@/lib/db";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCount = () => {
      const items = getCart();
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCount();
    getSiteSettings().then(setSettings);
    getCategories().then(setCategories);

    window.addEventListener("amm_cart_updated", updateCount);
    window.addEventListener("amm_settings_updated", () => getSiteSettings().then(setSettings));

    // Close search dropdown on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("amm_cart_updated", updateCount);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search with Pakistani Hinglish support
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const res = await getProducts({ search: searchQuery, limit: 5 });
      setSearchResults(res.products);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Don't render public header inside admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Spiritual Services", href: "/services" },
    { name: "Herbal Store", href: "/shop", badge: "Shop" },
    { name: "Categories", href: "/categories" },
    { name: "Welfare & Langar", href: "/welfare" },
    { name: "About Peer Sahib", href: "/about" },
    { name: "Articles", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top Announcement Bar */}
        <div className="bg-emerald-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                <Sparkles className="h-3 w-3" /> Al-Murtaza Spiritual Center
              </span>
              <span className="hidden md:inline text-emerald-200">|</span>
              <span className="hidden md:inline font-arabic text-emerald-100" dir="rtl">
                المرتضیٰ مرکزِ روحانیت — یقین، دعا، نسبت اور خدمتِ انسانیت
              </span>
            </div>

            <div className="flex items-center gap-4 text-emerald-100">
              <span className="hidden sm:inline">
                🚚 Free Delivery over Rs. {settings?.free_delivery_threshold || 2500}
              </span>
              <a
                href={`https://wa.me/923299888909?text=Assalam-o-Alaikum%20Al-Murtaza%20Spiritual%20Center`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span className="font-semibold">0329-9888909</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-none group">
              <img
                src="/images/logo.png"
                alt="Al-Murtaza Spiritual Center"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ maxHeight: "48px", width: "auto" }}
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-extrabold tracking-tight text-emerald-950 group-hover:text-emerald-700 leading-none">
                  Al-Murtaza
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-600 tracking-wider uppercase mt-0.5">
                  Spiritual Center
                </span>
              </div>
            </Link>

            {/* Smart Pakistani Hinglish Search Bar (Desktop & Tablet) */}
            <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                  placeholder="Search kalonji oil, honey, shehad, ispaghol, churan..."
                  className="w-full rounded-full border border-slate-300/80 bg-slate-50/80 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                {isSearching && (
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 animate-pulse">
                    ...
                  </span>
                )}
              </div>

              {/* Instant Search Results Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 divide-y divide-slate-100">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50/70 transition-colors"
                    >
                      <img
                        src={item.main_image_url}
                        alt={item.name}
                        className="h-10 w-10 flex-none rounded-md object-cover bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] font-bold text-emerald-800">
                          Rs. {(item.sale_price || item.price).toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                  ))}
                  <div className="pt-1.5 px-2 text-center">
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Cart + WhatsApp + Mobile Menu Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Action */}
              <a
                href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Al-Murtaza%20Spiritual%20Center"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                <span>Spiritual Consultation</span>
              </a>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center rounded-full bg-emerald-800 p-2 text-white hover:bg-emerald-900 transition-transform active:scale-95 shadow-xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-slate-950 shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Appears under logo on small screens) */}
          <div className="mt-2.5 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal oils, honey, kalonji, ispaghol..."
                className="w-full rounded-full border border-slate-300/80 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Mobile Dropdown Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="mt-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg divide-y divide-slate-100">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-slate-50"
                  >
                    <img src={item.main_image_url} alt={item.name} className="h-8 w-8 rounded object-cover" />
                    <span className="text-xs font-medium text-slate-900 truncate flex-1">{item.name}</span>
                    <span className="text-xs font-bold text-emerald-800">
                      Rs. {(item.sale_price || item.price).toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block border-t border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-2.5 px-3 transition-colors ${
                      isActive
                        ? "text-emerald-800 font-bold border-b-2 border-emerald-700"
                        : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50 rounded-t-md"
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="ml-1.5 rounded-full bg-emerald-600 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/admin"
              prefetch={false}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-700 py-2 px-2"
            >
              Portal Login
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 px-3">
                <span>Direct Helpline</span>
                <span className="font-bold text-emerald-800">0329-9888909</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Slide-Out Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
