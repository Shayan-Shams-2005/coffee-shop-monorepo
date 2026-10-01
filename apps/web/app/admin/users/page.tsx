// app/admin/users/page.tsx
"use client";

import { useState, useMemo } from "react";
import { User, UserRole, UserStatus, initialUsers } from "./types";
import { UsersHeader } from "./components/UsersHeader";
import { UsersControlBar } from "./components/UsersControlBar";
import { UsersTable } from "./components/UsersTable";
import { UserModal } from "./components/UserModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.fullName.toLowerCase().includes(q) || 
        u.phone.includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    if (filterRole !== "all") {
      result = result.filter(u => u.role === filterRole);
    }

    if (filterStatus !== "all") {
      result = result.filter(u => u.status === filterStatus);
    }

    return result;
  }, [users, searchQuery, filterRole, filterStatus]);

  const handleSaveUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    setSelectedUser(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <UsersHeader />

      <UsersControlBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
        <UsersTable 
          users={filteredUsers} 
          onEdit={(user) => setSelectedUser(user)} 
        />
      </div>

      <UserModal 
        isOpen={!!selectedUser}
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        onSave={handleSaveUser} 
      />
    </div>
  );
}