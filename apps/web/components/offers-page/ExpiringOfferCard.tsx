"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Timer, Star } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const CountdownTimer = ({ hoursLeft }: { hoursLeft: number }) => {
  const endTime = useMemo(
    () => Date.now() + hoursLeft * 60 * 60 * 1000,
    [hoursLeft],
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

  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  const formatTime = (num: number) =>
    toFarsiNumber(num.toString().padStart(2, "0"));

  return (
    <div
      className="flex items-center gap-0.5 text-[#D95D39] font-black text-sm bg-[#FFFDFB] dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3A221C] shadow-sm px-2.5 py-1 rounded-lg w-fit shrink-0 transition-colors"
      dir="ltr"
    >
      <Timer className="w-4 h-4 mr-1 animate-pulse" />
      <span className="w-5 text-center">{formatTime(h)}</span>
      <span className="text-[#E3C3A4] dark:text-[#6A5A4F] pb-0.5 transition-colors">
        :
      </span>
      <span className="w-5 text-center">{formatTime(m)}</span>
      <span className="text-[#E3C3A4] dark:text-[#6A5A4F] pb-0.5 transition-colors">
        :
      </span>
      <span className="w-5 text-center">{formatTime(s)}</span>
    </div>
  );
};

export function ExpiringOfferCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  return (
    <div className="w-[340px] sm:w-[380px] flex-shrink-0 snap-start bg-white dark:bg-[#1A110F] rounded-[32px] p-5 flex items-center gap-4 border-2 border-[#F5EFE6] dark:border-[#3A221C] shadow-[0_10px_30px_rgba(198,142,88,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] hover:shadow-[0_15px_40px_rgba(198,142,88,0.15)] transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D95D39]/5 rounded-full blur-3xl -z-10"></div>

      <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] border border-[#F5EFE6] dark:border-transparent rounded-2xl shrink-0 transition-colors">
        <div className="absolute top-0 right-0 z-20 bg-[#D95D39] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-sm">
          فروش ویژه
        </div>
        <Link href={`/product/${product.id}`}>
          <Image
            src={imagePath}
            alt={product.name}
            fill
            className="object-contain p-3 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      <div className="flex flex-col flex-1 py-1 h-full justify-between">
        <Link
          href={`/product/${product.id}`}
          className="font-bold text-[#3D2616] dark:text-[#EAE0D5] text-sm line-clamp-2 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-2 mb-3">
          <CountdownTimer hoursLeft={product.hoursLeft} />
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[12px] font-bold text-[#8C7A6B] dark:text-[#EAE0D5] transition-colors">
              {toFarsiNumber(product.rating)}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto gap-2">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1.5 mb-0.5" dir="rtl">
              <span className="bg-[#D95D39] text-white text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 rounded-[6px] shadow-sm leading-none flex items-center justify-center">
                {toFarsiNumber(product.discount)}٪
              </span>
              <span className="text-[11px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through font-medium transition-colors">
                {toFarsiNumber(product.oldPrice.toLocaleString("en-US"))}
              </span>
            </div>
            <div className="text-[16px] sm:text-[18px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter flex items-center gap-1 transition-colors">
              {toFarsiNumber(product.price.toLocaleString("en-US"))}
              <span className="text-[9px] text-[#717171] dark:text-[#C6B59D] font-bold pt-0.5 transition-colors">
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
            // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
            className="h-9 px-3 sm:px-4 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-sm active:scale-95 whitespace-nowrap bg-[#C68E58] hover:bg-[#A87242] text-white border border-[#C68E58] hover:border-[#A87242] dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:hover:border-[#5A3826] dark:shadow-none"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}