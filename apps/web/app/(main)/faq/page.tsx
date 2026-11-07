// app/(main)/faq/page.tsx
"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  Truck, 
  Coffee, 
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const FAQ_DATA = [
  {
    category: "سفارش و ارسال",
    icon: <Truck className="w-6 h-6" />,
    items: [
      {
        question: "هزینه ارسال سفارشات چقدر است؟",
        answer: "هزینه ارسال برای سفارش‌های بالای ۱ میلیون تومان کاملاً رایگان است. برای سفارش‌های کمتر از این مبلغ، هزینه ارسال با توجه به شهر مقصد و نوع پست (پیشتاز یا تیپاکس) در مرحله تسویه حساب محاسبه می‌شود."
      },
      {
        question: "چند روز طول می‌کشد تا سفارشم به دستم برسد؟",
        answer: "سفارشات شهر تهران در صورت ثبت تا قبل از ساعت ۱۲ ظهر، همان روز با پیک ارسال می‌شوند. سفارشات شهرستان‌ها بسته به مسافت، بین ۲ تا ۴ روز کاری زمان می‌برد تا از طریق پست پیشتاز به دست شما برسد."
      },
      {
        question: "چگونه می‌توانم وضعیت سفارشم را پیگیری کنم؟",
        answer: "پس از ثبت سفارش، کد رهگیری پستی به شماره موبایل شما پیامک می‌شود. همچنین می‌توانید با مراجعه به پنل کاربری خود و بخش «پیگیری سفارشات»، از آخرین وضعیت بسته خود مطلع شوید."
      }
    ]
  },
  {
    category: "محصولات و کیفیت",
    icon: <Coffee className="w-6 h-6" />,
    items: [
      {
        question: "آیا قهوه‌ها به صورت تازه رست (Fresh Roast) ارسال می‌شوند؟",
        answer: "بله! کیفیت خط قرمز ماست. تمامی قهوه‌های نئو کافه دارای تاریخ رست (برشته‌کاری) مشخص هستند و ما تضمین می‌کنیم که قهوه‌ای که به دست شما می‌رسد، در بهترین بازه زمانی مصرف (اوج عطر و طعم) قرار دارد."
      },
      {
        question: "آیا می‌توانم قهوه را به صورت پودر شده (آسیاب شده) سفارش دهم؟",
        answer: "بله، در صفحه هر محصول می‌توانید نوع آسیاب مورد نیاز خود را (مثلاً برای اسپرسوساز خانگی، موکاپات، فرنچ پرس، یا V60) انتخاب کنید تا قهوه متناسب با دستگاه شما آسیاب و وکیوم شود."
      },
      {
        question: "قهوه‌های نئو کافه از کدام کشورها وارد می‌شوند؟",
        answer: "ما از معتبرترین مزارع قهوه جهان در کشورهای برزیل، کلمبیا، اتیوپی، گواتمالا و کاستاریکا دانه‌های سبز را وارد کرده و در ایران با دستگاه‌های پیشرفته و زیر نظر متخصصین، رست می‌کنیم."
      }
    ]
  },
  {
    category: "مرجوعی و پشتیبانی",
    icon: <ShieldCheck className="w-6 h-6" />,
    items: [
      {
        question: "اگر بسته آسیب دیده بود چه کار کنم؟",
        answer: "در صورت وجود هرگونه مشکل فیزیکی در بسته‌بندی یا مغایرت محصول با سفارش شما، لطفاً از بسته عکس بگیرید و در کمتر از ۲۴ ساعت از طریق بخش «ارتباط با پشتیبانی» برای ما ارسال کنید تا کالای جایگزین برای شما ارسال شود."
      },
      {
        question: "آیا امکان لغو یا تغییر سفارش وجود دارد؟",
        answer: "تا زمانی که وضعیت سفارش شما در حالت «در حال پردازش» باشد (یعنی هنوز تحویل پست نشده باشد)، امکان لغو یا تغییر آن از طریق ارتباط با پشتیبانی وجود دارد."
      }
    ]
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#231511] border-b border-[#E3C3A4]/40 dark:border-[#3c2317] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#C68E58 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-[#C68E58]/10">
            <HelpCircle className="w-10 h-10 text-[#C68E58]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A3022] dark:text-[#EAE0D5] mb-6 tracking-tight">
            سوالات متداول
          </h1>
          <p className="text-lg text-[#8C7A6B] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
            پاسخ پرتکرارترین سوالات مشتریان درباره خرید قهوه، ارسال سفارشات و خدمات نئو کافه را در اینجا بخوانید. اگر پاسخ خود را پیدا نکردید، تیم پشتیبانی ما آماده کمک به شماست.
          </p>
        </div>
      </div>

      {/* FAQ Categories & Questions */}
      <div className="container mx-auto px-4 max-w-[900px] mt-16">
        <div className="flex flex-col gap-12">
          
          {FAQ_DATA.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl flex items-center justify-center text-[#C68E58] shadow-sm">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white">
                  {category.category}
                </h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={itemIndex} 
                      className={`bg-white dark:bg-[#231511] rounded-3xl border transition-all duration-300 ${
                        isOpen 
                          ? "border-[#C68E58] shadow-[0_10px_30px_rgba(198,142,88,0.1)] dark:shadow-none" 
                          : "border-[#E3C3A4]/40 dark:border-[#3c2317] hover:border-[#C68E58]/50"
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 text-right focus:outline-none"
                      >
                        <span className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? "text-[#C68E58]" : "text-[#4A3022] dark:text-[#EAE0D5]"}`}>
                          {item.question}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-[#C68E58]/10 text-[#C68E58] rotate-180" : "bg-[#FCF9F5] dark:bg-[#1A0F0C] text-[#8C7A6B]"}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>
                      
                      <div 
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-5 sm:p-6 pt-0 text-sm sm:text-base text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed text-justify border-t border-[#E3C3A4]/10 dark:border-[#3c2317]/50 mt-2">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
        </div>
        
        {/* Support Call-to-action (🚀 FIXED for Dark Mode) */}
        <div className="mt-16 bg-[#C68E58] dark:bg-[#231511] dark:border dark:border-[#3c2317] rounded-[2.5rem] p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-[0_15px_40px_rgba(198,142,88,0.25)] dark:shadow-none transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-[#C68E58]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 dark:bg-[#C68E58]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <MessageSquare className="w-12 h-12 mb-4 opacity-90 dark:text-[#C68E58] dark:opacity-100 transition-colors" />
            <h3 className="text-2xl sm:text-3xl font-black mb-4 dark:text-[#EAE0D5] transition-colors">جواب سوال خود را پیدا نکردید؟</h3>
            <p className="text-white/80 dark:text-[#A1A1A1] max-w-lg mb-8 leading-relaxed font-medium transition-colors">
              نگران نباشید! تیم پشتیبانی نئو کافه به صورت آنلاین آماده پاسخگویی به سوالات، راهنمایی برای خرید و رسیدگی به مشکلات شماست.
            </p>
            <Link 
              href="/support" 
              className="bg-white text-[#C68E58] dark:bg-[#C68E58] dark:text-white hover:bg-[#FCF9F5] dark:hover:bg-[#A87242] px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
            >
              ارتباط با پشتیبانی آنلاین
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}