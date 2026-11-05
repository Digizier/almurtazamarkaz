"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  UploadCloud, 
  CheckCircle, 
  ArrowLeft, 
  Phone, 
  ShieldCheck, 
  Check,
  FileText
} from "lucide-react";
import { CartItem, SiteSettings, Order } from "@/lib/types";
import { getCart, getSiteSettings, createOrder, clearCart } from "@/lib/db";
import { uploadMediaToStorage } from "@/lib/imageUtils";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("Rawalpindi");
  const [province, setProvince] = useState("Punjab");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa" | "bank">("cod");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const items = getCart();
    setCart(items);
    getSiteSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.selectedVariation?.sale_price || 
                  item.selectedVariation?.price || 
                  item.product.sale_price || 
                  item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const freeShippingThreshold = settings?.free_delivery_threshold || 2500;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : (settings?.delivery_charge || 250);
  const grandTotal = subtotal + deliveryCharge;

  // Handle proof upload selection
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || !city.trim()) {
      setErrorMsg("Please fill in your Name, Phone Number, Delivery Address, and City.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let paymentProofUrl: string | null = null;

      // If manual payment (JazzCash/EasyPaisa/Bank) and proof screenshot provided, compress & upload
      if (paymentMethod !== "cod" && paymentProofFile) {
        const uploadRes = await uploadMediaToStorage(paymentProofFile, "payment-proofs", "receipts");
        if (uploadRes.url) {
          paymentProofUrl = uploadRes.url;
        }
      }

      const generatedOrderNumber = `AMM-${Date.now().toString().slice(-6)}`;

      const orderData: Omit<Order, "id" | "created_at" | "updated_at"> = {
        order_number: generatedOrderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_whatsapp: customerWhatsapp || customerPhone,
        customer_email: customerEmail,
        delivery_address: deliveryAddress,
        city: city,
        province: province,
        delivery_notes: deliveryNotes,
        subtotal: subtotal,
        discount: 0,
        shipping_fee: deliveryCharge,
        total: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentProofUrl ? "proof_submitted" : "pending",
        order_status: "new",
        payment_proof_url: paymentProofUrl,
      };

      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.main_image_url,
        variation_info: item.selectedVariation?.name,
        price: item.selectedVariation?.sale_price || item.selectedVariation?.price || item.product.sale_price || item.product.price,
        quantity: item.quantity,
        total: (item.selectedVariation?.sale_price || item.selectedVariation?.price || item.product.sale_price || item.product.price) * item.quantity,
      }));

      const res = await createOrder(orderData, orderItems);
      if (res.success && res.orderNumber) {
        setCompletedOrderNumber(res.orderNumber);
      } else {
        setErrorMsg(res.error || "Failed to process order. Please try again.");
      }
    } catch (err: any) {
      console.error("Order submit error:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (completedOrderNumber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16 text-center">
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10" />
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            JazakAllah Khair for your order. We have received your order details and our fulfillment team is preparing your package.
          </p>

          <div className="my-6 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Order Reference:</span>
              <strong className="text-emerald-900 text-sm">{completedOrderNumber}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Customer Name:</span>
              <strong className="text-slate-800">{customerName}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="text-slate-800 text-right">{deliveryAddress}, {city}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Payment Method:</span>
              <span className="capitalize font-semibold text-slate-800">{paymentMethod.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-emerald-900 pt-2 border-t border-emerald-200/60">
              <span>Grand Total:</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-all"
            >
              Back to Home
            </Link>
            <a
              href={`https://wa.me/923299888909?text=Assalam-o-Alaikum%20I%20have%20placed%20order%20${completedOrderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-700 px-6 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="h-4 w-4" /> Confirm on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (!loading && cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 stroke-1" />
        <h2 className="text-lg font-bold text-slate-900 mt-4">Your cart is currently empty</h2>
        <p className="text-xs text-slate-500 mt-1">Please select products from the store before checkout.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-1 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-900"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Herbal Store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      <div className="mb-6">
        <Link href="/shop" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Checkout & Place Order
        </h1>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer & Delivery Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Truck className="h-5 w-5 text-emerald-700" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                1. Delivery & Contact Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Usman Malik"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number (for delivery tracking)
                  </label>
                  <input
                    type="tel"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Street / House Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House #, Street #, Sector / Mohalla, Landmark"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Rawalpindi, Islamabad, Chakwal"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Deliver between 2pm to 6pm, near central mosque"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <CreditCard className="h-5 w-5 text-emerald-700" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                2. Select Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/20"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-slate-500">Pay cash directly to rider upon delivery across Pakistan.</span>
                </div>
              </label>

              {/* Option 2: JazzCash */}
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentMethod === "jazzcash"
                    ? "border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/20"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "jazzcash"}
                  onChange={() => setPaymentMethod("jazzcash")}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">JazzCash Transfer</span>
                  <span className="text-[11px] text-slate-500">Send money directly to our verified JazzCash account.</span>
                </div>
              </label>

              {/* Option 3: EasyPaisa */}
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentMethod === "easypaisa"
                    ? "border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/20"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "easypaisa"}
                  onChange={() => setPaymentMethod("easypaisa")}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">EasyPaisa Transfer</span>
                  <span className="text-[11px] text-slate-500">Send money directly to our verified EasyPaisa account.</span>
                </div>
              </label>

              {/* Option 4: Bank Transfer */}
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentMethod === "bank"
                    ? "border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700/20"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">Direct Bank Transfer (Meezan Bank)</span>
                  <span className="text-[11px] text-slate-500">Transfer via online banking/ATM to our Meezan Bank account.</span>
                </div>
              </label>

              {/* Manual Account Details Display */}
              {paymentMethod !== "cod" && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official Payment Instructions:
                  </h4>

                  {paymentMethod === "jazzcash" && (
                    <div className="text-xs text-slate-700 space-y-1">
                      <p><strong>Account Title:</strong> {settings?.jazzcash_title || "Hazrat Peer Usman Alvi"}</p>
                      <p><strong>JazzCash Number:</strong> {settings?.jazzcash_number || "03299888909"}</p>
                    </div>
                  )}

                  {paymentMethod === "easypaisa" && (
                    <div className="text-xs text-slate-700 space-y-1">
                      <p><strong>Account Title:</strong> {settings?.easypaisa_title || "Hazrat Peer Usman Alvi"}</p>
                      <p><strong>EasyPaisa Number:</strong> {settings?.easypaisa_number || "03299888909"}</p>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="text-xs text-slate-700 space-y-1">
                      <p><strong>Bank Name:</strong> {settings?.bank_name || "Meezan Bank"}</p>
                      <p><strong>Account Title:</strong> {settings?.bank_title || "Al-Murtaza Spiritual Center"}</p>
                      <p><strong>IBAN / Account #:</strong> {settings?.bank_iban || "PK00MEZN0000000123456789"}</p>
                    </div>
                  )}

                  {/* Payment Proof Screenshot Upload */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Upload Payment Receipt Screenshot (Optional but speeds up order dispatch):
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 rounded-lg border border-dashed border-emerald-600 bg-emerald-50/50 px-3 py-2 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100">
                        <UploadCloud className="h-4 w-4" />
                        <span>Select Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofChange}
                          className="hidden"
                        />
                      </label>
                      {paymentProofFile && (
                        <span className="text-xs text-slate-600 font-medium truncate max-w-xs">
                          {paymentProofFile.name}
                        </span>
                      )}
                    </div>
                    {paymentProofPreview && (
                      <div className="mt-2">
                        <img
                          src={paymentProofPreview}
                          alt="Proof preview"
                          className="h-20 w-auto rounded-lg object-contain border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Summary: Order Items & Total */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </h2>

            {/* Items List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto py-2">
              {cart.map((item, idx) => {
                const itemPrice = item.selectedVariation?.sale_price || 
                                  item.selectedVariation?.price || 
                                  item.product.sale_price || 
                                  item.product.price;
                return (
                  <div key={idx} className="flex gap-3 py-2.5">
                    <img
                      src={item.product.main_image_url}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover bg-slate-50 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVariation && (
                        <p className="text-[10px] text-slate-400">{item.selectedVariation.name}</p>
                      )}
                      <p className="text-xs text-slate-500">
                        {item.quantity} &times; Rs. {itemPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      Rs. {(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {isFreeDelivery ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `Rs. ${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-emerald-950 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-800 font-black">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Order Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-900 transition-all active:scale-95 disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
                {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Guaranteed pure natural products. Your satisfaction and trust are our prime priority.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
