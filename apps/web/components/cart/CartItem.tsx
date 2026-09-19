import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";

export function CartItem({
  item,
  updateQuantity,
  removeFromCart,
  onClose,
}: any) {
  const formatPrice = (price: number) => price.toLocaleString("fa-IR");
  const toFarsiNumber = (num: number) => num.toLocaleString("fa-IR");

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-2xl hover:border-[#D4A373]/50 dark:hover:border-[#C68E58] hover:shadow-sm dark:hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all group">
      <Link
        href={`/product/${item.id}`}
        onClick={onClose}
        className="w-20 h-20 relative bg-[#FCF9F5] dark:bg-gradient-to-br dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-xl flex-shrink-0 border border-[#F0EBE1]/50 dark:border-transparent p-2 overflow-hidden transition-colors"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/product/${item.id}`}
            onClick={onClose}
            className="text-sm font-bold text-[#3D2616] dark:text-[#EAE0D5] line-clamp-2 hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors leading-relaxed mt-1"
          >
            {item.name}
          </Link>

          {/* 🎨 دکمه سطل زباله */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] text-[#E63946] dark:text-[#FF6B6B] hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-[#E63946]/50 dark:hover:border-red-500/50 transition-all shadow-sm shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm font-black text-[#2C1E16] dark:text-[#FFF8F0] dir-ltr mt-2 transition-colors">
            {formatPrice(item.price)}{" "}
            <span className="text-[10px] text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
              تومان
            </span>
          </div>

          {/* 🎨 باکس تنظیم تعداد */}
          {/* 🚀 FIXED: Made container hollow/transparent for dark mode to match the reference image */}
          <div className="flex items-center gap-2 bg-white dark:bg-transparent p-1 rounded-xl border border-[#F0EBE1] dark:border-[#4B3022] shadow-sm transition-colors">
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              // 🚀 FIXED: Applied primary dark mode button colors (#6A422D) and creamy icon color
              className="w-7 h-7 rounded-lg bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] hover:bg-[#E3C3A4] dark:hover:bg-[#7B4E36] flex items-center justify-center transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* 🚀 FIXED: Matched the quantity text to the creamy white of the buttons */}
            <span className="w-5 text-sm font-black text-center text-[#2C1E16] dark:text-[#F3E8E0] transition-colors">
              {toFarsiNumber(item.quantity)}
            </span>

            <button
              onClick={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              // 🚀 FIXED: Applied primary dark mode button colors (#6A422D) and creamy icon color
              className="w-7 h-7 rounded-lg bg-[#D4A373] dark:bg-[#6A422D] text-white dark:text-[#F3E8E0] hover:bg-[#E3C3A4] dark:hover:bg-[#7B4E36] flex items-center justify-center transition-colors shadow-sm"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
