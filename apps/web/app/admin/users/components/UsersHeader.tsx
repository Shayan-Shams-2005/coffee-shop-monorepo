// app/admin/users/components/UsersHeader.tsx
import { Users } from "lucide-react";

export function UsersHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight flex items-center gap-3">
        <Users className="w-8 h-8 text-[#C68E58]" />
        مدیریت کاربران
      </h1>
      <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
        مشاهده، ویرایش و مدیریت سطح دسترسی حساب‌های کاربری
      </p>
    </div>
  );
}