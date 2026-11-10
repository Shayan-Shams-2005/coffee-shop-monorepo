// components/home/LatestBlogs.tsx
"use client";

import Link from "next/link";
import { BookOpen, Calendar, Clock, ChevronLeft } from "lucide-react";

// --- Utility: Convert numbers to Farsi ---
const toFarsiNumber = (num: number | string) => {
  if (num === null || num === undefined) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// --- Mock Data: 3 Latest Posts ---
const LATEST_POSTS = [
  {
    id: 1,
    title: "راهنمای جامع دم‌آوری با فرنچ پرس در خانه",
    excerpt: "فرنچ پرس یکی از محبوب‌ترین و ساده‌ترین روش‌های دم‌آوری قهوه است. در این مقاله به شما یاد می‌دهیم چگونه یک فنجان قهوه بی‌نقص تهیه کنید.",
    category: "آموزش دم‌آوری",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop",
    date: "۲۵ آبان ۱۴۰۲",
    readTime: "۵ دقیقه",
  },
  {
    id: 2,
    title: "تفاوت قهوه عربیکا و روبوستا؛ کدام بهتر است؟",
    excerpt: "همه چیز درباره دو گونه اصلی دانه‌های قهوه. از تفاوت در طعم و میزان کافئین گرفته تا شرایط کشت و قیمت آن‌ها در بازار جهانی.",
    category: "دانستنی‌های قهوه",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    date: "۱۸ آبان ۱۴۰۲",
    readTime: "۸ دقیقه",
  },
  {
    id: 3,
    title: "چگونه بهترین دان قهوه را برای اسپرسو انتخاب کنیم؟",
    excerpt: "انتخاب دان قهوه مناسب برای دستگاه اسپرسوساز می‌تواند تاثیر چشمگیری روی کرما و طعم نهایی شات شما داشته باشد.",
    category: "راهنمای خرید",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    date: "۱۰ آبان ۱۴۰۲",
    readTime: "۶ دقیقه",
  }
];

export function LatestBlogs() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 my-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCF9F5] dark:bg-[#231511] flex items-center justify-center border border-[#E3C3A4]/30 dark:border-[#3c2317]">
            <BookOpen className="w-5 h-5 text-[#C68E58]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#2C1E16] dark:text-[#EAE0D5]">
              جدیدترین مقالات
            </h2>
            <p className="text-sm font-medium text-[#8C7A6B] dark:text-[#A1A1A1] mt-1 hidden sm:block">
              دانستنی‌ها و آموزش‌های دنیای قهوه
            </p>
          </div>
        </div>
        
        <Link 
          href="/blog" 
          className="flex items-center gap-1 text-sm font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#FFD7BA] transition-colors group"
        >
          مشاهده همه
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LATEST_POSTS.map((post) => (
          <Link 
            href={`/blog/${post.id}`} 
            key={post.id}
            className="group bg-white dark:bg-[#1A110F] rounded-3xl border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden hover:shadow-[0_15px_40px_rgba(198,142,88,0.12)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col"
          >
            {/* Image Box */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#1A1412]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-[#C68E58] shadow-sm">
                {post.category}
              </div>
            </div>

            {/* Content Box */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs font-bold text-[#8C7A6B] dark:text-[#8b796a] mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{toFarsiNumber(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{toFarsiNumber(post.readTime)}</span>
                  </div>
                </div>
                
                <h3 className="font-black text-lg text-[#2C1E16] dark:text-[#EAE0D5] mb-3 group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm leading-loose line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}