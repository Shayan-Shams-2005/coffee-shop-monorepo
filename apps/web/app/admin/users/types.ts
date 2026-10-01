// app/admin/users/types.ts

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatPrice = (price: number) => {
  return toFarsiNumber(price.toLocaleString()) + " تومان";
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
};

export type UserRole = 'admin' | 'customer';
export type UserStatus = 'active' | 'banned';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
}

export const initialUsers: User[] = [
  {
    id: "USR-1001",
    fullName: "علی رضایی",
    phone: "09123456789",
    email: "ali.rezaei@example.com",
    role: "customer",
    status: "active",
    joinDate: "2023-05-12T10:30:00",
    ordersCount: 12,
    totalSpent: 4500000
  },
  {
    id: "USR-1002",
    fullName: "سارا احمدی",
    phone: "09351112233",
    email: "sara.ahmadi@example.com",
    role: "admin",
    status: "active",
    joinDate: "2022-11-05T09:15:00",
    ordersCount: 3,
    totalSpent: 1200000
  },
  {
    id: "USR-1003",
    fullName: "محمد کریمی",
    phone: "09198887766",
    email: "m.karimi@example.com",
    role: "customer",
    status: "banned",
    joinDate: "2023-08-20T16:45:00",
    ordersCount: 0,
    totalSpent: 0
  },
  {
    id: "USR-1004",
    fullName: "فاطمه حسینی",
    phone: "09102224455",
    email: "f.hosseini@example.com",
    role: "customer",
    status: "active",
    joinDate: "2023-09-01T11:20:00",
    ordersCount: 5,
    totalSpent: 2100000
  },
  {
    id: "USR-1005",
    fullName: "امیرحسین نوری",
    phone: "09025556677",
    email: "amir.nouri@example.com",
    role: "customer",
    status: "active",
    joinDate: "2023-10-15T14:10:00",
    ordersCount: 1,
    totalSpent: 350000
  }
];