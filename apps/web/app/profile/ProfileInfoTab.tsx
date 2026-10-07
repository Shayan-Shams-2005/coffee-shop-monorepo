// components/profile/ProfileInfoTab.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Camera, User as UserIcon } from "lucide-react";
import { Button } from "@repo/ui/button";

import { UserApi } from "../../app/profile/userApi"; 
import { useAuthStore } from "../../src/store/useAuthStore"; 
import { AuthApi } from "../../app/login/api"; // ⚠️ Adjust path

export function ProfileInfoTab() {
  const logout = useAuthStore((state) => state.logout); // 🚀 Pull logout from Zustand

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserApi.getMe();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhoneNumber(data.phoneNumber || ""); 
        
        if (data.profileUrl) {
          setPreviewImage(UserApi.getImageUrl(data.profileUrl));
        }
      } catch (err: any) {
        // 🚀 OPTIMAL JWT: If refresh failed, clear local state and force login
        if (err.message === "SESSION_EXPIRED") {
          await AuthApi.logout(); // Tell backend to clear cookies
          logout(); // Clear Zustand state (this will auto-redirect due to page.tsx protection)
        } else {
          setError("خطا در دریافت اطلاعات کاربری. لطفاً صفحه را رفرش کنید.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [logout]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم تصویر نباید بیشتر از 5 مگابایت باشد.");
        return;
      }
      
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      if (firstName) formData.append("FirstName", firstName);
      if (lastName) formData.append("LastName", lastName);
      if (imageFile) formData.append("File", imageFile);

      await UserApi.updateMe(formData);
      setSuccessMessage("اطلاعات حساب کاربری با موفقیت بروزرسانی شد.");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        await AuthApi.logout();
        logout();
      } else {
        setError("خطا در بروزرسانی اطلاعات.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#1A110F] rounded-3xl border border-[#4A3022]/20 dark:border-[#3c2317]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C68E58] dark:text-[#6A422D]" />
        <span className="text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)] border border-[#4A3022]/20 dark:border-[#3c2317] transition-colors">
      <h2 className="text-xl font-bold text-[#2C1E16] dark:text-white mb-6 transition-colors">
        اطلاعات شخصی
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold p-4 rounded-2xl mb-6 transition-colors">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-bold p-4 rounded-2xl mb-6 transition-colors">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
        {/* Profile Image Upload Section */}
        <div className="flex flex-col items-center sm:items-start gap-4">
          <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">تصویر پروفایل</label>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-[#231511] border-2 border-dashed border-[#C68E58] dark:border-[#6A422D] flex items-center justify-center transition-all group-hover:border-solid">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-[#C68E58]/50 dark:text-[#6A422D]/50" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1]">
              <p>حداکثر حجم: ۵ مگابایت</p>
              <p>فرمت‌های مجاز: JPG, PNG, WebP</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
              نام
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-[#2C1E16] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all dark:bg-transparent dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D] dark:focus:ring-[#6A422D]"
              placeholder="مثال: علی"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
              نام خانوادگی
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-[#2C1E16] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all dark:bg-transparent dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D] dark:focus:ring-[#6A422D]"
              placeholder="مثال: محمدی"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="phone" className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
              شماره موبایل (غیرقابل تغییر در این بخش)
            </label>
            <input
              id="phone"
              type="text"
              value={phoneNumber}
              disabled
              dir="ltr"
              className="w-full h-14 bg-gray-100 border border-transparent rounded-2xl px-4 text-left font-bold text-gray-500 cursor-not-allowed dark:bg-[#231511] dark:text-[#6A5A4F]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving || (!firstName && !lastName && !imageFile)}
            className="h-14 px-8 rounded-2xl bg-[#C68E58] hover:bg-[#A87242] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              "ثبت تغییرات"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}