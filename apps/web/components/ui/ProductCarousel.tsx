// apps/web/components/ui/ProductCarousel.tsx
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
  const isScrolling = useRef(false);
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
    const container = scrollRef.current;
    if (!container || !container.firstElementChild || isScrolling.current) return;

    isScrolling.current = true;
    const card = container.firstElementChild as HTMLElement;
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.columnGap) || 8;
    const cardWidth = card.offsetWidth + gap;

    // 🚀 FIXED: Absolute coordinate calculation based on browser dimensions
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentAbs = Math.abs(container.scrollLeft);
    
    let targetAbs = currentAbs;
    if (direction === "left") {
      // Find the EXACT start of the next card boundary
      targetAbs = Math.ceil((currentAbs + 1) / cardWidth) * cardWidth;
    } else {
      // Find the EXACT start of the previous card boundary
      targetAbs = Math.floor((currentAbs - 1) / cardWidth) * cardWidth;
    }

    // 🚀 FIXED: The absolute clamp! This prevents the "1.5x overshoot" at the end of the list.
    targetAbs = Math.max(0, Math.min(targetAbs, maxScroll));
    
    // Automatically handles RTL coordinate systems securely
    const sign = container.scrollLeft > 0 ? 1 : -1;
    const targetPos = targetAbs * sign;

    container.style.scrollSnapType = "none";
    const startPos = container.scrollLeft;
    const duration = 400; 
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 3);

      container.scrollLeft = startPos + (targetPos - startPos) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        container.style.scrollSnapType = "";
        isScrolling.current = false;
        handleScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <section className="my-16 max-w-[1440px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#C68E58] rounded-full"></div>
          <h2 className="text-xl md:text-3xl font-black text-[#3D2616] dark:text-white tracking-tight flex items-center gap-3 transition-colors">
            <Award className="w-7 h-7 text-[#C68E58]" strokeWidth={2} />
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("right")}
              disabled={isAtRight}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtRight
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-[#1A0F0C] dark:border-[#3c2317] dark:text-[#5C3A21] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3c2317] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
              aria-label="اسکرول به راست"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll("left")}
              disabled={isAtLeft}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtLeft
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-[#1A0F0C] dark:border-[#3c2317] dark:text-[#5C3A21] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3c2317] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
              aria-label="اسکرول به چپ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <Link
            href={viewAllLink}
            className="flex items-center justify-center gap-1 text-[12px] font-bold px-4 py-1.5 rounded-full border shadow-sm transition-all group backdrop-blur-sm
                       bg-white/60 text-[#8C5E33] border-[#E3C3A4]/60 hover:text-[#C68E58] hover:bg-white
                       dark:bg-[#231511] dark:text-[#E3C3A4] dark:border-[#5C3A21] dark:hover:text-[#FFD7BA] dark:hover:bg-[#3c2317] dark:hover:border-[#C68E58]"
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
          {children}
        </div>
      </div>
    </section>
  );
}