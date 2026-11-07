// app/(main)/privacy/page.tsx
"use client";

import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Share2, 
  Cookie, 
  Clock,
  Headset
} from "lucide-react";
import Link from "next/link";

const PRIVACY_DATA = [
  {
    icon: <Database className="w-6 h-6" />,
    title: "چه اطلاعاتی از شما جمع‌آوری می‌کنیم؟",
    content: [
      "هنگام ثبت‌نام یا ایجاد حساب کاربری در نئو کافه، اطلاعاتی مانند نام و نام خانوادگی، شماره تلفن همراه، آدرس ایمیل و رمز عبور ذخیره می‌شود.",
      "هنگام ثبت سفارش و خرید، اطلاعات مربوط به آدرس پستی، کد پستی و مشخصات گیرنده جهت ارسال دقیق کالا دریافت می‌گردد.",
      "اطلاعات مربوط به تراکنش‌های مالی به صورت رمزنگاری‌شده از طریق درگاه‌های بانکی معتبر پردازش شده و نئو کافه به اطلاعات کامل کارت بانکی شما دسترسی ندارد."
    ]
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "چگونه از اطلاعات شما محافظت می‌کنیم؟",
    content: [
      "نئو کافه متعهد به حفظ حریم شخصی کاربران است و از بالاترین استانداردهای امنیتی و پروتکل‌های رمزنگاری (SSL) برای حفاظت از داده‌های شما استفاده می‌کند.",
      "دسترسی به اطلاعات حساب کاربری شما تنها با وارد کردن رمز عبور شخصی امکان‌پذیر است؛ بنابراین حفظ محرمانگی نام کاربری و رمز عبور به عهده خود کاربر است.",
      "تمامی سرورها و پایگاه‌های داده دارای لایه‌های امنیتی پیشرفته فایروال بوده و به صورت مرتب پایش می‌شوند."
    ]
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "استفاده و اشتراک‌گذاری اطلاعات",
    content: [
      "اطلاعات شخصی شما صرفاً جهت پردازش سفارشات، ارسال کالا، ارائه خدمات پشتیبانی و بهبود تجربه خرید شما در نئو کافه استفاده می‌شود.",
      "نئو کافه به هیچ عنوان اطلاعات شخصی کاربران را به اشخاص ثالث، شرکت‌های تبلیغاتی یا مؤسسات دیگر واگذار یا اجاره نخواهد داد.",
      "تنها در صورت درخواست مراجع قانونی ذی‌صلاح و بر اساس حکم قانون، اطلاعاتی در اختیار مراجع قضایی قرار خواهد گرفت."
    ]
  },
  {
    icon: <Cookie className="w-6 h-6" />,
    title: "کوکی‌ها (Cookies)",
    content: [
      "وب‌سایت نئو کافه ممکن است از کوکی‌ها برای بهبود عملکرد سایت، ذخیره تنظیمات کاربری (مانند سبد خرید و وضعیت ورود) و تحلیل ترافیک سایت استفاده کند.",
      "شما می‌توانید از طریق تنظیمات مرورگر خود، پذیرش کوکی‌ها را غیرفعال کنید، اما توجه داشته باشید که این کار ممکن است برخی از قابلیت‌های سایت را مختل کند."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#231511] border-b border-[#E3C3A4]/40 dark:border-[#3c2317] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#C68E58 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-[#C68E58]/10">
            <ShieldCheck className="w-10 h-10 text-[#C68E58]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A3022] dark:text-[#EAE0D5] mb-4 tracking-tight">
            حریم خصوصی کاربران
          </h1>
          <div className="flex items-center gap-2 text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] bg-[#FCF9F5] dark:bg-[#1A0F0C] px-4 py-2 rounded-full border border-[#E3C3A4]/60 dark:border-[#3c2317] mb-6">
            <Clock className="w-4 h-4" />
            آخرین به‌روزرسانی: آبان ۱۴۰۳
          </div>
          <p className="text-lg text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
            امنیت و حفظ حریم شخصی اطلاعات شما در نئو کافه از اهمیت بسیار بالایی برخوردار است. در این سند نحوه جمع‌آوری و استفاده از اطلاعات شما به صورت شفاف توضیح داده شده است.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[900px] mt-16">
        
        <div className="flex flex-col gap-8">
          {PRIVACY_DATA.map((item, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-[#231511] p-8 sm:p-10 rounded-[2.5rem] border border-[#E3C3A4]/40 dark:border-[#3c2317] shadow-sm hover:border-[#C68E58]/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E3C3A4]/30 dark:border-[#3c2317]/50">
                <div className="w-12 h-12 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl flex items-center justify-center text-[#C68E58] shrink-0">
                  {item.icon}
                </div>
                <h2 className="text-2xl font-black text-[#4A3022] dark:text-[#EAE0D5]">
                  {item.title}
                </h2>
              </div>
              
              <ul className="flex flex-col gap-4">
                {item.content.map((paragraph, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C68E58] mt-2.5 shrink-0"></div>
                    <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm sm:text-base leading-loose text-justify font-medium">
                      {paragraph}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Support Call-to-action */}
        <div className="mt-16 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-xl font-black text-[#4A3022] dark:text-white mb-2">سوالی درباره حریم خصوصی دارید؟</h3>
            <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] font-medium leading-relaxed">
              اگر در خصوص امنیت اطلاعات خود ابهامی دارید، پشتیبانی نئو کافه آماده پاسخگویی به شماست.
            </p>
          </div>
          <Link 
            href="/support" 
            className="w-full sm:w-auto shrink-0 bg-[#C68E58] hover:bg-[#A87242] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] flex items-center justify-center gap-2"
          >
            <Headset className="w-5 h-5 -ml-1" />
            ارتباط با پشتیبانی
          </Link>
        </div>

      </div>
    </div>
  );
}