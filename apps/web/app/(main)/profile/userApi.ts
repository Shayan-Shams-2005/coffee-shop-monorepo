// app/(main)/profile/userApi.ts
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (res.status === 401) throw new Error("SESSION_EXPIRED");
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "خطایی رخ داده است");
  }
  
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export const UserApi = {
  // --- Profile ---
  getMe: () => fetchWithAuth("/api/User/GetMe/me"),
  updateMe: (formData: FormData) => 
    fetchWithAuth("/api/User/UpdateMe/me", { method: "PUT", body: formData }),
  getImageUrl: (path: string) => path.startsWith("http") ? path : `${API_BASE_URL}/${path}`,

  // --- Addresses ---
  getAddresses: () => fetchWithAuth("/api/UserAddresses/GetAddresses"),
  
  addAddress: (data: { 
    title: string; 
    recipientName: string;
    phoneNumber: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
    isDefault: boolean;
  }) => {
    const payload = {
      Title: data.title,
      RecipientName: data.recipientName,
      PhoneNumber: data.phoneNumber,
      Province: data.province,
      City: data.city,
      AddressLine: data.addressLine,
      PostalCode: data.postalCode,
      IsDefault: data.isDefault
    };
    return fetchWithAuth("/api/UserAddresses/CreateAddress", { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
  },
  
  updateAddress: (id: number, data: { 
    title: string; 
    recipientName: string;
    phoneNumber: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
    isDefault: boolean;
  }) => {
    const payload = {
      Title: data.title,
      RecipientName: data.recipientName,
      PhoneNumber: data.phoneNumber,
      Province: data.province,
      City: data.city,
      AddressLine: data.addressLine,
      PostalCode: data.postalCode,
      IsDefault: data.isDefault
    };
    return fetchWithAuth(`/api/UserAddresses/UpdateAddress/${id}`, { 
      method: "PUT", 
      body: JSON.stringify(payload) 
    });
  },

  deleteAddress: (id: number) =>
    fetchWithAuth(`/api/UserAddresses/DeleteAddress/${id}`, { method: "DELETE" }),

  // --- Password & Security ---
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    const payload = {
      CurrentPassword: data.currentPassword,
      NewPassword: data.newPassword
    };
    return fetchWithAuth("/api/Auth/ChangePassword/me", { 
      method: "PUT", 
      body: JSON.stringify(payload) 
    });
  },

  requestAddPasswordOtp: () =>
    fetchWithAuth("/api/Auth/RequestAddPasswordOtp/me/password/otp", { method: "POST" }),
    
  addPassword: (data: { otp: string; newPassword: string; confirmNewPassword: string }) => {
    const payload = {
      Otp: data.otp,
      NewPassword: data.newPassword,
      ConfirmNewPassword: data.confirmNewPassword
    };
    return fetchWithAuth("/api/Auth/AddPassword/me/password", { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
  },

  // --- Phone Number Change ---
  requestPhoneChange: (newPhoneNumber: string) => {
    return fetchWithAuth("/api/Auth/RequestPhoneChange/me/phone/request", {
      method: "POST",
      body: JSON.stringify({ NewPhoneNumber: newPhoneNumber })
    });
  },

  verifyPhoneChange: (newPhoneNumber: string, code: string) => {
    return fetchWithAuth("/api/Auth/VerifyPhoneChange/me/phone/verify", {
      method: "POST",
      // 🚀 FIXED: Sent as 'Code' exactly as your DTO requires!
      body: JSON.stringify({ NewPhoneNumber: newPhoneNumber, Code: code }) 
    });
  }
};