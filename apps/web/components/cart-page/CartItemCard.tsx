"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";

const toFarsiNumber = (num: number) => num.toLocaleString("fa-IR");

export function CartItemCard({ item }: { item: any }) {
  // گرفتن اکشن‌ها به صورت مستقیم از Zustand برای هر کارت
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="p-4 rounded-[24px] bg-[#FDFCFB] dark:bg-[#1A110F] border border-transparent dark:border-[#3c2317] hover:border-[#D4A373]/30 dark:hover:border-[#C68E58] hover:shadow-[0_10px_30px_rgba(92,64,51,0.05)] dark:hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col sm:flex-row items-center gap-5 group">
      <Link
        href={`/product/${item.id}`}
        className="w-28 h-28 bg-white dark:bg-gradient-to-br dark:from-[#D4C5B0] dark:to-[#C6B59D] border border-[#F0EBE1] dark:border-transparent rounded-[20px] flex-shrink-0 shadow-sm relative group-hover:border-[#D4A373]/50 transition-colors overflow-hidden"
      >
        <Image
          src={item.imageUrl || "/p1/1.jpg"}
          alt={item.name}
          fill
          className="object-contain p-3 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-right w-full py-2">
        <Link
          href={`/product/${item.id}`}
          className="font-black text-[15px] text-[#2C1E16] dark:text-[#EAE0D5] hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors line-clamp-2 leading-relaxed mb-3"
        >
          {item.name}
        </Link>
        <div className="text-[#8C7A6B] dark:text-[#EAE0D5] font-bold text-sm dir-ltr flex items-center gap-1 mt-auto transition-colors">
          {toFarsiNumber(item.price)}
          <span className="text-xs text-[#D1C8B8] dark:text-[#8C7A6B] transition-colors">
            تومان
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        {/* 🎨 باکس تنظیم تعداد */}
        <div className="flex items-center bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-2xl shadow-sm p-1.5 transition-colors">
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] hover:bg-[#C29262] dark:hover:bg-[#5A3826] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
          <span className="w-10 text-center text-[15px] font-black text-[#2C1E16] dark:text-[#FFF8F0] transition-colors">
            {toFarsiNumber(item.quantity)}
          </span>
          <button
            onClick={() =>
              updateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] hover:bg-[#C29262] dark:hover:bg-[#5A3826] transition-colors shadow-sm"
          >
            <Minus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* 🎨 دکمه سطل زباله */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] text-[#E63946] dark:text-[#FF6B6B] hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-[#E63946]/50 dark:hover:border-red-500/50 transition-all shadow-sm shrink-0"
          title="حذف از سبد"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
