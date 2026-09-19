"use client";

import { useState, useEffect, useMemo } from "react";
import { Timer } from "lucide-react";

const toFarsiNumber = (num: number) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function CountdownTimer({ hoursLeft }: { hoursLeft: number }) {
  const [isMounted, setIsMounted] = useState(false);
  const endTime = useMemo(
    () => Date.now() + hoursLeft * 60 * 60 * 1000,
    [hoursLeft],
  );
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(endTime - Date.now());
    const interval = setInterval(() => {
      const newTimeLeft = endTime - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  // جلوگیری از ارور Hydration در Next.js
  if (!isMounted)
    return (
      <div className="h-[22px] w-[90px] bg-gray-100 rounded animate-pulse" />
    );

  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);
  const formatTime = (num: number) => toFarsiNumber(num).padStart(2, "۰");

  return (
    <div
      className="flex items-center gap-0.5 text-[#D95D39] font-black text-[11px] sm:text-[12px] bg-[#FFFDFB] border border-[#F5EFE6] shadow-sm px-2 py-0.5 rounded-lg shrink-0"
      dir="ltr"
    >
      <Timer className="w-3.5 h-3.5 mr-1" />
      <span className="w-4 text-center">{formatTime(h)}</span>
      <span className="text-[#E3C3A4] pb-0.5">:</span>
      <span className="w-4 text-center">{formatTime(m)}</span>
      <span className="text-[#E3C3A4] pb-0.5">:</span>
      <span className="w-4 text-center">{formatTime(s)}</span>
    </div>
  );
}
