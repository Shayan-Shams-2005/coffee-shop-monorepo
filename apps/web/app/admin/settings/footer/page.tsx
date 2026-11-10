// app/admin/settings/footer/page.tsx
"use client";

import { useState } from "react";
import { 
  Save, 
  MapPin, 
  Phone, 
  Smartphone, 
  Mail, 
  AlignRight, 
  CheckCircle2, 
  Loader2,
  Trash2,
  Plus
} from "lucide-react";

const SOCIAL_PLATFORMS = {
  instagram: { label: "اینستاگرام", placeholder: "https://instagram.com/...", iconFile: "/icons/instagram.png" },
  telegram: { label: "تلگرام", placeholder: "https://t.me/...", iconFile: "/icons/telegram.png" },
  whatsapp: { label: "واتس‌اپ", placeholder: "https://wa.me/...", iconFile: "/icons/whatsapp.png" },
  linkedin: { label: "لینکدین", placeholder: "https://linkedin.com/company/...", iconFile: "/icons/linkedin.png" },
  youtube: { label: "یوتیوب", placeholder: "https://youtube.com/@...", iconFile: "/icons/youtube.png" },
  aparat: { label: "آپارات", placeholder: "https://aparat.com/...", iconFile: "/icons/aparat.png" },
  x: { label: "ایکس (توییتر)", placeholder: "https://x.com/...", iconFile: "/icons/x.png" },
  rubika: { label: "روبیکا", placeholder: "https://rubika.ir/...", iconFile: "/icons/rubika.png" },
  eitaa: { label: "ایتا", placeholder: "https://eitaa.com/...", iconFile: "/icons/eitaa.png" },
  bale: { label: "بله", placeholder: "https://ble.ir/...", iconFile: "/icons/bale.png" },
  github: { label: "گیت‌هاب", placeholder: "https://github.com/...", iconFile: "/icons/github.png" }
};

type PlatformKey = keyof typeof SOCIAL_PLATFORMS;

export default function FooterSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: "ما با واردات مستقیم بهترین دانه‌های قهوه از مزارع معتبر جهانی و رست تخصصی آن‌ها، کیفیت و تازگی را به فنجان شما می‌آوریم.",
    address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه قهوه، پلاک ۱۲",
    telephone: "02188776655", 
    mobile: "09123456789",    
    email: "info@neocafe.com",
  });

  const [socialLinks, setSocialLinks] = useState<{ id: string; platform: PlatformKey | string; url: string }[]>([
    { id: "1", platform: "instagram", url: "https://instagram.com/neocafe" },
    { id: "2", platform: "telegram", url: "https://t.me/neocafe" },
    { id: "3", platform: "whatsapp", url: "https://wa.me/989120000000" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSocial = () => {
    if (socialLinks.length >= 10) return; // Prevent adding more than 10
    
    setSocialLinks(prev => [
      ...prev, 
      { id: Date.now().toString(), platform: "instagram", url: "" }
    ]);
  };

  const handleUpdateSocial = (id: string, field: "platform" | "url", value: string) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleRemoveSocial = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">تنظیمات فوتر و ارتباطات</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
            مدیریت متن درباره ما، اطلاعات تماس و لینک‌های شبکه‌های اجتماعی سایت
          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#2E7D32] dark:text-[#81C784] font-bold text-sm transition-all duration-300 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <CheckCircle2 className="w-5 h-5" />
          تنظیمات با موفقیت ذخیره شد
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          
          {/* About Us Section */}
          <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58]">
                <AlignRight className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">توضیحات معرفی (درباره ما)</h2>
            </div>
            <div className="p-6 bg-white dark:bg-[#1A0F0C]/30">
              <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">متن کوتاه فوتر</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all resize-none custom-scrollbar"
                placeholder="توضیح کوتاه درباره فروشگاه..."
                required
              />
              <p className="text-xs text-[#8C7A6B] mt-2">این متن در زیر لوگوی فوتر به تمامی کاربران نمایش داده می‌شود.</p>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58]">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">اطلاعات تماس</h2>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#1A0F0C]/30 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                  <MapPin className="w-4 h-4 text-[#8C7A6B]" /> آدرس فیزیکی
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                  placeholder="آدرس فروشگاه..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                    <Phone className="w-4 h-4 text-[#8C7A6B]" /> تلفن ثابت
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
                    placeholder="021-..."
                  />
                  <p className="text-[11px] text-[#8C7A6B] mt-1.5 font-medium">در صورت خالی بودن، در فوتر نمایش داده نمی‌شود.</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                    <Smartphone className="w-4 h-4 text-[#8C7A6B]" /> شماره موبایل
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
                    placeholder="0912..."
                  />
                  <p className="text-[11px] text-[#8C7A6B] mt-1.5 font-medium">در صورت خالی بودن، در فوتر نمایش داده نمی‌شود.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">
                    <Mail className="w-4 h-4 text-[#8C7A6B]" /> ایمیل پشتیبانی
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
                    placeholder="info@example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          
          {/* Social Media Links Section */}
          <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-sm sticky top-8">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">شبکه‌های اجتماعی</h2>
                <p className="text-xs font-medium text-[#8C7A6B] mt-1">مدیریت لینک‌های فوتر</p>
              </div>
              <span className="bg-[#C68E58]/10 text-[#C68E58] px-2.5 py-1 rounded-lg text-xs font-bold">
                {socialLinks.length} / ۱۰
              </span>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#1A0F0C]/30 flex flex-col gap-4 max-h-[550px] overflow-y-auto custom-scrollbar">
              
              {socialLinks.map((link) => {
                const currentPlatformData = SOCIAL_PLATFORMS[link.platform as PlatformKey] || SOCIAL_PLATFORMS.instagram;
                
                return (
                  <div key={link.id} className="group relative bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl p-4 transition-all hover:border-[#C68E58]/50">
                    
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSocial(link.id)}
                      className="absolute left-3 top-3 w-8 h-8 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600"
                      title="حذف شبکه اجتماعی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-1.5">
                          
                          {/* CSS Mask Technique */}
                          <div 
                            className="w-5 h-5 bg-[#C68E58] transition-all opacity-80 group-hover:opacity-100"
                            style={{
                              WebkitMaskImage: `url(${currentPlatformData.iconFile})`,
                              WebkitMaskSize: 'contain',
                              WebkitMaskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              maskImage: `url(${currentPlatformData.iconFile})`,
                              maskSize: 'contain',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                            }}
                          />

                          انتخاب پلتفرم
                        </label>
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateSocial(link.id, "platform", e.target.value)}
                          className="w-full bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-3 py-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all appearance-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                        >
                          {Object.entries(SOCIAL_PLATFORMS).map(([key, data]) => (
                            <option key={key} value={key}>
                              {data.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-1.5">لینک پروفایل / کانال</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleUpdateSocial(link.id, "url", e.target.value)}
                          dir="ltr"
                          className="w-full bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-2.5 text-sm text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
                          placeholder={currentPlatformData.placeholder}
                          required
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddSocial}
                disabled={socialLinks.length >= 10}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] text-[#8C7A6B] hover:text-[#C68E58] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#E3C3A4] disabled:hover:text-[#8C7A6B] disabled:dark:hover:border-[#3c2317] rounded-2xl py-4 font-bold text-sm transition-colors mt-2"
              >
                <Plus className="w-5 h-5" />
                {socialLinks.length >= 10 ? "حداکثر ۱۰ شبکه اجتماعی" : "افزودن شبکه اجتماعی جدید"}
              </button>

            </div>

            <div className="p-6 border-t border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#231511]/30">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> ذخیره تغییرات
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}