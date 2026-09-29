// app/admin/products/components/ProductsHeader.tsx
import Link from "next/link";
import { Plus } from "lucide-react";

export function ProductsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت محصولات</h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و قیمت‌گذاری کالاهای فروشگاه</p>
      </div>
      
      <Link href="/admin/products/edit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5">
        <Plus className="w-5 h-5" /> افزودن محصول جدید
      </Link>
    </div>
  );
}