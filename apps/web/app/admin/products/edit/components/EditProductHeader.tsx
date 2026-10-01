// app/admin/products/edit/components/EditProductHeader.tsx
import Link from "next/link";
import { Save, ArrowRight } from "lucide-react";

interface EditProductHeaderProps {
  productTitle: string;
}

export function EditProductHeader({ productTitle }: EditProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FCF9F5] dark:bg-[#1A0F0C] p-4 sm:p-5 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none sticky top-4 z-30 transition-all">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-3 bg-white dark:bg-[#231511] text-[#8C7A6B] dark:text-[#EAE0D5] hover:text-[#C68E58] dark:hover:text-[#C68E58] hover:bg-[#F5EFE6] rounded-2xl transition-all border border-[#E3C3A4]/60 dark:border-[#3c2317]"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5] transition-colors">ویرایش محصول</h1>
          <p className="text-xs font-medium text-[#8C7A6B] mt-1 hidden sm:block">
            {productTitle}
          </p>
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
      >
        <Save className="w-4 h-4" /> ذخیره تغییرات
      </button>
    </div>
  );
}