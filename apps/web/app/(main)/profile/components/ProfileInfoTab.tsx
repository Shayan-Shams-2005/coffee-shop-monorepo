"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Camera, User as UserIcon, Save, Smartphone, X } from "lucide-react";

import { UserApi } from "../userApi"; 
import { useAuthStore } from "../../../../src/store/useAuthStore"; 
import { AuthApi } from "../../../login/api"; 

export function ProfileInfoTab() {
  const logout = useAuthStore((state) => state.logout); 

  // Basic Profile States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  
  // Phone Change Workflow States
  const [phoneChangeStep, setPhoneChangeStep] = useState<"idle" | "request" | "verify">("idle");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // Global UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserApi.getMe();
        
        const fetchedFirstName = (data.firstName || data.FirstName || "").trim();
        const fetchedLastName = (data.lastName || data.LastName || "").trim();
        
        setFirstName(fetchedFirstName);
        setLastName(fetchedLastName);
        
        setOriginalFirstName(fetchedFirstName);
        setOriginalLastName(fetchedLastName);
        
        setPhoneNumber(data.phoneNumber || data.PhoneNumber || ""); 
        
        const profileImageUrl = data.profileUrl || data.ProfileUrl;
        if (profileImageUrl) {
          setPreviewImage(UserApi.getImageUrl(profileImageUrl));
        }
      } catch (err: any) {
        if (err.message === "SESSION_EXPIRED") {
          await AuthApi.logout(); 
          logout(); 
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
    if (phoneChangeStep !== "idle") return;

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      
      formData.append("FirstName", firstName.trim());
      formData.append("LastName", lastName.trim());
      
      if (imageFile) {
        formData.append("File", imageFile);
      }

      await UserApi.updateMe(formData);
      setSuccessMessage("اطلاعات حساب کاربری با موفقیت بروزرسانی شد.");
      
      setOriginalFirstName(firstName.trim());
      setOriginalLastName(lastName.trim());
      setImageFile(null); 
      
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

  const handleRequestPhoneOtp = async () => {
    if (newPhoneNumber.length !== 11 || !newPhoneNumber.startsWith("09")) {
      setError("لطفاً یک شماره موبایل معتبر وارد کنید.");
      return;
    }
    if (newPhoneNumber === phoneNumber) {
      setError("این شماره فعلی شماست.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsPhoneLoading(true);

    try {
      await UserApi.requestPhoneChange(newPhoneNumber);
      setSuccessMessage("کد تایید به شماره جدید پیامک شد.");
      setPhoneChangeStep("verify");
    } catch (err: any) {
      setError("خطا در ارسال کد تایید. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsPhoneLoading(true);

    try {
      await UserApi.verifyPhoneChange(newPhoneNumber, phoneOtp);
      
      setSuccessMessage("شماره موبایل شما با موفقیت تغییر یافت.");
      setPhoneNumber(newPhoneNumber);
      setPhoneChangeStep("idle");
      setNewPhoneNumber("");
      setPhoneOtp("");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("کد تایید نامعتبر است یا خطایی رخ داده است.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const hasChanges = 
    firstName.trim() !== originalFirstName.trim() || 
    lastName.trim() !== originalLastName.trim() || 
    imageFile !== null;

  const isButtonDisabled = isSaving || !hasChanges;

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

          {/* New Interactive Phone Number Section */}
          <div className="space-y-3 sm:col-span-2 bg-gray-50/50 dark:bg-[#1A1412]/50 p-5 rounded-3xl border border-gray-100 dark:border-[#3c2317]">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                شماره موبایل
              </label>
              
              {phoneChangeStep === "idle" && (
                <button
                  type="button"
                  onClick={() => setPhoneChangeStep("request")}
                  className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] transition-colors bg-white dark:bg-[#231511] px-3 py-1.5 rounded-lg border border-[#F5EFE6] dark:border-[#3c2317]"
                >
                  تغییر شماره
                </button>
              )}
            </div>

            {phoneChangeStep === "idle" && (
              <input
                type="text"
                value={phoneNumber}
                disabled
                dir="ltr"
                className="w-full h-14 bg-gray-100 border border-transparent rounded-2xl px-4 text-left font-bold text-gray-500 cursor-not-allowed dark:bg-[#231511] dark:text-[#6A5A4F]"
              />
            )}

            {phoneChangeStep === "request" && (
              <div className="animate-in fade-in slide-in-from-top-2 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="شماره موبایل جدید (مثال: 0912...)"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={11}
                  dir="ltr"
                  className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-4 text-left font-bold text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#231511] dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D]"
                />
                <div className="flex gap-2 sm:w-auto w-full">
                  <button
                    type="button"
                    onClick={handleRequestPhoneOtp}
                    disabled={isPhoneLoading || newPhoneNumber.length !== 11}
                    className="flex-1 sm:flex-none h-14 px-6 rounded-2xl bg-[#C68E58] text-white font-bold text-sm flex items-center justify-center transition-all disabled:opacity-50 hover:bg-[#A87242] dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
                  >
                    {isPhoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "دریافت کد"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneChangeStep("idle"); setNewPhoneNumber(""); setError(""); }}
                    className="h-14 px-4 rounded-2xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all dark:bg-[#3c2317] dark:text-gray-300 dark:hover:bg-[#4A3022]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {phoneChangeStep === "verify" && (
              <div className="animate-in fade-in slide-in-from-top-2 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="- - - - - -"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  dir="ltr"
                  className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-4 text-center tracking-[0.5em] font-black text-xl text-[#2C1E16] focus:outline-none focus:border-[#C68E58] transition-all dark:bg-[#231511] dark:border-[#3c2317] dark:text-[#EAE0D5] dark:focus:border-[#6A422D]"
                />
                <div className="flex gap-2 sm:w-auto w-full">
                  <button
                    type="button"
                    onClick={handleVerifyPhoneOtp}
                    disabled={isPhoneLoading || phoneOtp.length !== 6}
                    className="flex-1 sm:flex-none h-14 px-6 rounded-2xl bg-[#C68E58] text-white font-bold text-sm flex items-center justify-center transition-all disabled:opacity-50 hover:bg-[#A87242] dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
                  >
                    {isPhoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تایید شماره"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneChangeStep("idle"); setPhoneOtp(""); setNewPhoneNumber(""); setError(""); }}
                    className="h-14 px-4 rounded-2xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all dark:bg-[#3c2317] dark:text-gray-300 dark:hover:bg-[#4A3022]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <button
            type="submit"
            disabled={isButtonDisabled || phoneChangeStep !== "idle"}
            className={`h-14 px-8 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              (isButtonDisabled || phoneChangeStep !== "idle")
                ? "bg-[#C68E58] dark:bg-[#6A422D] opacity-40 cursor-not-allowed" 
                : "bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#6A422D] dark:hover:bg-[#5A3826]"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                ثبت تغییرات
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}