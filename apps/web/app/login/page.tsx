"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Coffee, ArrowRight, Loader2, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/button";

import { useAuthStore } from "../../src/store/useAuthStore";
import { OtpTimer } from "../../components/auth/OtpTimer";
import { AuthApi } from "./api"; 
import { Navbar } from "../../components/layout/header/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const login = useAuthStore((state) => state.login);

  // UI States
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Data States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // Status States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUserExists, setIsUserExists] = useState<boolean>(false);

  const isValidIranianPhoneNumber = (phone: string) => /^09\d{9}$/.test(phone);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidIranianPhoneNumber(phoneNumber)) {
      setError("لطفاً یک شماره موبایل معتبر وارد کنید.");
      return;
    }

    setIsLoading(true);
    
    try {
      await AuthApi.requestLoginOtp(phoneNumber);
      setIsUserExists(true);
      setAuthMode("login");
      setStep("otp");
    } catch (loginError) {
      try {
        await AuthApi.requestRegisterOtp(phoneNumber);
        setIsUserExists(false);
        setAuthMode("register");
        setStep("otp");
      } catch (regError) {
        setError("خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidIranianPhoneNumber(phoneNumber)) {
      setError("لطفاً یک شماره موبایل معتبر وارد کنید.");
      return;
    }

    // Safely check against an empty string after trimming spaces
    if (!password.trim()) {
      setError("لطفاً رمز عبور را وارد کنید.");
      return;
    }

    setIsLoading(true);
    try {
      // 🚀 FIXED: Added .trim() to ensure no accidental whitespace breaks the C# hasher
      await AuthApi.loginWithPassword(phoneNumber, password.trim());
      
      login(phoneNumber);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "شماره موبایل یا رمز عبور اشتباه است.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد.");
      return;
    }

    setIsLoading(true);
    
    try {
      if (authMode === "login") {
        await AuthApi.verifyLoginOtp(phoneNumber, otpCode);
      } else {
        await AuthApi.verifyRegisterOtp(phoneNumber, otpCode);
      }

      login(phoneNumber);
      router.push(redirectUrl);
      
    } catch (err: any) {
      setError(err.message || "خطایی رخ داده است.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (authMode === "login") {
        await AuthApi.requestLoginOtp(phoneNumber);
      } else {
        await AuthApi.requestRegisterOtp(phoneNumber);
      }
    } catch (err) {
      setError("خطا در ارسال مجدد کد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 🚀 FIXED: Added Header to the page layout */}
     <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-[#1A110F] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)] border border-[#4A3022]/20 dark:border-[#3c2317] p-8 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4A373] dark:bg-[#6A422D] transition-colors"></div>

          <div className="flex flex-col items-center justify-center mb-6">
            <Link
              href="/"
              className="flex items-center justify-center w-16 h-16 rounded-full text-[#D4A373] dark:text-[#C68E58] mb-4 hover:scale-105 transition-transform"
            >
              <Coffee className="w-10 h-10" />
            </Link>
            <h1 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-2 transition-colors">
              نئو کافه
            </h1>
            <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] font-medium text-center transition-colors">
              {step === "phone" ? "ورود به حساب کاربری" : "کد تایید را وارد کنید"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold p-3 rounded-xl mb-6 text-center animate-in fade-in transition-colors">
              {error}
            </div>
          )}

          {step === "phone" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="flex rounded-xl bg-gray-100 dark:bg-[#1A1412] p-1 mb-6 border border-gray-200 dark:border-[#3c2317]">
                <button
                  type="button"
                  onClick={() => { setLoginMethod("otp"); setError(""); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    loginMethod === "otp"
                      ? "bg-white dark:bg-[#2C1E16] text-[#C68E58] shadow-sm"
                      : "text-gray-500 dark:text-[#6A5A4F] hover:text-gray-700 dark:hover:text-[#A1A1A1]"
                  }`}
                >
                  ورود با پیامک
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod("password"); setError(""); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    loginMethod === "password"
                      ? "bg-white dark:bg-[#2C1E16] text-[#C68E58] shadow-sm"
                      : "text-gray-500 dark:text-[#6A5A4F] hover:text-gray-700 dark:hover:text-[#A1A1A1]"
                  }`}
                >
                  ورود با رمز عبور
                </button>
              </div>

              <form
                onSubmit={loginMethod === "otp" ? handlePhoneSubmit : handlePasswordSubmit}
                className="space-y-5"
              >
                <div className="space-y-2 text-right">
                  <input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="شماره موبایل"
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-center font-bold text-lg text-gray-900 focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all placeholder:text-gray-400 placeholder:font-normal dark:bg-transparent dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D] dark:focus:ring-[#6A422D] dark:placeholder:text-[#6A5A4F]"
                  />
                </div>

                {loginMethod === "password" && (
                  <div className="relative animate-in fade-in slide-in-from-top-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      placeholder="رمز عبور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all dark:bg-transparent dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D] dark:focus:ring-[#6A422D] placeholder:tracking-normal placeholder:text-right placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F]"
                    />
                    <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-[#6A5A4F]" />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-[#6A5A4F] dark:hover:text-[#A1A1A1] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 11 || (loginMethod === "password" && !password.trim())}
                  className="w-full h-14 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md active:scale-95 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white dark:text-[#F3E8E0]" />
                  ) : loginMethod === "otp" ? (
                    "تایید و دریافت کد"
                  ) : (
                    "ورود به حساب کاربری"
                  )}
                </Button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <form
              onSubmit={handleOtpSubmit}
              className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300"
            >
              <div className="text-sm text-center font-medium leading-relaxed mb-6">
                {isUserExists ? (
                  <p className="text-green-700 dark:text-green-400 transition-colors">
                    حساب کاربری با شماره موبایل{" "}
                    <span className="font-bold dir-ltr inline-block mx-1">
                      {phoneNumber}
                    </span>{" "}
                    یافت شد.
                  </p>
                ) : (
                  <p className="text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                    حساب کاربری با شماره موبایل{" "}
                    <span className="font-bold dir-ltr inline-block mx-1">
                      {phoneNumber}
                    </span>{" "}
                    وجود ندارد. جهت ساخت حساب کاربری جدید کد تایید پیامک شده را
                    وارد کنید.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mb-2 px-1">
                <span className="text-gray-600 dark:text-[#A1A1A1] font-medium transition-colors">
                  کد ارسال شده به شماره:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtpCode("");
                      setError("");
                    }}
                    className="text-[#D4A373] dark:text-[#C68E58] hover:text-[#4A3022] dark:hover:text-[#FFD7BA] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] dir-ltr transition-colors">
                    {phoneNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <input
                  id="otp"
                  type="text"
                  dir="ltr"
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-center font-black text-2xl tracking-[0.5em] text-[#2C1E16] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 dark:bg-transparent dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D] dark:focus:ring-[#6A422D] dark:placeholder:text-[#6A5A4F]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full h-14 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md active:scale-95 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white dark:text-[#F3E8E0]" />
                ) : (
                  "تایید کد و ورود"
                )}
              </Button>

              <div className="text-center mt-6 h-[20px]">
                <OtpTimer
                  initialTime={180}
                  isLoading={isLoading}
                  onResend={handleResendCode}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}