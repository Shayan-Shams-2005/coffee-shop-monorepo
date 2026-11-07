// app/admin/brands/types.tsx
import React from "react";
import { Folder } from "lucide-react";

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export interface UIBrand {
  id: string;
  name: string;
  groupId: string;
  image: string | null;
  productCount: number;
}

export interface UIBrandGroup {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  brands: UIBrand[];
}

export const getCategoryIcon = (isLarge = false) => {
  const sizeClass = isLarge ? "" : "w-4 h-4";
  const stroke = isLarge ? 1.5 : undefined;
  return <Folder className={sizeClass} strokeWidth={stroke} />;
};