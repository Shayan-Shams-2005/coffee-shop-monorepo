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
    <div className="flex items-center justify-between p-3 rounded-xl transition-colors border-transparent hover:border-[#F5EFE6] dark:hover:border-[#3c2317] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] group mb-2 border">
      <div className="flex items-center gap-3">
        <CornerDownLeft className="w-4 h-4 text-gray-300 dark:text-[#3c2317] opacity-50 shrink-0 mr-2" />
        <div className="w-8 shrink-0"></div>

        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0">
          {brand.image ? (
            <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1" />
          ) : (
            <Tag className="w-4 h-4 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-base text-[#2C1E16] dark:text-white">
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
          className="flex items-center gap-2 text-xs font-bold transition-all active:scale-95 text-[#8C7A6B] dark:text-[#A1A1A1] bg-[#FCF9F5] dark:bg-[#2A1B16] px-3 py-1.5 rounded-lg border border-transparent hover:bg-white dark:hover:bg-[#3A221C] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
        >
          <Package className="w-3.5 h-3.5" />
          {toFarsiNumber(brand.productCount)} کالا
        </Link>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(brand)} 
            className="p-1.5 text-gray-400 hover:text-[#C68E58] transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-[#3A221C]"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(brand.id)} 
            className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}