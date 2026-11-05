import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <h2 className="text-base font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested page could not be located on Al-Murtaza Spiritual Center.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
          >
            <Home className="h-4 w-4" /> Return to Homepage
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Visit Herbal Store
          </Link>
        </div>
      </div>
    </div>
  );
}
