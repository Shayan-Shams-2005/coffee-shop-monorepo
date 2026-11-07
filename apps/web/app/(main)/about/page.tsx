// app/(main)/about/page.tsx
"use client";

import { 
  Coffee, 
  Send, 
  Code2, 
  Database, 
  MonitorSmartphone,
  Server
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#231511] border-b border-[#E3C3A4]/40 dark:border-[#3c2317] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#C68E58 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-[#C68E58]/10">
            <Coffee className="w-10 h-10 text-[#C68E58]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A3022] dark:text-[#EAE0D5] mb-6 tracking-tight">
            درباره نئو کافه
          </h1>
          <p className="text-lg text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
            نئو کافه تنها یک فروشگاه قهوه نیست؛ بلکه تلفیقی از هنر، طعم واقعی قهوه و تکنولوژی مدرن است. ما تلاش کرده‌ایم تا با بهره‌گیری از جدیدترین معماری‌های نرم‌افزاری، تجربه‌ای سریع، امن و لذت‌بخش از خرید آنلاین قهوه را برای شما رقم بزنیم.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] mt-16">
        
        {/* The Project Tech Stack Overview */}
        <div className="mb-20 text-center">
          <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-10 relative inline-block">
            معماری و تکنولوژی نئو کافه
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#C68E58] rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#231511] p-6 rounded-3xl border border-[#E3C3A4]/40 dark:border-[#3c2317] flex flex-col items-center">
              <MonitorSmartphone className="w-10 h-10 text-[#C68E58] mb-4" />
              <h3 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">فرانت‌اند قدرتمند</h3>
              <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1]">پیاده‌سازی شده با React، Next.js و TypeScript برای رندر سریع (SSR) و رابط کاربری داینامیک.</p>
            </div>
            <div className="bg-white dark:bg-[#231511] p-6 rounded-3xl border border-[#E3C3A4]/40 dark:border-[#3c2317] flex flex-col items-center">
              <Server className="w-10 h-10 text-[#C68E58] mb-4" />
              <h3 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">بک‌اند و معماری تمیز</h3>
              <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1]">توسعه یافته با ASP.NET Core بر پایه Clean Architecture برای پایداری، امنیت و مقیاس‌پذیری بالا.</p>
            </div>
            <div className="bg-white dark:bg-[#231511] p-6 rounded-3xl border border-[#E3C3A4]/40 dark:border-[#3c2317] flex flex-col items-center">
              <Database className="w-10 h-10 text-[#C68E58] mb-4" />
              <h3 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">پایگاه داده و زیرساخت</h3>
              <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1]">استفاده از PostgreSQL و Entity Framework Core در کنار پردازش‌های پس‌زمینه با Hangfire.</p>
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#2C1E16] dark:text-white relative inline-block">
              تیم توسعه‌دهندگان
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#C68E58] rounded-full"></span>
            </h2>
            <p className="text-[#8C7A6B] dark:text-[#A1A1A1] mt-6">
              نئو کافه حاصل همکاری و تلاش دو برادر مهندس نرم‌افزار است که با اشتیاق کامل این پلتفرم را از صفر طراحی و توسعه داده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Shayan (Frontend) */}
            <div className="bg-white dark:bg-[#231511] rounded-[2rem] p-8 border border-[#E3C3A4]/40 dark:border-[#3c2317] hover:border-[#C68E58]/60 transition-colors shadow-sm group">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img 
                  src="https://github.com/Shayan-Shams-2005.png" 
                  alt="Shayan Shams" 
                  className="w-28 h-28 rounded-full border-4 border-[#FCF9F5] dark:border-[#1A0F0C] shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 text-center sm:text-right">
                  <h3 className="text-2xl font-black text-[#4A3022] dark:text-white mb-1">شایان شمس</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-[#C68E58] font-bold text-sm mb-4">
                    <Code2 className="w-4 h-4" />
                    Frontend Web Developer
                  </div>
                  <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed text-justify mb-6">
                    دانشجوی مهندسی کامپیوتر و حل‌تمرین دانشگاه. علاقه‌مند به توسعه فرانت‌اند و ساخت برنامه‌های تحت وب مدرن با React و Next.js. 
                    تمرکز من بر خلق رابط‌های کاربری پویا، مدیریت Stateهای پیچیده، نوشتن Clean Code و ارتقای مداوم مهارت‌های مهندسی نرم‌افزار است.
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
                    {["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#4A3022] dark:text-[#EAE0D5] text-xs font-bold rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <a href="https://github.com/Shayan-Shams-2005" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:border-[#C68E58] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </a>
                    <a href="https://ir.linkedin.com/in/shayan-shams-96870637b" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#8C7A6B] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Shervin (Backend) */}
            <div className="bg-white dark:bg-[#231511] rounded-[2rem] p-8 border border-[#E3C3A4]/40 dark:border-[#3c2317] hover:border-[#C68E58]/60 transition-colors shadow-sm group">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img 
                  src="https://github.com/Shervin-2005.png" 
                  alt="Shervin Shams" 
                  className="w-28 h-28 rounded-full border-4 border-[#FCF9F5] dark:border-[#1A0F0C] shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 text-center sm:text-right">
                  <h3 className="text-2xl font-black text-[#4A3022] dark:text-white mb-1">شروین شمس</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-[#C68E58] font-bold text-sm mb-4">
                    <Server className="w-4 h-4" />
                    Backend Web Developer
                  </div>
                  <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed text-justify mb-6">
                    دانشجوی مهندسی کامپیوتر با اشتیاق فراوان به توسعه بک‌اند و ساخت وب‌اپلیکیشن‌ها با C# و ASP.NET Core.
                    من از حل چالش‌های فنی، نوشتن کدهای تمیز و قابل نگهداری، بهینه‌سازی دیتابیس و طراحی الگوهای معماری لذت می‌برم.
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
                    {["C#", "ASP.NET Core", "PostgreSQL", "Clean Architecture", "SignalR"].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#4A3022] dark:text-[#EAE0D5] text-xs font-bold rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <a href="https://github.com/Shervin-2005" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:border-[#C68E58] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </a>
                    <a href="https://linkedin.com/in/shervin-shams-3a9574375" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#8C7A6B] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href="https://t.me/Shervin_2005" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#8C7A6B] hover:text-[#229ED9] hover:border-[#229ED9] transition-colors">
                      <Send className="w-5 h-5 -ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}