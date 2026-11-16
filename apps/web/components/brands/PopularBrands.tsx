
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";

import { BrandCard } from "./BrandCard";
import { PublicBrandApi } from "./api";
import { UIBrandGroup } from "./types";

const HOME_GROUP_LIMIT = 10;
const HOME_BRAND_LIMIT = 16;

export function PopularBrands() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const [groups, setGroups] = useState<UIBrandGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isAtRight, setIsAtRight] = useState(true);
  const [isAtLeft, setIsAtLeft] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadBrands = async () => {
      try {
        setIsLoading(true);

        const result = await PublicBrandApi.getGroupsWithBrands(
          1,
          HOME_GROUP_LIMIT
        );

        if (ignore) return;

        setGroups(result.items);

        if (result.items[0]) {
          setActiveGroupId(result.items[0].id);
        }
      } catch (error) {
        console.error("Failed to load popular brands:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadBrands();

    return () => {
      ignore = true;
    };
  }, []);

  const activeGroup = groups.find(
    (group) => group.id === activeGroupId
  );

  const activeBrands = (activeGroup?.brands || []).slice(
    0,
    HOME_BRAND_LIMIT
  );

  const checkScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    if (scrollWidth <= clientWidth + 10) {
      setShowButtons(false);
      return;
    }

    setShowButtons(true);

    const currentScroll = Math.abs(Math.round(scrollLeft));

    setIsAtRight(currentScroll <= 15);
    setIsAtLeft(
      currentScroll + clientWidth >= scrollWidth - 15
    );
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollLeft = 0;
    }

    checkScroll();

    const timeout = setTimeout(checkScroll, 150);

    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkScroll);
    };
  }, [activeGroupId, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;

    if (
      !container ||
      !container.firstElementChild ||
      isScrolling.current
    ) {
      return;
    }

    isScrolling.current = true;

    const card = container.firstElementChild as HTMLElement;
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.columnGap) || 20;
    const cardWidth = card.offsetWidth + gap;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentAbs = Math.abs(container.scrollLeft);

    let targetAbs = currentAbs;

    if (direction === "left") {
      targetAbs =
        Math.ceil((currentAbs + 1) / cardWidth) * cardWidth;
    } else {
      targetAbs =
        Math.floor((currentAbs - 1) / cardWidth) * cardWidth;
    }

    targetAbs = Math.max(0, Math.min(targetAbs, maxScroll));

    const sign = container.scrollLeft > 0 ? 1 : -1;
    const targetPos = targetAbs * sign;

    container.style.scrollSnapType = "none";

    const startPos = container.scrollLeft;
    const duration = 400;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      container.scrollLeft =
        startPos + (targetPos - startPos) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        container.style.scrollSnapType = "";
        isScrolling.current = false;
        checkScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  if (isLoading) {
    return (
      <section className="my-16 md:my-24 relative max-w-[1440px] mx-auto px-4 sm:px-6 flex justify-center items-center h-[200px]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (groups.length === 0) return null;

  return (
    <section className="my-16 md:my-24 relative max-w-[1440px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#C68E58] rounded-full" />

            <h2 className="text-xl md:text-3xl font-black text-[#3D2616] dark:text-white tracking-tight flex items-center gap-3">
              <Award className="w-7 h-7 text-[#C68E58]" />
              برندها
            </h2>
          </div>

          <div
            className="flex flex-wrap items-center p-1.5 rounded-2xl w-fit bg-white border border-[#F5EFE6] dark:bg-[#160D0A] dark:border-[#231511]"
            role="tablist"
          >
            {groups.map((group) => (
              <button
                key={group.id}
                role="tab"
                aria-selected={activeGroupId === group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                  activeGroupId === group.id
                    ? "bg-[#C68E58] text-white shadow-md dark:bg-[#5C3A21] dark:text-[#EAE0D5]"
                    : "text-[#8C7A6B] hover:text-[#C68E58] dark:text-[#8C7A6B] dark:hover:text-[#EAE0D5]"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {showButtons && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("right")}
              disabled={isAtRight}
              aria-label="اسکرول به راست"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtRight
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-[#1A0F0C] dark:border-[#3C2317] dark:text-[#5C3A21] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3C2317]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll("left")}
              disabled={isAtLeft}
              aria-label="اسکرول به چپ"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isAtLeft
                  ? "bg-white border-[#E3C3A4]/50 text-[#D1C8B8] dark:bg-[#1A0F0C] dark:border-[#3C2317] dark:text-[#5C3A21] cursor-default"
                  : "bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3C2317]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="-mx-1 px-1">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {activeBrands.length === 0 ? (
            <div className="w-full text-center py-10 text-[#8C7A6B] font-bold">
              هیچ برندی در این گروه ثبت نشده است.
            </div>
          ) : (
            activeBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))
          )}
        </div>
      </div>

      {/* View all brands */}
      <div className="flex justify-center mt-5">
        <Link
          href="/brands"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
        >
          مشاهده همه
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
