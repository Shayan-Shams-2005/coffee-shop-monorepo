// app/admin/brands/components/BrandGroup.tsx
"use client";

import { Plus, Tag, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { UIBrandGroup, UIBrand, toFarsiNumber, getCategoryIcon } from "../types";
import { BrandItem } from "./BrandItem";

interface BrandGroupProps {
  group: UIBrandGroup;
  isExpanded: boolean;
  onToggleExpand: (groupId: string) => void;
  onAddBrand: () => void;
  onEditBrand: (brand: UIBrand) => void;
  onDeleteBrand: (id: string) => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
}

export function BrandGroup({ 
  group, 
  isExpanded, 
  onToggleExpand, 
  onAddBrand, 
  onEditBrand, 
  onDeleteBrand,
  onEditGroup,
  onDeleteGroup
}: BrandGroupProps) {
  const icon = getCategoryIcon(true);

  return (
    <div className="border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl transition-colors border group-hover bg-white dark:bg-[#231511] border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] mt-4 mx-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onToggleExpand(group.id)}
              className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 bg-[#FCF9F5] dark:bg-[#1A0F0C] shadow-sm"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0 text-[#C68E58]">
              {icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#4A3022] dark:text-white text-lg">
                  {group.name}
                </h3>
                <span className="text-[10px] bg-[#E3C3A4]/30 dark:bg-[#3c2317]/50 text-[#8C7A6B] px-2 py-0.5 rounded-md">ترتیب: {group.displayOrder}</span>
              </div>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {toFarsiNumber(group.brands.length)} برند
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 transition-all pr-4">
             <button onClick={onEditGroup} className="p-2 text-[#8C7A6B] hover:text-[#C68E58] transition-colors rounded-lg bg-[#FCF9F5] dark:bg-[#1A0F0C]">
                <Edit className="w-4 h-4" />
             </button>
             <button onClick={onDeleteGroup} className="p-2 text-[#8C7A6B] hover:text-rose-500 transition-colors rounded-lg bg-[#FCF9F5] dark:bg-[#1A0F0C]">
                <Trash2 className="w-4 h-4" />
             </button>
            <button
              onClick={onAddBrand}
              className="ml-2 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58]/50 hover:bg-[#F5EFE6] dark:hover:bg-[#2A1B16] text-[#C68E58]"
            >
              <Plus className="w-4 h-4" /> افزودن برند
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-4 pr-12 border-t border-[#E3C3A4]/60 dark:border-[#3c2317] pt-2 pb-4">
            {group.brands.length === 0 ? (
              <div className="text-center py-6 text-[#8C7A6B] dark:text-[#6A5A4F] text-sm font-bold">
                هیچ برندی در این گروه یافت نشد.
              </div>
            ) : (
              group.brands.map(brand => (
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