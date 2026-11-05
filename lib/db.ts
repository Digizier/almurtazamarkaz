import { supabase } from './supabaseClient';
import { 
  SiteSettings, 
  Category, 
  Subcategory, 
  Brand, 
  Product, 
  Banner, 
  Order, 
  OrderItem, 
  CartItem, 
  SpiritualService, 
  WelfareProject, 
  BlogArticle,
  InquiryMessage
} from './types';

// ============================================================================
// 1. SITE SETTINGS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, store_name, urdu_name, tagline, phone, whatsapp, email, address, delivery_charge, free_delivery_threshold, cod_enabled, jazzcash_title, jazzcash_number, easypaisa_title, easypaisa_number, bank_name, bank_title, bank_iban, updated_at')
      .eq('id', 'default')
      .single();

    if (error || !data) {
      console.warn('Fallback settings used:', error?.message);
      return {
        id: 'default',
        store_name: 'Al-Murtaza Spiritual Center',
        urdu_name: 'المرتضیٰ مرکزِ روحانیت',
        tagline: 'یقین، دعا، نسبت اور خدمتِ انسانیت',
        phone: '03299888909',
        whatsapp: '03299888909',
        email: 'almurtazamarkaz1@gmail.com',
        address: 'Rawalpindi Saddar & Chakwal, Pakistan',
        delivery_charge: 250,
        free_delivery_threshold: 2500,
        cod_enabled: true,
        jazzcash_title: 'Hazrat Peer Usman Alvi',
        jazzcash_number: '03299888909',
        easypaisa_title: 'Hazrat Peer Usman Alvi',
        easypaisa_number: '03299888909',
        bank_name: 'Meezan Bank',
        bank_title: 'Al-Murtaza Spiritual Center',
        bank_iban: 'PK00MEZN0000000123456789',
      };
    }

    return data as SiteSettings;
  } catch (err) {
    console.error('getSiteSettings error:', err);
    return {
      id: 'default',
      store_name: 'Al-Murtaza Spiritual Center',
      urdu_name: 'المرتضیٰ مرکزِ روحانیت',
      tagline: 'یقین، دعا، نسبت اور خدمتِ انسانیت',
      phone: '03299888909',
      whatsapp: '03299888909',
      email: 'almurtazamarkaz1@gmail.com',
      address: 'Rawalpindi Saddar & Chakwal, Pakistan',
      delivery_charge: 250,
      free_delivery_threshold: 2500,
      cod_enabled: true,
      jazzcash_title: 'Hazrat Peer Usman Alvi',
      jazzcash_number: '03299888909',
      easypaisa_title: 'Hazrat Peer Usman Alvi',
      easypaisa_number: '03299888909',
      bank_name: 'Meezan Bank',
      bank_title: 'Al-Murtaza Spiritual Center',
      bank_iban: 'PK00MEZN0000000123456789',
    };
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', 'default');

    if (!error) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('amm_settings_updated'));
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('updateSiteSettings error:', err);
    return false;
  }
}

// ============================================================================
// 2. CATEGORIES & SUBCATEGORIES
// ============================================================================

export async function getCategories(showInTopOnly: boolean = false): Promise<Category[]> {
  try {
    let query = supabase
      .from('categories')
      .select('id, name, name_ur, slug, description, image_url, display_order, show_in_top, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (showInTopOnly) {
      query = query.eq('show_in_top', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Category[];
  } catch (err) {
    console.error('getCategories error:', err);
    return [];
  }
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, name_ur, slug, description, image_url, display_order, show_in_top, is_active, created_at')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []) as Category[];
  } catch (err) {
    console.error('getAllCategoriesAdmin error:', err);
    return [];
  }
}

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  try {
    let query = supabase
      .from('subcategories')
      .select('id, category_id, parent_subcategory_id, name, name_ur, slug, display_order, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Subcategory[];
  } catch (err) {
    console.error('getSubcategories error:', err);
    return [];
  }
}

export async function createCategory(cat: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([cat])
      .select()
      .single();

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_categories_updated'));
    return data as Category;
  } catch (err) {
    console.error('createCategory error:', err);
    return null;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_categories_updated'));
    return true;
  } catch (err) {
    console.error('updateCategory error:', err);
    return false;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_categories_updated'));
    return true;
  } catch (err) {
    console.error('deleteCategory error:', err);
    return false;
  }
}

