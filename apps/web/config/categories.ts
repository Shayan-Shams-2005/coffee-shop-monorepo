import {
  Coffee,
  Globe,
  Package,
  Zap,
  Leaf,
  Flame,
  Wrench,
  CupSoda,
  LucideIcon,
} from "lucide-react";

// تعریف تایپ دقیق برای دیتا
export interface ProductCategory {
  id: number | string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  href: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: 1,
    title: "دانه‌های قهوه",
    desc: "انواع قهوه اسپرسو، دمی، ترک و فرانسه",
    icon: Coffee,
    color: "bg-orange-900/5",
    hoverColor: "group-hover:bg-orange-900/10",
    href: "/category/1",
  },
  {
    id: 2,
    title: "قهوه تک خاستگاه",
    desc: "قهوه‌های تخصصی از مزارع برتر جهان",
    icon: Globe,
    color: "bg-amber-900/5",
    hoverColor: "group-hover:bg-amber-900/10",
    href: "/category/2",
  },
  {
    id: 3,
    title: "کپسول قهوه",
    desc: "آماده‌سازی سریع، تمیز و باکیفیت",
    icon: Package,
    color: "bg-stone-900/5",
    hoverColor: "group-hover:bg-stone-900/10",
    href: "/category/3",
  },
  {
    id: 4,
    title: "قهوه فوری",
    desc: "اسپرسو، گلد و کلاسیک برای زمان‌های کوتاه",
    icon: Zap,
    color: "bg-yellow-900/5",
    hoverColor: "group-hover:bg-yellow-900/10",
    href: "/category/4",
  },
  {
    id: 5,
    title: "چای و پودری‌جات",
    desc: "هات چاکلت، ماسالا و انواع دمنوش",
    icon: Leaf,
    color: "bg-green-900/5",
    hoverColor: "group-hover:bg-green-900/10",
    href: "/category/5",
  },
  {
    id: 6,
    title: "قهوه‌سازها",
    desc: "اسپرسوساز، موکاپات و ابزارهای موج سوم",
    icon: Flame,
    color: "bg-red-900/5",
    hoverColor: "group-hover:bg-red-900/10",
    href: "/category/6",
  },
  {
    id: 7,
    title: "اکسسوری باریستا",
    desc: "تمپر، پیچر، ترازو و لوازم دم‌آوری",
    icon: Wrench,
    color: "bg-gray-900/5",
    hoverColor: "group-hover:bg-gray-900/10",
    href: "/category/7",
  },
  {
    id: 8,
    title: "ظروف پذیرایی",
    desc: "انواع ماگ، فنجان اسپرسو و لیوان باریستا",
    icon: CupSoda,
    color: "bg-teal-900/5",
    hoverColor: "group-hover:bg-teal-900/10",
    href: "/category/8",
  },
];
