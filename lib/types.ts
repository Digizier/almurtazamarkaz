// Exhaustive TypeScript interfaces for Al-Murtaza Spiritual Center & Herbal Store

export interface SiteSettings {
  id: string;
  store_name: string;
  urdu_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  delivery_charge: number;
  free_delivery_threshold: number;
  cod_enabled: boolean;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_title: string;
  bank_iban: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  name_ur?: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  show_in_top: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  parent_subcategory_id?: string | null;
  name: string;
  name_ur?: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g., '120 ml', '250 gm'
  price: number;
  sale_price?: number;
  sku?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  name_ur?: string;
  slug: string;
  sku?: string;
  barcode?: string;
  short_description?: string;
  description?: string;
  main_image_url: string;
  gallery_urls?: string[];
  category_id: string;
  subcategory_id?: string | null;
  brand_id?: string | null;
  price: number;
  sale_price?: number | null;
  cost_price?: number | null;
  stock: number;
  low_stock_threshold?: number;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_flash_deal: boolean;
  flash_start_date?: string | null;
  flash_end_date?: string | null;
  weight?: string;
  dimensions?: string;
  ingredients?: string;
  usage_instructions?: string;
  storage_instructions?: string;
  warnings?: string;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  variations?: ProductVariation[];
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title?: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation | null;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  variation_info?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  province?: string;
  postal_code?: string;
  delivery_notes?: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'bank';
  payment_status: 'pending' | 'proof_submitted' | 'verified' | 'rejected';
  order_status: 'new' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  payment_proof_url?: string | null;
  tracking_number?: string | null;
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface SpiritualService {
  id: string;
  title: string;
  title_ur?: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface WelfareProject {
  id: string;
  title: string;
  title_ur?: string;
  description?: string;
  image_url?: string;
  target_amount?: number;
  raised_amount?: number;
  status?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  title_ur?: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  author?: string;
  category?: string;
  is_published: boolean;
  created_at?: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: string;
  created_at?: string;
}
