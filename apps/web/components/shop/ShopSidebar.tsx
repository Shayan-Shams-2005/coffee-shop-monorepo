"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown, Check, X } from "lucide-react";
import { CATEGORIES, BRANDS } from "../../lib/mock/shop-data";

const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function ShopSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  toggleCategory,
  selectedBrands,
  toggleBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  MAX_ALLOWED_PRICE,
  resetFilters,
}: any) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const handlePriceChange = (setter: (val: string) => void, value: string) => {
    let englishValue = value.replace(/[۰-۹]/g, (w) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(w)),
    );
    let rawValue = englishValue.replace(/\D/g, "");
    setter(rawValue);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (minPrice || maxPrice ? 1 : 0);

  return (
    <aside className="w-full sticky top-24 h-fit z-10">
      <div
        dir="ltr"
        className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#F5EFE6] w-full lg:max-h-[calc(100vh-120px)] overflow-y-auto overscroll-none custom-scrollbar hide-scrollbar"
      >
        <div dir="rtl" className="p-5 sm:p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#C68E58]" />
              <h3 className="text-[18px] font-black text-[#2C1E16]">فیلترها</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[12px] font-bold text-[#E63946] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                حذف همه <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="border-b border-[#F5EFE6] pb-6">
            <h4 className="text-[14px] font-black text-[#2C1E16] mb-3">
              جستجو در محصولات
            </h4>
            <div className="relative">
              <input
                type="text"
                placeholder="نام قهوه، برند و..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 border border-[#E3C3A4] rounded-xl pr-3 pl-10 text-[13px] text-[#3D2616] placeholder-[#A1A1A1] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] bg-[#FFFDFB] transition-all"
              />
              <Search className="w-5 h-5 text-[#A1A1A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="border-b border-[#F5EFE6] pb-6">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <h4 className="text-[14px] font-black text-[#2C1E16] group-hover:text-[#C68E58] transition-colors">
                دسته‌بندی محصولات
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${isCategoryOpen ? "max-h-[2000px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="flex flex-col gap-4 py-1">
                {CATEGORIES.map((cat: any) => {
                  const isChecked = selectedCategories.includes(cat.title);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-[13px] font-bold text-[#3D2616] group-hover:text-[#C68E58] transition-colors leading-tight">
                        {cat.title}
                      </span>
                      <div className="relative flex items-center shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.title)}
                          className="hidden"
                        />
                        <div
                          className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors duration-200 ${isChecked ? "bg-[#C68E58] border-[#C68E58]" : "bg-white border-[#D1C8B8] group-hover:border-[#C68E58]"}`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isChecked ? "scale-100" : "scale-0"}`}
                            strokeWidth={4}
                          />
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-b border-[#F5EFE6] pb-6">
            <button
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <h4 className="text-[14px] font-black text-[#2C1E16] group-hover:text-[#C68E58] transition-colors">
                برندها
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-300 ${isBrandOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${isBrandOpen ? "max-h-[2000px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="flex flex-col gap-4 py-1">
                {BRANDS.map((brand: any) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-[13px] font-bold text-[#3D2616] group-hover:text-[#C68E58] transition-colors">
                        {brand}
                      </span>
                      <div className="relative flex items-center shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="hidden"
                        />
                        <div
                          className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors duration-200 ${isChecked ? "bg-[#C68E58] border-[#C68E58]" : "bg-white border-[#D1C8B8] group-hover:border-[#C68E58]"}`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isChecked ? "scale-100" : "scale-0"}`}
                            strokeWidth={4}
                          />
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <h4 className="text-[14px] font-black text-[#2C1E16] group-hover:text-[#C68E58] transition-colors">
                محدوده قیمت
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-300 ${isPriceOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-500 overflow-hidden ${isPriceOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="flex flex-col gap-6 px-1">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[#E3C3A4] pb-2 relative">
                    <span className="text-[13px] font-bold text-[#3D2616]">
                      از
                    </span>
                    <input
                      type="text"
                      value={
                        minPrice
                          ? toFarsiNumber(
                              Number(minPrice).toLocaleString("en-US"),
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handlePriceChange(setMinPrice, e.target.value)
                      }
                      className="w-full text-left font-black text-[18px] text-[#2C1E16] bg-transparent outline-none dir-ltr pr-2 pl-8"
                      dir="ltr"
                    />
                    <span className="text-[10px] font-bold text-[#3D2616] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5">
                      تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#E3C3A4] pb-2 relative">
                    <span className="text-[13px] font-bold text-[#3D2616]">
                      تا
                    </span>
                    <input
                      type="text"
                      value={
                        maxPrice
                          ? toFarsiNumber(
                              Number(maxPrice).toLocaleString("en-US"),
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handlePriceChange(setMaxPrice, e.target.value)
                      }
                      className="w-full text-left font-black text-[18px] text-[#2C1E16] bg-transparent outline-none dir-ltr pr-2 pl-8"
                      dir="ltr"
                    />
                    <span className="text-[10px] font-bold text-[#3D2616] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5">
                      تومان
                    </span>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-4">
                  <div
                    className="relative h-1.5 bg-[#F5EFE6] rounded-full"
                    dir="ltr"
                  >
                    <div
                      className="absolute h-full bg-[#C68E58] rounded-full"
                      style={{
                        left: `${((MAX_ALLOWED_PRICE - Number(maxPrice || MAX_ALLOWED_PRICE)) / MAX_ALLOWED_PRICE) * 100}%`,
                        right: `${100 - ((MAX_ALLOWED_PRICE - Number(minPrice || 0)) / MAX_ALLOWED_PRICE) * 100}%`,
                      }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max={MAX_ALLOWED_PRICE}
                      step="50000"
                      value={MAX_ALLOWED_PRICE - Number(minPrice || 0)}
                      onChange={(e) => {
                        const realValue =
                          MAX_ALLOWED_PRICE - Number(e.target.value);
                        const val = Math.min(
                          realValue,
                          Number(maxPrice || MAX_ALLOWED_PRICE) - 50000,
                        );
                        if (val >= 0) setMinPrice(val.toString());
                      }}
                      className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#C68E58] hover:[&::-webkit-slider-thumb]:bg-[#A87242] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                      dir="ltr"
                    />
                    <input
                      type="range"
                      min="0"
                      max={MAX_ALLOWED_PRICE}
                      step="50000"
                      value={
                        MAX_ALLOWED_PRICE -
                        Number(maxPrice || MAX_ALLOWED_PRICE)
                      }
                      onChange={(e) => {
                        const realValue =
                          MAX_ALLOWED_PRICE - Number(e.target.value);
                        const val = Math.max(
                          realValue,
                          Number(minPrice || 0) + 50000,
                        );
                        if (val <= MAX_ALLOWED_PRICE)
                          setMaxPrice(val.toString());
                      }}
                      className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#C68E58] hover:[&::-webkit-slider-thumb]:bg-[#A87242] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-[#3D2616]">
                    <span>ارزان‌ترین</span>
                    <span className="flex-1 border-b border-dashed border-[#E3C3A4] mx-2 mb-1.5"></span>
                    <span>گران‌ترین</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
