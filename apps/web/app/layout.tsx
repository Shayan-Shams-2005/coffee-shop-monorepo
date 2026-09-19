import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Navbar } from "../components/layout/header/Navbar";
import { Footer } from "../components/layout/footer/Footer";

// نیازی به ایمپورت Contextها نیست!
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "نئو کافه | فروشگاه تخصصی قهوه",
  description: "خرید بهترین دانه‌های قهوه اسپرسو و ابزار دم‌آوری",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        // 🚀 FIXED: Added global backgrounds, text colors, and smooth transitions!
        className="font-sans min-h-screen flex flex-col antialiased bg-[#FCF9F5] text-[#2C1E16] dark:bg-[#1A1412] dark:text-[#E3C3A4] transition-colors duration-300"
      >
        {/* هدر سایت */}
        <Navbar />

        {/* 
          محدودیت عرض (max-w) حذف شد تا هر صفحه بتواند بنرهای تمام‌عرض داشته باشد.
          تنظیم کانتینرها را به خود صفحات سپردیم.
        */}
        <main className="flex-1 flex flex-col w-full">{children}</main>

        {/* فوتر سایت */}
        <Footer />
      </body>
    </html>
  );
}
