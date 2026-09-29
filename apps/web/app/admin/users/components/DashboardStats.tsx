// app/admin/components/DashboardStats.tsx
import { STATS_DATA } from "../constants";

export function DashboardStats() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">داشبورد مدیریت</h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">خلاصه وضعیت فروشگاه و دسترسی‌های سریع</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS_DATA.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#231511] p-5 rounded-[2rem] border border-[#F0EBE1] dark:border-[#3c2317] flex items-center gap-5 shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all hover:shadow-xl hover:shadow-[#C68E58]/10 dark:hover:shadow-black/20 hover:-translate-y-1">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-1">{stat.label}</p>
                <p className="text-xl font-black text-[#2C1E16] dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}