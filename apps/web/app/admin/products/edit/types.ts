// app/admin/products/types.ts

export interface ProductFormData {
  title: string;
  description: string;
  basePrice: number;
  salePrice: number;
  category: string;
  brand: string;
  stock: number;
  
  // Optional file properties for uploads
  mainImageFile?: File;
  galleryFiles?: File[];
  
  offerEndDate?: Date;
  mainImage?: string;
  gallery?: string[];
  
  keyFeatures: { key: string; value: string }[];
  specs: { key: string; value: string }[];
  optionGroups: { title: string; options: string[] }[]; 
}

export type SortType = "newest" | "cheapest" | "expensive" | "bestoffer";

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  hasOffer: boolean;
  newPrice: number | null;
  image: string;
}