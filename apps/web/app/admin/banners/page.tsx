// app/admin/banners/page.tsx
"use client";

import { useState } from "react";
import { AdBanner, SectionId, SECTION_CONFIG } from "./types";
import { BannerSection } from "./components/BannerSection";
import { BannerModal } from "./components/BannerModal";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdBanner[]>([]); // 🚀 Empty array initially
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [activeSectionForNew, setActiveSectionForNew] = useState<SectionId | null>(null);

  const handleOpenModal = (section: SectionId, banner?: AdBanner) => {
    setActiveSectionForNew(section);
    setEditingBanner(banner || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleModalSubmit = (data: Omit<AdBanner, "id">) => {
    if (editingBanner) {
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...data } : b));
    } else {
      setBanners(prev => [...prev, { id: `bn${Date.now()}`, ...data }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          {/* 🚀 Changed title text color to warm brown */}
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">بنرهای تبلیغاتی</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">مدیریت تصاویر تبلیغاتی در بخش‌های مختلف فروشگاه (Image / GIF)</p>
        </div>
      </div>

      {/* Render Sections */}
      {(Object.keys(SECTION_CONFIG) as SectionId[]).map(sectionId => (
        <BannerSection 
          key={sectionId}
          sectionId={sectionId}
          banners={banners}
          onAdd={handleOpenModal}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      ))}

      {/* Add / Edit Modal */}
      <BannerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeSection={activeSectionForNew}
        editingBanner={editingBanner}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}