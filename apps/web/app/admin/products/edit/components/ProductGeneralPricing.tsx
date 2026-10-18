// app/admin/products/edit/components/ProductGeneralPricing.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Percent, Clock, Package, Plus, Minus, Trash2, X, ListChecks } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { ProductFormData, ProductOption } from "../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const TITLE_MAX_LENGTH = 150;
const DESC_MAX_LENGTH = 2000;
const MAX_OPTIONS_PER_GROUP = 10;
const MAX_OPTION_GROUPS = 5;
const OPTION_GROUP_TITLE_LIMIT = 40;
const OPTION_NAME_LIMIT = 40;

export function ProductGeneralPricing({ formData, setFormData }: Props) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <GeneralInfoSection formData={formData} setFormData={setFormData} />
      <PricingAndVariantsSection formData={formData} setFormData={setFormData} />
    </div>
  );
}

// ============================================================================
// 1. GENERAL INFO SECTION (Title & Description)
// ============================================================================

function GeneralInfoSection({ formData, setFormData }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 transition-colors">
        <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> اطلاعات کلی
      </h2>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">عنوان محصول</label>
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              {(formData.title?.length || 0).toLocaleString("fa-IR")} / {TITLE_MAX_LENGTH.toLocaleString("fa-IR")}
            </span>
          </div>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            maxLength={TITLE_MAX_LENGTH}
            className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all" 
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">توضیحات</label>
            <span className="text-xs font-bold text-[#8C7A6B]" dir="ltr">
              {(formData.description?.length || 0).toLocaleString("fa-IR")} / {DESC_MAX_LENGTH.toLocaleString("fa-IR")}
            </span>
          </div>
          
          <div 
            dir="ltr" 
            className="w-full h-[160px] overflow-y-auto bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl focus-within:border-[#C68E58] dark:focus-within:border-[#C68E58] focus-within:ring-4 focus-within:ring-[#C68E58]/10 transition-all custom-scrollbar"
          >
            <textarea 
              ref={textareaRef}
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              maxLength={DESC_MAX_LENGTH}
              dir="rtl"
              className="w-full min-h-full block bg-transparent p-5 text-[#4A3022] dark:text-[#EAE0D5] outline-none resize-none overflow-hidden" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. UNIFIED PRICING & VARIANTS SECTION
// ============================================================================

function PricingAndVariantsSection({ formData, setFormData }: Props) {
  const [pricingType, setPricingType] = useState<"simple" | "variant">(
    formData.optionGroups && formData.optionGroups.length > 0 ? "variant" : "simple"
  );
  const [isDiscountActive, setIsDiscountActive] = useState(false);

  useEffect(() => {
    if (formData.salePrice > 0 && formData.salePrice < formData.basePrice) {
      setIsDiscountActive(true);
    }
  }, [formData.salePrice, formData.basePrice]);

  const discountPercent = (isDiscountActive && formData.basePrice > 0 && formData.salePrice > 0 && formData.salePrice <= formData.basePrice)
    ? Math.round(((formData.basePrice - formData.salePrice) / formData.basePrice) * 100)
    : 0;

  // --- SIMPLE PRODUCT HANDLERS ---
  const handleSimpleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: 0 }));
        return;
    }
    const englishValue = value.replace(/[۰-۹]/g, (w) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(w)] || w);
    let numValue = parseInt(englishValue.replace(/\D/g, ""), 10) || 0;
    
    if (name === "basePrice" || name === "salePrice") numValue = Math.min(numValue, 1000000000000000); 
    else if (name === "stock") numValue = Math.min(numValue, 1000000000); 

    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const incrementStock = () => setFormData((prev) => ({ ...prev, stock: Math.min((Number(prev.stock) || 0) + 1, 1000000000) }));
  const decrementStock = () => setFormData((prev) => ({ ...prev, stock: Math.max(0, (Number(prev.stock) || 0) - 1) }));

  // --- VARIANT PRODUCT HANDLERS ---
  const updateOptionGroupTitle = (index: number, title: string) => {
    setFormData(prev => ({ ...prev, optionGroups: prev.optionGroups.map((g, i) => i === index ? { ...g, title } : g) }));
  };
  
  const addOptionToGroup = (groupIndex: number) => {
    setFormData(prev => ({ 
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
            } : g
      ) 
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

  // --- TYPE SWITCHER HANDLER ---
  const handleTypeSwitch = (type: "simple" | "variant") => {
    if (type === "simple" && formData.optionGroups && formData.optionGroups.length > 0) {
      if (window.confirm("تغییر به محصول ساده باعث حذف تمامی تنوع‌های ایجاد شده می‌شود. آیا مطمئن هستید؟")) {
        setFormData(prev => ({ ...prev, optionGroups: [] }));
        setPricingType("simple");
      }
    } else {
      setPricingType(type);
    }
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all">
      
      {/* SECTION HEADER & TABS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 mb-6">
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> قیمت‌گذاری و موجودی
        </h2>
        
        {/* Toggle Switch */}
        <div className="flex bg-[#E3C3A4]/20 dark:bg-[#3c2317]/40 p-1.5 rounded-2xl w-full xl:w-auto">
          <button 
            type="button" 
            onClick={() => handleTypeSwitch("simple")} 
            className={`flex-1 xl:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${pricingType === "simple" ? "bg-white dark:bg-[#231511] text-[#C68E58] shadow-sm" : "text-[#8C7A6B] hover:text-[#C68E58]"}`}
          >
            محصول ساده
          </button>
          <button 
            type="button" 
            onClick={() => handleTypeSwitch("variant")} 
            className={`flex-1 xl:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${pricingType === "variant" ? "bg-white dark:bg-[#231511] text-[#C68E58] shadow-sm" : "text-[#8C7A6B] hover:text-[#C68E58]"}`}
          >
            محصول متغیر (تنوع)
          </button>
        </div>
      </div>

      {/* ======================= SIMPLE PRODUCT VIEW ======================= */}
      {pricingType === "simple" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-[#8C7A6B]">تنظیمات قیمت اصلی</span>
            <button
              type="button"
              onClick={() => {
                setIsDiscountActive(!isDiscountActive);
                if (isDiscountActive) setFormData(prev => ({ ...prev, salePrice: 0, offerEndDate: undefined }));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                isDiscountActive 
                  ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" 
                  : "bg-white text-[#8C7A6B] border-[#E3C3A4]/60 hover:border-[#C68E58]/50 dark:bg-[#231511] dark:hover:border-[#3c2317]"
              }`}
            >
              <Percent className="w-4 h-4" /> {isDiscountActive ? "تخفیف فعال است" : "فعال‌‌سازی تخفیف"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">قیمت اصلی (تومان)</label>
              <input 
                type="text" 
                name="basePrice" 
                dir="ltr" 
                value={formData.basePrice ? formData.basePrice.toLocaleString("fa-IR") : ""} 
                onChange={handleSimpleNumberChange} 
                maxLength={25}
                className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 !text-left font-black text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all" 
                placeholder="۰"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#8C7A6B]" /> موجودی اولیه
              </label>
              <div className="relative flex items-center group">
                <input 
                  type="text" 
                  name="stock" 
                  value={formData.stock ? formData.stock.toLocaleString("fa-IR") : ""} 
                  onChange={handleSimpleNumberChange} 
                  placeholder="۰" 
                  maxLength={15}
                  className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all !text-left font-medium pr-[4.5rem]" 
                  dir="ltr" 
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl overflow-hidden shadow-sm">
                  <button type="button" onClick={incrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Plus className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-[#E3C3A4]/60 dark:bg-[#3c2317]"></div>
                  <button type="button" onClick={decrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Minus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className={`transition-opacity ${!isDiscountActive ? "hidden" : ""}`}>
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex justify-between items-center">
                قیمت با تخفیف (تومان)
                {isDiscountActive && discountPercent > 0 && (
                  <span className="text-rose-600 bg-rose-50 border border-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-0.5 rounded-lg text-xs font-black">
                    {discountPercent.toLocaleString("fa-IR")}٪
                  </span>
                )}
              </label>
              <input 
                type="text" 
                name="salePrice" 
                dir="ltr" 
                value={formData.salePrice ? formData.salePrice.toLocaleString("fa-IR") : ""} 
                onChange={handleSimpleNumberChange}
                maxLength={25} 
                className="w-full h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-2xl px-5 !text-left font-black text-rose-500 dark:text-rose-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all" 
                placeholder="۰"
              />
            </div>

            <div className={`transition-opacity ${!isDiscountActive ? "hidden" : ""}`}>
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8C7A6B]" /> مهلت پایان تخفیف
              </label>
              <div className="relative">
                <DatePicker
                  value={formData.offerEndDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, offerEndDate: date as unknown as Date }))}
                  calendar={persian}
                  locale={persian_fa}
                  className="custom-calendar"
                  format="YYYY/MM/DD - HH:mm:ss"
                  plugins={[<TimePicker position="bottom" key="time-picker" />]}
                  containerClassName="w-full"
                  inputClass="w-full h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-rose-200 dark:border-rose-500/20 rounded-2xl px-5 !text-left font-medium text-[#4A3022] dark:text-[#EAE0D5] focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder-gray-400 dir-ltr"
                  placeholder="انتخاب تاریخ و ساعت..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= VARIANT PRODUCT VIEW ======================= */}
      {pricingType === "variant" && (
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
      )}

    </div>
  );
}