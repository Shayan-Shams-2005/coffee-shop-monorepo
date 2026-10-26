// app/admin/reviews/api.ts
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// Helper to get auth headers if you are using JWT Bearer tokens in localStorage
// If you are using cookies, 'credentials: "include"' is enough.
const getAuthHeaders = () => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  // Uncomment the lines below if your app stores a JWT in localStorage:
  // const token = localStorage.getItem("token"); 
  // if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const ReviewAdminApi = {
  // Fetch only pending reviews across all products
  getPending: async () => {
    const res = await fetch(`${API_BASE_URL}/api/AdminReviews/GetPending/pending`, {
      headers: getAuthHeaders(),
      credentials: "include", // 🚀 FIX: Enabled sending auth cookies to the server
    });
    if (!res.ok) throw new Error(res.status === 401 ? "SESSION_EXPIRED" : "خطا در دریافت لیست نظرات");
    return res.json();
  },

  // Approve a review
  approve: async (reviewId: number) => {
    const res = await fetch(`${API_BASE_URL}/api/AdminReviews/Approve/${reviewId}/approve`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include", // 🚀 FIX: Added credentials here too
    });
    if (!res.ok) throw new Error("خطا در تایید نظر");
    return res.ok;
  },

  // Reject/Delete a review
  reject: async (reviewId: number) => {
    const res = await fetch(`${API_BASE_URL}/api/AdminReviews/Reject/${reviewId}/reject`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include", // 🚀 FIX: Added credentials here too
    });
    if (!res.ok) throw new Error("خطا در رد نظر");
    return res.ok;
  }
};