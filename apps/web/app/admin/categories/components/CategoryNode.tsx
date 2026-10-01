// app/admin/categories/components/CategoryNode.tsx
"use client";

import Link from "next/link";
import { Edit, Trash2, Folder, Package, ChevronDown, ChevronUp, CornerDownLeft, PackageSearch } from "lucide-react";
import { Category, toFarsiNumber } from "../types";

interface CategoryNodeProps {
  category: Category;
  level?: number;
  allCategories: Category[];
  expandedCats: number[];
  onToggleExpand: (id: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryNode({ 
  category, 
  level = 0, 
  allCategories, 
  expandedCats, 
  onToggleExpand, 
  onEdit, 
  onDelete 
}: CategoryNodeProps) {
  const subcats = allCategories.filter(c => c.parentId === category.id);
  const isExpanded = expandedCats.includes(category.id);
  const hasChildren = subcats.length > 0;

  const imageSizeClasses = level === 0 ? "w-12 h-12 rounded-xl" : level === 1 ? "w-10 h-10 rounded-lg" : "w-8 h-8 rounded-md";
  const imageIconSize = level === 0 ? "w-6 h-6" : level === 1 ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="space-y-3">
      <div 
        className={`flex items-center justify-between p-3 rounded-xl transition-colors border group ${
          level === 0 
            ? "bg-white dark:bg-[#231511] border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] mt-4" 
            : "bg-[#FCF9F5] dark:bg-[#1A0F0C] border-transparent hover:border-[#E3C3A4]/40 dark:hover:border-[#3c2317] hover:bg-white dark:hover:bg-[#231511]"
        }`}
        style={{ marginRight: level > 0 ? `${(level - 1) * 20}px` : '0px' }}
      >
        <div className="flex items-center gap-3">
          {level > 1 && (
             <CornerDownLeft className="w-4 h-4 text-[#8C7A6B] dark:text-[#3c2317] opacity-50 shrink-0 mr-2" />
          )}

          {hasChildren ? (
            <button 
              onClick={() => onToggleExpand(category.id)}
              className={`p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 ${level === 0 ? "bg-[#FCF9F5] dark:bg-[#1A0F0C] shadow-sm" : ""}`}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          ) : (
            <div className="w-8 shrink-0"></div>
          )}

          <div className={`${imageSizeClasses} bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0`}>
            {category.image ? (
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            ) : (
              <PackageSearch className={`${imageIconSize} text-[#C68E58]/60 dark:text-[#6A5A4F]`} strokeWidth={1.5} />
            )}
          </div>

          <div>
            <h3 className={`font-bold text-[#4A3022] dark:text-white ${level === 0 ? 'text-lg' : level === 1 ? 'text-base' : 'text-sm'}`}>
              {category.name}
            </h3>
            {level === 0 && (
              <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1">
                <Folder className="w-3 h-3" /> {toFarsiNumber(subcats.length)} زیرمجموعه مستقیم
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 transition-all">
          <Link 
            href={`/admin/products?category=${encodeURIComponent(category.name)}`} 
            className={`flex items-center gap-2 text-xs font-bold transition-all active:scale-95 ${
              level === 0 
                ? "text-[#4A3022] dark:text-[#EAE0D5] bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-lg border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] hover:text-[#C68E58] shadow-sm" 
                // 🚀 Changed text color here to match the root level
                : "text-[#4A3022] dark:text-[#EAE0D5] bg-white dark:bg-[#2A1B16] px-3 py-1.5 rounded-lg border border-transparent hover:bg-[#F5EFE6] dark:hover:bg-[#3A221C] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
            }`}
          >
            {/* 🚀 Removed the level === 0 condition so the icon is always colored */}
            <Package className="w-3.5 h-3.5 text-[#C68E58]" />
            {toFarsiNumber(category.productCount)} کالا
          </Link>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(category)} 
              className={`p-1.5 text-[#C68E58] hover:text-[#D4A373] hover:bg-[#F5EFE6] dark:text-[#C68E58] dark:hover:text-[#E3C3A4] transition-colors rounded-xl dark:hover:bg-[#3A221C] ${level === 0 ? "p-2" : ""}`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(category.id)} 
              className={`p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-xl dark:hover:bg-rose-500/10 ${level === 0 ? "p-2" : ""}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className={`${level === 0 ? "pl-4 pr-12 border-t border-[#E3C3A4]/60 dark:border-[#3c2317] pt-2" : "pr-4 border-r border-[#E3C3A4]/60 dark:border-[#3c2317] mr-12"}`}>
          {subcats.map(sub => (
            <CategoryNode 
              key={sub.id} 
              category={sub} 
              level={level + 1} 
              allCategories={allCategories}
              expandedCats={expandedCats}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}