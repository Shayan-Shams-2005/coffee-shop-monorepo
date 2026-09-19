"use client";
import { Check } from "lucide-react";

interface FilterCheckboxListProps {
  items: string[] | { id: string | number; title: string }[];
  selectedItems: string[];
  onToggle: (item: string) => void;
}

export function FilterCheckboxList({
  items,
  selectedItems,
  onToggle,
}: FilterCheckboxListProps) {
  return (
    <div className="flex flex-col gap-4 py-1">
      {items.map((item: any) => {
        const title = typeof item === "string" ? item : item.title;
        const key = typeof item === "string" ? item : item.id;
        const isChecked = selectedItems.includes(title);

        return (
          <label
            key={key}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className="text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] group-hover:text-[#C68E58] dark:group-hover:text-[#F3E8E0] transition-colors leading-tight">
              {title}
            </span>
            <div className="relative flex items-center shrink-0">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(title)}
                className="hidden"
              />
              <div
                // 🚀 FIXED: Applied primary mocha color to the checked state and hover borders in dark mode
                className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors duration-200 ${
                  isChecked
                    ? "bg-[#C68E58] border-[#C68E58] dark:bg-[#6A422D] dark:border-[#6A422D]"
                    : "bg-white dark:bg-[#1A110F] border-[#D1C8B8] dark:border-[#3A221C] group-hover:border-[#C68E58] dark:group-hover:border-[#6A422D]"
                }`}
              >
                <Check
                  // 🚀 FIXED: Applied the creamy white color to the checkmark in dark mode
                  className={`w-3.5 h-3.5 text-white dark:text-[#F3E8E0] transition-transform duration-200 ${
                    isChecked ? "scale-100" : "scale-0"
                  }`}
                  strokeWidth={4}
                />
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
