"use client";

import { useState, useMemo, useEffect } from "react";
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await UserAdminApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("خطا در دریافت لیست کاربران. لطفاً صفحه را رفرش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FCF9F5]/80 dark:bg-[#1A0F0C]/80 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#C68E58]" />
            <span className="font-bold text-[#8C7A6B]">در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <UsersTable 
            users={filteredUsers} 
            onEdit={(user) => setSelectedUser(user)} 
          />
        )}
      </div>

      <UserModal 
        isOpen={!!selectedUser}
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        onSuccess={() => {
          fetchUsers();
          setSelectedUser(null);
        }} 
      />
    </div>
  );
}