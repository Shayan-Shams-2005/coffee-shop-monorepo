// components/brands/BrandCard.tsx
import Link from "next/link";
import { UIBrand } from "./types";

interface BrandCardProps {
  brand: UIBrand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brand/${brand.id}`}
      className="flex-shrink-0 snap-start group animate-in fade-in zoom-in-95 duration-500 block"
    >
      <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] bg-white dark:bg-transparent border border-[#F5EFE6] dark:border-[#3c2317] rounded-[28px] sm:rounded-[36px] flex flex-col items-center justify-between p-4 group-hover:border-[#E3C3A4] dark:group-hover:border-[#6A422D] group-hover:shadow-[0_8px_25px_rgba(198,142,88,0.1)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] dark:hover:bg-[#1A0F0C]/50 transition-all duration-300 relative overflow-hidden">
        
        {/* تصویر یا حرف اول برند */}
        <div className="relative w-full flex-1 flex items-center justify-center mt-2 overflow-hidden">
          {brand.image ? (
            <img 
              src={brand.image} 
              alt={brand.name} 
              className="max-w-[80%] max-h-[80%] object-contain filter group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <span className="text-[40px] font-black text-[#C68E58]/30 dark:text-[#E3C3A4]/10 group-hover:text-[#C68E58] dark:group-hover:text-[#E3C3A4]/30 transition-colors duration-300 uppercase">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        {/* نام برند (اکنون داخل باکس قرار دارد) */}
        <span className="text-[13px] sm:text-[14px] font-bold text-[#3D2616] dark:text-[#EAE0D5] group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors truncate max-w-full pb-1 mt-1">
          {brand.name}
        </span>
      </div>
    </Link>
  );
}