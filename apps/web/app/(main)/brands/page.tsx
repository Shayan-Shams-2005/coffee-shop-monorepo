// app/(main)/brands/page.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Award, Loader2 } from "lucide-react";

import { BrandCard } from "../../../components/brands/BrandCard";
import { UIBrandGroup } from "../../../components/brands/types";
import { PublicBrandApi } from "./api"; // 🚀 FIXED: Using the newly created local API file

export default function BrandsPage() {
  const [groups, setGroups] = useState<UIBrandGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 10;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;

    const loadGroups = async () => {
      try {
        if (page === 1) setIsLoading(true);
        else setIsFetchingNextPage(true);
        setError("");

        const data = await PublicBrandApi.getAllGroupsWithBrands(page, PAGE_SIZE);
        const rawGroups = Array.isArray(data) ? data : (data.items || []);

        const mappedGroups: UIBrandGroup[] = rawGroups.map((g: any) => ({
          id: g.brandGroupId?.toString() || g.id?.toString() || "",
          name: g.name || "",
          brands: (g.brands || []).map((b: any) => ({
            id: b.brandId?.toString() || b.id?.toString() || "",
            name: b.brandName || b.name || "",
            image: PublicBrandApi.getImageUrl(b.mainImageUrl || b.image),
          }))
        }));

        if (!ignore) {
          if (page === 1) setGroups(mappedGroups);
          else setGroups(prev => [...prev, ...mappedGroups]);
          
          setHasMore(rawGroups.length === PAGE_SIZE);
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
        if (!ignore) {
          setError("دریافت اطلاعات برندها با خطا مواجه شد.");
          if (page === 1) setGroups([]);
          setHasMore(false);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsFetchingNextPage(false);
        }
      }
    };

    loadGroups();

    return () => { ignore = true; };
  }, [page]);

  // Intersection Observer for Infinite Scroll
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

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return groups;

    return groups
      .map((group) => ({
        ...group,
        brands: group.brands.filter((brand) =>
          brand.name.toLocaleLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.brands.length > 0);
  }, [groups, searchQuery]);

  const totalBrands = groups.reduce((total, group) => total + group.brands.length, 0);
  const filteredBrandsCount = filteredGroups.reduce((total, group) => total + group.brands.length, 0);

  if (isLoading && page === 1) {
    return (
      <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300">
      <div className="container mx-auto max-w-[1440px] px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#BA8D71] mb-8 font-bold">
          <Link href="/" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">
            خانه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
          <span className="text-[#3D2616] dark:text-[#EAE0D5]">
            تمام برندها
          </span>
        </nav>

        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-9 bg-[#C68E58] rounded-full" />
            <Award className="w-7 h-7 text-[#C68E58]" />
            <h1 className="text-2xl md:text-3xl font-black text-[#3D2616] dark:text-white">
              تمام برندها
            </h1>
          </div>
          <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] mr-5">
            برند مورد علاقه خود را از میان مجموعه برندهای ما پیدا کنید.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A18B78]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام برند در لیست فعلی..."
            dir="rtl"
            className="w-full h-12 pr-12 pl-4 rounded-2xl bg-white dark:bg-[#1A110F] border border-[#F0E4D8] dark:border-[#3C2317] text-[#3D2616] dark:text-[#EAE0D5] placeholder:text-[#A18B78] outline-none focus:border-[#C68E58] transition-colors"
          />
        </div>

        {/* Error */}
        {error && page === 1 && (
          <div className="bg-white dark:bg-[#1A110F] border border-red-200 dark:border-red-900 rounded-2xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm font-bold text-[#C68E58]">
              تلاش مجدد
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                {searchQuery
                  ? `${filteredBrandsCount} برند پیدا شد`
                  : `${groups.length} گروه برند`}
              </p>
              <span className="text-xs text-[#A18B78] dark:text-[#8C7A6B]">
                {searchQuery
                  ? `${filteredBrandsCount} از ${totalBrands} برند`
                  : `${totalBrands} برند`}
              </span>
            </div>

            {/* Brand Groups */}
            {filteredGroups.length === 0 ? (
              <div className="bg-white dark:bg-[#1A110F] border border-[#F0E4D8] dark:border-[#3C2317] rounded-3xl p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-[#C68E58]/50" />
                <h2 className="text-lg font-black text-[#3D2616] dark:text-[#EAE0D5] mb-2">برندی پیدا نشد!</h2>
                <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1]">عبارت دیگری را جستجو کنید.</p>
                <button onClick={() => setSearchQuery("")} className="mt-5 text-sm font-bold text-[#C68E58] hover:text-[#A87242]">
                  پاک کردن جستجو
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-12">
                {filteredGroups.map((group) => (
                  <section key={group.id} className="scroll-mt-24">
                    <div className="flex items-center justify-between border-b border-[#E9D9C9] dark:border-[#3C2317] pb-4 mb-6">
                      <h2 className="text-lg md:text-xl font-black text-[#3D2616] dark:text-[#EAE0D5]">{group.name}</h2>
                      <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">{group.brands.length} برند</span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-5">
                      {group.brands.map((brand) => (
                        <BrandCard key={brand.id} brand={brand} />
                      ))}
                    </div>
                  </section>
                ))}
                
                {/* Intersection Observer Target */}
                <div ref={observerTarget} className="w-full h-24 flex flex-col items-center justify-center">
                  {isFetchingNextPage && (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-6 h-6 text-[#C68E58] animate-spin" />
                      <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری برندهای بیشتر...</span>
                    </div>
                  )}
                  {!hasMore && groups.length > 0 && (
                    <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#6A5A4F]">پایان لیست برندها</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}