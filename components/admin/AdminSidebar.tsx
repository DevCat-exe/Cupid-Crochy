"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Home,
  Tag,
  Users,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    roles: ["admin"],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    roles: ["admin", "staff"],
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    roles: ["admin"],
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
    roles: ["admin"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin", "staff"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role;
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed left-6 top-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-brand-maroon text-white shadow-lg lg:hidden"
        aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close admin menu backdrop"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-brand-maroon text-brand-beige shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="p-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-cookie text-white">Cupid Crochy</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-pink/60 font-bold mt-1">Management Portal</p>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-full p-2 text-brand-beige/80 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 grow overflow-y-auto custom-scrollbar">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const hasAccess = userRole && item.roles.includes(userRole);
            
            if (!hasAccess) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-brand-beige text-brand-maroon shadow-lg" 
                    : "hover:bg-white/10 text-brand-pink/80 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? "text-brand-maroon" : "text-brand-pink/50 group-hover:text-white"
                )} />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-brand-pink/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="h-5 w-5" />
            <span className="font-bold text-sm">Back to Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
