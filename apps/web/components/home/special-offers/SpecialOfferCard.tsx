import Image from "next/image";
import Link from "next/link";
import { CarouselCartButton } from "../../ui/CarouselCartButton";

const toFarsiNumber = (num: number | string | undefined) => {
  if (!num) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function SpecialOfferCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const folderNumber = (index % 5) + 1;
  const imagePath = `/p${folderNumber}/1.jpg`;

  return (
    <div className="w-[170px] sm:w-[200px] flex-shrink-0 flex flex-col snap-start bg-white dark:bg-[#1A110F] dark:border dark:border-[#3A221C] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_25px_rgba(198,142,88,0.15)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] dark:hover:border-[#C68E58] transition-all duration-300 relative">
      <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#D95D39] to-[#C44536] text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl shadow-md">
        فروش ویژه
      </div>

      <Link
        href={`/product/${product.id}`}
        // 🚀 FIXED: The warm latte gradient in dark mode makes the JPG white background vanish!
        className="relative w-full aspect-square mb-3 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[14px] flex items-center justify-center overflow-hidden border border-[#F5EFE6] dark:border-transparent group/card transition-colors"
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

        <div className="mt-auto mb-3 flex flex-col justify-end pt-2">
          <div
            className="flex items-center justify-end gap-2 mb-1 w-full"
            dir="rtl"
          >
            <span className="bg-[#D95D39] text-white text-[13px] sm:text-[14px] font-black px-2 py-0.5 rounded-full shadow-sm leading-none flex items-center justify-center">
              {toFarsiNumber(product.discount)}٪
            </span>
            <span className="text-[13px] sm:text-[14px] text-[#A1A1A1] dark:text-[#8C7A6B] line-through font-medium">
              {product.oldPrice?.toLocaleString("fa-IR")}
            </span>
          </div>

          <div
            className="flex items-center justify-end gap-1.5 w-full"
            dir="rtl"
          >
            <span className="text-[20px] sm:text-[24px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter">
              {product.price.toLocaleString("fa-IR")}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#717171] dark:text-[#C6B59D] font-bold pt-1">
              تومان
            </span>
          </div>
        </div>

        <CarouselCartButton product={product} />
      </div>
    </div>
  );
}
