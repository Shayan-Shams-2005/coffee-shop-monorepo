"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore"; // ایمپورت استور جدید
import { Product } from "../../src/types/products";

// به جای any از تایپ Product استفاده می‌کنیم تا امنیت کد بالا برود
export function CarouselCartButton({ product }: { product: Product }) {
  // 🚀 جادوی پرفورمنس Zustand:
  // ما فقط و فقط اکشن addToCart را از استور بیرون می‌کشیم (Select می‌کنیم).
  // با این روش، اگر هزاران محصول به سبد اضافه شود و استیت تغییر کند،
  // این دکمه اصلا متوجه نمی‌شود و دوباره رندر (Re-render) نخواهد شد!
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full py-2 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition-all duration-300
                 bg-[#C68E58] text-white border border-[#C68E58] hover:bg-[#A87242] hover:border-[#A87242]
                 dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#7B4E36] dark:hover:border-[#7B4E36] dark:shadow-[0_4px_12px_rgba(106,66,45,0.2)]"
      aria-label={`افزودن ${product.name} به سبد خرید`}
    >
      <ShoppingBag className="w-4 h-4" />
      افزودن به سبد
    </button>
  );
}
