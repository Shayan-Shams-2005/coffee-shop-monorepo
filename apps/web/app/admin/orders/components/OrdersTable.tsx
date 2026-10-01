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
        <Receipt className="w-16 h-16 opacity-20 mb-4 text-[#E3C3A4] dark:text-[#3c2317]" />
        <p className="font-bold">سفارشی با این مشخصات یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
          <tr>
            <th className="p-5 whitespace-nowrap">کد سفارش</th>
            <th className="p-5 whitespace-nowrap">مشتری</th>
            <th className="p-5 whitespace-nowrap">تاریخ ثبت</th>
            <th className="p-5 whitespace-nowrap">مبلغ کل</th>
            <th className="p-5 whitespace-nowrap">وضعیت</th>
            <th className="p-5 whitespace-nowrap text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            return (
              <tr 
                key={order.id} 
                className="hover:bg-[#C68E58]/5 dark:hover:bg-[#2A1B16]/50 transition-colors group"
              >
                <td className="p-5">
                  <span className="font-black text-lg text-[#4A3022] dark:text-white dir-ltr tracking-wider inline-block">{order.id}</span>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4A3022] dark:text-white">{order.customerName}</span>
                    <span className="text-xs font-bold text-[#8C7A6B] mt-1 dir-ltr text-right">{toFarsiNumber(order.phone)}</span>
                  </div>
                </td>
                <td className="p-5 text-[#8C7A6B] dark:text-[#A1A1A1] text-sm font-bold">
                  {toFarsiNumber(formatDate(order.date))}
                </td>
                <td className="p-5 font-black text-[#C68E58]">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${status.bg.replace('bg-', 'border-')} ${status.color} ${status.bg}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => onViewDetails(order)}
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
  );
}