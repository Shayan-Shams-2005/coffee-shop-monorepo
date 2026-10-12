"use client";

import { useState } from "react";
import { ShoppingBag, Box, CheckCircle, XCircle, RotateCcw } from "lucide-react";

export function ProfileOrdersTab() {
  const [orderFilter, setOrderFilter] = useState<
    "active" | "delivered" | "canceled" | "returned"
  >("active");

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 flex items-center gap-2 transition-colors">
        <ShoppingBag className="w-6 h-6 text-[#D4A373] dark:text-[#C68E58] transition-colors" />
        تاریخچه سفارش‌ها
      </h2>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 mb-6 transition-colors">
        <button
          onClick={() => setOrderFilter("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            orderFilter === "active"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-gray-500 hover:bg-gray-50 dark:text-[#A1A1A1] dark:hover:bg-[#2C1A14]"
          }`}
        >
          <Box className="w-4 h-4" /> جاری
        </button>
        <button
          onClick={() => setOrderFilter("delivered")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            orderFilter === "delivered"
              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              : "text-gray-500 hover:bg-gray-50 dark:text-[#A1A1A1] dark:hover:bg-[#2C1A14]"
          }`}
        >
          <CheckCircle className="w-4 h-4" /> تحویل شده
        </button>
        <button
          onClick={() => setOrderFilter("canceled")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            orderFilter === "canceled"
              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "text-gray-500 hover:bg-gray-50 dark:text-[#A1A1A1] dark:hover:bg-[#2C1A14]"
          }`}
        >
          <XCircle className="w-4 h-4" /> لغو شده
        </button>
        <button
          onClick={() => setOrderFilter("returned")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            orderFilter === "returned"
              ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
              : "text-gray-500 hover:bg-gray-50 dark:text-[#A1A1A1] dark:hover:bg-[#2C1A14]"
          }`}
        >
          <RotateCcw className="w-4 h-4" /> مرجوعی
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-center py-12 flex flex-col items-center">
          <Box className="w-16 h-16 text-gray-200 dark:text-[#3c2317] mb-4 transition-colors" />
          <p className="text-gray-500 dark:text-[#A1A1A1] font-medium transition-colors">
            هیچ سفارشی در این دسته‌بندی یافت نشد.
          </p>
        </div>
      </div>
    </div>
  );
}