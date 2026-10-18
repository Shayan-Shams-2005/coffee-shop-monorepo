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
    
    let numericValue = englishValue.replace(/\D/g, "");
    
    // 🚀 FIX: افزایش محدودیت طول عدد به ۱۶ رقم
    if (numericValue.length > 16) {
      numericValue = numericValue.slice(0, 16);
    }
    
    setter(numericValue);
  };

  const currentMin = Number(minPrice || 0);
  const currentMax = maxPrice === "" ? MAX_ALLOWED_PRICE : Number(maxPrice);
  const step = 10000;

  const visualMin = Math.max(0, Math.min(currentMin, MAX_ALLOWED_PRICE));
  const visualMax = Math.max(visualMin, Math.min(currentMax, MAX_ALLOWED_PRICE));

  const thumbStyles = 
    "absolute w-full -top-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#C68E58] hover:[&::-webkit-slider-thumb]:bg-[#A87242] dark:[&::-webkit-slider-thumb]:bg-[#6A422D] dark:hover:[&::-webkit-slider-thumb]:bg-[#7B4E36] [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#C68E58] hover:[&::-moz-range-thumb]:bg-[#A87242] dark:[&::-moz-range-thumb]:bg-[#6A422D] dark:hover:[&::-moz-range-thumb]:bg-[#7B4E36] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0";

  return (
    <div className="flex flex-col gap-6 px-1 py-1">
      <div className="flex flex-col gap-5">
        
        {/* فیلد حداقل قیمت */}
        <div className="flex items-center border-b border-[#E3C3A4] dark:border-[#3A221C] pb-2 relative transition-colors">
          <span className="text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors shrink-0">
            از
          </span>
          <input
            type="text"
            dir="ltr" 
            placeholder="۰"
            value={minPrice ? toFarsiNumber(Number(minPrice).toLocaleString("en-US")) : ""}
            onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
            style={{ textAlign: "left", direction: "ltr" }}
            className="flex-1 w-full !text-left font-black text-[18px] text-[#2C1E16] dark:text-[#FFF8F0] placeholder:text-[#2C1E16]/30 dark:placeholder:text-[#FFF8F0]/30 bg-transparent outline-none pl-12 pr-4 transition-colors"
          />
          <span className="text-[10px] font-bold text-[#3D2616] dark:text-[#8C7A6B] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5 transition-colors pointer-events-none">
            تومان
          </span>
        </div>
        
        {/* فیلد حداکثر قیمت */}
        <div className="flex items-center border-b border-[#E3C3A4] dark:border-[#3A221C] pb-2 relative transition-colors">
          <span className="text-[13px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors shrink-0">
            تا
          </span>
          <input
            type="text"
            dir="ltr" 
            placeholder={toFarsiNumber(MAX_ALLOWED_PRICE.toLocaleString("en-US"))}
            value={maxPrice ? toFarsiNumber(Number(maxPrice).toLocaleString("en-US")) : ""}
            onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
            style={{ textAlign: "left", direction: "ltr" }}
            className="flex-1 w-full !text-left font-black text-[18px] text-[#2C1E16] dark:text-[#FFF8F0] placeholder:text-[#2C1E16]/30 dark:placeholder:text-[#FFF8F0]/30 bg-transparent outline-none pl-12 pr-4 transition-colors"
          />
          <span className="text-[10px] font-bold text-[#3D2616] dark:text-[#8C7A6B] absolute left-0 top-1/2 -translate-y-1/2 mt-0.5 transition-colors pointer-events-none">
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
            className="absolute h-full bg-[#C68E58] dark:bg-[#6A422D] rounded-full transition-colors"
            style={{
              left: `${(visualMin / MAX_ALLOWED_PRICE) * 100}%`,
              right: `${100 - (visualMax / MAX_ALLOWED_PRICE) * 100}%`,
            }}
          ></div>
          
          <input
            type="range"
            min="0"
            max={MAX_ALLOWED_PRICE}
            step={step}
            value={visualMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), currentMax - step);
              setMinPrice(val.toString());
            }}
            className={`${thumbStyles} z-10`}
          />
          
          <input
            type="range"
            min="0"
            max={MAX_ALLOWED_PRICE}
            step={step}
            value={visualMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), currentMin + step);
              setMaxPrice(val.toString());
            }}
            className={`${thumbStyles} z-20`}
          />
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-bold text-[#3D2616] dark:text-[#EAE0D5] transition-colors" dir="ltr">
          <span dir="rtl">{toFarsiNumber(currentMin.toLocaleString("en-US"))} تومان</span>
          <span className="flex-1 border-b border-dashed border-[#E3C3A4] dark:border-[#3A221C] mx-2 mb-1.5 transition-colors"></span>
          <span dir="rtl">{toFarsiNumber(currentMax.toLocaleString("en-US"))} تومان</span>
        </div>
      </div>
    </div>
  );
}