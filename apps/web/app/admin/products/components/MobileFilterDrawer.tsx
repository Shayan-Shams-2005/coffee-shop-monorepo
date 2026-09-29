// app/admin/products/components/MobileFilterDrawer.tsx
import { useEffect } from "react";
import { Filter, X } from "lucide-react";
import { toFarsiNumber } from "../constants";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}

export function MobileFilterDrawer({ isOpen, onClose, resultCount, children }: MobileFilterDrawerProps) {
  
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-[#FCF9F5] dark:bg-[#1A1412] rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 transition-colors">
        
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] rounded-t-3xl shrink-0 transition-colors">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-[#EAE0D5] flex items-center gap-2 transition-colors">
            <Filter className="w-5 h-5 text-[#C68E58]" /> فیلتر محصولات
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-50 dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-gray-500 dark:text-[#EAE0D5] hover:bg-gray-100 dark:hover:bg-[#3A221C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children}
        </div>

        <div className="p-4 border-t border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] shrink-0 transition-colors">
          <button
            onClick={onClose}
            className="w-full h-12 bg-[#C68E58] hover:bg-[#A87242] transition-colors text-white font-bold rounded-xl shadow-md"
          >
            مشاهده {toFarsiNumber(resultCount)} کالا
          </button>
        </div>
      </div>
    </div>
  );
}