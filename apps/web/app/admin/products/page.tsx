"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Filter, Percent, PackageSearch, Search } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "قهوه تخصصی تک‌خاستگاه لاین ۱",
      category: "دانه قهوه",
      price: 350000,
      stock: 45,
      discount: 0,
      image: "/images/product-1.png",
    },
    {
      id: 2,
      name: "پکیج ویژه ایلی مدل 2",
      category: "تجهیزات",
      price: 395000,
      stock: 12,
      discount: 15,
      image: "/images/product-2.png",
    },
    {
      id: 3,
      name: "قهوه فوری گلد کلاسیک",
      category: "قهوه فوری",
      price: 280000,
      stock: 0,
      discount: 0,
      image: "/images/product-3.png",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت محصولات</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و قیمت‌گذاری کالاهای فروشگاه</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-[#6A5A4F]" />
            </div>
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-[#231511] border border-gray-100 dark:border-[#3c2317] rounded-2xl text-sm font-medium text-[#2C1E16] dark:text-white placeholder-gray-400 dark:placeholder-[#6A5A4F] focus:outline-none focus:border-[#C68E58] dark:focus:border-[#C68E58] shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none transition-all"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#231511] border border-gray-100 dark:border-[#3c2317] text-[#4A3022] dark:text-[#EAE0D5] px-5 py-3 rounded-2xl text-sm font-bold hover:border-[#C68E58] dark:hover:border-[#C68E58] hover:text-[#C68E58] shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none transition-all active:scale-95">
              <Filter className="w-4 h-4" /> فیلتر
            </button>
            <Link href="/admin/edit" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5">
              <Plus className="w-5 h-5" /> افزودن محصول
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#231511] rounded-[2rem] border border-gray-100 dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FCF9F5] dark:bg-[#1A0F0C] text-[#8C7A6B] font-bold border-b border-gray-100 dark:border-[#3c2317]">
              <tr>
                <th className="p-5 whitespace-nowrap">محصول</th>
                <th className="p-5 whitespace-nowrap">دسته‌بندی</th>
                <th className="p-5 whitespace-nowrap">قیمت (تومان)</th>
                <th className="p-5 whitespace-nowrap">وضعیت فروش</th>
                <th className="p-5 whitespace-nowrap text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#3c2317]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FCF9F5]/70 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] relative p-1 flex-shrink-0 flex items-center justify-center group-hover:border-[#C68E58]/30 transition-colors">
                          <PackageSearch className="w-6 h-6 text-gray-300 dark:text-[#6A5A4F]" />
                        </div>
                        <span className="font-bold text-[#2C1E16] dark:text-white line-clamp-2">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-5 font-medium text-[#4A3022] dark:text-[#EAE0D5] whitespace-nowrap">{product.category}</td>
                    <td className="p-5 font-black text-[#2C1E16] dark:text-[#D4A373] whitespace-nowrap dir-ltr text-right">{product.price.toLocaleString("fa-IR")}</td>
                    <td className="p-5 whitespace-nowrap">
                      {product.discount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold w-max">
                          <Percent className="w-3.5 h-3.5" /> {product.discount}٪ تخفیف
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-[#6A5A4F] text-xs font-bold px-3 py-1.5 border border-transparent">قیمت عادی</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/edit`} className="p-2.5 text-gray-400 hover:text-[#C68E58] hover:bg-[#FCF9F5] dark:text-[#6A5A4F] dark:hover:text-[#C68E58] dark:hover:bg-[#1A0F0C] rounded-xl transition-all inline-flex">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setProducts(products.filter((p) => p.id !== product.id))} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:text-[#6A5A4F] dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-8 text-center text-[#8C7A6B] font-medium">هیچ محصولی با این نام یا دسته‌بندی یافت نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}