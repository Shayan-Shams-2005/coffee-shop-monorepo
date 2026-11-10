// app/(main)/terms/page.tsx
"use client";

import { 
  Scale, 
  Shield, 
  ShoppingBag, 
  CreditCard, 
  Clock,
  Headset
} from "lucide-react";
import Link from "next/link";

const TERMS_DATA = [
  {
    icon: <Scale className="w-6 h-6" />,
    title: "قوانین عمومی",
    content: [
      "توجه داشته باشید کلیه اصول و رویه‌های نئو کافه منطبق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف‌کننده است.",
      "کاربر نیز موظف به رعایت قوانین مرتبط با کاربر است. در صورتی که در قوانین مندرج، رویه‌ها و سرویس‌های نئو کافه تغییراتی در آینده ایجاد شود، در همین صفحه منتشر و به روز رسانی می‌شود.",
      "استفاده شما از سایت نئو کافه به معنی پذیرش کامل این قوانین است."
    ]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "رعایت حریم شخصی",
    content: [
      "نئو کافه به اطلاعات خصوصی اشخاصى که از خدمات سایت استفاده می‌کنند، احترام گذاشته و از آن محافظت می‌کند.",
      "ما متعهد می‌شویم در حد توان از حریم شخصی شما دفاع کنیم و در این راستا، تکنولوژی مورد نیاز برای هرچه مطمئن‌تر و امن‌تر شدن استفاده شما از سایت را توسعه دهیم.",
      "همه مطالب در دسترس از طریق هر یک از خدمات نئو کافه، مانند متن، گرافیک، آرم، آیکون دکمه، تصاویر و موارد قابل دانلود و کپی، جزئی از اموال نئو کافه محسوب می‌شود."
    ]
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "ثبت، پردازش و ارسال سفارش",
    content: [
      "روز کاری به معنی روز شنبه تا پنج شنبه هر هفته، به استثنای تعطیلات عمومی در ایران است و کلیه سفارش‌های ثبت شده در طول روزهای کاری و اولین روز پس از تعطیلات پردازش می‌شوند.",
      "در صورت بروز مشکل در پردازش نهایی سبد خرید مانند اتمام موجودی کالا یا انصراف خریدار، مبلغ پرداخت شده طی ۲۴ الی ۴۸ ساعت کاری به حساب خریدار واریز خواهد شد.",
      "نئو کافه مجاز است بدون اطلاع قبلی نسبت به توقف سفارش‌گیری جدید، اقدام و فروش خود را متوقف کند. حق قطع فروش کلیه و یا بخشی از محصولات به هر دلیلی مانند اتمام موجودی کالا بدون اطلاع قبلی، برای نئو کافه محفوظ است."
    ]
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "قیمت‌گذاری و پرداخت",
    content: [
      "سیاست قیمت‌گذاری در نئو کافه مبتنی بر اصول مشتری مداری و احترام به حقوق مصرف‌کننده است. قیمت‌های ارائه شده برای کالاها قیمت‌های خرده‌فروشی است.",
      "با نهایت احترام به کاربران، نئو کافه نمی‌تواند قیمت و موجودی نهایی کالاها را پیش از ثبت سفارش به صورت قطعی اعلام نماید. در مواردی بسیار نادر، در صورت نوسان‌ بازار و یا اشتباه در قیمت‌گذاری، اگر سفارشی قابل تحویل نباشد، نئو کافه موظف است در اسرع وقت این موضوع را به فرد سفارش‌دهنده اطلاع دهد و سفارش را لغو کند.",
      "هزینه بسته‌بندی، ارسال و بیمه حمل کالا بسته به شرایط سفارش که در فرم سبد خرید اطلاع‌رسانی می‌شود، ممکن است جداگانه محاسبه شود."
    ]
  }
];

export default function TermsPage() {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#231511] border-b border-[#E3C3A4]/40 dark:border-[#3c2317] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#C68E58 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-[#C68E58]/10">
            <Scale className="w-10 h-10 text-[#C68E58]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A3022] dark:text-[#EAE0D5] mb-4 tracking-tight">
            شرایط و قوانین استفاده
          </h1>
          <div className="flex items-center gap-2 text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] bg-[#FCF9F5] dark:bg-[#1A0F0C] px-4 py-2 rounded-full border border-[#E3C3A4]/60 dark:border-[#3c2317] mb-6">
            <Clock className="w-4 h-4" />
            آخرین به‌روزرسانی: آبان ۱۴۰۳
          </div>
          <p className="text-lg text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
            لطفاً پیش از ثبت سفارش و استفاده از خدمات فروشگاه نئو کافه، شرایط و قوانین زیر را به دقت مطالعه فرمایید. ورود شما به وب‌سایت به معنای آگاهی و پذیرش این قوانین است.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[900px] mt-16">
        
        <div className="flex flex-col gap-8">
          {TERMS_DATA.map((term, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-[#231511] p-8 sm:p-10 rounded-[2.5rem] border border-[#E3C3A4]/40 dark:border-[#3c2317] shadow-sm hover:border-[#C68E58]/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E3C3A4]/30 dark:border-[#3c2317]/50">
                <div className="w-12 h-12 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl flex items-center justify-center text-[#C68E58] shrink-0">
                  {term.icon}
                </div>
                <h2 className="text-2xl font-black text-[#4A3022] dark:text-[#EAE0D5]">
                  {term.title}
                </h2>
              </div>
              
              <ul className="flex flex-col gap-4">
                {term.content.map((paragraph, pIndex) => (
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
            <h3 className="text-xl font-black text-[#4A3022] dark:text-white mb-2">سوالی درباره قوانین دارید؟</h3>
            <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] font-medium leading-relaxed">
              اگر در خصوص هر یک از بندهای بالا نیاز به راهنمایی بیشتری دارید، پشتیبانی نئو کافه همراه شماست.
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