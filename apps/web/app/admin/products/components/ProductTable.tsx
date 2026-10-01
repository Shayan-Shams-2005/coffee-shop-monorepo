// app/admin/products/components/ProductTable.tsx
import Link from "next/link";
import { Search, PackageSearch, Tag, Timer, Infinity, Edit, Trash2 } from "lucide-react";
import { Product } from "../types";
import { toFarsiNumber, formatPersianDate } from "../constants";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onResetFilters: () => void;
}

export function ProductTable({ products, onDelete, onResetFilters }: ProductTableProps) {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <tr>
              <th className="p-5 whitespace-nowrap">محصول</th>
              <th className="p-5 whitespace-nowrap">دسته‌بندی</th>
              <th className="p-5 whitespace-nowrap text-left pl-8">قیمت (تومان)</th>
              <th className="p-5 whitespace-nowrap text-center">زمان پیشنهاد</th>
              <th className="p-5 whitespace-nowrap text-center">حجم فروش</th>
              <th className="p-5 whitespace-nowrap">موجودی</th>
              <th className="p-5 whitespace-nowrap text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-[#C68E58]/5 dark:hover:bg-[#231511]/60 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6]/50 dark:bg-[#231511] border border-[#E3C3A4]/50 dark:border-[#3c2317] relative p-1 flex-shrink-0 flex items-center justify-center group-hover:border-[#C68E58]/40 transition-colors">
                        <PackageSearch className="w-6 h-6 text-[#C68E58]/60 dark:text-[#6A5A4F]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#4A3022] dark:text-[#EAE0D5] line-clamp-2">{product.name}</span>
                        <span className="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {product.brand}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-medium text-[#4A3022] dark:text-[#D4C4B7] whitespace-nowrap truncate max-w-[180px]">
                    {product.category}
                  </td>
                  <td className="p-5 whitespace-nowrap dir-ltr text-left pl-8">
                    {product.hasOffer && product.newPrice ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-black text-rose-500 text-[15px]">
                          {product.newPrice.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-[#8C7A6B] line-through text-xs font-bold opacity-70">
                          {product.price.toLocaleString("fa-IR")}
                        </span>
                      </div>
                    ) : (
                      <span className="font-black text-[#4A3022] dark:text-[#C68E58] text-[15px]">
                        {product.price.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </td>
                  <td className="p-5 whitespace-nowrap text-center">
                    {product.hasOffer ? (
                      product.offerEndDate ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
                          <Timer className="w-4 h-4" /> 
                          <span dir="rtl">{formatPersianDate(product.offerEndDate)}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-1 text-[#C68E58] bg-[#C68E58]/10 px-3 py-1.5 rounded-full text-[13px] font-bold">
                          <Infinity className="w-4 h-4" /> دائمی
                        </div>
                      )
                    ) : (
                      <span className="text-[#8C7A6B] font-black text-lg">-</span>
                    )}
                  </td>
                  <td className="p-5 font-black text-[#4A3022] dark:text-[#C68E58] text-center whitespace-nowrap">
                    {toFarsiNumber(product.salesVolume)}
                  </td>
                  <td className="p-5 whitespace-nowrap">
                    {product.stock > 0 ? (
                      <span className="text-[#8C7A6B] dark:text-[#A1A1A1] text-xs font-bold">{toFarsiNumber(product.stock)} عدد</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
                        ناموجود
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    {/* 🚀 Changed Button Colors Here! */}
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      <Link href={`/admin/products/edit`} className="p-2.5 text-[#C68E58] hover:text-[#D4A373] hover:bg-[#F5EFE6] dark:text-[#C68E58] dark:hover:text-[#E3C3A4] dark:hover:bg-[#231511] rounded-xl transition-all inline-flex border border-transparent dark:hover:border-[#3c2317]">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => onDelete(product.id)} className="p-2.5 text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all border border-transparent dark:hover:border-rose-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[#8C7A6B] font-medium">
                  <Search className="w-10 h-10 mx-auto text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 opacity-50" />
                  هیچ محصولی با این فیلترها یافت نشد.
                  <button onClick={onResetFilters} className="block mx-auto mt-4 text-[#C68E58] hover:text-[#A87242] font-bold text-sm">
                    حذف فیلترها
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}