// app/admin/products/constants.ts

import { megaMenuCategories } from "../../../config/menu";
import { Product } from "./types";

export const MAX_ALLOWED_PRICE = 5000000;

export const ADMIN_SORT_OPTIONS = [
  { id: "newest", label: "جدیدترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "bestoffer", label: "بیشترین تخفیف" },
];

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(date);
  const timePart = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  return `${datePart}، ${timePart}`;
};

export const sanitizeNameForFilter = (name: string | null) => {
  if (!name) return null;
  return (name.split('(')[0] ?? "").trim();
};

// --- Mock Data Generation ---
const getCompleteCategories = () => {
  const names = new Set<string>();
  megaMenuCategories.forEach(main => {
    names.add(main.title);
    main.sections.forEach(sec => {
      names.add(sec.title);
      sec.items.forEach(item => names.add(item));
    });
  });
  return Array.from(names);
};

const COMPLETE_CATEGORIES = getCompleteCategories();

const baseProducts = [
  { name: "قهوه اسپرسو ویژه", price: 350000, brand: "ایلی" },
  { name: "قهوه ترک مدیوم", price: 280000, brand: "مهمت افندی" },
  { name: "اسپرسو دارک رست", price: 420000, brand: "لاوازا" },
  { name: "دان قهوه ۱۰۰٪ عربیکا", price: 550000, brand: "استارباکس" },
  { name: "کپسول قهوه نسپرسو", price: 480000, brand: "نسپرسو" },
  { name: "چای سبز لاهیجان", price: 150000, brand: "تی‌کانه" },
  { name: "ماگ سرامیکی مشکی", price: 220000, brand: "متفرقه" },
  { name: "موکاپات ۳ کاپ", price: 850000, brand: "بیالتی" },
  { name: "فرنچ پرس ۶۰۰ میل", price: 450000, brand: "یاتی" },
  { name: "پودر کاکائو هلندی", price: 320000, brand: "نسکافه" },
];

export const mockProducts: Product[] = Array.from({ length: 300 }).map((_, index) => {
  const base = baseProducts[index % baseProducts.length] || { name: "قهوه اسپرسو ویژه", price: 350000, brand: "ایلی" };
  const categoryName = COMPLETE_CATEGORIES[index % COMPLETE_CATEGORIES.length] || "قهوه اسپرسو";
  
  return {
    id: index + 1000,
    name: `${base.name} (کد ${index + 1})`,
    category: categoryName,
    brand: base.brand,
    price: base.price + ((index % 5) * 15000),
    stock: index % 7 === 0 ? 0 : 15 + (index % 10),
    salesVolume: 10 + (index % 50),
    hasOffer: index % 4 === 0,
    newPrice: index % 4 === 0 ? base.price - 50000 : null,
    offerEndDate: index % 4 === 0 ? "2026-10-15T23:59:59" : null,
    image: `/images/product-${(index % 3) + 1}.png`,
  };
});