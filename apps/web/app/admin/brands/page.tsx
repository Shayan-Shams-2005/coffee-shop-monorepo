// app/admin/brands/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { UIBrandGroup, UIBrand } from "./types";
import { BrandGroup } from "./components/BrandGroup";
import { BrandModal } from "./components/BrandModal";
import { BrandGroupModal } from "./components/BrandGroupModal";
import { BrandGroupApi, BrandApi } from "./api"; 
import { ProductApi } from "../products/api"; 

export default function AdminBrandsPage() {
  const [brandGroups, setBrandGroups] = useState<UIBrandGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]); 
  
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<UIBrand | null>(null);
  const [selectedGroupIdForNewBrand, setSelectedGroupIdForNewBrand] = useState<string | null>(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UIBrandGroup | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchBrandsAndGroups = async () => {
    try {
      setIsLoading(true);
      const [groupsData, productsData] = await Promise.all([
        BrandGroupApi.getAll(),
        ProductApi.getAll().catch(() => []) 
      ]);

      const mappedGroups: UIBrandGroup[] = groupsData.map((g: any) => ({
        id: g.brandGroupId.toString(),
        name: g.name,
        slug: g.slug,
        displayOrder: g.displayOrder,
        brands: (g.brands || []).map((b: any) => {
          const matchingProductsCount = productsData.filter((p: any) => 
            p.brandId === b.brandId || p.BrandId === b.brandId || 
            p.brandName === b.brandName || p.BrandName === b.brandName
          ).length;

          return {
            id: b.brandId.toString(),
            name: b.brandName,
            groupId: b.brandGroupId.toString(),
            image: BrandApi.getImageUrl(b.mainImageUrl),
            productCount: matchingProductsCount,
          };
        })
      }));
      
      setBrandGroups(mappedGroups.sort((a, b) => a.displayOrder - b.displayOrder));
      
      const firstGroupId = mappedGroups[0]?.id;
      if (firstGroupId && expandedGroups.length === 0) {
        setExpandedGroups([firstGroupId]);
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
      alert("خطا در دریافت لیست برندها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandsAndGroups();
  }, []);

  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  // --- BRAND HANDLERS ---
  const handleOpenBrandModal = (groupId: string | null, brand?: UIBrand) => {
    setEditingBrand(brand || null);
    setSelectedGroupIdForNewBrand(groupId);
    setIsBrandModalOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if(confirm("آیا از حذف این برند اطمینان دارید؟")) {
      try {
        await BrandApi.delete(Number(id));
        fetchBrandsAndGroups();
      } catch (error: any) {
        alert(error.message || "خطا در حذف برند.");
      }
    }
  };

  const handleBrandModalSubmit = async (data: { name: string; groupId: string; file: File | null }) => {
    try {
      const formData = new FormData();
      formData.append("BrandName", data.name);
      formData.append("BrandGroupId", data.groupId);
      if (data.file) formData.append("File", data.file);

      if (editingBrand) {
        await BrandApi.update(Number(editingBrand.id), formData);
      } else {
        if (!data.file) {
          alert("برای ایجاد برند جدید، تصویر الزامی است.");
          return;
        }
        await BrandApi.create(formData);
      }
      setIsBrandModalOpen(false);
      fetchBrandsAndGroups(); 
    } catch (error: any) {
      alert(error.message || "خطا در ذخیره برند.");
    }
  };

  // --- GROUP HANDLERS ---
  const handleOpenGroupModal = (group?: UIBrandGroup) => {
    setEditingGroup(group || null);
    setIsGroupModalOpen(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if(confirm("آیا از حذف این گروه برند اطمینان دارید؟ توجه کنید که گروه نباید شامل برند باشد.")) {
      try {
        await BrandGroupApi.delete(Number(id));
        fetchBrandsAndGroups();
      } catch (error: any) {
        alert(error.message || "خطا در حذف گروه برند.");
      }
    }
  };

  const handleGroupModalSubmit = async (data: { name: string; displayOrder: number }) => {
    try {
      if (editingGroup) {
        await BrandGroupApi.update(Number(editingGroup.id), data);
      } else {
        await BrandGroupApi.create(data);
      }
      setIsGroupModalOpen(false);
      fetchBrandsAndGroups();
    } catch (error: any) {
      alert(error.message || "خطا در ذخیره گروه برند.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        در حال بارگذاری اطلاعات...
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `.strict-persian-input { text-align: right !important; direction: rtl !important; } .strict-persian-input::placeholder { text-align: right !important; direction: rtl !important; }`}} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">مدیریت برندها و گروه‌ها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">دسته‌بندی و مدیریت برندهای فروشگاه</p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <button 
            onClick={() => handleOpenGroupModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#1A0F0C] text-[#C68E58] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58]/50 px-4 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
          >
            <FolderPlus className="w-5 h-5" /> گروه جدید
          </button>
          <button 
            onClick={() => handleOpenBrandModal(brandGroups[0]?.id || null)}
            disabled={brandGroups.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" /> برند جدید
          </button>
        </div>
      </div>

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {brandGroups.length > 0 ? brandGroups.map(group => (
            <BrandGroup 
              key={group.id}
              group={group}
              isExpanded={expandedGroups.includes(group.id)}
              onToggleExpand={toggleExpand}
              onAddBrand={() => handleOpenBrandModal(group.id)}
              onEditBrand={brand => handleOpenBrandModal(group.id, brand)}
              onDeleteBrand={handleDeleteBrand}
              onEditGroup={() => handleOpenGroupModal(group)}
              onDeleteGroup={() => handleDeleteGroup(group.id)}
            />
          )) : (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold flex flex-col items-center gap-3">
               ابتدا باید یک گروه برند ایجاد کنید.
            </div>
          )}
        </div>
      </div>

      <BrandModal 
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        editingBrand={editingBrand}
        groups={brandGroups}
        defaultGroupId={selectedGroupIdForNewBrand}
        onSubmit={handleBrandModalSubmit}
      />

      <BrandGroupModal 
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        editingGroup={editingGroup}
        onSubmit={handleGroupModalSubmit}
      />
    </div>
  );
}