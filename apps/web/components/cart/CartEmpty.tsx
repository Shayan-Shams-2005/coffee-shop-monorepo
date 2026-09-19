import { ShoppingBag, ArrowLeft } from "lucide-react";

interface CartEmptyProps {
  onClose: () => void;
}

export function CartEmpty({ onClose }: CartEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-32 h-32 bg-[#FCF9F5] dark:bg-[#231511] rounded-full flex items-center justify-center relative transition-colors">
        <ShoppingBag className="w-14 h-14 text-[#E3C3A4] dark:text-[#6A5A4F] transition-colors" />
        <div className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-[#1A110F] border-2 border-[#F0EBE1] dark:border-[#3c2317] text-[#A1A1A1] dark:text-[#8C7A6B] rounded-full flex items-center justify-center font-bold text-sm transition-colors">
          0
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-[#2C1E16] dark:text-white mb-2 transition-colors">
          سبد خرید خالی است!
        </h3>
        <p className="text-sm text-[#8C7A6B] dark:text-[#A1A1A1] leading-relaxed max-w-[250px] mx-auto transition-colors">
          هنوز هیچ محصولی انتخاب نکرده‌اید. با گشت و گذار در فروشگاه، سبد خود را
          پر کنید.
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-sm font-bold text-[#C68E58] dark:text-[#FFD7BA] hover:text-[#A87242] dark:hover:text-[#C68E58] bg-[#FCF9F5] dark:bg-[#2C1A14] hover:bg-[#F0EBE1] dark:hover:bg-[#3A221C] px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
      >
        بازگشت به فروشگاه
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
