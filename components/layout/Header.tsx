"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { getCartCount, openCart } = useCart();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const cartCount = getCartCount();
  const userData = session?.user;

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Contact", path: "/contact" },
    { label: "Track Order", path: "/order-tracking" },
  ];

  const dashboardLink = userData?.role === "admin" || userData?.role === "staff" ? "/admin" : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-2 bg-brand-maroon/95 shadow-md backdrop-blur-sm" : "py-4 bg-brand-maroon"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-cookie text-brand-beige group-hover:text-white transition-colors"
          >
            Cupid Crochy
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative font-medium text-brand-beige hover:text-white transition-colors group"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-brand-beige transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-5">
          {status === "loading" ? (
             <div className="h-8 w-8 rounded-full bg-brand-pink/20 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {userData?.image ? (
                  <div className="relative h-9 w-9 rounded-full border-2 border-brand-pink overflow-hidden">
                    <Image src={userData.image} alt={userData.name || "User"} fill className="object-cover" />
                  </div>
                ) : (
                   <div className="h-9 w-9 rounded-full bg-brand-pink flex items-center justify-center text-brand-maroon font-bold border-2 border-brand-beige">
                     {userData?.name?.charAt(0).toUpperCase() || "U"}
                   </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-brand-maroon/10 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-brand-maroon/5 mb-1">
                      <p className="font-bold text-brand-maroon text-sm truncate">{userData?.name}</p>
                      <p className="text-xs text-brand-maroon/60 truncate">{userData?.email}</p>
                    </div>
                    <Link 
                      href={dashboardLink}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-brand-maroon hover:bg-brand-pink/10 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="text-brand-beige hover:text-white transition-colors">
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          <button
            className="relative p-2 rounded-full bg-brand-pink text-brand-maroon hover:bg-white transition-colors"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-maroon text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-brand-pink">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full bg-brand-pink text-brand-maroon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-maroon border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="text-lg font-medium text-brand-beige hover:text-white py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
                  {session ? (
                     <>
                        <Link href={dashboardLink} onClick={() => setIsMobileMenuOpen(false)} className="text-brand-beige flex items-center space-x-2">
                           <LayoutDashboard className="h-5 w-5" />
                           <span>Dashboard</span>
                        </Link>
                        <button onClick={() => signOut()} className="text-brand-beige flex items-center space-x-2 text-left">
                           <LogOut className="h-5 w-5" />
                           <span>Sign Out</span>
                        </button>
                     </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-beige flex items-center space-x-2">
                      <UserIcon className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  )}
                  
                  <button className="flex items-center space-x-2 text-brand-beige">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cart ({cartCount})</span>
                  </button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
