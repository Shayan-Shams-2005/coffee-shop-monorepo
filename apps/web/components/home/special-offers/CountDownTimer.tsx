"use client";

import { useState, useEffect } from "react";

const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatTime = (num: number) => {
  return toFarsiNumber(num.toString().padStart(2, "0"));
};

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 47, s: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 font-black text-lg md:text-xl"
      dir="ltr"
    >
      <div className="bg-white text-[#0A315E] dark:bg-black/30 dark:text-[#FFD7BA] dark:backdrop-blur-sm rounded-md px-2 py-1 min-w-[38px] text-center shadow-sm dark:shadow-[0_0_10px_rgba(255,215,186,0.1)] dark:border dark:border-[#FFD7BA]/20 transition-all">
        {formatTime(timeLeft.h)}
      </div>
      <span className="text-white dark:text-[#FFD7BA] text-lg leading-none pb-1 animate-pulse">
        :
      </span>
      <div className="bg-white text-[#0A315E] dark:bg-black/30 dark:text-[#FFD7BA] dark:backdrop-blur-sm rounded-md px-2 py-1 min-w-[38px] text-center shadow-sm dark:shadow-[0_0_10px_rgba(255,215,186,0.1)] dark:border dark:border-[#FFD7BA]/20 transition-all">
        {formatTime(timeLeft.m)}
      </div>
      <span className="text-white dark:text-[#FFD7BA] text-lg leading-none pb-1 animate-pulse">
        :
      </span>
      <div className="bg-white text-[#0A315E] dark:bg-black/30 dark:text-[#FFD7BA] dark:backdrop-blur-sm rounded-md px-2 py-1 min-w-[38px] text-center shadow-sm dark:shadow-[0_0_10px_rgba(255,215,186,0.1)] dark:border dark:border-[#FFD7BA]/20 transition-all">
        {formatTime(timeLeft.s)}
      </div>
    </div>
  );
}
