// app/admin/reviews/api.ts
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

export const ReviewAdminApi = {
  // Fetch reviews for a specific product
  getByProductId: async (productId: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${productId}/reviews`, { cache: 'no-store' });
    if (!res.ok) {
        // If the backend throws a 404 for products with no reviews, safely return an empty array
        if (res.status === 404) return [];
        throw new Error(`Failed to fetch reviews for product ${productId}`);
    }
    return res.json();
  },

  update: async (productId: number, reviewId: number, updateData: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${productId}/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error("Failed to update review");
  },

  delete: async (productId: number, reviewId: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${productId}/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review");
  }
};