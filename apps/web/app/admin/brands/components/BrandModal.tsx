// app/admin/brands/components/BrandModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, X, ImagePlus } from "lucide-react";
import { UIBrand } from "../types";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBrand: UIBrand | null;
  onSubmit: (data: { name: string; file: File | null }) => void;
}

export function BrandModal({ isOpen, onClose, editingBrand, onSubmit }: BrandModalProps) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingBrand) {
        setName(editingBrand.name);
        setImagePreview(editingBrand.image || "");
        setImageFile(null);
      } else {
        setName("");
        setImagePreview("");
        setImageFile(null);
      }
      setIsSubmitting(false);
    }
  }, [isOpen, editingBrand]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, file: imageFile });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            {editingBrand ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <Plus className="w-5 h-5 text-[#C68E58]" />}
            {editingBrand ? "ویرایش برند" : "افزودن برند جدید"}
          </h2>
          <button onClick={onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" dir="rtl">
          
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام برند</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="strict-persian-input w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
              placeholder="نام برند را وارد کنید..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لوگوی برند</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#231511] border border-dashed border-[#C68E58]/50 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImagePlus className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="brand-image"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="brand-image"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-[#2A1B16] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-lg text-sm font-bold text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] transition-colors w-full"
                >
                  انتخاب تصویر جدید
                </label>
                <p className="text-xs text-[#8C7A6B] mt-2 text-right">فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۵ مگابایت)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29]'}`}
          >
            {isSubmitting ? "در حال ذخیره..." : (editingBrand ? "ذخیره تغییرات" : "ایجاد برند")}
          </button>
        </form>
      </div>
    </div>
  );
}