export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  basePrice: number;
  salePrice: number;
  offerEndDate: Date;
  mainImage: string;
  gallery: string[];
  keyFeatures: { key: string; value: string }[];
  specs: { key: string; value: string }[];
  optionGroups: { title: string; options: string[] }[];
}