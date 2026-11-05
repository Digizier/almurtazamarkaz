"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, User, Calendar } from "lucide-react";
import { getBlogArticles } from "@/lib/db";
import { BlogArticle } from "@/lib/types";

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          Islamic & Herbal Knowledge
        </span>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Articles & Spiritual Wellness Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Read beneficial guides on Sunnah Ruqyah, Istikhara methodology, and the healing virtues of Tibb-e-Nabawi.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl flash-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all"
            >
              <div>
                <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={art.cover_image_url || "/images/banner-main.png"}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  <span>{art.category}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
                  {art.title}
                </h2>

                {art.title_ur && (
                  <p className="font-arabic text-xs font-semibold text-emerald-800 mt-1" dir="rtl">
                    {art.title_ur}
                  </p>
                )}

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">By {art.author}</span>
                <Link
                  href={`/blog/${art.slug}`}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
