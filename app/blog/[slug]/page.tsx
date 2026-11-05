import { getBlogArticles } from "@/lib/db";
import BlogDetailClient from "./BlogDetailClient";

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
