// app/admin/products/edit/components/general-pricing/SimplePricingSection.tsx
"use client";

import { Percent, Clock, Package, Plus, Minus } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
// 🚀 اصلاح شد: مسیر درست برای رسیدن به پوشه edit
import { ProductFormData } from "../../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  isDiscountActive: boolean;
  setIsDiscountActive: (val: boolean) => void;
  discountPercent: number;
}

export function SimplePricingSection({ formData, setFormData, isDiscountActive, setIsDiscountActive, discountPercent }: Props) {
  const handleSimpleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
      return;
    }
    const englishValue = value.replace(/[۰-۹]/g, (w) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(w)] || w);
    let numValue = parseInt(englishValue.replace(/\D/g, ""), 10) || 0;

    if (name === "basePrice" || name === "salePrice") numValue = Math.min(numValue, 1000000000000000);
    else if (name === "stock") numValue = Math.min(numValue, 1000000000);

    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const incrementStock = () => setFormData((prev) => ({ ...prev, stock: Math.min((Number(prev.stock) || 0) + 1, 1000000000) }));
  const decrementStock = () => setFormData((prev) => ({ ...prev, stock: Math.max(0, (Number(prev.stock) || 0) - 1) }));

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-[#8C7A6B]">تنظیمات قیمت اصلی</span>
        <button
          type="button"
          onClick={() => {
            setIsDiscountActive(!isDiscountActive);
            if (isDiscountActive) setFormData(prev => ({ ...prev, salePrice: 0, offerEndDate: undefined }));
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
            isDiscountActive
              ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
              : "bg-white text-[#8C7A6B] border-[#E3C3A4]/60 hover:border-[#C68E58]/50 dark:bg-[#231511] dark:hover:border-[#3c2317]"
          }`}
        >
          <Percent className="w-4 h-4" /> {isDiscountActive ? "تخفیف فعال است" : "فعال‌‌سازی تخفیف"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">قیمت اصلی (تومان)</label>
          <input
            type="text"
            name="basePrice"
            dir="ltr"
            value={formData.basePrice ? formData.basePrice.toLocaleString("fa-IR") : ""}
            onChange={handleSimpleNumberChange}
            maxLength={25}
            className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 !text-left font-black text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all"
            placeholder="۰"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#8C7A6B]" /> موجودی اولیه
          </label>
          <div className="relative flex items-center group">
            <input
              type="text"
              name="stock"
              value={formData.stock ? formData.stock.toLocaleString("fa-IR") : ""}
              onChange={handleSimpleNumberChange}
              placeholder="۰"
              maxLength={15}
              className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all !text-left font-medium pr-[4.5rem]"
              dir="ltr"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl overflow-hidden shadow-sm">
              <button type="button" onClick={incrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Plus className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-[#E3C3A4]/60 dark:bg-[#3c2317]"></div>
              <button type="button" onClick={decrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Minus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className={`transition-opacity ${!isDiscountActive ? "hidden" : ""}`}>
          <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex justify-between items-center">
            قیمت با تخفیف (تومان)
            {isDiscountActive && discountPercent > 0 && (
              <span className="text-rose-600 bg-rose-50 border border-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-0.5 rounded-lg text-xs font-black">
                {discountPercent.toLocaleString("fa-IR")}٪
              </span>
            )}
          </label>
          <input
            type="text"
            name="salePrice"
            dir="ltr"
            value={formData.salePrice ? formData.salePrice.toLocaleString("fa-IR") : ""}
            onChange={handleSimpleNumberChange}
            maxLength={25}
            className="w-full h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-2xl px-5 !text-left font-black text-rose-500 dark:text-rose-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
            placeholder="۰"
          />
        </div>

        <div className={`transition-opacity ${!isDiscountActive ? "hidden" : ""}`}>
          <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8C7A6B]" /> مهلت پایان تخفیف
          </label>
          <div className="relative">
            <DatePicker
              value={formData.offerEndDate}
              onChange={(date) => setFormData(prev => ({ ...prev, offerEndDate: date as unknown as Date }))}
              calendar={persian}
              locale={persian_fa}
              className="custom-calendar"
              format="YYYY/MM/DD - HH:mm:ss"
              plugins={[<TimePicker position="bottom" key="time-picker" />]}
              containerClassName="w-full"
              inputClass="w-full h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-2xl px-5 !text-left font-medium text-[#4A3022] dark:text-[#EAE0D5] focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder-gray-400 dir-ltr"
              placeholder="انتخاب تاریخ و ساعت..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}