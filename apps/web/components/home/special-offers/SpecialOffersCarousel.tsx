"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { CountdownTimer } from "./CountDownTimer";

export function SpecialOffersCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtRight, setIsAtRight] = useState(true);
  const [isAtLeft, setIsAtLeft] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const currentScroll = Math.abs(scrollLeft);
    setIsAtRight(currentScroll <= 5);
    setIsAtLeft(currentScroll + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstElementChild) {
      const container = scrollRef.current;
      const card = container.firstElementChild as HTMLElement;
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.columnGap) || 8;
      const cardWidth = card.offsetWidth + gap;
      const currentScroll = Math.abs(container.scrollLeft);
      const remainder = currentScroll % cardWidth;

      let scrollAmount = cardWidth;
      if (remainder > 5 && cardWidth - remainder > 5) {
        scrollAmount =
          direction === "right" ? remainder : cardWidth - remainder;
      }
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-14 max-w-[1440px] mx-auto px-4 sm:px-6">
      {/* 🚀 FIXED: A luxurious dark-roast fiery gradient for dark mode */}
      <div className="bg-gradient-to-br from-[#C68E58] via-[#D5A777] to-[#E3C3A4] dark:from-[#4A1515] dark:via-[#7A2818] dark:to-[#2B0C0C] rounded-[28px] p-4 md:p-5 lg:p-6 relative overflow-hidden shadow-[0_15px_40px_rgba(198,142,88,0.2)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] bg-[radial-gradient(circle_at_center,_white_2.5px,_transparent_2.5px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-center justify-between mb-4 lg:mb-5 gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <Flame
                className="w-8 h-8 text-[#D95D39] dark:text-[#FF6B4A] fill-transparent animate-pulse drop-shadow-md"
                strokeWidth={2.5}
              />
              <h2 className="text-2xl md:text-3xl font-black text-white dark:text-[#FFD7BA] tracking-tight drop-shadow-md">
                تخفیف‌های ویژه
              </h2>
            </div>
            {/* رندر کردن تایمر ایزوله شده */}
            <CountdownTimer />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("right")}
                disabled={isAtRight}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                  isAtRight
                    ? "bg-white/40 border-white/20 text-[#8C5E33]/40 dark:bg-black/20 dark:border-white/5 dark:text-white/20 cursor-default"
                    : "bg-white border-white text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-black/40 dark:border-[#FFD7BA]/30 dark:text-[#FFD7BA] dark:hover:bg-black/60 dark:hover:border-[#FFD7BA] shadow-sm active:scale-95"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("left")}
                disabled={isAtLeft}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                  isAtLeft
                    ? "bg-white/40 border-white/20 text-[#8C5E33]/40 dark:bg-black/20 dark:border-white/5 dark:text-white/20 cursor-default"
                    : "bg-white border-white text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-black/40 dark:border-[#FFD7BA]/30 dark:text-[#FFD7BA] dark:hover:bg-black/60 dark:hover:border-[#FFD7BA] shadow-sm active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/offers"
              className="flex items-center justify-center gap-1 px-4 py-1.5 rounded-full shadow-sm transition-colors group text-[12px] font-bold
                         bg-white text-[#8C5E33] hover:bg-[#FCF9F5] hover:text-[#C68E58]
                         dark:bg-black/40 dark:text-[#FFD7BA] dark:hover:bg-black/60 dark:border dark:border-[#FFD7BA]/30 dark:hover:border-[#FFD7BA]"
            >
              مشاهده تخفیف‌ها
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="-mx-1 px-1 relative z-10">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
