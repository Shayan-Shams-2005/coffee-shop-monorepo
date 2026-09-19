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
          // 🚀 Added dark mode for the section title
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
              // 🚀 Added dark mode classes: !bg-[#1A110F] forces the dark background, overriding the light colors from your config
              className={`p-8 rounded-[32px] ${cat.color} ${cat.hoverColor} dark:!bg-[#1A110F] dark:hover:!bg-[#231511] transition-all duration-300 border border-transparent dark:!border-[#3A221C] hover:border-white/50 dark:hover:!border-[#C68E58] group cursor-pointer flex flex-col items-center text-center hover:-translate-y-1.5 shadow-sm hover:shadow-[0_20px_40px_rgba(92,64,51,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_15px_30px_rgba(198,142,88,0.1)]`}
              aria-label={`مشاهده دسته‌بندی ${cat.title}`}
            >
              {/* 🚀 Icon container dark mode */}
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#2C1A14] flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                <Icon
                  className="w-10 h-10 text-[#D4A373] dark:text-[#C68E58]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              {/* 🚀 Text dark mode */}
              <h3 className="text-lg font-bold text-[#2C1E16] dark:text-[#EAE0D5] mb-3 transition-colors">
                {cat.title}
              </h3>
              <p className="text-[#8C7A6B] dark:text-[#8C7A6B] text-sm mb-8 flex-1 leading-relaxed transition-colors">
                {cat.desc}
              </p>

              {/* 🚀 Footer link dark mode */}
              <div className="w-full flex justify-center mt-auto border-t border-[#8C7A6B]/10 dark:border-[#3A221C] pt-5 transition-colors">
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
