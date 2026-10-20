// app/admin/categories/types.tsx

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type Category = {
  id: number;
  name: string;
  parentId: number | null; 
  image: string | null;
  productCount: number;
};