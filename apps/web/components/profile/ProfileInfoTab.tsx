"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { useAuthStore } from "../../src/store/useAuthStore";

export function ProfileInfoTab() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    alert("اطلاعات حساب شما با موفقیت بروزرسانی شد!");
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 transition-colors">
        اطلاعات شخصی
      </h2>
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

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] transition-colors">
              ایمیل
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6A5A4F] transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                dir="ltr"
                placeholder="وارد نشده است"
                className="w-full h-12 bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl pl-12 pr-4 text-left text-gray-900 dark:text-[#EAE0D5] focus:border-[#D4A373] dark:focus:border-[#6A422D] focus:ring-1 focus:ring-[#D4A373] dark:focus:ring-[#6A422D] outline-none transition-all placeholder:text-right placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F]"
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-gray-500 dark:text-[#A1A1A1] transition-colors">
              شماره موبایل (ثبت شده)
            </label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6A5A4F] transition-colors" />
              <input
                type="tel"
                disabled
                value={user.phone}
                dir="ltr"
                className="w-full h-12 bg-gray-100 dark:bg-[#1A1412] border border-gray-200 dark:border-[#3c2317] rounded-xl pr-12 pl-4 text-gray-500 dark:text-[#8C7A6B] font-bold cursor-not-allowed text-right transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#D4A373] hover:bg-[#C29262] text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 dark:bg-[#6A422D] dark:hover:bg-[#5A3826] dark:text-[#F3E8E0] dark:shadow-none"
          >
            <Save className="w-5 h-5" /> ثبت تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}
