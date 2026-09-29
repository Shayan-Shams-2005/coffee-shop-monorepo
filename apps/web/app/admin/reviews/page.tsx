// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import { 
  MessageSquare, Search, Filter, Trash2, 
  CheckCircle2, Clock, Star, User, Package, 
  ChevronDown, CheckCircle, AlertCircle,
  Flag, Reply, Send, X, Edit
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
type ReviewStatus = 'pending' | 'approved';

interface Review {
  id: string;
  userName: string;
  productName: string;
  date: string;
  rating: number; // 1 to 5
  text: string;
  status: ReviewStatus;
  isReported?: boolean;
  adminReply?: string;
}

// --- Mock Data ---
const initialReviews: Review[] = [
  {
    id: "rev-101",
    userName: "امیر تهرانی",
    productName: "دانه قهوه اسپرسو ۱۰۰٪ عربیکا (۲۵۰ گرم)",
    date: "2023-10-26T14:30:00",
    rating: 5,
    text: "عطر و طعم بی‌نظیری داشت. رست قهوه کاملاً تازه بود و کرمای خیلی خوبی به من داد. قطعا دوباره خرید می‌کنم.",
    status: "pending"
  },
  {
    id: "rev-102",
    userName: "مریم حسینی",
    productName: "دستگاه اسپرسوساز خانگی نوا 149",
    date: "2023-10-25T09:15:00",
    rating: 2,
    text: "بسته‌بندی کالا پاره شده بود و ارسال خیلی طول کشید. خود دستگاه بد نیست ولی از نحوه ارسال اصلاً راضی نبودم.",
    status: "pending"
  },
  {
    id: "rev-103",
    userName: "علی رضایی",
    productName: "سیروپ کارامل مونین",
    date: "2023-10-22T16:45:00",
    rating: 4,
    text: "غلظت و طعمش عالیه، برای ترکیب با لاته حرف نداره. فقط قیمتش کمی بالاست.",
    status: "approved"
  },
  {
    id: "rev-104",
    userName: "کاربر ناشناس",
    productName: "ماگ سرامیکی استارباکس",
    date: "2023-10-20T11:20:00",
    rating: 1,
    text: "این یک پیام اسپم یا توهین آمیز است که توسط بقیه کاربران گزارش شده است.",
    status: "approved",
    isReported: true 
  },
  {
    id: "rev-105",
    userName: "سارا محمدی",
    productName: "قهوه جوش مسی (جذوه)",
    date: "2023-10-18T14:10:00",
    rating: 5,
    text: "کیفیت مس و دسته‌اش عالیه، قهوه ترک رو خیلی خوب و با فوم عالی درمیاره.",
    status: "approved",
    adminReply: "سلام سارا عزیز، خیلی خوشحالیم که از کیفیت این محصول رضایت داشتید. نوش جان!"
  }
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all" | "reported">("pending");

  // Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.text.toLowerCase().includes(q) || 
        r.userName.toLowerCase().includes(q) || 
        r.productName.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Status or Reports
    if (filterStatus === "reported") {
      result = result.filter(r => r.isReported);
    } else if (filterStatus !== "all") {
      result = result.filter(r => r.status === filterStatus);
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [reviews, searchQuery, filterStatus]);

  // Actions
  const handleApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleDelete = (id: string) => {
    if(confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleClearReport = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isReported: false } : r));
  };

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: replyText } : r));
    setReplyingToId(null);
    setReplyText("");
  };

  const handleDeleteReply = (id: string) => {
    if(confirm("آیا از حذف این پاسخ اطمینان دارید؟")) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: undefined } : r));
    }
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 dir-ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-[#3c2317] dark:text-[#3c2317]'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#C68E58]" />
          مدیریت نظرات
        </h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          بررسی، تایید، پاسخگویی و یا حذف نظرات ثبت شده توسط کاربران
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
            placeholder="جستجو در متن نظر، نام کاربر یا محصول..."
            className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-4 py-2.5 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-sm font-bold"
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
            className="w-full appearance-none bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl pr-10 pl-10 py-2.5 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 text-sm font-bold cursor-pointer"
          >
            <option value="all">همه نظرات</option>
            <option value="pending">در انتظار تایید</option>
            <option value="approved">تایید شده</option>
            <option value="reported">گزارش شده</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] flex flex-col items-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-[#3c2317] mb-4" />
            <p className="font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">نظری برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`relative bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
                review.status === 'approved' && !review.isReported
                  ? 'border-[#F5EFE6] dark:border-[#3c2317] opacity-80 hover:opacity-100' 
                  : review.isReported
                  ? 'border-rose-400 dark:border-rose-500/50 shadow-[0_4px_20px_rgba(225,29,72,0.1)] dark:shadow-none'
                  : 'border-amber-400 dark:border-amber-500/50 shadow-[0_4px_20px_rgba(251,191,36,0.1)] dark:shadow-none'
              }`}
            >
              {/* Indicator Bars */}
              {review.status === 'pending' && !review.isReported && (
                <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-amber-400 dark:bg-amber-500" />
              )}
              {review.isReported && (
                <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-rose-500 dark:bg-rose-600" />
              )}

              <div className="p-5 sm:p-6">
                
                {/* Header: User & Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317] flex items-center justify-center text-[#C68E58] shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#2C1E16] dark:text-white flex items-center gap-2">
                        {review.userName}
                      </h3>
                      <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {toFarsiNumber(formatDate(review.date))}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {review.isReported && (
                      <span className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5">
                        <Flag className="w-4 h-4" /> گزارش شده
                      </span>
                    )}

                    {review.status === 'pending' ? (
                      <span className="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/20 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> در انتظار بررسی
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> انتشار یافته
                      </span>
                    )}
                  </div>
                </div>

                {/* Body: Product Info & Comment Text */}
                <div className="bg-[#FCF9F5] dark:bg-[#231511] rounded-xl p-4 mb-5 border border-[#F5EFE6] dark:border-[#3c2317]">
                  {/* Product Reference */}
                  <div className="flex items-center justify-between mb-3 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-3">
                    <div className="flex items-center gap-2 text-[#C68E58]">
                      <Package className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold truncate">{review.productName}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                    "{review.text}"
                  </p>

                  {/* Admin Reply Display (Hidden if currently editing) */}
                  {review.adminReply && replyingToId !== review.id && (
                    <div className="mt-4 bg-[#F5EFE6] dark:bg-[#3A221C]/40 rounded-xl p-4 border border-[#E3C3A4] dark:border-[#4A3022]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-[#C68E58]">
                          <Reply className="w-4 h-4" />
                          <span className="text-xs font-black">پاسخ فروشگاه:</span>
                        </div>
                        
                        {/* Edit & Delete Reply Buttons */}
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => { setReplyingToId(review.id); setReplyText(review.adminReply || ""); }}
                            className="flex items-center gap-1 text-xs font-bold text-[#8C7A6B] hover:text-[#C68E58] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> ویرایش پاسخ
                          </button>
                          <button 
                            onClick={() => handleDeleteReply(review.id)}
                            className="flex items-center gap-1 text-xs font-bold text-[#8C7A6B] hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> حذف پاسخ
                          </button>
                        </div>
                      </div>
                      <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                        {review.adminReply}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reply Input Form (Conditionally Rendered) */}
                {replyingToId === review.id && (
                  <div className="mb-5 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl p-4 animate-in slide-in-from-top-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="متن پاسخ خود را اینجا بنویسید..."
                      className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl p-3 text-sm text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] dark:focus:border-[#C68E58] min-h-[100px] resize-none mb-3"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setReplyingToId(null); setReplyText(""); }}
                        className="px-4 py-2 text-sm font-bold text-[#8C7A6B] hover:text-[#2C1E16] dark:hover:text-white transition-colors"
                      >
                        لغو
                      </button>
                      <button 
                        onClick={() => submitReply(review.id)}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-[#C68E58] hover:bg-[#A87242] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        <Send className="w-4 h-4" /> {review.adminReply ? "ثبت تغییرات" : "ثبت پاسخ"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5EFE6] dark:border-[#3c2317]">
                  
                  {/* Right side: Delete & Clear Report */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/30 dark:hover:text-rose-400 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> حذف نظر
                    </button>

                    {review.isReported && (
                      <button 
                        onClick={() => handleClearReport(review.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-[#231511] dark:hover:text-white rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
                      >
                        <X className="w-4 h-4" /> رد گزارش
                      </button>
                    )}
                  </div>

                  {/* Left side: Reply & Approve */}
                  <div className="flex items-center gap-2">
                    {!review.adminReply && replyingToId !== review.id && (
                      <button 
                        onClick={() => { setReplyingToId(review.id); setReplyText(""); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#FCF9F5] dark:bg-[#231511] hover:bg-[#F5EFE6] dark:hover:bg-[#3c2317] text-[#C68E58] border border-[#E3C3A4] dark:border-[#4A3022] rounded-xl text-sm font-bold transition-colors"
                      >
                        <Reply className="w-4 h-4" /> پاسخ دادن
                      </button>
                    )}

                    {review.status === 'pending' && (
                      <button 
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-1.5 px-6 py-2 bg-[#C68E58] hover:bg-[#A87242] text-white rounded-xl text-sm font-bold transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
                      >
                        <CheckCircle2 className="w-5 h-5" /> تایید و انتشار
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}