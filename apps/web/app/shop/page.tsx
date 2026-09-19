"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, X } from "lucide-react";

// 🚀 FIXED: Reverted back to importing MOCK_PRODUCTS directly!
import { MOCK_PRODUCTS } from "../../lib/mock/shop-data";

import { ShopProductCard } from "../../components/product/ShopProductCard";

// 🚀 Imported the shared components
import { FilterSideBar } from "../../components/filters/FilterSideBar";
import { SortBar, SortOption } from "../../components/sort/SortBar";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type SortType =
  | "bestoffer"
  | "most_viewed"
  | "newest"
  | "bestselling"
  | "cheapest"
  | "expensive";

// Define the sort options specific to the Shop Page
const SHOP_SORT_OPTIONS: SortOption[] = [
  { id: "bestoffer", label: "بیشترین تخفیف" },
  { id: "most_viewed", label: "پربازدیدترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "bestselling", label: "پرفروش‌ترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const MAX_ALLOWED_PRICE = 5000000;
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const productsTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      const headerOffset = 150;
      const elementPosition =
        productsTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
    scrollToProducts();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    scrollToProducts();
  };

  const handleSortChange = (sort: SortType) => {
    setActiveSort(sort);
    scrollToProducts();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    scrollToProducts();
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;

    if (searchQuery.trim())
      result = result.filter((p) => p.name.includes(searchQuery.trim()));
    if (selectedBrands.length > 0)
      result = result.filter(
        (p) => p.brand && selectedBrands.includes(p.brand),
      );
    if (selectedCategories.length > 0)
      result = result.filter(
        (p) => p.category && selectedCategories.includes(p.category),
      );
    if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));

    return [...result].sort((a, b) => {
      switch (activeSort) {
        case "bestoffer":
          return (b.discount || 0) - (a.discount || 0);
        case "cheapest":
          return (a.price || 0) - (b.price || 0);
        case "expensive":
          return (b.price || 0) - (a.price || 0);
        case "bestselling":
          return (b.sales || 0) - (a.sales || 0);
        case "most_viewed":
          return (b.views || 0) - (a.views || 0);
        case "newest":
          return (
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
        default:
          return 0;
      }
    });
  }, [
    searchQuery,
    selectedBrands,
    selectedCategories,
    minPrice,
    maxPrice,
    activeSort,
  ]);

  return (
    // 🚀 FIXED: Main background dark mode colors
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-16 transition-colors duration-300">
      <div className="container mx-auto max-w-[1400px] px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-8 font-bold transition-colors">
          <Link
            href="/"
            className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors"
          >
            خانه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
          <span className="text-[#3D2616] dark:text-[#EAE0D5] transition-colors">
            تمام محصولات
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ================= سایدبار فیلترها (دسکتاپ) ================= */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <FilterSideBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              MAX_ALLOWED_PRICE={MAX_ALLOWED_PRICE}
            />
          </div>

          {/* ================= بخش اصلی ================= */}
          <main className="flex-1 w-full" ref={productsTopRef}>
            <SortBar
              activeSort={activeSort}
              onSortChange={handleSortChange}
              productCount={filteredAndSortedProducts.length}
              options={SHOP_SORT_OPTIONS}
            >
              {/* 🚀 FIXED: Mobile filter button dark mode */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 h-9 bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <Filter className="w-4 h-4" /> فیلترها
              </button>
            </SortBar>

            {/* گرید محصولات */}
            {filteredAndSortedProducts.length === 0 ? (
              // 🚀 FIXED: Empty state dark mode styling
              <div className="bg-white dark:bg-[#1A110F] rounded-[24px] border border-[#F5EFE6] dark:border-[#3c2317] p-10 flex flex-col items-center justify-center text-center h-64 transition-colors">
                <Search className="w-12 h-12 text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 transition-colors" />
                <h3 className="text-lg font-black text-[#3D2616] dark:text-[#EAE0D5] mb-2 transition-colors">
                  محصولی یافت نشد!
                </h3>
                <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm transition-colors">
                  با این فیلترها نتیجه‌ای پیدا نکردیم. لطفاً فیلترها را تغییر
                  دهید.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 text-sm font-bold text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors"
                >
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredAndSortedProducts.map((product, index) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= کشوی فیلترها (موبایل) ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* 🚀 FIXED: Overlay dark mode */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          {/* 🚀 FIXED: Mobile drawer container dark mode */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FCF9F5] dark:bg-[#1A1412] rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 transition-colors">
            {/* 🚀 FIXED: Mobile drawer header dark mode */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] rounded-t-3xl shrink-0 transition-colors">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-[#EAE0D5] flex items-center gap-2 transition-colors">
                <Filter className="w-5 h-5 text-[#C68E58]" /> فیلتر محصولات
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 bg-gray-50 dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-gray-500 dark:text-[#EAE0D5] hover:bg-gray-100 dark:hover:bg-[#3A221C] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <FilterSideBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                MAX_ALLOWED_PRICE={MAX_ALLOWED_PRICE}
              />
            </div>

            {/* 🚀 FIXED: Mobile drawer footer dark mode */}
            <div className="p-4 border-t border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] shrink-0 transition-colors">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full h-12 bg-[#C68E58] hover:bg-[#A87242] transition-colors text-white font-bold rounded-xl shadow-md"
              >
                مشاهده {toFarsiNumber(filteredAndSortedProducts.length)} کالا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
