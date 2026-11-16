// app/admin/products/edit/components/sidebar/CategoryBrandSection.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductFormData } from "../../types";
import { CategoryApi, BrandApi } from "../../../api";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function CategoryBrandSection({ formData, setFormData }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        setIsLoading(true);
        const [catData, brandData] = await Promise.all([
          CategoryApi.getAll().catch(() => ({ items: [] })),
          BrandApi.getAll().catch(() => ({ items: [] }))
        ]);

        // 🚀 FIXED: استخراج امن آرایه‌ها برای جلوگیری از ارور map is not a function
        const safeCats = Array.isArray(catData) ? catData : (catData?.items || catData?.data || []);
        const safeBrands = Array.isArray(brandData) ? brandData : (brandData?.items || brandData?.data || []);

        setCategories(safeCats);
        setBrands(safeBrands);
      } catch (error) {
        console.error("Failed to load options", error);
        setCategories([]);
        setBrands([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelectOptions();
  }, []);

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none space-y-6">
      <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4">
        <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> دسته‌بندی و برند
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <div className="w-6 h-6 border-2 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">دسته‌بندی محصول</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white outline-none focus:border-[#C68E58] transition-colors appearance-none text-right"
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categories.map((c) => (
                <option key={c.categoryId || c.id} value={c.categoryId?.toString() || c.id?.toString()}>
                  {c.categoryName || c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">برند محصول</label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white outline-none focus:border-[#C68E58] transition-colors appearance-none text-right"
            >
              <option value="">انتخاب برند... (اختیاری)</option>
              {brands.map((b) => (
                <option key={b.brandId || b.id} value={b.brandId?.toString() || b.id?.toString()}>
                  {b.brandName || b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}