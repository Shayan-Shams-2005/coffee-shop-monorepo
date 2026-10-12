// app/admin/users/types.ts

export interface UserDto {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  profileUrl: string | null;
  role: number; // 0 = Customer, 1 = Admin
  isDeleted: boolean;
  createdAt: string;
}

export type UserRoleFilter = "customer" | "admin" | "all";
export type UserStatusFilter = "active" | "banned" | "all";

export const toFarsiNumber = (num?: string | number): string => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Adding || "" guarantees to TypeScript that this will always return a string
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || "");
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return "-";
  }
};