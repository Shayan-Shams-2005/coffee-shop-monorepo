import Link from "next/link";
import { ShoppingCart, User, Coffee } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-coffee-100/80 backdrop-blur-md border-b border-coffee-400/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* لوگو و نام فروشگاه */}
        <Link
          href="/"
          className="flex items-center gap-2 text-coffee-900 hover:text-coffee-600 transition-colors"
        >
          <Coffee className="w-8 h-8" />
          <span className="text-xl font-bold">نئو کافه</span>
        </Link>

        {/* لینک‌های اصلی (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-coffee-800 font-medium">
          <Link href="/shop" className="hover:text-accent transition-colors">
            فروشگاه
          </Link>
          <Link
            href="/categories"
            className="hover:text-accent transition-colors"
          >
            دسته‌بندی‌ها
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            درباره ما
          </Link>
        </nav>

        {/* دکمه‌های کاربری */}
        <div className="flex items-center gap-4 text-coffee-900">
          <Link
            href="/cart"
            className="p-2 hover:bg-coffee-400/10 rounded-full transition-colors relative"
            aria-label="سبد خرید"
          >
            <ShoppingCart className="w-6 h-6" />
            {/* نشانگر تعداد آیتم در سبد خرید (فعلا استاتیک) */}
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">
              ۲
            </span>
          </Link>

          <Link
            href="/profile"
            className="p-2 hover:bg-coffee-400/10 rounded-full transition-colors"
            aria-label="حساب کاربری"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
