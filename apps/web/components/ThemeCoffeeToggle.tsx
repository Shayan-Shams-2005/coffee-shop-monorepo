"use client";

import { useState, useEffect } from "react";
import { createPortal, flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

export function ThemeCoffeeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Dynamic colors for the liquid body and foam
  const [liquidBody, setLiquidBody] = useState("#1A110F");
  const [liquidFoam, setLiquidFoam] = useState("#3A221C");

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 🔒 توابع قفل و باز کردن تعاملات کاربر به صورت بهینه
  const lockInteractions = () => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.pointerEvents = "none";
    document.documentElement.style.touchAction = "none";
  };

  const unlockInteractions = () => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.pointerEvents = "";
    document.documentElement.style.touchAction = "";
  };

  const toggleTheme = () => {
    if (isAnimating) return;

    lockInteractions();

    // ⚡ آزادسازی زودهنگام: دقیقاً در 60 درصد انیمیشن (1500 میلی‌ثانیه) تعاملات باز می‌شوند
    setTimeout(unlockInteractions, 1500);

    const nextIsDark = !isDark;

    setLiquidBody(nextIsDark ? "#1A110F" : "#D4A373");
    setLiquidFoam(nextIsDark ? "#3c2317" : "#FCF9F5");
    setIsAnimating(true);

    const applyTheme = () => {
      if (nextIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      setIsDark(nextIsDark);
    };

    setTimeout(() => {
      if (!("startViewTransition" in document)) {
        setUseFallback(true);
        setTimeout(() => applyTheme(), 1000);
        setTimeout(() => {
          setIsAnimating(false);
          setUseFallback(false);
        }, 2500);
        return;
      }

      setUseFallback(false);
      document.documentElement.classList.add("coffee-transition");

      const transition = (document as any).startViewTransition(() => {
        flushSync(() => applyTheme());
      });

      transition.finished
        .then(() => {
          document.documentElement.classList.remove("coffee-transition");
          setIsAnimating(false);
        })
        .catch(() => {
          document.documentElement.classList.remove("coffee-transition");
          setIsAnimating(false);
        });
    }, 50);
  };

  if (!mounted) return <div className="w-10 h-10 sm:w-10 sm:h-10" />;

  // 🌊 EXACT MATH SVG
  const svgMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 150' preserveAspectRatio='none'%3E%3Cpath d='M0,75 C250,150 250,0 500,75 C750,150 750,0 1000,75 L1000,150 L0,150 Z' fill='black'/%3E%3C/svg%3E")`;

  const getSingleWave = (colorHex: string, opacity: number, pathD: string) => {
    const encodedColor = encodeURIComponent(colorHex);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 150" preserveAspectRatio="none">
        <path d="${pathD}" fill="${encodedColor}" opacity="${opacity}"/>
      </svg>
    `;
    return `url("data:image/svg+xml;utf8,${svg.trim()}")`;
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --coffee-wave-mask: ${svgMask};
          --liquid-body: ${liquidBody};
          --liquid-foam: ${liquidFoam};
        }

        html.coffee-transition::view-transition-group(liquid-layer) { z-index: 999999; animation: none; }
        html.coffee-transition::view-transition-old(liquid-layer) { display: none; }
        html.coffee-transition::view-transition-new(liquid-layer) { animation: none; opacity: 1; }

        html.coffee-transition::view-transition-group(root) { animation-duration: 2.5s; }
        html.coffee-transition::view-transition-old(root) { animation: none; z-index: 1; opacity: 1; }
        
        html.coffee-transition::view-transition-new(root) {
          animation: fill-cup-mask 2.5s cubic-bezier(0.45, 0, 0.15, 1) forwards;
          z-index: 2;
          -webkit-mask-image: var(--coffee-wave-mask), linear-gradient(black, black);
          mask-image: var(--coffee-wave-mask), linear-gradient(black, black);
          -webkit-mask-size: 1000px 150px, 100vw 200vh;
          mask-size: 1000px 150px, 100vw 200vh;
          -webkit-mask-repeat: repeat-x, no-repeat;
          mask-repeat: repeat-x, no-repeat;
        }

        .coffee-leader {
          position: absolute;
          top: 0; left: 0;
          width: 100vw;
          height: 150px;
          z-index: 10;
          /* 🚀 Hardware Acceleration Hint */
          will-change: transform;
          animation: wave-rise 2.5s cubic-bezier(0.45, 0, 0.15, 1) forwards;
        }

        .wave-layer {
          position: absolute;
          top: 0; left: 0;
          /* 🚀 Optimization: Width is extended to allow horizontal translation without gaps */
          width: calc(100vw + 1000px); 
          height: 100%;
          background-repeat: repeat-x;
          background-size: 1000px 150px;
          will-change: transform;
        }

        .wave-locked {
          animation: wave-sync-x 2.5s cubic-bezier(0.45, 0, 0.15, 1) forwards;
        }

        /* ====== OPTIMIZED GPU-LOCKED KEYFRAMES ====== */
        
        @keyframes fill-cup-mask {
          0%, 10% { 
            -webkit-mask-position: 0px 100vh, 0px calc(100vh + 149px); 
            mask-position: 0px 100vh, 0px calc(100vh + 149px); 
          }
          90%, 100% { 
            -webkit-mask-position: -1000px -20vh, 0px calc(-20vh + 149px); 
            mask-position: -1000px -20vh, 0px calc(-20vh + 149px); 
          }
        }

        @keyframes wave-rise {
          0%, 10% { transform: translate3d(0, 100vh, 0); }
          90%, 100% { transform: translate3d(0, -20vh, 0); }
        }

        /* 🚀 Using translate3d instead of background-position for zero Repaint/Reflow! */
        @keyframes wave-sync-x {
          0%, 10% { transform: translate3d(0, 0, 0); }
          90%, 100% { transform: translate3d(-1000px, 0, 0); }
        }

        .wave-fast { animation: wave-roll 1.5s linear infinite; }
        .wave-med { animation: wave-roll 2.5s linear infinite; }

        @keyframes wave-roll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-1000px, 0, 0); }
        }
      `,
        }}
      />

      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 hover:bg-[#E3C3A4]/20 rounded-full transition-colors relative z-40"
        aria-label="تغییر پوسته"
        style={{ pointerEvents: isAnimating ? "none" : "auto" }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 hover:text-amber-400 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-gray-800 transition-colors" />
        )}
      </button>

      {isAnimating &&
        createPortal(
          <div
            className="fixed inset-0"
            style={{
              viewTransitionName: "liquid-layer",
              zIndex: 999999,
              pointerEvents: "none",
            }}
          >
            <div className="coffee-leader">
              {/* 1. BACK WAVES */}
              <div
                className="wave-layer wave-fast"
                style={{
                  zIndex: 1,
                  backgroundImage: getSingleWave(
                    liquidBody,
                    0.5,
                    "M0,75 C150,150 300,0 500,75 C700,150 850,0 1000,75 L1000,150 L0,150 Z",
                  ),
                }}
              />

              <div
                className="wave-layer wave-med"
                style={{
                  zIndex: 2,
                  backgroundImage: getSingleWave(
                    liquidBody,
                    0.8,
                    "M0,75 C200,0 350,150 500,75 C650,0 800,150 1000,75 L1000,150 L0,150 Z",
                  ),
                }}
              />

              {/* 2. FRONT SOLID WAVE (Z-Index 4) */}
              <div
                className="wave-layer wave-locked"
                style={{
                  zIndex: 4,
                  backgroundImage: getSingleWave(
                    liquidFoam,
                    1,
                    "M0,75 C250,150 250,0 500,75 C750,150 750,0 1000,75 L1000,150 L0,150 Z",
                  ),
                }}
              />
            </div>

            {useFallback && (
              <div
                className="absolute left-0 w-full h-[150vh] bg-[var(--liquid-body)]"
                style={{
                  top: "145px",
                  animation:
                    "wave-rise 2.5s cubic-bezier(0.45, 0, 0.15, 1) forwards",
                }}
              />
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
