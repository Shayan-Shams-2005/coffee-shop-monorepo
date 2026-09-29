// app/admin/banners/components/BannerCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { AdBanner, SectionId } from "../types";

interface BannerCardProps {
  banner: AdBanner;
  sectionId: SectionId;
  onEdit: (banner: AdBanner) => void;
  onDelete: (id: string) => void;
}

export function BannerCard({ banner, sectionId, onEdit, onDelete }: BannerCardProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [banner.imageUrl]);

  return (
    <div className="group relative rounded-2xl border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden bg-[#FCF9F5] dark:bg-[#231511] transition-all hover:border-[#C68E58]/50 hover:shadow-lg">
      
      {/* Image Thumbnail */}
      <div className={`relative overflow-hidden ${sectionId === 'above_header' ? 'h-24' : 'aspect-video'}`}>
        {!banner.imageUrl || hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5EFE6]/50 dark:bg-[#1A0F0C]">
            <ImageIcon className="w-6 h-6 text-[#8C7A6B] dark:text-[#6A5A4F] mb-1" />
            <span className="text-[10px] font-bold text-[#8C7A6B] dark:text-[#6A5A4F]">محل قرارگیری تصویر</span>
          </div>
        ) : (
          <img
            src={banner.imageUrl}
            alt={banner.alt}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button 
            onClick={() => onEdit(banner)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#C68E58] flex items-center justify-center transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(banner.id)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-rose-500 text-white flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner Details */}
      <div className="p-4 border-t border-[#F5EFE6] dark:border-[#3c2317]">
        <h3 className="font-bold text-sm text-[#2C1E16] dark:text-white truncate mb-2" title={banner.alt}>
          {banner.alt || "بدون عنوان جایگزین (Alt)"}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B] dark:text-[#A1A1A1] dir-ltr text-left overflow-hidden">
          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{banner.link || "بدون لینک"}</span>
        </div>
      </div>
    </div>
  );
}