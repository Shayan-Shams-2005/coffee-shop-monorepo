// app/admin/categories/api.ts
import { AuthApi } from "../../login/api"; 

// 🚀 FIX: پورت به 5103 تغییر یافت تا با بک‌اند شما هماهنگ باشد
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; 
  
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

export interface BackendCategory {
  categoryId: number;
  categoryName: string;
  mainImageUrl: string;
  parentId?: number | null;
  productCount?: number;
}

export const CategoryApi = {
  getAll: async (): Promise<BackendCategory[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getById: async (id: number): Promise<BackendCategory> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
  },

  create: async (formData: FormData): Promise<BackendCategory> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Create`, {
      method: "POST",
      body: formData, 
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  update: async (id: number, formData: FormData): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Update/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `خطای سرور با کد: ${res.status}`);
    }
  },

  getImageUrl: (path: string) => {
    if (!path) return "";
    
    let cleaned = path.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    
    cleaned = cleaned.replace(/^file:\/\/\//i, '');
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/');
    
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/).*/i);
    if (uploadFolderMatch) {
       cleaned = uploadFolderMatch[0];
    }
    
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  }
};