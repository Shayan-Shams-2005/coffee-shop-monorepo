import { bestsellersData } from "../../../lib/mock/products";
import { ProductCarousel } from "../../ui/ProductCarousel";
import { NewestProductCard } from "./NewestProductCard"; // ایمپورت کارت جدید

export function NewestProducts() {
  // این پردازش کاملاً سمت سرور انجام می‌شود
  const newestProducts = bestsellersData.slice(0, 20);

  return (
    <ProductCarousel title="جدیدترین محصولات" viewAllLink="/products">
      {newestProducts.map((product, index) => (
        <NewestProductCard key={product.id} product={product} index={index} />
      ))}
    </ProductCarousel>
  );
}
