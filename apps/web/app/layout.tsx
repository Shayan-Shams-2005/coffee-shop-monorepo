import type { Metadata } from "next";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import "./globals.css";

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
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased bg-coffee-100 min-h-screen flex flex-col">
        <Navbar />

        {/* محتوای متغیر صفحات اینجا قرار می‌گیرد */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
