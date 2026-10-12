"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, MapPin, ShoppingBag, LogOut, Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../../src/store/useAuthStore";
import { UserApi } from "../userApi"; // ⚠️ Adjust path
import { AuthApi } from "../../../login/api"; // ⚠️ Adjust path

interface SidebarProps {
  activeTab: "profile" | "addresses" | "orders";
  setActiveTab: (tab: "profile" | "addresses" | "orders") => void;
}

export function ProfileSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<{ firstName: string; lastName: string; phone: string; profileUrl: string | null } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await UserApi.getMe();
      setUserData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phoneNumber || "",
        profileUrl: data.profileUrl ? UserApi.getImageUrl(data.profileUrl) : null
      });
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        await AuthApi.logout();
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [logout]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("File", file);
        await UserApi.updateMe(formData);
        await fetchUser(); // Refresh image after successful upload
      } catch (err) {
        alert("خطا در آپلود تصویر");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    await AuthApi.logout();
    logout();
    router.push("/");
  };

  if (!userData) {
    return (
      <div className="md:col-span-1 bg-white dark:bg-[#1A110F] rounded-3xl p-6 h-64 flex items-center justify-center border border-[#D4A373]/20 dark:border-[#3c2317]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A373] dark:text-[#C68E58]" />
      </div>
    );
  }

  return (
    <div className="md:col-span-1 bg-white dark:bg-[#1A110F] rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] flex flex-col sticky top-24 transition-colors">
      <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-[#3c2317] pb-6 mb-6 transition-colors">
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative w-24 h-24 bg-[#FFF9F2] dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-[#D4A373] dark:text-[#C68E58] mb-4 border-4 border-white dark:border-[#1A110F] shadow-sm cursor-pointer group overflow-hidden transition-colors ${isUploading ? 'opacity-70' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : userData.profileUrl ? (
            <Image
              src={userData.profileUrl}
              alt="پروفایل"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-10 h-10" />
          )}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg mb-1 transition-colors">
          {userData.firstName || userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : "کاربر جدید"}
        </h2>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm font-bold dir-ltr transition-colors">
          {userData.phone}
        </p>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "profile"
              ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md dark:shadow-none"
              : "text-gray-600 dark:text-[#A1A1A1] hover:bg-gray-50 dark:hover:bg-[#2C1A14]"
          }`}
        >
          <User className="w-5 h-5" /> اطلاعات حساب
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "addresses"
              ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md dark:shadow-none"
              : "text-gray-600 dark:text-[#A1A1A1] hover:bg-gray-50 dark:hover:bg-[#2C1A14]"
          }`}
        >
          <MapPin className="w-5 h-5" /> آدرس‌های من
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "orders"
              ? "bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] shadow-md dark:shadow-none"
              : "text-gray-600 dark:text-[#A1A1A1] hover:bg-gray-50 dark:hover:bg-[#2C1A14]"
          }`}
        >
          <ShoppingBag className="w-5 h-5" /> سفارش‌های من
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5 rotate-180" /> خروج از حساب
        </button>
      </nav>
    </div>
  );
}