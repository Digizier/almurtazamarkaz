"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Calendar, BookOpen } from "lucide-react";
import { getBlogArticles } from "@/lib/db";
import { BlogArticle } from "@/lib/types";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogArticles().then((articles) => {
      const found = articles.find((a) => a.slug === slug);
      setArticle(found || null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 flash-shimmer h-96 rounded-2xl my-8" />;
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-lg font-bold">Article Not Found</h2>
        <Link href="/blog" className="mt-4 inline-block text-xs font-semibold text-emerald-700 underline">
          &larr; Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" /> All Articles
      </Link>

      <span className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
        {article.category}
      </span>

      <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
        {article.title}
      </h1>

      {article.title_ur && (
        <p className="font-arabic text-base sm:text-lg font-bold text-emerald-800 mt-2" dir="rtl">
          {article.title_ur}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 py-3 border-y border-slate-100 my-4">
        <span>By <strong>{article.author}</strong></span>
        <span>&bull;</span>
        <span>Al-Murtaza Spiritual Center</span>
      </div>

      {article.cover_image_url && (
        <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 my-6 shadow-xs">
          <img src={article.cover_image_url} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="prose prose-emerald max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
        <p className="font-medium text-slate-900 text-sm sm:text-base">{article.excerpt}</p>
        <div className="whitespace-pre-line">{article.content}</div>
      </div>
    </article>
  );
}
