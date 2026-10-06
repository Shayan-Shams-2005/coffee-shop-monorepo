// app/admin/products/edit/components/sidebar/StockSection.tsx
"use client";

import { Package, Minus, Plus } from "lucide-react";
import { ProductFormData } from "../../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function StockSection({ formData, setFormData }: Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value === "" ? "" : Number(value) 
    }));
  };

  const incrementStock = () => {
    setFormData((prev: any) => ({ ...prev, stock: (prev.stock ? Number(prev.stock) : 0) + 1 }));
  };

  const decrementStock = () => {
    setFormData((prev: any) => ({ ...prev, stock: Math.max(0, (prev.stock ? Number(prev.stock) : 0) - 1) }));
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
      <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 transition-colors" dir="rtl">
        <Package className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> موجودی انبار
      </h2>
      
      <div className="space-y-5" dir="rtl">
        <div>
          <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#8C7A6B]" /> تعداد در انبار
          </label>
          <div className="relative flex items-center group">
            <input 
              type="number" 
              name="stock" 
              value={(formData as any).stock ?? ""} 
              onChange={handleChange} 
              placeholder="مثال: ۵۰" 
              min="0" 
              className="w-full h-14 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-5 text-[#4A3022] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all !text-right font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-[4.5rem]" 
              dir="rtl" 
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl overflow-hidden shadow-sm">
              <button type="button" onClick={incrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Plus className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-[#E3C3A4]/60 dark:bg-[#3c2317]"></div>
              <button type="button" onClick={decrementStock} className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#231511] transition-colors"><Minus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}