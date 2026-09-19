import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export function EmptyCartView() {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-500 py-10">
      <div className="w-48 h-48 bg-white dark:bg-[#1A110F] rounded-full flex items-center justify-center mb-8 border border-[#F0EBE1] dark:border-[#3c2317] shadow-[0_20px_50px_rgba(92,64,51,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative transition-colors">
        <ShoppingCart
          className="w-20 h-20 text-[#D4A373] dark:text-[#C68E58]"
          strokeWidth={1.5}
        />
        <div className="absolute top-4 right-4 w-12 h-12 bg-[#E63946] dark:bg-[#D95D39] text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white dark:border-[#1A110F] transition-colors">
          ۰
        </div>
      </div>
      <h2 className="text-3xl font-black text-[#2C1E16] dark:text-white mb-4 transition-colors">
        سبد خرید شما خالی است
      </h2>
      <p className="text-[#8C7A6B] dark:text-[#A1A1A1] mb-10 leading-relaxed font-medium transition-colors">
        به نظر می‌رسد هنوز قهوه یا تجهیزات مورد علاقه‌تان را پیدا نکرده‌اید.
        بیایید گشتی در فروشگاه بزنیم!
      </p>
      <Link
        href="/shop"
        // 🚀 FIXED: Applied standard primary button colors (Mocha #6A422D and Creamy #F3E8E0 in dark mode)
        className="w-full sm:w-auto bg-[#C68E58] hover:bg-[#A87242] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_20px_rgba(198,142,88,0.25)] flex items-center justify-center gap-3 active:scale-95 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
      >
        <ArrowLeft className="w-5 h-5" />
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
