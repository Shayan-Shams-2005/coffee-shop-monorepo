"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ایمپورت دیتاهای جداشده
import { bestsellersData } from "../../lib/mock/products";
import { categories } from "../../lib/mock/categories";

// ایمپورت کامپوننت کارت
import { BestsellerRankedCard } from "../../components/product/BestSellersRankedCard";

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface BestsellersHeaderProps {
  timeframe: "7" | "30";
  setTimeframe: (val: "7" | "30") => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
}

function BestsellersHeader({
  timeframe,
  setTimeframe,
  activeCategory,
  setActiveCategory,
}: BestsellersHeaderProps) {
  return (
    <div className="bg-[#FCF9F5] border-b border-[#F0EBE1] dark:bg-[#1A1412] dark:border-[#3c2317] pt-6 pb-4 mb-8 transition-colors duration-300">
      <div className="container mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        {/* مسیر (Breadcrumb) */}
        <nav className="flex items-center gap-1.5 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-5 font-bold pt-2 transition-colors">
          <Link
            href="/"
            className="hover:text-[#D4A373] dark:hover:text-[#C68E58] transition-colors"
          >
            خانه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
          <Link
            href="/products"
            className="hover:text-[#D4A373] dark:hover:text-[#C68E58] transition-colors"
          >
            تمام محصولات
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
          <span className="text-[#D4A373] dark:text-[#C68E58]">
            پرفروش‌ترین‌ها
          </span>
        </nav>

        {/* ردیف بالا: عنوان و کنترلر زمانی */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight transition-colors">
                پرفروش‌ترین‌های نئو کافه
              </h1>
              <p className="text-sm font-medium text-[#8C7A6B] dark:text-[#ba8d71] mt-1 mr-1 transition-colors">
                محبوب‌ترین محصولات به انتخاب قهوه‌نوشان
              </p>
            </div>
          </div>

          {/* کنترلر زمانی */}
          {/* 🚀 FIXED: Made the container background transparent in dark mode with the correct subtle border */}
          <div className="flex items-center bg-white border border-[#F0EBE1] dark:bg-transparent dark:border-[#3A221C] p-1.5 rounded-[20px] shadow-sm dark:shadow-none self-start md:self-auto w-full md:w-auto transition-colors">
            <button
              onClick={() => setTimeframe("7")}
              // 🚀 FIXED: Applied primary mocha color to the active state, transparent to inactive
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                timeframe === "7"
                  ? "bg-[#FFF9F2] text-[#D4A373] shadow-sm dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:shadow-none"
                  : "text-[#8C7A6B] hover:text-[#5A4A42] bg-transparent dark:text-[#6A5A4F] dark:hover:text-[#F3E8E0]"
              }`}
            >
              ۷ روز گذشته
            </button>
            <button
              onClick={() => setTimeframe("30")}
              // 🚀 FIXED: Applied primary mocha color to the active state, transparent to inactive
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                timeframe === "30"
                  ? "bg-[#FFF9F2] text-[#D4A373] shadow-sm dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:shadow-none"
                  : "text-[#8C7A6B] hover:text-[#5A4A42] bg-transparent dark:text-[#6A5A4F] dark:hover:text-[#F3E8E0]"
              }`}
            >
              ۳۰ روز گذشته
            </button>
          </div>
        </div>

        {/* ردیف پایین: نوار دسته‌بندی‌ها */}
        <div className="flex flex-wrap items-center gap-3 pb-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              // 🚀 FIXED: Applied primary mocha color to active categories, transparent hollow style for inactive ones
              className={`shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 border-2 ${
                activeCategory === cat.id
                  ? "bg-[#D4A373] border-[#D4A373] text-white shadow-md dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:shadow-none"
                  : "bg-white border-[#F0EBE1] text-[#5A4A42] hover:border-[#D4A373] hover:text-[#D4A373] dark:bg-transparent dark:border-[#3A221C] dark:text-[#8C7A6B] dark:hover:border-[#6A422D] dark:hover:text-[#F3E8E0]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function BestsellersPage() {
  const [timeframe, setTimeframe] = useState<"7" | "30">("7");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const displayedProducts = useMemo(() => {
    let products =
      timeframe === "30" ? bestsellersData : bestsellersData.slice(0, 12);

    if (activeCategory !== "all") {
      products = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
    }

    return products;
  }, [timeframe, activeCategory]);

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-16 dir-rtl transition-colors duration-300">
      {/* هدر */}
      <BestsellersHeader
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* گرید محصولات */}
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="container mx-auto max-w-[1400px]">
          <div className="bg-white dark:bg-[#1A110F] rounded-[32px] shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-[#F0EBE1] dark:border-[#3c2317] overflow-hidden transition-colors duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6">
              {displayedProducts.map((product, index) => (
                <BestsellerRankedCard
                  key={`${timeframe}-${activeCategory}-${product.id}`}
                  product={product}
                  rank={index + 1}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}