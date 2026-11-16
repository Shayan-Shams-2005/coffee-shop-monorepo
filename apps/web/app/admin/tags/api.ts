// app/admin/tags/api.ts
import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; 
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
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

export const ProductTagApi = {
  // Backend returns all tags at once
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/GetAll`);
    if (!res.ok) throw new Error("Failed to fetch product tags");
    return res.json();
  },

  create: async (data: { name: string }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create tag");
    }
    return res.json();
  },

  update: async (id: number, data: { name: string }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update tag");
    }
    return true; 
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete tag");
    }
    return true;
  }
};