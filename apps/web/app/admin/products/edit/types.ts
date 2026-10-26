// app/admin/products/edit/types.ts

export interface KeyValueStr {
  id?: number; 
  key: string;
  value: string;
}

export interface ProductOption {
  variantId?: number; 
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

export interface ProductFormData {
  // General Info
  title: string;
  description: string;
  category: string;
  brand: string;
  
  // Global / Default Pricing & Inventory
  basePrice: number;
  salePrice: number;
  offerEndDate?: Date;
  stock: number;
  
  // Media
  mainImage: string;
  mainImageFile: File | null;
  gallery: string[];
  galleryFiles: File[];
  
  // Specs & Variants
  specs: KeyValueStr[]; // 🚀 فیلد keyFeatures حذف شد
  optionGroups: OptionGroup[];
}