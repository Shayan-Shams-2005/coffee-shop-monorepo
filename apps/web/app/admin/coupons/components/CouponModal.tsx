// app/admin/coupons/components/CouponModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit, X, Save } from "lucide-react";
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
      
      <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#C68E58]" /> ویرایش کد تخفیف
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
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
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black tracking-widest uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">درصد تخفیف</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-bold">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">انقضا (تعداد روز)</label>
            <input
              type="number"
              min="0"
              required
              value={formData.expiresInDays}
              onChange={(e) => setFormData({ ...formData, expiresInDays: Number(e.target.value) })}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" /> ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}