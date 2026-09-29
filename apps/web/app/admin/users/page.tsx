// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import { 
  Search, Filter, Eye, UserX, UserCheck, 
  MapPin, Phone, Mail, Calendar, MessageSquare, 
  ShieldAlert, ShieldCheck, X, ChevronDown, User, Package
} from "lucide-react";

// --- Helpers ---
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
};

// --- Types ---
type UserStatus = 'active' | 'banned';

interface UserComment {
  id: string;
  productName: string;
  date: string;
  text: string;
}

interface StoreUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  status: UserStatus;
  ordersCount: number; // 🚀 New field added
  comments: UserComment[];
}

// --- Mock Data ---
const initialUsers: StoreUser[] = [
  {
    id: "USR-001",
    name: "علی رضایی",
    phone: "09123456789",
    email: "ali.rezaei@example.com",
    joinDate: "2023-05-12T10:00:00",
    status: "active",
    ordersCount: 14, // 🚀 Added mock data
    comments: [
      { id: "c1", productName: "دانه قهوه اسپرسو ۱۰۰٪ عربیکا", date: "2023-10-20T14:30:00", text: "طعم بسیار عالی و رست تازه‌ای داشت. پیشنهاد می‌کنم." },
      { id: "c2", productName: "سیروپ کارامل مونین", date: "2023-09-15T09:15:00", text: "برای ترکیب با لاته بی‌نظیر است." }
    ]
  },
  {
    id: "USR-002",
    name: "سارا احمدی",
    phone: "09351112233",
    email: "sara.ahmadi@example.com",
    joinDate: "2023-08-05T16:20:00",
    status: "banned",
    ordersCount: 2, // 🚀 Added mock data
    comments: [
      { id: "c3", productName: "دستگاه اسپرسوساز خانگی نوا 149", date: "2023-08-10T11:00:00", text: "دستگاه خراب بود و اصلا کار نمی‌کرد. خدمات پس از فروش هم ضعیف!" }
    ]
  },
  {
    id: "USR-003",
    name: "محمد کریمی",
    phone: "09198887766",
    email: "m.karimi@example.com",
    joinDate: "2023-10-01T08:45:00",
    status: "active",
    ordersCount: 0, // 🚀 Added mock data
    comments: []
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StoreUser[]>(initialUsers);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<StoreUser | null>(null);

  // Derived State (Filtering)
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.phone.includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Status
    if (filterStatus !== "all") {
      result = result.filter(u => u.status === filterStatus);
    }

    return result;
  }, [users, searchQuery, filterStatus]);

  const handleToggleBan = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "active" ? "banned" : "active";
        
        // Update selected user in modal if it's currently open
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...u, status: newStatus });
        }
        
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت کاربران</h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">مشاهده اطلاعات مشتریان، بررسی نظرات و مدیریت دسترسی‌ها</p>
      </div>

      {/* Control Bar (Search, Filter) */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#8C7A6B]" />
          </div>
          <input
            type="text"
            style={{ textAlign: 'right', direction: 'rtl' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام، شماره یا ایمیل..."
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-12 pl-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold"
          />
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-48 shrink-0">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-[#8C7A6B]" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full appearance-none bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold cursor-pointer"
          >
            <option value="all">همه کاربران</option>
            <option value="active">فعال</option>
            <option value="banned">مسدود شده</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-[#8C7A6B] dark:text-[#6A5A4F] flex flex-col items-center">
            <User className="w-16 h-16 opacity-20 mb-4" />
            <p className="font-bold">کاربری با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#FCF9F5] dark:bg-[#231511] border-b border-[#F5EFE6] dark:border-[#3c2317]">
                  <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">مشخصات کاربر</th>
                  <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">شماره تماس</th>
                  <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">تاریخ عضویت</th>
                  <th className="py-4 px-4 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">سفارشات</th>
                  <th className="py-4 px-4 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">نظرات</th>
                  <th className="py-4 px-4 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5]">وضعیت</th>
                  <th className="py-4 px-6 font-black text-sm text-[#4A3022] dark:text-[#EAE0D5] text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-[#F5EFE6] dark:border-[#3c2317] last:border-0 hover:bg-[#FCF9F5]/50 dark:hover:bg-[#231511]/50 transition-colors ${user.status === 'banned' ? 'opacity-75' : ''}`}
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F5EFE6] dark:bg-[#2A1B16] flex items-center justify-center text-[#C68E58] shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#2C1E16] dark:text-white">{user.name}</span>
                        <span className="text-xs text-[#8C7A6B] mt-0.5">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#2C1E16] dark:text-white dir-ltr inline-block">{toFarsiNumber(user.phone)}</span>
                    </td>
                    <td className="py-4 px-6 text-[#8C7A6B] dark:text-[#A1A1A1] text-sm">
                      {toFarsiNumber(formatDate(user.joinDate))}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                        <Package className="w-4 h-4 text-[#8C7A6B]" />
                        {toFarsiNumber(user.ordersCount)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                        <MessageSquare className="w-4 h-4 text-[#8C7A6B]" />
                        {toFarsiNumber(user.comments.length)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.status === 'active' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4" /> فعال
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                          <ShieldAlert className="w-4 h-4" /> مسدود شده
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] hover:text-[#C68E58] rounded-lg text-xs font-bold text-[#8C7A6B] transition-colors"
                      >
                        <Eye className="w-4 h-4" /> مشاهده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] shrink-0">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#C68E58]" />
                پروفایل کاربر
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 bg-gray-100 dark:bg-[#2A1B16] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Profile Card & Ban Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FCF9F5] dark:bg-[#231511] p-5 rounded-2xl border border-[#F5EFE6] dark:border-[#3c2317]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] flex items-center justify-center text-[#C68E58] shrink-0 shadow-sm">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2C1E16] dark:text-white">{selectedUser.name}</h3>
                    <p className="text-sm font-bold text-[#8C7A6B] dir-ltr text-right mt-1">{toFarsiNumber(selectedUser.phone)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const action = selectedUser.status === 'active' ? 'مسدود کردن' : 'رفع مسدودی';
                    if(confirm(`آیا از ${action} این کاربر اطمینان دارید؟`)) {
                      handleToggleBan(selectedUser.id);
                    }
                  }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedUser.status === 'active' 
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20'
                  }`}
                >
                  {selectedUser.status === 'active' ? (
                    <><UserX className="w-4 h-4" /> مسدود کردن کاربر</>
                  ) : (
                    <><UserCheck className="w-4 h-4" /> رفع مسدودی کاربر</>
                  )}
                </button>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                  <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-[#8C7A6B] mb-0.5">آدرس ایمیل</p>
                    <p className="font-bold text-[#2C1E16] dark:text-white text-sm truncate dir-ltr text-left">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                  <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C7A6B] mb-0.5">تاریخ عضویت</p>
                    <p className="font-bold text-[#2C1E16] dark:text-white text-sm">{toFarsiNumber(formatDate(selectedUser.joinDate))}</p>
                  </div>
                </div>
                {/* 🚀 New Order Count Box inside the Modal */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                  <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C7A6B] mb-0.5">تعداد سفارشات</p>
                    <p className="font-bold text-[#2C1E16] dark:text-white text-sm">{toFarsiNumber(selectedUser.ordersCount)} سفارش ثبت شده</p>
                  </div>
                </div>
              </div>

              {/* User Comments Section */}
              <div>
                <h3 className="text-sm font-black text-[#4A3022] dark:text-[#EAE0D5] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> نظرات ثبت شده ({toFarsiNumber(selectedUser.comments.length)})
                </h3>
                
                {selectedUser.comments.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-[#E3C3A4] dark:border-[#3c2317] rounded-xl text-[#8C7A6B]">
                    این کاربر هنوز نظری ثبت نکرده است.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.comments.map(comment => (
                      <div key={comment.id} className="bg-white dark:bg-[#1A0F0C] border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl p-4 transition-all hover:border-[#C68E58]/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm text-[#C68E58] truncate">{comment.productName}</span>
                          <span className="text-[11px] font-bold text-[#8C7A6B] bg-[#FCF9F5] dark:bg-[#231511] px-2 py-1 rounded-md">
                            {toFarsiNumber(formatDate(comment.date))}
                          </span>
                        </div>
                        <p className="text-sm text-[#2C1E16] dark:text-[#EAE0D5] leading-relaxed">
                          "{comment.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}