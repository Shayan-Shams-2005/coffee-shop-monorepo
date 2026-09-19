export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  roastLevel: "روشن" | "متوسط" | "تیره";
}

export interface OfferProduct extends Product {
  oldPrice: number;
  discount: number;
}
