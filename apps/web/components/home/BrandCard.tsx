import Link from "next/link";
import { Brand } from "../../config/brands";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brand/${brand.id}`}
      className="flex flex-col items-center flex-shrink-0 snap-start group animate-in fade-in zoom-in-95 duration-500"
    >
      {/* 🚀 FIXED: Dark mode borders, backgrounds, and shadows */}
      <div className="w-[130px] h-[130px] bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3A221C] rounded-[24px] flex flex-col items-center justify-center mb-4 group-hover:border-[#C68E58] dark:group-hover:border-[#C68E58] group-hover:shadow-[0_12px_25px_rgba(198,142,88,0.12)] dark:hover:shadow-[0_8px_20px_rgba(198,142,88,0.1)] transition-all duration-300 relative overflow-hidden">
        {/* 🚀 FIXED: Deep espresso gradient for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#231511] dark:to-[#1A110F] z-0 transition-colors"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Big English Initial */}
          <span className="text-[36px] font-black text-[#C68E58]/30 dark:text-[#C68E58]/20 group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors duration-300 mb-1 leading-none">
            {brand.enName.charAt(0)}
          </span>
          {/* Full English Name */}
          <span className="text-[#8C7A6B] dark:text-[#8C7A6B] text-[10px] font-black tracking-[0.2em] uppercase group-hover:text-[#4A3022] dark:group-hover:text-[#EAE0D5] transition-colors duration-300">
            {brand.enName}
          </span>
        </div>
      </div>

      {/* Persian Brand Name */}
      <span className="text-[14px] font-bold text-[#3D2616] dark:text-[#EAE0D5] group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors">
        {brand.name}
      </span>
    </Link>
  );
}
