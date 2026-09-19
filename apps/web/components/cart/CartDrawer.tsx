"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore, useCartTotal } from "../../src/store/useCartStore";
import { CartEmpty } from "./CartEmpty";
import { CartItem } from "./CartItem";
import { CartFooter } from "./CartFooter";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartTotal = useCartTotal();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const renderContent = () => {
    if (cartItems.length === 0) {
      return <CartEmpty onClose={onClose} />;
    }

    return (
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onClose={onClose}
          />
        ))}
      </div>
    );
  };

  if (!isMounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        // 🚀 FIXED: Darker overlay for dark mode
        className={`fixed inset-0 bg-black/40 dark:bg-black/70 z-[999] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        // 🚀 FIXED: Drawer background color
        className={`fixed top-0 left-0 h-[100dvh] w-full max-w-[400px] bg-[#FDFCFB] dark:bg-[#1A1412] z-[1000] flex flex-col shadow-[25px_0_50px_rgba(0,0,0,0.15)] sm:rounded-r-3xl transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {/* 🚀 FIXED: Header borders, backgrounds, and text */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#F0EBE1] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] z-10 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A373]/10 dark:bg-[#C68E58]/20 text-[#D4A373] dark:text-[#C68E58] rounded-xl flex items-center justify-center transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#2C1E16] dark:text-white transition-colors">
              سبد خرید من
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#FCF9F5] dark:bg-[#2C1A14] text-[#8C7A6B] dark:text-[#EAE0D5] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="بستن سبد خرید"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= Content ================= */}
        <div
          dir="ltr"
          className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 relative"
        >
          <div dir="rtl" className="h-full">
            {renderContent()}
          </div>
        </div>

        {/* Footer Wrapper */}
        {cartItems.length > 0 && (
          // 🚀 FIXED: Footer wrapper background and borders
          <div className="mt-auto bg-white dark:bg-[#1A110F] border-t border-[#F0EBE1] dark:border-[#3c2317] p-5 sm:p-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-10 transition-colors">
            <CartFooter cartTotal={cartTotal} onClose={onClose} />
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
