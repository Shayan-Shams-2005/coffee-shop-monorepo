// app/admin/tags/types.ts

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type ProductTag = {
  id: number;
  name: string;
  slug: string;
};