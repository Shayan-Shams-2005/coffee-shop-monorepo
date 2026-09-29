// app/admin/brands/types.tsx
import React from "react";
import { Coffee, Wrench, Folder } from "lucide-react";
// در صورت نیاز مسیر این ایمپورت را بر اساس پوشه خود اصلاح کنید
import { Brand, brandsData } from "../../../config/brands";

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type UIBrand = Omit<Brand, "category"> & {
  category: string;
  image: string | null;
  productCount: number;
};

export const initialBrands: UIBrand[] = brandsData.map((b, index) => ({
  ...b,
  image: null,
  productCount: (index * 7) % 50 + 5,
}));

export const getCategoryTitle = (cat: string) => {
  if (cat === "coffee") return "برندهای دانه و قهوه";
  if (cat === "equipment") return "برندهای تجهیزات و اکسسوری";
  return `برندهای ${cat}`;
};

export const getCategoryShortName = (cat: string) => {
  if (cat === "coffee") return "دانه و قهوه";
  if (cat === "equipment") return "تجهیزات";
  return cat;
};

export const getCategoryIcon = (cat: string, isLarge = false) => {
  const sizeClass = isLarge ? "" : "w-4 h-4";
  const stroke = isLarge ? 1.5 : undefined;

  if (cat === "coffee") return <Coffee className={sizeClass} strokeWidth={stroke} />;
  if (cat === "equipment") return <Wrench className={sizeClass} strokeWidth={stroke} />;
  return <Folder className={sizeClass} strokeWidth={stroke} />;
};