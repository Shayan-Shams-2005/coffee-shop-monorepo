// app/admin/page.tsx
// cSpell:disable
"use client";

import { DashboardStats } from "./components/DashboardStats";
import { DashboardQuickLinks } from "./components/DashboardQuickLinks";
import { DashboardRecentOrders } from "./components/DashboardRecentOrders";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-12 animate-in fade-in duration-500" dir="rtl">
      <DashboardStats />
      <DashboardQuickLinks />
      <DashboardRecentOrders />
    </div>
  );
}