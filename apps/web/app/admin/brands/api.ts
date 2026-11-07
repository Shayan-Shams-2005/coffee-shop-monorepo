// app/admin/brands/api.ts
import { AuthApi } from "../../login/api";

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

export const BrandGroupApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/BrandGroup/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brand groups");
    return res.json();
  },
  create: async (data: { name: string; displayOrder: number }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/BrandGroup/Create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  update: async (id: number, data: { name: string; displayOrder: number }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/BrandGroup/Update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? true : res.json();
  },
  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/BrandGroup/Delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204;
  }
};

export const BrandApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    let cleaned = url.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    cleaned = cleaned.replace(/^file:\/\/\/?/gi, '/').replace(/^[a-zA-Z]:\//i, '/');
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/|\/Products\/).*/i);
    if (uploadFolderMatch) cleaned = uploadFolderMatch[0];
    else {
       const parts = cleaned.split('/');
       cleaned = '/' + parts[parts.length - 1];
    }
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  },
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },
  create: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Create`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  update: async (id: number, formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Update/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? true : res.json();
  },
  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Brand/Delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204;
  }
};