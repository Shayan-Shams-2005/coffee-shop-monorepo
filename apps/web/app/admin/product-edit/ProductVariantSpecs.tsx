"use client";

import { Plus, Trash2, X, ListChecks } from "lucide-react";
import { ProductFormData } from "../../types/admin";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductVariantSpecs({ formData, setFormData }: Props) {
  const MAX_OPTIONS_PER_GROUP = 10;
  const MAX_OPTION_GROUPS = 5;
  const MAX_KEY_FEATURES = 10;
  const MAX_SPECS = 30;

  const updateArrayItem = (arrayName: 'keyFeatures' | 'specs', index: number, field: "key" | "value", val: string) => {
    setFormData(p => ({ ...p, [arrayName]: p[arrayName].map((item, i) => i === index ? { ...item, [field]: val } : item) }));
  };

  const removeArrayItem = (arrayName: 'keyFeatures' | 'specs', index: number) => {
    setFormData(p => ({ ...p, [arrayName]: p[arrayName].filter((_, i) => i !== index) }));
  };

  const addArrayItem = (arrayName: 'keyFeatures' | 'specs') => {
    setFormData(p => {
      const currentList = p[arrayName];
      const limit = arrayName === 'keyFeatures' ? MAX_KEY_FEATURES : MAX_SPECS;
      if (currentList.length >= limit) return p;
      return { ...p, [arrayName]: [...currentList, { key: "", value: "" }] };
    });
  };

  const updateOptionGroupTitle = (index: number, title: string) => setFormData(p => ({ ...p, optionGroups: p.optionGroups.map((g, i) => i === index ? { ...g, title } : g) }));
  
  const addOptionToGroup = (groupIndex: number) => setFormData(p => ({ 
    ...p, 
    optionGroups: p.optionGroups.map((g, i) => 
      (i === groupIndex && g.options.length < MAX_OPTIONS_PER_GROUP) 
        ? { ...g, options: [...g.options, ""] } 
        : g
    ) 
  }));

  const updateOption = (groupIndex: number, optionIndex: number, value: string) => setFormData(p => ({ ...p, optionGroups: p.optionGroups.map((g, i) => i === groupIndex ? { ...g, options: g.options.map((o, j) => j === optionIndex ? value : o) } : g) }));
  const removeOption = (groupIndex: number, optionIndex: number) => setFormData(p => ({ ...p, optionGroups: p.optionGroups.map((g, i) => i === groupIndex ? { ...g, options: g.options.filter((_, j) => j !== optionIndex) } : g) }));
  const removeOptionGroup = (groupIndex: number) => setFormData(p => ({ ...p, optionGroups: p.optionGroups.filter((_, i) => i !== groupIndex) }));
  
  const addOptionGroup = () => setFormData(p => ({ 
    ...p, 
    optionGroups: p.optionGroups.length < MAX_OPTION_GROUPS 
      ? [...p.optionGroups, { title: "", options: [""] }] 
      : p.optionGroups 
  }));

  return (
    <>
      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors flex-row-reverse">
          {formData.keyFeatures.length < MAX_KEY_FEATURES ? (
            <button type="button" onClick={() => addArrayItem('keyFeatures')} className="text-[#C68E58] dark:text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 transition-colors bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-xl border border-transparent hover:border-[#C68E58]/20">
              افزودن ویژگی <Plus className="w-4 h-4" /> 
            </button>
          ) : (
            <div></div>
          )}
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3" dir="rtl">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> 
            ویژگی‌های کلیدی
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              ({formData.keyFeatures.length.toLocaleString("fa-IR")} / {MAX_KEY_FEATURES.toLocaleString("fa-IR")})
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" dir="rtl">
          {formData.keyFeatures.map((kf, index) => (
            <div key={index} className="flex items-center gap-2 group bg-gray-50/50 dark:bg-[#1A0F0C] p-2 rounded-2xl border border-gray-100 dark:border-[#3c2317] focus-within:border-[#C68E58] dark:focus-within:border-[#C68E58] transition-all">
              <input 
                type="text" 
                placeholder="مثال: نوع قهوه" 
                value={kf.key} 
                maxLength={40}
                dir="rtl"
                onChange={(e) => updateArrayItem('keyFeatures', index, "key", e.target.value)} 
                className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-gray-200 dark:border-[#3c2317]" 
              />
              <input 
                type="text" 
                placeholder="مثال: ۱۰۰٪ عربیکا" 
                value={kf.value} 
                maxLength={80}
                dir="rtl"
                onChange={(e) => updateArrayItem('keyFeatures', index, "value", e.target.value)} 
                className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#2C1E16] dark:text-white outline-none" 
              />
              <button type="button" onClick={() => removeArrayItem('keyFeatures', index)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-[#231511] rounded-xl transition-all shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors flex-row-reverse">
          {formData.optionGroups.length < MAX_OPTION_GROUPS ? (
            <button type="button" onClick={addOptionGroup} className="text-[#C68E58] dark:text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 transition-colors bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-xl border border-transparent hover:border-[#C68E58]/20">
               افزودن گروه <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div></div>
          )}
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3" dir="rtl">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> 
            گزینه‌های انتخابی
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              ({formData.optionGroups.length.toLocaleString("fa-IR")} / {MAX_OPTION_GROUPS.toLocaleString("fa-IR")})
            </span>
          </h2>
        </div>
        
        <div className="space-y-6" dir="rtl">
          {formData.optionGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-gray-50/50 dark:bg-[#1A0F0C] p-5 rounded-2xl border border-gray-100 dark:border-[#3c2317] transition-all">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#8C7A6B] dark:text-[#8C7A6B] !text-right">عنوان گزینه‌ها (نمایش به مشتری)</label>
                    <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
                      {group.options.length.toLocaleString("fa-IR")} / {MAX_OPTIONS_PER_GROUP.toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="مثال: نوع آسیاب" 
                    value={group.title} 
                    maxLength={60}
                    dir="rtl"
                    onChange={(e) => updateOptionGroupTitle(groupIdx, e.target.value)} 
                    className="w-full h-12 bg-white dark:bg-[#231511] border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm font-bold !text-right text-[#2C1E16] dark:text-white focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all" 
                  />
                </div>
                <button type="button" onClick={() => removeOptionGroup(groupIdx)} className="mt-5 p-3 text-red-400 hover:text-red-500 bg-white hover:bg-red-50 dark:bg-[#231511] dark:hover:bg-red-500/10 border border-gray-200 dark:border-[#3c2317] dark:hover:border-red-500/20 rounded-xl transition-all" title="حذف کل این گروه">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  {group.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center bg-white dark:bg-[#231511] border border-gray-200 dark:border-[#3c2317] rounded-xl overflow-hidden focus-within:border-[#C68E58] dark:focus-within:border-[#C68E58] transition-all">
                      <input 
                        type="text" 
                        placeholder="نام گزینه" 
                        value={opt} 
                        maxLength={40}
                        dir="rtl"
                        onChange={(e) => updateOption(groupIdx, optIdx, e.target.value)} 
                        className="w-32 sm:w-40 h-10 px-3 text-sm !text-right font-medium bg-transparent outline-none text-[#2C1E16] dark:text-[#EAE0D5]" 
                      />
                      <button type="button" onClick={() => removeOption(groupIdx, optIdx)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-r border-gray-100 dark:border-[#3c2317]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {group.options.length < MAX_OPTIONS_PER_GROUP && (
                  <div className="flex justify-start">
                    <button type="button" onClick={() => addOptionToGroup(groupIdx)} className="h-10 px-4 text-xs font-bold text-[#C68E58] dark:text-[#C68E58] bg-white dark:bg-[#231511] border border-dashed border-gray-300 dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl flex items-center gap-1 transition-all">
                      افزودن گزینه <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {formData.optionGroups.length === 0 && (
            <div className="text-center py-6 bg-gray-50/50 dark:bg-[#1A0F0C] border border-dashed border-gray-200 dark:border-[#3c2317] rounded-2xl">
              <ListChecks className="w-8 h-8 text-gray-300 dark:text-[#6A5A4F] mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-400 dark:text-[#6A5A4F]">هیچ گزینه انتخابی برای این محصول تعریف نشده است.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors flex-row-reverse">
          {formData.specs.length < MAX_SPECS ? (
            <button type="button" onClick={() => addArrayItem('specs')} className="text-[#C68E58] dark:text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 transition-colors bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-xl border border-transparent hover:border-[#C68E58]/20">
              سطر جدید <Plus className="w-4 h-4" /> 
            </button>
          ) : (
            <div></div>
          )}
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3" dir="rtl">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> 
            سایر مشخصات فنی
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              ({formData.specs.length.toLocaleString("fa-IR")} / {MAX_SPECS.toLocaleString("fa-IR")})
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" dir="rtl">
          {formData.specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 group bg-gray-50/50 dark:bg-[#1A0F0C] p-2 rounded-2xl border border-gray-100 dark:border-[#3c2317] focus-within:border-[#C68E58] dark:focus-within:border-[#C68E58] transition-all">
              <input 
                type="text" 
                placeholder="نام ویژگی (مثال: وزن)" 
                value={spec.key} 
                maxLength={60}
                dir="rtl"
                onChange={(e) => updateArrayItem('specs', index, "key", e.target.value)} 
                className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-gray-200 dark:border-[#3c2317]" 
              />
              <input 
                type="text" 
                placeholder="مقدار (مثال: ۲۵۰ گرم)" 
                value={spec.value} 
                maxLength={120}
                dir="rtl"
                onChange={(e) => updateArrayItem('specs', index, "value", e.target.value)} 
                className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#2C1E16] dark:text-white outline-none" 
              />
              <button type="button" onClick={() => removeArrayItem('specs', index)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-[#231511] rounded-xl transition-all shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}