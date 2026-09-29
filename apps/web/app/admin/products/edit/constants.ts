// app/admin/products/edit/constants.ts
import { ProductFormData } from "./types"; // مسیر تایپ را با توجه به پوشه‌بندی خود تنظیم کنید

export const INITIAL_PRODUCT_DATA: ProductFormData = {
  title: "قهوه ملو مدل کنیا ۱۰۰ درصد عربیکا (۲۵۰ گرمی)",
  description: "این قهوه با اسیدیته شفاف و نت‌های طعمی شکلات و مرکبات، بهترین انتخاب برای قهوه‌های دمی است.",
  category: "coffee-beans",
  brand: "neo-roasters",
  basePrice: 1450000,
  salePrice: 1150000,
  offerEndDate: new Date(),
  mainImage: "/images/product-1.png",
  gallery: ["/images/gallery-1.png", "/images/gallery-2.png"],
  keyFeatures: [
    { key: "نوع قهوه", value: "۱۰۰٪ عربیکا" },
    { key: "درجه برشتگی", value: "متوسط" },
    { key: "درجه تلخی", value: "نسبتاً کم" },
    { key: "کافئین", value: "متوسط" },
    { key: "رایحه", value: "زیاد" },
    { key: "طعم یادها", value: "مرکبات، کاکائو، کارامل" },
  ],
  specs: [
    { key: "خاستگاه", value: "کنیا" },
    { key: "ارتفاع کشت", value: "۱۷۰۰ متر" },
    { key: "وزن", value: "۲۵۰ گرم" },
  ],
  optionGroups: [
    {
      title: "انتخاب نوع آسیاب",
      options: ["دانه قهوه", "اسپرسو ساز", "موکاپات", "فرنچ پرس", "قهوه ساز فیلتری"],
    },
  ],
};