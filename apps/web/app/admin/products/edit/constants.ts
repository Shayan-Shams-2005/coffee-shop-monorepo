// app/admin/products/edit/constants.ts
import { ProductFormData } from "./types"; 

export const INITIAL_PRODUCT_DATA: ProductFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  basePrice: 0,
  salePrice: 0,
  stock: 0, 
  offerEndDate: undefined, // Better to start as undefined rather than today's date
  mainImage: "",
  mainImageFile: null, // 🚀 FIX: Added missing property
  gallery: [],
  galleryFiles: [],    // 🚀 FIX: Added missing property
  keyFeatures: [],     // Usually better to start empty
  specs: [],           // Usually better to start empty
  optionGroups: [],
};