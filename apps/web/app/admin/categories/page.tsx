// app/admin/categories/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Category, initialCategories } from "./types";
import { CategoryNode } from "./components/CategoryNode";
import { CategoryModal } from "./components/CategoryModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expandedCats, setExpandedCats] = useState<number[]>([1]); 
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const mainCategories = useMemo(() => categories.filter(c => c.parentId === null), [categories]);

  const toggleExpand = (id: number) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const getAllChildrenIds = (parentId: number): number[] => {
      const children = categories.filter(c => c.parentId === parentId);
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = [...ids, ...getAllChildrenIds(c.id)];
      });
      return ids;
    };

    if (confirm("آیا از حذف این دسته‌بندی و تمام زیرمجموعه‌های آن اطمینان دارید؟")) {
      const idsToDelete = [id, ...getAllChildrenIds(id)];
      setCategories(prev => prev.filter(c => !idsToDelete.includes(c.id)));
    }
  };

  const handleModalSubmit = (data: { name: string; parentId: number | null; imagePreview: string }) => {
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: data.name,
        parentId: data.parentId,
        image: data.imagePreview || c.image
      } : c));
    } else {
      const newCatId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      const newCat: Category = {
        id: newCatId,
        name: data.name,
        parentId: data.parentId,
        image: data.imagePreview || null,
        productCount: 0,
      };
      setCategories([...categories, newCat]);
      
      if (data.parentId && !expandedCats.includes(data.parentId)) {
        setExpandedCats(prev => [...prev, data.parentId!]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">ساختاردهی، ویرایش و افزودن گروه‌های کالایی</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن دسته جدید
        </button>
      </div>

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {mainCategories.map((mainCat) => (
             <div key={mainCat.id} className="border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
                <CategoryNode 
                  category={mainCat}
                  allCategories={categories}
                  expandedCats={expandedCats}
                  onToggleExpand={toggleExpand}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
             </div>
          ))}
          {mainCategories.length === 0 && (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold">
              هنوز هیچ دسته‌بندی ثبت نشده است.
            </div>
          )}
        </div>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        allCategories={categories}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}