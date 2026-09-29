// app/admin/orders/types.tsx
import React from "react";
import { Clock, Package, Truck, CheckCircle, Ban } from "lucide-react";

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatPrice = (price: number) => {
  return toFarsiNumber(price.toLocaleString()) + " تومان";
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
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
  processing: { label: "در حال پردازش", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", icon: <Package className="w-4 h-4" /> },
  shipped: { label: "ارسال شده", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "تحویل داده شده", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "لغو شده", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", icon: <Ban className="w-4 h-4" /> },
};

export const initialOrders: Order[] = [
  {
    id: "ORD-98234",
    customerName: "علی رضایی",
    phone: "09123456789",
    date: "2023-10-25T14:30:00",
    totalAmount: 1250000,
    status: "pending",
    address: "تهران، خیابان ولیعصر، کوچه نصر، پلاک ۱۲، واحد ۳",
    items: [
      { id: "i1", name: "دانه قهوه اسپرسو ۱۰۰٪ عربیکا (۲۵۰ گرم)", quantity: 2, price: 450000 },
      { id: "i2", name: "سیروپ کارامل مونین", quantity: 1, price: 350000 }
    ]
  },
  {
    id: "ORD-98233",
    customerName: "سارا احمدی",
    phone: "09351112233",
    date: "2023-10-24T09:15:00",
    totalAmount: 3400000,
    status: "processing",
    address: "اصفهان، چهارباغ عباسی، مجتمع تجاری عالی‌قاپو، طبقه ۲",
    items: [
      { id: "i3", name: "دستگاه اسپرسوساز خانگی نوا 149", quantity: 1, price: 3400000 }
    ]
  },
  {
    id: "ORD-98232",
    customerName: "محمد کریمی",
    phone: "09198887766",
    date: "2023-10-22T16:45:00",
    totalAmount: 850000,
    status: "shipped",
    address: "شیراز، خیابان زند، کوچه ۸، ساختمان پارس",
    items: [
      { id: "i4", name: "قهوه جوش موکاپات ۳ کاپ بیالتی", quantity: 1, price: 850000 }
    ]
  },
  {
    id: "ORD-98231",
    customerName: "فاطمه حسینی",
    phone: "09102224455",
    date: "2023-10-20T11:20:00",
    totalAmount: 2100000,
    status: "delivered",
    address: "مشهد، بلوار سجاد، خیابان بهارستان، پلاک ۴۴",
    items: [
      { id: "i5", name: "دانه قهوه ترکیب ویژه (۱ کیلوگرم)", quantity: 2, price: 900000 },
      { id: "i6", name: "ترازوی دیجیتال قهوه", quantity: 1, price: 300000 }
    ]
  },
  {
    id: "ORD-98230",
    customerName: "امیرحسین نوری",
    phone: "09025556677",
    date: "2023-10-18T18:00:00",
    totalAmount: 560000,
    status: "cancelled",
    address: "تهران، سعادت آباد، بلوار دریا، پلاک ۱۹",
    items: [
      { id: "i7", name: "فیلتر کاغذی V60 هاریو (۱۰۰ تایی)", quantity: 2, price: 280000 }
    ]
  }
];