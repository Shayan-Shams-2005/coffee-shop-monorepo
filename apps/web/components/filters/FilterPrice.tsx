"use client";

interface FilterPriceProps {
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  MAX_ALLOWED_PRICE: number;
}

const toFarsiNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export function FilterPrice({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  MAX_ALLOWED_PRICE,
}: FilterPriceProps) {
  const handlePriceChange = (setter: (val: string) => void, value: string) => {
    let englishValue = value.replace(/[۰-۹]/g, (w) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(w)),
    );
    setter(englishValue.replace(/\D/g, ""));
  };

  return (
    <div className="flex flex-col gap-6 px-1 py-1">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#E3C3A4] dark:border-[#3A221C] pb-2 relative transition-colors">
          <span className="text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors">
            از
          </span>
          <input
            type="text"
            value={
              minPrice
                ? toFarsiNumber(Number(minPrice).toLocaleString("en-US"))
                : ""
            }
            onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
            className="w-full text-left font-black text-[18px] text-[#2C1E16] dark:text-[#FFF8F0] bg-transparent outline-none dir-ltr pr-2 pl-8 transition-colors"
            dir="ltr"
          />
          <span className="text-[10px] font-bold text-[#3D2616] dark:text-[#8C7A6B] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5 transition-colors">
            تومان
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-[#E3C3A4] dark:border-[#3A221C] pb-2 relative transition-colors">
          <span className="text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors">
            تا
          </span>
          <input
            type="text"
            value={
              maxPrice
                ? toFarsiNumber(Number(maxPrice).toLocaleString("en-US"))
                : ""
            }
            onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
            className="w-full text-left font-black text-[18px] text-[#2C1E16] dark:text-[#FFF8F0] bg-transparent outline-none dir-ltr pr-2 pl-8 transition-colors"
            dir="ltr"
          />
          <span className="text-[10px] font-bold text-[#3D2616] dark:text-[#8C7A6B] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5 transition-colors">
            تومان
          </span>
        </div>
      </div>

      <div className="px-2 pt-2 pb-4">
        <div
          className="relative h-1.5 bg-[#F5EFE6] dark:bg-[#25150E] rounded-full transition-colors"
          dir="ltr"
        >
          <div
            // 🚀 FIXED: Applied primary mocha color to the active slider track in dark mode
            className="absolute h-full bg-[#C68E58] dark:bg-[#6A422D] rounded-full transition-colors"
            style={{
              left: `${((MAX_ALLOWED_PRICE - Number(maxPrice || MAX_ALLOWED_PRICE)) / MAX_ALLOWED_PRICE) * 100}%`,
              right: `${100 - ((MAX_ALLOWED_PRICE - Number(minPrice || 0)) / MAX_ALLOWED_PRICE) * 100}%`,
            }}
          ></div>
          <input
            type="range"
            min="0"
            max={MAX_ALLOWED_PRICE}
            step="50000"
            value={MAX_ALLOWED_PRICE - Number(minPrice || 0)}
            onChange={(e) => {
              const val = Math.min(
                MAX_ALLOWED_PRICE - Number(e.target.value),
                Number(maxPrice || MAX_ALLOWED_PRICE) - 50000,
              );
              if (val >= 0) setMinPrice(val.toString());
            }}
            // 🚀 FIXED: Applied primary mocha color to the range thumbs (dots)
            className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#C68E58] hover:[&::-webkit-slider-thumb]:bg-[#A87242] dark:[&::-webkit-slider-thumb]:bg-[#6A422D] dark:hover:[&::-webkit-slider-thumb]:bg-[#7B4E36] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max={MAX_ALLOWED_PRICE}
            step="50000"
            value={MAX_ALLOWED_PRICE - Number(maxPrice || MAX_ALLOWED_PRICE)}
            onChange={(e) => {
              const val = Math.max(
                MAX_ALLOWED_PRICE - Number(e.target.value),
                Number(minPrice || 0) + 50000,
              );
              if (val <= MAX_ALLOWED_PRICE) setMaxPrice(val.toString());
            }}
            // 🚀 FIXED: Applied primary mocha color to the range thumbs (dots)
            className="absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#C68E58] hover:[&::-webkit-slider-thumb]:bg-[#A87242] dark:[&::-webkit-slider-thumb]:bg-[#6A422D] dark:hover:[&::-webkit-slider-thumb]:bg-[#7B4E36] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors">
          <span>ارزان‌ترین</span>
          <span className="flex-1 border-b border-dashed border-[#E3C3A4] dark:border-[#3A221C] mx-2 mb-1.5 transition-colors"></span>
          <span>گران‌ترین</span>
        </div>
      </div>
    </div>
  );
}
