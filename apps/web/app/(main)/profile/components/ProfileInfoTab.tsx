"use client";

import { useState, useEffect } from "react";
import { User, Phone, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../../src/store/useAuthStore";
import { UserApi } from "../userApi"; // ⚠️ Adjust path as needed
import { AuthApi } from "../../../login/api"; // ⚠️ Adjust path as needed

export function ProfileInfoTab() {
  const logout = useAuthStore((state) => state.logout);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserApi.getMe();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
        });
        setPhoneNumber(data.phoneNumber || "");
      } catch (err: any) {
        if (err.message === "SESSION_EXPIRED") {
          await AuthApi.logout();
          logout();
        } else {
          setError("خطا در دریافت اطلاعات کاربری.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const form = new FormData();
      if (formData.firstName) form.append("FirstName", formData.firstName);
      if (formData.lastName) form.append("LastName", formData.lastName);

      await UserApi.updateMe(form);
      setSuccessMessage("اطلاعات حساب شما با موفقیت بروزرسانی شد!");
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
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#1A110F] rounded-3xl border border-[#D4A373]/20 dark:border-[#3c2317]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C68E58] dark:text-[#6A422D]" />
        <span className="text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 transition-colors">
        اطلاعات شخصی
      </h2>

      {error && <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl mb-6">{error}</div>}
      {successMessage && <div className="bg-green-50 text-green-700 font-bold p-4 rounded-xl mb-6">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] transition-colors">
              نام
            </label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6A5A4F] transition-colors" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="وارد نشده است"
                className="w-full h-12 bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl pr-12 pl-4 text-gray-900 dark:text-[#EAE0D5] focus:border-[#D4A373] dark:focus:border-[#6A422D] focus:ring-1 focus:ring-[#D4A373] dark:focus:ring-[#6A422D] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F]"
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] transition-colors">
              نام خانوادگی
            </label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6A5A4F] transition-colors" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="وارد نشده است"
                className="w-full h-12 bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl pr-12 pl-4 text-gray-900 dark:text-[#EAE0D5] focus:border-[#D4A373] dark:focus:border-[#6A422D] focus:ring-1 focus:ring-[#D4A373] dark:focus:ring-[#6A422D] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F]"
              />
            </div>
          </div>

          <div className="space-y-2 text-right md:col-span-2">
            <label className="text-sm font-bold text-gray-500 dark:text-[#A1A1A1] transition-colors">
              شماره موبایل (ثبت شده)
            </label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6A5A4F] transition-colors" />
              <input
                type="tel"
                disabled
                value={phoneNumber}
                dir="ltr"
                className="w-full h-12 bg-gray-100 dark:bg-[#1A1412] border border-gray-200 dark:border-[#3c2317] rounded-xl pr-12 pl-4 text-gray-500 dark:text-[#8C7A6B] font-bold cursor-not-allowed text-right transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#D4A373] hover:bg-[#C29262] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 dark:bg-[#6A422D] dark:hover:bg-[#5A3826] dark:text-[#F3E8E0] dark:shadow-none"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "در حال ذخیره..." : "ثبت تغییرات"}
          </button>
        </div>
      </form>
    </div>
  );
}