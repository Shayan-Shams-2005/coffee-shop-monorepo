import { AdminTopBar } from "./components/AdminTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#1A0F0C] transition-colors duration-300">
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* This renders your Top Bar and Theme Toggle on every admin page */}
        <AdminTopBar />
        
        {/* This is where your page.tsx content (Dashboard, Users, Products) will appear */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}