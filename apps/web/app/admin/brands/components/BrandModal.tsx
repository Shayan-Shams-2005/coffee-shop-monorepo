// app/admin/brands/components/BrandModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, X, ImagePlus } from "lucide-react";
import { UIBrand, getCategoryIcon, getCategoryShortName } from "../types";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBrand: UIBrand | null;
  defaultCategory: string;
  uniqueCategories: string[];
  onSubmit: (data: { name: string; enName: string; category: string; imagePreview: string }) => void;
}

export function BrandModal({ isOpen, onClose, editingBrand, defaultCategory, uniqueCategories, onSubmit }: BrandModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    enName: "",
    category: "",
    isNewCategory: false,
    newCategoryName: "",
    imagePreview: "",
  });

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingBrand) {
        setFormData({
          name: editingBrand.name,
          enName: editingBrand.enName,
          category: editingBrand.category,
          isNewCategory: false,
          newCategoryName: "",
          imagePreview: editingBrand.image || "",
        });
      } else {
        setFormData({
          name: "",
          enName: "",
          category: defaultCategory || (uniqueCategories[0] ?? "coffee"),
          isNewCategory: false,
          newCategoryName: "",
          imagePreview: "",
        });
      }
    }
  }, [isOpen, editingBrand, defaultCategory, uniqueCategories]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = formData.isNewCategory && formData.newCategoryName.trim() !== "" 
      ? formData.newCategoryName.trim() 
      : formData.category;

    onSubmit({
      name: formData.name,
      enName: formData.enName,
      category: finalCategory,
      imagePreview: formData.imagePreview,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
            {editingBrand ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <Plus className="w-5 h-5 text-[#C68E58]" />}
            {editingBrand ? "ویرایش برند" : "افزودن برند جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" dir="rtl">
          
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام برند (فارسی)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="strict-persian-input w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
              placeholder="مثال: نسپرسو"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام برند (انگلیسی)</label>
            <input
              type="text"
              required
              dir="ltr"
              value={formData.enName}
              onChange={(e) => setFormData({ ...formData, enName: e.target.value })}
              style={{ textAlign: 'left', direction: 'ltr' }}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
              placeholder="Example: Nespresso"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">گروه برند</label>
            {formData.isNewCategory ? (
              <div className="flex gap-2 w-full" dir="rtl">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    required
                    value={formData.newCategoryName}
                    onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
                    className="strict-persian-input w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#C68E58] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                    placeholder="نام گروه جدید..." 
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isNewCategory: false, newCategoryName: "" })}
                  className="px-6 py-3 bg-gray-100 dark:bg-[#2A1B16] text-[#8C7A6B] rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3c2317] transition-colors shrink-0"
                >
                  انصراف
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                      formData.category === cat
                        ? "bg-[#C68E58]/10 border-[#C68E58] text-[#C68E58]"
                        : "bg-[#FCF9F5] dark:bg-[#231511] border-[#E3C3A4]/50 dark:border-[#3c2317] text-[#8C7A6B] hover:border-[#C68E58]/50"
                    }`}
                  >
                    {getCategoryIcon(cat)} {getCategoryShortName(cat)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isNewCategory: true, category: "" })}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#C68E58] text-[#C68E58] text-sm font-bold hover:bg-[#C68E58]/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> گروه جدید
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لوگوی برند</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#FCF9F5] dark:bg-[#231511] border border-dashed border-[#C68E58]/50 flex items-center justify-center overflow-hidden shrink-0">
                {formData.imagePreview ? (
                  <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImagePlus className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="brand-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="brand-image"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-[#2A1B16] border border-[#E3C3A4] dark:border-[#3c2317] rounded-lg text-sm font-bold text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] transition-colors w-full"
                >
                  انتخاب تصویر جدید
                </label>
                <p className="text-xs text-[#8C7A6B] mt-2 text-right">فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
          >
            {editingBrand ? "ذخیره تغییرات" : "ایجاد برند"}
          </button>
        </form>
      </div>
    </div>
  );
}