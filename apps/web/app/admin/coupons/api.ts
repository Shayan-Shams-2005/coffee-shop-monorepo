// app/admin/coupons/api.ts
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

export const OfferCodeApi = {
  getAll: async (page = 1, pageSize = 20) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/GetAll?Page=${page}&PageSize=${pageSize}`);
    if (!res.ok) throw new Error("Failed to fetch offer codes");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/GetById/${id}`);
    if (!res.ok) throw new Error("Failed to fetch offer code details");
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/Create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create offer code");
    }
    return res.json();
  },

  update: async (id: number, data: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/Update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update offer code");
    }
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete offer code (may have usage history)");
    }
    return true;
  },
  
  deactivate: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/AdminOfferCode/Deactivate/${id}/deactivate`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to deactivate offer code");
    return true;
  }
};