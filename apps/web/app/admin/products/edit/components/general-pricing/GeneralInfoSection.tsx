// app/admin/products/edit/components/general-pricing/GeneralInfoSection.tsx
"use client";

import { useEffect, useRef } from "react";
// 🚀 مسیر صحیح تایپ‌ها (دو پوشه به عقب)
import { ProductFormData } from "../../types";

const TITLE_MAX_LENGTH = 150;
const DESC_MAX_LENGTH = 2000;

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

// 🚀 کلمه export اضافه شده تا فایل‌های دیگر بتوانند آن را بخوانند
export function GeneralInfoSection({ formData, setFormData }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 transition-colors">
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
            className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">توضیحات</label>
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              {(formData.description?.length || 0).toLocaleString("fa-IR")} / {DESC_MAX_LENGTH.toLocaleString("fa-IR")}
            </span>
          </div>
          <div
            dir="ltr"
            className="w-full h-[160px] overflow-y-auto bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl focus-within:border-[#C68E58] dark:focus-within:border-[#C68E58] focus-within:ring-4 focus-within:ring-[#C68E58]/10 transition-all custom-scrollbar"
          >
            <textarea
              ref={textareaRef}
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={DESC_MAX_LENGTH}
              dir="rtl"
              className="w-full min-h-full block bg-transparent p-5 text-[#4A3022] dark:text-[#EAE0D5] outline-none resize-none overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}