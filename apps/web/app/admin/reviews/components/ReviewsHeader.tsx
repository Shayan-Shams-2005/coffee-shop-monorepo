// app/admin/reviews/components/ReviewsHeader.tsx
import { MessageSquare } from "lucide-react";

export function ReviewsHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-[#C68E58]" />
        مدیریت نظرات
      </h1>
      <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
        بررسی، تایید، پاسخگویی و یا حذف نظرات ثبت شده توسط کاربران
      </p>
    </div>
  );
}