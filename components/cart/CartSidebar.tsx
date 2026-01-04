"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import CartItem from "./CartItem";
import { useCart } from "@/components/providers/CartProvider";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, getCartTotal, getCartCount } = useCart();
  const subtotal = getCartTotal();
  const shipping = 50; // Fixed shipping for now
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-maroon/40 backdrop-blur-sm z-60 transition-opacity"
            onClick={onClose}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 right-0 z-70 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen sm:w-112.5 bg-brand-pink/10 backdrop-blur-md shadow-2xl flex flex-col border-l border-white/20"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b border-brand-maroon/5">
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-maroon p-2 rounded-xl text-white">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-maroon">Your Cart</h2>
                    <p className="text-xs text-brand-maroon/60 font-medium">
                      {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} ready for checkout
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-brand-maroon/10 text-brand-maroon transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 bg-brand-pink/30 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="h-10 w-10 text-brand-maroon/30" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-maroon mb-2">Cart is empty</h3>
                    <p className="text-brand-maroon/60 mb-8 max-w-60">
                      Looks like you haven&apos;t added any handcrafted love to your cart yet.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-brand-maroon text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-brand-maroon/20 hover:scale-[1.02] transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                    />
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div className="p-8 bg-white border-t border-brand-maroon/5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-brand-maroon/70 font-medium">
                      <span>Subtotal</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-brand-maroon/70 font-medium font-outfit">
                      <span>Shipping</span>
                      <span>৳{shipping}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-brand-maroon pt-4 border-t border-brand-maroon/5">
                      <span>Total</span>
                      <span>৳{total}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="w-full bg-brand-maroon text-white text-center font-bold py-5 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all group flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full text-brand-maroon font-bold py-3 hover:underline underline-offset-4 decoration-2"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
