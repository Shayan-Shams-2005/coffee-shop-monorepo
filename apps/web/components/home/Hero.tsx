import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Coffee, ChevronLeft } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative rounded-3xl overflow-hidden my-6 p-8 md:p-16 flex flex-col-reverse md:flex-row items-center justify-between gap-8 shadow-2xl transition-colors duration-500
                 bg-gradient-to-br from-[#C68E58] to-[#B87D46] text-white
                 dark:from-[#231511] dark:via-[#1A110F] dark:to-[#0F0A08] dark:text-[#FCF9F5]"
      aria-label="بخش معرفی اصلی نئو کافه"
    >
      {/* ================= بخش متن و دکمه (راست‌چین) ================= */}
      <div className="flex-1 space-y-6 z-10 text-center md:text-right">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          بیدار شو و{" "}
          <span className="text-[#4A3022] dark:text-[#C68E58] transition-colors">
            طعم واقعی
          </span>{" "}
          را احساس کن.
        </h1>

        <p className="text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed transition-colors text-white/90 dark:text-[#A1A1A1]">
          ما بهترین دانه‌های قهوه را از مزارع سراسر جهان دست‌چین کرده‌ایم تا هر
          فنجان برای شما یک تجربه بی‌نظیر باشد.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
          <Link href="/shop" tabIndex={-1}>
            <Button
              className="flex items-center justify-center gap-2 text-lg px-8 py-6 rounded-full transition-all hover:scale-105 active:scale-95
                         bg-white !text-[#C68E58] hover:bg-[#FCF9F5] shadow-[0_10px_20px_rgba(255,255,255,0.15)]
                         dark:bg-[#6A422D] dark:hover:bg-[#7B4E36] dark:!text-[#F3E8E0] dark:shadow-[0_10px_20px_rgba(106,66,45,0.3)]"
            >
              خرید قهوه
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= بخش تصویر/آیکون نمایشی ================= */}
      <div
        className="flex-1 w-full flex justify-center z-10"
        aria-hidden="true"
      >
        <div
          className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center border-4 relative transition-colors
                         bg-white/10 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]
                         dark:bg-[#3D2616] dark:border-[#C68E58]/20 dark:shadow-[0_0_50px_rgba(212,163,115,0.15)]"
        >
          <div className="absolute inset-0 rounded-full animate-pulse transition-colors bg-white/10 dark:bg-[#C68E58]/10"></div>
          <Coffee className="w-32 h-32 relative z-10 transition-colors text-white dark:text-[#C68E58]" />
        </div>
      </div>
    </section>
  );
}
