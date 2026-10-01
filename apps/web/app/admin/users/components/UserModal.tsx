// app/admin/users/components/UserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, X, Save, ShieldAlert, CheckCircle2 } from "lucide-react";
import { User, UserRole, UserStatus, toFarsiNumber } from "../types";

interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<User>) => void;
}

export function UserModal({ isOpen, user, onClose, onSave }: UserModalProps) {
  const [role, setRole] = useState<UserRole>('customer');
  const [status, setStatus] = useState<UserStatus>('active');

  useEffect(() => {
    if (isOpen && user) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, { role, status });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#C68E58]" /> ویرایش کاربر
          </h2>
          <button onClick={onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Read Only User Details */}
          <div className="bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C7A6B]">نام و نام خانوادگی:</span>
                <span className="text-sm font-black text-[#4A3022] dark:text-white">{user.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C7A6B]">شماره تماس:</span>
                <span className="text-sm font-black text-[#4A3022] dark:text-white dir-ltr">{toFarsiNumber(user.phone)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C7A6B]">ایمیل:</span>
                <span className="text-sm font-bold text-[#C68E58] truncate max-w-[200px]">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">نقش کاربری</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all font-bold cursor-pointer"
            >
              <option value="customer">مشتری</option>
              <option value="admin">مدیر سایت</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">وضعیت حساب</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all border ${
                  status === 'active' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 shadow-sm' 
                  : 'bg-white text-gray-400 border-[#E3C3A4]/60 dark:bg-[#231511] dark:border-[#3c2317]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> فعال
              </button>
              <button
                type="button"
                onClick={() => setStatus('banned')}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all border ${
                  status === 'banned' 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 shadow-sm' 
                  : 'bg-white text-gray-400 border-[#E3C3A4]/60 dark:bg-[#231511] dark:border-[#3c2317]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> مسدود
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
            >
              <Save className="w-5 h-5" /> بروزرسانی کاربر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}