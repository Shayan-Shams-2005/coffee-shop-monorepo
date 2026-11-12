// apps/web/components/home/QuickLinks.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, X, ChevronLeft } from "lucide-react";
import { quickLinksData } from "../../config/quick-links"; 

// 🚀 تعریف دقیق تایپ‌ها برای مگامنو جهت رفع خطای TypeScript
export interface MenuSection {
  title: string;
  items: string[];
}

export interface MenuCategory {
  id: string;
  title: string;
  sections: MenuSection[];
}

// 🚀 دیتای کامل دسته‌بندی‌ها برای نمایش در مودال «مشاهده همه»
export const megaMenuCategories: MenuCategory[] = [
  {
    id: "coffee-types",
    title: "قهوه (ترکیبی و دمی)",
    sections: [
      {
        title: "قهوه اسپرسو",
        items: [
          "پیشنهاد شده برای اسپرسو",
          "پیشنهادات ترکیبی",
          "کافئین بالا",
          "تلخ ترین",
          "خیلی تلخ نباشه",
          "بدون ترشی",
        ],
      },
      {
        title: "قهوه فرانسه",
        items: [
          "پیشنهاد شده برای فرانسه",
          "عطری و گلی میوه ای",
          "کافئین بالا",
          "خیلی تلخ نباشه",
          "بدون ترشی",
        ],
      },
      {
        title: "قهوه ترک",
        items: [
          "قهوه ترک تازه دارک فول کافئین",
          "قهوه ترک تازه مدیوم",
          "قهوه ترک روبوستا لایت",
        ],
      },
      {
        title: "قهوه دمی",
        items: ["پیشنهاد شده برای دمی", "اسپشیالیتی", "پریمیوم", "اقتصادی"],
      },
      {
        title: "قهوه های ترکیبی",
        items: [
          "۱۰۰٪ عربیکا",
          "۷۰٪ عربیکا ۳۰٪ روبوستا",
          "۵۰٪ عربیکا ۵۰٪ روبوستا",
          "۴۰٪ عربیکا ۶۰٪ روبوستا",
          "۳۰٪ عربیکا ۷۰٪ روبوستا",
          "۱۰۰٪ روبوستا",
        ],
      },
      {
        title: "نوع دان و ویژگی‌ها",
        items: [
          "قهوه عربیکا",
          "قهوه روبوستا",
          "قهوه های اسپشیالیتی",
          "قهوه های پرمیوم",
          "پرکافئین ها و تلخ ها",
          "قهوه سبز (خام)",
        ],
      },
    ],
  },
  {
    id: "single-origin",
    title: "قهوه تک خاستگاه، غیرترکیبی",
    sections: [
      {
        title: "آمریکای لاتین",
        items: [
          "برزیل",
          "کلمبیا",
          "گواتمالا",
          "السالوادور",
          "پرو",
          "هندوراس",
          "سانتوس سرادو",
        ],
      },
      {
        title: "آفریقا",
        items: [
          "اتیوپی",
          "کنیا",
          "اوگاندا",
          "کامرون",
          "ساحل عاج",
          "اسپشیالیتی یرگاچف",
        ],
      },
      {
        title: "آسیا و سایر",
        items: ["سوماترا", "اندونزی", "ویتنام", "هند", "قهوه دیکف"],
      },
    ],
  },
  {
    id: "instant-capsule",
    title: "کپسول و قهوه فوری",
    sections: [
      {
        title: "قهوه فوری",
        items: [
          "گلد برزیل",
          "کلاسیک هند",
          "گلد اکوادور",
          "اسپرسو فوری",
          "کاکائودارها",
        ],
      },
      {
        title: "کپسول قهوه",
        items: ["کپسول قهوه مشکی", "کپسول قهوه سبز"],
      },
    ],
  },
  {
    id: "tea-powders",
    title: "چای و محصولات پودری",
    sections: [
      {
        title: "چای ها",
        items: [
          "چای گل",
          "چای ماسالا",
          "چای کرک",
          "چای سبز",
          "چای سفید",
          "چای ساشه ای",
        ],
      },
      {
        title: "محصولات پودری و افزودنی",
        items: ["هات شکلات", "کافی میت", "پودر کاکائو"],
      },
    ],
  },
  {
    id: "coffee-makers",
    title: "قهوه ساز ها",
    sections: [
      {
        title: "دستگاهی و برقی",
        items: [
          "اسپرسوساز برقی",
          "قهوه ساز فرانسه",
          "قهوه ساز کپسولی",
          "قهوه جوش خانگی",
        ],
      },
      {
        title: "دم‌آوری دستی (غوطه‌وری و فیلتری)",
        items: ["فرنچ پرس", "کمکس", "V60", "سایفون", "ایروپرس", "نانوپرسو"],
      },
      {
        title: "دم‌آوری سنتی و مسافرتی",
        items: ["موکاپات", "قهوه جوش ترک", "قهوه ساز مسافرتی"],
      },
    ],
  },
  {
    id: "accessories",
    title: "اکسسوری و ابزار دم آوری",
    sections: [
      {
        title: "ابزار باریستا و بارتندر",
        items: ["مادلر", "استرینر", "شیکر قهوه", "جیجر", "بارمت", "تال اسپون"],
      },
      {
        title: "ابزار اسپرسو ماشین",
        items: [
          "تمپ مت",
          "فانل",
          "لوازم نظافت",
          "نیدل",
          "پورتا فیلتر",
          "ناک باکس",
          "پاک اسکرین",
          "تمپر",
          "کف ساز شیر",
          "پیچر شیر",
        ],
      },
      {
        title: "ترازو و فیلتر",
        items: [
          "ترازو قهوه",
          "فیلتر قهوه ساز فرانسه",
          "فیلتر سایفون",
          "فیلتر V60",
        ],
      },
      {
        title: "آسیاب قهوه",
        items: ["آسیاب قهوه برقی", "آسیاب قهوه دستی"],
      },
    ],
  },
  {
    id: "serve-ware",
    title: "ظروف پذیرایی",
    sections: [
      {
        title: "انواع ماگ",
        items: ["ماگ سرامیکی", "ماگ استیل", "ماگ مسافرتی"],
      },
      {
        title: "انواع فنجان",
        items: ["فنجان اسپرسو", "فنجان لانگو", "فنجان نسپرسو", "فنجان چای"],
      },
      {
        title: "سرو و پذیرایی",
        items: ["لیوان باریستا", "قاشق کاپینگ", "بشقاب", "سینی سرو"],
      },
    ],
  },
  {
    id: "brands",
    title: "برند ها",
    sections: [
      {
        title: "برندهای محبوب قهوه",
        items: [
          "استارباکس",
          "ایلی",
          "لاوازا",
          "جاکوبز",
          "نسپرسو",
          "نسکافه",
          "دولچه گوستو",
          "دیویدوف",
          "مولیناری",
          "سگافردو زانتی",
        ],
      },
      {
        title: "سایر برندهای قهوه",
        items: [
          "علی‌کافه",
          "تورابیکا",
          "مزتا",
          "نستله",
          "بلمیو",
          "تیمز",
          "جنوا",
          "موونا",
          "توگنانا",
        ],
      },
      {
        title: "برندهای تجهیزات و اکسسوری",
        items: ["بیالتی", "هاریو", "واکاکو", "استنلی", "اسمگ", "کاراجا", "گتر"],
      },
    ],
  },
];

