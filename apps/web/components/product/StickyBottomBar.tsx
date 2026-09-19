"use client";

import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";

interface StickyBottomBarProps {
  product: any;
  isVisible: boolean;
  onAddToCart: () => void;
}

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function StickyBottomBar({
  product,
  isVisible,
  onAddToCart,
}: StickyBottomBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A110F] border-t border-[#F0EBE1] dark:border-[#3c2317] shadow-[0_-20px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-50 transition-all duration-700 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-[150%]"
      }`}
    >
      <div className="container mx-auto max-w-[1400px] px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-5">
            <div className="relative w-16 h-16 bg-[#F9F8F6] dark:bg-white rounded-2xl border border-[#F0EBE1] dark:border-transparent flex-shrink-0 overflow-hidden transition-colors">
              <Image
                src={product.images[0] ?? ""}
                alt={product.name}
                fill
                className="object-contain p-2 mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-black text-[#2C1E16] dark:text-[#EAE0D5] line-clamp-1 transition-colors">
                {product.name}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-[#2C1E16] dark:text-[#EAE0D5] transition-colors">
                  {product.rating}
                </span>
                <span className="text-[10px] text-[#8C7A6B] dark:text-[#A1A1A1] ml-1 transition-colors">
                  ({product.reviewsCount} نظر)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
            <div className="flex flex-col items-end">
              {product.discount > 0 && (
                // 🚀 FIXED: Added the discount percentage badge to the right of the initial price
                <div className="flex items-center gap-1.5 mb-0.5" dir="ltr">
                  <span className="text-[11px] text-[#8C7A6B] dark:text-[#A1A1A1] line-through font-medium transition-colors pt-0.5">
                    {product.oldPrice.toLocaleString("fa-IR")}
                  </span>
                  <span className="bg-[#D95D39] text-white text-[10px] font-black px-1.5 py-0.5 rounded-[6px]">
                    {toFarsiNumber(product.discount)}٪
                  </span>
                </div>
              )}
              <div className="text-xl font-black text-[#2C1E16] dark:text-[#FFF8F0] dir-ltr flex items-center gap-1 transition-colors">
                <span className="text-[10px] font-bold text-[#8C7A6B] dark:text-[#ba8d71] mt-1 transition-colors">
                  تومان
                </span>
                {product.price.toLocaleString("fa-IR")}
              </div>
            </div>

            <button
              onClick={() => {
                scrollToTop();
              }}
              className="px-8 py-3.5 bg-[#C68E58] hover:bg-[#A87242] text-white font-black text-sm rounded-2xl transition-all shadow-[0_8px_20px_rgba(198,142,88,0.25)] active:scale-[0.98] whitespace-nowrap flex items-center gap-2 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
            >
              <ShoppingBag className="w-4 h-4" />
              مشاهده محصول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
