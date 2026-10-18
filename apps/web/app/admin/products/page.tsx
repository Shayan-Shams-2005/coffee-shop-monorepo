// app/admin/products/page.tsx
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
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

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = sanitizeNameForFilter(searchParams.get("category"));
  const initialBrand = sanitizeNameForFilter(searchParams.get("brand"));

  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  // مقدار اولیه از URL گرفته می‌شود (ممکن است آیدی باشد یا نام)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData, brandsData] = await Promise.all([
          ProductApi.getAll(),
          CategoryApi.getAll().catch(() => []), 
          BrandApi.getAll().catch(() => [])
        ]);
        
        // 1. Process Categories
        const catList = Array.isArray(categoriesData) ? categoriesData : (categoriesData.items || []);
        setAvailableCategories(catList.map((c: any) => c.categoryName || c.name || ""));

        // 🚀 FIX: تبدیل آیدی دسته‌بندی به نام دسته‌بندی (اگر از URL آیدی ارسال شده باشد)
        if (initialCategory) {
          const foundCat = catList.find((c: any) => c.categoryId?.toString() === initialCategory || c.id?.toString() === initialCategory || c.categoryName === initialCategory);
          if (foundCat) {
            const catName = foundCat.categoryName || foundCat.name;
            setSelectedCategories(prev => {
              const filtered = prev.filter(p => p !== initialCategory);
              return filtered.includes(catName) ? filtered : [...filtered, catName];
            });
          }
        }

        // 2. Process Brands
        const brandList = Array.isArray(brandsData) ? brandsData : (brandsData.items || []);
        setAvailableBrands(brandList.map((b: any) => b.brandName || b.name || ""));

        // 🚀 FIX: تبدیل آیدی برند به نام برند (اگر از URL آیدی 4 ارسال شده باشد، آن را به "عربیکا" تبدیل می‌کند)
        if (initialBrand) {
          const foundBrand = brandList.find((b: any) => b.brandId?.toString() === initialBrand || b.id?.toString() === initialBrand || b.brandName === initialBrand);
          if (foundBrand) {
            const brandName = foundBrand.brandName || foundBrand.name;
            setSelectedBrands(prev => {
              const filtered = prev.filter(p => p !== initialBrand); // حذف آیدی 4 از لیست فیلترها
              return filtered.includes(brandName) ? filtered : [...filtered, brandName]; // اضافه کردن "عربیکا"
            });
          }
        }

        // 3. Process Products
        const rawArray = Array.isArray(productsData) ? productsData : (productsData.items || []);
        const mappedProducts = rawArray.map((p: any, index: number) => {
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
        });

        setProducts(mappedProducts);
      } catch (err) {
        setError("خطا در برقراری ارتباط با سرور");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // وابسته به هیچ مقداری نیست تا فقط یکبار لود شود

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

  const dynamicMaxPrice = useMemo(() => {
    if (!products || products.length === 0) return 5000000;
    const max = Math.max(...products.map(p => (p.hasOffer && p.newPrice) ? p.newPrice : (p.price || 0)));
    return max > 0 ? max : 5000000; 
  }, [products]);

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
      result = result.filter((p) => {
        const effectivePrice = (p.hasOffer && p.newPrice) ? p.newPrice : (p.price || 0);
        return effectivePrice >= parseInt(minPrice);
      });
    }
    
    if (maxPrice) {
      result = result.filter((p) => {
        const effectivePrice = (p.hasOffer && p.newPrice) ? p.newPrice : (p.price || 0);
        return effectivePrice <= parseInt(maxPrice);
      });
    }

    return [...result].sort((a, b) => {
      const priceA = (a.hasOffer && a.newPrice) ? a.newPrice : (a.price || 0);
      const priceB = (b.hasOffer && b.newPrice) ? b.newPrice : (b.price || 0);

      switch (activeSort) {
        case "cheapest": return priceA - priceB;
        case "expensive": return priceB - priceA;
        case "newest": return (b.id || 0) - (a.id || 0);
        default: return 0;
      }
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, minPrice, maxPrice, activeSort]);

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
      MAX_ALLOWED_PRICE={dynamicMaxPrice} 
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
              در حال دریافت اطلاعات...
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