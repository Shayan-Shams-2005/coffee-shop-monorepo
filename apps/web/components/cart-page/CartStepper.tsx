import Link from "next/link";
import { Check } from "lucide-react";

export function OrderStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="max-w-xl mx-auto mb-12 px-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-[#3c2317] -z-10 transition-colors">
          <div
            // 🚀 FIXED: Progress line now uses the primary Mocha theme (#6A422D)
            className="h-full bg-[#D4A373] dark:bg-[#6A422D] transition-all duration-500 ease-in-out"
            style={{
              width:
                currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          ></div>
        </div>

        {/* ================= مرحله ۱ ================= */}
        <Link
          href="/cart"
          className={`flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 group transition-colors ${
            currentStep > 1
              ? "cursor-pointer"
              : "cursor-default pointer-events-none"
          }`}
        >
          <div
            // 🚀 FIXED: Active bubble is now Mocha (#6A422D) and creamy text (#F3E8E0)
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              currentStep === 1
                ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md shadow-[#D4A373]/30 dark:shadow-none"
                : "bg-white dark:bg-[#1A110F] border-2 border-[#D4A373] dark:border-[#6A422D] text-[#D4A373] dark:text-[#6A422D] shadow-sm group-hover:bg-[#D4A373] dark:group-hover:bg-[#6A422D] group-hover:text-white dark:group-hover:text-[#F3E8E0]"
            }`}
          >
            {currentStep > 1 ? (
              <Check className="w-5 h-5" strokeWidth={3} />
            ) : (
              "۱"
            )}
          </div>
          <span className="text-sm font-bold text-[#D4A373] dark:text-[#EAE0D5] transition-colors">
            سبد خرید
          </span>
        </Link>

        {/* ================= مرحله ۲ ================= */}
        <Link
          href={currentStep >= 2 ? "/checkout" : "#"}
          className={`flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 transition-colors ${
            currentStep >= 2
              ? "cursor-pointer group"
              : "cursor-default pointer-events-none"
          }`}
        >
          <div
            // 🚀 FIXED: Active bubble is now Mocha (#6A422D) and creamy text (#F3E8E0)
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              currentStep === 2
                ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md shadow-[#D4A373]/30 dark:shadow-none"
                : currentStep > 2
                  ? "bg-white dark:bg-[#1A110F] border-2 border-[#D4A373] dark:border-[#6A422D] text-[#D4A373] dark:text-[#6A422D] shadow-sm group-hover:bg-[#D4A373] dark:group-hover:bg-[#6A422D] group-hover:text-white dark:group-hover:text-[#F3E8E0]"
                  : "bg-white dark:bg-[#1A110F] border-2 border-gray-300 dark:border-[#3c2317] text-gray-400 dark:text-[#6A5A4F]"
            }`}
          >
            {currentStep > 2 ? (
              <Check className="w-5 h-5" strokeWidth={3} />
            ) : (
              "۲"
            )}
          </div>
          <span
            className={`text-sm font-bold transition-colors ${
              currentStep >= 2
                ? "text-[#D4A373] dark:text-[#EAE0D5]"
                : "text-gray-400 dark:text-[#6A5A4F]"
            }`}
          >
            تسویه حساب
          </span>
        </Link>

        {/* ================= مرحله ۳ ================= */}
        <div className="flex flex-col items-center gap-2 bg-[#FDFCFB] dark:bg-[#1A1412] z-10 px-2 transition-colors">
          <div
            // 🚀 FIXED: Active bubble is now Mocha (#6A422D) and creamy text (#F3E8E0)
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              currentStep === 3
                ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md shadow-[#D4A373]/30 dark:shadow-none"
                : "bg-white dark:bg-[#1A110F] border-2 border-gray-300 dark:border-[#3c2317] text-gray-400 dark:text-[#6A5A4F]"
            }`}
          >
            ۳
          </div>
          <span
            className={`text-sm font-bold transition-colors ${
              currentStep === 3
                ? "text-[#D4A373] dark:text-[#EAE0D5]"
                : "text-gray-400 dark:text-[#6A5A4F]"
            }`}
          >
            تکمیل سفارش
          </span>
        </div>
      </div>
    </div>
  );
}
