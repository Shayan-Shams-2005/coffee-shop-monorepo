"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";

interface ProductCarouselProps {
  title: string;
  viewAllLink: string;
  children: React.ReactNode;
}

export function ProductCarousel({
  title,
  viewAllLink,
  children,
}: ProductCarouselProps) {
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
    <section className="my-16 max-w-[1440px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#C68E58] rounded-full"></div>
          {/* 🚀 FIXED: Title now turns white in dark mode */}
          <h2 className="text-xl md:text-3xl font-black text-[#3D2616] dark:text-white tracking-tight flex items-center gap-3 transition-colors">
            <Award className="w-7 h-7 text-[#C68E58]" strokeWidth={2} />
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {/* 🚀 FIXED: Right Arrow dark mode styling */}
            <button
              onClick={() => scroll("right")}
              disabled={isAtRight}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtRight
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-transparent dark:border-[#3A221C] dark:text-[#3A221C] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#1A110F] dark:border-[#3A221C] dark:text-[#EAE0D5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
              aria-label="اسکرول به راست"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* 🚀 FIXED: Left Arrow dark mode styling */}
            <button
              onClick={() => scroll("left")}
              disabled={isAtLeft}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtLeft
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-transparent dark:border-[#3A221C] dark:text-[#3A221C] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#1A110F] dark:border-[#3A221C] dark:text-[#EAE0D5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
              aria-label="اسکرول به چپ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 🚀 FIXED: View All Button dark mode styling */}
          <Link
            href={viewAllLink}
            className="flex items-center justify-center gap-1 text-[12px] font-bold px-4 py-1.5 rounded-full border shadow-sm transition-all group backdrop-blur-sm
                       bg-white/60 text-[#8C5E33] border-[#E3C3A4]/60 hover:text-[#C68E58] hover:bg-white
                       dark:bg-[#1A110F]/60 dark:text-[#EAE0D5] dark:border-[#3A221C] dark:hover:text-[#C68E58] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58]"
          >
            مشاهده همه
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="-mx-1 px-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* جادوی معماری اینجاست: کارت‌های سروری در اینجا رندر می‌شوند */}
          {children}
        </div>
      </div>
    </section>
  );
}
