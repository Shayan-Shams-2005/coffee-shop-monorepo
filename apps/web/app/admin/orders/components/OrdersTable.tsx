// app/admin/orders/components/OrdersTable.tsx
import { Eye, Receipt } from "lucide-react";
import { Order, STATUS_CONFIG, toFarsiNumber, formatPrice, formatDate } from "../types";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-[#8C7A6B] dark:text-[#6A5A4F] flex flex-col items-center">
        <Receipt className="w-16 h-16 opacity-20 mb-4" />
        <p className="font-bold">سفارشی با این مشخصات یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-[#FCF9F5] dark:bg-[#231511] border-b border-[#F5EFE6] dark:border-[#3c2317]">
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">کد سفارش</th>
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">مشتری</th>
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">تاریخ ثبت</th>
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">مبلغ کل</th>
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">وضعیت</th>
            <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5] text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            return (
              <tr 
                key={order.id} 
                className="border-b border-[#F5EFE6] dark:border-[#3c2317] last:border-0 hover:bg-[#FCF9F5]/50 dark:hover:bg-[#231511]/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="font-bold text-[#2C1E16] dark:text-white dir-ltr inline-block">{order.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#2C1E16] dark:text-white">{order.customerName}</span>
                    <span className="text-xs text-[#8C7A6B] mt-0.5">{toFarsiNumber(order.phone)}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-[#8C7A6B] dark:text-[#A1A1A1] text-sm">
                  {toFarsiNumber(formatDate(order.date))}
                </td>
                <td className="py-4 px-6 font-bold text-[#C68E58]">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${status.bg} ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] hover:text-[#C68E58] rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
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
  );
}