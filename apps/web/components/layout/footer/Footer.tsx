"use client";

import { siteConfig } from "../../../config/site"; // یا مسیر نسبی ../../../config/site

// 🚀 Farsi number converter for the copyright year
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-10 mt-auto transition-colors duration-300
                       bg-[#C68E58] border-t-0
                       dark:bg-[#1A1412] dark:border-t dark:border-[#3c2317]"
    >
      <div className="container mx-auto px-4 text-center flex flex-col items-center gap-3">
        {/* Site Name */}
        <p className="text-2xl font-black text-white dark:text-white">
          {siteConfig.name}
        </p>

        {/* Description */}
        <p className="text-sm font-medium text-white/90 dark:text-[#ba8d71] max-w-md leading-relaxed">
          {siteConfig.description}
        </p>

        {/* Copyright Section */}
        <div
          className="w-full max-w-lg mt-4 pt-6 border-t text-xs font-bold
                        border-white/20 text-white/80
                        dark:border-[#3c2317] dark:text-[#754e35]"
        >
          © {toFarsiNumber(currentYear)} تمامی حقوق محفوظ است. توسعه داده شده با
          ❤️
        </div>
      </div>
    </footer>
  );
}
