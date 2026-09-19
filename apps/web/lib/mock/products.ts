import { Product, OfferProduct } from "../../../web/src/types/products";

// ساخت ۲۰ محصول برای لیست پرفروش‌ها و جدیدترین‌ها
export const bestsellersData: any[] = Array.from({ length: 20 }).map((_, i) => {
  // قیمت پایه
  const price = 450000 + i * 20000;

  // ۱. تعیین می‌کنیم کدام محصولات تخفیف داشته باشند (مثلاً ایندکس‌های خاص)
  const hasDiscount = i === 0 || i === 3 || i === 4 || i === 7 || i === 12;

  // درصد تخفیف (بین ۱۵ تا ۲۵ درصد متغیر)
  const discount = hasDiscount ? 15 + (i % 3) * 5 : 0;

  // محاسبه قیمت خط‌خورده (قدیمی) در صورت داشتن تخفیف
  const oldPrice = hasDiscount
    ? Math.round(price / (1 - discount / 100))
    : undefined;

  // ۲. تعیین می‌کنیم کدام محصولاتِ تخفیف‌دار، تایمر هم داشته باشند
  const hasTimer = hasDiscount && (i === 0 || i === 7 || i === 12);

  // تنظیم زمان تصادفی برای تایمر (مثلاً بین ۱۲ تا ۲۴ ساعت)
  const hoursLeft = hasTimer ? 12 + i * 2 : undefined;

  return {
    id: `p${i + 1}`,
    name:
      i % 2 === 0
        ? `قهوه اسپرسو ترکیب نئو ${i + 1}`
        : `قهوه دمی تک‌خاستگاه ${i + 1}`,
    description: "بهترین انتخاب برای شروع یک روز پرانرژی با طعمی ماندگار.",
    price: price,
    // 🚀 فیلدهای جدید برای فعال‌سازی UI فروش ویژه و تایمر
    oldPrice: oldPrice,
    discount: discount,
    hoursLeft: hoursLeft,
    imageUrl: `/mock-coffee-${(i % 4) + 1}.webp`,
    rating: 4.5 + (i % 5) / 10,
    roastLevel: i % 3 === 0 ? "تیره" : i % 2 === 0 ? "متوسط" : "روشن",
  };
});

// تولید ۲۰ محصول شگفت‌انگیز با درصد تخفیف‌های منطقی و استاندارد
export const specialOffersData: OfferProduct[] = Array.from({ length: 20 }).map(
  (_, i) => {
    const price = 450000 + i * 30000;
    const discount = 15 + (i % 8) * 5;
    const oldPrice = Math.round(price / (1 - discount / 100));

    return {
      id: `offer-${i + 1}`,
      name: `قهوه تخصصی تک‌خاستگاه لاین ${i + 1}`,
      description: "بهترین انتخاب برای شروع یک روز پرانرژی با طعمی ماندگار.",
      price: price,
      oldPrice: oldPrice,
      discount: discount,
      hoursLeft: 24 - (i % 12), // برای لیست شگفت‌انگیز همه تایمر دارند
      imageUrl: `/mock-coffee-${(i % 4) + 1}.webp`,
      rating: 4.8,
      roastLevel: "متوسط",
    };
  },
);
