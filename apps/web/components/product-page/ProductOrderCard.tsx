// components/product-page/ProductOrderCard.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, ShieldCheck, Award, Truck, ShoppingBag, Timer, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";

interface ProductOrderCardProps {
  product: any;
  onAddToCart: () => void;
  addToCartBtnRef: React.RefObject<HTMLButtonElement | null>;
}

const toFarsiNumber = (num: number | string) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// 🚀 LIVE TIMER COMPONENT 
function OfferTimer({ targetDate }: { targetDate: string | Date | null }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }
    
    const target = new Date(targetDate).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        if (h >= 24) {
          setTimeLeft(null); 
        } else {
          setTimeLeft({
            h,
            m: Math.floor((diff / 1000 / 60) % 60),
            s: Math.floor((diff / 1000) % 60)
          });
        }
      }
    };
    
    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  const pad = (num: number) => num.toString().padStart(2, '0');
  const timeString = `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`;

  return (
    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-1 rounded-lg text-xs font-bold w-fit animate-pulse border border-rose-200 dark:border-rose-500/20">
      <Timer className="w-3.5 h-3.5" />
      <span dir="ltr" className="tracking-widest mt-0.5">{toFarsiNumber(timeString)}</span>
    </div>
  );
}

export function ProductOrderCard({
  product,
  onAddToCart,
  addToCartBtnRef,
}: ProductOrderCardProps) {
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
                  
  const safeCart = Array.isArray(cartItems) ? cartItems : [];
  
  const cartItem = isMounted ? safeCart.find((item: any) => String(item.id) === String(product.id)) : null;

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
            
            <div className="flex items-center justify-between w-full mb-1">
              <div>
                <OfferTimer targetDate={product.offerEndDate} />
              </div>
              
              <div className="flex items-center gap-2" dir="rtl">
                {product.discount > 0 && (
                  <>
                    <span className="bg-[#D95D39] text-white text-[12px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                      {toFarsiNumber(product.discount)}٪
                    </span>
                    <span className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] line-through font-medium transition-colors pt-0.5">
                      {product.oldPrice.toLocaleString("fa-IR")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-1.5" dir="rtl">
              <span className="text-3xl font-black text-[#2C1E16] dark:text-[#FFF8F0] tracking-tighter transition-colors">
                {product.price.toLocaleString("fa-IR")}
              </span>
              <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                تومان
              </span>
            </div>
          </div>

          {/* 🚀 DYNAMIC CART BUTTON UI */}
          {!isMounted ? (
             <div className="w-full h-14 bg-[#C68E58]/20 rounded-2xl animate-pulse mt-2"></div>
          ) : cartItem ? (
            <div className="w-full flex flex-row-reverse items-center justify-between p-3 rounded-2xl bg-[#F9F8F6] dark:bg-[#150D0A] border border-[#F0EBE1] dark:border-[#3c2317] transition-colors mt-2">
              
              {/* 🚀 NEW: Styled Quantity Controls */}
              <div className="flex items-center gap-3 bg-white dark:bg-[#1A110F] p-1.5 rounded-2xl border border-[#F0EBE1] dark:border-[#3A221C] shadow-sm dir-rtl">
                <button 
                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)} 
                  className="w-8 h-8 rounded-xl bg-[#FCF9F5] dark:bg-[#2C1A14] flex items-center justify-center text-[#C68E58] dark:text-[#FFD7BA] hover:bg-[#E3C3A4]/30 dark:hover:bg-[#3A221C] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <span className="text-[#2C1E16] dark:text-[#EAE0D5] font-black text-sm w-5 text-center pt-0.5">
                  {toFarsiNumber(cartItem.quantity || 1)}
                </span>
                
                {cartItem.quantity > 1 ? (
                  <button 
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)} 
                    className="w-8 h-8 rounded-xl bg-[#FCF9F5] dark:bg-[#2C1A14] flex items-center justify-center text-[#C68E58] dark:text-[#FFD7BA] hover:bg-[#E3C3A4]/30 dark:hover:bg-[#3A221C] transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => removeFromCart(cartItem.id)} 
                    className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Text & Link */}
              <div className="flex flex-col items-start gap-1.5 px-2 text-right dir-rtl">
                <span className="text-[13px] font-bold text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
                  در سبد شما
                </span>
                <Link href="/cart" className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] dark:text-[#FFD7BA] dark:hover:text-[#E3C3A4] transition-colors underline underline-offset-4 decoration-[#C68E58]/30 hover:decoration-[#C68E58]">
                  مشاهده سبد خرید
                </Link>
              </div>

            </div>
          ) : (
            <button
              ref={addToCartBtnRef}
              onClick={onAddToCart}
              className="w-full h-14 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-base rounded-2xl transition-all shadow-[0_8px_25px_rgba(198,142,88,0.25)] active:scale-[0.98] flex items-center justify-center gap-2.5 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none mt-2"
            >
              <ShoppingBag className="w-5 h-5" /> افزودن به سبد خرید
            </button>
          )}

        </div>
      </div>
    </div>
  );
}