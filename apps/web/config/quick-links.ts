import {
  Coffee,
  CupSoda,
  Flame,
  Droplets,
  Layers,
  Leaf,
  Zap,
  Award,
  Crown,
  BatteryCharging,
  Sprout,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";

export interface QuickLink {
  id: number;
  title: string;
  icon: LucideIcon;
  href: string;
}

export const quickLinksData: QuickLink[] = [
  { id: 1, title: "قهوه اسپرسو", icon: Coffee, href: "/category/espresso" },
  { id: 2, title: "قهوه فرانسه", icon: CupSoda, href: "/category/french" },
  { id: 3, title: "قهوه ترک", icon: Flame, href: "/category/turkish" },
  { id: 4, title: "قهوه دمی", icon: Droplets, href: "/category/filter" },
  { id: 5, title: "قهوه های ترکیبی", icon: Layers, href: "/category/blends" },
  { id: 6, title: "قهوه عربیکا", icon: Leaf, href: "/category/arabica" },
  { id: 7, title: "قهوه روبوستا", icon: Zap, href: "/category/robusta" },
  {
    id: 8,
    title: "قهوه های اسپشیالیتی",
    icon: Award,
    href: "/category/specialty",
  },
  { id: 9, title: "قهوه های پرمیوم", icon: Crown, href: "/category/premium" },
  {
    id: 10,
    title: "پرکافئین ها و تلخ ها",
    icon: BatteryCharging,
    href: "/category/high-caffeine",
  },
  {
    id: 11,
    title: "قهوه سبز (خام)",
    icon: Sprout,
    href: "/category/green-coffee",
  },
  { id: 12, title: "مشاهده همه", icon: LayoutGrid, href: "/categories" },
];
