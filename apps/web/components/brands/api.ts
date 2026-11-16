
import { UIBrand, UIBrandGroup } from "./types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103"
).replace(/\/+$/, "");

interface PagedBrandGroups {
  items: UIBrandGroup[];
  page: number;
  pageSize: number;
  totalCount: number;
}

function extractPagedResult(data: any): {
  items: any[];
  totalCount: number | null;
} {
  if (Array.isArray(data)) {
    return { items: data, totalCount: null };
  }

  if (!data || typeof data !== "object") {
    return { items: [], totalCount: null };
  }

  const items =
    data.items ??
    data.Items ??
    data.results ??
    data.Results;

  if (Array.isArray(items)) {
    return {
      items,
      totalCount:
        data.totalCount ??
        data.TotalCount ??
        data.total ??
        data.Total ??
        null,
    };
  }

  if (data.data !== undefined) {
    return extractPagedResult(data.data);
  }

  if (data.result !== undefined) {
    return extractPagedResult(data.result);
  }

  return { items: [], totalCount: null };
}

function mapBrandGroup(group: any): UIBrandGroup {
  return {
    id: String(group.brandGroupId ?? group.BrandGroupId),
    name: group.name ?? group.Name ?? "",
    slug: group.slug ?? group.Slug ?? "",
    displayOrder: Number(
      group.displayOrder ?? group.DisplayOrder ?? 0
    ),
    brands: (group.brands ?? group.Brands ?? []).map((brand: any) => ({
      id: String(brand.brandId ?? brand.BrandId),
      name: brand.brandName ?? brand.BrandName ?? "",
      image:
        brand.mainImageUrl || brand.MainImageUrl
          ? PublicBrandApi.getImageUrl(
              brand.mainImageUrl ?? brand.MainImageUrl
            )
          : null,
      groupId: String(
        brand.brandGroupId ?? brand.BrandGroupId
      ),
    })),
  };
}

export const PublicBrandApi = {
  getImageUrl(url: string | null | undefined): string {
    if (!url) return "";

    let cleaned = url.replace(/\\/g, "/");

    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) {
      return cleaned;
    }

    cleaned = cleaned
      .replace(/^file:\/\/\/?/i, "/")
      .replace(/^[a-zA-Z]:\//, "/");

    const uploadFolderMatch = cleaned.match(
      /\/(uploads|images|categories|brands|products)\/.*/i
    );

    if (uploadFolderMatch) {
      cleaned = uploadFolderMatch[0];
    } else {
      const parts = cleaned.split("/");
      cleaned = "/" + parts[parts.length - 1];
    }

    return cleaned.startsWith("/")
      ? `${API_BASE_URL}${cleaned}`
      : `${API_BASE_URL}/${cleaned}`;
  },

  // Fetch one page of brand groups.
  getGroupsWithBrands: async (
    page = 1,
    pageSize = 20
  ): Promise<PagedBrandGroups> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/BrandGroup/GetAll?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch brand groups");
    }

    const data = await response.json();
    const result = extractPagedResult(data);

    return {
      items: result.items.map(mapBrandGroup),
      page,
      pageSize,
      totalCount: result.totalCount ?? result.items.length,
    };
  },

  // Fetch every page of brand groups.
  getAllGroupsWithBrands: async (): Promise<UIBrandGroup[]> => {
    const pageSize = 100;
    let page = 1;
    let allGroups: UIBrandGroup[] = [];
    let totalCount: number | null = null;

    while (page <= 100) {
      const result = await PublicBrandApi.getGroupsWithBrands(
        page,
        pageSize
      );

      allGroups = [...allGroups, ...result.items];

      totalCount = result.totalCount;

      if (result.items.length === 0) break;

      if (allGroups.length >= totalCount) break;

      if (result.items.length < pageSize) break;

      page++;
    }

    return allGroups.sort(
      (a, b) =>
        a.displayOrder - b.displayOrder ||
        Number(a.id) - Number(b.id)
    );
  },
};
