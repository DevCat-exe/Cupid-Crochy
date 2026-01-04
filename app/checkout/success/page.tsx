"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // In a real app, we'd verify the session here or via webhook
      // For now, we clear the cart and display success
      clearCart();
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 border border-brand-maroon/5">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-brand-maroon mb-4">Payment Successful!</h1>
          <p className="text-brand-maroon/60 mb-10 leading-relaxed">
            Thank you for your purchase. Your handcrafted treasures will be prepared and shipped with love soon.
          </p>

          <div className="space-y-4">
            <Link
              href="/shop"
              className="w-full bg-brand-maroon text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all flex items-center justify-center group"
            >
              Continue Shopping
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/order-tracking"
              className="w-full text-brand-maroon font-bold py-3 hover:underline flex items-center justify-center group"
            >
              Track Your Order
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
