// app/admin/components/DashboardQuickLinks.tsx
import Link from "next/link";
import { QUICK_LINKS_DATA } from "../constants";

export function DashboardQuickLinks() {
  return (
    <div>
      <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#C68E58] rounded-full"></div> دسترسی سریع
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {QUICK_LINKS_DATA.map((link, idx) => {
          const IconComponent = link.icon;
          return (
            <Link key={idx} href={link.href} className="group bg-white dark:bg-[#231511] p-6 rounded-[2rem] border border-[#F0EBE1] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#5A3826] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all duration-300 hover:shadow-xl hover:shadow-[#C68E58]/10 dark:hover:shadow-black/30 flex items-start gap-5 hover:-translate-y-1">
              <div className={`p-3.5 rounded-2xl transition-all duration-300 ${link.bg} ${link.accent} ${link.hover}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-bold text-[#2C1E16] dark:text-white mb-1.5 transition-colors group-hover:text-[#C68E58] dark:group-hover:text-[#C68E58]">{link.title}</h3>
                <p className="text-xs font-medium text-[#8C7A6B] dark:text-[#8C7A6B] leading-relaxed">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}