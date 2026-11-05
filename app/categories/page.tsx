"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Layers, ArrowRight, Store } from "lucide-react";
import { getCategories, getSubcategories } from "@/lib/db";
import { Category, Subcategory } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, subs] = await Promise.all([
          getCategories(),
          getSubcategories(),
        ]);
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        console.error("Categories page load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          Browse Our Catalog
        </span>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Explore All Categories & Departments
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Discover traditional herbal remedies, pure Sidr honey, and natural health products categorized for easy navigation.
        </p>
      </div>

      {/* Categories Grid with Subcategories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl flash-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const childSubs = subcategories.filter((s) => s.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500/60 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="aspect-square w-16 h-16 flex-none rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100 p-1">
                      <img
                        src={cat.image_url || "/images/logo.png"}
                        alt={cat.name}
                        className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                        {cat.name}
                      </h2>
                      {cat.name_ur && (
                        <p className="font-arabic text-xs font-semibold text-emerald-700 mt-0.5" dir="rtl">
                          {cat.name_ur}
                        </p>
                      )}
                    </div>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}

                  {/* Multi-tier Subcategories */}
                  {childSubs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Sub-departments:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {childSubs.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                            className="rounded-md bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View all in {cat.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
