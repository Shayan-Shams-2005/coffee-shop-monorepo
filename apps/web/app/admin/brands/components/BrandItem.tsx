// app/admin/brands/components/BrandItem.tsx
"use client";

import Link from "next/link";
import { Tag, Package, Edit, Trash2, CornerDownLeft } from "lucide-react";
import { UIBrand, toFarsiNumber } from "../types";

interface BrandItemProps {
  brand: UIBrand;
  onEdit: (brand: UIBrand) => void;
  onDelete: (id: string) => void;
}

export function BrandItem({ brand, onEdit, onDelete }: BrandItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl transition-colors border-transparent hover:border-[#E3C3A4]/60 dark:hover:border-[#3c2317] hover:bg-white dark:hover:bg-[#231511] group mb-2 border">
      <div className="flex items-center gap-3">
        <CornerDownLeft className="w-4 h-4 text-gray-300 dark:text-[#3c2317] opacity-50 shrink-0 mr-2" />
        <div className="w-8 shrink-0"></div>

        <div className="w-10 h-10 rounded-lg bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0">
          {brand.image ? (
            <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1" />
          ) : (
            <Tag className="w-4 h-4 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-base text-[#4A3022] dark:text-white">
            {brand.name}
          </h3>
          <span className="text-xs font-medium text-[#8C7A6B] dir-ltr text-right">
            {brand.enName}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 transition-all">
        <Link 
          href={`/admin/products?brand=${encodeURIComponent(brand.name)}`} 
          className="flex items-center gap-2 text-xs font-bold transition-all active:scale-95 text-[#4A3022] dark:text-[#EAE0D5] bg-white dark:bg-[#2A1B16] px-3 py-1.5 rounded-lg border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#F5EFE6] dark:hover:bg-[#3A221C] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
        >
          {/* 🚀 Always colored package icon */}
          <Package className="w-3.5 h-3.5 text-[#C68E58]" />
          {toFarsiNumber(brand.productCount)} کالا
        </Link>
        
        <div className="flex items-center gap-1">
          {/* 🚀 Changed Button Colors: Main color is bright, Hover is brighter */}
          <button 
            onClick={() => onEdit(brand)} 
            className="p-1.5 text-[#C68E58] hover:text-[#D4A373] hover:bg-[#F5EFE6] dark:text-[#C68E58] dark:hover:text-[#E3C3A4] transition-colors rounded-xl dark:hover:bg-[#3A221C]"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(brand.id)} 
            className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-xl dark:hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}