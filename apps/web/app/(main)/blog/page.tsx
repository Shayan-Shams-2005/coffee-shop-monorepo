// app/(main)/blog/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  X,
  BookOpen, 
  ArrowLeft 
} from "lucide-react";

// --- Utility: Convert numbers to Farsi ---
const toFarsiNumber = (num: number | string) => {
  if (num === null || num === undefined) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// --- Mock Data: Coffee Blog Posts ---
const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "راهنمای جامع دم‌آوری با فرنچ پرس در خانه",
    excerpt: "فرنچ پرس یکی از محبوب‌ترین و ساده‌ترین روش‌های دم‌آوری قهوه است. در این مقاله به شما یاد می‌دهیم چگونه یک فنجان قهوه بی‌نقص با آن تهیه کنید.",
    category: "آموزش دم‌آوری",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop",
    date: "۲۵ آبان ۱۴۰۲",
    readTime: "۵ دقیقه",
    isFeatured: true,
  },
  {
    id: 2,
    title: "تفاوت قهوه عربیکا و روبوستا؛ کدام بهتر است؟",
    excerpt: "همه چیز درباره دو گونه اصلی دانه‌های قهوه. از تفاوت در طعم و میزان کافئین گرفته تا شرایط کشت و قیمت آن‌ها در بازار جهانی.",
    category: "دانستنی‌های قهوه",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    date: "۱۸ آبان ۱۴۰۲",
    readTime: "۸ دقیقه",
    isFeatured: false,
  },
  {
    id: 3,
    title: "چگونه بهترین دان قهوه را برای دستگاه اسپرسو انتخاب کنیم؟",
    excerpt: "انتخاب دان قهوه مناسب برای دستگاه اسپرسوساز خانگی یا صنعتی می‌تواند تاثیر چشمگیری روی کرما و طعم نهایی شات شما داشته باشد.",
    category: "راهنمای خرید",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    date: "۱۰ آبان ۱۴۰۲",
    readTime: "۶ دقیقه",
    isFeatured: false,
  },
  {
    id: 4,
    title: "تاثیر قهوه بر سلامتی و میزان مجاز مصرف روزانه",
    excerpt: "آیا نوشیدن قهوه برای قلب مضر است؟ در این مقاله با استناد به جدیدترین مقالات علمی، فواید و مضرات مصرف روزانه کافئین را بررسی می‌کنیم.",
    category: "سلامت و تغذیه",
    imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop",
    date: "۲ آبان ۱۴۰۲",
    readTime: "۴ دقیقه",
    isFeatured: false,
  },
  {
    id: 5,
    title: "آموزش لاته آرت برای افراد مبتدی",
    excerpt: "اگر دوست دارید روی قهوه‌های خود طرح‌های زیبا بکشید، این راهنمای قدم به قدم برای فوم‌گیری شیر و اجرای طرح قلب و تولپ به شما کمک می‌کند.",
    category: "آموزش دم‌آوری",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
    date: "۲۸ مهر ۱۴۰۲",
    readTime: "۱۰ دقیقه",
    isFeatured: false,
  },
  {
    id: 6,
    title: "تاریخچه پیدایش قهوه؛ از اتیوپی تا فنجان شما",
    excerpt: "داستان جذاب چوپان اتیوپیایی و بزهایش که منجر به کشف دانه‌های جادویی قهوه شد و مسیر سفر این دانه به سراسر جهان.",
    category: "دانستنی‌های قهوه",
    imageUrl: "https://images.unsplash.com/photo-1495474472201-4443ff43dae8?q=80&w=800&auto=format&fit=crop",
    date: "۱۵ مهر ۱۴۰۲",
    readTime: "۷ دقیقه",
    isFeatured: false,
  }
];

// Extract unique categories from mock data
const CATEGORIES = ["همه", ...Array.from(new Set(MOCK_BLOG_POSTS.map((post) => post.category)))];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  // Filter posts based on local search and category
  const filteredPosts = useMemo(() => {
    let result = MOCK_BLOG_POSTS;

    if (selectedCategory !== "همه") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) => post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300 font-sans" dir="rtl">
      
      {/* Header & Search Section */}
      <div className="bg-white dark:bg-[#1A110F] border-b border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
        <div className="container mx-auto max-w-[1200px] px-4 py-8 lg:py-12">
          
          <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-8 font-bold">
            <Link href="/" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">خانه</Link>
            <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F]" />
            <span className="text-[#3D2616] dark:text-[#EAE0D5] transition-colors">وبلاگ آموزشی</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl lg:text-4xl font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[#C68E58]" />
                مجله آموزشی نئو کافه
              </h1>
              <p className="text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed font-medium">
                جدیدترین مقالات، آموزش‌های دم‌آوری، راهنمای خرید تجهیزات و دانستنی‌های جذاب دنیای قهوه را اینجا بخوانید.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full lg:w-[400px] relative">
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl pr-12 pl-4 text-sm font-medium text-[#4A3022] dark:text-[#EAE0D5] focus:outline-none focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all placeholder:text-[#8C7A6B]/70"
              />
              <Search className="w-5 h-5 text-[#C68E58] absolute right-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        
        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#C68E58] text-white shadow-md"
                  : "bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#8C7A6B] dark:text-[#A1A1A1] hover:border-[#C68E58] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <Search className="w-16 h-16 text-[#E3C3A4] dark:text-[#6A5A4F] mb-4" />
            <h3 className="text-xl font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-2">مقاله‌ای یافت نشد!</h3>
            <p className="text-[#8C7A6B] dark:text-[#A1A1A1]">
              با عبارت «<span className="text-[#C68E58]">{searchQuery}</span>» نتیجه‌ای پیدا نکردیم.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("همه"); }}
              className="mt-6 px-6 py-2.5 bg-[#FCF9F5] dark:bg-[#231511] text-[#C68E58] rounded-xl font-bold hover:bg-[#C68E58] hover:text-white transition-colors"
            >
              نمایش همه مقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id}
                className={`group bg-white dark:bg-[#1A110F] rounded-3xl border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden hover:shadow-[0_15px_40px_rgba(198,142,88,0.12)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col ${
                  index === 0 && selectedCategory === "همه" && !searchQuery ? "md:col-span-2 lg:col-span-2 lg:flex-row" : ""
                }`}
              >
                {/* Image Box */}
                <div className={`relative overflow-hidden ${
                  index === 0 && selectedCategory === "همه" && !searchQuery ? "lg:w-1/2 aspect-video lg:aspect-auto" : "aspect-[4/3]"
                }`}>
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
                <div className={`p-6 sm:p-8 flex flex-col justify-between flex-1 ${
                  index === 0 && selectedCategory === "همه" && !searchQuery ? "lg:w-1/2" : ""
                }`}>
                  <div>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#8C7A6B] dark:text-[#8b796a] mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{toFarsiNumber(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>زمان مطالعه: {toFarsiNumber(post.readTime)}</span>
                      </div>
                    </div>
                    
                    <h2 className={`font-black text-[#2C1E16] dark:text-[#EAE0D5] mb-3 group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors line-clamp-2 ${
                      index === 0 && selectedCategory === "همه" && !searchQuery ? "text-2xl" : "text-lg"
                    }`}>
                      {post.title}
                    </h2>
                    
                    <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm leading-loose line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-[#C68E58] mt-auto">
                    ادامه مطلب
                    <ArrowLeft className="w-4 h-4 translate-x-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}