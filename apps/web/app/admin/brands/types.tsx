// app/admin/brands/types.tsx
import React from "react";
import { Folder } from "lucide-react";

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type UIBrand = {
  id: string;
  name: string;
  category: string;
  image: string | null;
  productCount: number;
};

// Mock data completely removed
export const initialBrands: UIBrand[] = [];

export const getCategoryTitle = (cat: string) => {
  if (cat === "all") return "همه برندها";
  return `برندهای ${cat}`;
};

export const getCategoryShortName = (cat: string) => {
  if (cat === "all") return "همه";
  return cat;
};

export const getCategoryIcon = (cat: string, isLarge = false) => {
  const sizeClass = isLarge ? "" : "w-4 h-4";
  const stroke = isLarge ? 1.5 : undefined;
  return <Folder className={sizeClass} strokeWidth={stroke} />;
};