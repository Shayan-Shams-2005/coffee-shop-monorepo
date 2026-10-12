import { AuthApi } from "../../login/api"; // Ensure this matches your login api path

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

// Smart Fetcher for handling 401 and auto-refreshing cookies
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

export interface UserDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  profileUrl: string | null;
  role: number; // 0 = Customer, 1 = Admin
  isDeleted: boolean;
  createdAt: string;
}

export const UserAdminApi = {
  getAllActiveUsers: async (): Promise<UserDto[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/GetAllActiveUsers`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch active users");
    return res.json();
  },

  getAllUsers: async (): Promise<UserDto[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/GetAllUsers`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch all users");
    return res.json();
  },

  deleteUser: async (id: number): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/User/Delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete user ${id}`);
    return res.status === 204;
  }
};