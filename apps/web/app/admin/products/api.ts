// app/admin/products/api.ts

import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; 
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
    }
  }

  let res = await fetch(url, options);

  if (res.status === 401) {
    try {
      await AuthApi.refreshToken();
      res = await fetch(url, options); 
    } catch (error) {
      throw new Error("SESSION_EXPIRED");
    }
  }
  return res;
};

export interface AdminSearchProductsParams {
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

export const ProductApi = {
 // بخشی از app/admin/products/api.ts

  // 🚀 FIXED: فوق‌العاده مقاوم شده در برابر خطای file:/// مرورگر
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    // اگر آدرس یک Blob یا Base64 موقت است، دست نزن
    if (/^(data:image|blob:)/i.test(url)) return url;
    
    // اگر آدرس یک لینک کامل اینترنتی است، دست نزن
    if (/^https?:\/\//i.test(url)) return url; 

    // تبدیل بک‌اسلش‌های ویندوز به اسلش وب
    let cleaned = url.replace(/\\/g, '/'); 
    
    // حذف هرگونه پیشوند فایل محلی و درایو ویندوزی
    cleaned = cleaned.replace(/^file:[\/]*:?/i, ''); 
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
    
    // در بدترین حالت اگر باز هم file در رشته ماند، آن را اجباراً حذف کن
    if (cleaned.toLowerCase().startsWith('file')) {
       cleaned = cleaned.replace(/^file.*/i, '/');
    }

    // استخراج فقط مسیر مفید فولدر آپلود
    const match = cleaned.match(/(Categories|Brands|Products|uploads|images)\/.*/i);
    if (match) {
       cleaned = `/${match[0]}`;
    } else {
       const parts = cleaned.split('/');
       cleaned = `/${parts[parts.length - 1]}`; // فقط اسم فایل را بردار
    }
    
    return `${API_BASE_URL}${cleaned}`;
  },
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  // 🚀 FIXED: Added getById back into the API
  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch product details");
    return res.json();
  },

  search: async (params: AdminSearchProductsParams) => {
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

    const url = `${API_BASE_URL}/api/Product/Search/search?${query.toString()}`;
    const res = await fetchWithAuth(url, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
    
    if (!res.ok) throw new Error("Failed to fetch products via search");
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/Delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    return true;
  },
};

export const CategoryApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
};

export const BrandApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },
};