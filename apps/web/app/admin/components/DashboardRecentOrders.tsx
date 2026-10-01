// app/admin/components/DashboardRecentOrders.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { RECENT_ORDERS_DATA } from "../constants";
import { OrderDetailsModal } from "../orders/components/OrderDetailsModal";
import { Order, OrderStatus } from "../orders/types";

export function DashboardRecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewDetails = (recentOrder: typeof RECENT_ORDERS_DATA[0]) => {
    // 1. Map the Persian string status to the internal OrderStatus type
    let status: OrderStatus = "pending";
    if (recentOrder.status.includes("پردازش")) status = "processing";
    if (recentOrder.status.includes("تحویل")) status = "delivered";
    if (recentOrder.status.includes("مرجوعی") || recentOrder.status.includes("لغو")) status = "cancelled";

    // 2. Convert the Persian string price (e.g. "۸۵۰,۰۰۰") back to a standard Number
    const persianToEn = (s: string) => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const numericTotal = parseInt(persianToEn(recentOrder.total).replace(/\D/g, ''), 10) || 0;

    // 3. Construct a full Order object so your existing modal renders perfectly
    const fullOrder: Order = {
      id: recentOrder.id,
      customerName: recentOrder.customer,
      date: new Date().toISOString(), // Mocking current time for dashboard preview
      status: status,
      totalAmount: numericTotal,
      phone: "09123456789", // Mock data since constants only hold basic info
      address: "تهران، آدرس تستی برای پیش‌نمایش داشبورد",
      items: [
        { id: "1", name: "اقلام سفارش (نسخه پیش‌نمایش)", price: numericTotal, quantity: 1 }
      ]
    };

    setSelectedOrder(fullOrder);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> آخرین سفارشات
        </h2>
        <Link href="/admin/orders" className="text-sm font-bold text-[#C68E58] hover:text-[#D4A373] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors group">
          مشاهده همه <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
              <tr>
                <th className="p-5 whitespace-nowrap">شماره سفارش</th>
                <th className="p-5 whitespace-nowrap">مشتری</th>
                <th className="p-5 whitespace-nowrap">زمان ثبت</th>
                <th className="p-5 whitespace-nowrap">مبلغ (تومان)</th>
                <th className="p-5 whitespace-nowrap">وضعیت</th>
                <th className="p-5 whitespace-nowrap text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
              {RECENT_ORDERS_DATA.map((order, idx) => {
                const IconComponent = order.icon;
                return (
                  <tr key={idx} className="hover:bg-[#C68E58]/5 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                    <td className="p-5">
                      <span className="font-black text-lg text-[#4A3022] dark:text-white dir-ltr tracking-wider inline-block">{order.id}</span>
                    </td>
                    <td className="p-5 font-bold text-[#4A3022] dark:text-white">{order.customer}</td>
                    <td className="p-5 text-[#8C7A6B] dark:text-[#A1A1A1] text-sm font-bold">{order.time}</td>
                    <td className="p-5 font-black text-[#C68E58]">{order.total}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${order.color}`}>
                        <IconComponent className="w-3.5 h-3.5" /> {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#F5EFE6] dark:hover:bg-[#3A221C] text-[#C68E58] rounded-xl text-sm font-bold transition-colors"
                      >
                        <Eye className="w-4 h-4" /> جزئیات
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the Exact Modal you provided without changes */}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onCancelOrder={(id) => {
          alert("این نسخه پیش‌نمایش در داشبورد است. برای لغو به صفحه مدیریت سفارشات بروید.");
          setSelectedOrder(null);
        }} 
      />
    </div>
  );
}