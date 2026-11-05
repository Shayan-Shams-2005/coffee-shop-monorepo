// app/admin/products/types.ts

// ==========================================
// Types for the Product Table (List Page)
// ==========================================
export type SortType = "newest" | "cheapest" | "expensive" | "bestoffer";

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  salesVolume: number;
  hasOffer: boolean;
  newPrice: number | null;
  offerEndDate: string | null;
  image: string | null; // 🚀 اصلاح شد: ممکن است محصول عکس نداشته باشد
}

// ==========================================
// Types for Product Variants (Option Groups)
// ==========================================
// 🚀 اضافه شد: تعریف دقیق تنوع‌ها برای جلوگیری از استفاده از any
export interface ProductOption {
  variantId?: number; // برای زمان ویرایش که تنوع از قبل آیدی دارد
  name: string;
  price: number;
  stock: number;
  hasOffer: boolean;
  salePrice: number;
  offerEndDate?: Date;
}

export interface OptionGroup {
  title: string;
  options: ProductOption[];
}

// ==========================================
// Types for the Product Form (Create/Edit Page)
// ==========================================
export interface ProductFormData {
  title: string;
  description: string;
  basePrice: number;
  salePrice: number;
  category: string;
  brand: string;
  stock: number;
  
  // 🚀 اصلاح شد: نوع دقیق فایل‌ها و مقادیر تهی
  mainImage: string;
  mainImageFile: File | null;
  gallery: string[];
  galleryFiles: File[];
  
  offerEndDate?: Date;
  
  keyFeatures: { key: string; value: string }[];
  
  // 🚀 اصلاح شد: اضافه شدن id برای زمان ویرایش ویژگی‌های از قبل ثبت شده
  specs: { id?: number; key: string; value: string }[]; 
  
  // 🚀 رفع باگ بزرگ: جایگزینی any[] با تایپ‌های دقیق
  optionGroups: OptionGroup[]; 
}