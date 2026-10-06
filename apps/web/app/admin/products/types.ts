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
  image: string;
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
  
  // Optional properties for handling actual file uploads
  mainImageFile?: File;
  galleryFiles?: File[];
  
  offerEndDate?: Date;
  mainImage?: string;
  gallery?: string[];
  
  keyFeatures: { key: string; value: string }[];
  specs: { key: string; value: string }[];
  optionGroups: any[]; 
}