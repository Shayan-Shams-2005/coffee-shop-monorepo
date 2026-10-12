import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
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
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="font-sans min-h-screen flex flex-col antialiased bg-[#FCF9F5] text-[#2C1E16] dark:bg-[#1A1412] dark:text-[#E3C3A4] transition-colors duration-300"
      >
        {children}
      </body>
    </html>
  );
}