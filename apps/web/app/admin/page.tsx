"use client";

import Link from "next/link";
import { 
  Users, ShoppingBag, DollarSign, Package, 
  Layers, Tag, Image as ImageIcon,
  Clock, CheckCircle, RotateCcw, ChevronLeft
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "درآمد کل", value: "۴۵,۵۰۰,۰۰۰ تومان", icon: DollarSign, color: "text-[#C68E58] dark:text-emerald-500", bg: "bg-[#C68E58]/10 dark:bg-emerald-500/20" },
    { label: "سفارشات جدید", value: "۱۲۴", icon: ShoppingBag, color: "text-[#A87242] dark:text-sky-500", bg: "bg-[#A87242]/10 dark:bg-sky-500/20" },
    { label: "کاربران فعال", value: "۱,۰۴۲", icon: Users, color: "text-[#D4A373] dark:text-[#D4A373]", bg: "bg-[#D4A373]/10 dark:bg-[#D4A373]/20" },
    { label: "محصولات ناموجود", value: "۳", icon: Package, color: "text-rose-500 dark:text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/20" },
  ];

  const quickLinks = [
    { title: "محصولات و موجودی", desc: "افزودن، ویرایش و مدیریت کالاها", href: "/admin/products", icon: Package, accent: "text-[#C68E58] dark:text-amber-500", bg: "bg-[#FCF9F5] dark:bg-amber-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
    { title: "دسته‌بندی‌ها", desc: "مدیریت ساختار دسته‌بندی فروشگاه", href: "/admin/categories", icon: Layers, accent: "text-[#C68E58] dark:text-purple-500", bg: "bg-[#FCF9F5] dark:bg-purple-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
    { title: "برندهای فروشگاه", desc: "تعریف برندها برای فیلتر محصولات", href: "/admin/brands", icon: Tag, accent: "text-[#C68E58] dark:text-indigo-500", bg: "bg-[#FCF9F5] dark:bg-indigo-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
    { title: "بنرهای تبلیغاتی", desc: "مدیریت اسلایدر و بنرهای صفحه اصلی", href: "/admin/banners", icon: ImageIcon, accent: "text-[#C68E58] dark:text-rose-500", bg: "bg-[#FCF9F5] dark:bg-rose-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-rose-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
    { title: "سفارشات مشتریان", desc: "بررسی و تغییر وضعیت سفارشات", href: "/admin/orders", icon: ShoppingBag, accent: "text-[#C68E58] dark:text-emerald-500", bg: "bg-[#FCF9F5] dark:bg-emerald-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
    { title: "لیست کاربران", desc: "مشاهده و مدیریت حساب‌های کاربری", href: "/admin/users", icon: Users, accent: "text-[#C68E58] dark:text-blue-500", bg: "bg-[#FCF9F5] dark:bg-blue-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  ];

  const recentOrders = [
    { id: "NEO-8472", customer: "علی رضایی", total: "۸۵۰,۰۰۰", status: "در حال پردازش", time: "۱۰ دقیقه پیش", icon: Clock, color: "text-blue-600 bg-blue-50 dark:text-sky-400 dark:bg-sky-500/10 border-blue-200 dark:border-sky-500/20" },
    { id: "NEO-8471", customer: "سارا احمدی", total: "۱,۲۴۰,۰۰۰", status: "تحویل شده", time: "۲ ساعت پیش", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
    { id: "NEO-8470", customer: "محمد کریمی", total: "۳۲۰,۰۰۰", status: "مرجوعی", time: "دیروز", icon: RotateCcw, color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-12 animate-in fade-in duration-500">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">داشبورد مدیریت</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">خلاصه وضعیت فروشگاه و دسترسی‌های سریع</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#231511] p-5 rounded-[2rem] border border-[#F0EBE1] dark:border-[#3c2317] flex items-center gap-5 shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all hover:shadow-xl hover:shadow-[#C68E58]/10 dark:hover:shadow-black/20 hover:-translate-y-1">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}><stat.icon className="w-7 h-7" /></div>
              <div>
                <p className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-1">{stat.label}</p>
                <p className="text-xl font-black text-[#2C1E16] dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> دسترسی سریع
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link, idx) => (
            <Link key={idx} href={link.href} className="group bg-white dark:bg-[#231511] p-6 rounded-[2rem] border border-[#F0EBE1] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#5A3826] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all duration-300 hover:shadow-xl hover:shadow-[#C68E58]/10 dark:hover:shadow-black/30 flex items-start gap-5 hover:-translate-y-1">
              <div className={`p-3.5 rounded-2xl transition-all duration-300 ${link.bg} ${link.accent} ${link.hover}`}><link.icon className="w-6 h-6" /></div>
              <div className="flex-1 pt-1">
                <h3 className="font-bold text-[#2C1E16] dark:text-white mb-1.5 transition-colors group-hover:text-[#C68E58] dark:group-hover:text-[#C68E58]">{link.title}</h3>
                <p className="text-xs font-medium text-[#8C7A6B] dark:text-[#8C7A6B] leading-relaxed">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#2C1E16] dark:text-white flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> آخرین سفارشات
          </h2>
          <Link href="/admin/orders" className="text-sm font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-white flex items-center gap-1 transition-colors group">
            مشاهده همه <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="bg-white dark:bg-[#231511] rounded-[2rem] border border-[#F0EBE1] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#FCF9F5] dark:bg-[#1A0F0C] text-[#8C7A6B] font-bold border-b border-[#F0EBE1] dark:border-[#3c2317]">
                <tr>
                  <th className="p-5 whitespace-nowrap">شماره سفارش</th>
                  <th className="p-5 whitespace-nowrap">مشتری</th>
                  <th className="p-5 whitespace-nowrap">مبلغ (تومان)</th>
                  <th className="p-5 whitespace-nowrap">وضعیت</th>
                  <th className="p-5 whitespace-nowrap">زمان ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1] dark:divide-[#3c2317]">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-[#FCF9F5]/70 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                    <td className="p-5 font-bold text-[#2C1E16] dark:text-white dir-ltr text-right">{order.id}</td>
                    <td className="p-5 font-medium text-[#4A3022] dark:text-[#EAE0D5]">{order.customer}</td>
                    <td className="p-5 font-black text-[#2C1E16] dark:text-[#D4A373] dir-ltr text-right">{order.total}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${order.color}`}>
                        <order.icon className="w-3.5 h-3.5" /> {order.status}
                      </span>
                    </td>
                    <td className="p-5 font-medium text-[#8C7A6B]">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}