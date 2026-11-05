// app/(auth)/login/api.ts
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // 🚀 credentials: "include" به صورت سراسری ست شده تا کوکی‌ها همیشه ارسال/دریافت شوند
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "خطایی رخ داده است");
  }
  
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export const AuthApi = {
  requestLoginOtp: (phoneNumber: string) =>
    fetchApi("/api/Auth/RequestLoginOtp/login/request-otp", {
      method: "POST",
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber 
      }),
    }),

  requestRegisterOtp: (phoneNumber: string) =>
    fetchApi("/api/Auth/RequsetRegistrationOtp/register/request-otp", {
      method: "POST",
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber 
      }),
    }),

  verifyLoginOtp: (phoneNumber: string, otpCode: string) =>
    fetchApi("/api/Auth/LoginWithOtp/login/otp", {
      method: "POST",
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber, 
        Code: otpCode 
      }),
    }),

  verifyRegisterOtp: (phoneNumber: string, otpCode: string) =>
    fetchApi("/api/Auth/VerifyRegistration/register/verify", {
      method: "POST",
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber, 
        Code: otpCode 
      }),
    }),

  loginWithPassword: (phoneNumber: string, password: string) =>
    fetchApi("/api/Auth/LoginWithPassword/login/password", {
      method: "POST",
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber, 
        Password: password 
      }),
    }),

  logout: () =>
    fetchApi("/api/Auth/Logout/logout", {
      method: "POST", 
    }),

  // 🚀 این تابع اضافه شد تا ارور صفحه محصولات برطرف شود
  refreshToken: async () => {
    try {
      return await fetchApi("/api/Auth/Refresh/refresh", {
        method: "POST",
      });
    } catch (error) {
      // در صورتی که توکن رفرش هم منقضی شده باشد، کاربر به صفحه لاگین هدایت می‌شود
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // یا "/admin/login" بسته به روت‌های شما
      }
      throw new Error("SESSION_EXPIRED");
    }
  }
};