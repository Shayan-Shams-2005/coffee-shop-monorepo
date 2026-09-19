import { useState, useRef, useEffect } from "react";
import { User, MapPin, MessageSquare, ChevronDown } from "lucide-react";

interface CheckoutFormProps {
  formData: any;
  handleChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } },
  ) => void;
}

function CustomDropdown({
  name,
  value,
  options,
  placeholder,
  onChange,
}: {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        // 🚀 FIXED: Dropdown trigger dark mode styling
        className={`w-full h-12 bg-[#FDFCFB] dark:bg-[#1A110F] border rounded-xl px-4 text-sm flex items-center justify-between cursor-pointer transition-all ${
          isOpen
            ? "border-[#D4A373] dark:border-[#C68E58] ring-4 ring-[#D4A373]/10 dark:ring-[#C68E58]/20 bg-white dark:bg-[#231511]"
            : "border-[#F0EBE1] dark:border-[#3c2317] hover:border-[#E8DCCB] dark:hover:border-[#6A5A4F]"
        }`}
      >
        <span
          className={
            selectedLabel
              ? "text-[#2C1E16] dark:text-[#EAE0D5]"
              : "text-[#D1C8B8] dark:text-[#6A5A4F] transition-colors"
          }
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#8C7A6B] dark:text-[#6A5A4F] transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#D4A373] dark:text-[#C68E58]" : ""
          }`}
        />
      </div>

      {isOpen && (
        // 🚀 FIXED: Dropdown menu dark mode styling
        <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-xl shadow-[0_10px_40px_rgba(92,64,51,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-[#FFF9F2] dark:bg-[#2C1A14] text-[#D4A373] dark:text-[#C68E58] font-bold"
                  : "text-[#5A4A42] dark:text-[#A1A1A1] hover:bg-[#F9F8F6] dark:hover:bg-[#231511] hover:text-[#D4A373] dark:hover:text-[#FFD7BA]"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CheckoutForm({ formData, handleChange }: CheckoutFormProps) {
  // 🚀 FIXED: Input field global class for dark mode
  const inputClassName =
    "w-full h-12 bg-[#FDFCFB] dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-xl px-4 text-sm focus:bg-white dark:focus:bg-[#231511] focus:outline-none focus:border-[#D4A373] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#D4A373]/10 dark:focus:ring-[#C68E58]/20 transition-all text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-[#D1C8B8] dark:placeholder:text-[#6A5A4F] hover:border-[#E8DCCB] dark:hover:border-[#6A5A4F]";

  const provinceOptions = [
    { label: "تهران", value: "تهران" },
    { label: "اصفهان", value: "اصفهان" },
    { label: "فارس", value: "فارس" },
    { label: "خراسان رضوی", value: "خراسان رضوی" },
  ];

  const cityOptions = [
    { label: "تهران", value: "تهران" },
    { label: "اصفهان", value: "اصفهان" },
    { label: "شیراز", value: "شیراز" },
    { label: "مشهد", value: "مشهد" },
  ];

  return (
    <div className="w-full lg:w-7/12 space-y-6">
      {/* ================== اطلاعات شخصی ================== */}
      {/* 🚀 FIXED: Containers dark mode */}
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        <div className="flex items-center gap-3 mb-6 border-b border-[#F0EBE1] dark:border-[#3A221C] pb-4 transition-colors">
          <div className="p-2.5 bg-[#FFF9F2] dark:bg-[#2C1A14] text-[#D4A373] dark:text-[#C68E58] rounded-xl transition-colors">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-[#2C1E16] dark:text-white transition-colors">
            اطلاعات تماس
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              نام <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClassName} text-right placeholder:text-right`}
              placeholder="مثال: علی"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClassName} text-right placeholder:text-right`}
              placeholder="مثال: رضایی"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              تلفن همراه <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              dir={formData.phone ? "ltr" : "rtl"}
              className={`${inputClassName} ${
                formData.phone ? "text-left" : "text-right"
              } placeholder:text-right`}
              placeholder="مثال: 09123456789"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              ایمیل{" "}
              <span className="text-[#D1C8B8] dark:text-[#6A5A4F] font-normal">
                (اختیاری)
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              dir="ltr"
              className={`${inputClassName} text-left placeholder:text-left`}
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>

      {/* ================== آدرس ارسال ================== */}
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        <div className="flex items-center gap-3 mb-6 border-b border-[#F0EBE1] dark:border-[#3A221C] pb-4 transition-colors">
          <div className="p-2.5 bg-[#FFF9F2] dark:bg-[#2C1A14] text-[#D4A373] dark:text-[#C68E58] rounded-xl transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-[#2C1E16] dark:text-white transition-colors">
            جزئیات ارسال
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              استان <span className="text-red-500">*</span>
            </label>
            <CustomDropdown
              name="province"
              value={formData.province}
              options={provinceOptions}
              placeholder="انتخاب استان..."
              onChange={handleChange as any}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
              شهر <span className="text-red-500">*</span>
            </label>
            <CustomDropdown
              name="city"
              value={formData.city}
              options={cityOptions}
              placeholder="انتخاب شهر..."
              onChange={handleChange as any}
            />
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
            آدرس دقیق <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            dir="rtl"
            placeholder={"خیابان، کوچه، پلاک، واحد...\u200F"}
            className={`${inputClassName} text-right placeholder:text-right`}
          />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
          <label className="text-xs font-bold text-[#5A4A42] dark:text-[#A1A1A1] transition-colors">
            کد پستی <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            maxLength={10}
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            dir={formData.postalCode ? "ltr" : "rtl"}
            className={`${inputClassName} ${
              formData.postalCode ? "text-left tracking-widest" : "text-right"
            } placeholder:text-right`}
            placeholder={"کد ۱۰ رقمی...\u200F"}
          />
        </div>
      </div>

      {/* ================== توضیحات سفارش ================== */}
      <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(92,64,51,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
        <div className="flex items-center gap-3 mb-6 border-b border-[#F0EBE1] dark:border-[#3A221C] pb-4 transition-colors">
          <div className="p-2.5 bg-[#FFF9F2] dark:bg-[#2C1A14] text-[#D4A373] dark:text-[#C68E58] rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-[#2C1E16] dark:text-white transition-colors">
            توضیحات سفارش{" "}
            <span className="text-xs font-normal text-[#D1C8B8] dark:text-[#6A5A4F] mr-2 transition-colors">
              (اختیاری)
            </span>
          </h2>
        </div>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          dir="rtl"
          placeholder={
            "اگر نکته‌ای برای بسته‌بندی یا زمان تحویل دارید اینجا بنویسید...\u200F"
          }
          // 🚀 FIXED: Textarea dark mode styling
          className="w-full h-28 bg-[#FDFCFB] dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-xl p-4 resize-none focus:bg-white dark:focus:bg-[#231511] focus:outline-none focus:border-[#D4A373] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#D4A373]/10 dark:focus:ring-[#C68E58]/20 transition-all text-sm text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-[#D1C8B8] dark:placeholder:text-[#6A5A4F] hover:border-[#E8DCCB] dark:hover:border-[#6A5A4F] custom-scrollbar text-right placeholder:text-right"
        />
      </div>
    </div>
  );
}
