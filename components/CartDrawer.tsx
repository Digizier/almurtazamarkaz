"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { CartItem, SiteSettings } from "@/lib/types";
import { getCart, updateCartQuantity, removeFromCart, getSiteSettings } from "@/lib/db";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    refreshCart();
    getSiteSettings().then(setSettings);

    const handleUpdate = () => refreshCart();
    window.addEventListener("amm_cart_updated", handleUpdate);
    return () => window.removeEventListener("amm_cart_updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.selectedVariation?.sale_price || 
                  item.selectedVariation?.price || 
                  item.product.sale_price || 
                  item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const freeShippingThreshold = settings?.free_delivery_threshold || 2500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  {cart.reduce((count, item) => count + item.quantity, 0)} items
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="mt-3 rounded-lg bg-emerald-50/80 p-2.5 border border-emerald-100">
              <div className="flex justify-between text-xs font-medium text-emerald-900">
                {isFreeShipping ? (
                  <span className="font-semibold text-emerald-700">🎉 Congratulations! You have FREE Delivery across Pakistan!</span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-700">Rs. {remainingForFree.toLocaleString()}</strong> more for <strong>FREE Delivery!</strong>
                  </span>
                )}
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/60">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="h-12 w-12 text-slate-300 stroke-1" />
                <p className="mt-3 text-base font-medium text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover pure herbal oils, Sidr honey, and natural wellness products.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.selectedVariation?.sale_price || 
                                  item.selectedVariation?.price || 
                                  item.product.sale_price || 
                                  item.product.price;
                return (
                  <div key={`${item.product.id}-${index}`} className="flex py-3.5 gap-3">
                    <img
                      src={item.product.main_image_url}
                      alt={item.product.name}
                      className="h-16 w-16 flex-none rounded-lg object-cover bg-slate-50 border border-slate-100"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.selectedVariation && (
                            <p className="text-[11px] text-slate-500">{item.selectedVariation.name}</p>
                          )}
                          <p className="text-xs font-bold text-emerald-800 mt-0.5">
                            Rs. {itemPrice.toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedVariation?.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariation?.id)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariation?.id)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-900">
                          Rs. {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `Rs. ${settings?.delivery_charge || 250}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-emerald-800 font-extrabold text-base">
                    Rs. {(subtotal + (isFreeShipping ? 0 : (settings?.delivery_charge || 250))).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition-all active:scale-95"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-400">
                Cash on Delivery, JazzCash, EasyPaisa, & Bank Transfer available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
