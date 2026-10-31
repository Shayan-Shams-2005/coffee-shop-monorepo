"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const toFarsiNumber = (num: number | string) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function OfferTimer({ targetDate }: { targetDate: string | Date | null }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!targetDate) return;
    
    const target = new Date(targetDate).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); 
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    };
    
    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isMounted || !timeLeft) return null;

  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const timeString = timeLeft.d > 0 
    ? `${timeLeft.d} روز و ${pad(timeLeft.h)}:${pad(timeLeft.m)}` 
    : `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`;

  return (
    // 🚀 FIXED: Replaced absolute positioning with the exact inline style from your screenshot
    <div className="flex items-center flex-row-reverse gap-1 text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold w-fit">
      <Timer className="w-3 h-3" />
      <span dir="ltr" className="tracking-widest pt-0.5">{toFarsiNumber(timeString)}</span>
    </div>
  );
}