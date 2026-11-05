"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Layers, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  Printer, 
  CheckCircle, 
  X,
  CreditCard,
  HeartHandshake,
  MessageSquare,
  Search,
  Zap
} from "lucide-react";
import { 
  Product, 
  Category, 
  Subcategory, 
  Banner, 
  Order, 
  SiteSettings, 
  SpiritualService, 
  WelfareProject, 
  InquiryMessage 
} from "@/lib/types";
import { 
  getAllProductsAdmin, 
  getAllProductsForCSV, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllCategoriesAdmin, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getSubcategories, 
  createSubcategory, 
  deleteSubcategory, 
  getBanners, 
  createBanner, 
  deleteBanner, 
  getOrdersAdmin, 
  updateOrderStatus, 
  getSiteSettings, 
  updateSiteSettings, 
  getSpiritualServices, 
  getWelfareProjects 
} from "@/lib/db";
import { uploadMediaToStorage } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  // AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // ACTIVE TAB
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "categories" | "orders" | "banners" | "settings" | "welfare" | "inquiries"
  >("dashboard");

  // DATA STATES
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // MODAL STATES
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCatForSub, setSelectedCatForSub] = useState("");

  const [activeOrderForProof, setActiveOrderForProof] = useState<Order | null>(null);
  const [activeOrderForInvoice, setActiveOrderForInvoice] = useState<Order | null>(null);

  // Custom Confirm Delete Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "product" | "category" | "subcategory" | "banner";
    id: string;
    title: string;
  } | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // CHECK SESSION ON MOUNT
  useEffect(() => {
    const authSession = sessionStorage.getItem("amm_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // LOAD DATA WHEN AUTHENTICATED
  const refreshAllData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const [
        prodData,
        catData,
        subData,
        bannerData,
        orderData,
        settingsData
      ] = await Promise.all([
        getAllProductsAdmin(1, 100, productSearch),
        getAllCategoriesAdmin(),
        getSubcategories(),
        getBanners(false),
        getOrdersAdmin(1, 50),
        getSiteSettings()
      ]);

      setProducts(prodData.products);
      setCategories(catData);
      setSubcategories(subData);
      setBanners(bannerData);
      setOrders(orderData.orders);
      setSettings(settingsData);
      setLastSyncTime(new Date().toLocaleTimeString());

      // Fetch inquiries
      const { data: inqData } = await supabase
        .from("inquiries_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (inqData) setInquiries(inqData);
    } catch (err) {
      console.error("Admin refresh error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated, productSearch]);

  // 30-SECOND SILENT AUTO-SYNC
  useEffect(() => {
    if (!isAuthenticated || !autoSyncEnabled) return;
    const interval = setInterval(() => {
      refreshAllData(true); // Silent sync without full-page reloads
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoSyncEnabled]);

  // LOGIN HANDLER
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = (process.env.NEXT_PUBLIC_ADMIN_PIN || "").trim();
    if (correctPin && passwordInput.trim() === correctPin) {
      sessionStorage.setItem("amm_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid access password. Please re-enter.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("amm_admin_auth");
    setIsAuthenticated(false);
  };

  // CSV EXPORT HANDLER
  const handleExportCSV = async () => {
    try {
      const allProds = await getAllProductsForCSV();
      if (allProds.length === 0) {
        showToast("No products found to export.", "error");
        return;
      }

      const headers = [
        "Product ID",
        "Product Name",
        "Urdu Name",
        "Slug",
        "SKU",
        "Barcode",
        "Category ID",
        "Price (PKR)",
        "Sale Price (PKR)",
        "Stock",
        "Status",
        "Flash Deal",
        "Weight",
        "Main Image URL",
        "Ingredients",
        "Created At"
      ];

      const csvRows = [headers.join(",")];

      allProds.forEach((p) => {
        const row = [
          `"${p.id}"`,
          `"${(p.name || "").replace(/"/g, '""')}"`,
          `"${(p.name_ur || "").replace(/"/g, '""')}"`,
          `"${p.slug}"`,
          `"${p.sku || ""}"`,
          `"${p.barcode || ""}"`,
          `"${p.category_id || ""}"`,
          p.price,
          p.sale_price || "",
          p.stock,
          p.is_active ? "Active" : "Inactive",
          p.is_flash_deal ? "Yes" : "No",
          `"${p.weight || ""}"`,
          `"${p.main_image_url || ""}"`,
          `"${(p.ingredients || "").replace(/"/g, '""')}"`,
          `"${p.created_at || ""}"`
        ];
        csvRows.push(row.join(","));
      });

      const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `almurtaza_products_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("CSV export downloaded successfully!");
    } catch (err) {
      console.error("CSV error:", err);
      showToast("CSV generation failed", "error");
    }
  };

  // CONFIRM DELETE EXECUTION
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    try {
      if (type === "product") {
        await deleteProduct(id);
        showToast("Product deleted successfully");
      } else if (type === "category") {
        await deleteCategory(id);
        showToast("Category deleted successfully");
      } else if (type === "subcategory") {
        await deleteSubcategory(id);
        showToast("Subcategory deleted successfully");
      } else if (type === "banner") {
        await deleteBanner(id);
        showToast("Banner deleted successfully");
      }
      refreshAllData(true);
    } catch (err) {
      showToast("Failed to delete item", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // --------------------------------------------------------------------------
  // AUTH GATE SCREEN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-md rounded-3xl bg-slate-800 border border-slate-700/80 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-emerald-900/60 border border-emerald-600/40 p-2 flex items-center justify-center">
              <img src="/images/logo.png" alt="Al-Murtaza" className="h-full w-auto object-contain" />
            </div>
            <h1 className="text-xl font-black text-white">Al-Murtaza Portal Gate</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Management & Administration</p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access password"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/90 py-3 pl-4 pr-11 text-sm text-white focus:border-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-all active:scale-95"
            >
              Authenticate & Enter
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN ADMIN PANEL DASHBOARD (ISOLATED LAYOUT)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-xl border ${
            toast.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* FIXED / INDEPENDENT STICKY SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex-none md:h-screen md:sticky md:top-0 md:overflow-y-auto flex flex-col justify-between border-r border-slate-800 z-30">
        <div>
          {/* Brand Heading */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="" className="h-9 w-auto bg-white/10 p-1 rounded-lg" />
              <div>
                <span className="block text-sm font-black text-white leading-none">Al-Murtaza</span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Admin Hub</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-1"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "dashboard" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-400" />
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "products" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-emerald-400" />
                <span>Product Manager</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">{products.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "categories" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Categories & Tags</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">{categories.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "orders" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                <span>Order Manager</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">
                {orders.filter((o) => o.order_status === "new").length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("banners")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "banners" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <ImageIcon className="h-4 w-4 text-emerald-400" />
              <span>Banners Hub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "inquiries" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Inquiries & Messages</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">{inquiries.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "settings" ? "bg-emerald-800 text-white font-bold" : "hover:bg-slate-900 text-slate-400"
              }`}
            >
              <Settings className="h-4 w-4 text-emerald-400" />
              <span>Store & Payment Settings</span>
            </button>
          </nav>
        </div>

        {/* Sync Status Badge */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Sync</span>
            </span>
            <button
              type="button"
              onClick={() => refreshAllData(false)}
              className="text-emerald-400 hover:text-white"
              title="Manual Sync"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500">Auto-sync 30s active ({lastSyncTime})</p>
          <div className="mt-3">
            <Link href="/" target="_blank" className="text-emerald-400 hover:underline block text-center">
              View Public Website &rarr;
            </Link>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* ================================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ================================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Dashboard Overview</h1>
              <p className="text-xs text-slate-500">Live summary of store inventory, orders, and inquiries.</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Products</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
                <span className="text-[10px] text-emerald-700 font-medium">Active in catalog</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">New Orders</span>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {orders.filter((o) => o.order_status === "new").length}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Awaiting fulfillment</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Categories</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{categories.length}</p>
                <span className="text-[10px] text-slate-500 font-medium">{subcategories.length} subcategories</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Consultations</span>
                <p className="text-2xl font-black text-emerald-800 mt-1">{inquiries.length}</p>
                <span className="text-[10px] text-slate-500 font-medium">Visitor inquiries</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="py-2.5 font-bold">Order #</th>
                      <th className="py-2.5 font-bold">Customer</th>
                      <th className="py-2.5 font-bold">City</th>
                      <th className="py-2.5 font-bold">Total</th>
                      <th className="py-2.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-bold text-emerald-800">{ord.order_number}</td>
                        <td className="py-2.5">{ord.customer_name}</td>
                        <td className="py-2.5">{ord.city}</td>
                        <td className="py-2.5 font-bold">Rs. {ord.total.toLocaleString()}</td>
                        <td className="py-2.5">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 capitalize">
                            {ord.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: PRODUCTS MANAGER (Full Field Parity, WebP Upload, CSV Export) */}
        {/* ================================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Product Manager</h1>
                <p className="text-xs text-slate-500">Manage catalog, upload images with automatic WebP compression, edit prices, and export data.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  <Download className="h-4 w-4" /> Download CSV
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      name: "",
                      name_ur: "",
                      slug: "",
                      sku: `AMM-${Date.now().toString().slice(-4)}`,
                      price: 1000,
                      stock: 20,
                      is_active: true,
                      category_id: categories[0]?.id || "",
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-sm">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title or SKU..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 font-bold">Image</th>
                      <th className="py-3 px-4 font-bold">Title & SKU</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Price</th>
                      <th className="py-3 px-4 font-bold">Stock</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4">
                          <img
                            src={prod.main_image_url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-slate-400">SKU: {prod.sku || "N/A"}</p>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {categories.find((c) => c.id === prod.category_id)?.name || "General"}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-emerald-800">
                          Rs. {prod.price.toLocaleString()}
                          {prod.sale_price && (
                            <span className="block text-[10px] text-rose-600">
                              Sale: Rs. {prod.sale_price.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-semibold">
                          <span className={prod.stock < 5 ? "text-rose-600 font-bold" : "text-slate-700"}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              prod.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {prod.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1 text-slate-500 hover:text-emerald-700"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: "product",
                                id: prod.id,
                                title: prod.name,
                              })
                            }
                            className="p-1 text-slate-500 hover:text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: CATEGORIES & DARAZ-STYLE SUBCATEGORIES */}
        {/* ================================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Categories & Tags Manager</h1>
                <p className="text-xs text-slate-500">Configure main categories, subcategories, and homepage top category display.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory({
                    name: "",
                    name_ur: "",
                    slug: "",
                    show_in_top: true,
                    is_active: true,
                    display_order: categories.length + 1,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" /> Add Main Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => {
                const subs = subcategories.filter((s) => s.category_id === cat.id);
                return (
                  <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image_url || "/images/logo.png"}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                          {cat.name_ur && (
                            <p className="font-arabic text-xs font-semibold text-emerald-800" dir="rtl">
                              {cat.name_ur}
                            </p>
                          )}
                          <span className="text-[10px] text-slate-400">/{cat.slug}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1 text-slate-500 hover:text-emerald-700"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              type: "category",
                              id: cat.id,
                              title: cat.name,
                            })
                          }
                          className="p-1 text-slate-500 hover:text-rose-600"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories Pill List */}
                    <div className="pt-3 border-t border-slate-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Subcategories ({subs.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {subs.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-700"
                          >
                            {s.name}
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "subcategory",
                                  id: s.id,
                                  title: s.name,
                                })
                              }
                              className="text-slate-400 hover:text-rose-600 ml-0.5"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Subcategory Inline */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="New subcategory name..."
                          value={selectedCatForSub === cat.id ? newSubcategoryName : ""}
                          onChange={(e) => {
                            setSelectedCatForSub(cat.id);
                            setNewSubcategoryName(e.target.value);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newSubcategoryName.trim()) return;
                            const slug = newSubcategoryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
                            await createSubcategory({
                              category_id: cat.id,
                              name: newSubcategoryName.trim(),
                              slug,
                            });
                            setNewSubcategoryName("");
                            refreshAllData(true);
                            showToast("Subcategory created!");
                          }}
                          className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: ORDER MANAGER (Screenshot Proof Viewer & Printable Invoice) */}
        {/* ================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Customer Order Manager</h1>
              <p className="text-xs text-slate-500">Track order lifecycle, inspect payment screenshots with the Eye modal, and print pure white PDF invoices.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 font-bold">Order #</th>
                      <th className="py-3 px-4 font-bold">Customer Info</th>
                      <th className="py-3 px-4 font-bold">Items & Total</th>
                      <th className="py-3 px-4 font-bold">Payment Method</th>
                      <th className="py-3 px-4 font-bold">Payment Proof</th>
                      <th className="py-3 px-4 font-bold">Order Status</th>
                      <th className="py-3 px-4 font-bold text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-emerald-800">
                          {ord.order_number}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {new Date(ord.created_at || "").toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{ord.customer_name}</p>
                          <p className="text-[11px] text-slate-500">{ord.customer_phone}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{ord.delivery_address}, {ord.city}</p>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900">Rs. {ord.total.toLocaleString()}</span>
                          <span className="block text-[10px] text-slate-400">
                            {ord.items?.length || 1} product(s)
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 uppercase">
                            {ord.payment_method}
                          </span>
                        </td>

                        {/* Payment Proof with EYE Preview Modal */}
                        <td className="py-3 px-4">
                          {ord.payment_proof_url ? (
                            <button
                              type="button"
                              onClick={() => setActiveOrderForProof(ord)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Proof
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">N/A (COD)</span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="py-3 px-4">
                          <select
                            value={ord.order_status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as any;
                              await updateOrderStatus(ord.id, newStatus);
                              showToast(`Order status updated to ${newStatus}`);
                              refreshAllData(true);
                            }}
                            className="rounded-lg border border-slate-300 py-1 px-2 text-xs font-semibold text-slate-800 bg-white"
                          >
                            <option value="new">New</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Invoice Print Trigger */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveOrderForInvoice(ord)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Printer className="h-3.5 w-3.5 text-slate-500" /> Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: BANNERS HUB (Dimensions Guided, Clean Upload) */}
        {/* ================================================================== */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Banners Hub</h1>
              <p className="text-xs text-slate-500">
                Upload responsive hero image banners. Images will display cleanly edge-to-edge on public website with zero text overlay.
              </p>
            </div>

            {/* Banner Upload Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Upload New Promotional Banner</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <div>
                  <strong className="text-emerald-950">Recommended Desktop Size:</strong>
                  <p className="font-mono text-emerald-800">1920 &times; 600 px (Landscape)</p>
                </div>
                <div>
                  <strong className="text-emerald-950">Recommended Mobile Size:</strong>
                  <p className="font-mono text-emerald-800">1080 &times; 1350 px (Portrait / Square)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer hover:bg-emerald-800 transition-all">
                  <UploadCloud className="h-4 w-4" />
                  <span>Choose Banner Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        showToast("Compressing & uploading banner...");
                        const res = await uploadMediaToStorage(file, "banners", "hero");
                        if (res.url) {
                          await createBanner({
                            desktop_image_url: res.url,
                            mobile_image_url: res.url,
                            display_order: banners.length + 1,
                            is_active: true,
                          });
                          showToast("Banner added successfully!");
                          refreshAllData(true);
                        } else {
                          showToast("Banner upload failed", "error");
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Active Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="aspect-16/6 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={b.desktop_image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Display Order: {b.display_order}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: "banner",
                          id: b.id,
                          title: "Promotional Banner",
                        })
                      }
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Banner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 6: INQUIRIES & MESSAGES */}
        {/* ================================================================== */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Inquiries & Contact Messages</h1>
              <p className="text-xs text-slate-500">Review spiritual guidance inquiries and requests from visitors.</p>
            </div>

            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                  No visitor inquiries recorded yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{inq.name}</h3>
                        <p className="text-xs text-slate-500">{inq.phone} | {inq.email || "No email"}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {inq.subject || "General Inquiry"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {inq.message}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://wa.me/92${inq.phone.replace(/^0+/, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(inq.name)}%20regarding%20your%20consultation%20inquiry`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Reply on WhatsApp
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 7: STORE & FINANCIAL SETTINGS */}
        {/* ================================================================== */}
        {activeTab === "settings" && settings && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Store & Financial Settings</h1>
              <p className="text-xs text-slate-500">Configure global delivery thresholds, WhatsApp numbers, and payment accounts.</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateSiteSettings(settings);
                showToast("Store settings saved successfully!");
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
            >
              {/* Delivery Configuration */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                  Delivery & Shipping Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Standard Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.delivery_charge}
                      onChange={(e) => setSettings({ ...settings, delivery_charge: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Free Shipping Spend Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.free_delivery_threshold}
                      onChange={(e) => setSettings({ ...settings, free_delivery_threshold: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Accounts */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                  Pakistani Payment Accounts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">JazzCash Account Title</label>
                    <input
                      type="text"
                      value={settings.jazzcash_title}
                      onChange={(e) => setSettings({ ...settings, jazzcash_title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">JazzCash Mobile Number</label>
                    <input
                      type="text"
                      value={settings.jazzcash_number}
                      onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">EasyPaisa Account Title</label>
                    <input
                      type="text"
                      value={settings.easypaisa_title}
                      onChange={(e) => setSettings({ ...settings, easypaisa_title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">EasyPaisa Mobile Number</label>
                    <input
                      type="text"
                      value={settings.easypaisa_number}
                      onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settings.bank_name}
                      onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank IBAN / Account #</label>
                    <input
                      type="text"
                      value={settings.bank_iban}
                      onChange={(e) => setSettings({ ...settings, bank_iban: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ================================================================== */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* ================================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct.id ? "Edit Herbal Product" : "Add New Herbal Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingProduct.name || !editingProduct.price) return;

                const slug =
                  editingProduct.slug ||
                  editingProduct.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

                if (editingProduct.id) {
                  await updateProduct(editingProduct.id, { ...editingProduct, slug });
                  showToast("Product updated successfully!");
                } else {
                  await createProduct({ ...editingProduct, slug });
                  showToast("Product created successfully!");
                }

                setIsProductModalOpen(false);
                refreshAllData(true);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Product Title (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingProduct.name_ur || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ur: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sale Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.sale_price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sale_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editingProduct.category_id || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Weight / Packing</label>
                  <input
                    type="text"
                    placeholder="e.g. 120 ml, 250 gm"
                    value={editingProduct.weight || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              {/* Direct Image Upload with WebP Auto-Compression */}
              <div>
                <label className="block font-semibold mb-1">Product Main Image (Direct Device Upload)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-lg border border-dashed border-emerald-600 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100">
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          showToast("Compressing & uploading image...");
                          const res = await uploadMediaToStorage(e.target.files[0], "products", "catalog");
                          if (res.url) {
                            setEditingProduct({ ...editingProduct, main_image_url: res.url });
                            showToast("Image uploaded in lightweight WebP!");
                          } else {
                            showToast("Upload failed", "error");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {editingProduct.main_image_url && (
                    <img
                      src={editingProduct.main_image_url}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Summary</label>
                <input
                  type="text"
                  value={editingProduct.short_description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Herbal Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Herbal Ingredients</label>
                <input
                  type="text"
                  placeholder="e.g. Nigella Sativa, Sesame Oil, Saffron"
                  value={editingProduct.ingredients || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_flash_deal || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_flash_deal: e.target.checked })}
                  />
                  <span>Flash Deal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  />
                  <span>Active & Visible</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: ADD / EDIT CATEGORY */}
      {/* ================================================================== */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory.id ? "Edit Category" : "Add New Main Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingCategory.name) return;
                const slug =
                  editingCategory.slug ||
                  editingCategory.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

                if (editingCategory.id) {
                  await updateCategory(editingCategory.id, { ...editingCategory, slug });
                  showToast("Category updated!");
                } else {
                  await createCategory({ ...editingCategory, slug });
                  showToast("Category created!");
                }
                setIsCategoryModalOpen(false);
                refreshAllData(true);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Name (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingCategory.name_ur || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ur: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-arabic"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block font-semibold mb-1">Category Image (WebP Compressed)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-lg border border-dashed border-emerald-600 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100">
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          showToast("Compressing & uploading...");
                          const res = await uploadMediaToStorage(e.target.files[0], "categories", "icons");
                          if (res.url) {
                            setEditingCategory({ ...editingCategory, image_url: res.url });
                            showToast("Image ready!");
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {editingCategory.image_url && (
                    <img src={editingCategory.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.show_in_top || false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, show_in_top: e.target.checked })}
                  />
                  <span>Show in Top Categories Carousel</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 3: PAYMENT PROOF SCREENSHOT VIEWER ("EYE" ICON MODAL) */}
      {/* ================================================================== */}
      {activeOrderForProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Payment Proof &mdash; {activeOrderForProof.order_number}
                </h3>
                <p className="text-xs text-slate-500">
                  Customer: {activeOrderForProof.customer_name} ({activeOrderForProof.payment_method.toUpperCase()})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderForProof(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
              {activeOrderForProof.payment_proof_url ? (
                <img
                  src={activeOrderForProof.payment_proof_url}
                  alt="Customer Payment Receipt"
                  className="max-h-80 w-auto object-contain rounded-lg shadow-sm"
                />
              ) : (
                <p className="text-xs text-slate-400 py-12">No screenshot proof uploaded for this order.</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-slate-700">
                Amount: Rs. {activeOrderForProof.total.toLocaleString()}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await updateOrderStatus(activeOrderForProof.id, activeOrderForProof.order_status, "verified");
                    showToast("Payment marked as VERIFIED!");
                    setActiveOrderForProof(null);
                    refreshAllData(true);
                  }}
                  className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
                >
                  Verify Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 4: PRISTINE PRINTABLE PDF INVOICE (@media print Pure White) */}
      {/* ================================================================== */}
      {activeOrderForInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Print Customer Invoice</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-900"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Now
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOrderForInvoice(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* PURE WHITE PRINTABLE INVOICE CONTAINER */}
            <div id="printable-invoice" className="bg-white text-black p-6 space-y-6 border border-slate-200 rounded-xl">
              <div className="flex justify-between items-start border-b border-black pb-4">
                <div>
                  <h2 className="text-xl font-black">Al-Murtaza Spiritual Center</h2>
                  <p className="text-xs font-arabic" dir="rtl">المرتضیٰ مرکزِ روحانیت</p>
                  <p className="text-xs text-slate-600 mt-1">Rawalpindi Saddar & Chakwal, Pakistan</p>
                  <p className="text-xs text-slate-600">WhatsApp / Helpline: 0329-9888909</p>
                </div>
                <div className="text-right">
                  <h3 className="text-base font-extrabold text-black">OFFICIAL INVOICE</h3>
                  <p className="text-xs font-bold text-slate-800">Order: {activeOrderForInvoice.order_number}</p>
                  <p className="text-xs text-slate-600">
                    Date: {new Date(activeOrderForInvoice.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                <div>
                  <strong className="block text-slate-900 uppercase">Billed / Shipped To:</strong>
                  <p className="font-bold text-slate-900 mt-0.5">{activeOrderForInvoice.customer_name}</p>
                  <p className="text-slate-700">{activeOrderForInvoice.customer_phone}</p>
                  <p className="text-slate-700">{activeOrderForInvoice.delivery_address}, {activeOrderForInvoice.city}</p>
                </div>
                <div className="text-right">
                  <strong className="block text-slate-900 uppercase">Payment Details:</strong>
                  <p className="text-slate-700 mt-0.5 uppercase">Method: {activeOrderForInvoice.payment_method}</p>
                  <p className="text-slate-700 capitalize">Payment Status: {activeOrderForInvoice.payment_status}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-2 border">Item Description</th>
                    <th className="p-2 border text-center">Qty</th>
                    <th className="p-2 border text-right">Unit Price</th>
                    <th className="p-2 border text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeOrderForInvoice.items || []).map((itm, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">
                        <span className="font-bold">{itm.product_name}</span>
                        {itm.variation_info && <span className="block text-[10px] text-slate-500">{itm.variation_info}</span>}
                      </td>
                      <td className="p-2 border text-center">{itm.quantity}</td>
                      <td className="p-2 border text-right">Rs. {itm.price.toLocaleString()}</td>
                      <td className="p-2 border text-right font-bold">Rs. {itm.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 border-t border-black pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {activeOrderForInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>Rs. {activeOrderForInvoice.shipping_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black border-t border-black pt-1">
                    <span>Grand Total:</span>
                    <span>Rs. {activeOrderForInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-500">
                <p>Thank you for shopping with Al-Murtaza Spiritual Center & Herbal Store.</p>
                <p>Spiritual Helpline: 0329-9888909 | almurtazamarkaz1@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 5: CUSTOM DELETE CONFIRMATION (NO BROWSER ALERTS!) */}
      {/* ================================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete &ldquo;{deleteConfirm.title}&rdquo;? This change will reflect live in the cloud database.
            </p>
            <div className="flex gap-2 pt-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
