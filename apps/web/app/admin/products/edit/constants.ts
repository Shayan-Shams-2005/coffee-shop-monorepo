// app/admin/products/edit/constants.ts
import { ProductFormData } from "./types"; 

export const INITIAL_PRODUCT_DATA: ProductFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  basePrice: 0,
  salePrice: 0,
  stock: 0, // 🚀 FIX: Added the missing 'stock' property
  offerEndDate: new Date(), 
  mainImage: "",
  gallery: [],
  keyFeatures: [
    { key: "", value: "" },
  ],
  specs: [
    { key: "", value: "" },
  ],
  optionGroups: [],
};