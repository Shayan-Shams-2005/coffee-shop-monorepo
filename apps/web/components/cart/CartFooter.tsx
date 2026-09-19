"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

interface CartFooterProps {
  cartTotal: number;
  onClose: () => void;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR");

export function CartFooter({ cartTotal, onClose }: CartFooterProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const finalTotal = cartTotal - discountAmount;

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;

    if (discountCode.toLowerCase() === "neo20") {
      setDiscountAmount(cartTotal * 0.2); // 20 درصد تخفیف تستی
    } else {
      alert("کد تخفیف وارد شده معتبر نیست.");
      setDiscountAmount(0);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* فیلد کد تخفیف */}
      <div
        className="flex items-center w-full h-11 bg-[#FCF9F5] dark:bg-transparent rounded-xl border border-[#E3C3A4] dark:border-[#4B3022] overflow-hidden focus-within:border-[#C68E58] dark:focus-within:border-[#6A422D] transition-all"
        dir="rtl"
      >
        <div className="pl-2 pr-3 flex items-center justify-center text-[#8C7A6B] dark:text-[#E8D5C4]">
          <Ticket className="w-4 h-4 transform -rotate-45" />
        </div>
        <input
          type="text"
          placeholder="کد تخفیف (NEO20)"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1 bg-transparent px-2 text-sm font-bold outline-none uppercase tracking-widest text-left text-[#3D2616] dark:text-[#F3E8E0] placeholder:text-[#A1A1A1] dark:placeholder:text-[#8C7A6B]"
          dir="ltr"
        />
        <button
          onClick={handleApplyDiscount}
          className="h-full bg-[#E3C3A4] dark:bg-[#6A422D] hover:bg-[#C68E58] dark:hover:bg-[#5A3826] text-[#2C1E16] dark:text-[#F3E8E0] hover:text-white px-5 text-[13px] font-bold transition-colors"
        >
          اعمال
        </button>
      </div>

      {/* جزئیات قیمت */}
      <div className="space-y-2">
        {discountAmount > 0 && (
          <>
            <div className="flex justify-between items-center text-[13px] font-bold text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
              <span>جمع مبلغ کالاها:</span>
              <span className="dir-ltr text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
                {formatPrice(cartTotal)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-bold text-[#D95D39] transition-colors">
              <span>تخفیف اعمال شده:</span>
              <span className="dir-ltr">
                - {formatPrice(discountAmount)} تومان
              </span>
            </div>
          </>
        )}

        {/* مبلغ نهایی */}
        <div
          className={`flex items-center justify-between ${
            discountAmount > 0
              ? "pt-2 border-t border-[#F0EBE1] dark:border-[#3c2317]"
              : ""
          } transition-colors`}
        >
          <span className="font-bold text-[#5A4A42] dark:text-[#EAE0D5] text-sm transition-colors">
            مبلغ نهایی:
          </span>
          <span className="font-black text-[#2C1E16] dark:text-[#FFF8F0] text-xl dir-ltr transition-colors">
            {formatPrice(finalTotal)}{" "}
            <span className="text-[11px] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">
              تومان
            </span>
          </span>
        </div>
      </div>

      {/* دکمه‌های اکشن */}
      <div className="flex gap-3 pt-1">
        <Link
          href="/cart"
          onClick={onClose}
          // 🚀 FIXED: Applied secondary button style (Mocha border #6A422D and Creamy text #F3E8E0)
          className="flex-1 flex items-center justify-center py-3.5 bg-[#FCF9F5] border border-[#E3C3A4] text-[#C68E58] hover:bg-[#F0EBE1] dark:bg-transparent dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#6A422D]/10 text-[13px] font-bold rounded-2xl transition-colors active:scale-95"
        >
          مشاهده سبد
        </Link>
        <Link
          href="/checkout"
          onClick={onClose}
          className="flex-[2] py-3.5 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#6A422D] dark:hover:bg-[#5A3826] text-white dark:text-[#F3E8E0] text-center text-sm font-bold rounded-2xl transition-all shadow-sm dark:shadow-[0_4px_12px_rgba(106,66,45,0.2)] active:scale-95 flex items-center justify-center gap-2"
        >
          ثبت سفارش
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
