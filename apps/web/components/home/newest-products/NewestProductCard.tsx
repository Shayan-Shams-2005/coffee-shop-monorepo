"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CarouselCartButton } from "../../ui/CarouselCartButton";
import { OfferTimer } from "../../ui/OfferTimer";

export interface ProductDto {
  productId: number;
  productName: string;
  originalPrice: number;
  salePrice?: number | null;
  saleEndAt?: string | null;
  offerEndDate?: string | null;
  variants?: any[];
  Variants?: any[];
  images?: { imageUrl: string; isMain: boolean; displayOrder: number }[];
}

interface NewestProductCardProps {
  product: ProductDto;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR");
const toFarsiNumber = (num: number | string) => 
  num.toString().replace(/\d/g, (x) => ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][parseInt(x)] || x);

const getBestDate = (p: any) => {
  let bestTime = 0;
  let bestStr = null;
  
  const checkDate = (d: any) => {
    if (!d) return;
    const time = new Date(d).getTime();
    if (time > bestTime) {
      bestTime = time;
      bestStr = d;
    }
  };

  checkDate(p.offerEndDate);
  checkDate(p.OfferEndDate);
  checkDate(p.saleEndAt);
  checkDate(p.SaleEndAt);
  
  const vars = p.variants || p.Variants || [];
  vars.forEach((v: any) => {
    checkDate(v.offerEndDate);
    checkDate(v.OfferEndDate);
    checkDate(v.saleEndAt);
    checkDate(v.SaleEndAt);
  });

  return bestStr;
};

export function NewestProductCard({ product }: NewestProductCardProps) {
  const mainImageObj = product.images?.find((img) => img.isMain) || product.images?.[0];
  const mainImage = mainImageObj?.imageUrl?.trim() 
    ? mainImageObj.imageUrl 
    : `/p${(product.productId % 5) + 1}/1.jpg`;

  const rawEndDate = getBestDate(product);

  // 🚀 FIXED: Real-time expiration tracker
  const [isOfferActive, setIsOfferActive] = useState(true);

  useEffect(() => {
    if (!rawEndDate) return;
    
    const checkActive = () => {
      setIsOfferActive(new Date(rawEndDate).getTime() > new Date().getTime());
    };
    
    checkActive(); // Check immediately
    const interval = setInterval(checkActive, 1000); // Check every second
    return () => clearInterval(interval);
  }, [rawEndDate]);

  const hasDiscountBase = !!product.salePrice && product.salePrice < product.originalPrice;
  
  // 🚀 FIXED: Only show the discount if it mathematically has a discount AND the timer hasn't expired
  const showDiscount = hasDiscountBase && (!rawEndDate || isOfferActive);
  
  // 🚀 FIXED: Dynamically reverts to originalPrice if the offer has expired
  const currentPrice = showDiscount ? product.salePrice! : product.originalPrice;
  const discountPercent = showDiscount 
    ? Math.round(((product.originalPrice - product.salePrice!) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="w-[170px] sm:w-[200px] flex-shrink-0 flex flex-col snap-start bg-white dark:bg-[#1A110F] rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-[#F5EFE6] dark:border-[#3A221C] hover:shadow-[0_12px_25px_rgba(198,142,88,0.12)] hover:border-[#E3C3A4] dark:hover:border-[#C68E58] transition-all duration-300 group/card relative">
      
      <Link href={`/product/${product.productId}`} className="relative w-full aspect-square mb-3 bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[14px] flex items-center justify-center overflow-hidden border border-[#F5EFE6] dark:border-transparent transition-colors">
        <Image 
          src={mainImage} 
          alt={product.productName} 
          fill 
          sizes="(max-width: 640px) 170px, 200px" 
          className="object-contain p-3.5 mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500 z-10"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <Link href={`/product/${product.productId}`} className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#EAE0D5] font-medium leading-relaxed h-[44px] mb-3 hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2 overflow-hidden">
          {product.productName}
        </Link>

        <div className="mt-auto mb-3 flex flex-col gap-1 pt-1 min-h-[50px]">
          
          {/* Top Row: Crossed Price, Badge & Timer */}
          <div className="flex items-center justify-between w-full h-[22px]" dir="ltr">
            <div className="flex items-center gap-1.5">
              {showDiscount && (
                <>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-[#D95D39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] shadow-sm">
                    {toFarsiNumber(discountPercent)}٪
                  </span>
                </>
              )}
            </div>
            <div>
              {showDiscount && rawEndDate && <OfferTimer targetDate={rawEndDate} />}
            </div>
          </div>

          {/* Bottom Row: Current Price aligned left */}
          <div className="flex items-center justify-start gap-1 w-full" dir="ltr">
            <span className="text-[20px] sm:text-[24px] font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter">
              {formatPrice(currentPrice)}
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