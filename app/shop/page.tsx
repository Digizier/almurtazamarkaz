"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Store, Zap } from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const isFlash = searchParams.get("filter") === "flash";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Categories once
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Fetch products on filter change
  useEffect(() => {
    async function loadShopProducts() {
      setLoading(true);
      try {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        const res = await getProducts({
          categoryId: catObj?.id,
          search: searchQuery,
          isFlashDeal: isFlash ? true : undefined,
          page: page,
          limit: 8, // Strictly 8 products per page
        });

        setProducts(res.products);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
      } catch (err) {
        console.error("Shop product fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadShopProducts();
  }, [selectedCategory, searchQuery, isFlash, page, categories]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-800 p-5 sm:p-8 text-white shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Store className="h-4 w-4" /> Al-Murtaza Herbal & Wellness Store
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold mt-1">
              {isFlash ? "⚡ Flash Deals & Special Offers" : "Pure Herbal Products & Natural Remedies"}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              100% natural, hygienic, chemical-free herbal oils, Sidr honey, and traditional wellness formulations.
            </p>
          </div>

          <div className="text-right text-xs text-emerald-200">
            <span className="font-bold text-white text-base sm:text-xl">{totalCount}</span> Products Available
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
        {/* Category Pills (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => { setSelectedCategory(""); setPage(1); }}
            className={`flex-none rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === ""
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
              className={`flex-none rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search herbal products..."
            className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
          />
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-3/4 rounded-xl flash-shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Store className="mx-auto h-12 w-12 text-slate-300 stroke-1" />
          <h3 className="text-base font-bold text-slate-800 mt-3">No products found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search or selecting a different category.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory(""); setSearchQuery(""); setPage(1); }}
            className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Pagination (8 Products Max Per Page) */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-200 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  p === page
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-xs text-slate-400">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
