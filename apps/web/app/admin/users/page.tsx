// app/admin/users/page.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { UserDto, UserRoleFilter, UserStatusFilter } from "./types";
import { UserAdminApi } from "./api"; 
import { UsersHeader } from "./components/UsersHeader";
import { UsersControlBar } from "./components/UsersControlBar";
import { UsersTable } from "./components/UsersTable";
import { UserModal } from "./components/UserModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRoleFilter>("all");
  const [filterStatus, setFilterStatus] = useState<UserStatusFilter>("all");
  
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 20;
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchUsers = async (currentPage: number, replace = false) => {
    try {
      if (currentPage === 1) setIsLoading(true);
      else setIsFetchingNextPage(true);
      
      const data = await UserAdminApi.getAllUsers(currentPage, PAGE_SIZE);
      const rawUsers = Array.isArray(data) ? data : (data.items || []);

      setUsers(prev => {
        if (replace) return rawUsers;
        return [...prev, ...rawUsers];
      });

      setHasMore(rawUsers.length === PAGE_SIZE);
    } catch (err) {
      if (currentPage === 1) setError("خطا در دریافت لیست کاربران. لطفاً صفحه را رفرش کنید.");
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, page === 1);
  }, [page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => { observer.unobserve(target); };
  }, [hasMore, isLoading, isFetchingNextPage]);

  const reloadData = () => {
    setPage(1);
    fetchUsers(1, true);
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        (u.firstName && u.firstName.toLowerCase().includes(q)) || 
        (u.lastName && u.lastName.toLowerCase().includes(q)) || 
        u.phoneNumber.includes(q)
      );
    }

    if (filterRole !== "all") {
      const roleTarget = filterRole === "admin" ? 1 : 0;
      result = result.filter(u => u.role === roleTarget);
    }

    if (filterStatus !== "all") {
      const statusTarget = filterStatus === "banned" ? true : false;
      result = result.filter(u => u.isDeleted === statusTarget);
    }

    return result;
  }, [users, searchQuery, filterRole, filterStatus]);

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <UsersHeader />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold">{error}</div>
      )}

      <UsersControlBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none min-h-[400px] relative">
        {isLoading && page === 1 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FCF9F5]/80 dark:bg-[#1A0F0C]/80 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#C68E58]" />
            <span className="font-bold text-[#8C7A6B]">در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <>
            <UsersTable 
              users={filteredUsers} 
              onEdit={(user) => setSelectedUser(user)} 
            />
            
            {/* Observer Target */}
            <div ref={observerTarget} className="w-full h-16 flex flex-col items-center justify-center border-t border-[#E3C3A4]/40 dark:border-[#3c2317]">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#C68E58] animate-spin" />
                  <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری کاربران بیشتر...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <UserModal 
        isOpen={!!selectedUser}
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        onSuccess={() => {
          reloadData();
          setSelectedUser(null);
        }} 
      />
    </div>
  );
}