export async function createSubcategory(sub: Partial<Subcategory>): Promise<Subcategory | null> {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([sub])
      .select()
      .single();

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_categories_updated'));
    return data as Subcategory;
  } catch (err) {
    console.error('createSubcategory error:', err);
    return null;
  }
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_categories_updated'));
    return true;
  } catch (err) {
    console.error('deleteSubcategory error:', err);
    return false;
  }
}

// ============================================================================
// 3. BANNERS
// ============================================================================

export async function getBanners(activeOnly: boolean = true): Promise<Banner[]> {
  try {
    let query = supabase
      .from('banners')
      .select('id, title, desktop_image_url, mobile_image_url, display_order, is_active')
      .order('display_order', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Banner[];
  } catch (err) {
    console.error('getBanners error:', err);
    return [];
  }
}

export async function createBanner(banner: Partial<Banner>): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .insert([banner])
      .select()
      .single();

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_banners_updated'));
    return data as Banner;
  } catch (err) {
    console.error('createBanner error:', err);
    return null;
  }
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_banners_updated'));
    return true;
  } catch (err) {
    console.error('deleteBanner error:', err);
    return false;
  }
}

// ============================================================================
// 4. PRODUCTS (Strict Selective Projections & 8 Items/Page Pagination)
// ============================================================================

