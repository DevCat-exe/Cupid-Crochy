"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-brand-beige/20 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-[12rem] font-bold text-brand-pink/20 leading-none">404</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold text-brand-maroon">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-brand-maroon/60">
            The treasure you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="flex items-center gap-2 bg-brand-maroon text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all"
          >
            <Home className="h-5 w-5" />
            <span>Back Home</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-white text-brand-maroon font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-lg hover:bg-brand-pink/10 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Browse Products</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-maroon/5">
            <h3 className="text-lg font-bold text-brand-maroon mb-4 flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/products" className="text-brand-maroon/60 hover:text-brand-maroon font-medium transition-colors">
                All Products
              </Link>
              <Link href="/checkout" className="text-brand-maroon/60 hover:text-brand-maroon font-medium transition-colors">
                Checkout
              </Link>
              <Link href="/order-tracking" className="text-brand-maroon/60 hover:text-brand-maroon font-medium transition-colors">
                Track Order
              </Link>
              <Link href="/login" className="text-brand-maroon/60 hover:text-brand-maroon font-medium transition-colors">
                My Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
