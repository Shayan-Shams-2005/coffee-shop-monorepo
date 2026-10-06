// app/admin/products/page.tsx
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter } from "lucide-react";

import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { SortBar } from "../../../components/sort/SortBar";

import { SortType, Product } from "./types"; 
import { sanitizeNameForFilter, ADMIN_SORT_OPTIONS, MAX_ALLOWED_PRICE } from "./constants"; 
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductTable } from "./components/ProductTable";
import { MobileFilterDrawer } from "./components/MobileFilterDrawer";
import { ProductApi } from "./api"; 

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = sanitizeNameForFilter(searchParams.get("category"));
  const initialBrand = sanitizeNameForFilter(searchParams.get("brand"));

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await ProductApi.getAll();
        
        const rawArray = Array.isArray(data) ? data : (data.items || []);

        const mappedProducts = rawArray.map((p: any, index: number) => {
          let rawImageStr = "";

          // Grab the imageUrl from the images array based on database structure
          if (Array.isArray(p.images) && p.images.length > 0) {
            const mainImg = p.images.find((img: any) => img.isMain === true) || p.images[0];
            rawImageStr = mainImg.imageUrl || "";
          }

          return {
            id: p.productId || p.id || index, 
            name: p.productName || "محصول بدون نام",
            category: p.categoryName || (p.categoryId ? p.categoryId.toString() : "نامشخص"),
            brand: p.brandName || (p.brandId ? p.brandId.toString() : "نامشخص"),
            price: p.price || 0,
            stock: p.stockQuantity || 0,
            hasOffer: false, 
            newPrice: null,  
            // 🚀 Using the central API helper instead of a local function
            image: ProductApi.getImageUrl(rawImageStr), 
          };
        });

        setProducts(mappedProducts);
      } catch (err) {
        setError("خطا در برقراری ارتباط با سرور");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const handleDeleteProduct = async (id: number) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await ProductApi.delete(id);
        setProducts(products.filter((p) => p.id !== id));
        alert("محصول با موفقیت حذف شد.");
      } catch (err) {
        alert("حذف محصول با خطا مواجه شد.");
      }
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products || [];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(query) || 
        p.category?.toLowerCase().includes(query)
      );
    }
    
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }
    
    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category && selectedCategories.includes(p.category));
    }
    
    if (minPrice) {
      result = result.filter((p) => (p.price || 0) >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      result = result.filter((p) => (p.price || 0) <= parseInt(maxPrice));
    }

    return [...result].sort((a, b) => {
      switch (activeSort) {
        case "cheapest": return (a.price || 0) - (b.price || 0);
        case "expensive": return (b.price || 0) - (a.price || 0);
        case "newest": return (b.id || 0) - (a.id || 0);
        default: return 0;
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
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500 text-[#4A3022] dark:text-[#EAE0D5]" dir="rtl">
      <ProductsHeader />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
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
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[#FCF9F5] hover:bg-white dark:bg-[#1A110F] dark:hover:bg-[#231511] border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] rounded-xl text-xs font-bold transition-colors"
            >
              <Filter className="w-4 h-4" /> فیلترها
            </button>
          </SortBar>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-[#8C7A6B] font-bold">
              در حال دریافت اطلاعات محصولات...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-rose-500 font-bold">
              {error}
            </div>
          ) : (
            <ProductTable 
              products={filteredAndSortedProducts} 
              onDelete={handleDeleteProduct}
              onResetFilters={handleResetFilters}
            />
          )}
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}