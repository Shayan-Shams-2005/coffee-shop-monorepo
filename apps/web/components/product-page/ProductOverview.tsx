"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

interface ProductOverviewProps {
  product: any;
}

export function ProductOverview({ product }: ProductOverviewProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  return (
    <div className="space-y-12">
      {/* معرفی محصول */}
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4A373]/10 dark:from-[#C68E58]/10 to-transparent rounded-bl-full transition-colors"></div>
        <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-8 relative z-10 flex items-center gap-3 transition-colors">
          <div className="w-2 h-8 bg-[#D4A373] dark:bg-[#C68E58] rounded-full transition-colors"></div>{" "}
          معرفی محصول
        </h2>
        <div className="relative z-10">
          <div
            className={`text-base text-[#5A4A42] dark:text-[#EAE0D5] leading-[2.2] text-justify transition-all duration-700 overflow-hidden ${showFullDesc ? "max-h-[1000px]" : "max-h-[140px]"}`}
          >
            {product.description}
          </div>
          {!showFullDesc && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#1A110F] via-white/80 dark:via-[#1A110F]/80 to-transparent pointer-events-none transition-colors"></div>
          )}
        </div>
        <div className="flex justify-center mt-6 relative z-10">
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="flex items-center gap-2 bg-[#F9F8F6] dark:bg-[#231511] hover:bg-[#F0EBE1] dark:hover:bg-[#2C1A14] text-[#4A3022] dark:text-[#EAE0D5] px-6 py-3 rounded-2xl text-sm font-bold transition-all border border-[#E8E2D9] dark:border-[#3c2317]"
          >
            {showFullDesc ? "مشاهده کمتر" : "مطالعه توضیحات کامل"}
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${showFullDesc ? "rotate-90" : "-rotate-90"}`}
            />
          </button>
        </div>
      </div>

      {/* مشخصات فنی */}
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-10 flex items-center gap-3 transition-colors">
          <div className="w-2 h-8 bg-[#D4A373] dark:bg-[#C68E58] rounded-full transition-colors"></div>{" "}
          مشخصات فنی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {product.specifications
            .slice(0, showFullSpecs ? undefined : 6)
            .map((spec: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-[#F9F8F6] dark:border-[#3A221C] gap-2 transition-colors"
              >
                <span className="text-sm font-medium text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                  {spec.name}
                </span>
                <span className="text-sm font-bold text-[#2C1E16] dark:text-[#EAE0D5] bg-[#F9F8F6] dark:bg-[#231511] px-4 py-2 rounded-xl text-left transition-colors">
                  {spec.value}
                </span>
              </div>
            ))}
        </div>
        {product.specifications.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowFullSpecs(!showFullSpecs)}
              // 🚀 FIXED: Copied the exact styles from the "مطالعه توضیحات کامل" button[cite: 10]
              className="flex items-center gap-2 bg-[#F9F8F6] dark:bg-[#231511] hover:bg-[#F0EBE1] dark:hover:bg-[#2C1A14] text-[#4A3022] dark:text-[#EAE0D5] px-6 py-3 rounded-2xl text-sm font-bold transition-all border border-[#E8E2D9] dark:border-[#3c2317]"
            >
              {showFullSpecs ? "بستن مشخصات" : "مشاهده تمام مشخصات"}
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-300 ${showFullSpecs ? "rotate-90" : "-rotate-90"}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
