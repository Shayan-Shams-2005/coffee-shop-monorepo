// apps/web/components/home/Hero.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
  { id: 1, src: "/banners/1.jpg", alt: "لته آرت روی میز چوبی", href: "/shop" },
  { id: 2, src: "/banners/2.jpg", alt: "فنجان قهوه از نمای بالا", href: "/shop" },
  { id: 3, src: "/banners/3.jpg", alt: "فنجان در میان دانه‌های قهوه", href: "/shop" },
  { id: 4, src: "/banners/4.jpg", alt: "بافت دانه‌های قهوه رست شده", href: "/shop" },
  { id: 5, src: "/banners/5.jpg", alt: "تجهیزات باریستا و تهیه اسپرسو", href: "/shop" },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const clearTooltip = () => {
    setShowTooltip(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return () => clearTooltip();
  }, []);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };
  
  const prevSlide = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    clearTooltip();
    
    timeoutRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setShowTooltip(true);
    }, 700);
  };

  return (
    // 🚀 FIXED: Removed 'rounded-[2.5rem]', removed margins, set width to exactly 100%
    <section
      ref={containerRef as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={clearTooltip}
      className="relative w-full overflow-hidden h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] shadow-md group bg-[#FCF9F5] dark:bg-[#1A0F0C] cursor-pointer"
      aria-label="اسلایدر اصلی سایت"
      dir="rtl"
    >
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${currentIndex * 100}%)` }}
      >
        {SLIDES.map((slide, index) => (
          <Link 
            key={slide.id} 
            href={slide.href}
            className="relative w-full h-full shrink-0 block bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D]"
          >
            <Image 
              src={slide.src} 
              alt={slide.alt} 
              fill 
              className="object-cover mix-blend-multiply"
              priority={index === 0} 
              sizes="100vw"
            />
          </Link>
        ))}
      </div>

      {showTooltip && (
        <div 
          className="absolute z-50 pointer-events-none bg-[#1A0F0C]/90 dark:bg-[#FCF9F5]/95 text-[#EAE0D5] dark:text-[#4A3022] text-xs font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${mousePos.x + 15}px`, 
            top: `${mousePos.y + 15}px`,
          }}
        >
          {SLIDES[currentIndex]?.alt}
        </div>
      )}

      {SLIDES.length > 1 && (
        <>
          <div 
            className="absolute bottom-6 right-6 z-30 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onMouseMove={(e) => { e.stopPropagation(); clearTooltip(); }}
            onMouseEnter={clearTooltip}
          >
            <button 
              onClick={prevSlide}
              className="cursor-pointer w-10 h-10 rounded-full border flex items-center justify-center transition-all 
                         bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] 
                         dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3c2317] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] 
                         shadow-sm hover:shadow-md active:scale-95"
              aria-label="اسلاید قبلی"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="cursor-pointer w-10 h-10 rounded-full border flex items-center justify-center transition-all 
                         bg-white border-[#E3C3A4] text-[#C68E58] hover:bg-[#FCF9F5] 
                         dark:bg-[#231511] dark:border-[#5C3A21] dark:text-[#E3C3A4] dark:hover:bg-[#3c2317] dark:hover:border-[#C68E58] dark:hover:text-[#FFD7BA] 
                         shadow-sm hover:shadow-md active:scale-95"
              aria-label="اسلاید بعدی"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
            {SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                onMouseMove={(e) => { e.stopPropagation(); clearTooltip(); }}
                onMouseEnter={clearTooltip}
                className={`cursor-pointer transition-all duration-500 rounded-full pointer-events-auto ${
                  idx === currentIndex 
                    ? 'w-8 h-2.5 bg-[#C68E58] dark:bg-[#BC7A46] shadow-sm' 
                    : 'w-2.5 h-2.5 bg-white/70 hover:bg-white dark:bg-[#E3C3A4]/40 dark:hover:bg-[#E3C3A4]/80'
                }`}
                aria-label={`رفتن به اسلاید ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}