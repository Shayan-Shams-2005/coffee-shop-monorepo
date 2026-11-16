// app/admin/categories/api.ts

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

export const CategoryApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    if (/^(https?:\/\/|data:image|blob:)/i.test(url)) return url;
    
    let cleaned = url.replace(/\\/g, '/'); 
    cleaned = cleaned.replace(/^file:[\/]*:?/i, ''); 
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
    if (cleaned.toLowerCase().startsWith('file')) {
       cleaned = cleaned.replace(/^file.*/i, '/');
    }
    
    const match = cleaned.match(/(Categories|Brands|Products|uploads|images)\/.*/i);
    if (match) cleaned = `/${match[0]}`;
    else cleaned = `/${cleaned.split('/').pop()}`;
    
    return `${API_BASE_URL}${cleaned}`;
  },

  getAll: async (page = 1, pageSize = 50) => {
    // Pagination params added directly into the URL query
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetAll?Page=${page}&PageSize=${pageSize}`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getTree: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/GetTree/tree`);
    if (!res.ok) throw new Error("Failed to fetch category tree");
    return res.json();
  },

  create: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Create`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  update: async (id: number, formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Update/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to update category");
    return true; 
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Category/Delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return true;
  }
};