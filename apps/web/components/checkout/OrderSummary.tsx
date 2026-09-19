import Image from "next/image";
import Link from "next/link";
import { CreditCard, ShieldCheck, Check } from "lucide-react";

interface OrderSummaryProps {
  cartItems: any[];
  cartTotal: number;
  shippingCost: number;
  finalTotal: number;
  selectedPayment: string;
  setSelectedPayment: (val: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (val: boolean) => void;
}

export function OrderSummary({
  cartItems,
  cartTotal,
  shippingCost,
  finalTotal,
  selectedPayment,
  setSelectedPayment,
  agreedToTerms,
  setAgreedToTerms,
}: OrderSummaryProps) {
  return (
    <div className="w-full lg:w-5/12">
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] sticky top-28 transition-colors">
        <h3 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 flex items-center gap-3 transition-colors">
          <div className="w-2 h-6 bg-[#D4A373] dark:bg-[#5A3A29] rounded-full transition-colors"></div>{" "}
          خلاصه سفارش
        </h3>

        {/* ================== لیست محصولات ================== */}
        <div
          dir="ltr"
          className="space-y-4 mb-6 pt-3 pb-6 border-b border-dashed border-[#F0EBE1] dark:border-[#3c2317] max-h-[300px] overflow-y-auto custom-scrollbar pr-4 transition-colors"
        >
          {cartItems.map((item) => (
            <div
              key={item.id}
              dir="rtl"
              className="flex gap-3 items-center group"
            >
              <div className="w-14 h-14 bg-[#FCF9F5] dark:bg-gradient-to-br dark:from-[#D4C5B0] dark:to-[#C6B59D] border border-[#F0EBE1] dark:border-transparent rounded-xl relative p-1 flex-shrink-0 transition-colors group-hover:border-[#D4A373]/50 dark:group-hover:border-transparent">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain mix-blend-multiply"
                />
                <span className="absolute -top-2 -right-2 bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 text-sm text-right">
                <h4 className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] line-clamp-1 group-hover:text-[#D4A373] dark:group-hover:text-[#FFD7BA] transition-colors">
                  {item.name}
                </h4>
                <div className="text-[#8C7A6B] dark:text-[#ba8d71] mt-1 dir-ltr text-right font-medium transition-colors">
                  {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================== جزئیات مالی ================== */}
        <div className="space-y-4 text-[15px] font-medium mb-6 pb-6 border-b border-dashed border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
          <div className="flex justify-between items-center text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
            <span>جمع مبلغ کالاها</span>
            <span className="dir-ltr text-[#2C1E16] dark:text-[#FFF8F0] font-black transition-colors">
              {cartTotal.toLocaleString("fa-IR")}{" "}
              <span className="text-xs text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
                تومان
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
            <span>هزینه بسته‌بندی و ارسال</span>
            <span className="dir-ltr text-[#2C1E16] dark:text-[#FFF8F0] font-black transition-colors">
              {shippingCost.toLocaleString("fa-IR")}{" "}
              <span className="text-xs text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
                تومان
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-black text-[#2C1E16] dark:text-white text-lg transition-colors">
              مبلغ نهایی
            </span>
            <span className="font-black text-[#2C1E16] dark:text-[#FFF8F0] text-2xl dir-ltr flex items-center gap-1 transition-colors">
              {finalTotal.toLocaleString("fa-IR")}{" "}
              <span className="text-[11px] text-[#8C7A6B] dark:text-[#ba8d71] font-bold mt-1">
                تومان
              </span>
            </span>
          </div>
        </div>

        {/* ================== انتخاب درگاه پرداخت ================== */}
        <h4 className="text-sm font-bold text-[#2C1E16] dark:text-white mb-3 transition-colors">
          روش پرداخت
        </h4>
        <div className="mb-6 space-y-3">
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === "saman"
                ? "border-[#D4A373] dark:border-[#C68E58] bg-[#FFF9F2] dark:bg-[#2C1A14]"
                : "border-[#F0EBE1] dark:border-[#3c2317] hover:border-[#E8DCCB] dark:hover:border-[#6A5A4F] bg-[#FDFCFB] dark:bg-[#1A1412]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPayment === "saman"
                    ? "border-[#D4A373] dark:border-[#C68E58]"
                    : "border-[#D1C8B8] dark:border-[#6A5A4F]"
                }`}
              >
                {selectedPayment === "saman" && (
                  <div className="w-2.5 h-2.5 bg-[#D4A373] dark:bg-[#C68E58] rounded-full transition-colors" />
                )}
              </div>
              <span className="font-bold text-sm text-[#2C1E16] dark:text-[#EAE0D5] transition-colors">
                درگاه بانک سامان
              </span>
            </div>
            <CreditCard
              className={`w-6 h-6 transition-colors ${
                selectedPayment === "saman"
                  ? "text-[#D4A373] dark:text-[#C68E58]"
                  : "text-[#D1C8B8] dark:text-[#6A5A4F]"
              }`}
            />
          </label>
        </div>

        {/* ================== قوانین و مقررات ================== */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer group bg-[#F9F8F6] p-4 rounded-xl border border-[#F0EBE1] transition-colors dark:bg-transparent dark:border-[#6A422D]">
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="peer appearance-none w-5 h-5 border-2 border-[#E8DCCB] dark:border-[#6A422D] rounded-md checked:bg-[#D4A373] dark:checked:bg-[#6A422D] checked:border-[#D4A373] dark:checked:border-[#6A422D] transition-all cursor-pointer bg-white dark:bg-transparent"
            />
            <Check
              className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              strokeWidth={4}
            />
          </div>
          <span className="text-xs font-medium text-[#5A4A42] leading-relaxed group-hover:text-[#2C1E16] transition-colors dark:text-[#F3E8E0] dark:group-hover:text-white">
            من{" "}
            <Link
              href="/terms"
              className="text-[#D4A373] dark:text-[#C68E58] hover:underline font-bold transition-colors"
            >
              شرایط و قوانین
            </Link>{" "}
            خرید را با دقت مطالعه کرده‌ام و می‌پذیرم.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>

        {/* ================== دکمه ثبت نهایی ================== */}
        <button
          type="submit"
          className="group w-full h-14 bg-[#C68E58] hover:bg-[#A87242] text-white flex items-center justify-center gap-3 font-black text-base rounded-2xl transition-all shadow-md active:scale-95 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
        >
          <ShieldCheck className="w-5 h-5" /> پرداخت امن و ثبت سفارش
        </button>
      </div>
    </div>
  );
}
