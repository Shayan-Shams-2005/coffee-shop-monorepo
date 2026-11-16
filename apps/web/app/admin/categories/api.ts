// app/admin/categories/api.ts

import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// ============================================================================
// 🚀 SMART JWT FETCHER 
// ============================================================================
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; 
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
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

// ============================================================================
// 🚀 Category APIs
// ============================================================================
export const CategoryApi = {
  // 🚀 FIXED: تابع امن و هوشمند برای تبدیل مسیرهای فیزیکی به لینک‌های معتبر وب
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    if (/^(https?:\/\/|data:image|blob:)/i.test(url)) return url;
    
    let cleaned = url.replace(/\\/g, '/'); 
    cleaned = cleaned.replace(/^file:\/{2,3}/i, ''); 
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
    
    const match = cleaned.match(/(Categories|Brands|Products|uploads|images)\/.*/i);
    if (match) {
       cleaned = `/${match[0]}`;
    } else {
       const parts = cleaned.split('/');
       cleaned = `/${parts[parts.length - 1]}`;
    }
    
    return `${API_BASE_URL}${cleaned}`;
  },

  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("خطا در دریافت لیست دسته‌بندی‌ها");
    return res.json();
  },

  getTree: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetTree/tree`, { cache: 'no-store' });
    if (!res.ok) throw new Error("خطا در دریافت درخت دسته‌بندی‌ها");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("خطا در دریافت اطلاعات دسته‌بندی");
    return res.json();
  },

  create: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Create`, {
      method: "POST",
      body: formData, 
    });

    if (!res.ok) {
        let errorMessage = "خطا در ایجاد دسته‌بندی";
        try {
            const errorData = await res.json();
            if (errorData?.message) errorMessage = errorData.message;
            else if (errorData?.errors) errorMessage = Object.values(errorData.errors).flat().join("\n");
        } catch(e) {}
        throw new Error(errorMessage);
    }
    return res.json();
  },

  update: async (id: number, formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Update/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
        let errorMessage = "خطا در ویرایش دسته‌بندی";
        try {
            const errorData = await res.json();
            if (errorData?.message) errorMessage = errorData.message;
            else if (errorData?.errors) errorMessage = Object.values(errorData.errors).flat().join("\n");
        } catch(e) {}
        throw new Error(errorMessage);
    }
    
    if (res.status === 204) return true;
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
        let errorMessage = "خطا در حذف دسته‌بندی";
        try {
            const errorData = await res.json();
            if (errorData?.message) errorMessage = errorData.message;
        } catch(e) {}
        throw new Error(errorMessage);
    }
    
    return true;
  },
};