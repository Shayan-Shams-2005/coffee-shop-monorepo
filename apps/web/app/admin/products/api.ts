// مسیر دقیق: app/admin/products/api.ts

import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// ==========================================
// 🚀 Types (منطبق با DTOهای بک‌اند)
// ==========================================
export interface ProductUpdateData {
  ProductName: string;
  OriginalPrice: number;
  SalePrice: number | null; 
  Description: string;
  StockQuantity: number;
  CategoryId: number;
  BrandId: number;
  HasOffer: boolean;
  OfferEndDate: string | null;
  SaleDurationMinutes?: number | null; 
}

export interface SpecificationPayload {
  Key: string;
  Value: string;
  DisplayOrder: number;
  IsMain: boolean;
}

export interface AttributePayload {
  attributes: { name: string; values: string[] }[];
}

export interface VariantPayload {
  Sku: string;
  OriginalPrice: number;
  SalePrice: number | null;
  SaleDurationMinutes: number | null;
  StockQuantity: number;
  AttributeValueIds: number[];
}

// ==========================================
// Dummy Image Generator
// ==========================================
const createDummyImageFile = (): File => {
  const tinyPng = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 
    8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 
    5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
  ]);
  return new File([tinyPng], "placeholder.png", { type: "image/png" });
};

// ============================================================================
// 🚀 SMART JWT FETCHER
// ============================================================================
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

// ============================================================================
// APIs (🚀 اصلاح آدرس‌ها دقیقاً بر اساس روت‌های C#)
// ============================================================================
export const ProductApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    let cleaned = url.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    
    cleaned = cleaned.replace(/^file:\/\/\//i, '').replace(/^[a-zA-Z]:\//i, '/');
    
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
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return res.json();
  },

  create: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product`, {
      method: "POST",
      body: formData, 
    });
    if (!res.ok) throw new Error(`Creation failed: ${await res.text()}`);
    return res.json();
  },

  update: async (id: number, data: ProductUpdateData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Update failed: ${await res.text()}`);
    return res.status === 204 ? true : res.json();
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Deletion failed for product ${id}`);
    return res.status === 204;
  },

  addImage: async (productId: number, file: File, isMain: boolean = false) => {
    const formData = new FormData();
    formData.append("File", file); 
    formData.append("isMain", isMain.toString());

    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${productId}/images`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`آپلود عکس با خطا مواجه شد: ${await res.text() || res.status}`);
    return res.status === 204 ? true : res.json(); 
  },

  setSpecifications: async (id: number, specs: SpecificationPayload[]) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${id}/specifications`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(specs), 
    });
    if (!res.ok) throw new Error(`ارور ولیدیشن مشخصات:\n ${await res.text()}`);
    return true;
  },

  setAttributes: async (id: number, attributesPayload: AttributePayload) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Product/${id}/attributes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attributesPayload),
    });
    if (!res.ok) throw new Error(`Failed to set attributes: ${await res.text()}`);
    return res.status === 204 ? true : res.json();
  }
};

export const ProductVariantApi = {
  create: async (productId: number, variantData: VariantPayload) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantData),
    });
    if (!res.ok) throw new Error(`Failed to create variant: ${await res.text()}`);
    return res.json();
  },

  update: async (productId: number, variantId: number, variantData: VariantPayload) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/${productId}/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantData),
    });
    if (!res.ok) throw new Error(`Failed to update variant: ${await res.text()}`);
    return res.status === 204 ? true : res.json();
  },

  delete: async (productId: number, variantId: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductVariant/${productId}/${variantId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete variant");
    return res.status === 204;
  }
};

export const CategoryApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
  create: async (name: string) => {
    const formData = new FormData();
    formData.append("CategoryName", name); 
    formData.append("File", createDummyImageFile());
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category`, { method: "POST", body: formData });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export const BrandApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },
  create: async (name: string) => {
    const formData = new FormData();
    formData.append("BrandName", name);
    formData.append("File", createDummyImageFile());
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand`, { method: "POST", body: formData });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};