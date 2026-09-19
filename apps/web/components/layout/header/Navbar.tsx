"use client";

import Link from "next/link";
import { Search, Coffee, Percent } from "lucide-react";
import { siteConfig } from "../../../config/site";
import { MegaMenu } from "./MegaMenu";
import { CartButton } from "./CartButton";
import { AuthButton } from "./AuthButton";
import { ThemeCoffeeToggle } from "../../../components/ThemeCoffeeToggle"; // 🚀 Import the new toggle!

export function Navbar() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-[#FCF9F5]/95 dark:bg-[#1A1412]/95 backdrop-blur-md border-b border-[#E3C3A4]/30 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
          {/* ================= سمت راست (منوها) ================= */}
          <div className="flex items-center gap-6 xl:gap-8 h-full">
            <MegaMenu />
            <nav className="hidden lg:flex items-center gap-6 text-[#3D2616] dark:text-[#E3C3A4] font-medium">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`hover:text-[#C68E58] transition-colors flex items-center gap-1 ${
                    link.isOffer
                      ? "text-[#D95D39] hover:text-[#C44536] font-bold"
                      : ""
                  }`}
                >
                  {link.isOffer && <Percent className="w-4 h-4" />}
                  <span className="pt-1">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* ================= وسط (لوگو) ================= */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-[#2C1E16] dark:text-white hover:text-[#C68E58] transition-colors z-10"
          >
            <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-[#C68E58]" />
            <span className="text-xl sm:text-2xl font-black tracking-tight pt-1">
              نئو کافه
            </span>
          </Link>

          {/* ================= سمت چپ (ابزارها) ================= */}
          <div className="flex items-center gap-2 sm:gap-4 text-[#2C1E16] dark:text-white">
            {/* 🚀 FIXED: Replaced standard button with our animated Coffee Toggle! */}
            <ThemeCoffeeToggle />

            <button
              className="p-2 hover:bg-[#E3C3A4]/20 rounded-full transition-colors hidden sm:block"
              aria-label="جستجو"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <AuthButton />

            <div className="w-px h-6 bg-[#E3C3A4]/50 mx-1 hidden sm:block"></div>

            <CartButton />
          </div>
        </div>
      </header>

      <div className="h-20 w-full shrink-0"></div>
    </>
  );
}
