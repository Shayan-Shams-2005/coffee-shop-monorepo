// app/admin/products/edit/page.tsx
"use client";

import { useState } from "react";
import { ProductFormData } from "./types";
import { ProductGeneralPricing } from "./components/ProductGeneralPricing";
import { ProductVariantSpecs } from "./components/ProductVariantSpecs";
import { ProductMediaSidebar } from "./components/ProductMediaSideBar";

import { INITIAL_PRODUCT_DATA } from "./constants";
import { EditProductHeader } from "./components/EditProductHeader";
import { DatePickerStyles } from "./components/DatePickerStyles";

export default function AdminProductEditPage() {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_PRODUCT_DATA);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تغییرات محصول با موفقیت ذخیره شد.");
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500 pb-20 text-[#4A3022] dark:text-[#EAE0D5]"
        dir="rtl"
      >
        <EditProductHeader productTitle={formData.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <ProductGeneralPricing formData={formData} setFormData={setFormData} />
            <ProductVariantSpecs formData={formData} setFormData={setFormData} />
          </div>
          <div className="space-y-6 lg:space-y-8">
            <ProductMediaSidebar formData={formData} setFormData={setFormData} />
          </div>
        </div>
      </form>

      <DatePickerStyles />
    </>
  );
}