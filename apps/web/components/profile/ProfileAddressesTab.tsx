"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "../../src/store/useAuthStore";

export function ProfileAddressesTab() {
  const user = useAuthStore((state) => state.user);
  const addAddress = useAuthStore((state) => state.addAddress);
  const removeAddress = useAuthStore((state) => state.removeAddress);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: "", fullAddress: "" });

  if (!user) return null;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.title && newAddress.fullAddress) {
      addAddress({
        id: Date.now().toString(),
        title: newAddress.title,
        fullAddress: newAddress.fullAddress,
      });
      setNewAddress({ title: "", fullAddress: "" });
      setIsAddingAddress(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <div className="flex items-center justify-between mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 transition-colors">
        <h2 className="text-xl font-black text-[#2C1E16] dark:text-white flex items-center gap-2 transition-colors">
          <MapPin className="w-6 h-6 text-[#D4A373] dark:text-[#C68E58] transition-colors" />
          آدرس‌های من
        </h2>
        <button
          onClick={() => setIsAddingAddress(!isAddingAddress)}
          className="text-sm font-bold text-[#D4A373] dark:text-[#C68E58] flex items-center gap-1 hover:text-[#4A3022] dark:hover:text-[#FFD7BA] transition-colors"
        >
          <Plus className="w-4 h-4" /> افزودن آدرس جدید
        </button>
      </div>

      {isAddingAddress && (
        <form
          onSubmit={handleAddAddress}
          className="bg-gray-50 dark:bg-[#1A1412] p-4 rounded-2xl mb-6 space-y-4 border border-gray-200 dark:border-[#3c2317] transition-colors"
        >
          <input
            type="text"
            placeholder="عنوان آدرس (مثال: خانه)"
            value={newAddress.title}
            onChange={(e) =>
              setNewAddress({ ...newAddress, title: e.target.value })
            }
            className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F] transition-colors"
            required
          />
          <textarea
            placeholder="آدرس دقیق..."
            value={newAddress.fullAddress}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullAddress: e.target.value })
            }
            className="w-full h-24 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl p-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none resize-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400 dark:placeholder:text-[#6A5A4F] transition-colors"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingAddress(false)}
              className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-[#A1A1A1] hover:bg-gray-100 dark:hover:bg-[#2C1A14] rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] text-sm font-bold rounded-xl hover:bg-[#C29262] dark:hover:bg-[#5A3826] transition-colors"
            >
              ثبت آدرس
            </button>
          </div>
        </form>
      )}

      {user.addresses && user.addresses.length > 0 ? (
        <div className="space-y-4">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 border border-gray-200 dark:border-[#3c2317] rounded-2xl flex justify-between items-start group hover:border-[#D4A373] dark:hover:border-[#6A422D] transition-colors"
            >
              <div>
                <h3 className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] mb-1 transition-colors">
                  {address.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#A1A1A1] leading-relaxed transition-colors">
                  {address.fullAddress}
                </p>
              </div>
              <button
                onClick={() => removeAddress(address.id)}
                className="p-2 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 dark:text-[#6A5A4F] text-sm transition-colors">
          هنوز آدرسی ثبت نکرده‌اید.
        </div>
      )}
    </div>
  );
}