const DEFAULT_THEME = {
  light: "bg-amber-50 border-amber-200 text-amber-600 group-hover:border-amber-400 group-hover:shadow-[0_4px_10px_rgba(217,119,6,0.15)]",
  dark: "dark:from-[#451A03] dark:to-[#290F02] dark:border-[#78350F] dark:text-[#FDE68A]",
  darkHover: "dark:group-hover:from-[#78350F] dark:group-hover:border-[#F59E0B] dark:group-hover:text-[#FEF3C7] dark:group-hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)]",
  textHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
};

const ITEM_COLORS = [
  DEFAULT_THEME,
  {
    light: "bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:border-emerald-400 group-hover:shadow-[0_4px_10px_rgba(16,185,129,0.15)]",
    dark: "dark:from-[#022C22] dark:to-[#021A14] dark:border-[#065F46] dark:text-[#A7F3D0]",
    darkHover: "dark:group-hover:from-[#065F46] dark:group-hover:border-[#10B981] dark:group-hover:text-[#D1FAE5] dark:group-hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)]",
    textHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  },
  {
    light: "bg-rose-50 border-rose-200 text-rose-600 group-hover:border-rose-400 group-hover:shadow-[0_4px_10px_rgba(225,29,72,0.15)]",
    dark: "dark:from-[#4C0519] dark:to-[#2E030F] dark:border-[#881337] dark:text-[#FECDD3]",
    darkHover: "dark:group-hover:from-[#881337] dark:group-hover:border-[#F43F5E] dark:group-hover:text-[#FFE4E6] dark:group-hover:shadow-[0_4px_12px_rgba(244,63,94,0.25)]",
    textHover: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
  },
  {
    light: "bg-blue-50 border-blue-200 text-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_4px_10px_rgba(37,99,235,0.15)]",
    dark: "dark:from-[#172554] dark:to-[#0F172A] dark:border-[#1E40AF] dark:text-[#BFDBFE]",
    darkHover: "dark:group-hover:from-[#1E40AF] dark:group-hover:border-[#3B82F6] dark:group-hover:text-[#DBEAFE] dark:group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)]",
    textHover: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  },
  {
    light: "bg-purple-50 border-purple-200 text-purple-600 group-hover:border-purple-400 group-hover:shadow-[0_4px_10px_rgba(147,51,234,0.15)]",
    dark: "dark:from-[#3B0764] dark:to-[#280547] dark:border-[#581C87] dark:text-[#E9D5FF]",
    darkHover: "dark:group-hover:from-[#581C87] dark:group-hover:border-[#9333EA] dark:group-hover:text-[#F3E8FF] dark:group-hover:shadow-[0_4px_12px_rgba(147,51,234,0.25)]",
    textHover: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
  },
  {
    light: "bg-orange-50 border-orange-200 text-orange-600 group-hover:border-orange-400 group-hover:shadow-[0_4px_10px_rgba(234,88,12,0.15)]",
    dark: "dark:from-[#431407] dark:to-[#2A0C04] dark:border-[#7C2D12] dark:text-[#FED7AA]",
    darkHover: "dark:group-hover:from-[#7C2D12] dark:group-hover:border-[#F97316] dark:group-hover:text-[#FFEDD5] dark:group-hover:shadow-[0_4px_12px_rgba(249,115,22,0.25)]",
    textHover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
  },
  {
    light: "bg-teal-50 border-teal-200 text-teal-600 group-hover:border-teal-400 group-hover:shadow-[0_4px_10px_rgba(13,148,136,0.15)]",
    dark: "dark:from-[#042F2E] dark:to-[#021A1A] dark:border-[#0F766E] dark:text-[#99F6E4]",
    darkHover: "dark:group-hover:from-[#0F766E] dark:group-hover:border-[#14B8A6] dark:group-hover:text-[#CCFBF1] dark:group-hover:shadow-[0_4px_12px_rgba(20,184,166,0.25)]",
    textHover: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
  },
  {
    light: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 group-hover:border-fuchsia-400 group-hover:shadow-[0_4px_10px_rgba(217,70,239,0.15)]",
    dark: "dark:from-[#4A044E] dark:to-[#2D0230] dark:border-[#701A75] dark:text-[#F5D0FE]",
    darkHover: "dark:group-hover:from-[#701A75] dark:group-hover:border-[#D946EF] dark:group-hover:text-[#FAE8FF] dark:group-hover:shadow-[0_4px_12px_rgba(217,70,239,0.25)]",
    textHover: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
  }
];

