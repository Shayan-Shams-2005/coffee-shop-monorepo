// app/admin/constants.tsx
import { 
  Users, ShoppingBag, DollarSign, Package, 
  Layers, Tag, Image as ImageIcon,
  Clock, CheckCircle, RotateCcw,
  Bell, MessageSquare, TicketPercent
} from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export interface QuickLinkItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
  hover: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  total: string;
  status: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

export const STATS_DATA: DashboardStat[] = [
  { label: "درآمد کل", value: "۴۵,۵۰۰,۰۰۰ تومان", icon: DollarSign, color: "text-[#C68E58] dark:text-emerald-500", bg: "bg-[#C68E58]/10 dark:bg-emerald-500/20" },
  { label: "سفارشات جدید", value: "۱۲۴", icon: ShoppingBag, color: "text-[#A87242] dark:text-sky-500", bg: "bg-[#A87242]/10 dark:bg-sky-500/20" },
  { label: "کاربران فعال", value: "۱,۰۴۲", icon: Users, color: "text-[#D4A373] dark:text-[#D4A373]", bg: "bg-[#D4A373]/10 dark:bg-[#D4A373]/20" },
  { label: "محصولات ناموجود", value: "۳", icon: Package, color: "text-rose-500 dark:text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/20" },
];

export const QUICK_LINKS_DATA: QuickLinkItem[] = [
  { title: "محصولات و موجودی", desc: "افزودن، ویرایش و مدیریت کالاها", href: "/admin/products", icon: Package, accent: "text-[#C68E58] dark:text-amber-500", bg: "bg-[#FCF9F5] dark:bg-amber-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "دسته‌بندی‌ها", desc: "مدیریت ساختار دسته‌بندی فروشگاه", href: "/admin/categories", icon: Layers, accent: "text-[#C68E58] dark:text-purple-500", bg: "bg-[#FCF9F5] dark:bg-purple-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "برندهای فروشگاه", desc: "تعریف برندها برای فیلتر محصولات", href: "/admin/brands", icon: Tag, accent: "text-[#C68E58] dark:text-indigo-500", bg: "bg-[#FCF9F5] dark:bg-indigo-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "بنرهای تبلیغاتی", desc: "مدیریت اسلایدر و بنرهای صفحه اصلی", href: "/admin/banners", icon: ImageIcon, accent: "text-[#C68E58] dark:text-rose-500", bg: "bg-[#FCF9F5] dark:bg-rose-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-rose-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "سفارشات مشتریان", desc: "بررسی و تغییر وضعیت سفارشات", href: "/admin/orders", icon: ShoppingBag, accent: "text-[#C68E58] dark:text-emerald-500", bg: "bg-[#FCF9F5] dark:bg-emerald-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "لیست کاربران", desc: "مشاهده و مدیریت حساب‌های کاربری", href: "/admin/users", icon: Users, accent: "text-[#C68E58] dark:text-blue-500", bg: "bg-[#FCF9F5] dark:bg-blue-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "صندوق پیام‌ها و خطاها", desc: "بررسی سوالات و گزارشات باگ", href: "/admin/notifications", icon: Bell, accent: "text-[#C68E58] dark:text-orange-500", bg: "bg-[#FCF9F5] dark:bg-orange-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-orange-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "مدیریت نظرات", desc: "تایید یا حذف نظرات کاربران", href: "/admin/reviews", icon: MessageSquare, accent: "text-[#C68E58] dark:text-teal-500", bg: "bg-[#FCF9F5] dark:bg-teal-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-teal-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
  { title: "کدهای تخفیف", desc: "ساخت و مدیریت درصدهای تخفیف", href: "/admin/coupons", icon: TicketPercent, accent: "text-[#C68E58] dark:text-pink-500", bg: "bg-[#FCF9F5] dark:bg-pink-500/10", hover: "group-hover:bg-[#C68E58] group-hover:text-white dark:group-hover:bg-pink-500 dark:group-hover:text-[#1A110F] group-hover:shadow-lg group-hover:shadow-[#C68E58]/30" },
];

export const RECENT_ORDERS_DATA: RecentOrder[] = [
  { id: "NEO-8472", customer: "علی رضایی", total: "۸۵۰,۰۰۰", status: "در حال پردازش", time: "۱۰ دقیقه پیش", icon: Clock, color: "text-blue-600 bg-blue-50 dark:text-sky-400 dark:bg-sky-500/10 border-blue-200 dark:border-sky-500/20" },
  { id: "NEO-8471", customer: "سارا احمدی", total: "۱,۲۴۰,۰۰۰", status: "تحویل شده", time: "۲ ساعت پیش", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  { id: "NEO-8470", customer: "محمد کریمی", total: "۳۲۰,۰۰۰", status: "مرجوعی", time: "دیروز", icon: RotateCcw, color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
];