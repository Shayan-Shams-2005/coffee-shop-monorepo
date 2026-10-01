// app/admin/notifications/components/NotificationFilters.tsx
"use client";

import { Search, ChevronDown } from "lucide-react";
import { NotificationType } from "../types";

interface NotificationFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterType: NotificationType | "all";
  setFilterType: (val: NotificationType | "all") => void;
  filterStatus: "all" | "read" | "unread";
  setFilterStatus: (val: "all" | "read" | "unread") => void;
}

export function NotificationFilters({
  searchQuery, setSearchQuery,
  filterType, setFilterType,
  filterStatus, setFilterStatus
}: NotificationFiltersProps) {
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
          placeholder="جستجو در متن، موضوع یا شماره تماس..."
          className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pr-10 pl-4 py-2.5 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all text-sm font-bold"
        />
      </div>

      <div className="flex gap-3">
        <div className="relative w-32 shrink-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full appearance-none bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-3 py-2.5 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] text-sm font-bold cursor-pointer"
          >
            <option value="all">همه انواع</option>
            <option value="bug">گزارش باگ</option>
            <option value="question">سوالات</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>

        <div className="relative w-32 shrink-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full appearance-none bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-3 py-2.5 text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] text-sm font-bold cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="unread">خوانده نشده</option>
            <option value="read">خوانده شده</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>
      </div>
    </div>
  );
}