export interface ProductQueryOptions {
  categorySlug?: string;
  categoryId?: string;
  subcategorySlug?: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(options: ProductQueryOptions = {}): Promise<{
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 8; // Strictly 8 products per page as required
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select(
        'id, name, name_ur, slug, sku, short_description, main_image_url, category_id, price, sale_price, stock, is_active, is_featured, is_new_arrival, is_best_seller, is_flash_deal, weight, tags',
        { count: 'exact' }
      )
      .eq('is_active', true);

    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options.isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (options.isFlashDeal) {
      query = query.eq('is_flash_deal', true);
    }

    if (options.isNewArrival) {
      query = query.eq('is_new_arrival', true);
    }

    if (options.isBestSeller) {
      query = query.eq('is_best_seller', true);
    }

    if (options.search && options.search.trim()) {
      const term = options.search.trim();
      // Support Hinglish / Roman Urdu keywords across name, tags, and short_description
      query = query.or(`name.ilike.%${term}%,name_ur.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: (data || []) as Product[],
      totalCount,
      currentPage: page,
      totalPages: totalPages > 0 ? totalPages : 1,
    };
  } catch (err) {
    console.error('getProducts error:', err);
    return { products: [], totalCount: 0, currentPage: 1, totalPages: 1 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data as Product;
  } catch (err) {
    console.error('getProductBySlug error:', err);
    return null;
  }
}

export async function getAllProductsAdmin(page: number = 1, limit: number = 12, search: string = ''): Promise<{
  products: Product[];
  totalCount: number;
}> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      products: (data || []) as Product[],
      totalCount: count || 0,
    };
  } catch (err) {
    console.error('getAllProductsAdmin error:', err);
    return { products: [], totalCount: 0 };
  }
}

export async function getAllProductsForCSV(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, name_ur, slug, sku, barcode, short_description, description, main_image_url, category_id, price, sale_price, cost_price, stock, is_active, is_featured, is_flash_deal, weight, ingredients, usage_instructions, storage_instructions, warnings, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Product[];
  } catch (err) {
    console.error('getAllProductsForCSV error:', err);
    return [];
  }
}

export async function createProduct(prod: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([prod])
      .select()
      .single();

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_products_updated'));
    return data as Product;
  } catch (err) {
    console.error('createProduct error:', err);
    return null;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_products_updated'));
    return true;
  } catch (err) {
    console.error('updateProduct error:', err);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('amm_products_updated'));
    return true;
  } catch (err) {
    console.error('deleteProduct error:', err);
    return false;
  }
}

// ============================================================================
// 5. ORDERS & CHECKOUT
// ============================================================================

export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
  items: OrderItem[]
): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  try {
    // 1. Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select('id, order_number')
      .single();

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || 'Failed to create order record');
    }

    // 2. Insert order items
    const orderItemsPayload = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      variation_info: item.variation_info,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error('Order items insertion error:', itemsError);
    }

    // 3. Clear cart
    if (typeof window !== 'undefined') {
      localStorage.removeItem('amm_cart');
      window.dispatchEvent(new Event('amm_cart_updated'));
    }

    return { success: true, orderNumber: newOrder.order_number };
  } catch (err: any) {
    console.error('createOrder error:', err);
    return { success: false, error: err.message || 'Order creation failed' };
  }
}

export async function getOrdersAdmin(page: number = 1, limit: number = 10, statusFilter?: string): Promise<{
  orders: Order[];
  totalCount: number;
}> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)', { count: 'exact' });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('order_status', statusFilter);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      orders: (data || []) as Order[],
      totalCount: count || 0,
    };
  } catch (err) {
    console.error('getOrdersAdmin error:', err);
    return { orders: [], totalCount: 0 };
  }
}

export async function updateOrderStatus(
  id: string,
  orderStatus: Order['order_status'],
  paymentStatus?: Order['payment_status'],
  adminNotes?: string
): Promise<boolean> {
  try {
    const payload: any = { order_status: orderStatus, updated_at: new Date().toISOString() };
    if (paymentStatus) payload.payment_status = paymentStatus;
    if (adminNotes !== undefined) payload.admin_notes = adminNotes;

    const { error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return false;
  }
}

// ============================================================================
// 6. SPIRITUAL SERVICES & WELFARE PROJECTS
// ============================================================================

export async function getSpiritualServices(): Promise<SpiritualService[]> {
  try {
    const { data, error } = await supabase
      .from('spiritual_services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []) as SpiritualService[];
  } catch (err) {
    console.error('getSpiritualServices error:', err);
    return [];
  }
}

export async function getWelfareProjects(): Promise<WelfareProject[]> {
  try {
    const { data, error } = await supabase
      .from('welfare_projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []) as WelfareProject[];
  } catch (err) {
    console.error('getWelfareProjects error:', err);
    return [];
  }
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  try {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as BlogArticle[];
  } catch (err) {
    console.error('getBlogArticles error:', err);
    return [];
  }
}

export async function sendInquiry(inquiry: Omit<InquiryMessage, 'id' | 'status' | 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('inquiries_messages')
      .insert([inquiry]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('sendInquiry error:', err);
    return false;
  }
}

// ============================================================================
// 7. CLIENT SHOPPING CART (Reactive Local State with Live Event Dispatch)
// ============================================================================

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('amm_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function addToCart(product: Product, quantity: number = 1, variation?: any): void {
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const existingIdx = cart.findIndex(
    (item) => item.product.id === product.id && item.selectedVariation?.id === variation?.id
  );

  if (existingIdx > -1) {
    cart[existingIdx].quantity += quantity;
  } else {
    cart.push({ product, quantity, selectedVariation: variation || null });
  }

  localStorage.setItem('amm_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('amm_cart_updated'));
}

export function updateCartQuantity(productId: string, quantity: number, variationId?: string): void {
  if (typeof window === 'undefined') return;
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(
      (item) => !(item.product.id === productId && item.selectedVariation?.id === variationId)
    );
  } else {
    const item = cart.find(
      (item) => item.product.id === productId && item.selectedVariation?.id === variationId
    );
    if (item) item.quantity = quantity;
  }

  localStorage.setItem('amm_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('amm_cart_updated'));
}

export function removeFromCart(productId: string, variationId?: string): void {
  updateCartQuantity(productId, 0, variationId);
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('amm_cart');
  window.dispatchEvent(new Event('amm_cart_updated'));
}
