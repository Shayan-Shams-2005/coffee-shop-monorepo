"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Star, Timer } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";

const toFarsiNumber = (num: number | string) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// 🚀 NEW: Countdown Timer Component
const CountdownTimer = ({ hoursLeft }: { hoursLeft: number }) => {
  const endTime = useMemo(
    () => Date.now() + hoursLeft * 60 * 60 * 1000,
    [hoursLeft]
  );
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
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
  }, [endTime]);

  if (timeLeft <= 0) return null;

  // Calculate total hours, minutes, and seconds
  const h = Math.floor(timeLeft / (1000 * 60 * 60));
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  const formatTime = (num: number) =>
    toFarsiNumber(num.toString().padStart(2, "0"));

  return (
    <div
      className="flex items-center gap-0.5 text-white font-black text-[10px] sm:text-xs bg-[#D95D39] px-2 py-1 rounded-tr-xl shadow-sm"
      dir="ltr"
    >
      <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" />
      <span className="w-4 sm:w-5 text-center">{formatTime(h)}</span>
      <span className="opacity-80 pb-0.5">:</span>
      <span className="w-4 sm:w-5 text-center">{formatTime(m)}</span>
      <span className="opacity-80 pb-0.5">:</span>
      <span className="w-4 sm:w-5 text-center">{formatTime(s)}</span>
    </div>
  );
};

export function OfferCard({ product, index }: { product: any; index: number }) {
  const addToCart = useCartStore((state: any) => state.addToCart);
  const imagePath = product.imageUrl || "/placeholder.png";

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-[24px] p-3 flex flex-col border border-[#F5EFE6] dark:border-[#3A221C] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all group h-full">
      
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-[#FCF9F5] dark:bg-[#C8BCA7] rounded-[16px] overflow-hidden transition-colors flex items-center justify-center p-3">
        {/* Special Offer Badge (Top Right) */}
        {product.discount > 0 && (
          <div className="absolute top-0 right-0 z-20 bg-[#D95D39] text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
            فروش ویژه
          </div>
        )}

        {/* 🚀 NEW: Timer Badge (Bottom Left) - Only shows if there is a valid end date */}
        {product.hoursLeft > 0 && product.hoursLeft < 999 && (
          <div className="absolute bottom-0 left-0 z-20">
            <CountdownTimer hoursLeft={product.hoursLeft} />
          </div>
        )}

        <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imagePath}
            alt={product.name}
            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-1 mt-4 justify-between">
        
        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          dir="rtl"
          className="font-bold text-[#3D2616] dark:text-[#EAE0D5] text-[13px] sm:text-[14px] line-clamp-2 text-right mb-4 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors"
        >
          {product.name}
        </Link>
        
        {/* Rating & Pricing Row */}
        <div className="flex items-end justify-between mb-4">
          
          {/* Rating (Left) */}
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[12px] sm:text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] pt-0.5">
              {toFarsiNumber(product.rating || 5)}
            </span>
          </div>

          {/* Pricing (Right) */}
          <div className="flex flex-col items-end gap-1.5" dir="rtl">
            {product.discount > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="bg-[#D95D39] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                  {toFarsiNumber(product.discount)}٪
                </span>
                <span className="text-[11px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through">
                  {toFarsiNumber((product.oldPrice || 0).toLocaleString("en-US"))}
                </span>
              </div>
            ) : (
              <div className="h-4"></div> // Spacer to keep card heights uniform
            )}
            
            <div className="text-[15px] sm:text-[17px] font-black text-[#2C1E16] dark:text-[#FFF8F0] flex items-center gap-1">
              {toFarsiNumber((product.price || 0).toLocaleString("en-US"))}
              <span className="text-[9px] sm:text-[10px] text-[#717171] dark:text-[#A1A1A1] font-normal pt-1">
                تومان
              </span>
            </div>
          </div>
        </div>

        {/* Full-width Button */}
        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: imagePath,
            } as any)
          }
          className="w-full bg-[#8C5D3F] hover:bg-[#7A5035] dark:bg-[#6A422D] dark:hover:bg-[#5A3826] text-white text-[12px] sm:text-[13px] font-bold py-2.5 rounded-[12px] transition-all active:scale-[0.98] shadow-sm"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}