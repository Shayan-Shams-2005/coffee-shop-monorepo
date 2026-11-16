// app/(main)/offers/api.ts

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export interface OffersSearchParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
  hasOfferOnly?: boolean; // Custom flag to fetch only offers if your backend supports it, otherwise we filter in the client
}

export const OffersPublicApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    if (/^(https?:\/\/|data:image|blob:)/i.test(url)) return url;
    
    let cleaned = url.replace(/\\/g, '/'); 
    cleaned = cleaned.replace(/^file:[\/]*:?/i, ''); 
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
    if (cleaned.toLowerCase().startsWith('file')) {
       cleaned = cleaned.replace(/^file.*/i, '/');
    }
    
    const match = cleaned.match(/(Categories|Brands|Products|uploads|images)\/.*/i);
    if (match) {
       cleaned = `/${match[0]}`;
    } else {
       const parts = cleaned.split('/');
       cleaned = `/${parts[parts.length - 1]}`;
    }
    
    return `${API_BASE_URL}${cleaned}`;
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getBrands: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },

  searchOffers: async (params: OffersSearchParams) => {
    const query = new URLSearchParams();
    
    if (params.search) query.append("Search", params.search);
    if (params.categoryId) query.append("CategoryId", params.categoryId.toString());
    if (params.brandId) query.append("BrandId", params.brandId.toString());
    if (params.minPrice !== undefined) query.append("MinPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined) query.append("MaxPrice", params.maxPrice.toString());
    if (params.sortBy) query.append("SortBy", params.sortBy);
    if (params.sortOrder) query.append("SortOrder", params.sortOrder);
    if (params.page) query.append("Page", params.page.toString());
    if (params.pageSize) query.append("PageSize", params.pageSize.toString());
    
    // Note: If your backend has a specific endpoint or flag for "HasOffer=true", you should append it here.
    // E.g. query.append("HasOffer", "true");

    const url = `${API_BASE_URL}/api/Product/Search/search?${query.toString()}`;
    
    const res = await fetch(url, { 
        cache: 'no-store',
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!res.ok) throw new Error(`Failed to fetch offers: ${res.status} ${res.statusText}`);
    return res.json();
  },
  
  // To get the "Expiring Soon" products, we might need all offers without pagination limit
  getAllOffersQuick: async () => {
      // Assuming sorting by relevance or bestoffer
      const res = await fetch(`${API_BASE_URL}/api/Product/GetAll`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
  }
};