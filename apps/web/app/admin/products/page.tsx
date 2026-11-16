// app/admin/products/page.tsx
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter } from "lucide-react";

import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { SortBar } from "../../../components/sort/SortBar";

import { SortType, Product } from "./types"; 
import { sanitizeNameForFilter, ADMIN_SORT_OPTIONS } from "./constants"; 
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductTable } from "./components/ProductTable";
import { MobileFilterDrawer } from "./components/MobileFilterDrawer";
import { ProductApi, CategoryApi, BrandApi } from "./api"; 

// ============================================================================
// 🚀 CLEAN ARCHITECTURE: Data Mapping Utility
// ============================================================================
const mapApiProductToClient = (p: any, index: number): Product => {
  let rawImageStr = "";

  if (Array.isArray(p.images) && p.images.length > 0) {
    const mainImg = p.images.find((img: any) => img.isMain === true || img.IsMain === true) || p.images[0];
    rawImageStr = mainImg.imageUrl || mainImg.ImageUrl || "";
  }

  const priceVal = Number(p.initialPrice || p.InitialPrice || p.originalPrice || p.OriginalPrice || p.price || p.Price || p.basePrice || 0);
  const salePriceVal = Number(p.salePrice || p.SalePrice || p.newPrice || p.NewPrice || 0);

  return {
    ...p,
    id: p.productId || p.id || index, 
    name: p.productName || p.ProductName || p.name || "محصول بدون نام",
    category: p.categoryName || p.CategoryName || (p.categoryId ? p.categoryId.toString() : "نامشخص"),
    brand: p.brandName || p.BrandName || (p.brandId ? p.brandId.toString() : "نامشخص"),
    price: priceVal,
    newPrice: salePriceVal > 0 ? salePriceVal : null,
    hasOffer: p.hasOffer ?? p.HasOffer ?? (salePriceVal > 0),
    stock: p.stockQuantity ?? p.StockQuantity ?? p.stock ?? p.Stock ?? 0,
    salesVolume: p.soldQuantity ?? p.SoldQuantity ?? p.salesVolume ?? p.SalesVolume ?? 0,
    offerEndDate: p.offerEndDate || p.OfferEndDate || null,
    image: ProductApi.getImageUrl(rawImageStr), 
  };
};

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = sanitizeNameForFilter(searchParams.get("category"));
  const initialBrand = sanitizeNameForFilter(searchParams.get("brand"));

  // 🚀 Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 24; 
  const observerTarget = useRef<HTMLDivElement>(null);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  
  const [rawCategories, setRawCategories] = useState<any[]>([]);
  const [rawBrands, setRawBrands] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");
  
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Fetch Categories and Brands ONLY ONCE on Mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          CategoryApi.getAll().catch(() => ({ items: [] })), 
          BrandApi.getAll().catch(() => ({ items: [] }))
        ]);
        
        const catList = Array.isArray(categoriesData) ? categoriesData : (categoriesData.items || []);
        const brandList = Array.isArray(brandsData) ? brandsData : (brandsData.items || []);

        setRawCategories(catList);
        setRawBrands(brandList);
        setAvailableCategories(catList.map((c: any) => c.categoryName || c.name || ""));
        setAvailableBrands(brandList.map((b: any) => b.brandName || b.name || ""));
        
        setIsFiltersLoaded(true);
      } catch (err) {
        console.error(err);
        setIsFiltersLoaded(true); // Prevent UI freeze on failure
      }
    };
    fetchFilters();
  }, []);

  // 2. Debouncing inputs
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 600);
    return () => clearTimeout(timerId);
  }, [searchQuery, minPrice, maxPrice]);

  // 3. Reset page to 1 if any filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice, activeSort, selectedCategories, selectedBrands]);

  const getSortParams = (sort: SortType) => {
    switch (sort) {
      case "cheapest": return { sortBy: "price", sortOrder: "asc" };
      case "expensive": return { sortBy: "price", sortOrder: "desc" };
      case "newest": 
      default: return { sortBy: "relevance", sortOrder: "desc" }; 
    }
  };

  // 4. Fetch Products whenever page or filters change
  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      if (!isFiltersLoaded) return; // Wait until raw categories/brands are available

      try {
        if (page === 1) setIsLoading(true);
        else setIsFetchingNextPage(true);
        setError(null);

        const { sortBy, sortOrder } = getSortParams(activeSort);

        let categoryId = undefined;
        if (selectedCategories.length > 0 && rawCategories.length > 0) {
          const cat = rawCategories.find(c => (c.categoryName || c.name) === selectedCategories[0]);
          if (cat) categoryId = Number(cat.categoryId || cat.id);
        }

        let brandId = undefined;
        if (selectedBrands.length > 0 && rawBrands.length > 0) {
          const brand = rawBrands.find(b => (b.brandName || b.name) === selectedBrands[0]);
          if (brand) brandId = Number(brand.brandId || brand.id);
        }

        const data = await ProductApi.search({
          search: debouncedSearch,
          minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
          maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
          sortBy,
          sortOrder,
          categoryId: categoryId && !isNaN(categoryId) ? categoryId : undefined,
          brandId: brandId && !isNaN(brandId) ? brandId : undefined,
          page: page, 
          pageSize: PAGE_SIZE 
        });
        
        if (ignore) return;

        const rawArray = Array.isArray(data) ? data : (data?.items || data?.Items || data?.data || []);
        setTotalProductsCount(data?.totalCount || data?.TotalCount || rawArray.length);
        
        const mappedProducts = rawArray.map((p: any, index: number) => mapApiProductToClient(p, index));

        if (page === 1) {
          setProducts(mappedProducts);
        } else {
          setProducts(prev => [...prev, ...mappedProducts]);
        }

        setHasMore(rawArray.length === PAGE_SIZE);

      } catch (err: any) {
        if (!ignore) {
          if (err.message === "SESSION_EXPIRED") {
             alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
             router.push("/login");
          } else {
             setError("خطا در برقراری ارتباط با سرور");
          }
          if (page === 1) setProducts([]);
          setHasMore(false);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsFetchingNextPage(false);
        }
      }
    };

    fetchProducts();
    
    return () => { ignore = true; };
  }, [
    page, isFiltersLoaded, debouncedSearch, debouncedMinPrice, debouncedMaxPrice, 
    activeSort, selectedCategories, selectedBrands, rawCategories, rawBrands, router
  ]);

  // 5. Intersection Observer setup
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => { observer.unobserve(target); };
  }, [hasMore, isLoading, isFetchingNextPage]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
    setPage(1);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    router.replace('/admin/products', { scroll: false });
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await ProductApi.delete(id);
        setProducts(products.filter((p) => p.id !== id));
        setTotalProductsCount(prev => prev - 1);
        alert("محصول با موفقیت حذف شد.");
      } catch (err: any) {
        if (err.message === "SESSION_EXPIRED") router.push("/login");
        else alert("حذف محصول با خطا مواجه شد.");
      }
    }
  };

  const FilterComponent = (
    <FilterSideBar
      availableCategories={availableCategories.filter(Boolean)} 
      availableBrands={availableBrands.filter(Boolean)}         
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
      MAX_ALLOWED_PRICE={50000000} 
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
            onSortChange={(sort) => {
              setActiveSort(sort as SortType);
              setPage(1);
            }}
            productCount={totalProductsCount}
            options={ADMIN_SORT_OPTIONS}
          >
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[#FCF9F5] hover:bg-white dark:bg-[#1A110F] dark:hover:bg-[#231511] border border-[#E3C3A4]/60 hover:border-[#C68E58] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] rounded-xl text-xs font-bold transition-colors"
            >
              <Filter className="w-4 h-4" /> فیلترها
            </button>
          </SortBar>

          {isLoading && page === 1 ? (
            <div className="flex justify-center items-center h-64 text-[#8C7A6B] font-bold">
              در حال دریافت اطلاعات...
            </div>
          ) : error && page === 1 ? (
            <div className="flex justify-center items-center h-64 text-rose-500 font-bold">
              {error}
            </div>
          ) : (
            <>
              <ProductTable 
                products={products} 
                onDelete={handleDeleteProduct}
                onResetFilters={handleResetFilters}
              />
              
              {/* Intersection Observer Target for Pagination */}
              <div ref={observerTarget} className="w-full h-24 mt-4 flex flex-col items-center justify-center">
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری ادامه لیست...</span>
                  </div>
                )}
                
                {!hasMore && products.length > 0 && !isLoading && (
                  <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#6A5A4F] mt-4">
                    پایان لیست محصولات
                  </span>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)}
        resultCount={totalProductsCount}
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