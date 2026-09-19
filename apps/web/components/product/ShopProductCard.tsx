"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Timer } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// کامپوننت تایمر داخلی کارت
const CardTimer = ({ hoursLeft }: { hoursLeft: number }) => {
  const endTime = useMemo(
    () => Date.now() + hoursLeft * 60 * 60 * 1000,
    [hoursLeft],
  );
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    if (hoursLeft <= 0) return;
    const interval = setInterval(() => {
      const newTimeLeft = endTime - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, hoursLeft]);

  if (hoursLeft <= 0) return <div className="h-6"></div>; // فضای خالی برای حفظ تراز کارت

  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);
  const formatTime = (num: number) =>
    toFarsiNumber(num.toString().padStart(2, "0"));

  return (
    // 🚀 FIXED: Timer dark mode background, borders, and colons
    <div
      className="flex items-center gap-0.5 text-[#D95D39] font-black text-[11px] bg-[#FFFDFB] dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3A221C] shadow-sm px-2 py-0.5 rounded-md w-fit shrink-0 transition-colors"
      dir="ltr"
    >
      <Timer className="w-3 h-3 mr-1 animate-pulse" />
      <span className="w-4 text-center">{formatTime(h)}</span>
      <span className="text-[#E3C3A4] dark:text-[#6A5A4F] pb-0.5 transition-colors">
        :
      </span>
      <span className="w-4 text-center">{formatTime(m)}</span>
      <span className="text-[#E3C3A4] dark:text-[#6A5A4F] pb-0.5 transition-colors">
        :
      </span>
      <span className="w-4 text-center">{formatTime(s)}</span>
    </div>
  );
};

export function ShopProductCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  const hasDiscount = product.discount > 0;
  const hasTimer = hasDiscount && product.hoursLeft > 0;

  return (
    // 🚀 FIXED: Main card container dark mode styling
    <div className="flex flex-col bg-white dark:bg-[#1A110F] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_25px_rgba(198,142,88,0.15)] transition-all duration-300 group/card relative border border-[#F5EFE6] dark:border-[#3A221C] hover:border-[#E3C3A4] dark:hover:border-[#C68E58]">
      {/* لیبل فروش ویژه */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#D95D39] to-[#C44536] text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl shadow-md">
          فروش ویژه
        </div>
      )}

      <Link
        href={`/product/${product.id}`}
        // 🚀 FIXED: Added the Latte gradient to make JPGs look transparent in dark mode!
        className="relative w-full aspect-square mb-3 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[14px] flex items-center justify-center overflow-hidden border border-[#F5EFE6] dark:border-transparent transition-colors"
      >
        <Image
          src={imagePath}
          alt={product.name}
          fill
          className="object-contain p-3.5 mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500 z-10"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <Link
          href={`/product/${product.id}`}
          // 🚀 FIXED: Product name text colors
          className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#EAE0D5] font-medium leading-relaxed h-[44px] mb-1 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2 overflow-hidden"
        >
          {product.name}
        </Link>

        {/* تراز ستاره‌ها و تایمر */}
        <div className="flex items-center justify-between mt-1 mb-3">
          <div className="flex items-center gap-1 shrink-0 order-2">
            <span className="text-[13px] font-black text-[#666] dark:text-[#EAE0D5] pt-0.5 transition-colors">
              {toFarsiNumber(product.rating)}
            </span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="order-1">
            <CardTimer hoursLeft={product.hoursLeft} />
          </div>
        </div>

        <div className="mt-auto flex flex-col justify-end">
          {/* قیمت خط خورده */}
          <div
            className="flex items-center justify-end gap-1.5 w-full mb-0.5 h-5"
            dir="rtl"
          >
            {hasDiscount && (
              <>
                <span className="bg-[#D95D39] text-white text-[12px] sm:text-[13px] font-black px-2 py-0.5 rounded-[8px] shadow-sm leading-none flex items-center justify-center">
                  {toFarsiNumber(product.discount)}٪
                </span>
                <span className="text-[13px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through font-medium transition-colors">
                  {toFarsiNumber(product.oldPrice.toLocaleString("en-US"))}
                </span>
              </>
            )}
          </div>

          {/* قیمت اصلی */}
          <div
            className="flex items-center justify-end gap-1 w-full mt-1"
            dir="rtl"
          >
            <span className="text-[18px] sm:text-[22px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter transition-colors">
              {toFarsiNumber(product.price.toLocaleString("en-US"))}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#717171] dark:text-[#C6B59D] font-bold pt-1 transition-colors">
              تومان
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: imagePath,
            } as any)
          }
          // 🚀 FIXED: "Add to cart" button dark mode styling updated to primary mocha
          className="w-full mt-4 py-2.5 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center active:scale-95 shadow-sm whitespace-nowrap transition-colors duration-300
                     bg-[#C68E58] hover:bg-[#A87242] text-white border border-[#C68E58] hover:border-[#A87242]
                     dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#7B4E36] dark:hover:border-[#7B4E36] dark:shadow-[0_4px_12px_rgba(106,66,45,0.2)]"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}
