"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Phone, 
  Heart, 
  Minus, 
  Plus, 
  Zap, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { Product, ProductVariation } from "@/lib/types";
import { getProductBySlug, getProducts, addToCart, getSiteSettings } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"desc" | "ingredients" | "usage" | "warnings">("desc");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.main_image_url);
          if (prod.variations && prod.variations.length > 0) {
            setSelectedVariation(prod.variations[0]);
          }

          // Fetch related products from same category
          const relRes = await getProducts({ categoryId: prod.category_id, limit: 4 });
          setRelated(relRes.products.filter((p) => p.id !== prod.id));
        }
      } catch (err) {
        console.error("Product detail load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl flash-shimmer" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-lg flash-shimmer" />
            <div className="h-6 w-1/4 rounded-lg flash-shimmer" />
            <div className="h-24 rounded-lg flash-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested product could not be located.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariation?.sale_price || 
                       selectedVariation?.price || 
                       product.sale_price || 
                       product.price;
  const originalPrice = selectedVariation?.price || product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const gallery = [product.main_image_url, ...(product.gallery_urls || [])].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariation);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariation);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-emerald-700">Herbal Store</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-800 truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery / Image Viewer */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain object-center transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                Save {discountPercent}%
              </span>
            )}
            {product.is_flash_deal && (
              <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-md">
                <Zap className="h-3.5 w-3.5 fill-slate-900" /> Flash Deal
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square w-16 sm:w-20 flex-none rounded-xl border p-1 bg-white transition-all ${
                    selectedImage === img
                      ? "border-emerald-700 ring-2 ring-emerald-600/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Purchase */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                100% Authentic Herbal
              </span>
              {product.sku && (
                <span className="text-[11px] text-slate-400">SKU: {product.sku}</span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
              {product.name}
            </h1>

            {product.name_ur && (
              <p className="font-arabic text-sm sm:text-base font-bold text-emerald-800 mt-1" dir="rtl">
                {product.name_ur}
              </p>
            )}

            {/* Price Row */}
            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {product.short_description}
              </p>
            )}

            {/* Variations / Sizes */}
            {product.variations && product.variations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Size / Packing:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariation(v)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedVariation?.id === v.id
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {v.name} &mdash; Rs. {(v.sale_price || v.price).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 hover:bg-slate-100 text-slate-600"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 hover:bg-slate-100 text-slate-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "border-2 border-emerald-800 text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all active:scale-95"
              >
                Buy Now (Fast Checkout)
              </button>
            </div>

            {/* WhatsApp Consultation for Product */}
            <div className="mt-3">
              <a
                href={`https://wa.me/923299888909?text=Assalam-o-Alaikum%20I%20have%20an%20inquiry%20about%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                <span>Ask Hakeem / Consultant on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Value Badges */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-4 w-4 text-emerald-700" />
              <span className="text-[10px] font-semibold text-slate-700 mt-1">Cash on Delivery</span>
              <span className="text-[9px] text-slate-400">All Pakistan</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span className="text-[10px] font-semibold text-slate-700 mt-1">100% Authentic</span>
              <span className="text-[9px] text-slate-400">Chemical Free</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="h-4 w-4 text-emerald-700" />
              <span className="text-[10px] font-semibold text-slate-700 mt-1">Free Delivery</span>
              <span className="text-[9px] text-slate-400">On Orders &gt; 2500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Ingredients, Usage, Warnings */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs">
        <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === "desc"
                ? "border-emerald-800 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Full Description
          </button>
          {product.ingredients && (
            <button
              type="button"
              onClick={() => setActiveTab("ingredients")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "ingredients"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Pure Ingredients
            </button>
          )}
          {product.usage_instructions && (
            <button
              type="button"
              onClick={() => setActiveTab("usage")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "usage"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Directions for Use
            </button>
          )}
          {product.warnings && (
            <button
              type="button"
              onClick={() => setActiveTab("warnings")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "warnings"
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Precautions & Storage
            </button>
          )}
        </div>

        <div className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {activeTab === "desc" && (
            <div className="space-y-3">
              <p>{product.description || product.short_description}</p>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-100">
              <h4 className="font-bold text-emerald-950 mb-1.5 text-xs uppercase tracking-wider">
                Active Natural Constituents:
              </h4>
              <p>{product.ingredients}</p>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">
                Recommended Usage:
              </h4>
              <p>{product.usage_instructions}</p>
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-amber-900">
                <h4 className="font-bold mb-1 text-xs uppercase tracking-wider">Important Precautions:</h4>
                <p>{product.warnings}</p>
              </div>
              {product.storage_instructions && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <h4 className="font-bold mb-1 text-xs uppercase tracking-wider text-slate-900">Storage:</h4>
                  <p>{product.storage_instructions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-4">Related Herbal Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
