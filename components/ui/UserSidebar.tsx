"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Settings, 
  LogOut, 
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const USER_NAV_ITEMS = [
  {
    label: "My Orders",
    href: "/dashboard",
    icon: ShoppingBag,
  },
  {
    label: "My Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    label: "Payment History",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Profile Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-brand-maroon h-screen fixed left-0 top-0 text-brand-beige flex flex-col shadow-2xl z-50">
      <div className="p-8">
        <h1 className="text-2xl font-cookie text-white">Cupid Crochy</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-pink/60 font-bold mt-1">My Account</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 grow overflow-y-auto custom-scrollbar">
        {USER_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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
    </div>
  );
}
