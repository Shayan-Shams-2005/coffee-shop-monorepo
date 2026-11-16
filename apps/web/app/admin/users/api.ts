// app/admin/users/api.ts
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

export const UserAdminApi = {
  // We use the 'all' endpoint to get both active and deleted users in one list
  getAllUsers: async (page = 1, pageSize = 20) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/GetAllUsers/all?Page=${page}&PageSize=${pageSize}`);
    if (!res.ok) throw new Error("Failed to fetch all users");
    return res.json();
  },

  deleteUser: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/Delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
    return true;
  },

  restoreUser: async (id: number) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/RestoreUser/${id}/restore`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to restore user");
    return true;
  }
};