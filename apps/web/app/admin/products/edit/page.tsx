// app/admin/products/edit/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGeneralPricing } from "./components/ProductGeneralPricing";
import { ProductVariantSpecs } from "./components/ProductVariantSpecs";
import { ProductMediaSidebar } from "./components/ProductMediaSideBar";
import { EditProductHeader } from "./components/EditProductHeader";
import { useProductForm } from "./hooks/useProductForm"; // 🚀 وارد کردن هوک سفارشی

function ProductEditContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id"); 
  const productId = editId ? Number(editId) : null;
  
  // 🚀 تمام منطق شلوغ و متغیرها حالا فقط در این یک خط خلاصه شده‌اند!
  const { formData, setFormData, isLoading, isSaving, handleSubmit } = useProductForm(productId);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        در حال دریافت اطلاعات محصول...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500 pb-20 text-[#4A3022] dark:text-[#EAE0D5]" dir="rtl">
      
      <EditProductHeader productTitle={formData.title} isSaving={isSaving} isEditMode={!!productId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <ProductGeneralPricing formData={formData} setFormData={setFormData} />
          <ProductVariantSpecs formData={formData} setFormData={setFormData} />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6 lg:space-y-8">
          <ProductMediaSidebar formData={formData} setFormData={setFormData} />
        </div>
      </div>
      
    </form>
  );
}

export default function AdminProductEditPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductEditContent />
    </Suspense>
  );
}