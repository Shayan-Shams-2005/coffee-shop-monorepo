"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Timer } from "lucide-react";
import { CarouselCartButton } from "../../ui/CarouselCartButton";

interface RelatedProductCardProps {
  product: any;
  index: number;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR");
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function RelatedProductCard({
  product,
  index,
}: RelatedProductCardProps) {
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 59 * 60 + 46);

  useEffect(() => {
    if (!product.hasTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [product.hasTimer]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-[170px] sm:w-[200px] flex-shrink-0 flex flex-col snap-start bg-white dark:bg-[#1A110F] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-[#F5EFE6] dark:border-[#3A221C] hover:shadow-[0_12px_25px_rgba(198,142,88,0.12)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all duration-300 group/card relative">
      {product.discount > 0 && (
        <div className="absolute top-3 right-3 z-20 bg-[#D95D39] text-white text-[10px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-xl shadow-sm">
          فروش ویژه
        </div>
      )}

      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-square mb-3 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[14px] flex items-center justify-center overflow-hidden border border-[#F5EFE6] dark:border-transparent transition-colors"
      >
        <Image
          src={imagePath}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 170px, 200px"
          className="object-contain p-3.5 mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500 z-10"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <Link
          href={`/product/${product.id}`}
          className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#EAE0D5] font-medium leading-relaxed h-[44px] mb-3 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2 overflow-hidden"
        >
          {product.name}
        </Link>

        <div className="mt-auto mb-3 flex flex-col justify-end pt-2 min-h-[50px]">
          {product.discount > 0 && (
            <div className="flex items-center justify-between w-full mb-1.5">
              {product.hasTimer ? (
                // 🚀 FIXED: Styled the timer with a hollow background, outlined icon, and dimmed colons[cite: 12]
                <div
                  className="flex items-center gap-1.5 border border-[#F0EBE1] dark:border-[#3A221C] bg-white dark:bg-[#1A110F] px-2 py-0.5 rounded-[8px] transition-colors"
                  dir="ltr"
                >
                  <Timer className="w-3.5 h-3.5 text-[#D95D39]" />
                  <div className="flex items-center gap-0.5 text-[#D95D39] text-[11px] font-black pt-0.5">
                    <span>{toFarsiNumber(String(hours).padStart(2, "0"))}</span>
                    <span className="text-[#A1A1A1] dark:text-[#6A5A4F] mb-[1px] mx-0.5">
                      :
                    </span>
                    <span>
                      {toFarsiNumber(String(minutes).padStart(2, "0"))}
                    </span>
                    <span className="text-[#A1A1A1] dark:text-[#6A5A4F] mb-[1px] mx-0.5">
                      :
                    </span>
                    <span>
                      {toFarsiNumber(String(seconds).padStart(2, "0"))}
                    </span>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {/* 🚀 FIXED: Set direction to LTR to visually enforce [Initial Price] [Discount Badge] order[cite: 11] */}
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[11px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through font-bold pt-0.5 transition-colors">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="bg-[#D95D39] text-white text-[10px] font-black px-1.5 py-0.5 rounded-[6px]">
                  {toFarsiNumber(product.discount)}٪
                </span>
              </div>
            </div>
          )}

          <div
            className="flex items-center justify-end gap-1.5 w-full mt-auto"
            dir="rtl"
          >
            <span className="text-[20px] sm:text-[24px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter transition-colors">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#717171] dark:text-[#C6B59D] font-bold pt-1 transition-colors">
              تومان
            </span>
          </div>
        </div>

        <CarouselCartButton product={product} />
      </div>
    </div>
  );
}