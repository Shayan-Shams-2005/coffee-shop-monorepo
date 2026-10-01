// app/admin/coupons/components/CouponTable.tsx
"use client";

import { useState } from "react";
import { Copy, Check, CheckCircle2, XCircle, Edit, Trash2, TicketPercent } from "lucide-react";
import { Coupon, toFarsiNumber } from "../types";

interface CouponTableProps {
  coupons: Coupon[];
  onToggleStatus: (id: string) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

export function CouponTable({ coupons, onToggleStatus, onEdit, onDelete }: CouponTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
      <div className="p-5 sm:p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30">
        <h2 className="text-lg font-black text-[#4A3022] dark:text-white">کدهای تخفیف ایجاد شده</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <tr>
              <th className="p-5 whitespace-nowrap">کد تخفیف</th>
              <th className="p-5 whitespace-nowrap text-center">درصد تخفیف</th>
              <th className="p-5 whitespace-nowrap text-center">وضعیت</th>
              <th className="p-5 whitespace-nowrap text-center">اعتبار</th>
              <th className="p-5 whitespace-nowrap text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#C68E58]/5 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleCopy(coupon.code, coupon.id)}
                        className="p-1.5 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-lg text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#3A221C] transition-colors"
                        title="کپی کد"
                      >
                        {copiedId === coupon.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <span className="font-black text-lg text-[#4A3022] dark:text-white dir-ltr tracking-wider">
                        {coupon.code}
                      </span>
                    </div>
                  </td>

                  <td className="p-5 text-center">
                    <span className="inline-flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-base px-3 py-1 rounded-lg border border-rose-100 dark:border-rose-500/20">
                      {toFarsiNumber(coupon.discount)}%
                    </span>
                  </td>

                  <td className="p-5 text-center">
                    <button 
                      onClick={() => onToggleStatus(coupon.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        coupon.isActive 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-white text-gray-500 border border-[#E3C3A4]/60 hover:bg-[#F5EFE6] dark:bg-[#231511] dark:text-gray-400 dark:border-[#3c2317] dark:hover:bg-[#3A221C]'
                      }`}
                      title="تغییر وضعیت"
                    >
                      {coupon.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {coupon.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>

                  <td className="p-5 text-center text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">
                    {coupon.expiresInDays > 0 
                      ? `${toFarsiNumber(coupon.expiresInDays)} روز`
                      : <span className="text-rose-500">منقضی شده</span>
                    }
                  </td>

                  <td className="p-5">
                    {/* 🚀 Changed to vivid solid colors for action buttons */}
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      <button 
                        onClick={() => onEdit(coupon)}
                        className="p-2.5 text-[#C68E58] hover:text-[#D4A373] hover:bg-[#F5EFE6] dark:text-[#C68E58] dark:hover:text-[#E3C3A4] dark:hover:bg-[#231511] rounded-xl transition-all border border-transparent dark:hover:border-[#3c2317]"
                        title="ویرایش کوپن"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(coupon.id)} 
                        className="p-2.5 text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all border border-transparent dark:hover:border-rose-500/20"
                        title="حذف کوپن"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[#8C7A6B] font-medium">
                  <TicketPercent className="w-10 h-10 mx-auto text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 opacity-50" />
                  هیچ کد تخفیفی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}