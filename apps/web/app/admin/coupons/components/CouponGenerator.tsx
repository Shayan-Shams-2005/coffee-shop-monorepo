// app/admin/coupons/components/CouponGenerator.tsx
"use client";

import { useState, useEffect } from "react";
import { Hash, Percent, CalendarDays, RefreshCw, Plus } from "lucide-react";

interface CouponGeneratorProps {
  onCreateCoupon: (data: { code: string; discount: number; expiresInDays: number }) => void;
}

export function CouponGenerator({ onCreateCoupon }: CouponGeneratorProps) {
  const [codeLength, setCodeLength] = useState<number>(8);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [expiryDays, setExpiryDays] = useState<number>(14);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < codeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
  };

  // Generate an initial code on mount
  useEffect(() => {
    generateRandomCode();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!generatedCode.trim()) return;
    
    onCreateCoupon({
      code: generatedCode,
      discount: discountPercent,
      expiresInDays: expiryDays,
    });
    
    generateRandomCode(); // Generate a new one right after saving
  };

  return (
    <div className="bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] p-5 sm:p-8 mb-8 shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
      <h2 className="text-lg font-black text-[#2C1E16] dark:text-white mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4">
        ساخت کد تخفیف جدید
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
            <Hash className="w-4 h-4 text-[#C68E58]" /> تعداد حروف کد
          </label>
          <input
            type="number"
            min="4"
            max="16"
            value={codeLength}
            onChange={(e) => setCodeLength(Number(e.target.value))}
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
          />
        </div>

        <div>
          <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
            <Percent className="w-4 h-4 text-[#C68E58]" /> درصد تخفیف
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-bold">%</span>
          </div>
        </div>

        <div>
          <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#C68E58]" /> انقضا (تعداد روز)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end gap-4 bg-[#FCF9F5] dark:bg-[#231511] p-4 sm:p-5 rounded-2xl border border-[#F5EFE6] dark:border-[#3c2317]">
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-2">کد تولید شده:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={generatedCode}
              className="w-full bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3.5 text-[#2C1E16] dark:text-[#C68E58] focus:outline-none transition-all dir-ltr text-left font-black text-xl tracking-widest"
            />
            <button 
              onClick={generateRandomCode}
              className="p-3.5 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 group"
              title="تولید مجدد کد"
            >
              <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleCreate}
          className="w-full sm:w-auto h-[54px] flex items-center justify-center gap-2 px-8 bg-[#C68E58] hover:bg-[#A87242] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> ایجاد کد تخفیف
        </button>
      </div>
    </div>
  );
}