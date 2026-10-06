// app/admin/products/components/ProductsHeader.tsx
import Link from "next/link";
import { Plus } from "lucide-react";

export function ProductsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-black text-[#4A3022] dark:text-[#EAE0D5]">
          مدیریت محصولات
        </h1>
        <p className="text-sm font-medium text-[#8C7A6B] mt-1">
          افزودن، ویرایش و قیمت‌گذاری کالاهای فروشگاه
        </p>
      </div>

      {/* Add New Product Button */}
      <Link
        href="/admin/products/edit"
        className="
          flex items-center justify-center gap-2 
          bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] 
          text-white px-6 py-3 rounded-2xl text-sm font-bold 
          shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none 
          transition-all active:scale-95 hover:-translate-y-0.5
        "
      >
        <Plus className="w-4 h-4" /> افزودن محصول جدید
      </Link>
    </div>
  );
}