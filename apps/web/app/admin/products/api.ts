// app/admin/products/edit/api.ts
import { AuthApi } from "../../login/api"; 

// 1. Sanitize the base URL once to prevent double-slash issues globally
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// 2. Define standard interfaces for type safety matching your C# backend
export interface ProductUpdateData {
  ProductName: string;
  OriginalPrice: number;
  SalePrice: number | null; 
  Description: string;
  StockQuantity: number;
  CategoryId: number;
  BrandId: number;
  HasOffer: boolean;
  NewPrice?: number | null;
  OfferEndDate: string | null;
  SaleDurationMinutes?: number | null; // 🚀 Added to match backend payload requirements
}

// 3. Extract the dummy file generation to keep the code DRY
const createDummyImageFile = (): File => {
  const tinyPng = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 
    8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 
    5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
  ]);
  return new File([tinyPng], "placeholder.png", { type: "image/png" });
};

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
      throw new Error("SESSION_EXPIRED");
    }
  }
  return res;
};

// ============================================================================
// APIs
// ============================================================================

export const ProductApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    let cleaned = url.replace(/\\/g, '/');
    
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) {
      return cleaned;
    }
    
    // 🚀 FIX: Securely strip out file:/// and C:/ to prevent Security Errors
    cleaned = cleaned.replace(/^file:\/\/\//i, '');
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/');
    
    // 🚀 FIX: Added 'Products' to the allowed folders regex
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/|\/Products\/).*/i);
    if (uploadFolderMatch) {
       cleaned = uploadFolderMatch[0];
    } else {
       const parts = cleaned.split('/');
       cleaned = '/' + parts[parts.length - 1];
    }
    
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  },

  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return res.json();
  },

  create: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/Create`, {
      method: "POST",
      body: formData, 
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Creation failed: ${errorText}`);
    }
    return res.json();
  },

  update: async (id: number, data: ProductUpdateData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/Update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
    }
    return res.status === 204 ? true : res.json();
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Deletion failed for product ${id}`);
    return res.status === 204;
  },

  addImage: async (productId: number, file: File, isMain: boolean = false) => {
    const formData = new FormData();
    formData.append("File", file); 
    formData.append("file", file); 
    formData.append("isMain", isMain.toString());

    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/AddImage/${productId}/images?isMain=${isMain}`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`آپلود عکس سرور با خطا مواجه شد: ${errorText || res.status}`);
    }
    return res.status === 204 ? true : res.json(); 
  },

  setSpecifications: async (id: number, specs: any[]) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/SetSpecifications/${id}/specifications`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(specs), 
    });
    if (!res.ok) {
        // 🚀 FIX: Get the exact validation error from C# and show it!
        const errorText = await res.text();
        throw new Error(`ارور ولیدیشن مشخصات:\n ${errorText}`);
    }
    return true;
  },

  setAttributes: async (id: number, attributesPayload: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/SetAttributes/${id}/attributes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attributesPayload),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to set attributes: ${errorText}`);
    }
    return res.status === 204 ? true : res.json();
  }
};

export const ProductVariantApi = {
  create: async (productId: number, variantData: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/Create/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantData),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create variant: ${errorText}`);
    }
    return res.json();
  },

  update: async (productId: number, variantId: number, variantData: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/Update/${productId}/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantData),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update variant: ${errorText}`);
    }
    return res.status === 204 ? true : res.json();
  },

  delete: async (productId: number, variantId: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/Delete/${productId}/${variantId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete variant");
    return res.status === 204;
  }
};

export const CategoryApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
  
  create: async (name: string) => {
    const formData = new FormData();
    formData.append("CategoryName", name); 
    formData.append("File", createDummyImageFile());

    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Create`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export const BrandApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },
  
  create: async (name: string) => {
    const formData = new FormData();
    formData.append("BrandName", name);
    formData.append("File", createDummyImageFile());

    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Create`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};