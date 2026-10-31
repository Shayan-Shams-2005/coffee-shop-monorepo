// app/(auth)/login/api.ts
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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
      // 🚀 FIXED: Changed 'Otp' to 'Code' to match your C# LoginWithOtpDto
      body: JSON.stringify({ 
        PhoneNumber: phoneNumber, 
        Code: otpCode 
      }),
    }),

  verifyRegisterOtp: (phoneNumber: string, otpCode: string) =>
    fetchApi("/api/Auth/VerifyRegistration/register/verify", {
      method: "POST",
      // 🚀 FIXED: Changed 'Otp' to 'Code' here as well just in case!
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
};