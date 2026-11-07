// app/(main)/shop/api.ts
// cSpell:disable
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export interface SearchProductParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export class ShopPublicApi {
  /**
   * Calls the backend Product Search endpoint
   */
  static async searchProducts(params: SearchProductParams = {}) {
    const url = new URL(`${API_BASE_URL}/api/Product/Search`);
    
    if (params.search) url.searchParams.append("Search", params.search);
    if (params.categoryId) url.searchParams.append("CategoryId", params.categoryId.toString());
    if (params.brandId) url.searchParams.append("BrandId", params.brandId.toString());
    if (params.minPrice) url.searchParams.append("MinPrice", params.minPrice.toString());
    if (params.maxPrice) url.searchParams.append("MaxPrice", params.maxPrice.toString());
    if (params.sortBy) url.searchParams.append("SortBy", params.sortBy);
    if (params.sortOrder) url.searchParams.append("SortOrder", params.sortOrder);
    if (params.page) url.searchParams.append("Page", params.page.toString());
    if (params.pageSize) url.searchParams.append("PageSize", params.pageSize.toString());

    try {
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        // 🚀 THIS WILL LOG THE EXACT C# ERROR TO YOUR CONSOLE
        const errorText = await res.text();
        console.error(`Backend Search Error (${res.status}):`, errorText, "\nRequested URL:", url.toString());
        throw new Error("Failed to fetch products");
      }
      return res.json();
    } catch (err) {
      console.error("Search API Network Error:", err);
      throw err;
    }
  }

  static async getCategories() {
    const res = await fetch(`${API_BASE_URL}/api/Category/GetAll`);
    if (!res.ok) return { items: [] };
    return res.json();
  }

  static async getBrands() {
    const res = await fetch(`${API_BASE_URL}/api/Brand/GetAll`);
    if (!res.ok) return { items: [] };
    return res.json();
  }

  static getImageUrl(path: string) {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}