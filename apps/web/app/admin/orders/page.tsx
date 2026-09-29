// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import { 
  Search, Filter, ArrowUpDown, Eye, Ban, 
  MapPin, Phone, User, Calendar, Receipt, 
  Package, Truck, CheckCircle, Clock, X, ChevronDown
} from "lucide-react";

// --- Helpers ---
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatPrice = (price: number) => {
  return toFarsiNumber(price.toLocaleString()) + " تومان";
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

// --- Types ---
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  date: string; // ISO String for sorting
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  address: string;
}

// --- Mock Data ---
const initialOrders: Order[] = [
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

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "در انتظار تایید", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "در حال پردازش", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", icon: <Package className="w-4 h-4" /> },
  shipped: { label: "ارسال شده", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "تحویل داده شده", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "لغو شده", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", icon: <Ban className="w-4 h-4" /> },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Filters and Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "price_desc" | "price_asc">("date_desc");
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Derived State (Filtering & Sorting)
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) || 
        o.phone.includes(q)
      );
    }

    // 2. Filter by Status
    if (filterStatus !== "all") {
      result = result.filter(o => o.status === filterStatus);
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "price_desc") return b.totalAmount - a.totalAmount;
      if (sortBy === "price_asc") return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, searchQuery, filterStatus, sortBy]);

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">سفارشات مشتریان</h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">مدیریت، پیگیری و بررسی صورت‌حساب‌های فروشگاه</p>
      </div>

      {/* Control Bar (Search, Filter, Sort) */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] p-4 sm:p-6 mb-8 flex flex-col lg:flex-row gap-4 items-center shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#8C7A6B]" />
          </div>
          <input
            type="text"
            style={{ textAlign: 'right', direction: 'rtl' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام، شماره یا کد سفارش..."
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-12 pl-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
          {/* Filter */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-[#8C7A6B]" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full appearance-none bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار تایید</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipped">ارسال شده</option>
              <option value="delivered">تحویل داده شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
            </div>
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ArrowUpDown className="w-4 h-4 text-[#8C7A6B]" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full appearance-none bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold cursor-pointer"
            >
              <option value="date_desc">جدیدترین</option>
              <option value="date_asc">قدیمی‌ترین</option>
              <option value="price_desc">بیشترین مبلغ</option>
              <option value="price_asc">کمترین مبلغ</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-16 text-[#8C7A6B] dark:text-[#6A5A4F] flex flex-col items-center">
            <Receipt className="w-16 h-16 opacity-20 mb-4" />
            <p className="font-bold">سفارشی با این مشخصات یافت نشد.</p>
          </div>
        ) : (
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
                {filteredAndSortedOrders.map((order) => {
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
                          onClick={() => setSelectedOrder(order)}
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
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] shrink-0">
              <div>
                <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#C68E58]" />
                  جزئیات سفارش <span className="dir-ltr inline-block text-[#C68E58]">{selectedOrder.id}</span>
                </h2>
                <p className="text-xs text-[#8C7A6B] mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> ثبت شده در {toFarsiNumber(formatDate(selectedOrder.date))}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 bg-gray-100 dark:bg-[#2A1B16] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Status and Actions Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#8C7A6B]">وضعیت فعلی:</span>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${STATUS_CONFIG[selectedOrder.status].bg} ${STATUS_CONFIG[selectedOrder.status].color}`}>
                    {STATUS_CONFIG[selectedOrder.status].icon}
                    {STATUS_CONFIG[selectedOrder.status].label}
                  </div>
                </div>
                
                {/* Cancel Button (Only if not already cancelled or delivered) */}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={() => {
                      if(confirm("آیا از لغو این سفارش اطمینان دارید؟")) {
                        handleCancelOrder(selectedOrder.id);
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Ban className="w-4 h-4" /> لغو سفارش
                  </button>
                )}
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-black text-[#4A3022] dark:text-[#EAE0D5] mb-3">اطلاعات مشتری</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                    <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8C7A6B] mb-0.5">نام و نام خانوادگی</p>
                      <p className="font-bold text-[#2C1E16] dark:text-white text-sm">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                    <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8C7A6B] mb-0.5">شماره تماس</p>
                      <p className="font-bold text-[#2C1E16] dark:text-white text-sm dir-ltr text-right">{toFarsiNumber(selectedOrder.phone)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317] md:col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8C7A6B] mb-1">آدرس ارسال</p>
                      <p className="font-bold text-[#2C1E16] dark:text-white text-sm leading-relaxed">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-black text-[#4A3022] dark:text-[#EAE0D5] mb-3">اقلام سفارش</h3>
                <div className="border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 ${index !== selectedOrder.items.length - 1 ? 'border-b border-[#F5EFE6] dark:border-[#3c2317]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#FCF9F5] dark:bg-[#231511] flex items-center justify-center text-[#C68E58] text-xs font-bold shrink-0">
                          {toFarsiNumber(item.quantity)}x
                        </div>
                        <p className="text-sm font-bold text-[#2C1E16] dark:text-white">{item.name}</p>
                      </div>
                      <div className="text-sm font-bold text-[#8C7A6B] shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Summary */}
                  <div className="bg-[#FCF9F5] dark:bg-[#231511] p-4 flex items-center justify-between border-t border-[#F5EFE6] dark:border-[#3c2317]">
                    <span className="font-black text-[#4A3022] dark:text-[#EAE0D5]">جمع کل پرداخت شده:</span>
                    <span className="font-black text-lg text-[#C68E58]">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}