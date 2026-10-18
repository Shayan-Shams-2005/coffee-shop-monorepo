// app/admin/products/edit/components/ProductVariantSpecs.tsx
"use client";

import { Plus, Trash2 } from "lucide-react";
import { ProductFormData } from "../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const MAX_KEY_FEATURES = 10;
const MAX_SPECS = 30;

// 🚀 TEXT LIMITS
const KEY_FEATURE_TITLE_LIMIT = 25;
const KEY_FEATURE_VALUE_LIMIT = 50;

const SPEC_TITLE_LIMIT = 40;
const SPEC_VALUE_LIMIT = 80;

export function ProductVariantSpecs({ formData, setFormData }: Props) {
  const updateArrayItem = (arrayName: 'keyFeatures' | 'specs', index: number, field: "key" | "value", val: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [arrayName]: prev[arrayName].map((item, i) => i === index ? { ...item, [field]: val } : item) 
    }));
  };

  const removeArrayItem = (arrayName: 'keyFeatures' | 'specs', index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      [arrayName]: prev[arrayName].filter((_, i) => i !== index) 
    }));
  };

  const addArrayItem = (arrayName: 'keyFeatures' | 'specs') => {
    setFormData(prev => {
      const currentList = prev[arrayName] || [];
      const limit = arrayName === 'keyFeatures' ? MAX_KEY_FEATURES : MAX_SPECS;
      if (currentList.length >= limit) return prev;
      return { ...prev, [arrayName]: [...currentList, { key: "", value: "" }] };
    });
  };

  return (
    <>
      <KeyFeaturesSection formData={formData} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
      <SpecsSection formData={formData} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />
    </>
  );
}

// ============================================================================
// 1. KEY FEATURES SECTION
// ============================================================================

interface ArraySectionProps {
  formData: ProductFormData;
  addArrayItem: (name: 'keyFeatures' | 'specs') => void;
  updateArrayItem: (name: 'keyFeatures' | 'specs', i: number, f: "key" | "value", v: string) => void;
  removeArrayItem: (name: 'keyFeatures' | 'specs', i: number) => void;
}

function KeyFeaturesSection({ formData, addArrayItem, updateArrayItem, removeArrayItem }: ArraySectionProps) {
  const currentCount = formData.keyFeatures?.length || 0;
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <div className="flex justify-between items-center border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 flex-row-reverse">
        {currentCount < MAX_KEY_FEATURES && (
          <button type="button" onClick={() => addArrayItem('keyFeatures')} className="text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-[#231511] px-3 py-1.5 rounded-xl border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3c2317]">
            افزودن ویژگی <Plus className="w-4 h-4" /> 
          </button>
        )}
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3" dir="rtl">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> ویژگی‌های کلیدی
          <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">{currentCount} / {MAX_KEY_FEATURES}</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" dir="rtl">
        {(formData.keyFeatures || []).map((kf, index) => (
          <div key={index} className="flex items-center gap-2 group bg-white dark:bg-[#231511] p-2 rounded-2xl border border-[#E3C3A4]/60 dark:border-[#3c2317] focus-within:border-[#C68E58]">
            <input 
              type="text" 
              placeholder="مثال: نوع قهوه" 
              value={kf.key} 
              maxLength={KEY_FEATURE_TITLE_LIMIT} 
              dir="rtl" 
              onChange={(e) => updateArrayItem('keyFeatures', index, "key", e.target.value)} 
              className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-[#E3C3A4]/60 dark:border-[#3c2317]" 
            />
            <input 
              type="text" 
              placeholder="مثال: ۱۰۰٪ عربیکا" 
              value={kf.value} 
              maxLength={KEY_FEATURE_VALUE_LIMIT} 
              dir="rtl" 
              onChange={(e) => updateArrayItem('keyFeatures', index, "value", e.target.value)} 
              className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none" 
            />
            <button type="button" onClick={() => removeArrayItem('keyFeatures', index)} className="p-2 text-[#8C7A6B] hover:text-rose-500 hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 2. TECHNICAL SPECS SECTION
// ============================================================================

function SpecsSection({ formData, addArrayItem, updateArrayItem, removeArrayItem }: ArraySectionProps) {
  const currentCount = formData.specs?.length || 0;
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <div className="flex justify-between items-center border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 flex-row-reverse">
        {currentCount < MAX_SPECS && (
          <button type="button" onClick={() => addArrayItem('specs')} className="text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-[#231511] px-3 py-1.5 rounded-xl border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3c2317]">
            سطر جدید <Plus className="w-4 h-4" /> 
          </button>
        )}
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3" dir="rtl">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> سایر مشخصات فنی
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
              onChange={(e) => updateArrayItem('specs', index, "key", e.target.value)} 
              className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-[#E3C3A4]/60 dark:border-[#3c2317]" 
            />
            <input 
              type="text" 
              placeholder="مقدار (مثال: ۲۵۰ گرم)" 
              value={spec.value} 
              maxLength={SPEC_VALUE_LIMIT} 
              dir="rtl" 
              onChange={(e) => updateArrayItem('specs', index, "value", e.target.value)} 
              className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none" 
            />
            <button type="button" onClick={() => removeArrayItem('specs', index)} className="p-2 text-[#8C7A6B] hover:text-rose-500 hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}