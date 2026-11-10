// app/(main)/blog/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User,
  Share2,
  Bookmark,
  ArrowRight
} from "lucide-react";

// --- Utility: Convert numbers to Farsi ---
const toFarsiNumber = (num: number | string) => {
  if (num === null || num === undefined) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// --- Extended Mock Data for Single Post ---
const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "راهنمای جامع دم‌آوری با فرنچ پرس در خانه",
    excerpt: "فرنچ پرس یکی از محبوب‌ترین و ساده‌ترین روش‌های دم‌آوری قهوه است.",
    content: [
      "فرنچ پرس یکی از کلاسیک‌ترین و در عین حال ساده‌ترین ابزارهای دم‌آوری قهوه است که به دلیل غوطه‌وری کامل سابه‌های قهوه در آب، یک فنجان قهوه با بادی (Body) پر و طعم‌های قوی به شما تحویل می‌دهد.",
      "برای شروع، بهتر است از قهوه‌هایی با رست متوسط تا تیره استفاده کنید. درجه آسیاب قهوه برای فرنچ پرس باید درشت (Coarse) باشد، شبیه به نمک دریایی. اگر قهوه را خیلی ریز آسیاب کنید، از فیلتر فلزی عبور کرده و قهوه‌تان لرد دار و تلخ می‌شود.",
      "نسبت استاندارد دم‌آوری (Brew Ratio) معمولاً ۱ به ۱۵ است. یعنی به ازای هر ۱ گرم قهوه، ۱۵ گرم آب استفاده کنید. آب را به جوش بیاورید و حدود ۳۰ ثانیه صبر کنید تا دمای آن به ۹۳ درجه سانتی‌گراد برسد. سپس آب را به آرامی روی قهوه‌ها بریزید و ۴ دقیقه زمان بدهید.",
      "پس از ۴ دقیقه، پیستون را به آرامی به پایین فشار دهید. قهوه شما آماده است! بلافاصله آن را در فنجان بریزید تا از عصاره‌گیری بیش از حد و تلخ شدن قهوه جلوگیری کنید."
    ],
    category: "آموزش دم‌آوری",
    author: "تیم محتوای نئو کافه",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop",
    date: "۲۵ آبان ۱۴۰۲",
    readTime: "۵ دقیقه",
  },
  {
    id: 2,
    title: "تفاوت قهوه عربیکا و روبوستا؛ کدام بهتر است؟",
    excerpt: "همه چیز درباره دو گونه اصلی دانه‌های قهوه.",
    content: [
      "بسیاری از کسانی که تازه وارد دنیای قهوه می‌شوند، با دو نام عربیکا و روبوستا مواجه می‌شوند. اما تفاوت واقعی این دو چیست؟",
      "دانه‌های عربیکا معمولاً طعمی ملایم‌تر، شیرین‌تر و اسیدیته (ترشی) دلپذیرتری دارند. در طعم‌یادهای عربیکا اغلب نت‌های میوه‌ای، گلی و شکلاتی حس می‌شود. از سوی دیگر، روبوستا طعمی قوی‌تر، تلخ‌تر و خاکی دارد.",
      "کافئین موجود در روبوستا تقریباً دو برابر عربیکا است! به همین دلیل در بسیاری از قهوه‌های تجاری و ترکیب‌های اسپرسو برای ایجاد کرمای غلیظ‌تر و کافئین بالاتر از مقداری روبوستا استفاده می‌شود.",
      "در نهایت هیچ‌کدام مطلقاً «بهتر» از دیگری نیست؛ انتخاب بین این دو کاملاً به سلیقه شما و هدف شما از نوشیدن قهوه بستگی دارد."
    ],
    category: "دانستنی‌های قهوه",
    author: "علی رضایی",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
    date: "۱۸ آبان ۱۴۰۲",
    readTime: "۸ دقیقه",
  },
  // Add fallback content for others
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<typeof MOCK_BLOG_POSTS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate backend fetch based on ID
    const fetchPost = () => {
      const postId = Number(params.id);
      const foundPost = MOCK_BLOG_POSTS.find(p => p.id === postId);
      
      // If we only have 2 full mock posts above, fallback for the rest:
      if (!foundPost) {
        setPost({
          id: postId,
          title: "مقاله‌ای در حال به‌روزرسانی...",
          excerpt: "این مقاله در حال ویرایش و تکمیل است.",
          content: ["به زودی محتوای کامل این بخش در دسترس قرار خواهد گرفت. از شکیبایی شما سپاسگزاریم."],
          category: "عمومی",
          author: "نئو کافه",
          imageUrl: "https://images.unsplash.com/photo-1495474472201-4443ff43dae8?q=80&w=1200&auto=format&fit=crop",
          date: "امروز",
          readTime: "۱ دقیقه",
        });
      } else {
        setPost(foundPost);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A1412] min-h-screen pb-20 transition-colors duration-300 font-sans" dir="rtl">
      
      {/* Header / Breadcrumb */}
      <div className="bg-white dark:bg-[#1A110F] border-b border-[#F5EFE6] dark:border-[#3c2317] transition-colors">
        <div className="container mx-auto max-w-[900px] px-4 py-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8C7A6B] dark:text-[#ba8d71]">
            <Link href="/" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">خانه</Link>
            <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F] shrink-0" />
            <Link href="/blog" className="hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-colors">وبلاگ آموزشی</Link>
            <ChevronLeft className="w-3 h-3 text-[#D1C8B8] dark:text-[#6A5A4F] shrink-0" />
            <span className="text-[#3D2616] dark:text-[#EAE0D5] truncate max-w-[200px] sm:max-w-none transition-colors">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto max-w-[900px] px-4 py-8 lg:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-[#8C7A6B] hover:text-[#C68E58] dark:text-[#A1A1A1] dark:hover:text-[#FFD7BA] transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4" /> بازگشت به مقالات
        </button>

        {/* Title & Meta */}
        <div className="mb-8">
          <div className="inline-block bg-[#FCF9F5] dark:bg-[#231511] text-[#C68E58] px-3 py-1.5 rounded-lg text-xs font-bold mb-4 border border-[#E3C3A4]/30 dark:border-[#3c2317]">
            {post.category}
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-[#2C1E16] dark:text-[#EAE0D5] leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-[#8C7A6B] dark:text-[#8b796a]">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#C68E58]" />
              <span>{post.author}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#D1C8B8] dark:bg-[#3c2317]"></div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C68E58]" />
              <span>{toFarsiNumber(post.date)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#D1C8B8] dark:bg-[#3c2317]"></div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C68E58]" />
              <span>{toFarsiNumber(post.readTime)} مطالعه</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-sm border border-[#F5EFE6] dark:border-[#3c2317]">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-6 md:p-10 shadow-sm transition-colors">
          <div className="prose prose-lg dark:prose-invert max-w-none text-[#4A3022] dark:text-[#EAE0D5] leading-loose text-justify font-medium">
            <p className="text-xl font-bold text-[#2C1E16] dark:text-white mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            {post.content.map((paragraph, index) => (
              <p key={index} className="mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share & Actions */}
          <div className="mt-12 pt-6 border-t border-[#F5EFE6] dark:border-[#3c2317] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">اشتراک‌گذاری:</span>
              <button className="w-10 h-10 rounded-full bg-[#FCF9F5] dark:bg-[#231511] flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#E3C3A4]/20 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#FCF9F5] dark:bg-[#231511] text-[#8C7A6B] hover:text-[#C68E58] border border-[#F5EFE6] dark:border-[#3c2317] hover:border-[#C68E58] transition-all">
              <Bookmark className="w-4 h-4" /> ذخیره مقاله
            </button>
          </div>
        </div>

      </article>
    </div>
  );
}