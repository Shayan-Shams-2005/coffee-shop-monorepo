"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface OtpTimerProps {
  initialTime: number;
  isLoading: boolean;
  onResend: () => void;
}

export function OtpTimer({ initialTime, isLoading, onResend }: OtpTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResend = () => {
    onResend();
    setTimeLeft(initialTime);
  };

  if (timeLeft > 0) {
    return (
      <p className="text-sm font-medium text-gray-500">
        ارسال مجدد کد تا
        <span className="font-bold dir-ltr inline-block mx-1">
          {formatTime(timeLeft)}
        </span>
        دیگر
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={isLoading}
      className="text-sm font-bold text-[#D4A373] hover:text-coffee-800 transition-colors flex items-center justify-center gap-1 w-full disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
      ارسال مجدد کد
    </button>
  );
}
