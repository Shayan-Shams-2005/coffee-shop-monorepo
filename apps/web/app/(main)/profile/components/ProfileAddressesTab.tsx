// cSpell:disable
"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Loader2, User, Phone, Map, Edit2 } from "lucide-react";
import { UserApi } from "../userApi"; 

interface Address {
  userAddressId: number;
  title: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
}

const MAX_ADDRESSES = 5; 

export function ProfileAddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    recipientName: "",
    phoneNumber: "",
    province: "",
    city: "",
    addressLine: "",
    postalCode: ""
  });

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await UserApi.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load addresses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData({ 
      title: "", recipientName: "", phoneNumber: "", 
      province: "", city: "", addressLine: "", postalCode: "" 
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (address: Address) => {
    setFormData({
      title: address.title,
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      province: address.province,
      city: address.city,
      addressLine: address.addressLine,
      postalCode: address.postalCode,
    });
    setEditingId(address.userAddressId);
    setIsFormOpen(true);
    
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        // 🚀 Edit Existing Address
        await UserApi.updateAddress(editingId, {
          ...formData,
          isDefault: false,
        });
      } else {
        // 🚀 Add New Address
        await UserApi.addAddress({
          ...formData,
          isDefault: false,
        });
      }
      resetForm();
      await fetchAddresses();
    } catch (error) {
      alert("خطا در ثبت آدرس. لطفاً بررسی کنید تمامی فیلدها به درستی وارد شده باشند.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("آیا از حذف این آدرس اطمینان دارید؟")) {
      try {
        await UserApi.deleteAddress(id);
        setAddresses(addresses.filter(a => a.userAddressId !== id));
        if (editingId === id) resetForm();
      } catch (error) {
        alert("خطا در حذف آدرس");
      }
    }
  };

  const hasReachedLimit = addresses.length >= MAX_ADDRESSES;

  return (
    <div className="bg-white dark:bg-[#1A110F] rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#D4A373]/20 dark:border-[#3c2317] transition-colors">
      <div className="flex items-center justify-between mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4 transition-colors">
        <h2 className="text-xl font-black text-[#2C1E16] dark:text-white flex items-center gap-2 transition-colors">
          <MapPin className="w-6 h-6 text-[#D4A373] dark:text-[#C68E58] transition-colors" />
          آدرس‌های من
          <span className="text-sm font-medium text-gray-400 dark:text-[#6A5A4F] mr-2">
            ({addresses.length} از {MAX_ADDRESSES})
          </span>
        </h2>
        
        {!hasReachedLimit && !isFormOpen && (
          <button
            onClick={handleOpenAddForm}
            className="text-sm font-bold text-[#D4A373] dark:text-[#C68E58] flex items-center gap-1 hover:text-[#4A3022] dark:hover:text-[#FFD7BA] transition-colors"
          >
            <Plus className="w-4 h-4" /> افزودن آدرس جدید
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="bg-gray-50 dark:bg-[#1A1412] p-6 rounded-2xl mb-8 space-y-4 border border-gray-200 dark:border-[#3c2317] transition-colors animate-in slide-in-from-top-2 relative"
        >
          <div className="mb-4">
            <h3 className="font-bold text-[#2C1E16] dark:text-[#EAE0D5]">
              {editingId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="عنوان آدرس (مثال: خانه)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400"
              required
            />
            <input
              type="text"
              placeholder="نام و نام خانوادگی گیرنده"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400"
              required
            />
            <input
              type="tel"
              dir="ltr"
              placeholder="شماره موبایل گیرنده"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm text-right focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400 placeholder:text-right"
              required
            />
            <input
              type="text"
              dir="ltr"
              placeholder="کد پستی (۱۰ رقم)"
              value={formData.postalCode}
              maxLength={10}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, '') })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm text-right focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400 placeholder:text-right"
              required
            />
            <input
              type="text"
              placeholder="استان"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400"
              required
            />
            <input
              type="text"
              placeholder="شهر"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-12 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400"
              required
            />
          </div>

          <textarea
            placeholder="آدرس دقیق (خیابان، کوچه، پلاک، واحد)"
            value={formData.addressLine}
            onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
            className="w-full h-24 bg-white dark:bg-transparent border border-gray-200 dark:border-[#3c2317] rounded-xl p-4 text-sm focus:border-[#D4A373] dark:focus:border-[#6A422D] outline-none resize-none text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-gray-400 transition-colors"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-[#A1A1A1] hover:bg-gray-100 dark:hover:bg-[#2C1A14] rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] text-sm font-bold rounded-xl hover:bg-[#C29262] dark:hover:bg-[#5A3826] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingId ? "ذخیره تغییرات" : "ثبت آدرس"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#C68E58]" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.userAddressId}
              className={`p-5 border border-gray-200 dark:border-[#3c2317] rounded-2xl flex justify-between items-start group hover:border-[#D4A373] dark:hover:border-[#6A422D] transition-colors bg-white dark:bg-[#1A1412] relative ${editingId === address.userAddressId ? "opacity-50" : ""}`}
            >
              <div className="space-y-3 w-full pl-24">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[#2C1E16] dark:text-[#EAE0D5] text-lg">
                    {address.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-700 dark:text-[#A1A1A1] leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#D4A373]" />
                  <span>{address.province}، {address.city}، {address.addressLine}</span>
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-[#6A5A4F] pt-2 border-t border-gray-100 dark:border-[#3c2317]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{address.recipientName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="dir-ltr">{address.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="dir-ltr">{address.postalCode}</span>
                  </div>
                </div>
              </div>

              <div className="absolute left-5 top-5 flex items-center gap-2">
                {/* 🚀 FIXED: Added Edit Button */}
                <button
                  onClick={() => handleOpenEditForm(address)}
                  className="p-2.5 text-blue-500 dark:text-blue-400 hover:text-white dark:hover:text-white hover:bg-blue-500 dark:bg-blue-900/10 hover:bg-blue-600 rounded-xl transition-colors shrink-0 bg-blue-50"
                  title="ویرایش آدرس"
                >
                  <Edit2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(address.userAddressId)}
                  className="p-2.5 text-red-400 dark:text-red-500 hover:text-white dark:hover:text-white hover:bg-red-500 dark:bg-red-900/10 hover:bg-red-600 rounded-xl transition-colors shrink-0 bg-red-50"
                  title="حذف آدرس"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 dark:text-[#6A5A4F] text-sm transition-colors border border-dashed border-gray-200 dark:border-[#3c2317] rounded-2xl">
          هنوز آدرسی ثبت نکرده‌اید.
        </div>
      )}
    </div>
  );
}