"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // 🚀 Added Image import for the profile picture
import { User, LogIn } from "lucide-react";
import { useAuthStore } from "../../../src/store/useAuthStore";

export function AuthButton() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-gray-100 dark:bg-[#1A110F] animate-pulse rounded-xl flex items-center gap-2 border border-transparent transition-colors">
        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#3c2317]"></div>
        <div className="hidden sm:block w-16 h-4 rounded bg-gray-200 dark:bg-[#3c2317]"></div>
      </div>
    );
  }

  // حالت لاگین شده: نمایش دکمه پروفایل
  if (isAuthenticated && user) {
    return (
      <Link
        href="/profile"
        // 🚀 FIXED: Applied hollow secondary button style to match reference image
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 bg-[#FCF9F5] text-[#C68E58] border border-[#E3C3A4] hover:bg-[#F0EBE1] dark:bg-transparent dark:text-[#F3E8E0] dark:border-[#6A422D] dark:hover:bg-[#6A422D]/10"
      >
        {/* 🚀 FIXED: Added profile picture rendering logic */}
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.firstName || "پروفایل"}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="hidden sm:inline-block">
          {user.firstName ? user.firstName : "حساب کاربری"}
        </span>
      </Link>
    );
  }

  // حالت لاگین نشده: نمایش دکمه ورود
  return (
    <Link
      href="/login"
      // 🚀 FIXED: Standardized the unauthenticated state to match the hollow style
      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 bg-[#FCF9F5] text-[#C68E58] border border-[#E3C3A4] hover:bg-[#F0EBE1] dark:bg-transparent dark:text-[#F3E8E0] dark:border-[#6A422D] dark:hover:bg-[#6A422D]/10"
    >
      <LogIn className="w-5 h-5" />
      <span className="hidden sm:inline-block">ورود | ثبت‌نام</span>
    </Link>
  );
}
