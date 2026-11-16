
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2 } from "lucide-react";

import { UIBrandGroup, UIBrand } from "./types";
import { BrandGroup } from "./components/BrandGroup";
import { BrandModal } from "./components/BrandModal";
import { BrandGroupModal } from "./components/BrandGroupModal";

import { BrandGroupApi, BrandApi } from "./api";
import { ProductApi } from "../products/api";

// Handles different API response structures.
const extractApiArray = (
  payload: unknown,
  label: string,
  depth = 0
): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload === null || payload === undefined) {
    return [];
  }

  if (depth > 5) {
    throw new Error(
      `${label}: API response nesting is too deep.`
    );
  }

  // Handle JSON encoded as a string.
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return extractApiArray(parsed, label, depth + 1);
    } catch {
      throw new Error(
        `${label}: API returned a string instead of an array.`
      );
    }
  }

  if (typeof payload !== "object") {
    throw new Error(
      `${label}: Unexpected API response type: ${typeof payload}`
    );
  }

  const response = payload as Record<string, unknown>;

  // Common ASP.NET and REST API response wrappers.
  const wrapperKeys = [
    "items",
    "data",
    "result",
    "results",
    "brandGroups",
    "brandGroup",
    "$values",
    "value",
  ];

  for (const wrapperKey of wrapperKeys) {
    const actualKey = Object.keys(response).find(
      (key) => key.toLowerCase() === wrapperKey.toLowerCase()
    );

    if (actualKey) {
      const value = response[actualKey];

      if (value !== null && value !== undefined) {
        return extractApiArray(
          value,
          label,
          depth + 1
        );
      }
    }
  }

  throw new Error(
    `${label}: Could not find an array in the API response. ` +
    `Received properties: ${Object.keys(response).join(", ")}`
  );
};

