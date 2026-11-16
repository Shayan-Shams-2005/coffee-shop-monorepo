// app/admin/users/types.ts

export interface UserDto {
  userId: number;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  role: number; // 0 = Customer, 1 = Admin
  profileUrl?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type UserRoleFilter = "all" | "admin" | "customer";
export type UserStatusFilter = "all" | "active" | "banned";

export const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};