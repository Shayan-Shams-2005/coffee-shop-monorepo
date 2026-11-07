// app/admin/brands/components/BrandGroupModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FolderPlus, Edit, X } from "lucide-react";
import { UIBrandGroup } from "../types";

interface BrandGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGroup: UIBrandGroup | null;
  onSubmit: (data: { name: string; displayOrder: number }) => void;
}

export function BrandGroupModal({ isOpen, onClose, editingGroup, onSubmit }: BrandGroupModalProps) {
  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingGroup) {
        setName(editingGroup.name);
        setDisplayOrder(editingGroup.displayOrder);
      } else {
        setName("");
        setDisplayOrder(0);
      }
      setIsSubmitting(false);
    }
  }, [isOpen, editingGroup]);

  if (!isOpen) return null;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, displayOrder });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            {editingGroup ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <FolderPlus className="w-5 h-5 text-[#C68E58]" />}
            {editingGroup ? "ویرایش گروه برند" : "افزودن گروه جدید"}
          </h2>
          <button onClick={onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" dir="rtl">
          
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام گروه</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="strict-persian-input w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
              placeholder="مثال: برندهای قهوه..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">ترتیب نمایش</label>
            <input
              type="number"
              required
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29]'}`}
          >
            {isSubmitting ? "در حال ذخیره..." : (editingGroup ? "ذخیره تغییرات" : "ایجاد گروه")}
          </button>
        </form>
      </div>
    </div>
  );
}