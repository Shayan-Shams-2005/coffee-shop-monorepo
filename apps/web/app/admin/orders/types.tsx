// app/admin/orders/types.tsx
import React from "react";
import { Clock, Package, Truck, CheckCircle, Ban } from "lucide-react";

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatPrice = (price: number | undefined) => {
  if (price === undefined) return "۰ تومان";
  return toFarsiNumber(price.toLocaleString()) + " تومان";
};

export const formatDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fa-IR', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  } catch {
    return "-";
  }
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// 🚀 تبدیل کدهای بک‌اند به کدهای فرانت‌اند
export const mapBackendStatusToFrontend = (status: number): OrderStatus => {
  switch (status) {
    case 0: return 'pending';   // Pending
    case 1: return 'processing';// Paid
    case 2: return 'shipped';   // Shipped
    case 3: return 'delivered'; // Delivered
    case 4: return 'cancelled'; // Cancelled
    default: return 'pending';
  }
};

export interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // شناسه ظاهری مثلا ORD-12
  numericId: number; // شناسه واقعی در دیتابیس برای درخواست‌ها
  customerName: string;
  phone: string;
  date: string; 
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  address: string;
}

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "در انتظار تایید", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "پرداخت شده / پردازش", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", icon: <Package className="w-4 h-4" /> },
  shipped: { label: "ارسال شده", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "تحویل داده شده", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "لغو شده", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", icon: <Ban className="w-4 h-4" /> },
};