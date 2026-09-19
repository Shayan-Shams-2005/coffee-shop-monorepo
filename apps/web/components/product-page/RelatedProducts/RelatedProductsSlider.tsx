"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RelatedProductCard } from "./RelatedProductCard";

interface RelatedProductsSliderProps {
  products: any[];
}

export function RelatedProductsSlider({
  products,
}: RelatedProductsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-20 pt-16 border-t border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white flex items-center gap-3 transition-colors">
          <div className="w-2 h-8 bg-[#C68E58] rounded-full"></div>
          کالاهای مشابه
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => scrollSlider("right")}
            // 🚀 FIXED: Navigation buttons dark mode styles
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] shadow-sm flex items-center justify-center text-[#8C7A6B] dark:text-[#A1A1A1] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] hover:text-[#C68E58] dark:hover:text-[#FFD7BA] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollSlider("left")}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] shadow-sm flex items-center justify-center text-[#8C7A6B] dark:text-[#A1A1A1] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] hover:text-[#C68E58] dark:hover:text-[#FFD7BA] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product, index) => (
          <RelatedProductCard
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
