// cSpell:disable
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Search, Loader2 } from "lucide-react";

import { OffersHeader } from "../../../components/offers-page/OffersHeader";
import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { ExpiringOfferCard } from "../../../components/offers-page/ExpiringOfferCard";
import { OfferCard } from "../../../components/product/OfferCard";
import { SortBar, SortOption } from "../../../components/sort/SortBar";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const MAX_ALLOWED_PRICE = 5000000;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const topScrollRef = useRef<HTMLDivElement>(null);
  const productsTopRef = useRef<HTMLDivElement>(null);

  const [isTopAtRight, setIsTopAtRight] = useState(true);
  const [isTopAtLeft, setIsTopAtLeft] = useState(false);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Product/GetAll`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : (data.data || data.items || []);

        const mappedProducts = productsArray.map((p: any) => {
          const hasOffer = p.salePrice != null && p.salePrice < p.originalPrice;
          const discountPercent = hasOffer 
            ? Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100) 
            : 0;

          // 🚀 FIXED: Grab the precise imageUrl from your DTO
          const mainImage = p.images?.find((i: any) => i.isMain) || p.images?.[0];
          const rawPath = mainImage?.imageUrl || mainImage?.ImageUrl || "";
          
          // 🚀 FIXED: Run your specific ShopPublicApi URL cleaning logic
          let finalImageUrl = "/placeholder.png"; 
          if (rawPath) {
            let cleaned = rawPath.replace(/\\/g, '/');
            if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) {
               finalImageUrl = cleaned;
            } else {
               cleaned = cleaned.replace(/^file:\/\/\//i, '');
               cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
               const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/).*/i);
               if (uploadFolderMatch) {
                  cleaned = uploadFolderMatch[0];
               }
               finalImageUrl = cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
            }
          }

          return {
            id: p.productId,
            name: p.productName,
            price: hasOffer ? p.salePrice : p.originalPrice,
            oldPrice: p.originalPrice,
            discount: discountPercent,
            category: p.categoryName || "",
            brand: p.brandName || "",
            rating: p.averageRating || 5,
            sales: p.soldQuantity || 0,
            offerEndDate: p.saleEndAt,
            imageUrl: finalImageUrl,
            images: p.images || []
          };
        });

        setAllProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching offered products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const offeredProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.discount > 0)
      .map((p) => {
        let hoursLeft = 999; 
        if (p.offerEndDate) {
          const diffMs = new Date(p.offerEndDate).getTime() - Date.now();
          hoursLeft = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
        }
        return { ...p, hoursLeft };
      });
  }, [allProducts]);

  const availableCategories = useMemo(() => {
    const cats = offeredProducts.map((p) => p.category).filter(Boolean) as string[];
    return Array.from(new Set(cats));
  }, [offeredProducts]);

  const availableBrands = useMemo(() => {
    const brands = offeredProducts.map((p) => p.brand).filter(Boolean) as string[];
    return Array.from(new Set(brands));
  }, [offeredProducts]);

  const expiringSoonProducts = useMemo(
    () => offeredProducts.filter((p) => p.hoursLeft > 0 && p.hoursLeft < 24),
    [offeredProducts]
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
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    scrollToProducts();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
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
    let products = offeredProducts.filter((p) => p.hoursLeft >= 24);

    if (searchQuery.trim()) {
      products = products.filter(
        (p) =>
          p.name?.includes(searchQuery) ||
          (p.brand && p.brand.includes(searchQuery)) ||
          (p.category && p.category.includes(searchQuery))
      );
    }
    if (selectedCategories.length > 0) {
      products = products.filter(
        (p) => p.category && selectedCategories.includes(p.category)
      );
    }
    if (selectedBrands.length > 0) {
      products = products.filter(
        (p) => p.brand && selectedBrands.includes(p.brand)
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
    offeredProducts,
  ]);

  if (isLoading) {
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
                      : "border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] dark:hover:border-[#C68E58] dark:hover:text-[#C68E58] shadow-sm active:scale-95"
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
              productCount={filteredAndSortedProducts.length}
              options={OFFERS_SORT_OPTIONS}
            />

            {filteredAndSortedProducts.length === 0 ? (
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