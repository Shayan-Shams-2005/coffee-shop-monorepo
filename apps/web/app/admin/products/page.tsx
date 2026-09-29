// app/admin/products/page.tsx
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter } from "lucide-react";

import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { SortBar } from "../../../components/sort/SortBar";

import { SortType } from "./types";
import { mockProducts, sanitizeNameForFilter, ADMIN_SORT_OPTIONS, MAX_ALLOWED_PRICE } from "./constants";
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductTable } from "./components/ProductTable";
import { MobileFilterDrawer } from "./components/MobileFilterDrawer";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = sanitizeNameForFilter(searchParams.get("category"));
  const initialBrand = sanitizeNameForFilter(searchParams.get("brand"));

  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialBrand) setSelectedBrands((prev) => prev.includes(initialBrand) ? prev : [...prev, initialBrand]);
  }, [initialBrand]);

  useEffect(() => {
    if (initialCategory) setSelectedCategories((prev) => prev.includes(initialCategory) ? prev : [...prev, initialCategory]);
  }, [initialCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    router.replace('/admin/products', { scroll: false });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      result = result.filter((p) => p.name.includes(searchQuery.trim()) || p.category.includes(searchQuery.trim()));
    }
    if (selectedBrands.length > 0) result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    if (selectedCategories.length > 0) result = result.filter((p) => p.category && selectedCategories.includes(p.category));
    if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));

    return [...result].sort((a, b) => {
      switch (activeSort) {
        case "bestoffer":
          const aDiscount = a.hasOffer && a.newPrice ? a.price - a.newPrice : 0;
          const bDiscount = b.hasOffer && b.newPrice ? b.price - b.newPrice : 0;
          return bDiscount - aDiscount;
        case "cheapest":
          const aPrice = a.hasOffer && a.newPrice ? a.newPrice : a.price;
          const bPrice = b.hasOffer && b.newPrice ? b.newPrice : b.price;
          return aPrice - bPrice;
        case "expensive":
          const axPrice = a.hasOffer && a.newPrice ? a.newPrice : a.price;
          const bxPrice = b.hasOffer && b.newPrice ? b.newPrice : b.price;
          return bxPrice - axPrice;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, minPrice, maxPrice, activeSort]);

  const FilterComponent = (
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
      isCategoryOpen={!!initialCategory}
      isBrandOpen={!!initialBrand}
    />
  );

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <ProductsHeader />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          {FilterComponent}
        </div>

        <main className="flex-1 w-full min-w-0 space-y-6">
          <SortBar
            activeSort={activeSort}
            onSortChange={(sort) => setActiveSort(sort as SortType)}
            productCount={filteredAndSortedProducts.length}
            options={ADMIN_SORT_OPTIONS}
          >
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] rounded-xl text-xs font-bold transition-colors"
            >
              <Filter className="w-4 h-4" /> فیلترها
            </button>
          </SortBar>

          <ProductTable 
            products={filteredAndSortedProducts} 
            onDelete={handleDeleteProduct}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)}
        resultCount={filteredAndSortedProducts.length}
      >
        {FilterComponent}
      </MobileFilterDrawer>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="w-full h-64 flex items-center justify-center text-[#8C7A6B] font-bold">در حال بارگذاری...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}