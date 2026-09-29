// app/admin/notifications/types.ts

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

export type NotificationType = 'bug' | 'question';

export interface Notification {
  id: string;
  type: NotificationType;
  userName: string;
  email: string;
  phone: string;
  date: string;
  subject: string;
  message: string;
  isRead: boolean;
  adminReply?: string;
  repliedAt?: string;
}

export const initialNotifications: Notification[] = [
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