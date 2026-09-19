import Link from "next/link";
import { quickLinksData } from "../../config/quick-links"; // ایمپورت دیتا

export function QuickLinks() {
  return (
    <section className="my-6 md:my-8 w-full" aria-label="لینک‌های دسترسی سریع">
      {/* 
        🚀 تغییر مهندسی: 
        استفاده از تگ <nav> به جای <div> به گوگل می‌فهماند که این بخش، 
        یک منوی ناوبری مهم در صفحه است (عالی برای سئو).
      */}
      <nav className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-5 md:gap-y-6 gap-x-2 md:gap-x-4 px-4 max-w-[1440px] mx-auto items-start justify-items-center">
        {quickLinksData.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              href={link.href}
              key={link.id}
              className="flex flex-col items-center gap-2 w-[80px] md:w-[100px] group"
              // برای کاربرانی که با کیبورد کار می‌کنند
              title={`رفتن به دسته‌بندی ${link.title}`}
            >
              {/* 🚀 FIXED: Made the dark mode buttons lighter, with a shiny gradient and an inner top highlight! */}
              <div
                className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 
                              bg-[#FFF9F2] border border-[#E8DCCB] text-[#5C4033] group-hover:shadow-[0_6px_15px_rgba(92,64,51,0.1)] group-hover:border-[#D4A373]
                              dark:bg-gradient-to-b dark:from-[#4A2E1B] dark:to-[#2A180E] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.4)] dark:group-hover:from-[#5A3822] dark:group-hover:to-[#362013] dark:group-hover:border-[#C68E58] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_15px_rgba(198,142,88,0.25)]"
              >
                {/* 
                  🚀 ویژگی aria-hidden="true" اضافه شد تا صفحه‌خوان‌های نابینایان
                  کدهای نامفهوم آیکون را نخوانند.
                */}
                <Icon
                  className="w-6 h-6 md:w-[28px] md:h-[28px] transition-colors"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              <span
                className="text-[11px] md:text-[13px] text-center font-bold leading-snug transition-colors
                               text-[#5C4033] group-hover:text-[#D4A373]
                               dark:text-[#F3E8E0] dark:group-hover:text-[#C68E58]"
              >
                {link.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
