// app/admin/coupons/components/CouponModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit, X, Save, Plus, Minus } from "lucide-react";
import { Coupon } from "../types";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCoupon: Coupon | null;
  onSubmit: (data: { code: string; discount: number; expiresInDays: number }) => void;
}

export function CouponModal({ isOpen, onClose, editingCoupon, onSubmit }: CouponModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    expiresInDays: 0,
  });

  useEffect(() => {
    if (isOpen && editingCoupon) {
      setFormData({
        code: editingCoupon.code,
        discount: editingCoupon.discount,
        expiresInDays: editingCoupon.expiresInDays,
      });
    }
  }, [isOpen, editingCoupon]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    onSubmit({
      code: formData.code.toUpperCase(),
      discount: formData.discount,
      expiresInDays: formData.expiresInDays,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#C68E58]" /> ویرایش کد تخفیف
          </h2>
          <button onClick={onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">کد تخفیف</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black tracking-widest uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">درصد تخفیف</label>
            <div className="relative flex items-center group">
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-[6rem] pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-bold">%</span>
              
              <div 
                className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-[12px] overflow-hidden shadow-sm"
                dir="ltr"
              >
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, discount: Math.max(1, p.discount - 1) }))}
                  className="w-10 h-9 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-white dark:hover:bg-[#2A1B16] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-[#E3C3A4]/60 dark:bg-[#3c2317]"></div>
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, discount: Math.min(100, p.discount + 1) }))}
                  className="w-10 h-9 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-white dark:hover:bg-[#2A1B16] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">انقضا (تعداد روز)</label>
            <div className="relative flex items-center group">
              <input
                type="number"
                min="0"
                required
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: Number(e.target.value) })}
                className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-[6rem]"
              />
              <div 
                className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-[12px] overflow-hidden shadow-sm"
                dir="ltr"
              >
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, expiresInDays: Math.max(0, p.expiresInDays - 1) }))}
                  className="w-10 h-9 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-white dark:hover:bg-[#2A1B16] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-[#E3C3A4]/60 dark:bg-[#3c2317]"></div>
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, expiresInDays: p.expiresInDays + 1 }))}
                  className="w-10 h-9 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-white dark:hover:bg-[#2A1B16] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
            >
              <Save className="w-5 h-5" /> ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}