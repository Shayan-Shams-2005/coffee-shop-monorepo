// app/admin/notifications/components/NotificationHeader.tsx
import { Bell } from "lucide-react";

export function NotificationHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight flex items-center gap-3">
        <Bell className="w-8 h-8 text-[#C68E58]" />
        صندوق پیام‌ها و خطاها
      </h1>
      <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
        بررسی گزارشات باگ، سوالات کاربران سایت و پاسخگویی به آن‌ها
      </p>
    </div>
  );
}