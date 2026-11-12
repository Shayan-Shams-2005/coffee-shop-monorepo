"use client";

import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { productCategories } from "../../config/categories"; // مسیر وارد کردن دیتا

export function CategoryGrid() {
  return (
    <section
      className="my-20 px-4 max-w-7xl mx-auto"
      aria-labelledby="categories-heading"
    >
      <div className="mb-12 flex flex-col items-center text-center">
        <h2
          id="categories-heading"
          className="text-3xl font-black text-[#2C1E16] dark:text-white mb-4 transition-colors"
        >
          دسته‌بندی‌های محصولات
        </h2>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl text-[15px] leading-relaxed transition-colors">
          از بهترین دانه‌های قهوه تا پیشرفته‌ترین تجهیزات دم‌آوری و ظروف سرو؛
          همه آنچه برای خلق یک فنجان بی‌نقص نیاز دارید را اینجا پیدا کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productCategories.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              href={cat.href}
              key={cat.id}
              // 🚀 FIXED: Changed dark mode background from #1A110F to #231511 so it stands out from the page background. Added a lighter hover state (#2D1B15).
              className={`p-8 rounded-[32px] ${cat.color} ${cat.hoverColor} dark:!bg-[#231511] dark:hover:!bg-[#2D1B15] transition-all duration-300 border border-transparent dark:!border-[#3c2317] hover:border-white/50 dark:hover:!border-[#C68E58] group cursor-pointer flex flex-col items-center text-center hover:-translate-y-1.5 shadow-sm hover:shadow-[0_20px_40px_rgba(92,64,51,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_15px_30px_rgba(198,142,88,0.15)]`}
              aria-label={`مشاهده دسته‌بندی ${cat.title}`}
            >
              {/* 🚀 FIXED: Changed icon wrapper to a soft tinted background (10% opacity of the Nescafe color) for beautiful contrast */}
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#C68E58]/10 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-500 border border-transparent dark:border-[#C68E58]/20">
                <Icon
                  className="w-10 h-10 text-[#D4A373] dark:text-[#C68E58]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-[#2C1E16] dark:text-[#EAE0D5] mb-3 transition-colors">
                {cat.title}
              </h3>
              {/* 🚀 FIXED: Changed description text color to #A1A1A1 for better readability on the new background */}
              <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm mb-8 flex-1 leading-relaxed transition-colors">
                {cat.desc}
              </p>

              {/* Footer link */}
              <div className="w-full flex justify-center mt-auto border-t border-[#8C7A6B]/10 dark:border-[#3c2317] pt-5 transition-colors">
                <div className="flex items-center gap-2 text-[#D4A373] dark:text-[#C68E58] text-[13px] font-bold group-hover:text-[#2C1E16] dark:group-hover:text-[#FFD7BA] transition-colors">
                  مشاهده محصولات{" "}
                  <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}