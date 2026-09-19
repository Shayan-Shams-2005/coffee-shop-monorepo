import { ALL_BRANDS, PRODUCT_CATEGORIES } from "./offers-data";

export { ALL_BRANDS as BRANDS, PRODUCT_CATEGORIES as CATEGORIES };

export const MOCK_PRODUCTS = Array.from({ length: 36 }).map((_, i) => {
  const price = 350000 + i * 45000;

  // منطق تخفیف: از هر 3 کالا، یکی تخفیف دارد (فروش ویژه)
  const hasDiscount = i % 3 === 0;
  const discount = hasDiscount ? 10 + (i % 3) * 5 : 0;
  const oldPrice = hasDiscount
    ? Math.round(price / (1 - discount / 100))
    : price;

  // منطق تایمر: از بین کالاهای تخفیف دار، نیمی از آن‌ها تایمر دارند
  const hasTimer = hasDiscount && i % 2 === 0;
  const hoursLeft = hasTimer ? (i % 11) + 1 : 0;

  const randomBrand = ALL_BRANDS[i % ALL_BRANDS.length] || "برند متفرقه";
  const randomCategory =
    PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length]?.title ||
    "دسته‌بندی عمومی";

  return {
    id: `shop-prod-${i + 1}`,
    name:
      i % 2 === 0
        ? `قهوه تخصصی تک‌خاستگاه لاین ${i + 1}`
        : `پکیج ویژه ${randomBrand} مدل ${i + 1}`,
    brand: randomBrand,
    category: randomCategory,
    price: price,
    oldPrice: oldPrice,
    discount: discount,
    rating: 3.5 + (i % 16) / 10,
    hoursLeft: hoursLeft, // اگر 0 باشد یعنی تایمر ندارد
    sales: 50 + i * 12,
    views: 100 + i * 25,
    date: new Date(Date.now() - i * 10000000).toISOString(),
  };
});
