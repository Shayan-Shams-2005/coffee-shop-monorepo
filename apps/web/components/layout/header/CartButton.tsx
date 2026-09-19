"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { CartDrawer } from "../../../components/cart/CartDrawer";
import { useCartCount, useCartTotal } from "../../../src/store/useCartStore";

const toFarsiNumber = (num: number) => num.toLocaleString("fa-IR");

export function CartButton() {
  const cartCount = useCartCount();
  const cartTotal = useCartTotal();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        // 🚀 FIXED: Added premium dark mode palette to match the AuthButton exactly
        className="group flex items-center justify-between gap-2 sm:gap-3 rounded-full pl-1.5 pr-4 sm:pr-5 py-1.5 transition-all relative h-12 sm:h-14 min-w-[140px] sm:min-w-[170px]
                   bg-white border-2 border-[#D4A373] text-[#2C1E16] hover:border-[#C29262] hover:shadow-[0_4px_15px_rgba(212,163,115,0.25)]
                   dark:bg-[#231511] dark:border-[#3c2317] dark:text-[#E3C3A4] dark:hover:border-[#C68E58] dark:hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)]"
        aria-label="سبد خرید"
      >
        {isMounted && cartCount > 0 && (
          <span
            className="absolute -left-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-black shadow-md border-2 z-10
                           bg-white text-[#2C1E16] border-[#D4A373]
                           dark:bg-[#231511] dark:text-white dark:border-[#C68E58]"
          >
            {toFarsiNumber(cartCount)}
          </span>
        )}

        <span className="font-black text-base sm:text-lg pt-1">
          {isMounted ? toFarsiNumber(cartTotal) : "۰"}{" "}
          <span className="text-xs sm:text-sm font-bold text-[#8C7A6B] dark:text-[#ba8d71]">
            تومان
          </span>
        </span>

        {/* 🎨 دایره آیکون: Mocha in dark mode, Caramel on hover */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors text-white
                        bg-[#D4A373] group-hover:bg-[#C29262]
                        dark:bg-[#754e35] dark:group-hover:bg-[#C68E58]"
        >
          <ShoppingCart className="w-5 h-5" />
        </div>
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
