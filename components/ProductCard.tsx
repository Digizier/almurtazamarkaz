"use client";

import Link from "next/link";
import { ShoppingBag, Zap, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const currentPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
      <div>
        {/* Thumbnail & Badges */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50">
          <img
            src={product.main_image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}

          {product.is_flash_deal && (
            <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-xs">
              <Zap className="h-3 w-3 fill-slate-900" /> Flash
            </span>
          )}

          {product.weight && (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-slate-900/70 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-medium text-white">
              {product.weight}
            </span>
          )}
        </Link>

        {/* Product Title */}
        <div className="mt-2.5">
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 leading-tight">
              {product.name}
            </h3>
          </Link>
          {product.name_ur && (
            <p className="mt-0.5 line-clamp-1 text-[11px] font-arabic text-emerald-800/80 leading-normal" dir="rtl">
              {product.name_ur}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-bold text-emerald-800">
            Rs. {currentPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-slate-400 line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] sm:text-xs font-semibold transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "border border-emerald-700 text-emerald-800 hover:bg-emerald-50 active:scale-95"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3 w-3" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-3 w-3" /> Cart
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center rounded-md bg-emerald-700 px-2 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-800 active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
