"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Box,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { mockOrders } from "../../lib/mock/orders-data";

export function ProfileOrdersTab() {
  const [orderFilter, setOrderFilter] = useState<
    "active" | "delivered" | "canceled" | "returned"
  >("active");

  const filteredOrders = mockOrders.filter(
    (order) => order.status === orderFilter,
  );

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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-100 dark:border-[#3c2317] rounded-2xl p-5 hover:border-[#D4A373]/40 dark:hover:border-[#6A422D] transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 dark:border-[#3c2317] pb-4 mb-4 transition-colors">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] transition-colors">
                    {order.id}
                  </span>
                  <span className="text-gray-300 dark:text-[#6A5A4F] transition-colors">
                    |
                  </span>
                  <span className="text-gray-500 dark:text-[#A1A1A1] transition-colors">
                    {order.date}
                  </span>
                </div>
                <div className="flex items-center gap-4 justify-between md:justify-end">
                  <span className="font-black text-[#2C1E16] dark:text-[#FFF8F0] transition-colors">
                    {order.total.toLocaleString("fa-IR")}{" "}
                    <span className="text-xs font-normal text-gray-400 dark:text-[#A1A1A1] transition-colors">
                      تومان
                    </span>
                  </span>
                  <button className="text-[#D4A373] dark:text-[#C68E58] hover:text-[#4A3022] dark:hover:text-[#FFD7BA] flex items-center gap-1 text-sm font-bold transition-colors">
                    مشاهده جزئیات <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {order.items.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 bg-gray-50 dark:bg-[#1A1412] rounded-xl border border-gray-100 dark:border-[#3c2317] flex-shrink-0 transition-colors"
                  >
                    <Image
                      src={img}
                      alt="محصول"
                      fill
                      className="object-cover rounded-xl p-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
            <Box className="w-16 h-16 text-gray-200 dark:text-[#3c2317] mb-4 transition-colors" />
            <p className="text-gray-500 dark:text-[#A1A1A1] font-medium transition-colors">
              هیچ سفارشی در این دسته‌بندی یافت نشد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
