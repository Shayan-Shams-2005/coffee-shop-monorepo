import { bestsellersData } from "../../../lib/mock/products";
import { ProductCarousel } from "../../ui/ProductCarousel";
import { BestsellerCard } from "./BestSellerCard";

export function Bestsellers() {
  // این پردازش کاملاً سمت سرور انجام می‌شود
  const topBestsellers = bestsellersData.slice(0, 20);

  return (
    <ProductCarousel title="پرفروش‌ترین محصولات" viewAllLink="/bestsellers">
      {topBestsellers.map((product, index) => (
        <BestsellerCard key={product.id} product={product} rank={index + 1} />
      ))}
    </ProductCarousel>
  );
}
