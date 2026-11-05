// app/admin/products/edit/components/ProductGeneralPricing.tsx
"use client";

import { useState, useEffect } from "react";
// 🚀 FIX: ایمپورت دقیق از فایل تایپِ پوشه edit
import { ProductFormData } from "../types"; 
import { GeneralInfoSection } from "./general-pricing/GeneralInfoSection";
import { SimplePricingSection } from "./general-pricing/SimplePricingSection";
import { VariantPricingSection } from "./general-pricing/VariantPricingSection";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductGeneralPricing({ formData, setFormData }: Props) {
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
    <div className="space-y-6 lg:space-y-8">
      <GeneralInfoSection formData={formData} setFormData={setFormData} />

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 mb-6">
          <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> قیمت‌گذاری و موجودی
          </h2>
          
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

        {pricingType === "simple" ? (
          <SimplePricingSection 
            formData={formData} 
            setFormData={setFormData} 
            isDiscountActive={isDiscountActive} 
            setIsDiscountActive={setIsDiscountActive} 
            discountPercent={discountPercent} 
          />
        ) : (
          <VariantPricingSection 
            formData={formData} 
            setFormData={setFormData} 
            isDiscountActive={isDiscountActive} 
          />
        )}
      </div>
    </div>
  );
}