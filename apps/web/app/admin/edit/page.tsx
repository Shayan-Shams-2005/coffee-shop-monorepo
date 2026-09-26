"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, ArrowRight } from "lucide-react";
import { ProductFormData } from "../../types/admin";
import { ProductGeneralPricing } from "../../admin/product-edit/ProductGenetalPricing";
import { ProductVariantSpecs } from "../../admin/product-edit/ProductVariantSpecs";
import { ProductMediaSidebar } from "../../admin/product-edit/ProductMediaSideBar";

export default function AdminProductEditPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "قهوه ملو مدل کنیا ۱۰۰ درصد عربیکا (۲۵۰ گرمی)",
    description: "این قهوه با اسیدیته شفاف و نت‌های طعمی شکلات و مرکبات، بهترین انتخاب برای قهوه‌های دمی است.",
    category: "coffee-beans",
    brand: "neo-roasters",
    basePrice: 1450000,
    salePrice: 1150000,
    offerEndDate: new Date(),
    mainImage: "/images/product-1.png",
    gallery: ["/images/gallery-1.png", "/images/gallery-2.png"],
    keyFeatures: [
      { key: "نوع قهوه", value: "۱۰۰٪ عربیکا" },
      { key: "درجه برشتگی", value: "متوسط" },
      { key: "درجه تلخی", value: "نسبتاً کم" },
      { key: "کافئین", value: "متوسط" },
      { key: "رایحه", value: "زیاد" },
      { key: "طعم یادها", value: "مرکبات، کاکائو، کارامل" },
    ],
    specs: [
      { key: "خاستگاه", value: "کنیا" },
      { key: "ارتفاع کشت", value: "۱۷۰۰ متر" },
      { key: "وزن", value: "۲۵۰ گرم" },
    ],
    optionGroups: [
      {
        title: "انتخاب نوع آسیاب",
        options: ["دانه قهوه", "اسپرسو ساز", "موکاپات", "فرنچ پرس", "قهوه ساز فیلتری"],
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تغییرات محصول با موفقیت ذخیره شد.");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#231511] p-4 sm:p-5 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none sticky top-4 z-30 transition-all">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-3 bg-gray-50 dark:bg-[#1A0F0C] text-gray-500 dark:text-[#EAE0D5] hover:text-[#C68E58] dark:hover:text-[#C68E58] rounded-2xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#3c2317]">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#2C1E16] dark:text-white transition-colors">ویرایش محصول</h1>
              <p className="text-xs font-medium text-[#8C7A6B] dark:text-[#8C7A6B] mt-1 hidden sm:block">{formData.title}</p>
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5">
            <Save className="w-4 h-4" /> ذخیره تغییرات
          </button>
        </div>

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

      {/* DatePicker Custom CSS Override */}
      <style dangerouslySetInnerHTML={{ __html: `
        .rmdp-wrapper { border-radius: 1rem !important; border: 1px solid #F0EBE1 !important; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important; }
        .rmdp-header-values { color: #2C1E16 !important; font-weight: 700 !important; }
        .rmdp-week-day { color: #C68E58 !important; }
        .rmdp-day.rmdp-selected span:not(.highlight) { background-color: #C68E58 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(198, 142, 88, 0.3) !important; }
        .rmdp-day.rmdp-today span { background-color: #FCF9F5 !important; border: 1px solid #C68E58 !important; color: #2C1E16 !important; }
        .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):hover span { background-color: #FCF9F5 !important; color: #C68E58 !important; }
        .rmdp-arrow-container:hover { background-color: #FCF9F5 !important; box-shadow: none !important; }
        .rmdp-arrow { border-color: #8C7A6B !important; }
        .rmdp-time-picker div input { background-color: #fff !important; color: #2C1E16 !important; border: 1px solid #F0EBE1 !important; border-radius: 0.5rem !important; }
        .rmdp-time-picker .rmdp-arrow { border-color: #C68E58 !important; }

        .dark .rmdp-wrapper { background-color: #231511 !important; border: 1px solid #3c2317 !important; color: #EAE0D5 !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important; }
        .dark .rmdp-header-values { color: #EAE0D5 !important; }
        .dark .rmdp-day { color: #EAE0D5 !important; }
        .dark .rmdp-day.rmdp-deactive { color: #5A483F !important; }
        .dark .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):hover span { background-color: #3c2317 !important; color: #EAE0D5 !important; }
        .dark .rmdp-day.rmdp-selected span:not(.highlight) { background-color: #C68E58 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(198, 142, 88, 0.3) !important; }
        .dark .rmdp-day.rmdp-today span { background-color: #1A0F0C !important; border: 1px solid #C68E58 !important; color: #EAE0D5 !important; }
        .dark .rmdp-arrow { border-color: #EAE0D5 !important; }
        .dark .rmdp-arrow-container:hover { background-color: #3c2317 !important; }
        .dark .rmdp-panel-body li { background-color: #1A0F0C !important; color: #EAE0D5 !important; }
        .dark .rmdp-time-picker div input { background-color: #1A0F0C !important; color: #EAE0D5 !important; border: 1px solid #3c2317 !important; }
      `}} />
    </>
  );
}