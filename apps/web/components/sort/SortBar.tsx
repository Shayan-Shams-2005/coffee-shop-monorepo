"use client";

import { ListFilter } from "lucide-react";

export interface SortOption {
  id: string;
  label: string;
}

interface SortBarProps {
  activeSort: string;
  onSortChange: (sort: any) => void;
  productCount: number;
  options: SortOption[];
  countLabel?: string; // 🚀 Added this prop to make the label dynamic
  children?: React.ReactNode; // For injecting extra buttons (like mobile filter)
}

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function SortBar({
  activeSort,
  onSortChange,
  productCount,
  options,
  countLabel = "کالا", // 🚀 Default fallback is "کالا"
  children,
}: SortBarProps) {
  return (
    // 🚀 FIXED: Sticky background to match dark mode page background
    <div className="sticky top-20 z-40 bg-[#FCF9F5] dark:bg-[#1A1412] pt-4 -mt-4 mb-6 lg:mb-8 transition-colors duration-300">
      {/* 🚀 FIXED: Main bar background, border, and shadow */}
      <div className="bg-white/95 dark:bg-[#1A110F]/95 backdrop-blur-md rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F5EFE6] dark:border-[#3c2317] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto hide-scrollbar w-full sm:w-auto py-1 px-1">
          {/* 🚀 FIXED: Label text color */}
          <div className="flex items-center gap-1 text-sm font-black text-[#3D2616] dark:text-[#EAE0D5] shrink-0 ml-2 transition-colors">
            <ListFilter className="w-5 h-5 text-[#C68E58]" /> مرتب‌سازی:
          </div>

          {options.map((sort) => (
            <button
              key={sort.id}
              onClick={() => onSortChange(sort.id)}
              // 🚀 FIXED: Active and inactive states for sort buttons in dark mode
              className={`text-[12px] sm:text-[13px] font-bold whitespace-nowrap transition-colors ${
                activeSort === sort.id
                  ? "text-[#C68E58] bg-[#FCF9F5] border border-[#E3C3A4] dark:bg-[#2C1A14] dark:border-[#C68E58] dark:text-[#FFD7BA] px-3 py-1.5 rounded-xl shadow-sm"
                  : "text-[#8C7A6B] hover:text-[#3D2616] dark:text-[#8C7A6B] dark:hover:text-[#EAE0D5] px-3 py-1.5 border border-transparent"
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto">
          {children}
          {/* 🚀 FIXED: Product count label dark mode styling */}
          <div className="text-[12px] sm:text-[13px] font-bold text-[#8C7A6B] dark:text-[#EAE0D5] shrink-0 bg-[#FCF9F5] dark:bg-[#231511] px-3 py-2 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
            {/* 🚀 Render the dynamic label here */}
            {toFarsiNumber(productCount)} {countLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
