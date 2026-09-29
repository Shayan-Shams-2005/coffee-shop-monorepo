// app/admin/reviews/types.ts

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

export type ReviewStatus = 'pending' | 'approved';

export interface Review {
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

export const initialReviews: Review[] = [
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