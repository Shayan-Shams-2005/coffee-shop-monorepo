"use client";

import { useState, useEffect } from "react";
import { Percent, Clock } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { ProductFormData } from "../../types/admin";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductGeneralPricing({ formData, setFormData }: Props) {
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const TITLE_MAX_LENGTH = 150;
  const DESC_MAX_LENGTH = 2000;

  useEffect(() => {
    if (isDiscountActive && formData.basePrice > 0 && formData.salePrice > 0 && formData.salePrice <= formData.basePrice) {
      const diff = formData.basePrice - formData.salePrice;
      setDiscountPercent(Math.round((diff / formData.basePrice) * 100));
    } else {
      setDiscountPercent(0);
    }
  }, [formData.basePrice, formData.salePrice, isDiscountActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const englishValue = value.replace(/[۰-۹]/g, (w) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(w)] || w);
    const numValue = parseInt(englishValue.replace(/\D/g, ""), 10) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-calendar .rmdp-time-picker input {
            width: 38px !important;
            font-size: 14px !important;
            margin: 0 2px !important;
            text-align: center !important;
          }
        `
      }} />

      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3 border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> اطلاعات کلی
        </h2>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">عنوان محصول</label>
              <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
                {(formData.title?.length || 0).toLocaleString("fa-IR")} / {TITLE_MAX_LENGTH.toLocaleString("fa-IR")}
              </span>
            </div>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              maxLength={TITLE_MAX_LENGTH}
              className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">توضیحات</label>
              <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
                {(formData.description?.length || 0).toLocaleString("fa-IR")} / {DESC_MAX_LENGTH.toLocaleString("fa-IR")}
              </span>
            </div>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              maxLength={DESC_MAX_LENGTH}
              rows={5} 
              className="w-full bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl p-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none resize-none transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors">
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> قیمت‌گذاری و تخفیف
          </h2>
          <button
            type="button"
            onClick={() => setIsDiscountActive(!isDiscountActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isDiscountActive ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" : "bg-[#FCF9F5] text-[#8C7A6B] border-transparent hover:border-[#C68E58]/20 dark:bg-[#1A0F0C] dark:hover:border-[#3c2317]"}`}
          >
            <Percent className="w-4 h-4" /> {isDiscountActive ? "تخفیف فعال است" : "فعال‌سازی تخفیف"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">قیمت اصلی (تومان)</label>
            <input 
              type="text" 
              name="basePrice" 
              dir="ltr" 
              style={{ textAlign: "left" }}
              value={formData.basePrice ? formData.basePrice.toLocaleString("fa-IR") : ""} 
              onChange={handlePriceChange} 
              className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 !text-left font-black text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all" 
              placeholder="۰"
            />
          </div>

          <div className={`transition-opacity ${!isDiscountActive ? "opacity-50 pointer-events-none" : ""}`}>
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
              style={{ textAlign: "left" }}
              disabled={!isDiscountActive} 
              value={formData.salePrice ? formData.salePrice.toLocaleString("fa-IR") : ""} 
              onChange={handlePriceChange} 
              className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 !text-left font-black text-rose-500 dark:text-rose-400 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all" 
              placeholder="۰"
            />
          </div>

          <div className={`sm:col-span-2 transition-opacity ${!isDiscountActive ? "opacity-50 pointer-events-none" : ""}`}>
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> مهلت پایان تخفیف
            </label>
            <div className="relative">
              <DatePicker
                value={formData.offerEndDate}
                onChange={(date) => setFormData(prev => ({ ...prev, offerEndDate: date as any }))}
                disabled={!isDiscountActive}
                calendar={persian}
                locale={persian_fa}
                className="custom-calendar"
                format="YYYY/MM/DD - HH:mm:ss"
                plugins={[<TimePicker position="bottom" key="time-picker" />]}
                containerClassName="w-full"
                inputClass="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 !text-left font-medium text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all placeholder-gray-400 dir-ltr"
                placeholder="انتخاب تاریخ و ساعت..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}