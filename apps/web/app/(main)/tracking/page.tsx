// app/(main)/tracking/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Receipt,
  CalendarDays,
  Loader2
} from "lucide-react";

// --- Utility: Convert numbers to Farsi ---
const toFarsiNumber = (num: number | string) => {
  if (num === null || num === undefined) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatPrice = (price: number) => price.toLocaleString("fa-IR");

// --- Mock Order Data ---
const MOCK_ORDER = {
  id: "NEO-847291",
  date: "۲۸ آبان ۱۴۰۲",
  total: 850000,
  status: 3, // 1: Pending, 2: Processing, 3: Shipped, 4: Delivered
  items: [
    { name: "دان قهوه عربیکا کنیا (۲۵۰ گرم)", quantity: 2, price: 350000 },
    { name: "موکاپات ۳ کاپ بیالتی", quantity: 1, price: 150000 },
  ],
  shipping: {
    method: "پست پیشتاز",
    trackingCode: "109283746564738291",
    address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲، واحد ۴"
  }
};

const STATUS_STEPS = [
  { id: 1, label: "ثبت سفارش", icon: Clock },
  { id: 2, label: "پردازش و بسته‌بندی", icon: Package },
  { id: 3, label: "تحویل به پست", icon: Truck },
  { id: 4, label: "تحویل به مشتری", icon: CheckCircle2 },
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<typeof MOCK_ORDER | null>(null);
  const [error, setError] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTrackedOrder(null);

    if (!orderId.trim() || !phone.trim()) {
      setError("لطفاً شماره سفارش و شماره موبایل خود را وارد کنید.");
      return;
    }

    if (phone.length < 11) {
      setError("شماره موبایل نامعتبر است.");
      return;
    }

    setIsLoading(true);

    // Simulate API Call delay
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we always return the mock order if inputs are filled
      setTrackedOrder(MOCK_ORDER);
    }, 1500);
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300 font-sans" dir="rtl">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-[#1A110F] border-b border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
        <div className="container mx-auto max-w-[1000px] px-4 py-8 lg:py-12">
          
          <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-8 font-bold">
            <Link href="/" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">خانه</Link>
            <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
            <span className="text-[#3D2616] dark:text-[#EAE0D5] transition-colors">پیگیری سفارشات</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-4 flex items-center gap-3">
              <Search className="w-8 h-8 text-[#C68E58]" />
              پیگیری سفارشات
            </h1>
            <p className="text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed font-medium">
              برای اطلاع از وضعیت سفارش خود، شماره سفارش (پیامک شده) و شماره موبایل ثبت شده در زمان خرید را وارد کنید.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1000px] px-4 py-8 lg:py-12">
        
        {/* Tracking Form */}
        <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 md:p-8 mb-8 shadow-sm transition-colors">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                شماره سفارش
              </label>
              <input
                type="text"
                dir="ltr"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="مثال: NEO-847291"
                className="w-full h-14 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-4 text-left font-bold text-[#4A3022] dark:text-[#EAE0D5] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all placeholder:text-[#8C7A6B]/50 placeholder:font-normal"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                شماره موبایل
              </label>
              <input
                type="tel"
                dir="ltr"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="09123456789"
                className="w-full h-14 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl px-4 text-left font-bold text-[#4A3022] dark:text-[#EAE0D5] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all placeholder:text-[#8C7A6B]/50 placeholder:font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto h-14 px-8 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  پیگیری
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl text-center animate-in fade-in">
              {error}
            </div>
          )}
        </div>

        {/* Tracking Result */}
        {trackedOrder && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Visual Timeline */}
            <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 md:p-10 mb-6 shadow-sm transition-colors">
              <h2 className="text-xl font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-8 text-center">
                وضعیت سفارش: <span className="text-[#C68E58] dir-ltr inline-block ml-2">{trackedOrder.id}</span>
              </h2>

              <div className="relative flex justify-between items-center max-w-3xl mx-auto mb-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-[#3c2317] -translate-y-1/2 rounded-full z-0"></div>
                
                {/* Active Line Fill */}
                <div 
                  className="absolute top-1/2 right-0 h-1 bg-[#C68E58] -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                  style={{ width: `${((trackedOrder.status - 1) / (STATUS_STEPS.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id <= trackedOrder.status;
                  const isCurrent = step.id === trackedOrder.status;

                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? "bg-[#C68E58] text-white shadow-lg shadow-[#C68E58]/30 scale-110" 
                          : "bg-gray-100 dark:bg-[#231511] text-gray-400 dark:text-[#6A5A4F] border border-gray-200 dark:border-[#3c2317]"
                      }`}>
                        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isCurrent ? "animate-pulse" : ""}`} />
                      </div>
                      <span className={`text-xs md:text-sm font-bold absolute -bottom-8 whitespace-nowrap ${
                        isActive ? "text-[#C68E58]" : "text-gray-400 dark:text-[#6A5A4F]"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Summary Info */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 shadow-sm transition-colors">
                  <h3 className="font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#C68E58]" /> اطلاعات سفارش
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8C7A6B] dark:text-[#A1A1A1]">تاریخ ثبت:</span>
                      <span className="font-bold text-[#2C1E16] dark:text-[#EAE0D5]">{trackedOrder.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8C7A6B] dark:text-[#A1A1A1]">مبلغ کل:</span>
                      <span className="font-black text-[#C68E58]">
                        {toFarsiNumber(formatPrice(trackedOrder.total))} تومان
                      </span>
                    </div>
                    <hr className="border-[#F5EFE6] dark:border-[#3c2317]" />
                    <div className="flex flex-col gap-2 text-sm">
                      <span className="text-[#8C7A6B] dark:text-[#A1A1A1] flex items-center gap-1.5">
                        <Truck className="w-4 h-4" /> روش ارسال: {trackedOrder.shipping.method}
                      </span>
                      {trackedOrder.shipping.trackingCode && (
                        <div className="mt-2 p-3 bg-[#FCF9F5] dark:bg-[#231511] rounded-xl border border-[#E3C3A4]/30 dark:border-[#3c2317]">
                          <span className="block text-xs text-[#8C7A6B] mb-1">کد رهگیری پستی:</span>
                          <span className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] dir-ltr block text-left tracking-widest">
                            {trackedOrder.shipping.trackingCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items & Address */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Items */}
                <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 shadow-sm transition-colors">
                  <h3 className="font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#C68E58]" /> اقلام سفارش
                  </h3>
                  <div className="space-y-3">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-[#FCF9F5] dark:hover:bg-[#231511] rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E3C3A4]/20 dark:bg-[#3c2317] flex items-center justify-center text-xs font-bold text-[#C68E58]">
                            {toFarsiNumber(item.quantity)}x
                          </div>
                          <span className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5]">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
                          {toFarsiNumber(formatPrice(item.price))} تومان
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 shadow-sm transition-colors">
                  <h3 className="font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#C68E58]" /> آدرس تحویل
                  </h3>
                  <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] leading-loose font-medium">
                    {trackedOrder.shipping.address}
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}