// app/admin/categories/components/CategoryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, PackageSearch } from "lucide-react";
import { Category } from "../types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  allCategories: Category[];
  onSubmit: (data: { name: string; parentId: number | null; imagePreview: string; file: File | null }) => Promise<void>;
}

export function CategoryModal({ isOpen, onClose, editingCategory, allCategories, onSubmit }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    parentId: "null",
    imagePreview: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 🚀 اضافه شدن حالت لودینگ برای دکمه سابمیت
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          parentId: editingCategory.parentId === null ? "null" : editingCategory.parentId.toString(),
          imagePreview: editingCategory.image || "",
        });
      } else {
        setFormData({ name: "", parentId: "null", imagePreview: "" });
      }
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // جلوگیری از کلیک تکراری
    
    setIsSubmitting(true);
    try {
      console.log("شروع ارسال فرم...");
      // منتظر می‌مانیم تا عملیات در page.tsx تمام شود
      await onSubmit({
        name: formData.name,
        parentId: formData.parentId === "null" ? null : parseInt(formData.parentId),
        imagePreview: formData.imagePreview,
        file: selectedFile,
      });
    } catch (err) {
      console.error("خطا در کامپوننت مودال:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white">
            {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌‌بندی جدید"}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام دسته‌بندی</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-right disabled:opacity-60"
              placeholder="مثال: قهوه اسپرسو"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">دسته‌بندی والد (اختیاری)</label>
            <select
              value={formData.parentId}
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all appearance-none text-right disabled:opacity-60"
            >
              <option value="null">بدون والد (دسته اصلی)</option>
              {allCategories.filter(c => c.id !== editingCategory?.id).map(cat => {
                 let depth = 0;
                 let currentParent = cat.parentId;
                 while (currentParent !== null) {
                    depth++;
                    const parent = allCategories.find(p => p.id === currentParent);
                    if(parent) currentParent = parent.parentId;
                    else break;
                 }
                 const prefix = Array(depth).fill('—').join('');

                return (
                  <option key={cat.id} value={cat.id}>
                    {prefix} {cat.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">تصویر دسته‌بندی</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#231511] border border-dashed border-[#C68E58]/50 flex items-center justify-center overflow-hidden shrink-0">
                {formData.imagePreview ? (
                  <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <PackageSearch className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="category-image"
                  disabled={isSubmitting}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="category-image"
                  className={`inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-[#2A1B16] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-lg text-sm font-bold text-[#C68E58] transition-colors w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C]'}`}
                >
                  انتخاب تصویر جدید
                </label>
                <p className="text-xs text-[#8C7A6B] mt-2 text-right">فرمت‌های مجاز: JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          {/* 🚀 دکمه سابمیت داینامیک که وضعیت لودینگ را نشان می‌دهد */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none flex justify-center items-center gap-2 ${
              isSubmitting 
                ? "bg-[#C68E58]/60 cursor-not-allowed" 
                : "bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                در حال ارسال اطلاعات...
              </>
            ) : (
              editingCategory ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}