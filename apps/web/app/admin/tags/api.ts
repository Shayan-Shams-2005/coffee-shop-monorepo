// app/admin/tags/api.ts

import { AuthApi } from "../../login/api"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

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

export const ProductTagApi = {
  // GET /api/ProductTag/GetAll
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("خطا در دریافت لیست تگ‌ها");
    return res.json();
  },

  // GET /api/ProductTag/GetById/{id}
  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/GetById/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("خطا در دریافت اطلاعات تگ");
    return res.json();
  },

  // POST /api/ProductTag/Create
  create: async (data: { name: string }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), 
    });

    if (!res.ok) {
        let errorMessage = "خطا در ایجاد تگ";
        try {
            const errorData = await res.json();
            if (errorData?.message) errorMessage = errorData.message;
            else if (errorData?.errors) errorMessage = Object.values(errorData.errors).flat().join("\n");
        } catch(e) {}
        throw new Error(errorMessage);
    }
    return res.json();
  },

  // PUT /api/ProductTag/Update/{id}
  update: async (id: number, data: { name: string }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
        let errorMessage = "خطا در ویرایش تگ";
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

  // DELETE /api/ProductTag/Delete/{id}
  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/ProductTag/Delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
        let errorMessage = "خطا در حذف تگ";
        try {
            const errorData = await res.json();
            if (errorData?.message) errorMessage = errorData.message;
        } catch(e) {}
        throw new Error(errorMessage);
    }
    
    return true;
  },
};