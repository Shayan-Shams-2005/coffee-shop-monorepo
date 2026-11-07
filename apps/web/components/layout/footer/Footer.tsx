// components/layout/footer/Footer.tsx
"use client";

import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { siteConfig } from "../../../config/site"; 

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="mt-auto transition-colors duration-300 bg-[#C68E58] dark:bg-[#1A1412] dark:border-t dark:border-[#3c2317]" 
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* ستون اول: معرفی و تماس */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="text-3xl font-black text-white dark:text-white hover:opacity-80 transition-opacity w-fit">
              {siteConfig.name}
            </Link>
            <p className="text-sm font-medium text-white/90 dark:text-[#A1A1A1] leading-relaxed text-justify">
              {siteConfig.description} ما با واردات مستقیم بهترین دانه‌های قهوه از مزارع معتبر جهانی و رست تخصصی آن‌ها، کیفیت و تازگی را به فنجان شما می‌آوریم.
            </p>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3 text-sm font-medium text-white dark:text-[#EAE0D5]">
                <MapPin className="w-5 h-5 text-white/80 dark:text-[#C68E58] shrink-0" />
                <span>تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه قهوه، پلاک ۱۲</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-white dark:text-[#EAE0D5]">
                <Phone className="w-5 h-5 text-white/80 dark:text-[#C68E58] shrink-0" />
                <span className="dir-ltr">۰۲۱ - ۸۸۷۷۶۶۵۵</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-white dark:text-[#EAE0D5]">
                <Mail className="w-5 h-5 text-white/80 dark:text-[#C68E58] shrink-0" />
                <span className="dir-ltr">info@neocafe.com</span>
              </div>
            </div>
          </div>

          {/* ستون دوم: دسترسی سریع */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black text-white dark:text-[#EAE0D5] mb-6">دسترسی سریع</h3>
            <ul className="flex flex-col gap-3">
              {[
                { title: "فروشگاه", href: "/shop" },
                { title: "درباره ما", href: "/about" },
                // 🚀 FIXED: "تماس با ما" completely removed from here!
                { title: "وبلاگ آموزشی", href: "/blog" },
                { title: "پیگیری سفارشات", href: "/tracking" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-white/80 dark:text-[#8C7A6B] hover:text-white dark:hover:text-[#C68E58] transition-all flex items-center gap-1 group"
                  >
                    <ChevronLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون سوم: خدمات مشتریان */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black text-white dark:text-[#EAE0D5] mb-6">خدمات مشتریان</h3>
            <ul className="flex flex-col gap-3">
              {[
                { title: "ارتباط با پشتیبانی", href: "/support" }, // 🚀 ONLY the live support chat is available for contact
                { title: "سوالات متداول (FAQ)", href: "/faq" },
                { title: "رویه بازگرداندن کالا", href: "/returns" },
                { title: "شرایط و قوانین", href: "/terms" },
                { title: "حریم خصوصی", href: "/privacy" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-white/80 dark:text-[#8C7A6B] hover:text-white dark:hover:text-[#C68E58] transition-all flex items-center gap-1 group"
                  >
                    <ChevronLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون چهارم: شبکه‌های اجتماعی و مجوزها */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* شبکه‌های اجتماعی با آیکون‌های SVG بومی */}
            <div>
              <h3 className="text-lg font-black text-white dark:text-[#EAE0D5] mb-6">همراه ما باشید</h3>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-[#231511] border border-white/20 dark:border-[#3c2317] flex items-center justify-center text-white dark:text-[#8C7A6B] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] dark:hover:text-white hover:border-transparent transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-[#231511] border border-white/20 dark:border-[#3c2317] flex items-center justify-center text-white dark:text-[#8C7A6B] hover:bg-[#229ED9] dark:hover:text-white hover:border-transparent transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-[#231511] border border-white/20 dark:border-[#3c2317] flex items-center justify-center text-white dark:text-[#8C7A6B] hover:bg-[#0A66C2] dark:hover:text-white hover:border-transparent transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            {/* اینماد و مجوزها */}
            <div>
              <h3 className="text-sm font-bold text-white dark:text-[#EAE0D5] mb-4">مجوزها و گواهینامه‌ها</h3>
              <div className="flex flex-wrap gap-3">
                <div className="w-24 h-24 bg-white/10 dark:bg-[#231511] border border-white/20 dark:border-[#3c2317] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 dark:hover:border-[#C68E58] transition-colors shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-white dark:text-[#C68E58]" />
                  <span className="text-[10px] font-bold text-white/90 dark:text-[#A1A1A1]">نماد اعتماد</span>
                </div>
                <div className="w-24 h-24 bg-white/10 dark:bg-[#231511] border border-white/20 dark:border-[#3c2317] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 dark:hover:border-[#C68E58] transition-colors shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-white dark:text-[#C68E58]" />
                  <span className="text-[10px] font-bold text-white/90 dark:text-[#A1A1A1]">ساماندهی</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="pt-6 border-t border-white/20 dark:border-[#3c2317] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-white/80 dark:text-[#754e35]">
          <p>
            © {toFarsiNumber(currentYear)} تمامی حقوق متعلق به <span className="text-white dark:text-[#C68E58]">نئو کافه</span> محفوظ است.
          </p>
          <div className="flex items-center gap-2">
            توسعه داده شده با ❤️
          </div>
        </div>
        
      </div>
    </footer>
  );
}