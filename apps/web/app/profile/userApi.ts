// app/profile/userApi.ts
import { AuthApi } from "../login/api"; // ⚠️ Adjust this import path based on your folder structure

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// 🚀 SMART JWT FETCHER: Handles 401s and auto-refreshes tokens
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  options.credentials = "include"; // Always send cookies
  let res = await fetch(url, options);

  if (res.status === 401) {
    try {
      // 1. Token expired! Call our new refresh endpoint
      await AuthApi.refreshToken();
      // 2. Refresh successful! Retry the original request
      res = await fetch(url, options);
    } catch (error) {
      // 3. Refresh failed (user logged out for too many days). Throw specific error.
      throw new Error("SESSION_EXPIRED");
    }
  }
  return res;
};

export const UserApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    const cleaned = url.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image)/.test(cleaned)) return cleaned;
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  },

  getMe: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/GetMe/me`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return res.json();
  },

  updateMe: async (formData: FormData) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/UpdateMe/me`, {
      method: "PUT",
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to update profile");
    }
    return res.status === 204 ? true : res.json();
  }
};