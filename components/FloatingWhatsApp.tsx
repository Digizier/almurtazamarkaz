"use client";

import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      aria-label="WhatsApp Helpline"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-7 z-40 flex items-center group"
    >
      {/* Tooltip on desktop hover */}
      <div className="hidden md:flex items-center mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl border border-slate-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
        <span>Spiritual & Order Helpline</span>
      </div>

      {/* Floating Circular WhatsApp Button */}
      <a
        href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Al-Murtaza%20Spiritual%20Center%20%7C%20I%20would%20like%20guidance"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#25D366]/20"
        aria-label="Direct WhatsApp Consultation"
      >
        {/* Subtle Online Pulse Wave */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />

        {/* Real Official WhatsApp Vector Icon */}
        <svg
          className="h-7 w-7 sm:h-8 sm:w-8 fill-white drop-shadow-xs"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.419-.101.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.938l-1.564 5.822 5.963-1.564c1.713.936 3.676 1.474 5.768 1.474 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
        </svg>

        {/* Small Active Green Dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white ring-2 ring-[#25D366]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </a>
    </aside>
  );
}
