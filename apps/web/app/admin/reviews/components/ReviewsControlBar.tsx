// app/admin/reviews/components/ReviewsControlBar.tsx
"use client";

import { Search, Filter, ChevronDown } from "lucide-react";
import { ReviewStatus } from "../types";

interface ReviewsControlBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: ReviewStatus | "all" | "reported";
  setFilterStatus: (status: ReviewStatus | "all" | "reported") => void;
}

export function ReviewsControlBar({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }: ReviewsControlBarProps) {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] p-4 sm:p-5 mb-8 flex flex-col sm:flex-row gap-4 shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
      
      <div className="relative flex-1">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[#8C7A6B]" />
        </div>
        <input
          type="text"
          style={{ textAlign: 'right', direction: 'rtl' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در متن نظر، نام کاربر یا محصول..."
          className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-10 pl-4 py-2.5 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all text-sm font-bold"
        />
      </div>

      <div className="relative w-full sm:w-48 shrink-0">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Filter className="w-4 h-4 text-[#8C7A6B]" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="w-full appearance-none bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-2.5 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] text-sm font-bold cursor-pointer"
        >
          <option value="all">همه نظرات</option>
          <option value="pending">در انتظار تایید</option>
          <option value="approved">تایید شده</option>
          <option value="reported">گزارش شده</option>
        </select>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
        </div>
      </div>
    </div>
  );
}