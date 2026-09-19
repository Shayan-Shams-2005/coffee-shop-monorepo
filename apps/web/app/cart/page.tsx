"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Ticket, Percent, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCartStore, useCartTotal } from "../../src/store/useCartStore";

import { OrderStepper } from "../../components/cart-page/CartStepper";
import { EmptyCartView } from "../../components/cart-page/EmptyCartView";
import { CartItemCard } from "../../components/cart-page/CartItemCard";

const toFarsiNumber = (num: number) => num.toLocaleString("fa-IR");

export default function CartPage() {
  const router = useRouter();

  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartTotal();

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const shippingCost = cartItems.length > 0 ? 80000 : 0;
  const finalTotal = cartTotal + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "neo20")
      setDiscountAmount(cartTotal * 0.2);
    else {
      alert("کد تخفیف معتبر نیست.");
      setDiscountAmount(0);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen flex items-center justify-center transition-colors">
        <Loader2 className="w-10 h-10 text-[#D4A373] dark:text-[#C68E58] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4 py-12 md:py-16">
        <OrderStepper currentStep={1} />

        {cartItems.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 animate-in fade-in duration-500 relative">
            {/* ================= سطر اول: لیست محصولات ================= */}
            <div className="lg:col-span-2 order-1 h-full">
              <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-4 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] h-max transition-colors">
                <div className="flex items-center justify-between pb-6 mb-2 border-b border-[#F9F8F6] dark:border-[#3A221C] transition-colors">
                  <h2 className="font-black text-[#2C1E16] dark:text-white text-xl flex items-center gap-3 transition-colors">
                    <div className="w-2 h-6 bg-[#D4A373] dark:bg-[#5A3A29] rounded-full transition-colors"></div>{" "}
                    آیتم‌های سبد خرید
                  </h2>
                  <span className="bg-[#F9F8F6] dark:bg-[#2C1A14] text-[#4A3022] dark:text-[#EAE0D5] px-4 py-1.5 rounded-full text-sm font-black border border-[#E8DCCB] dark:border-[#3c2317] transition-colors">
                    {toFarsiNumber(cartItems.length)} محصول
                  </span>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {cartItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* ================= سطر اول: فاکتور استیکی ================= */}
            <div className="lg:col-span-1 order-3 lg:order-2 h-full relative">
              <div className="sticky top-28 bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] flex flex-col transition-colors">
                <h3 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-8 border-b border-[#F9F8F6] dark:border-[#3A221C] pb-6 flex items-center gap-3 transition-colors">
                  <div className="w-2 h-6 bg-[#D4A373] dark:bg-[#5A3A29] rounded-full transition-colors"></div>{" "}
                  خلاصه سفارش
                </h3>

                <div className="space-y-5 text-[15px] mb-8 font-medium">
                  <div className="flex justify-between items-center text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
                    <span>مبلغ کالاها ({toFarsiNumber(cartItems.length)})</span>
                    <span className="dir-ltr text-[#2C1E16] dark:text-[#FFF8F0] font-black transition-colors">
                      {toFarsiNumber(cartTotal)}{" "}
                      <span className="text-xs text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
                        تومان
                      </span>
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-[#E63946] dark:text-[#FF6B6B] bg-red-50 dark:bg-red-900/20 p-3 rounded-xl transition-colors">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Percent className="w-4 h-4" /> سود شما
                      </span>
                      <span className="dir-ltr font-black">
                        {toFarsiNumber(discountAmount)}{" "}
                        <span className="text-xs opacity-80 font-bold">
                          تومان
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
                    <span>هزینه ارسال</span>
                    <span className="dir-ltr text-[#2C1E16] dark:text-[#FFF8F0] font-black transition-colors">
                      {shippingCost === 0 ? (
                        "رایگان"
                      ) : (
                        <>
                          {toFarsiNumber(shippingCost)}{" "}
                          <span className="text-xs text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
                            تومان
                          </span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="border-t-2 border-dashed border-[#F0EBE1] dark:border-[#3c2317] my-6 transition-colors"></div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-black text-[#2C1E16] dark:text-white text-lg transition-colors">
                      مبلغ قابل پرداخت
                    </span>
                    <span className="font-black text-[#2C1E16] dark:text-[#FFF8F0] text-2xl dir-ltr flex items-center gap-1 transition-colors">
                      {toFarsiNumber(finalTotal)}{" "}
                      <span className="text-[11px] font-bold text-[#8C7A6B] dark:text-[#ba8d71] mt-1">
                        تومان
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="group w-full h-14 bg-[#C68E58] hover:bg-[#A87242] text-white shadow-md dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none flex items-center justify-center gap-3 font-black text-base rounded-2xl transition-all active:scale-95 mb-6"
                >
                  تایید و ادامه پرداخت{" "}
                  <ArrowLeft className="w-5 h-5 text-white dark:text-[#F3E8E0] group-hover:-translate-x-1 transition-transform duration-300" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8C7A6B] dark:text-[#EAE0D5] bg-[#F9F8F6] dark:bg-[#2C1A14] border border-[#F0EBE1] dark:border-[#3c2317] py-3.5 rounded-2xl transition-colors">
                  <ShieldCheck className="w-5 h-5 text-[#D4A373] dark:text-[#C68E58]" />{" "}
                  تضمین امنیت پرداخت و اصالت کالا
                </div>
              </div>
            </div>

            {/* ================= سطر دوم: باکس کد تخفیف ================= */}
            <div className="lg:col-span-2 order-2 lg:order-3">
              <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] flex flex-col sm:flex-row items-center gap-6 transition-colors">
                <div className="w-16 h-16 bg-[#FFF9F2] dark:bg-[#2C1A14] text-[#D4A373] dark:text-[#EAE0D5] border border-[#E8DCCB] dark:border-[#3c2317] rounded-[20px] flex items-center justify-center shrink-0 transition-colors">
                  <Ticket className="w-7 h-7" />
                </div>
                <div className="flex-1 text-center sm:text-right w-full mb-2 sm:mb-0">
                  <h3 className="font-black text-[#2C1E16] dark:text-white text-lg mb-1.5 transition-colors">
                    کد تخفیف دارید؟
                  </h3>
                  <p className="text-sm font-medium text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                    برای اعمال تخفیف، کد خود را وارد کنید.
                  </p>
                </div>
                <div className="flex w-full sm:w-auto h-14 bg-[#FDFCFB] dark:bg-[#1A1412] rounded-2xl border border-[#F0EBE1] dark:border-[#3c2317] overflow-hidden focus-within:border-[#D4A373] dark:focus-within:border-[#C68E58] focus-within:ring-2 focus-within:ring-[#D4A373]/20 dark:focus-within:ring-[#C68E58]/20 transition-all">
                  <input
                    type="text"
                    placeholder="مثال: NEO20"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full sm:w-48 bg-transparent px-5 text-center sm:text-left text-sm font-black outline-none uppercase tracking-widest text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-[#D1C8B8] dark:placeholder:text-[#6A5A4F] transition-colors"
                    dir="ltr"
                  />
                  {/* 🚀 FIXED: Changed text to "اعمال" and applied primary Mocha background[cite: 10] */}
                  <button
                    onClick={handleApplyDiscount}
                    className="bg-[#D4A373] hover:bg-[#C29262] text-white px-8 text-sm font-black transition-colors dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826]"
                  >
                    اعمال
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
