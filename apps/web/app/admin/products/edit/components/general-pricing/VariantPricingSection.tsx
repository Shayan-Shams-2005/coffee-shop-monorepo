// app/admin/products/edit/components/general-pricing/VariantPricingSection.tsx
"use client";

import { Percent, Clock, Plus, Trash2, X, ListChecks } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
// 🚀 اصلاح شد: مسیر درست برای رسیدن به پوشه edit
import { ProductFormData, ProductOption } from "../../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  isDiscountActive: boolean;
}

const MAX_OPTIONS_PER_GROUP = 10;
const MAX_OPTION_GROUPS = 5;
const OPTION_GROUP_TITLE_LIMIT = 40;
const OPTION_NAME_LIMIT = 40;

export function VariantPricingSection({ formData, setFormData, isDiscountActive }: Props) {
  const updateOptionGroupTitle = (index: number, title: string) => {
    setFormData(prev => ({ ...prev, optionGroups: prev.optionGroups.map((g, i) => i === index ? { ...g, title } : g) }));
  };

  const addOptionToGroup = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((g, i) => {
        if (i === groupIndex && g.options.length < MAX_OPTIONS_PER_GROUP) {
          const lastOption = g.options.length > 0 ? g.options[g.options.length - 1] : null;
          return {
            ...g,
            options: [...g.options, {
              name: "",
              price: lastOption ? (lastOption.price || 0) : (prev.basePrice || 0),
              stock: lastOption ? (lastOption.stock || 0) : (prev.stock || 0),
              hasOffer: lastOption ? lastOption.hasOffer : isDiscountActive,
              salePrice: lastOption ? (lastOption.salePrice || 0) : (isDiscountActive ? prev.salePrice : 0),
              offerEndDate: lastOption ? lastOption.offerEndDate : (isDiscountActive ? prev.offerEndDate : undefined)
            }]
          };
        }
        return g;
      })
    }));
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

  const handleVariantNumberChange = (groupIndex: number, optionIndex: number, field: "price" | "stock" | "salePrice", value: string) => {
    if (value === "") {
      updateOption(groupIndex, optionIndex, field, 0);
      return;
    }
    const englishValue = value.replace(/[۰-۹]/g, (w) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(w)] || w);
    let numValue = parseInt(englishValue.replace(/\D/g, ""), 10) || 0;
    if (field === "price" || field === "salePrice") numValue = Math.min(numValue, 1000000000000000);
    else if (field === "stock") numValue = Math.min(numValue, 1000000000);
    updateOption(groupIndex, optionIndex, field, numValue);
  };

  const toggleOffer = (groupIndex: number, optionIndex: number, currentState: boolean) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((g, i) => i === groupIndex
        ? { ...g, options: g.options.map((o, j) => j === optionIndex
            ? { ...o, hasOffer: !currentState, salePrice: !currentState ? o.salePrice : 0, offerEndDate: !currentState ? o.offerEndDate : undefined }
            : o) } : g
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
    setFormData(prev => ({
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
          }] : prev.optionGroups
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-[#8C7A6B]">مدیریت تنوع‌های محصول</span>
        {((formData.optionGroups?.length || 0) < MAX_OPTION_GROUPS) && (
          <button type="button" onClick={addOptionGroup} className="text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#EAE0D5] text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-[#231511] px-3 py-1.5 rounded-xl border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3c2317]">
            افزودن گروه جدید <Plus className="w-4 h-4" />
          </button>
        )}
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
                  maxLength={OPTION_GROUP_TITLE_LIMIT}
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
                        maxLength={OPTION_NAME_LIMIT}
                        onChange={(e) => updateOption(groupIdx, optIdx, "name", e.target.value)}
                        className="w-full h-10 px-3 text-sm !text-right font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]"
                      />
                    </div>

                    <div className="flex-1 w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 block">قیمت اصلی (تومان)</label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="۰"
                        value={opt.price ? opt.price.toLocaleString("fa-IR") : ""}
                        maxLength={25}
                        onChange={(e) => handleVariantNumberChange(groupIdx, optIdx, "price", e.target.value)}
                        className="w-full h-10 px-3 text-sm !text-left font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]"
                      />
                    </div>

                    <div className="w-full sm:w-24">
                      <label className="text-[10px] font-bold text-[#8C7A6B] mb-1.5 block">موجودی</label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="۰"
                        value={opt.stock ? opt.stock.toLocaleString("fa-IR") : ""}
                        maxLength={15}
                        onChange={(e) => handleVariantNumberChange(groupIdx, optIdx, "stock", e.target.value)}
                        className="w-full h-10 px-3 text-sm !text-left font-medium bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-lg outline-none text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58]"
                      />
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
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="۰"
                          value={opt.salePrice ? opt.salePrice.toLocaleString("fa-IR") : ""}
                          maxLength={25}
                          onChange={(e) => handleVariantNumberChange(groupIdx, optIdx, "salePrice", e.target.value)}
                          className="w-full h-10 px-3 text-sm !text-left font-bold bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-lg outline-none text-rose-600 dark:text-rose-400 focus:border-rose-400"
                        />
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
            <p className="text-sm font-medium text-[#8C7A6B]">هیچ تنوعی برای این محصول تعریف نشده است.</p>
            <button type="button" onClick={addOptionGroup} className="mt-4 px-4 py-2 bg-[#C68E58] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#A87242] transition-colors">
              ایجاد اولین تنوع
            </button>
          </div>
        )}
      </div>
    </div>
  );
}