// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { Coffee, Percent } from "lucide-react";
import { siteConfig } from "../../../config/site";
import { MegaMenu } from "./MegaMenu";
import { CartButton } from "./CartButton";
import { AuthButton } from "./AuthButton";
import { ThemeCoffeeToggle } from "../../../components/ThemeCoffeeToggle";
import { SearchDropdown } from "../../search/SearchDropdown"; // 🚀 Import the Dropdown

export function Navbar() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-[#FCF9F5]/95 dark:bg-[#1A1412]/95 backdrop-blur-md border-b border-[#E3C3A4]/30 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-2 sm:px-4 h-20 flex items-center justify-between">
          
          {/* ================= Right (Menus) ================= */}
          <div className="flex-1 flex items-center justify-start gap-2 xl:gap-5 h-full overflow-visible">
            <MegaMenu />
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4 text-[#3D2616] dark:text-[#E3C3A4] font-medium text-[11px] xl:text-[14px] whitespace-nowrap">
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
                  {link.isOffer && <Percent className="w-3.5 h-3.5" />}
                  <span className="pt-1">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* ================= Center (Logo) ================= */}
          <div className="shrink-0 flex justify-center px-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 text-[#2C1E16] dark:text-white hover:text-[#C68E58] transition-colors"
            >
              <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-[#C68E58]" />
              <span className="text-xl sm:text-2xl font-black tracking-tight pt-1 whitespace-nowrap">
                نئو کافه
              </span>
            </Link>
          </div>

          {/* ================= Left (Tools) ================= */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 text-[#2C1E16] dark:text-white">
            <ThemeCoffeeToggle />

            {/* 🚀 Replace the simple button with the SearchDropdown */}
            <SearchDropdown />

            <AuthButton />

            <div className="w-px h-6 bg-[#E3C3A4]/50 mx-0.5 sm:mx-1 hidden sm:block"></div>

            <CartButton />
          </div>
          
        </div>
      </header>

      <div className="h-20 w-full shrink-0"></div>
    </>
  );
}