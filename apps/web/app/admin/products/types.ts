// app/admin/products/types.ts

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