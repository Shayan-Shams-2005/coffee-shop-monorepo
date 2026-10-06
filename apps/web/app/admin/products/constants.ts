// app/admin/products/constants.ts

export const MAX_ALLOWED_PRICE = 5000000;

export const ADMIN_SORT_OPTIONS = [
  { id: "newest", label: "جدیدترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "bestoffer", label: "بیشترین تخفیف" },
];

export const toFarsiNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined) return "۰";
  
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
}; 

export const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(date);
  const timePart = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  return `${datePart}، ${timePart}`;
};

export const sanitizeNameForFilter = (name: string | null) => {
  if (!name) return null;
  return (name.split('(')[0] ?? "").trim();
};

export const INITIAL_PRODUCT_DATA = {
  title: "",
  description: "",
  category: "",
  brand: "",
  basePrice: 0,
  salePrice: 0,
  stock: 0,
  mainImage: "", 
  gallery: [],   
  keyFeatures: [{ key: "", value: "" }],
  optionGroups: [],
  specs: [{ key: "", value: "" }],
};