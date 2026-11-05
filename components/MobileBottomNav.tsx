"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Store, ShoppingBag, MessageCircle } from "lucide-react";
import { getCart } from "@/lib/db";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = getCart();
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCount();
    window.addEventListener("amm_cart_updated", updateCount);
    return () => window.removeEventListener("amm_cart_updated", updateCount);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Spiritual", href: "/services", icon: Sparkles },
    { label: "Herbal Shop", href: "/shop", icon: Store },
    { label: "Cart", href: "/checkout", icon: ShoppingBag, badge: cartCount },
    { 
      label: "WhatsApp", 
      href: "https://wa.me/923299888909?text=Assalam-o-Alaikum%20Al-Murtaza%20Spiritual%20Center", 
      icon: MessageCircle,
      external: true 
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-2 left-2.5 right-2.5 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-emerald-950/15 shadow-2xl shadow-emerald-950/20 rounded-2xl p-1.5 transition-all"
    >
      <div className="grid grid-cols-5 gap-1 items-center">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 active:scale-95 transition-all duration-200"
              >
                <div className="relative">
                  <Icon className="h-5 w-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-semibold mt-0.5 text-emerald-800 leading-none">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-gradient-to-b from-emerald-50 to-emerald-100/80 text-emerald-900 font-bold border border-emerald-200/60 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive
                      ? "text-emerald-800 stroke-[2.4] scale-105"
                      : "text-slate-500 stroke-[1.8]"
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-1 text-[9px] font-black text-slate-950 shadow-xs ring-2 ring-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] mt-0.5 leading-none ${
                  isActive ? "text-emerald-900 font-bold" : "text-slate-600 font-medium"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-emerald-700 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
