"use client";

import { Bell, Menu, User as UserIcon } from "lucide-react";
// 🚀 Adjust this relative path based on exactly where your components folder is
import { ThemeCoffeeToggle } from "../../../components/ThemeCoffeeToggle"; 

export function AdminTopBar() {
  return (
    <header className="h-20 bg-white dark:bg-[#1A0F0C] border-b border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-between px-6 lg:px-8 transition-colors sticky top-0 z-40">
      
      {/* ================= سمت راست (عنوان و منوی موبایل) ================= */}
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-[#8C7A6B] hover:text-[#4A3022] dark:hover:text-white transition-colors"
          aria-label="باز کردن منو"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5] hidden sm:block">
          پنل مدیریت نئو کافه
        </h1>
      </div>

      {/* ================= سمت چپ (ابزارها و پروفایل) ================= */}
      <div className="flex items-center gap-3 sm:gap-5" dir="ltr">
        
        {/* 🚀 The same Coffee Toggle from your Navbar! */}
        <ThemeCoffeeToggle />

        <button className="relative p-2 text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#231511]">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#1A0F0C]"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-[#3c2317] mx-1"></div>

        {/* Admin User Profile Snippet */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#231511] p-1.5 pl-4 rounded-full border border-gray-100 dark:border-[#3c2317]" dir="rtl">
          <div className="w-8 h-8 rounded-full bg-[#C68E58] dark:bg-[#7D4F35] text-white flex items-center justify-center shrink-0">
            <UserIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-[#4A3022] dark:text-white hidden sm:block">
            مدیر سایت
          </span>
        </div>

      </div>
    </header>
  );
}