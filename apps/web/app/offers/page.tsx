"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Search } from "lucide-react";

import { DISCOUNTED_PRODUCTS } from "../../lib/mock/offers-data";

import { OffersHeader } from "../../components/offers-page/OffersHeader";
import { FilterSideBar } from "../../components/filters/FilterSideBar";
import { ExpiringOfferCard } from "../../components/offers-page/ExpiringOfferCard";
import { OfferCard } from "../../components/product/OfferCard";
import { SortBar, SortOption } from "../../components/sort/SortBar";

export type SortType =
  | "bestoffer"
  | "most_viewed"
  | "newest"
  | "bestselling"
  | "cheapest"
  | "expensive";

// Define the sort options specific to the Offers Page
const OFFERS_SORT_OPTIONS: SortOption[] = [
  { id: "bestoffer", label: "بیشترین تخفیف" },
  { id: "most_viewed", label: "پربازدیدترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "bestselling", label: "پرفروش‌ترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
];

export default function OffersPage() {
  const [activeSort, setActiveSort] = useState<SortType>("bestoffer");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const MAX_ALLOWED_PRICE = 5000000;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const topScrollRef = useRef<HTMLDivElement>(null);
  const productsTopRef = useRef<HTMLDivElement>(null);

  const [isTopAtRight, setIsTopAtRight] = useState(true);
  const [isTopAtLeft, setIsTopAtLeft] = useState(false);

  const expiringSoonProducts = useMemo(
    () => DISCOUNTED_PRODUCTS.filter((p) => p.hoursLeft <= 12),
    [],
  );

  const handleTopScroll = () => {
    if (!topScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = topScrollRef.current;
    const currentScroll = Math.abs(scrollLeft);
    setIsTopAtRight(currentScroll <= 5);
    setIsTopAtLeft(currentScroll + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    handleTopScroll();
    window.addEventListener("resize", handleTopScroll);
    return () => window.removeEventListener("resize", handleTopScroll);
  }, []);

  const scrollTopSlider = (direction: "left" | "right") => {
    if (topScrollRef.current && topScrollRef.current.firstElementChild) {
      const container = topScrollRef.current;
      const cardWidth =
        (container.firstElementChild as HTMLElement).offsetWidth + 16;
      const scrollAmount = cardWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      const headerOffset = 150;
      const elementPosition =
        productsTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
    let products = DISCOUNTED_PRODUCTS.filter((p) => p.hoursLeft > 12);

    if (searchQuery.trim()) {
      products = products.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          (p.brand && p.brand.includes(searchQuery)) ||
          (p.category && p.category.includes(searchQuery)),
      );
    }
    if (selectedCategories.length > 0) {
      products = products.filter(
        (p) => p.category && selectedCategories.includes(p.category),
      );
    }
    if (selectedBrands.length > 0) {
      products = products.filter(
        (p) => p.brand && selectedBrands.includes(p.brand),
      );
    }
    if (minPrice)
      products = products.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice)
      products = products.filter((p) => p.price <= parseInt(maxPrice));

    return products.sort((a, b) => {
      switch (activeSort) {
        case "bestoffer":
          return (b.discount || 0) - (a.discount || 0);
        case "cheapest":
          return a.price - b.price;
        case "expensive":
          return b.price - a.price;
        case "bestselling":
          return (b.sales || 0) - (a.sales || 0);
        case "most_viewed":
          return ((b as any).views || 0) - ((a as any).views || 0);
        case "newest":
          return (
            new Date((b as any).date || 0).getTime() -
            new Date((a as any).date || 0).getTime()
          );
        default:
          return 0;
      }
    });
  }, [
    activeSort,
    searchQuery,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
  ]);

  return (
    // 🚀 FIXED: Added global dark mode background
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-16 transition-colors duration-300">
      <OffersHeader />

      <div className="container mx-auto max-w-[1400px] px-4 -mt-6 relative z-20">
        {/* ================= اسلایدر لحظه آخری ================= */}
        {expiringSoonProducts.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-6">
              {/* 🚀 FIXED: Header box dark mode styling */}
              <div className="flex items-center gap-3 bg-white dark:bg-[#1A110F] w-fit px-5 sm:px-6 py-3 rounded-2xl shadow-sm border border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
                <Flame className="w-6 h-6 text-[#D95D39] animate-bounce" />
                <h2 className="text-lg sm:text-xl font-black text-[#D95D39]">
                  پیشنهادهای لحظه آخری
                </h2>
                <span className="hidden sm:inline-block text-xs font-bold text-[#A1A1A1] mr-2">
                  (کمتر از ۱۲ ساعت)
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 mt-2 md:mt-3">
                {/* 🚀 FIXED: Right Scroll Button dark mode styling */}
                <button
                  onClick={() => scrollTopSlider("right")}
                  disabled={isTopAtRight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-[#1A110F] border ${
                    isTopAtRight
                      ? "border-[#E3C3A4]/50 dark:border-[#3A221C] text-[#D1C8B8] dark:text-[#3A221C] cursor-default"
                      : "border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-sm active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* 🚀 FIXED: Left Scroll Button dark mode styling */}
                <button
                  onClick={() => scrollTopSlider("left")}
                  disabled={isTopAtLeft}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-[#1A110F] border ${
                    isTopAtLeft
                      ? "border-[#E3C3A4]/50 dark:border-[#3A221C] text-[#D1C8B8] dark:text-[#3A221C] cursor-default"
                      : "border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-sm active:scale-95"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="-mx-2 px-2">
              <div
                ref={topScrollRef}
                onScroll={handleTopScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {expiringSoonProducts.map((product, index) => (
                  <ExpiringOfferCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* سایدبار */}
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

          {/* محتوای اصلی */}
          <div className="flex-1" ref={productsTopRef}>
            {/* کامپوننت مرتب‌سازی اشتراکی */}
            <SortBar
              activeSort={activeSort}
              onSortChange={handleSortChange}
              productCount={filteredAndSortedProducts.length}
              options={OFFERS_SORT_OPTIONS}
            />

            {filteredAndSortedProducts.length === 0 ? (
              // 🚀 FIXED: Empty state dark mode styling
              <div className="bg-white dark:bg-[#1A110F] rounded-[24px] border border-[#F5EFE6] dark:border-[#3c2317] p-10 flex flex-col items-center justify-center text-center h-64 transition-colors">
                <Search className="w-12 h-12 text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 transition-colors" />
                <h3 className="text-lg font-black text-[#3D2616] dark:text-[#EAE0D5] mb-2 transition-colors">
                  کالایی یافت نشد!
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 text-sm font-bold text-[#C68E58] hover:text-[#A87242] dark:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors"
                >
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredAndSortedProducts.map((product, index) => (
                  <OfferCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
