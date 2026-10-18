// app/admin/brands/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { UIBrand } from "./types";
import { BrandGroup } from "./components/BrandGroup";
import { BrandModal } from "./components/BrandModal";
import { BrandApi } from "./api"; 
import { ProductApi } from "../products/api"; // 🚀 Added ProductApi to fetch product counts

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<UIBrand[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["all"]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<UIBrand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      
      // 🚀 Fetch both brands and products at the same time
      const [brandsData, productsData] = await Promise.all([
        BrandApi.getAll(),
        ProductApi.getAll().catch(() => []) // Fallback to empty array if products fail to load
      ]);

      const mappedBrands: UIBrand[] = brandsData.map(b => {
        // 🚀 Count products matching this brand ID or Name
        const matchingProductsCount = productsData.filter((p: any) => 
          p.brandId === b.brandId || p.BrandId === b.brandId || 
          p.brand === b.brandName || p.Brand === b.brandName ||
          p.brandName === b.brandName || p.BrandName === b.brandName
        ).length;

        return {
          id: b.brandId.toString(),
          name: b.brandName,
          category: "all", 
          image: BrandApi.getImageUrl(b.mainImageUrl),
          productCount: matchingProductsCount, // 🚀 Dynamically calculated count!
        };
      });
      
      setBrands(mappedBrands);
    } catch (error) {
      console.error("Failed to load brands:", error);
      alert("خطا در دریافت لیست برندها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.category)));
  }, [brands]);

  const toggleExpand = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleOpenModal = (brand?: UIBrand) => {
    setEditingBrand(brand || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("آیا از حذف این برند اطمینان دارید؟")) {
      try {
        await BrandApi.delete(Number(id));
        setBrands(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        console.error("Failed to delete brand:", error);
        alert("خطا در حذف برند.");
      }
    }
  };

  const handleModalSubmit = async (data: { name: string; file: File | null }) => {
    try {
      const formData = new FormData();
      formData.append("BrandName", data.name);
      if (data.file) formData.append("File", data.file);

      if (editingBrand) {
        // Only enforce file requirement if no existing image is present
        if (!data.file && !editingBrand.image) {
          alert("لطفاً یک تصویر انتخاب کنید.");
          return;
        }
        await BrandApi.update(Number(editingBrand.id), formData);
      } else {
        if (!data.file) {
          alert("برای ایجاد برند جدید، تصویر الزامی است.");
          return;
        }
        await BrandApi.create(formData);
      }
      
      setIsModalOpen(false);
      fetchBrands(); 
    } catch (error: any) {
      console.error("Submit Error:", error);
      alert(error.message || "خطا در ذخیره برند.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        در حال بارگذاری برندها...
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        .strict-persian-input {
          text-align: right !important;
          direction: rtl !important;
        }
        .strict-persian-input::placeholder {
          text-align: right !important;
          direction: rtl !important;
        }
      `}} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">مدیریت برندها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و مدیریت برندهای مختلف</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن برند جدید
        </button>
      </div>

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {uniqueCategories.length > 0 ? uniqueCategories.map(cat => {
            const groupBrands = brands.filter(b => b.category === cat);
            return (
              <BrandGroup 
                key={cat}
                categoryName={cat}
                brands={groupBrands}
                isExpanded={expandedGroups.includes(cat)}
                onToggleExpand={toggleExpand}
                onAddBrand={() => handleOpenModal()}
                onEditBrand={brand => handleOpenModal(brand)}
                onDeleteBrand={handleDelete}
              />
            );
          }) : (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold flex flex-col items-center gap-3">
               هنوز هیچ برندی ثبت نشده است.
            </div>
          )}
        </div>
      </div>

      <BrandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBrand={editingBrand}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}