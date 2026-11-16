// app/admin/coupons/types.tsx

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export interface Coupon {
  offerCodeId: number;
  code: string;
  discountPercentage: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  usedCount: number;
  usageLimit: number | null;
  userUsageLimit: number | null;
  minimumOrderAmount: number | null;
  maximumDiscountAmount: number | null;
  createdAt: string;
}