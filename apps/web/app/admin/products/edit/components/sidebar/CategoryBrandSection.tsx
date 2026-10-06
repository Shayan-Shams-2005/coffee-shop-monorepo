// app/admin/products/edit/components/sidebar/CategoryBrandSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Layers, Tag } from "lucide-react";
import { ProductFormData } from "../../types";
import { CategoryApi, BrandApi } from "../../../api";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function CategoryBrandSection({ formData, setFormData }: Props) {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  const [activeModal, setActiveModal] = useState<"category" | "brand" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const catData = await CategoryApi.getAll();
        const brandData = await BrandApi.getAll();
        setCategories(catData.map((c: any) => ({ id: (c.id || c.categoryId).toString(), name: c.name || c.categoryName || c.title })));
        setBrands(brandData.map((b: any) => ({ id: (b.id || b.brandId).toString(), name: b.name || b.brandName || b.title })));
      } catch (error) {
        console.error("Failed to load options", error);
      }
    };
    fetchSelectOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewItem = async () => {
    if (!newItemName.trim()) return;
    setIsSubmitting(true);
    try {
      if (activeModal === "category") {
        const createdData = await CategoryApi.create(newItemName.trim());
        const realId = (createdData.id || createdData.categoryId).toString();
        const realName = createdData.name || createdData.categoryName || newItemName.trim();
        setCategories(prev => [...prev, { id: realId, name: realName }]);
        setFormData(prev => ({ ...prev, category: realId }));
      } else if (activeModal === "brand") {
        const createdData = await BrandApi.create(newItemName.trim());
        const realId = (createdData.id || createdData.brandId).toString();
        const realName = createdData.name || createdData.brandName || newItemName.trim();
        setBrands(prev => [...prev, { id: realId, name: realName }]);
        setFormData(prev => ({ ...prev, brand: realId }));
      }
      closeModal();
    } catch (error: any) {
      alert(`Error from database: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewItemName("");
  };

  return (
    <>
      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 transition-colors" dir="rtl">
          <Layers className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> دسته‌بندی و برند
        </h2>
        
        <div className="space-y-5" dir="rtl">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8C7A6B]" /> دسته‌بندی
              </label>
              <button type="button" onClick={() => setActiveModal("category")} className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> افزودن دسته‌بندی
              </button>
            </div>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer appearance-none">
              <option value="" disabled>انتخاب کنید...</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#8C7A6B]" /> برند
              </label>
              <button type="button" onClick={() => setActiveModal("brand")} className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> افزودن برند
              </button>
            </div>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer appearance-none">
              <option value="" disabled>انتخاب کنید...</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <h3 className="font-bold text-[#4A3022] dark:text-white text-lg mb-5 text-right">
              {activeModal === "category" ? "افزودن دسته‌بندی جدید" : "افزودن برند جدید"}
            </h3>
            <input 
              type="text" 
              dir="rtl" 
              placeholder={activeModal === "category" ? "مثال: تجهیزات جانبی" : "مثال: نسپرسو"} 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewItem()} 
              className="w-full h-12 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] outline-none transition-colors mb-6 !text-right" 
              autoFocus 
              disabled={isSubmitting}
            />
            <div className="flex gap-3">
              <button type="button" onClick={closeModal} disabled={isSubmitting} className="flex-1 h-12 bg-white dark:bg-[#231511] hover:bg-[#F5EFE6] dark:hover:bg-[#3c2317] border border-[#E3C3A4]/60 dark:border-transparent text-[#4A3022] dark:text-[#EAE0D5] rounded-xl font-bold transition-colors disabled:opacity-50">انصراف</button>
              <button type="button" onClick={handleAddNewItem} disabled={!newItemName.trim() || isSubmitting} className="flex-1 h-12 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] disabled:opacity-50 text-white rounded-xl font-bold transition-colors">{isSubmitting ? "در حال ثبت..." : "ثبت و انتخاب"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}