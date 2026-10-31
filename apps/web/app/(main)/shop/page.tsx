// app/(main)/shop/page.tsx
"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, Filter, X } from "lucide-react";

import { ShopProductCard } from "../../../components/product/ShopProductCard";
import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { SortBar, SortOption } from "../../../components/sort/SortBar";

import { ShopPublicApi } from "./api"; 
import { Product } from "../../admin/products/types"; 

const toFarsiNumber = (num: any) => {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (x: string) => farsiDigits[parseInt(x)] || x);
};

export type SortType =
  | "bestoffer"
  | "most_viewed"
  | "newest"
  | "bestselling"
  | "cheapest"
  | "expensive";

const SHOP_SORT_OPTIONS: SortOption[] = [
  { id: "bestoffer", label: "بیشترین تخفیف" },
  { id: "most_viewed", label: "پربازدیدترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "bestselling", label: "پرفروش‌ترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
];

function ShopPageContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  
  const [activeSort, setActiveSort] = useState<SortType>(
    (searchParams.get("sort") as SortType) || "newest"
  );
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const productsTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sortParam = searchParams.get("sort") as SortType;
    const validSorts = ["bestoffer", "most_viewed", "newest", "bestselling", "cheapest", "expensive"];
    if (sortParam && validSorts.includes(sortParam)) {
      setActiveSort(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData, brandsData] = await Promise.all([
          ShopPublicApi.getProducts().catch(() => ({ items: [] })),
          ShopPublicApi.getCategories().catch(() => ({ items: [] })), 
          ShopPublicApi.getBrands().catch(() => ({ items: [] }))
        ]);
        
        const rawArray = Array.isArray(productsData) ? productsData : (productsData?.items || productsData?.data || []);
        
        const mappedProducts = rawArray.map((p: any, index: number) => {
          if (!p) return null;

          let rawImageStr = "";
          if (Array.isArray(p.images) && p.images.length > 0) {
            const mainImg = p.images.find((img: any) => img?.isMain === true || img?.IsMain === true) || p.images[0];
            rawImageStr = mainImg?.imageUrl || mainImg?.ImageUrl || "";
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
            views: p.views || p.Views || 0,
            offerEndDate: p.offerEndDate || p.OfferEndDate || null,
            image: ShopPublicApi.getImageUrl(rawImageStr), 
          };
        }).filter(Boolean);

        const catList = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.items || categoriesData?.data || []);
        let parsedCategories = catList.map((c: any) => c?.categoryName || c?.CategoryName || c?.name || c?.Name || c?.title || c?.Title || "").filter(Boolean);

        const brandList = Array.isArray(brandsData) ? brandsData : (brandsData?.items || brandsData?.data || []);
        let parsedBrands = brandList.map((b: any) => b?.brandName || b?.BrandName || b?.name || b?.Name || b?.title || b?.Title || "").filter(Boolean);

        if (parsedCategories.length === 0 && mappedProducts.length > 0) {
          parsedCategories = Array.from(new Set(mappedProducts.map((p: any) => p.category))).filter(c => c && c !== "نامشخص");
        }
        if (parsedBrands.length === 0 && mappedProducts.length > 0) {
          parsedBrands = Array.from(new Set(mappedProducts.map((p: any) => p.brand))).filter(b => b && b !== "نامشخص");
        }

        setAvailableCategories(parsedCategories);
        setAvailableBrands(parsedBrands);
        setProducts(mappedProducts);

      } catch (err) {
        console.error("Failed to fetch shop data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileFilterOpen]);

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      const headerOffset = 150;
      const elementPosition = productsTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
    scrollToProducts();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
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

  const dynamicPrices = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 5000000 };
    
    const prices = products.map(p => (p.hasOffer && p.newPrice) ? p.newPrice : (p.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return {
      min: min > 0 ? Math.floor(min / 10000) * 10000 : 0, 
      max: max > 0 ? Math.ceil(max / 10000) * 10000 : 5000000 
    };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products || [];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (selectedBrands.length > 0) result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    if (selectedCategories.length > 0) result = result.filter((p) => p.category && selectedCategories.includes(p.category));
    
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
        case "bestoffer": return (priceB < (b.price||0) ? ((b.price||0)-priceB) : 0) - (priceA < (a.price||0) ? ((a.price||0)-priceA) : 0);
        case "cheapest": return priceA - priceB;
        case "expensive": return priceB - priceA;
        case "bestselling": return (b.salesVolume || 0) - (a.salesVolume || 0);
        case "most_viewed": return ((b as any).views || 0) - ((a as any).views || 0);
        case "newest": {
          // 🚀 FIXED: If no date is found, it sorts by ID descending (highest/newest ID goes to the top right)
          const timeB = new Date((b as any).createdAt || (b as any).date || 0).getTime();
          const timeA = new Date((a as any).createdAt || (a as any).date || 0).getTime();
          if (timeB !== timeA && timeB !== 0 && timeA !== 0) return timeB - timeA;
          return Number(b.id || 0) - Number(a.id || 0);
        }
        default: return 0;
      }
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, minPrice, maxPrice, activeSort]);

  if (isLoading) {
    return (
      <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-16 transition-colors duration-300">
      <div className="container mx-auto max-w-[1400px] px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-8 font-bold transition-colors">
          <Link href="/" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">خانه</Link>
          <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
          <span className="text-[#3D2616] dark:text-[#EAE0D5] transition-colors">تمام محصولات</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="hidden lg:block w-[280px] shrink-0">
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
              MIN_ALLOWED_PRICE={dynamicPrices.min} 
              MAX_ALLOWED_PRICE={dynamicPrices.max} 
            />
          </div>

          <main className="flex-1 w-full" ref={productsTopRef}>
            <SortBar
              activeSort={activeSort}
              onSortChange={handleSortChange as any}
              productCount={filteredAndSortedProducts.length}
              options={SHOP_SORT_OPTIONS}
            >
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 h-9 bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <Filter className="w-4 h-4" /> فیلترها
              </button>
            </SortBar>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#1A110F] rounded-[24px] border border-[#F5EFE6] dark:border-[#3c2317] p-10 flex flex-col items-center justify-center text-center h-64 transition-colors">
                <Search className="w-12 h-12 text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 transition-colors" />
                <h3 className="text-lg font-black text-[#3D2616] dark:text-[#EAE0D5] mb-2 transition-colors">محصولی یافت نشد!</h3>
                <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm transition-colors">با این فیلترها نتیجه‌ای پیدا نکردیم. لطفاً فیلترها را تغییر دهید.</p>
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
                    product={product as any}
                    index={index}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#FCF9F5] dark:bg-[#1A1412] rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 transition-colors">
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
                MIN_ALLOWED_PRICE={dynamicPrices.min} 
                MAX_ALLOWED_PRICE={dynamicPrices.max} 
              />
            </div>

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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopPageContent />
    </Suspense>
  );
}