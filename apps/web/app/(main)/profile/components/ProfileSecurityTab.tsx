// app/(main)/profile/components/ProfileSecurityTab.tsx
"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, Key, Eye, EyeOff, MessageSquareText } from "lucide-react";
import { UserApi } from "../userApi"; 

export function ProfileSecurityTab() {
  const [mode, setMode] = useState<"change" | "otp-request" | "otp-verify">("change");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    if (newPassword.length < 6) {
      setError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("تکرار رمز عبور با رمز جدید مطابقت ندارد.");
      return;
    }

    setIsLoading(true);
    try {
      await UserApi.changePassword({
        currentPassword,
        newPassword
      });
      
      setSuccess("رمز عبور شما با موفقیت تغییر یافت.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.includes("You don't have any password")) {
        setError("شما هنوز رمز عبوری ندارید. لطفاً از طریق پیامک رمز عبور ایجاد کنید.");
        setMode("otp-request"); 
      } else if (errMsg.includes("incorrect")) {
        setError("رمز عبور فعلی اشتباه است.");
      } else {
        setError("خطا در تغییر رمز عبور. لطفاً مجدداً تلاش کنید.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      await UserApi.requestAddPasswordOtp();
      setSuccess("کد تایید به شماره موبایل شما پیامک شد.");
      setMode("otp-verify");
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.includes("already have a password")) {
        setError("شما از قبل رمز عبور دارید! از فرم بالا برای تغییر آن استفاده کنید.");
        setMode("change");
      } else {
        setError("خطا در ارسال پیامک.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpCode || !newPassword || !confirmPassword) {
      setError("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("تکرار رمز عبور با رمز جدید مطابقت ندارد.");
      return;
    }

    setIsLoading(true);
    try {
      await UserApi.addPassword({
        otp: otpCode,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword 
      });
      
      setSuccess("رمز عبور جدید شما با موفقیت ایجاد شد!");
      setMode("change"); 
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError("کد تایید نامعتبر است یا خطایی رخ داده است.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <div className="flex items-center justify-between mb-8 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 transition-colors">
        <h2 className="text-xl font-black text-[#2C1E16] dark:text-white flex items-center gap-2 transition-colors">
          <ShieldCheck className="w-6 h-6 text-[#D4A373] dark:text-[#C68E58] transition-colors" />
          امنیت و رمز عبور
        </h2>
      </div>

      <div className="max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold p-4 rounded-2xl mb-6 transition-colors text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold p-4 rounded-2xl mb-6 transition-colors text-center">
            {success}
          </div>
        )}

        {mode === "change" && (
          <form onSubmit={handleChangePassword} className="space-y-5 animate-in fade-in" dir="rtl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                رمز عبور فعلی
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  dir="ltr"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
                />
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  dir="ltr"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
                />
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                تکرار رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
                />
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full h-14 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تغییر رمز عبور"}
            </button>

            <div className="pt-6 border-t border-gray-100 dark:border-[#3c2317] mt-6 text-center">
              {/* متن در اینجا تغییر کرده است */}
              <p className="text-sm text-gray-500 dark:text-[#A1A1A1] mb-3">رمز عبور ندارید یا فراموش کردید؟</p>
              <button
                type="button"
                onClick={() => setMode("otp-request")}
                className="text-sm font-bold text-[#C68E58] hover:text-[#A87242] flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <MessageSquareText className="w-4 h-4" />
                ایجاد رمز عبور جدید با پیامک
              </button>
            </div>
          </form>
        )}

        {mode === "otp-request" && (
          <div className="space-y-6 text-center animate-in slide-in-from-right-4">
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30">
              <ShieldCheck className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-black text-[#2C1E16] dark:text-white mb-2">ایجاد رمز عبور</h3>
              <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] font-medium leading-relaxed">
                برای ایجاد رمز عبور جدید، ابتدا باید شماره موبایل خود را تایید کنید. یک کد تایید برای شما ارسال خواهد شد.
              </p>
            </div>
            
            <button
              onClick={handleRequestOtp}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ارسال کد تایید"}
            </button>
            
            <button
              onClick={() => setMode("change")}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              انصراف و بازگشت
            </button>
          </div>
        )}

        {mode === "otp-verify" && (
          <form onSubmit={handleSetNewPassword} className="space-y-5 animate-in slide-in-from-left-4" dir="rtl">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                کد تایید پیامک شده
              </label>
              <input
                type="text"
                dir="ltr"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="- - - - - -"
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-center tracking-[0.5em] font-black text-xl text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  dir="ltr"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
                />
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                تکرار رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-12 text-left tracking-widest text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#1A1412] dark:border-[#3c2317] dark:text-[#EAE0D5]"
                />
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6 || !newPassword || !confirmPassword}
              className="w-full h-14 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ثبت نهایی رمز عبور"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setMode("change")}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}