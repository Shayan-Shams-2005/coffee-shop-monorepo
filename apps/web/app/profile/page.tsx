"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Loader2 } from "lucide-react";
import { useAuthStore } from "../../src/store/useAuthStore";
import { ProfileSidebar } from "../../components/profile/ProfileSidebar";

import { ProfileInfoTab } from "../../components/profile/ProfileInfoTab";
import { ProfileAddressesTab } from "../../components/profile/ProfileAddressesTab";
import { ProfileOrdersTab } from "../../components/profile/ProfileOrdersTab";

export default function ProfilePage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "orders"
  >("profile");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted || !user) {
    return (
      // 🚀 FIXED: Added dark mode background and loader colors
      <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen flex items-center justify-center transition-colors">
        <Loader2 className="w-10 h-10 text-[#D4A373] dark:text-[#6A422D] animate-spin" />
      </div>
    );
  }

  return (
    // 🚀 FIXED: Added full screen dark mode wrapper
    <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          {/* 🚀 FIXED: Dark mode text and icon wrapper styling */}
          <h1 className="text-2xl font-black text-[#2C1E16] dark:text-white flex items-center gap-3 transition-colors">
            <div className="p-3 bg-[#D4A373]/10 dark:bg-[#6A422D]/20 rounded-2xl text-[#D4A373] dark:text-[#C68E58] transition-colors">
              <User className="w-7 h-7" />
            </div>
            حساب کاربری من
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="md:col-span-3 space-y-6 animate-in fade-in duration-300">
            {activeTab === "profile" && <ProfileInfoTab />}
            {activeTab === "addresses" && <ProfileAddressesTab />}
            {activeTab === "orders" && <ProfileOrdersTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
