// app/admin/orders/components/OrdersControlBar.tsx
"use client";

import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { OrderStatus } from "../types";

interface OrdersControlBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterStatus: OrderStatus | "all";
  setFilterStatus: (val: OrderStatus | "all") => void;
  sortBy: "date_desc" | "date_asc" | "price_desc" | "price_asc";
  setSortBy: (val: "date_desc" | "date_asc" | "price_desc" | "price_asc") => void;
}

export function OrdersControlBar({
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  sortBy, setSortBy
}: OrdersControlBarProps) {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 items-center shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
      <div className="relative w-full lg:flex-1">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#8C7A6B]" />
        </div>
        <input
          type="text"
          suppressHydrationWarning // 🚀 FIX: جلوگیری از ارور Hydration ناشی از اکستنشن‌های مرورگر
          style={{ textAlign: 'right', direction: 'rtl' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در نام، شماره یا کد سفارش..."
          className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-12 pl-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all text-sm font-bold"
        />
      </div>

      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
        {/* Role Filter */}
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-[#8C7A6B]" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full appearance-none bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all text-sm font-bold cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">در انتظار تایید</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل داده شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ArrowUpDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full appearance-none bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all text-sm font-bold cursor-pointer"
          >
            <option value="date_desc">جدیدترین</option>
            <option value="date_asc">قدیمی‌ترین</option>
            <option value="price_desc">بیشترین مبلغ</option>
            <option value="price_asc">کمترین مبلغ</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>
      </div>
    </div>
  );
}