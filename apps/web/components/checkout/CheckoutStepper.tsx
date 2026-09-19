import Link from "next/link";
import { Check } from "lucide-react";

export function CheckoutStepper() {
  return (
    <div className="max-w-xl mx-auto mb-12 px-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-[#3c2317] -z-10 transition-colors">
          {/* 🚀 FIXED: Background line dark mode color now uses Mocha (#6A422D) */}
          <div className="h-full bg-[#D4A373] dark:bg-[#6A422D] w-1/2 transition-all"></div>
        </div>

        {/* ================= مرحله ۱ (تیک‌خورده و تکمیل‌شده) ================= */}
        <Link
          href="/cart"
          className="flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 group transition-colors"
        >
          {/* 🚀 FIXED: Completed step now uses Mocha (#6A422D) and Creamy text on hover (#F3E8E0) */}
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1A110F] border-2 border-[#D4A373] dark:border-[#6A422D] text-[#D4A373] dark:text-[#6A422D] flex items-center justify-center shadow-sm group-hover:bg-[#D4A373] dark:group-hover:bg-[#6A422D] group-hover:text-white dark:group-hover:text-[#F3E8E0] transition-all">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-sm font-bold text-[#D4A373] dark:text-[#6A422D] transition-colors">
            سبد خرید
          </span>
        </Link>

        {/* ================= مرحله ۲ (فعال) ================= */}
        <div className="flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 transition-colors">
          {/* 🚀 FIXED: Active step now uses primary Mocha background and Creamy text */}
          <div className="w-10 h-10 rounded-full bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] flex items-center justify-center font-bold shadow-md shadow-[#D4A373]/30 dark:shadow-none transition-colors">
            ۲
          </div>
          <span className="text-sm font-bold text-[#D4A373] dark:text-[#EAE0D5] transition-colors">
            تسویه حساب
          </span>
        </div>

        {/* ================= مرحله ۳ (آینده) ================= */}
        <div className="flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1A110F] border-2 border-gray-300 dark:border-[#3c2317] text-gray-400 dark:text-[#6A5A4F] flex items-center justify-center font-bold transition-colors">
            ۳
          </div>
          <span className="text-sm font-bold text-gray-400 dark:text-[#6A5A4F] transition-colors">
            تکمیل سفارش
          </span>
        </div>
      </div>
    </div>
  );
}
