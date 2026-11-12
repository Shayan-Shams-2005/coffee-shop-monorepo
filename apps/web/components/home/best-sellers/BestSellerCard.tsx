// apps/web/components/home/BestsellerCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { CarouselCartButton } from "../../ui/CarouselCartButton";

interface BestsellerCardProps {
  product: any;
  rank: number;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR");

const getRankBadgeStyle = (rank: number) => {
  switch (rank) {
    case 1: // 🥇 True Gold
      return "bg-gradient-to-br from-[#FDE047] via-[#FACC15] to-[#B45309] text-[#451A03] dark:from-[#FEF08A] dark:via-[#EAB308] dark:to-[#92400E] dark:text-white shadow-[0_4px_12px_rgba(234,179,8,0.4)] border border-[#FEF08A]/50";
    case 2: // 🥈 True Silver
      return "bg-gradient-to-br from-[#F1F5F9] via-[#CBD5E1] to-[#64748B] text-[#0F172A] dark:from-[#E2E8F0] dark:via-[#94A3B8] dark:to-[#475569] dark:text-white shadow-[0_4px_12px_rgba(148,163,184,0.4)] border border-[#F1F5F9]/50";
    case 3: // 🥉 True Copper
      return "bg-gradient-to-br from-[#FDBA74] via-[#F97316] to-[#9A3412] text-[#431407] dark:from-[#FED7AA] dark:via-[#EA580C] dark:to-[#7C2D12] dark:text-white shadow-[0_4px_12px_rgba(234,88,12,0.4)] border border-[#FED7AA]/50";
    default: // Ranks 4+
      return "bg-white text-[#8C7A6B] border border-[#F2E8DB] dark:bg-[#5C3A21]/90 dark:backdrop-blur-md dark:border-[#8C5E33]/60 dark:text-[#FFD7BA] shadow-sm";
  }
};

export function BestsellerCard({ product, rank }: BestsellerCardProps) {
  const index = rank - 1;
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  return (
    <div className="w-[170px] sm:w-[200px] flex-shrink-0 flex flex-col snap-start bg-white dark:bg-[#231511] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-[#F5EFE6] dark:border-[#3c2317] hover:shadow-[0_12px_25px_rgba(198,142,88,0.12)] dark:hover:shadow-[0_15px_30px_rgba(198,142,88,0.15)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] dark:hover:bg-[#2D1B15] transition-all duration-300 group/card relative">
      
      {/* بج رتبه محصول */}
      {/* 🚀 FIXED: Increased size from w-7 h-7 to w-8/w-9 and text from xs to sm/base */}
      <div
        className={`absolute top-2 right-2 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm sm:text-base font-black transition-colors ${getRankBadgeStyle(
          rank
        )}`}
      >
        {rank}
      </div>

      {/* تصویر محصول */}
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

      {/* جزئیات محصول */}
      <div className="flex flex-col flex-1">
        <Link
          href={`/product/${product.id}`}
          className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#EAE0D5] font-medium leading-relaxed h-[44px] mb-3 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2 overflow-hidden"
        >
          {product.name}
        </Link>

        <div className="mt-auto mb-3 flex flex-col justify-end pt-2 h-[50px]">
          <div
            className="flex items-center justify-end gap-1.5 w-full mt-auto"
            dir="rtl"
          >
            <span className="text-[20px] sm:text-[24px] font-black text-[#2C1E16] dark:text-white tracking-tighter">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#717171] dark:text-[#A1A1A1] font-bold pt-1">
              تومان
            </span>
          </div>
        </div>

        {/* دکمه کلاینتی برای اضافه کردن به سبد خرید */}
        <CarouselCartButton product={product} />
      </div>
    </div>
  );
}