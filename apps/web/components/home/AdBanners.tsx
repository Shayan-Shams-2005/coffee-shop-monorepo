import Image from "next/image";
import Link from "next/link";

// ==========================================
// ۱. تایپ‌ها (Export شده تا در صورت نیاز جای دیگری استفاده شود)
// ==========================================
export interface BannerData {
  id: string | number;
  href: string;
  imageUrl?: string;
  alt?: string; // برای سئو و دسترسی‌پذیری اضافه شد
}

interface AdBannersProps {
  banners: BannerData[];
}

// ==========================================
// ۲. توابع کمکی (بیرون از کامپوننت برای جلوگیری از ساخت مجدد در حافظه)
// ==========================================
const getGridClasses = (count: number) => {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 3:
      return "grid-cols-1 sm:grid-cols-3";
    case 4:
    default:
      return "grid-cols-2 lg:grid-cols-4";
  }
};

const getAspectRatioClasses = (count: number) => {
  switch (count) {
    case 1:
      return "aspect-[21/6] md:aspect-[21/5]";
    case 2:
      return "aspect-[16/7] md:aspect-[24/9]";
    case 3:
      return "aspect-[16/9]";
    case 4:
    default:
      return "aspect-[4/3] md:aspect-[5/4]";
  }
};

// ==========================================
// ۳. کامپوننت اصلی (Server Component)
// ==========================================
export function AdBanners({ banners }: AdBannersProps) {
  if (!banners?.length) return null;

  const gridClasses = getGridClasses(banners.length);
  const aspectClasses = getAspectRatioClasses(banners.length);

  return (
    <section
      className="my-10 px-4 max-w-[1440px] mx-auto sm:px-6"
      aria-label="بنرهای تبلیغاتی"
    >
      <div className={`grid gap-4 md:gap-5 ${gridClasses}`}>
        {banners.map((banner, index) => {
          // ⚠️ TODO: در محیط پروداکشن، fallback تستی باید حذف شود و فقط از banner.imageUrl استفاده شود
          const testImagePath = `/banners/${(index % 3) + 1}.jpg`;
          const finalImageSrc = banner.imageUrl || testImagePath;

          return (
            <Link
              href={banner.href}
              key={banner.id}
              // 🚀 FIXED: Added the warm latte background gradient to the wrapper
              className={`relative block rounded-[16px] lg:rounded-[20px] overflow-hidden w-full transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:z-10 focus:outline-none focus:ring-2 focus:ring-[#C68E58] bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] ${aspectClasses}`}
              aria-label={banner.alt || `مشاهده پیشنهاد ویژه`}
            >
              <Image
                src={finalImageSrc}
                alt={banner.alt || `بنر تبلیغاتی`}
                fill
                // جادوی پرفورمنس Next.js: دانلود سایز دقیق عکس بر اساس عرض صفحه
                sizes={
                  banners.length === 1
                    ? "100vw"
                    : banners.length === 2
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 640px) 100vw, 33vw"
                }
                // 🚀 FIXED: Added mix-blend-multiply to filter out the white JPG background
                className="object-cover mix-blend-multiply"
                // بنر اول (مخصوصاً اگر تکی باشد) معمولاً در بالای صفحه است و باید سریع‌ترین لود را داشته باشد (LCP)
                priority={index === 0 && banners.length <= 2}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
