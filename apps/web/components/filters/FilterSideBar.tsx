// cSpell:disable
"use client";

import { Search, Filter } from "lucide-react";
import { FilterAccordion } from "./FilterAccordion";
import { FilterCheckboxList } from "./FilterCheckboxList";
import { FilterPrice } from "./FilterPrice";

interface OffersSidebarProps {
  // 🚀 Added dynamic list props
  availableCategories: string[];
  availableBrands: string[];
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  MAX_ALLOWED_PRICE: number;
  isCategoryOpen?: boolean;
  isBrandOpen?: boolean;
}

export function FilterSideBar(props: OffersSidebarProps) {
  const hasSelectedCategory = props.selectedCategories.length > 0 || props.isCategoryOpen;
  const hasSelectedBrand = props.selectedBrands.length > 0 || props.isBrandOpen;

  return (
    <aside className="w-full lg:w-70 shrink-0 self-start lg:sticky lg:top-[100px] z-30">
      <div
        dir="ltr"
        className="bg-white dark:bg-[#1A110F] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F5EFE6] dark:border-[#3A221C] w-full max-h-[450px] lg:max-h-[550px] overflow-y-auto overscroll-none hover-scroll-trigger transition-colors duration-300 custom-scrollbar"
      >
        <div dir="rtl" className="p-5 sm:p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-[#F5EFE6] dark:border-[#3A221C] pb-4 transition-colors">
            <Filter className="w-5 h-5 text-[#C68E58]" />
            <h3 className="text-[18px] font-black text-[#2C1E16] dark:text-[#EAE0D5] transition-colors">
              فیلترها
            </h3>
          </div>

          {/* Search */}
          <div className="border-b border-[#F5EFE6] dark:border-[#3A221C] pb-6 transition-colors">
            <h4 className="text-[14px] font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-3 transition-colors">
              جستجو در محصولات
            </h4>
            <div className="relative">
              <input
                type="text"
                placeholder="نام قهوه، برند و..."
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                style={{ textAlign: "right", direction: "rtl" }}
                className="w-full h-11 border border-[#E3C3A4] dark:border-[#3A221C] rounded-xl pr-3 pl-10 text-[13px] text-[#3D2616] dark:text-[#EAE0D5] placeholder-[#A1A1A1] dark:placeholder-[#6A5A4F] focus:outline-none focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] bg-[#FFFDFB] dark:bg-[#231511] transition-all"
              />
              <Search className="w-5 h-5 text-[#A1A1A1] dark:text-[#6A5A4F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
            </div>
          </div>

          {/* Categories */}
          <FilterAccordion title="دسته‌بندی محصولات" defaultOpen={hasSelectedCategory}>
            <div className="max-h-60 overflow-y-auto pr-3 custom-scrollbar" dir="ltr">
              <div dir="rtl">
                <FilterCheckboxList
                  items={props.availableCategories} // 🚀 Using dynamic data
                  selectedItems={props.selectedCategories}
                  onToggle={props.toggleCategory}
                />
              </div>
            </div>
          </FilterAccordion>

          {/* Brands */}
          <FilterAccordion title="برندها" defaultOpen={hasSelectedBrand}>
            <div className="max-h-60 overflow-y-auto pr-3 custom-scrollbar" dir="ltr">
              <div dir="rtl">
                <FilterCheckboxList
                  items={props.availableBrands} // 🚀 Using dynamic data
                  selectedItems={props.selectedBrands}
                  onToggle={props.toggleBrand}
                />
              </div>
            </div>
          </FilterAccordion>

          {/* Price Range */}
          <FilterAccordion title="محدوده قیمت" maxHeight="max-h-[500px]" defaultOpen={false}>
            <FilterPrice
              minPrice={props.minPrice}
              setMinPrice={props.setMinPrice}
              maxPrice={props.maxPrice}
              setMaxPrice={props.setMaxPrice}
              MAX_ALLOWED_PRICE={props.MAX_ALLOWED_PRICE}
            />
          </FilterAccordion>
        </div>
      </div>
    </aside>
  );
}