export default function AdminBrandsPage() {
  const [brandGroups, setBrandGroups] = useState<UIBrandGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<UIBrand | null>(null);

  const [selectedGroupIdForNewBrand, setSelectedGroupIdForNewBrand] =
    useState<string | null>(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UIBrandGroup | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const PAGE_SIZE = 10;
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchBrandsAndGroups = async (
    currentPage: number,
    replace = false
  ) => {
    try {
      if (currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      const [groupsData, productsData] = await Promise.all([
        BrandGroupApi.getAll(currentPage, PAGE_SIZE),

        ProductApi.getAll().catch((error) => {
          console.error("Failed to load products:", error);
          return [];
        }),
      ]);

      // Normalize API responses.
      const rawGroups = extractApiArray(
        groupsData,
        "Brand Groups"
      );

      const rawProducts = extractApiArray(
        productsData,
        "Products"
      );

      console.log("Brand Groups API response:", groupsData);
      console.log("Normalized brand groups:", rawGroups);

      const mappedGroups: UIBrandGroup[] = rawGroups.map(
        (g: any) => {
          const groupBrands = extractApiArray(
            g?.brands ?? g?.Brands,
            `Brands in group ${g?.name ?? g?.Name ?? ""}`
          );

          const brands: UIBrand[] = groupBrands.map(
            (b: any) => {
              const brandId = b?.brandId ?? b?.BrandId;
              const brandName =
                b?.brandName ??
                b?.BrandName ??
                b?.name ??
                b?.Name;

              const matchingProductsCount = rawProducts.filter(
                (p: any) => {
                  const productBrandId =
                    p?.brandId ?? p?.BrandId;

                  const productBrandName =
                    p?.brandName ?? p?.BrandName;

                  return (
                    (brandId != null &&
                      String(productBrandId) === String(brandId)) ||
                    (brandName &&
                      productBrandName === brandName)
                  );
                }
              ).length;

              return {
                id:
                  brandId?.toString() ||
                  b?.id?.toString() ||
                  b?.Id?.toString() ||
                  "",
                name: brandName || "",
                groupId:
                  (b?.brandGroupId ?? b?.BrandGroupId)?.toString() ||
                  (g?.brandGroupId ?? g?.BrandGroupId)?.toString() ||
                  "",
                image: BrandApi.getImageUrl(
                  b?.mainImageUrl ??
                  b?.MainImageUrl ??
                  b?.image ??
                  b?.Image
                ),
                productCount: matchingProductsCount,
              };
            }
          );

          return {
            id:
              (g?.brandGroupId ?? g?.BrandGroupId)?.toString() ||
              g?.id?.toString() ||
              g?.Id?.toString() ||
              "",
            name: g?.name ?? g?.Name ?? "",
            slug: g?.slug ?? g?.Slug ?? "",
            displayOrder:
              g?.displayOrder ?? g?.DisplayOrder ?? 0,
            brands,
          };
        }
      );

      const sortedGroups = mappedGroups.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );

      setBrandGroups((prev) => {
        if (replace) {
          return sortedGroups;
        }

        return [...prev, ...sortedGroups];
      });

      // Expand the first group on initial load.
      const firstGroup = sortedGroups[0];

      if (
        currentPage === 1 &&
        firstGroup &&
        expandedGroups.length === 0
      ) {
        setExpandedGroups([firstGroup.id]);
      }

      setHasMore(rawGroups.length === PAGE_SIZE);

    } catch (error) {
      console.error("Failed to load brands:", error);

      const message =
        error instanceof Error
          ? error.message
          : "خطا در دریافت لیست برندها";

      alert(message);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  // Initial loading and pagination.
  useEffect(() => {
    fetchBrandsAndGroups(page, page === 1);
  }, [page]);

  // Infinite scrolling.
  useEffect(() => {
    const target = observerTarget.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFetchingNextPage
        ) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, isFetchingNextPage]);

  // Expand / collapse groups.
  const toggleExpand = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    );
  };

  // Reload data after changes.
  const reloadData = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchBrandsAndGroups(1, true);
    }
  };

  // Open brand modal.
  const handleOpenBrandModal = (
    groupId: string | null,
    brand?: UIBrand
  ) => {
    setEditingBrand(brand || null);
    setSelectedGroupIdForNewBrand(groupId);
    setIsBrandModalOpen(true);
  };

  // Delete brand.
  const handleDeleteBrand = async (id: string) => {
    if (confirm("آیا از حذف این برند اطمینان دارید؟")) {
      try {
        await BrandApi.delete(Number(id));
        reloadData();
      } catch (error: any) {
        alert(error.message || "خطا در حذف برند.");
      }
    }
  };

  // Create / update brand.
  const handleBrandModalSubmit = async (data: {
    name: string;
    groupId: string;
    file: File | null;
  }) => {
    try {
      const formData = new FormData();

      formData.append("BrandName", data.name);
      formData.append("BrandGroupId", data.groupId);

      if (data.file) {
        formData.append("File", data.file);
      }

      if (editingBrand) {
        await BrandApi.update(
          Number(editingBrand.id),
          formData
        );
      } else {
        if (!data.file) {
          alert("برای ایجاد برند جدید، تصویر الزامی است.");
          return;
        }

        await BrandApi.create(formData);
      }

      setIsBrandModalOpen(false);
      reloadData();

    } catch (error: any) {
      alert(error.message || "خطا در ذخیره برند.");
    }
  };

  // Open group modal.
  const handleOpenGroupModal = (
    group?: UIBrandGroup
  ) => {
    setEditingGroup(group || null);
    setIsGroupModalOpen(true);
  };

  // Delete group.
  const handleDeleteGroup = async (id: string) => {
    if (
      confirm(
        "آیا از حذف این گروه برند اطمینان دارید؟ توجه کنید که گروه نباید شامل برند باشد."
      )
    ) {
      try {
        await BrandGroupApi.delete(Number(id));
        reloadData();
      } catch (error: any) {
        alert(error.message || "خطا در حذف گروه برند.");
      }
    }
  };

  // Create / update group.
  const handleGroupModalSubmit = async (data: {
    name: string;
    displayOrder: number;
  }) => {
    try {
      if (editingGroup) {
        await BrandGroupApi.update(
          Number(editingGroup.id),
          data
        );
      } else {
        await BrandGroupApi.create(data);
      }

      setIsGroupModalOpen(false);
      reloadData();

    } catch (error: any) {
      alert(error.message || "خطا در ذخیره گروه برند.");
    }
  };

  // Initial loading screen.
  if (isLoading && page === 1) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>

        در حال بارگذاری اطلاعات...
      </div>
    );
  }

  return (
    <div
      className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500"
      dir="rtl"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.strict-persian-input { text-align: right !important; direction: rtl !important; } .strict-persian-input::placeholder { text-align: right !important; direction: rtl !important; }`,
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">
            مدیریت برندها و گروه‌ها
          </h1>

          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
            دسته‌بندی و مدیریت برندهای فروشگاه
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <button
            onClick={() => handleOpenGroupModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#1A0F0C] text-[#C68E58] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58]/50 px-4 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
          >
            <FolderPlus className="w-5 h-5" />
            گروه جدید
          </button>

          <button
            onClick={() =>
              handleOpenBrandModal(brandGroups[0]?.id || null)
            }
            disabled={brandGroups.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            برند جدید
          </button>
        </div>
      </div>

      {/* Brand groups */}
      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {brandGroups.length > 0 ? (
            <>
              {brandGroups.map((group) => (
                <BrandGroup
                  key={group.id}
                  group={group}
                  isExpanded={expandedGroups.includes(group.id)}
                  onToggleExpand={toggleExpand}
                  onAddBrand={() =>
                    handleOpenBrandModal(group.id)
                  }
                  onEditBrand={(brand) =>
                    handleOpenBrandModal(group.id, brand)
                  }
                  onDeleteBrand={handleDeleteBrand}
                  onEditGroup={() =>
                    handleOpenGroupModal(group)
                  }
                  onDeleteGroup={() =>
                    handleDeleteGroup(group.id)
                  }
                />
              ))}

              {/* Infinite scroll observer */}
              <div
                ref={observerTarget}
                className="w-full h-24 mt-8 flex flex-col items-center justify-center"
              >
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-[#C68E58] animate-spin" />

                    <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                      بارگذاری گروه‌های بیشتر...
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold flex flex-col items-center gap-3">
              ابتدا باید یک گروه برند ایجاد کنید.
            </div>
          )}
        </div>
      </div>

      {/* Brand modal */}
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        editingBrand={editingBrand}
        groups={brandGroups}
        defaultGroupId={selectedGroupIdForNewBrand}
        onSubmit={handleBrandModalSubmit}
      />

      {/* Brand group modal */}
      <BrandGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        editingGroup={editingGroup}
        onSubmit={handleGroupModalSubmit}
      />
    </div>
  );
}
