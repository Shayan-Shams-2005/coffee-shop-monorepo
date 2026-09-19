"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Star } from "lucide-react";
import { CountdownTimer } from "../ui/CountDownTimer";
import { useCartStore } from "../../src/store/useCartStore";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-[#F59E0B] text-white"; // طلایی
    case 2:
      return "bg-[#9CA3AF] text-white"; // نقره‌ای
    case 3:
      return "bg-[#D5A777] text-white"; // برنزی
    default:
      return "bg-[#1876D2] text-white"; // آبی
  }
};

export function BestsellerRankedCard({
  product,
  rank,
  index,
}: {
  product: any;
  rank: number;
  index: number;
}) {
  const addToCart = useCartStore((state) => state.addToCart);

  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;
  const hasDiscount = product.discount > 0;

  return (
    <div className="flex flex-col p-4 sm:p-5 border-b border-l border-[#F5EFE6] bg-white dark:bg-[#1A110F] dark:border-[#3c2317] relative group hover:shadow-[0_0_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:z-20 transition-all duration-300">
      {/* بج رتبه */}
      <div
        className={`absolute top-0 right-4 w-8 flex flex-col items-center justify-center font-black text-[15px] z-30 rounded-b-xl shadow-sm pb-1 pt-1.5 ${
          rank === 1 ? "h-12" : "h-10"
        } ${getRankStyle(rank)}`}
      >
        {rank === 1 && (
          <Trophy className="w-4 h-4 mb-0.5 text-white drop-shadow-sm" />
        )}
        <span>{toFarsiNumber(rank)}</span>
      </div>

      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-square mt-8 mb-4 bg-[#FCF9F5] dark:bg-gradient-to-br dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-2xl flex items-center justify-center overflow-hidden group/image transition-colors"
      >
        {/* لیبل فروش ویژه */}
        {hasDiscount && (
          <div className="absolute top-0 right-0 bg-[#D95D39] text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl z-20 shadow-sm">
            فروش ویژه
          </div>
        )}

        <Image
          src={imagePath}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 150px, 200px"
          className="object-contain p-2 mix-blend-multiply group-hover/image:scale-110 transition-transform duration-500 z-10"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <Link
          href={`/product/${product.id}`}
          className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#EAE0D5] font-bold leading-6 h-[48px] mb-2 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* تایمر و امتیاز */}
        <div className="flex items-center justify-between mb-4 min-h-[26px]">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[13px] font-black text-[#666] dark:text-[#EAE0D5] pt-0.5 transition-colors">
              {toFarsiNumber(product.rating)}
            </span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          {/* فراخوانی تایمر */}
          {product.hoursLeft && (
            <CountdownTimer hoursLeft={product.hoursLeft} />
          )}
        </div>

        {/* قیمت */}
        <div className="mt-auto flex flex-col justify-end">
          {hasDiscount ? (
            <div
              className="flex items-center justify-end gap-1.5 w-full mb-0.5"
              dir="rtl"
            >
              <span className="bg-[#D95D39] text-white text-[12px] sm:text-[13px] font-black px-2 py-0.5 rounded-[8px] shadow-sm leading-none flex items-center justify-center">
                {toFarsiNumber(product.discount)}٪
              </span>
              <span className="text-[13px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through font-medium transition-colors">
                {toFarsiNumber(product.oldPrice.toLocaleString("en-US"))}
              </span>
            </div>
          ) : (
            <div className="h-[24px] w-full mb-1"></div>
          )}

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

        <div className="mt-5">
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: imagePath,
              } as any)
            }
            // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
            className="w-full py-2.5 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center active:scale-95 shadow-sm whitespace-nowrap transition-colors duration-300 bg-[#C68E58] text-white border border-[#C68E58] hover:bg-[#A87242] dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:hover:border-[#5A3826] dark:shadow-none"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}