// app/admin/reviews/types.tsx

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fa-IR', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  } catch {
    return "-";
  }
};

export type ReviewStatus = 'pending' | 'approved';

export interface Review {
  id: string; // شناسه ظاهری
  numericId: number; // شناسه واقعی در دیتابیس
  productId: number; // شناسه محصول برای آدرس‌دهی API
  userName: string;
  productName: string;
  date: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  isReported: boolean;
  adminReply?: string;
}