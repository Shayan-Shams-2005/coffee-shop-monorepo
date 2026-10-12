// app/admin/products/edit/components/ProductVariantSpecs.tsx
"use client";

import { Plus, Trash2, X, ListChecks, Percent, Clock } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { ProductFormData, ProductOption } from "../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const MAX_OPTIONS_PER_GROUP = 10;
const MAX_OPTION_GROUPS = 5;
const MAX_KEY_FEATURES = 10;
const MAX_SPECS = 30;

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
      <OptionGroupsSection formData={formData} setFormData={setFormData} />
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
            <input type="text" placeholder="مثال: نوع قهوه" value={kf.key} maxLength={40} dir="rtl" onChange={(e) => updateArrayItem('keyFeatures', index, "key", e.target.value)} className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-[#E3C3A4]/60 dark:border-[#3c2317]" />
            <input type="text" placeholder="مثال: ۱۰۰٪ عربیکا" value={kf.value} maxLength={80} dir="rtl" onChange={(e) => updateArrayItem('keyFeatures', index, "value", e.target.value)} className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none" />
            <button type="button" onClick={() => removeArrayItem('keyFeatures', index)} className="p-2 text-[#8C7A6B] hover:text-rose-500 hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 2. OPTION GROUPS SECTION (Reverted to Free Text Inputs)
// ============================================================================

function OptionGroupsSection({ formData, setFormData }: Props) {
  const currentCount = formData.optionGroups?.length || 0;

  const updateOptionGroupTitle = (index: number, title: string) => {
    setFormData(prev => ({ ...prev, optionGroups: prev.optionGroups.map((g, i) => i === index ? { ...g, title } : g) }));
  };
  
  const addOptionToGroup = (groupIndex: number) => {
    setFormData(prev => {
      const isDiscountActive = prev.salePrice > 0 && prev.salePrice < prev.basePrice;
      
      return { 
        ...prev, 
        optionGroups: prev.optionGroups.map((g, i) => 
          (i === groupIndex && g.options.length < MAX_OPTIONS_PER_GROUP) 
            ? { 
                ...g, 
                options: [...g.options, { 
                  name: "", 
                  price: prev.basePrice || 0, 
                  stock: prev.stock || 0, 
                  hasOffer: isDiscountActive, 
                  salePrice: isDiscountActive ? prev.salePrice : 0,
                  offerEndDate: isDiscountActive ? prev.offerEndDate : undefined
                }] 
              } 
            : g
        ) 
      };
    });
  };

  const updateOption = (groupIndex: number, optionIndex: number, field: keyof ProductOption, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      optionGroups: prev.optionGroups.map((g, i) => i === groupIndex 
        ? { ...g, options: g.options.map((o, j) => j === optionIndex ? { ...o, [field]: value } : o) } 
        : g
      ) 
    }));
  };

  const toggleOffer = (groupIndex: number, optionIndex: number, currentState: boolean) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((g, i) => i === groupIndex 
        ? { ...g, options: g.options.map((o, j) => j === optionIndex 
            ? { ...o, hasOffer: !currentState, salePrice: !currentState ? o.salePrice : 0, offerEndDate: !currentState ? o.offerEndDate : undefined } 
            : o) } 
        : g
      )
    }));
  }

  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData(prev => ({ ...prev, optionGroups: prev.optionGroups.map((g, i) => i === groupIndex ? { ...g, options: g.options.filter((_, j) => j !== optionIndex) } : g) }));
  };

  const removeOptionGroup = (groupIndex: number) => {
    setFormData(prev => ({ ...prev, optionGroups: prev.optionGroups.filter((_, i) => i !== groupIndex) }));
  };
  
  const addOptionGroup = () => {
    setFormData(prev => {
      const isDiscountActive = prev.salePrice > 0 && prev.salePrice < prev.basePrice;
      
      return { 
        ...prev, 
        optionGroups: prev.optionGroups.length < MAX_OPTION_GROUPS 
          ? [...prev.optionGroups, { 
              title: "", 
              options: [{ 
                name: "", 
                price: prev.basePrice || 0, 
                stock: prev.stock || 0, 
                hasOffer: isDiscountActive, 
                salePrice: isDiscountActive ? prev.salePrice : 0,
                offerEndDate: isDiscountActive ? prev.offerEndDate : undefined
              }] 
            }] 
          : prev.optionGroups 
      };
    });
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <div className="flex justify-between items-center border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 flex-row-reverse">
        {currentCount < MAX_OPTION_GROUPS && (
          <button type="button" onClick={addOptionGroup} className="text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#EAE0D5] text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-[#231511] px-3 py-1.5 rounded-xl border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3c2317]">
             افزودن گروه <Plus className="w-4 h-4" />
          </button>
        )}
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3" dir="rtl">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> 
          گزینه‌های انتخابی (تنوع محصول)
          <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">{currentCount} / {MAX_OPTION_GROUPS}</span>
        </h2>
      </div>
      
      <div className="space-y-6" dir="rtl">
        {(formData.optionGroups || []).map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white dark:bg-[#231511] p-5 rounded-2xl border border-[#E3C3A4]/60 dark:border-[#3c2317]">
            
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#E3C3A4]/30 dark:border-[#3c2317]">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#8C7A6B] !text-right">عنوان گروه (مثال: نوع رست قهوه)</label>
                  <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">{group.options.length} / {MAX_OPTIONS_PER_GROUP}</span>
                </div>
                <input 
                  type="text" 
                  placeholder="مثال: نوع رست" 
                  value={group.title} 
                  maxLength={60} 
                  dir="rtl" 
                  onChange={(e) => updateOptionGroupTitle(groupIdx, e.target.value)} 
                  className="w-full h-12 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 text-sm font-bold !text-right text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] outline-none" 
                />
              </div>
              <button type="button" onClick={() => removeOptionGroup(groupIdx)} className="mt-6 p-3 text-red-400 hover:text-red-500 bg-[#FCF9F5] hover:bg-red-50 dark:bg-[#1A0F0C] dark:hover:bg-red-500/10 border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl" title="حذف کل این گروه">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {group.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex flex-col gap-3 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-3 sm:p-4 focus-within:border-[#C68E58] transition-all">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 block">نام گزینه</label>
                      <input 
                        type="text" 
                        placeholder="مثال: دارک رست" 
                        value={opt.name} 
                        onChange={(e) => updateOption(groupIdx, optIdx, "name", e.target.value)} 
                        className="w-full h-10 px-3 text-sm !text-right font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]" 
                      />
                    </div>

                    <div className="flex-1 w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 block">قیمت اصلی (تومان)</label>
                      <input type="number" dir="ltr" placeholder="0" value={opt.price || ""} onChange={(e) => updateOption(groupIdx, optIdx, "price", parseInt(e.target.value) || 0)} className="w-full h-10 px-3 text-sm font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]" />
                    </div>

                    <div className="w-full sm:w-24">
                      <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 block">موجودی</label>
                      <input type="number" dir="ltr" placeholder="0" value={opt.stock ?? ""} onChange={(e) => updateOption(groupIdx, optIdx, "stock", parseInt(e.target.value) || 0)} className="w-full h-10 px-3 text-sm font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]" />
                    </div>

                    <div className="flex items-center gap-2 mt-2 sm:mt-5 w-full sm:w-auto">
                      <button type="button" onClick={() => toggleOffer(groupIdx, optIdx, opt.hasOffer)} className={`flex-1 sm:flex-none h-10 px-3 flex items-center justify-center gap-1 rounded-lg text-xs font-bold transition-all border ${opt.hasOffer ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" : "bg-white text-[#8C7A6B] border-[#E3C3A4]/40 hover:border-[#C68E58]/50 dark:bg-[#231511] dark:border-[#3c2317]"}`}>
                        <Percent className="w-3 h-3" /> تخفیف
                      </button>
                      <button type="button" onClick={() => removeOption(groupIdx, optIdx)} className="w-10 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg bg-white sm:bg-transparent dark:bg-[#231511] border border-[#E3C3A4]/40 sm:border-transparent dark:border-[#3c2317]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {opt.hasOffer && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-[#231511] p-3 rounded-lg border border-rose-100 dark:border-rose-500/10 animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1 w-full sm:w-auto">
                        <label className="text-[10px] font-bold text-rose-500 dark:text-rose-400 mb-1.5 block">قیمت با تخفیف (تومان)</label>
                        <input type="number" dir="ltr" placeholder="0" value={opt.salePrice || ""} onChange={(e) => updateOption(groupIdx, optIdx, "salePrice", parseInt(e.target.value) || 0)} className="w-full h-10 px-3 text-sm font-bold bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-lg outline-none text-rose-600 dark:text-rose-400 focus:border-rose-400" />
                      </div>
                      
                      <div className="flex-1 w-full sm:w-auto relative">
                        <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> پایان تخفیف</label>
                        <DatePicker
                          value={opt.offerEndDate}
                          onChange={(date) => updateOption(groupIdx, optIdx, "offerEndDate", date as unknown as Date)}
                          calendar={persian}
                          locale={persian_fa}
                          className="custom-calendar"
                          format="YYYY/MM/DD - HH:mm:ss"
                          plugins={[<TimePicker position="bottom" key="time-picker" />]}
                          containerClassName="w-full"
                          inputClass="w-full h-10 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg px-3 !text-left text-xs font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none dir-ltr"
                          placeholder="انتخاب تاریخ و ساعت..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {group.options.length < MAX_OPTIONS_PER_GROUP && (
                <div className="flex justify-start mt-2">
                  <button type="button" onClick={() => addOptionToGroup(groupIdx)} className="h-10 px-4 text-xs font-bold text-[#C68E58] bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-dashed border-[#C68E58]/50 hover:border-[#C68E58] rounded-xl flex items-center gap-1 transition-all">
                    افزودن گزینه <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {(!formData.optionGroups || formData.optionGroups.length === 0) && (
          <div className="text-center py-8 bg-white dark:bg-[#231511] border border-dashed border-[#E3C3A4]/80 dark:border-[#3c2317] rounded-2xl">
            <ListChecks className="w-10 h-10 text-[#8C7A6B] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#8C7A6B]">هیچ گزینه انتخابی برای این محصول تعریف نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. TECHNICAL SPECS SECTION
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
            <input type="text" placeholder="نام ویژگی (مثال: وزن)" value={spec.key} maxLength={60} dir="rtl" onChange={(e) => updateArrayItem('specs', index, "key", e.target.value)} className="w-5/12 sm:w-2/5 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-bold text-[#4A3022] dark:text-[#D4A373] outline-none border-l border-[#E3C3A4]/60 dark:border-[#3c2317]" />
            <input type="text" placeholder="مقدار (مثال: ۲۵۰ گرم)" value={spec.value} maxLength={120} dir="rtl" onChange={(e) => updateArrayItem('specs', index, "value", e.target.value)} className="flex-1 min-w-0 h-10 bg-transparent px-2.5 !text-right text-xs sm:text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] outline-none" />
            <button type="button" onClick={() => removeArrayItem('specs', index)} className="p-2 text-[#8C7A6B] hover:text-rose-500 hover:bg-[#FCF9F5] dark:hover:bg-[#1A0F0C] rounded-xl shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}