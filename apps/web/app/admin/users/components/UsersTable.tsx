// app/admin/users/components/UsersTable.tsx
import { Edit, ShieldAlert, CheckCircle2, User as UserIcon } from "lucide-react";
import { User, toFarsiNumber, formatPrice, formatDate } from "../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-[#8C7A6B] dark:text-[#6A5A4F] flex flex-col items-center">
        <UserIcon className="w-16 h-16 opacity-20 mb-4 text-[#E3C3A4] dark:text-[#3c2317]" />
        <p className="font-bold">کاربری با این مشخصات یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
          <tr>
            <th className="p-5 whitespace-nowrap">کاربر</th>
            <th className="p-5 whitespace-nowrap">نقش</th>
            <th className="p-5 whitespace-nowrap">وضعیت</th>
            <th className="p-5 whitespace-nowrap text-center">تاریخ عضویت</th>
            <th className="p-5 whitespace-nowrap text-center">سفارشات</th>
            <th className="p-5 whitespace-nowrap text-center">مجموع خرید</th>
            <th className="p-5 whitespace-nowrap text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className="hover:bg-[#C68E58]/5 dark:hover:bg-[#2A1B16]/50 transition-colors group"
            >
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58] shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4A3022] dark:text-white">{user.fullName}</span>
                    <span className="text-xs font-bold text-[#8C7A6B] mt-1 dir-ltr text-right">{toFarsiNumber(user.phone)}</span>
                  </div>
                </div>
              </td>
              <td className="p-5">
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                    مدیر سایت
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-[#E3C3A4]/20 text-[#4A3022] border border-[#E3C3A4]/60 dark:bg-[#3c2317] dark:text-[#EAE0D5] dark:border-[#3c2317]">
                    مشتری
                  </span>
                )}
              </td>
              <td className="p-5">
                {user.status === 'active' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> فعال
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                    <ShieldAlert className="w-3.5 h-3.5" /> مسدود
                  </span>
                )}
              </td>
              <td className="p-5 text-center text-[#8C7A6B] dark:text-[#A1A1A1] text-sm font-bold">
                {toFarsiNumber(formatDate(user.joinDate))}
              </td>
              <td className="p-5 text-center font-black text-[#C68E58]">
                {toFarsiNumber(user.ordersCount)}
              </td>
              <td className="p-5 text-center font-black text-[#4A3022] dark:text-[#EAE0D5]">
                {user.totalSpent > 0 ? formatPrice(user.totalSpent) : '-'}
              </td>
              <td className="p-5 text-center">
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] text-[#C68E58] rounded-xl text-sm font-bold transition-colors"
                >
                  <Edit className="w-4 h-4" /> ویرایش
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}