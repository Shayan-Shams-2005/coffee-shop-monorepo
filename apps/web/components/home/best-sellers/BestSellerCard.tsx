"use client";

import Image from "next/image";
import Link from "next/link";
import { CarouselCartButton } from "../../ui/CarouselCartButton";

// فرض می‌کنیم تایپ Product را از فایل دیتای خود ایمپورت می‌کنید
interface BestsellerCardProps {
  product: any;
  rank: number;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR");

export function BestsellerCard({ product, rank }: BestsellerCardProps) {
  // محاسبه عکس تستی بر اساس رتبه (برای دیزاین فعلی شما)
  const index = rank - 1;
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  return (
    <div className="w-[170px] sm:w-[200px] flex-shrink-0 flex flex-col snap-start bg-white dark:bg-[#1A110F] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-[#F5EFE6] dark:border-[#3A221C] hover:shadow-[0_12px_25px_rgba(198,142,88,0.12)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all duration-300 group/card relative">
      {/* بج رتبه محصول */}
      <div
        className={`absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-md transition-colors ${
          rank <= 3
            ? // 🚀 FIXED: Applied primary mocha color and cream text for ranks 1-3 in dark mode
              "bg-gradient-to-r from-[#B87D46] to-[#C68E58] text-white dark:from-[#6A422D] dark:to-[#6A422D] dark:text-[#F3E8E0] dark:shadow-[0_4px_10px_rgba(106,66,45,0.4)]"
            : // 🚀 FIXED: Applied primary mocha border and cream text for ranks 4+ in dark mode
              "bg-white text-[#8C7A6B] border border-[#F2E8DB] dark:bg-[#1A110F] dark:border-[#6A422D] dark:text-[#F3E8E0]"
        }`}
      >
        {rank}
      </div>

      {/* تصویر محصول */}
      <Link
        href={`/product/${product.id}`}
        // 🚀 FIXED: Latte gradient for dark mode to hide JPG white backgrounds seamlessly!
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
            <span className="text-[20px] sm:text-[24px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#717171] dark:text-[#C6B59D] font-bold pt-1">
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
