// app/admin/brands/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { UIBrand, initialBrands } from "./types";
import { BrandGroup } from "./components/BrandGroup";
import { BrandModal } from "./components/BrandModal";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<UIBrand[]>(initialBrands);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["coffee", "equipment"]); 
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<UIBrand | null>(null);
  const [defaultCategoryForNew, setDefaultCategoryForNew] = useState<string>("");

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.category)));
  }, [brands]);

  const toggleExpand = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleOpenModal = (brand?: UIBrand, defaultCategory?: string) => {
    setEditingBrand(brand || null);
    setDefaultCategoryForNew(defaultCategory || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(confirm("آیا از حذف این برند اطمینان دارید؟")) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleModalSubmit = (data: { name: string; enName: string; category: string; imagePreview: string }) => {
    if (editingBrand) {
      setBrands(prev => prev.map(b => b.id === editingBrand.id ? {
        ...b,
        name: data.name,
        enName: data.enName,
        category: data.category,
        image: data.imagePreview || b.image
      } : b));
    } else {
      const newBrand: UIBrand = {
        id: `b${Date.now()}`,
        name: data.name,
        enName: data.enName,
        category: data.category,
        image: data.imagePreview || null,
        productCount: 0,
      };
      setBrands([...brands, newBrand]);
      
      // Auto-expand the category if it was closed or newly created
      if (!expandedGroups.includes(data.category)) {
        setExpandedGroups(prev => [...prev, data.category]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* 🚀 Bulletproof global style specifically for these Persian inputs */}
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
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت برندها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و مدیریت گروه‌ها و برندهای مختلف</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن برند جدید
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {uniqueCategories.map(cat => {
            const groupBrands = brands.filter(b => b.category === cat);
            return (
              <BrandGroup 
                key={cat}
                categoryName={cat}
                brands={groupBrands}
                isExpanded={expandedGroups.includes(cat)}
                onToggleExpand={toggleExpand}
                onAddBrand={catName => handleOpenModal(undefined, catName)}
                onEditBrand={brand => handleOpenModal(brand)}
                onDeleteBrand={handleDelete}
              />
            );
          })}
          
          {uniqueCategories.length === 0 && (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold">
              هنوز هیچ برندی ثبت نشده است.
            </div>
          )}
        </div>
      </div>

      <BrandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBrand={editingBrand}
        defaultCategory={defaultCategoryForNew}
        uniqueCategories={uniqueCategories}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}