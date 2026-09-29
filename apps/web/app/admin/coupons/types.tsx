// app/admin/coupons/types.tsx

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  createdAt: string;
  expiresInDays: number;
  isActive: boolean;
}

export const initialCoupons: Coupon[] = [
  { id: "c-1", code: "NEOWELCOME20", discount: 20, createdAt: "2023-10-20", expiresInDays: 30, isActive: true },
  { id: "c-2", code: "COFFEE10", discount: 10, createdAt: "2023-10-25", expiresInDays: 7, isActive: true },
  { id: "c-3", code: "WINTER50", discount: 50, createdAt: "2023-01-10", expiresInDays: 0, isActive: false },
];