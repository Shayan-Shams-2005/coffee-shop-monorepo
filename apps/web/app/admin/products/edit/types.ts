// app/admin/products/edit/types.ts

export interface OptionGroup {
  name: string;
  options: string[];
}

export interface ProductVariant {
  combo: string;
  price: number;
  newPrice: number;
  stock: number;
  sku: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  basePrice: number;
  salePrice: number;
  stock: number;
  
  // Sale toggles and timer
  hasInfiniteSale: boolean;
  hasTimerSale: boolean;
  saleEndDate: string;
  
  // Media
  mainImage: string;
  galleryFiles: string[]; 
  
  // Advanced features
  optionGroups: OptionGroup[];
  variants: ProductVariant[];
  specs: ProductSpec[];
}