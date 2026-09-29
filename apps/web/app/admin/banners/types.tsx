// app/admin/banners/types.tsx
import React from "react";
import { MonitorUp, Sparkles, ShoppingBag, Tag } from "lucide-react";

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type SectionId = "above_header" | "under_offers" | "under_newest" | "under_brands";

export interface AdBanner {
  id: string;
  section: SectionId;
  imageUrl: string;
  link: string;
  alt: string;
}

export const SECTION_CONFIG: Record<SectionId, { title: string; max: number; icon: React.ReactNode }> = {
  above_header: { title: "بالای هدر (بالاترین نوار سایت)", max: 1, icon: <MonitorUp strokeWidth={1.5} /> },
  under_offers: { title: "زیر بخش شگفت‌انگیزها", max: 4, icon: <Sparkles strokeWidth={1.5} /> },
  under_newest: { title: "زیر بخش جدیدترین محصولات", max: 4, icon: <ShoppingBag strokeWidth={1.5} /> },
  under_brands: { title: "زیر بخش برندها", max: 4, icon: <Tag strokeWidth={1.5} /> },
};