"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { brandsData } from "../../config/brands";
import { BrandCard } from "./BrandCard";

export function PopularBrands() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"coffee" | "equipment">("coffee");
  const [isAtRight, setIsAtRight] = useState(true);
  const [isAtLeft, setIsAtLeft] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  // فیلتر کردن دیتا
  const filteredBrands = brandsData.filter(
    (brand) => brand.category === activeTab,
  );

  // منطق کنترل اسکرول
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    if (scrollWidth <= clientWidth + 10) {
      setShowButtons(false);
      return;
    }
    setShowButtons(true);

    const currentScroll = Math.abs(Math.round(scrollLeft));
    setIsAtRight(currentScroll <= 15);
    setIsAtLeft(currentScroll + clientWidth >= scrollWidth - 15);
  }, []);

  useEffect(() => {
    checkScroll();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }

    const timeout = setTimeout(checkScroll, 150);
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeout);
    };
  }, [activeTab, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstElementChild) {
      const container = scrollRef.current;
      const card = container.firstElementChild as HTMLElement;

      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.columnGap) || 20;
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
    <section className="my-32 relative max-w-[1440px] mx-auto px-4 sm:px-6">
      {/* ================= هدر ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#C68E58] dark:bg-[#6A422D] rounded-full transition-colors"></div>
            <h2 className="text-2xl md:text-3xl font-black text-[#3D2616] dark:text-white tracking-tight flex items-center gap-3 transition-colors">
              <Award
                className="w-7 h-7 text-[#C68E58] dark:text-[#6A422D] transition-colors"
                strokeWidth={2}
              />
              برند ها
            </h2>
          </div>

          {/* تب سوییچر */}
          <div
            // 🚀 FIXED: Set to dark:bg-transparent so it takes the EXACT color of your website's background
            className="flex items-center p-1.5 rounded-2xl shadow-sm w-fit transition-colors bg-white border border-[#E3C3A4] dark:bg-transparent dark:border-[#25150E] dark:shadow-none"
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeTab === "coffee"}
              onClick={() => setActiveTab("coffee")}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === "coffee"
                  ? "bg-[#C68E58] text-white shadow-md dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:shadow-[0_2px_8px_rgba(106,66,45,0.3)]"
                  : "text-[#8C7A6B] hover:text-[#C68E58] bg-transparent dark:text-[#6A5A4F] dark:hover:text-[#F3E8E0]"
              }`}
            >
              برندهای قهوه
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "equipment"}
              onClick={() => setActiveTab("equipment")}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === "equipment"
                  ? "bg-[#C68E58] text-white shadow-md dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:shadow-[0_2px_8px_rgba(106,66,45,0.3)]"
                  : "text-[#8C7A6B] hover:text-[#C68E58] bg-transparent dark:text-[#6A5A4F] dark:hover:text-[#F3E8E0]"
              }`}
            >
              تجهیزات و اکسسوری
            </button>
          </div>
        </div>

        {/* دکمه‌های کنترل اسکرول */}
        {showButtons && (
          <div className="hidden md:flex items-center gap-2 dir-ltr">
            <button
              onClick={() => scroll("right")}
              disabled={isAtRight}
              aria-label="اسکرول به راست"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                isAtRight
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-transparent dark:border-[#3A221C] dark:text-[#3A221C] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#1A110F] dark:border-[#3A221C] dark:text-[#EAE0D5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("left")}
              disabled={isAtLeft}
              aria-label="اسکرول به چپ"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                isAtLeft
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-transparent dark:border-[#3A221C] dark:text-[#3A221C] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#1A110F] dark:border-[#3A221C] dark:text-[#EAE0D5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] active:scale-95"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= ناحیه اسکرول شونده ================= */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-6 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
}
