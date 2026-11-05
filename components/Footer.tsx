"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-emerald-950/20 bg-slate-950 text-slate-300">
      {/* Trust & Service Highlights Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Sparkles className="h-5 w-5 text-amber-400 flex-none" />
            <div>
              <p className="text-xs font-bold text-white">17+ Years of Service</p>
              <p className="text-[11px] text-slate-400">Authentic Spiritual Guidance</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <HeartHandshake className="h-5 w-5 text-emerald-400 flex-none" />
            <div>
              <p className="text-xs font-bold text-white">Humanitarian Welfare</p>
              <p className="text-[11px] text-slate-400">Ration & Langar Support</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-amber-400 flex-none" />
            <div>
              <p className="text-xs font-bold text-white">100% Pure Herbal</p>
              <p className="text-[11px] text-slate-400">Natural & Traditional Remedies</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Phone className="h-5 w-5 text-emerald-400 flex-none" />
            <div>
              <p className="text-xs font-bold text-white">Nationwide Delivery</p>
              <p className="text-[11px] text-slate-400">Cash on Delivery & Online Pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Organization Identity */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="Al-Murtaza Spiritual Center"
                className="h-12 sm:h-14 w-auto object-contain bg-white/10 p-1 rounded-lg"
                style={{ maxHeight: "56px", width: "auto" }}
              />
              <div>
                <span className="block text-base sm:text-lg font-bold text-white leading-tight">
                  Al-Murtaza Spiritual Center
                </span>
                <span className="block font-arabic text-xs sm:text-sm text-emerald-400 font-semibold mt-0.5" dir="rtl">
                  المرتضیٰ مرکزِ روحانیت
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Under the spiritual mentorship of <strong>Hazrat Peer Muhammad Usman Alvi Sahib</strong>. Serving humanity for over 17 years through Quranic teachings, spiritual counseling, welfare assistance, and authentic herbal wellness.
            </p>

            <p className="font-arabic text-xs text-amber-300 font-medium" dir="rtl">
              یقین، دعا، نسبت اور خدمتِ انسانیت
            </p>

            {/* Social Media Links */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href="https://www.youtube.com/@AlmurtazaMarkaz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/15 text-red-500 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595790195208"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/15 text-blue-500 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/almurtazamarkaz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white hover:opacity-90 transition-all transform hover:scale-110 shadow-xs"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@almurtazamarkaz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 hover:bg-black hover:text-[#00f2fe] transition-all transform hover:scale-110 shadow-xs"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.33 6.33 0 0 0 3 15.6a6.34 6.34 0 0 0 10.82 4.48c1.64-1.64 2.45-3.83 2.45-6.22V8.04a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.45-.47z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Spiritual & Welfare Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 text-amber-400">
              Spiritual & Welfare
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">
                  Rohani Ilaj & Guidance
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">
                  Istikhara Online
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">
                  Sunnah Ruqyah & Wazaif
                </Link>
              </li>
              <li>
                <Link href="/welfare" className="hover:text-emerald-400 transition-colors">
                  Monthly Ration Drive
                </Link>
              </li>
              <li>
                <Link href="/welfare" className="hover:text-emerald-400 transition-colors">
                  Daily Langar & Hospitality
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Peer Muhammad Usman Alvi
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Herbal Store Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 text-emerald-400">
              Herbal & Wellness Store
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition-colors">
                  All Herbal Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=flash" className="hover:text-emerald-400 transition-colors">
                  Flash Deals
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-emerald-400 transition-colors">
                  Cart & Fast Checkout
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-emerald-400 transition-colors">
                  Delivery & Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-emerald-400 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Service Locations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 text-amber-400">
              Contact & Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 flex-none mt-0.5" />
                <span>
                  <strong>Service Locations:</strong><br />
                  Rawalpindi Saddar & Chakwal, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 flex-none" />
                <a href="https://wa.me/923299888909" className="hover:text-emerald-300">
                  0329-9888909
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 flex-none" />
                <a href="mailto:almurtazamarkaz1@gmail.com" className="hover:text-emerald-300 truncate">
                  almurtazamarkaz1@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4 rounded-lg bg-emerald-950/60 p-2.5 border border-emerald-900/60">
              <p className="text-[11px] text-emerald-200">
                Spiritual consultation is provided purely for the pleasure of Allah and service of humanity.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-2">
          <p className="max-w-3xl mx-auto text-slate-400 text-[10px] leading-relaxed">
            *Medical Disclaimer: Herbal and traditional wellness products are prepared from natural herbs. Statements regarding dietary supplements have not been evaluated by conventional authorities and are not intended to diagnose, treat, cure, or prevent any medical disease. Consult a qualified physician for severe ailments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 pt-2">
            <span>&copy; {new Date().getFullYear()} Al-Murtaza Spiritual Center (المرتضیٰ مرکزِ روحانیت). All rights reserved.</span>
            <Link href="/admin" prefetch={false} className="text-slate-600 hover:text-slate-400">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
