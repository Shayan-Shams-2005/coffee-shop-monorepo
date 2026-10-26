// app/admin/products/edit/components/ProductVariantSpecs.tsx
"use client";

import { Plus, Trash2 } from "lucide-react";
import { ProductFormData } from "../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const MAX_SPECS = 30;
const SPEC_TITLE_LIMIT = 40;
const SPEC_VALUE_LIMIT = 80;

export function ProductVariantSpecs({ formData, setFormData }: Props) {
  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    setFormData(prev => ({ 
      ...prev, 
      specs: prev.specs.map((item, i) => i === index ? { ...item, [field]: val } : item) 
    }));
  };

  const removeSpec = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      specs: prev.specs.filter((_, i) => i !== index) 
    }));
  };

  const addSpec = () => {
    setFormData(prev => {
      const currentList = prev.specs || [];
      if (currentList.length >= MAX_SPECS) return prev;
      return { ...prev, specs: [...currentList, { key: "", value: "" }] };
    });
  };

  const currentCount = formData.specs?.length || 0;

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <div className="flex justify-between items-center border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 flex-row-reverse">
        {currentCount < MAX_SPECS && (
          <button type="button" onClick={addSpec} className="text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-[#231511] px-3 py-1.5 rounded-xl border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3c2317]">
            سطر جدید <Plus className="w-4 h-4" /> 
          </button>
        )}
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3" dir="rtl">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> مشخصات محصول
          <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">{currentCount} / {MAX_SPECS}</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" dir="rtl">
        {(formData.specs || []).map((spec, index) => (
          <div key={index} className="flex items-center gap-2 group bg-white dark:bg-[#231511] p-2 rounded-2xl border border-[#E3C3A4]/60 dark:border-[#3c2317] focus-within:border-[#C68E58]">
            <input 
              type="text" 
              placeholder="نام ویژگی (مثال: وزن)" 
              value={spec.key} 
              maxLength={SPEC_TITLE_LIMIT} 
              dir="rtl" 
              onChange={(e) => updateSpec(index, "key", e.target.value)} 
              className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-[#E3C3A4]/60 dark:border-[#3c2317]" 
            />
            <input 
              type="text" 
              placeholder="مقدار (مثال: ۲۵۰ گرم)" 
              value={spec.value} 
              maxLength={SPEC_VALUE_LIMIT} 
              dir="rtl" 
              onChange={(e) => updateSpec(index, "value", e.target.value)} 
              className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none" 
            />
            <button type="button" onClick={() => removeSpec(index)} className="p-2 text-[#8C7A6B] hover:text-rose-500 hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}