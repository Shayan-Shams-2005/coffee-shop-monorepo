// app/login/api.ts (or wherever your Auth API is)
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export const AuthApi = {
  requestLoginOtp: async (phoneNumber: string) => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/RequestLoginOtp/login/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!res.ok) throw new Error("User not found or login request failed");
    return res.json();
  },

  requestRegisterOtp: async (phoneNumber: string) => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/RequsetRegistrationOtp/register/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!res.ok) throw new Error("Registration request failed");
    return res.json();
  },

  verifyLoginOtp: async (phoneNumber: string, otp: string) => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/LoginWithOtp/login/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp, code: otp }),
      credentials: "include", 
    });
    if (!res.ok) throw new Error("کد تایید وارد شده اشتباه است.");
    return res.ok;
  },

  verifyRegisterOtp: async (phoneNumber: string, otp: string) => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/VerifyRegistration/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp, code: otp }),
      credentials: "include", 
    });
    if (!res.ok) throw new Error("کد تایید وارد شده اشتباه است.");
    return res.ok;
  },

  // 🚀 OPTIMAL JWT: Automatically renews the AccessToken using the HttpOnly RefreshToken
  refreshToken: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/Refresh/refresh`, {
      method: "POST",
      credentials: "include", 
    });
    if (!res.ok) throw new Error("Session expired");
    return res.ok;
  },

  // 🚀 OPTIMAL JWT: Tells the C# backend to destroy the HttpOnly cookies securely
  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Auth/Logout/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  }
};