export function QuickLinks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  let hasViewAllInConfig = false;

  return (
    <section className="mt-8 mb-12 w-full" aria-label="لینک‌های دسترسی سریع">
      
      {/* ----------------- لیست اسکرول افقی اصلی ----------------- */}
      <nav 
        className="flex flex-nowrap items-start justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 overflow-x-auto hide-scrollbar max-w-[1440px] mx-auto px-4 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {quickLinksData.map((link, index) => {
          const Icon = link.icon;
          const theme = ITEM_COLORS[index % ITEM_COLORS.length] ?? DEFAULT_THEME;
          
          const isViewAll = link.title === "مشاهده همه" || link.href === "/all" || String(link.id) === "all";
          if (isViewAll) hasViewAllInConfig = true;

          const InnerContent = (
            <>
              <div
                className={`w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 border 
                            dark:bg-gradient-to-b dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]
                            ${theme.light} ${theme.dark} ${theme.darkHover}`}
              >
                <Icon
                  className="w-5 h-5 md:w-6 md:h-6 transition-colors"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              <span
                className={`text-[10px] md:text-[11px] text-center font-bold leading-snug transition-colors 
                            text-[#5C4033] dark:text-[#EAE0D5] ${theme.textHover}`}
              >
                {link.title}
              </span>
            </>
          );

          if (isViewAll) {
            return (
              <button
                key={link.id}
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center gap-2 sm:gap-2.5 w-[65px] md:w-[75px] shrink-0 group cursor-pointer"
                title="مشاهده همه دسته‌بندی‌ها"
              >
                {InnerContent}
              </button>
            );
          }

          return (
            <Link
              href={link.href}
              key={link.id}
              className="flex flex-col items-center gap-2 sm:gap-2.5 w-[65px] md:w-[75px] shrink-0 group"
              title={`رفتن به دسته‌بندی ${link.title}`}
            >
              {InnerContent}
            </Link>
          );
        })}

        {!hasViewAllInConfig && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 sm:gap-2.5 w-[65px] md:w-[75px] shrink-0 group cursor-pointer"
            title="مشاهده همه دسته‌بندی‌ها"
          >
            <div
              className={`w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 border 
                          dark:bg-gradient-to-b dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]
                          ${DEFAULT_THEME.light} ${DEFAULT_THEME.dark} ${DEFAULT_THEME.darkHover}`}
            >
              <LayoutGrid
                className="w-5 h-5 md:w-6 md:h-6 transition-colors"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <span
              className={`text-[10px] md:text-[11px] text-center font-bold leading-snug transition-colors 
                          text-[#5C4033] dark:text-[#EAE0D5] ${DEFAULT_THEME.textHover}`}
            >
              مشاهده همه
            </span>
          </button>
        )}
        
        <div className="w-1 shrink-0" aria-hidden="true"></div>
      </nav>

      {/* ----------------- پنجره مودال کل دسته‌بندی‌ها ----------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 dir-rtl">
          
          <div className="bg-[#FCF9F5] dark:bg-[#1A110F] w-full max-w-6xl h-full md:h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* هدر مودال */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#E3C3A4]/30 dark:border-[#3c2317]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-[#C68E58] rounded-full"></div>
                <h3 className="text-lg md:text-xl font-black text-[#3D2616] dark:text-white">
                  تمام دسته‌بندی‌های نئو کافه
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                aria-label="بستن"
              >
                <X className="w-6 h-6 text-[#5C4033] dark:text-[#EAE0D5] group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* بدنه مودال (نمایش ساختار درختی دسته‌بندی‌ها) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {megaMenuCategories.map((category: MenuCategory) => (
                  <div key={category.id} className="flex flex-col gap-5">
                    <h4 className="text-base font-black text-[#3D2616] dark:text-[#EAE0D5] border-b border-[#E3C3A4]/30 dark:border-[#3c2317] pb-2 inline-flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#C68E58] rounded-full"></span>
                      {category.title}
                    </h4>

                    <div className="flex flex-col gap-6">
                      {category.sections.map((section: MenuSection, idx: number) => (
                        <div key={idx} className="flex flex-col gap-2.5">
                          <h5 className="text-[13px] font-bold text-[#C68E58] dark:text-[#D4A373]">
                            {section.title}
                          </h5>
                          <ul className="flex flex-col gap-2">
                            {section.items.map((item: string, i: number) => (
                              <li key={i}>
                                <Link
                                  href={`/category/${category.id}`} 
                                  onClick={() => setIsModalOpen(false)}
                                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#8C7A6B] dark:text-[#A89F91] hover:text-[#3D2616] dark:hover:text-[#FFD7BA] hover:translate-x-[-4px] transition-all group"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C68E58]" />
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}