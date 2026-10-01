// app/admin/brands/components/BrandGroup.tsx
"use client";

import { Plus, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { UIBrand, toFarsiNumber, getCategoryTitle, getCategoryIcon } from "../types";
import { BrandItem } from "./BrandItem";

interface BrandGroupProps {
  categoryName: string;
  brands: UIBrand[];
  isExpanded: boolean;
  onToggleExpand: (group: string) => void;
  onAddBrand: (category: string) => void;
  onEditBrand: (brand: UIBrand) => void;
  onDeleteBrand: (id: string) => void;
}

export function BrandGroup({ 
  categoryName, 
  brands, 
  isExpanded, 
  onToggleExpand, 
  onAddBrand, 
  onEditBrand, 
  onDeleteBrand 
}: BrandGroupProps) {
  const title = getCategoryTitle(categoryName);
  const icon = getCategoryIcon(categoryName, true);

  return (
    <div className="border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl transition-colors border group bg-white dark:bg-[#231511] border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] mt-4 mx-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onToggleExpand(categoryName)}
              className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 bg-[#FCF9F5] dark:bg-[#1A0F0C] shadow-sm"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0 text-[#C68E58]">
              {icon}
            </div>

            <div>
              <h3 className="font-bold text-[#4A3022] dark:text-white text-lg">
                {title}
              </h3>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {toFarsiNumber(brands.length)} برند ثبت شده
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 transition-all pr-4">
            {/* 🚀 Changed button style to match the Banner section exactly */}
            <button
              onClick={() => onAddBrand(categoryName)}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58]/50 hover:bg-[#F5EFE6] dark:hover:bg-[#2A1B16] text-[#C68E58]"
            >
              <Plus className="w-4 h-4" /> افزودن به این گروه
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-4 pr-12 border-t border-[#E3C3A4]/60 dark:border-[#3c2317] pt-2 pb-4">
            {brands.length === 0 ? (
              <div className="text-center py-6 text-[#8C7A6B] dark:text-[#6A5A4F] text-sm font-bold">
                هیچ برندی در این گروه یافت نشد.
              </div>
            ) : (
              brands.map(brand => (
                <BrandItem 
                  key={brand.id} 
                  brand={brand} 
                  onEdit={onEditBrand} 
                  onDelete={onDeleteBrand} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}