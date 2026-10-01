// app/admin/components/DashboardRecentOrders.tsx
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RECENT_ORDERS_DATA } from "../constants";

export function DashboardRecentOrders() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {/* 🚀 Changed header text color to warm brown */}
        <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> آخرین سفارشات
        </h2>
        <Link href="/admin/orders" className="text-sm font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors group">
          مشاهده همه <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
              <tr>
                <th className="p-5 whitespace-nowrap">شماره سفارش</th>
                <th className="p-5 whitespace-nowrap">مشتری</th>
                <th className="p-5 whitespace-nowrap">مبلغ (تومان)</th>
                <th className="p-5 whitespace-nowrap">وضعیت</th>
                <th className="p-5 whitespace-nowrap">زمان ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
              {RECENT_ORDERS_DATA.map((order, idx) => {
                const IconComponent = order.icon;
                return (
                  <tr key={idx} className="hover:bg-[#C68E58]/5 dark:hover:bg-[#231511]/60 transition-colors group">
                    {/* 🚀 Changed order ID text color to warm brown */}
                    <td className="p-5 font-bold text-[#4A3022] dark:text-[#EAE0D5] dir-ltr text-right">{order.id}</td>
                    <td className="p-5 font-medium text-[#4A3022] dark:text-[#D4C4B7]">{order.customer}</td>
                    {/* 🚀 Changed total price text color to warm brown */}
                    <td className="p-5 font-black text-[#4A3022] dark:text-[#C68E58] dir-ltr text-right">{order.total}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${order.color}`}>
                        <IconComponent className="w-3.5 h-3.5" /> {order.status}
                      </span>
                    </td>
                    <td className="p-5 font-medium text-[#8C7A6B] dark:text-[#A1A1A1]">{order.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}