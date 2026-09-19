"use client";

import {
  Store,
  ShieldCheck,
  Award,
  Truck,
  ShoppingBag,
} from "lucide-react";

interface ProductOrderCardProps {
  product: any;
  onAddToCart: () => void;
  addToCartBtnRef: React.RefObject<HTMLButtonElement | null>;
}

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function ProductOrderCard({
  product,
  onAddToCart,
  addToCartBtnRef,
}: ProductOrderCardProps) {
  return (
    <div className="lg:col-span-3 h-full relative">
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] border border-[#F0EBE1] dark:border-[#3c2317] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] sticky top-28 flex flex-col gap-6 transition-colors">
        {/* Seller Info */}
        <div className="flex items-center justify-between pb-6 border-b border-[#F9F8F6] dark:border-[#3A221C] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FCF9F5] dark:bg-[#2C1A14] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl flex items-center justify-center text-[#C68E58] shadow-sm transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-base font-black text-[#2C1E16] dark:text-white transition-colors">
              نئو کافه
            </span>
          </div>
          <div className="bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] dark:text-[#34D399] px-3.5 py-1.5 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-colors">
            <span className="text-[13px] font-black">۱۰۰٪</span>
            <span className="text-[10px] font-bold mt-0.5">رضایت</span>
          </div>
        </div>

        {/* Guarantees */}
        <div className="space-y-5 pb-6 border-b border-[#F9F8F6] dark:border-[#3A221C] transition-colors">
          <div className="flex items-center gap-3 text-sm text-[#5A4A42] dark:text-[#EAE0D5] font-bold transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#F9F8F6] dark:bg-[#2C1A14] flex items-center justify-center shrink-0 text-[#4A3022] dark:text-[#C68E58] transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            تضمین اصالت و سلامت
          </div>
          <div className="flex items-center gap-3 text-sm text-[#5A4A42] dark:text-[#EAE0D5] font-bold transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#F9F8F6] dark:bg-[#2C1A14] flex items-center justify-center shrink-0 text-[#4A3022] dark:text-[#C68E58] transition-colors">
              <Award className="w-4 h-4" />
            </div>
            تضمین تازگی رست
          </div>
          <div className="flex items-center gap-3 text-sm text-[#5A4A42] dark:text-[#EAE0D5] font-bold transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 transition-colors">
              <Truck className="w-4 h-4" />
            </div>
            ارسال سریع به سراسر کشور
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col items-end">
            {product.discount > 0 && (
              <div className="flex items-center gap-2 mb-1" dir="rtl">
                <span className="bg-[#D95D39] text-white text-[12px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                  {toFarsiNumber(product.discount)}٪
                </span>
                <span className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] line-through font-medium transition-colors">
                  {product.oldPrice.toLocaleString("fa-IR")}
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-1.5" dir="rtl">
              <span className="text-3xl font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter transition-colors">
                {product.price.toLocaleString("fa-IR")}
              </span>
              <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                تومان
              </span>
            </div>
          </div>

          <button
            ref={addToCartBtnRef}
            onClick={onAddToCart}
            // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
            className="w-full h-14 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-base rounded-2xl transition-all shadow-[0_8px_25px_rgba(198,142,88,0.25)] active:scale-[0.98] flex items-center justify-center gap-2.5 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
          >
            <ShoppingBag className="w-5 h-5" /> افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  );
}