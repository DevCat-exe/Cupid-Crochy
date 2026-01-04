"use client";

import { motion } from "framer-motion";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 border border-brand-maroon/5">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="h-12 w-12 text-red-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-brand-maroon mb-4">Payment Cancelled</h1>
          <p className="text-brand-maroon/60 mb-10 leading-relaxed">
            Your payment was not processed. Don&apos;t worry, your items are still waiting for you in your cart!
          </p>

          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-brand-maroon text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all flex items-center justify-center group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Try Again
            </button>
            
            <Link
              href="/shop"
              className="w-full text-brand-maroon font-bold py-3 hover:underline flex items-center justify-center group"
            >
              Back to Shop
              <ShoppingBag className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
