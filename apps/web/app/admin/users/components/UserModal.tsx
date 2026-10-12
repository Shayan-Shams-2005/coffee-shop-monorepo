"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, X, Save, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { UserDto, toFarsiNumber } from "../types";
import { UserAdminApi } from "../api";

interface UserModalProps {
  isOpen: boolean;
  user: UserDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserModal({ isOpen, user, onClose, onSuccess }: UserModalProps) {
  const [isBanned, setIsBanned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setIsBanned(user.isDeleted);
      setError("");
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBanned === user.isDeleted) {
      onClose(); 
      return;
    }

    if (isBanned) {
      try {
        setIsSaving(true);
        await UserAdminApi.deleteUser(user.userId);
        onSuccess();
      } catch (err: any) {
        setError("خطا در مسدودسازی کاربر.");
      } finally {
        setIsSaving(false);
      }
    } else {
      setError("امکان فعال‌سازی مجدد در حال حاضر در سرور وجود ندارد.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C]">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#C68E58]" /> وضعیت کاربر
          </h2>
          <button onClick={onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {error && <div className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C7A6B]">نام و نام خانوادگی:</span>
                <span className="text-sm font-black text-[#4A3022] dark:text-white">
                  {user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}` : "کاربر جدید"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C7A6B]">شماره تماس:</span>
                <span className="text-sm font-black text-[#4A3022] dark:text-white dir-ltr">{toFarsiNumber(user.phoneNumber)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">نقش کاربری</label>
            <div className="w-full bg-gray-100 dark:bg-[#231511] border border-transparent rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 font-bold cursor-not-allowed">
              {user.role === 1 ? "مدیر سایت" : "مشتری"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">وضعیت حساب</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsBanned(false)}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all border ${
                  !isBanned 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 shadow-sm' 
                  : 'bg-white text-gray-400 border-[#E3C3A4]/60 dark:bg-[#231511] dark:border-[#3c2317]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> فعال
              </button>
              <button
                type="button"
                onClick={() => setIsBanned(true)}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all border ${
                  isBanned 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 shadow-sm' 
                  : 'bg-white text-gray-400 border-[#E3C3A4]/60 dark:bg-[#231511] dark:border-[#3c2317]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> مسدود (حذف)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#D4A373] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
              {isSaving ? "در حال ذخیره..." : "بروزرسانی کاربر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}