import { ProductCarousel } from "../../ui/ProductCarousel";
import { NewestProductCard, type ProductDto } from "./NewestProductCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103";

async function fetchProducts(): Promise<ProductDto[]> {
  try {
    // 🚀 FIXED: 'cache: no-store' forces Next.js to fetch fresh live data every time so timers aren't stuck in the cache!
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
    // 🚀 FIXED: Updated viewAllLink to dynamically route to the shop page with the "newest" sorting filter applied
    

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