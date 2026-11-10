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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
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
    setShowTooltip(false);
    
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    
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

  const handleMouseLeave = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  return (
    <section
      ref={containerRef as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[2.5rem] overflow-hidden my-6 h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] shadow-2xl group bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/40 dark:border-[#3c2317] cursor-pointer"
      aria-label="اسلایدر اصلی سایت"
      dir="rtl"
    >
      {SLIDES.map((slide, index) => (
        <Link 
          key={slide.id} 
          href={slide.href}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* 🚀 FIXED: Removed hover transition. The Nescafe filter is now completely static. */}
          <div className="absolute inset-0 bg-black/5 dark:bg-[#231511]/40 z-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
          
          <Image 
            src={slide.src} 
            alt={slide.alt} 
            fill 
            className="object-cover dark:brightness-90 dark:contrast-125"
            priority={index === 0} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </Link>
      ))}

      {showTooltip && (
        <div 
          className="absolute z-50 pointer-events-none bg-[#1A0F0C]/90 dark:bg-[#FCF9F5]/95 text-[#EAE0D5] dark:text-[#4A3022] text-xs font-bold px-4 py-2 rounded-xl border border-[#C68E58]/30 shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
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
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
            <button 
              onClick={prevSlide}
              className="w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300
                         bg-white/80 hover:bg-white text-[#C68E58] hover:text-[#A87242] shadow-[0_4px_15px_rgba(198,142,88,0.15)]
                         dark:bg-[#1A0F0C]/80 dark:hover:bg-[#231511] dark:text-[#E3C3A4] dark:hover:text-white dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                         border border-[#E3C3A4]/40 dark:border-[#3c2317]"
              aria-label="اسلاید قبلی"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300
                         bg-white/80 hover:bg-white text-[#C68E58] hover:text-[#A87242] shadow-[0_4px_15px_rgba(198,142,88,0.15)]
                         dark:bg-[#1A0F0C]/80 dark:hover:bg-[#231511] dark:text-[#E3C3A4] dark:hover:text-white dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                         border border-[#E3C3A4]/40 dark:border-[#3c2317]"
              aria-label="اسلاید بعدی"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-9 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
            {SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                className={`transition-all duration-500 rounded-full pointer-events-auto ${
                  idx === currentIndex 
                    ? 'w-8 h-2.5 bg-[#C68E58] shadow-[0_0_10px_rgba(198,142,88,0.6)]' 
                    : 'w-2.5 h-2.5 bg-white/70 hover:bg-white dark:bg-[#3c2317]/80 dark:hover:bg-[#E3C3A4]'
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