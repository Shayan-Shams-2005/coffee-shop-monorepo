"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, MapPin, ShoppingBag, LogOut, Camera } from "lucide-react";
import { useAuthStore } from "../../src/store/useAuthStore";

interface SidebarProps {
  activeTab: "profile" | "addresses" | "orders";
  setActiveTab: (tab: "profile" | "addresses" | "orders") => void;
}

export function ProfileSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateUser({ avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="md:col-span-1 bg-white dark:bg-[#1A110F] rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] flex flex-col sticky top-24 transition-colors">
      <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-[#3c2317] pb-6 mb-6 transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 bg-[#FFF9F2] dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-[#D4A373] dark:text-[#C68E58] mb-4 border-4 border-white dark:border-[#1A110F] shadow-sm cursor-pointer group overflow-hidden transition-colors"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="پروفایل"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-10 h-10" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg mb-1 transition-colors">
          {user.firstName
            ? `${user.firstName} ${user.lastName}`
            : "کاربر نئو کافه"}
        </h2>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm font-bold dir-ltr transition-colors">
          {user.phone}
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
