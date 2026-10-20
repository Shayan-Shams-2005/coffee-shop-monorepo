// app/admin/orders/api.ts
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

export const OrderAdminApi = {
  getAll: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Orders/GetAll/all`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Orders/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch order details");
    return res.json();
  },

  updateStatus: async (id: number, statusIndex: number) => {
    // ارسال status به صورت یک عدد (Enum در سی‌شارپ)
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Orders/UpdateStatus/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusIndex }),
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update status");
    }
  },

  cancel: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/Orders/Cancel/${id}/cancel`, {
      method: "POST",
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to cancel order");
    }
  },
};