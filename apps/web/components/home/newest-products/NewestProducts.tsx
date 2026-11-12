// apps/web/components/home/NewestProducts.tsx
import { ProductCarousel } from "../../ui/ProductCarousel";
import { NewestProductCard, type ProductDto } from "./NewestProductCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103";

async function fetchProducts(): Promise<ProductDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Product/GetAll`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      console.error("Failed to fetch products from API");
      return [];
    }

    const data = await res.json();
    return data.reverse().slice(0, 20);
  } catch (error) {
    console.error("API Connection Error:", error);
    return [];
  }
}

export async function NewestProducts() {
  const newestProducts = await fetchProducts();

  if (!newestProducts || newestProducts.length === 0) {
    return null; 
  }

  return (
    

<ProductCarousel title="جدیدترین محصولات" viewAllLink="/shop?sort=newest">
      {newestProducts.map((product) => (
        <NewestProductCard 
          key={product.productId} 
          product={product} 
        />
      ))}
    </ProductCarousel>
  );
}