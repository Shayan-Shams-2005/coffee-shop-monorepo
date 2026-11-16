
import { AuthApi } from "../../login/api";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103"
).replace(/\/$/, "");

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  const headers = new Headers(requestOptions.headers);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  requestOptions.headers = headers;

  let res = await fetch(url, requestOptions);

  if (res.status === 401) {
    try {
      await AuthApi.refreshToken();
      res = await fetch(url, requestOptions);
    } catch {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return res;
};

// Prevent local file URLs from being used as browser image sources.
const getSafeImageUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== "string") return "";

  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  // Allow valid web and browser-generated image URLs.
  if (/^(https?:\/\/|data:image\/|blob:)/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // Convert local file paths into API-relative image paths.
  let cleaned = trimmedUrl.replace(/\\/g, "/");

  cleaned = cleaned.replace(/^file:\/*/i, "");

  // Remove Windows drive letters.
  cleaned = cleaned.replace(/^[a-zA-Z]:\//, "/");

  // Never return a file:// URL.
  cleaned = cleaned.replace(/^\/+/, "/");

  const match = cleaned.match(
    /(Categories|Brands|BrandGroups|Products|uploads|images)\/.*/i
  );

  if (match) {
    cleaned = `/${match[0]}`;
  } else {
    const filename = cleaned.split("/").pop();

    if (!filename) return "";

    cleaned = `/${filename}`;
  }

  return `${API_BASE_URL}${cleaned}`;
};

export const BrandApi = {
  getImageUrl: (url: string | null | undefined): string => {
    return getSafeImageUrl(url);
  },

  getAll: async (page = 1, pageSize = 50) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/Brand/GetAll?Page=${page}&PageSize=${pageSize}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch brands");
    }

    return res.json();
  },

  create: async (formData: FormData) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/Brand/Create`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to create brand");
    }

    return res.json();
  },

  update: async (id: number, formData: FormData) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/Brand/Update/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update brand");
    }

    return true;
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/Brand/Delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete brand");
    }

    return true;
  },
};

export const BrandGroupApi = {
  getAll: async (page = 1, pageSize = 50) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/BrandGroup/GetAll?Page=${page}&PageSize=${pageSize}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch brand groups");
    }

    return res.json();
  },

  create: async (data: {
    name: string;
    displayOrder: number;
  }) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/BrandGroup/Create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to create brand group");
    }

    return res.json();
  },

  update: async (
    id: number,
    data: {
      name: string;
      displayOrder: number;
    }
  ) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/BrandGroup/Update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update brand group");
    }

    return true;
  },

  delete: async (id: number) => {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/BrandGroup/Delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error(
          "نمی‌توانید گروهی را حذف کنید که دارای برند است."
        );
      }

      throw new Error("Failed to delete brand group");
    }

    return true;
  },
};
