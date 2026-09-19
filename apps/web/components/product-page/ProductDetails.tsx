"use client";

import { Coffee, Star } from "lucide-react";

interface ProductDetailsProps {
  product: any;
  selectedGrind: string;
  setSelectedGrind: (grind: string) => void;
  grindOptions: string[];
}

export function ProductDetails({
  product,
  selectedGrind,
  setSelectedGrind,
  grindOptions,
}: ProductDetailsProps) {
  return (
    <div className="md:col-span-7 flex flex-col pt-4">
      <div className="inline-flex items-center gap-1.5 bg-[#D4A373]/10 dark:bg-[#C68E58]/20 text-[#D4A373] dark:text-[#C68E58] px-3 py-1.5 rounded-full w-fit mb-4 text-xs font-bold transition-colors">
        <Coffee className="w-3.5 h-3.5" /> قهوه تک خاستگاه
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#2C1E16] dark:text-white leading-tight mb-2 transition-colors">
        {product.name}
      </h1>
      <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] font-medium dir-ltr text-right mb-6 tracking-wide transition-colors">
        {product.enName}
      </p>

      <div className="flex flex-wrap items-center gap-6 mb-8 text-sm bg-white dark:bg-[#1A110F] px-5 py-3 rounded-2xl shadow-sm border border-[#F0EBE1] dark:border-[#3c2317] w-fit transition-colors">
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-[#2C1E16] dark:text-[#FFF8F0] text-base transition-colors">
            {product.rating}
          </span>
        </div>
        <div className="w-px h-5 bg-gray-200 dark:bg-[#3c2317] transition-colors"></div>
        <span className="text-[#8C7A6B] dark:text-[#A1A1A1] hover:text-[#D4A373] dark:hover:text-[#FFD7BA] cursor-pointer transition-colors font-medium">
          {product.reviewsCount} دیدگاه خریداران
        </span>
      </div>

      <div className="mb-10">
        <h3 className="font-black text-[#2C1E16] dark:text-white text-base mb-4 flex items-center gap-2 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373] dark:bg-[#C68E58] transition-colors"></div>{" "}
          انتخاب نوع آسیاب
        </h3>
        <div className="flex flex-wrap gap-3">
          {grindOptions.map((grind) => (
            <button
              key={grind}
              onClick={() => setSelectedGrind(grind)}
              // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text to the active state in dark mode
              className={`px-5 py-3 text-sm font-bold rounded-2xl transition-all border-2 ${
                selectedGrind === grind
                  ? "border-[#D4A373] bg-[#D4A373]/5 text-[#4A3022] dark:border-[#6A422D] dark:bg-[#6A422D] dark:text-[#F3E8E0] shadow-[0_4px_15px_rgba(212,163,115,0.15)] dark:shadow-none"
                  : "border-[#F0EBE1] bg-white text-[#8C7A6B] dark:border-[#3c2317] dark:bg-transparent dark:text-[#8C7A6B] hover:border-[#D4A373]/40 hover:text-[#4A3022] dark:hover:border-[#6A422D] dark:hover:text-[#F3E8E0]"
              }`}
            >
              {grind}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 shadow-sm border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        <h3 className="font-black text-[#2C1E16] dark:text-white text-base mb-5 flex items-center gap-2 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373] dark:bg-[#C68E58] transition-colors"></div>{" "}
          ویژگی‌های کلیدی
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          {product.features.map((feature: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]/40 dark:bg-[#C68E58]/40 mt-2 shrink-0 transition-colors"></div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#8C7A6B]/70 dark:text-[#A1A1A1]/70 mb-0.5 transition-colors">
                  {feature.label}
                </span>
                <span className="text-sm font-bold text-[#2C1E16] dark:text-[#EAE0D5] transition-colors">
                  {feature.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}