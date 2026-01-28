"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  Loader2,
  User as UserIcon,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  createdAt: string;
  image?: string;
}

export default function UserManagementClient({ initialUsers, currentUserRole }: { initialUsers: User[]; currentUserRole: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const isAdmin = currentUserRole === "admin";

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleUpdate = async (id: string, newRole: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });

      if (!res.ok) throw new Error("Failed to update role");
      const updatedUser = await res.json();
      setUsers(users.map(u => u._id === id ? updatedUser : u));
    } catch {
      alert("Error updating user");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this user? This cannot be undone.")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert("Error deleting user");
    } finally {
      setLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return { icon: ShieldAlert, class: "bg-red-100 text-red-700", label: "Admin" };
      case "staff": return { icon: ShieldCheck, class: "bg-blue-100 text-blue-700", label: "Staff" };
      default: return { icon: Shield, class: "bg-brand-pink text-brand-maroon", label: "Customer" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-maroon/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium shadow-sm"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
              <th className="px-8 py-6">Identity</th>
              <th className="px-8 py-6">Account Status</th>
              <th className="px-8 py-6">Joined Date</th>
              <th className="px-8 py-6">Access Level</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/5">
            {filteredUsers.map((user) => {
              const BadgeConfig = getRoleBadge(user.role);
              return (
                <tr key={user._id} className="hover:bg-brand-pink/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-brand-pink/20 flex items-center justify-center shrink-0 border-2 border-white shadow-sm relative">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} fill className="object-cover" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-brand-maroon/40" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-maroon text-sm leading-tight">{user.name}</span>
                        <span className="text-[10px] text-brand-maroon/40 font-bold flex items-center mt-0.5">
                          <Mail className="h-2 w-2 mr-1" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      BadgeConfig.class
                    )}>
                      <BadgeConfig.icon className="h-3 w-3 mr-1.5" />
                      {BadgeConfig.label}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col text-sm font-medium text-brand-maroon/60">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1.5 opacity-40" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      disabled={loading === user._id || !isAdmin}
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      className={cn(
                        "bg-brand-pink/10 border-none rounded-xl px-4 py-2 text-xs font-bold text-brand-maroon focus:ring-2 focus:ring-brand-maroon/20 transition-all outline-none",
                        !isAdmin && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <option value="user">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      disabled={loading === user._id || !isAdmin}
                      onClick={() => handleDelete(user._id)}
                      className={cn(
                        "p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm",
                        (!isAdmin || loading === user._id) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {loading === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
