// app/(main)/returns/page.tsx
"use client";

import { 
  RefreshCcw, 
  Coffee, 
  PackageX, 
  Headset, 
  Camera, 
  Truck, 
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#231511] border-b border-[#E3C3A4]/40 dark:border-[#3c2317] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#C68E58 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-[#C68E58]/10">
            <RefreshCcw className="w-10 h-10 text-[#C68E58]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A3022] dark:text-[#EAE0D5] mb-6 tracking-tight">
            رویه بازگرداندن کالا
          </h1>
          <p className="text-lg text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
            رضایت شما اولویت نئو کافه است. ما شرایطی را فراهم کرده‌ایم تا در صورت بروز هرگونه مشکل، بتوانید سفارش خود را با خیالی آسوده مرجوع کنید. لطفاً پیش از ثبت درخواست، شرایط زیر را مطالعه فرمایید.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] mt-16">
        
        {/* Conditions Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-10 relative inline-block text-center w-full">
            شرایط پذیرش مرجوعی
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#C68E58] rounded-full"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coffee & Consumables */}
            <div className="bg-white dark:bg-[#231511] p-8 rounded-[2rem] border border-[#E3C3A4]/40 dark:border-[#3c2317] shadow-sm hover:border-[#C68E58]/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl flex items-center justify-center text-[#C68E58] shrink-0">
                  <Coffee className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">دانـه و پودر قهـوه</h3>
                  <p className="text-sm font-bold text-[#8C7A6B] mt-1">کالاهای مصرفی و خوراکی</p>
                </div>
              </div>
              <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm leading-relaxed text-justify mb-6">
                با توجه به رعایت پروتکل‌های بهداشتی، قهوه و محصولات خوراکی تنها در شرایط زیر قابل بازگشت هستند:
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                  <span>ارسال اشتباه محصول (مغایرت با فاکتور)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                  <span>آسیب‌دیدگی شدید بسته‌بندی در حین حمل و نقل</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#D95D39] font-medium mt-2 p-3 bg-[#D95D39]/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>شرط مهم: پلمپ بسته‌بندی قهوه به هیچ عنوان نباید باز شده باشد.</span>
                </li>
              </ul>
            </div>

            {/* Accessories & Equipment */}
            <div className="bg-white dark:bg-[#231511] p-8 rounded-[2rem] border border-[#E3C3A4]/40 dark:border-[#3c2317] shadow-sm hover:border-[#C68E58]/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl flex items-center justify-center text-[#C68E58] shrink-0">
                  <PackageX className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">تجهیزات و اکسسوری</h3>
                  <p className="text-sm font-bold text-[#8C7A6B] mt-1">موکاپات، فرنچ‌پرس، ماگ و...</p>
                </div>
              </div>
              <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm leading-relaxed text-justify mb-6">
                شما می‌توانید تجهیزات و لوازم جانبی خریداری شده را تا <strong className="text-[#C68E58]">۷ روز</strong> پس از دریافت کالا، تحت شرایط زیر مرجوع نمایید:
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                  <span>وجود نقص فنی یا ایراد فیزیکی (شکستگی، خط و خش)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                  <span>انصراف از خرید (به شرط باز نشدن پلمپ و عدم استفاده)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A3022] dark:text-[#EAE0D5] font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
                  <span>حفظ کارتن، جعبه اصلی و تمامی اقلام همراه کالا</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Steps to Return */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-12 relative inline-block text-center w-full">
            مراحل ثبت درخواست مرجوعی
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#C68E58] rounded-full"></span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line for large screens */}
            <div className="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#E3C3A4]/60 dark:via-[#3c2317] to-transparent z-0"></div>

            {[
              { icon: <Headset className="w-6 h-6" />, title: "۱. ارتباط با پشتیبانی", desc: "ابتدا از طریق پنل کاربری یا چت آنلاین، درخواست مرجوعی خود را به تیم پشتیبانی اطلاع دهید." },
              { icon: <Camera className="w-6 h-6" />, title: "۲. ارسال تصویر", desc: "عکس واضحی از کالا (و بخش آسیب‌دیده یا مغایر) برای کارشناسان ما ارسال کنید تا بررسی شود." },
              { icon: <Truck className="w-6 h-6" />, title: "۳. ارسال کالا", desc: "پس از تایید کارشناس، کالا را با بسته‌بندی ایمن از طریق پست یا تیپاکس به آدرس فروشگاه بازگردانید." },
              { icon: <CreditCard className="w-6 h-6" />, title: "۴. استرداد وجه", desc: "پس از دریافت کالا توسط نئو کافه و تایید سلامت فیزیکی، مبلغ طی ۲۴ الی ۴۸ ساعت به حساب شما واریز می‌شود." }
            ].map((step, index) => (
              <div key={index} className="bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-3xl p-6 text-center relative z-10 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <div className="w-16 h-16 bg-[#C68E58] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_4px_15px_rgba(198,142,88,0.3)]">
                  {step.icon}
                </div>
                <h3 className="font-black text-[#4A3022] dark:text-[#EAE0D5] mb-2">{step.title}</h3>
                <p className="text-xs text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes & CTA */}
        <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-[2.5rem] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-[#C68E58]" />
              <h3 className="text-2xl font-black text-[#4A3022] dark:text-white">آیا نیاز به مرجوع کردن کالا دارید؟</h3>
            </div>
            <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium leading-relaxed max-w-2xl">
              تیم پشتیبانی ما هر روز از ساعت ۹ صبح تا ۲۱ شب آماده بررسی درخواست‌های شماست. لطفاً پیش از ارسال هرگونه کالا، حتماً با کارشناسان ما هماهنگی‌های لازم را انجام دهید تا فرآیند استرداد با سرعت و دقت بیشتری انجام شود.
            </p>
          </div>
          
          <div className="w-full lg:w-auto shrink-0">
            <Link 
              href="/support" 
              className="w-full lg:w-auto bg-[#C68E58] hover:bg-[#A87242] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] flex items-center justify-center gap-2"
            >
              <Headset className="w-5 h-5 -ml-1" />
              ثبت درخواست در پشتیبانی
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}