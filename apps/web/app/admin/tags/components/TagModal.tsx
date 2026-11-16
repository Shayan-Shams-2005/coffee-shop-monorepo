// app/admin/tags/components/TagModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";
import { ProductTag } from "../types";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTag: ProductTag | null;
  onSubmit: (data: { name: string }) => Promise<void>;
}

export function TagModal({ isOpen, onClose, editingTag, onSubmit }: TagModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingTag) {
        setName(editingTag.name);
      } else {
        setName("");
      }
      setIsSubmitting(false);
    }
  }, [isOpen, editingTag]);

  if (!isOpen) return null;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim()) return; 
    
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
    } catch (err) {
      console.error("خطا در مودال تگ:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#C68E58]" />
            {editingTag ? "ویرایش برچسب" : "افزودن برچسب جدید"}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">عنوان برچسب</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-right disabled:opacity-60"
              placeholder="مثال: پرفروش، کافئین بالا"
            />
            {!editingTag && (
              <p className="text-xs text-[#8C7A6B] mt-2 text-right">
                شناسه یکتا (Slug) به صورت خودکار تولید خواهد شد.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none flex justify-center items-center gap-2 ${
              isSubmitting || !name.trim()
                ? "bg-[#C68E58]/60 cursor-not-allowed" 
                : "bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                در حال ذخیره‌سازی...
              </>
            ) : (
              editingTag ? "ذخیره تغییرات" : "ایجاد برچسب"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}