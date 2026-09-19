"use client";
import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FilterAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  maxHeight?: string;
}

export function FilterAccordion({
  title,
  defaultOpen = true,
  children,
  maxHeight = "max-h-[2000px]",
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#F5EFE6] dark:border-[#3A221C] pb-6 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full mb-2 group"
      >
        <h4 className="text-[14px] font-black text-[#2C1E16] dark:text-[#EAE0D5] group-hover:text-[#C68E58] dark:group-hover:text-[#FFD7BA] transition-colors">
          {title}
        </h4>
        <ChevronDown
          className={`w-4 h-4 text-[#8C7A6B] dark:text-[#6A5A4F] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? `${maxHeight} mt-4 opacity-100` : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
