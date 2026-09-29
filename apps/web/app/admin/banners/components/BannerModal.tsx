// app/admin/banners/components/BannerModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Edit, Plus, UploadCloud, ImagePlus } from "lucide-react";
import { AdBanner, SectionId } from "../types";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId | null;
  editingBanner: AdBanner | null;
  onSubmit: (data: Omit<AdBanner, "id">) => void;
}

export function BannerModal({ isOpen, onClose, activeSection, editingBanner, onSubmit }: BannerModalProps) {
  const [formData, setFormData] = useState({
    imageUrl: "",
    link: "",
    alt: "",
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      if (editingBanner) {
        setFormData({
          imageUrl: editingBanner.imageUrl,
          link: editingBanner.link,
          alt: editingBanner.alt,
        });
      } else {
        setFormData({ imageUrl: "", link: "", alt: "" });
      }
    }
  }, [isOpen, editingBanner]);

  if (!isOpen || !activeSection) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError(false);
      setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      section: activeSection,
      imageUrl: formData.imageUrl,
      link: formData.link,
      alt: formData.alt,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
            {editingBanner ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <Plus className="w-5 h-5 text-[#C68E58]" />}
            {editingBanner ? "ویرایش بنر" : "افزودن بنر جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-3 text-right">فایل بنر (JPG, PNG, GIF)</label>
            <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all ${
              formData.imageUrl && !imageError
                ? "border-transparent h-40" 
                : "border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] h-40"
            }`}>
              {formData.imageUrl && !imageError ? (
                <div className="relative w-full h-full group bg-black/5">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-2xl" 
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-2xl">
                    <label className="cursor-pointer bg-white/20 hover:bg-white text-white hover:text-[#C68E58] px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md transition-colors flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" /> تغییر تصویر
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#8C7A6B] dark:text-[#6A5A4F] p-4 text-center">
                  <ImagePlus className="w-8 h-8 mb-3" />
                  <span className="font-bold text-sm">برای انتخاب تصویر یا GIF کلیک کنید</span>
                  <span className="text-xs mt-2 opacity-70">حجم مجاز: حداکثر ۳ مگابایت</span>
                  <input type="file" required={!editingBanner} accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Alt Text Input */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">عنوان جایگزین تصویر (Alt Text)</label>
            <input
              type="text"
              required
              style={{ textAlign: 'right', direction: 'rtl' }}
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
              placeholder="توضیح کوتاه برای سئو (مثال: بنر تخفیف تابستانه)..."
            />
          </div>

          {/* URL Link Input */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لینک مقصد (URL)</label>
            <input
              type="text"
              style={{ textAlign: 'left', direction: 'ltr' }}
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left dir-ltr"
              placeholder="https://example.com/offers"
            />
            <p className="text-[11px] text-[#8C7A6B] mt-2 text-right">لینک صفحه‌ای که کاربر با کلیک روی بنر به آن هدایت می‌شود.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors mt-4 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
          >
            {editingBanner ? "ذخیره تغییرات" : "ایجاد و انتشار بنر"}
          </button>
        </form>
      </div>
    </div>
  );
}