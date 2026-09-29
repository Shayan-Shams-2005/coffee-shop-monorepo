// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import { 
  Bell, Search, Filter, Bug, MessageCircleQuestion, 
  Trash2, CheckCircle2, AlertCircle, Calendar, Mail, 
  User, Phone, Send, X, CornerDownLeft, CheckCircle, Edit
} from "lucide-react";

// --- Helpers ---
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

// --- Types ---
type NotificationType = 'bug' | 'question';

interface Notification {
  id: string;
  type: NotificationType;
  userName: string;
  email: string;
  phone: string;
  date: string;
  subject: string;
  message: string;
  isRead: boolean;
  adminReply?: string; // 🚀 Added to store the admin's answer
  repliedAt?: string;  // 🚀 Added to store the time of the answer
}

// --- Mock Data ---
const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "bug",
    userName: "امیر تهرانی",
    email: "amir@example.com",
    phone: "09128887766",
    date: "2023-10-26T14:30:00",
    subject: "مشکل در پرداخت زرین‌پال",
    message: "وقتی به درگاه پرداخت هدایت می‌شوم، با خطای 404 مواجه می‌شوم و نمی‌توانم سفارشم را تکمیل کنم. لطفا بررسی کنید.",
    isRead: false
  },
  {
    id: "notif-2",
    type: "question",
    userName: "مریم حسینی",
    email: "maryam.h@test.com",
    phone: "09351112233",
    date: "2023-10-25T09:15:00",
    subject: "موجودی قهوه ایلّی",
    message: "سلام، می‌خواستم بپرسم دانه قهوه ایلی مدل دارک رست کی دوباره موجود میشه؟",
    isRead: false
  },
  {
    id: "notif-3",
    type: "bug",
    userName: "علی رضایی",
    email: "rezaei.ali@test.com",
    phone: "09192224455",
    date: "2023-10-22T16:45:00",
    subject: "نمایش اشتباه قیمت‌ها",
    message: "در صفحه موبایل، قیمت محصولات زیر دکمه افزودن به سبد خرید قایم شده و دیده نمیشه.",
    isRead: true,
    adminReply: "سلام علی عزیز. ممنون از گزارش دقیق شما. این مشکل در آپدیت دیشب برطرف شد. لطفا صفحه را رفرش کنید.",
    repliedAt: "2023-10-23T10:15:00"
  }
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all");

  // Reply Modal State
  const [activeReply, setActiveReply] = useState<Notification | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.subject.toLowerCase().includes(q) || 
        n.message.toLowerCase().includes(q) || 
        n.userName.toLowerCase().includes(q) ||
        n.phone.includes(q)
      );
    }

    if (filterType !== "all") {
      result = result.filter(n => n.type === filterType);
    }

    if (filterStatus !== "all") {
      const isReadTarget = filterStatus === "read";
      result = result.filter(n => n.isRead === isReadTarget);
    }

    return result;
  }, [notifications, searchQuery, filterType, filterStatus]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    if(confirm("آیا از حذف این پیام اطمینان دارید؟")) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleOpenReplyModal = (notif: Notification) => {
    setActiveReply(notif);
    // If it's already answered, pre-fill the text area so the admin can edit it
    setReplyMessage(notif.adminReply || "");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeReply) {
      const now = new Date().toISOString();
      
      setNotifications(prev => prev.map(n => 
        n.id === activeReply.id 
          ? { ...n, isRead: true, adminReply: replyMessage, repliedAt: now } 
          : n
      ));
      
      setActiveReply(null);
      setReplyMessage("");
      alert(`پاسخ شما با موفقیت برای ${activeReply.userName} ثبت و ارسال شد.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-[#C68E58]" />
          صندوق پیام‌ها و خطاها
        </h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          بررسی گزارشات باگ، سوالات کاربران سایت و پاسخگویی به آن‌ها
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] p-4 sm:p-5 mb-8 flex flex-col sm:flex-row gap-4 shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#8C7A6B]" />
          </div>
          <input
            type="text"
            style={{ textAlign: 'right', direction: 'rtl' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در متن، موضوع یا شماره تماس..."
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-4 py-2.5 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-32 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-3 py-2.5 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 text-sm font-bold cursor-pointer"
          >
            <option value="all">همه انواع</option>
            <option value="bug">گزارش باگ</option>
            <option value="question">سوالات</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-32 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-3 py-2.5 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 text-sm font-bold cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="unread">خوانده نشده</option>
            <option value="read">خوانده شده</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] flex flex-col items-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-[#3c2317] mb-4" />
            <p className="font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">پیامی برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`relative bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
                notif.isRead 
                  ? 'border-[#F5EFE6] dark:border-[#3c2317] opacity-80 hover:opacity-100' 
                  : 'border-[#C68E58] dark:border-[#C68E58] shadow-[0_4px_20px_rgba(198,142,88,0.15)] dark:shadow-none'
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#C68E58]" />
              )}

              <div className="p-5 sm:p-6">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'bug' 
                        ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' 
                        : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
                    }`}>
                      {notif.type === 'bug' ? <Bug className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#2C1E16] dark:text-white flex items-center gap-2">
                        {notif.subject}
                        {!notif.isRead && (
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">جدید</span>
                        )}
                        {/* 🚀 Add Answered Badge */}
                        {notif.adminReply && (
                          <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> پاسخ داده شده
                          </span>
                        )}
                      </h3>
                      <div className="text-xs font-bold text-[#8C7A6B] mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {notif.userName}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${notif.phone}`} className="hover:text-[#C68E58] dir-ltr inline-block text-right">{toFarsiNumber(notif.phone)}</a></span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${notif.email}`} className="hover:text-[#C68E58]">{notif.email}</a></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-bold text-[#8C7A6B] bg-[#FCF9F5] dark:bg-[#231511] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 w-fit">
                    <Calendar className="w-3.5 h-3.5" /> {toFarsiNumber(formatDate(notif.date))}
                  </div>
                </div>

                {/* User Message Body */}
                <div className={`bg-[#FCF9F5] dark:bg-[#231511] rounded-xl p-4 border border-[#F5EFE6] dark:border-[#3c2317] ${notif.adminReply ? 'mb-3' : 'mb-5'}`}>
                  <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                    {notif.message}
                  </p>
                </div>

                {/* 🚀 Admin Reply Box (Visible if answered) */}
                {notif.adminReply && (
                  <div className="bg-[#C68E58]/10 dark:bg-[#C68E58]/5 rounded-xl p-4 mb-5 border border-[#C68E58]/30 dark:border-[#C68E58]/20 mr-4 sm:mr-8 relative">
                    <div className="flex items-center justify-between mb-2 border-b border-[#C68E58]/20 pb-2">
                       <span className="text-xs font-black text-[#C68E58] flex items-center gap-1.5">
                         <CornerDownLeft className="w-4 h-4" /> پاسخ شما
                       </span>
                       <span className="text-[10px] font-bold text-[#8C7A6B] bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                         {notif.repliedAt && toFarsiNumber(formatDate(notif.repliedAt))}
                       </span>
                    </div>
                    <p className="text-[#2C1E16] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                      {notif.adminReply}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F5EFE6] dark:border-[#3c2317]">
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>

                  <div className="flex items-center gap-3">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-xl text-sm font-bold transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> خوانده شد
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenReplyModal(notif)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors ${
                        notif.adminReply 
                          ? 'bg-[#8C7A6B] hover:bg-[#6A5A4F]' 
                          : 'bg-[#C68E58] hover:bg-[#A87242]'
                      }`}
                    >
                      {notif.adminReply ? (
                        <><Edit className="w-4 h-4" /> ویرایش پاسخ</>
                      ) : (
                        <><CornerDownLeft className="w-4 h-4" /> پاسخ دادن</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {activeReply && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setActiveReply(null)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
                <CornerDownLeft className="w-5 h-5 text-[#C68E58]" />
                پاسخ به {activeReply.userName}
              </h2>
              <button onClick={() => setActiveReply(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 bg-gray-100 dark:bg-[#2A1B16] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-6 space-y-6">
              <div className="bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl p-4">
                <p className="text-xs text-[#8C7A6B] mb-2 font-bold">پاسخ شما برای راه‌های ارتباطی زیر ارسال خواهد شد:</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                    <Phone className="w-4 h-4 text-[#C68E58]" /> <span className="dir-ltr inline-block">{toFarsiNumber(activeReply.phone)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                    <Mail className="w-4 h-4 text-[#C68E58]" /> {activeReply.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">متن پاسخ</label>
                <textarea
                  required
                  rows={5}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={{ textAlign: 'right', direction: 'rtl' }}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all resize-none"
                  placeholder="متن پاسخ خود را اینجا بنویسید..."
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
              >
                <Send className="w-5 h-5" /> {activeReply.adminReply ? "ثبت ویرایش پاسخ" : "ارسال پاسخ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}