// app/(main)/offers/page.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Search, Loader2 } from "lucide-react";

import { OffersHeader } from "../../../components/offers-page/OffersHeader";
import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { ExpiringOfferCard } from "../../../components/offers-page/ExpiringOfferCard";
import { OfferCard } from "../../../components/product/OfferCard";
import { SortBar, SortOption } from "../../../components/sort/SortBar";

import { OffersPublicApi } from "./api"; // 🚀 Use the new API file

export type SortType =
  | "bestoffer"
  | "most_viewed"
  | "newest"
  | "bestselling"
  | "cheapest"
  | "expensive";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const MAX_ALLOWED_PRICE = 5000000;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  const topScrollRef = useRef<HTMLDivElement>(null);
  const productsTopRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null); // For infinite scroll

  const [isTopAtRight, setIsTopAtRight] = useState(true);
  const [isTopAtLeft, setIsTopAtLeft] = useState(false);

  // Pagination states for the main grid
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 24;

  const [products, setProducts] = useState<any[]>([]);
  const [expiringSoonProducts, setExpiringSoonProducts] = useState<any[]>([]);
  
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter options
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [rawCategories, setRawCategories] = useState<any[]>([]);
  const [rawBrands, setRawBrands] = useState<any[]>([]);

  // 1. Fetch Categories and Brands
  useEffect(() => {
    const fetchSidebarFilters = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          OffersPublicApi.getCategories().catch(() => ({ items: [] })), 
          OffersPublicApi.getBrands().catch(() => ({ items: [] }))
        ]);
        
        const catList = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.items || categoriesData?.data || []);
        const brandList = Array.isArray(brandsData) ? brandsData : (brandsData?.items || brandsData?.data || []);

        setRawCategories(catList);
        setRawBrands(brandList);

        const uniqueCategories = Array.from(new Set(catList.map((c: any) => c?.categoryName || c?.name || "").filter(Boolean))) as string[];
        const uniqueBrands = Array.from(new Set(brandList.map((b: any) => b?.brandName || b?.name || "").filter(Boolean))) as string[];

        setAvailableCategories(uniqueCategories);
        setAvailableBrands(uniqueBrands);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchSidebarFilters();
  }, []);

  // 2. Fetch "Expiring Soon" for top slider (Needs to scan all products quickly)
  useEffect(() => {
    const fetchExpiringOffers = async () => {
      try {
        const data = await OffersPublicApi.getAllOffersQuick();
        const productsArray = Array.isArray(data) ? data : (data.data || data.items || []);

        const mappedExpiring = productsArray
          .filter((p: any) => {
            const hasOffer = p.salePrice != null && p.salePrice > 0 && p.salePrice < p.originalPrice;
            if (!hasOffer || !p.saleEndAt) return false;
            const diffMs = new Date(p.saleEndAt).getTime() - Date.now();
            const hoursLeft = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
            return hoursLeft > 0 && hoursLeft < 24; // Only those expiring soon
          })
          .map((p: any) => {
            const diffMs = new Date(p.saleEndAt).getTime() - Date.now();
            const hoursLeft = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
            const discountPercent = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);

            let rawImageStr = "";
            if (Array.isArray(p.images) && p.images.length > 0) {
              const mainImg = p.images.find((img: any) => img.isMain) || p.images[0];
              rawImageStr = mainImg.imageUrl || "";
            }

            return {
              id: p.productId,
              name: p.productName,
              price: p.salePrice,
              oldPrice: p.originalPrice,
              discount: discountPercent,
              category: p.categoryName || "",
              brand: p.brandName || "",
              offerEndDate: p.saleEndAt,
              imageUrl: OffersPublicApi.getImageUrl(rawImageStr),
              hoursLeft
            };
          });

        setExpiringSoonProducts(mappedExpiring);
      } catch (e) {
        console.error("Error fetching expiring offers", e);
      }
    };
    fetchExpiringOffers();
  }, []);

  // 3. Debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 600);
    return () => clearTimeout(timerId);
  }, [searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice, activeSort, selectedCategories, selectedBrands]);

  const getSortParams = (sort: SortType) => {
    switch (sort) {
      case "cheapest": return { sortBy: "price", sortOrder: "asc" };
      case "expensive": return { sortBy: "price", sortOrder: "desc" };
      case "newest": 
      case "bestselling": 
      case "most_viewed": 
      case "bestoffer": 
      default: return { sortBy: "relevance", sortOrder: "desc" }; 
    }
  };

  // 4. Fetch Paginated Grid Products
  useEffect(() => {
    let ignore = false;

    const fetchMainOffers = async () => {
      try {
        if (page === 1) setIsLoading(true);
        else setIsFetchingNextPage(true);

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

        const data = await OffersPublicApi.searchOffers({
          search: debouncedSearch,
          minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
          maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
          sortBy,
          sortOrder,
          categoryId,
          brandId,
          page, 
          pageSize: PAGE_SIZE 
        });

        if (ignore) return;

        const rawArray = Array.isArray(data) ? data : (data?.items || data?.Items || data?.data || []);
        
        // Ensure we only show items that ACTUALLY have an offer. 
        // If the backend search returns non-offer items, we filter them out client-side here.
        const offerItemsOnly = rawArray.filter((p: any) => {
            const sPrice = Number(p.salePrice || p.SalePrice || 0);
            const oPrice = Number(p.originalPrice || p.OriginalPrice || 0);
            return sPrice > 0 && sPrice < oPrice;
        });

        setTotalProductsCount(data?.totalCount || data?.TotalCount || offerItemsOnly.length);

        const mappedProducts = offerItemsOnly.map((p: any, index: number) => {
          let rawImageStr = "";
          if (Array.isArray(p.images) && p.images.length > 0) {
            const mainImg = p.images.find((img: any) => img?.isMain) || p.images[0];
            rawImageStr = mainImg?.imageUrl || "";
          }

          const oPrice = Number(p.originalPrice || p.OriginalPrice || 0);
          const sPrice = Number(p.salePrice || p.SalePrice || 0);
          const discountPercent = Math.round(((oPrice - sPrice) / oPrice) * 100);

          return {
            id: p.productId || p.id || index,
            name: p.productName || p.ProductName || "",
            price: sPrice,
            oldPrice: oPrice,
            discount: discountPercent,
            category: p.categoryName || p.CategoryName || "",
            brand: p.brandName || p.BrandName || "",
            rating: p.averageRating || 5,
            sales: p.soldQuantity || 0,
            offerEndDate: p.saleEndAt || p.SaleEndAt,
            imageUrl: OffersPublicApi.getImageUrl(rawImageStr),
          };
        });

        if (page === 1) {
          setProducts(mappedProducts);
        } else {
          setProducts(prev => [...prev, ...mappedProducts]);
        }

        // If the backend returned fewer items than PAGE_SIZE, we've hit the end.
        setHasMore(rawArray.length === PAGE_SIZE);

      } catch (err) {
        if (!ignore) {
          if (page === 1) setProducts([]);
          setHasMore(false);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsFetchingNextPage(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchMainOffers();
    return () => { ignore = true; };
  }, [
    page, debouncedSearch, debouncedMinPrice, debouncedMaxPrice, 
    activeSort, selectedCategories, selectedBrands, rawCategories, rawBrands
  ]);

  // 5. Intersection Observer
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
      const cardWidth = (container.firstElementChild as HTMLElement).offsetWidth + 16;
      container.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    }
  };

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

  if (isInitialLoad) {
    return (
      <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#C68E58] animate-spin" />
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">در حال دریافت محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-16 transition-colors duration-300">
      <OffersHeader />

      <div className="container mx-auto max-w-[1400px] px-4 -mt-6 relative z-20">
        {expiringSoonProducts.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 bg-white dark:bg-[#1A110F] w-fit px-5 sm:px-6 py-3 rounded-2xl shadow-sm border border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
                <Flame className="w-6 h-6 text-[#D95D39] animate-bounce" />
                <h2 className="text-lg sm:text-xl font-black text-[#D95D39]">
                  پیشنهادهای لحظه آخری
                </h2>
                <span className="hidden sm:inline-block text-xs font-bold text-[#A1A1A1] mr-2">
                  (کمتر از ۲۴ ساعت)
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 mt-2 md:mt-3">
                <button
                  onClick={() => scrollTopSlider("right")}
                  disabled={isTopAtRight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-[#1A110F] border ${
                    isTopAtRight
                      ? "border-[#E3C3A4]/50 dark:border-[#3A221C] text-[#D1C8B8] dark:text-[#3A221C] cursor-default"
                      : "border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] shadow-sm active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTopSlider("left")}
                  disabled={isTopAtLeft}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-[#1A110F] border ${
                    isTopAtLeft
                      ? "border-[#E3C3A4]/50 dark:border-[#3A221C] text-[#D1C8B8] dark:text-[#3A221C] cursor-default"
                      : "border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] shadow-sm active:scale-95"
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
                  <ExpiringOfferCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="hidden lg:block w-[280px] shrink-0">
            <FilterSideBar
              availableCategories={availableCategories} 
              availableBrands={availableBrands}         
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

          <div className="flex-1" ref={productsTopRef}>
            <SortBar
              activeSort={activeSort}
              onSortChange={handleSortChange}
              productCount={totalProductsCount}
              options={OFFERS_SORT_OPTIONS}
            />

            {products.length === 0 && !isLoading ? (
              <div className="bg-white dark:bg-[#1A110F] rounded-[24px] border border-[#F5EFE6] dark:border-[#3c2317] p-10 flex flex-col items-center justify-center text-center h-64 transition-colors">
                <Search className="w-12 h-12 text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 transition-colors" />
                <h3 className="text-lg font-black text-[#3D2616] dark:text-[#EAE0D5] mb-2 transition-colors">
                  کالایی یافت نشد!
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 text-sm font-bold text-[#C68E58] hover:text-[#A87242] transition-colors"
                >
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 ${isLoading && page === 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                  {products.map((product, index) => (
                    <OfferCard key={product.id} product={product} index={index} />
                  ))}
                </div>
                
                {/* Intersection Observer Target */}
                <div ref={observerTarget} className="w-full h-24 mt-8 flex flex-col items-center justify-center">
                  {isFetchingNextPage && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری پیشنهادات بیشتر...</span>
                    </div>
                  )}
                  
                  {!hasMore && products.length > 0 && !isLoading && (
                    <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#6A5A4F] mt-4">
                      پایان لیست پیشنهادات
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}