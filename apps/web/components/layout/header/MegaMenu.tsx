"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, LayoutGrid } from "lucide-react";
import { megaMenuCategories } from "../../../config/menu"; // ایمپورت دیتای استخراج شده

export function MegaMenu() {
  const [activeTab, setActiveTab] = useState<string>(
    megaMenuCategories[0]?.id || "",
  );

  return (
    <div className="group h-full flex items-center relative">
      {/* 🚀 دکمه اصلی مگامنو (استایل مشابه سبد خرید) */}
      <button
        className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-full transition-all
                         bg-white border border-[#D4A373] text-[#2C1E16] hover:shadow-[0_4px_15px_rgba(212,163,115,0.15)]
                         dark:bg-[#231511] dark:border-[#3c2317] dark:text-[#E3C3A4] dark:hover:border-[#C68E58] dark:hover:shadow-[0_4px_15px_rgba(198,142,88,0.15)] font-bold"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white transition-colors
                        bg-[#D4A373] group-hover:bg-[#C29262]
                        dark:bg-[#754e35] dark:group-hover:bg-[#C68E58]"
        >
          <LayoutGrid className="w-4 h-4" />
        </div>
        <span className="text-sm pt-0.5">دسته‌بندی کالاها</span>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 
                                text-[#D4A373] dark:text-[#C68E58]"
        />
      </button>

      {/* باکس دراپ‌داون مگامنو */}
      <div
        dir="rtl"
        className="absolute top-[60px] right-0 w-[1100px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-bl-[32px] rounded-br-[32px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex overflow-hidden transform origin-top group-hover:scale-y-100 scale-y-95
                   bg-white border border-[#F0EBE1]
                   dark:bg-[#231511] dark:border-[#3c2317] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        {/* ================= ستون راست (لیست تب‌ها) ================= */}
        <div
          className="w-[230px] shrink-0 py-4 flex flex-col
                        bg-[#FDFCFB] border-l border-[#F0EBE1]
                        dark:bg-[#1A1412] dark:border-l-[#3c2317]"
        >
          {megaMenuCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveTab(cat.id)}
              className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-all font-bold border-r-[3px] ${
                activeTab === cat.id
                  ? "bg-white border-[#D4A373] text-[#2C1E16] shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 dark:bg-[#231511] dark:border-[#C68E58] dark:text-white"
                  : "text-[#5A4A42] hover:bg-[#F9F8F6] hover:text-[#4A3022] border-transparent dark:text-[#ba8d71] dark:hover:bg-[#3c2317] dark:hover:text-[#E3C3A4]"
              }`}
            >
              <span className="text-[13px]">{cat.title}</span>
              <ChevronLeft
                className={`w-3.5 h-3.5 transition-colors ${
                  activeTab === cat.id
                    ? "text-[#D4A373] dark:text-[#C68E58]"
                    : "text-[#D4A373]/30 dark:text-[#C68E58]/30"
                }`}
              />
            </div>
          ))}

          {/* لینک ویژه پایین منو */}
          <div className="mt-auto pt-2 border-t border-[#F0EBE1] dark:border-[#3c2317]">
            <Link
              href="/wholesale"
              className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold transition-colors
                         text-[#2C1E16] hover:text-[#D4A373] hover:bg-[#F9F8F6]
                         dark:text-[#E3C3A4] dark:hover:text-[#C68E58] dark:hover:bg-[#3c2317]"
            >
              🏢 خرید عمده و سازمانی
            </Link>
          </div>
        </div>

        {/* ================= ستون چپ (محتوای مگامنو) ================= */}
        <div className="flex-1 min-h-[550px] relative bg-white dark:bg-[#231511]">
          {megaMenuCategories.map((cat) => (
            <div
              key={`content-${cat.id}`}
              className={`p-10 w-full transition-opacity duration-300 ${
                activeTab === cat.id
                  ? "block opacity-100 z-10"
                  : "hidden opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* عنوان تب */}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F0EBE1] dark:border-[#3c2317]">
                <div className="w-1.5 h-6 bg-[#D4A373] dark:bg-[#C68E58] rounded-full"></div>
                <h2 className="text-xl font-black text-[#2C1E16] dark:text-white">
                  {cat.title}
                </h2>
              </div>

              {/* چیدمان دقیقاً از راست به چپ (Masonry دستی با فیلتر آرایه) */}
              <div className="flex gap-8 w-full">
                {[0, 1, 2].map((colIndex) => {
                  const colSections = cat.sections?.filter(
                    (_, idx) => idx % 3 === colIndex,
                  );

                  return (
                    <div key={colIndex} className="flex-1 flex flex-col gap-10">
                      {colSections?.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <h3 className="font-black text-[15px] flex items-center gap-2 text-[#4A3022] dark:text-[#E3C3A4]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]/50 dark:bg-[#C68E58]/50"></div>
                            {section.title}
                          </h3>

                          <ul className="flex flex-col gap-3">
                            {section.items?.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link
                                  href="/shop"
                                  className="text-[13px] font-medium transition-colors flex items-center gap-2 group/link
                                             text-[#8C7A6B] hover:text-[#D4A373]
                                             dark:text-[#ba8d71] dark:hover:text-[#C68E58]"
                                >
                                  <span
                                    className="w-1 h-1 rounded-full transition-colors
                                                   bg-gray-200 group-hover/link:bg-[#D4A373]
                                                   dark:bg-[#3c2317] dark:group-hover/link:bg-[#C68E58]"
                                  ></span>
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
