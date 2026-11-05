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
  offerEndDate: undefined, 
  mainImage: "",
  mainImageFile: null, 
  gallery: [],
  galleryFiles: [],    
  specs: [],           
  optionGroups: [],
};