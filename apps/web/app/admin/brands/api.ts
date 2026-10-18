// app/admin/brands/api.ts
import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// ============================================================================
// 🚀 SMART JWT FETCHER (Handles Cookies & Auto-Refresh)
// ============================================================================
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; // CRITICAL: Always send HttpOnly cookies
  
  let res = await fetch(url, options);

  // If the AccessToken expired, intercept the 401, refresh it, and try again
  if (res.status === 401) {
    try {
      await AuthApi.refreshToken();
      res = await fetch(url, options); // Retry original request
    } catch (error) {
      // If refresh fails (e.g., RefreshToken expired), throw a specific error
      throw new Error("SESSION_EXPIRED");
    }
  }
  return res;
};

// ============================================================================
// BRAND APIs
// ============================================================================

export interface BackendBrand {
  brandId: number;
  brandName: string;
  mainImageUrl: string;
}

export const BrandApi = {
  getAll: async (): Promise<BackendBrand[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },

  getById: async (id: number): Promise<BackendBrand> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brand");
    return res.json();
  },

  create: async (formData: FormData): Promise<BackendBrand> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Create`, {
      method: "POST",
      body: formData, 
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  update: async (id: number, formData: FormData): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Update/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete brand");
  },

  getImageUrl: (path: string) => {
    if (!path) return "";
    
    let cleaned = path.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    
    cleaned = cleaned.replace(/^file:\/\/\//i, '');
    
    // Safely extract the relative path (supports Brands folder from your C# backend)
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Brands\/).*/i);
    if (uploadFolderMatch) {
       cleaned = uploadFolderMatch[0];
    }
    
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  }
};