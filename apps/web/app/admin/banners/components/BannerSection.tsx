// app/admin/banners/components/BannerSection.tsx
"use client";

import { Plus, Layout } from "lucide-react";
import { AdBanner, SectionId, SECTION_CONFIG, toFarsiNumber } from "../types";
import { BannerCard } from "./BannerCard";

interface BannerSectionProps {
  sectionId: SectionId;
  banners: AdBanner[];
  onAdd: (sectionId: SectionId) => void;
  onEdit: (sectionId: SectionId, banner: AdBanner) => void;
  onDelete: (id: string) => void;
}

export function BannerSection({ sectionId, banners, onAdd, onEdit, onDelete }: BannerSectionProps) {
  const config = SECTION_CONFIG[sectionId];
  const sectionBanners = banners.filter(b => b.section === sectionId);
  const isFull = sectionBanners.length >= config.max;

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none mb-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58]">
            {config.icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">{config.title}</h2>
            <p className="text-xs font-bold text-[#8C7A6B] mt-1">
              ظرفیت: {toFarsiNumber(sectionBanners.length)} از {toFarsiNumber(config.max)} بنر
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onAdd(sectionId)}
          disabled={isFull}
          className={`mt-4 sm:mt-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
            isFull 
              ? "bg-gray-100 dark:bg-[#2A1B16] text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent" 
              : "bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58]/50 hover:bg-[#F5EFE6] dark:hover:bg-[#2A1B16] text-[#C68E58]"
          }`}
        >
          <Plus className="w-4 h-4" /> افزودن بنر
        </button>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {sectionBanners.length === 0 ? (
          <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] text-sm font-bold flex flex-col items-center justify-center">
            <Layout className="w-12 h-12 opacity-20 mb-3" />
            هیچ بنری در این بخش ثبت نشده است.
          </div>
        ) : (
          <div className={`grid gap-6 ${sectionId === 'above_header' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {sectionBanners.map(banner => (
              <BannerCard 
                key={banner.id} 
                banner={banner} 
                sectionId={sectionId} 
                onEdit={(b) => onEdit(sectionId, b)} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}