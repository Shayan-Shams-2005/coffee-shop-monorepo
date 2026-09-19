"use client";
import Link from "next/link";
import { ChevronLeft, Percent } from "lucide-react";

export function OffersHeader() {
  return (
    <div className="bg-gradient-to-br from-[#C68E58] via-[#D5A777] to-[#E3C3A4] dark:from-[#5C1A11] dark:via-[#3A110B] dark:to-[#1A0705] pt-8 pb-12 shadow-lg relative overflow-hidden transition-colors duration-500">
      {/* 🚀 FIXED: Made the dots smaller (1px) and drastically reduced the opacity for a subtle, premium look */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px] transition-opacity"></div>

      <div className="container mx-auto max-w-[1400px] px-4 relative z-10">
        <nav className="flex items-center gap-2 text-xs text-[#FFFDFB] mb-8 font-medium">
          <Link href="/" className="hover:text-white transition-colors">
            خانه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#FFFDFB]/70" />
          <Link href="/products" className="hover:text-white transition-colors">
            تمام محصولات
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#FFFDFB]/70" />
          <span className="text-white font-bold">تخفیف‌های ویژه</span>
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 dark:bg-black/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/10 shadow-sm transition-colors">
            <Percent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
              شگفت‌انگیزهای نئو کافه
            </h1>
            <p className="text-[#FFFDFB] text-sm sm:text-base font-medium mt-2">
              بهترین قهوه‌ها با بی‌نظیرترین قیمت‌ها، فقط برای مدت محدود!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
