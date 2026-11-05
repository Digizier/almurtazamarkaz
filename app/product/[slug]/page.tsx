import { getProducts, getProductBySlug } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";

// Required for Next.js static export
export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 100 });
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
