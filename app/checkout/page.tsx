"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  if (!session) {
    return null; // Redirecting
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          email: session.user?.email, // Using session email
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", data.error);
        alert("Failed to start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige/30 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-brand-maroon mb-8 font-outfit">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5 h-fit">
              <h2 className="text-xl font-bold text-brand-maroon mb-6 font-outfit">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-brand-maroon/60">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-brand-maroon/5 last:border-0">
                      <div className="h-20 w-20 relative rounded-xl overflow-hidden bg-brand-pink/20 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-maroon">{item.name}</h3>
                        <p className="text-sm text-brand-maroon/60">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-maroon">৳{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                     <div className="flex justify-between text-brand-maroon/70">
                        <span>Subtotal</span>
                        <span>৳{getCartTotal().toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-brand-maroon/70">
                        <span>Shipping</span>
                        <span>৳50.00</span>
                     </div>
                     <div className="flex justify-between text-xl font-bold text-brand-maroon pt-4 border-t border-brand-maroon/10">
                        <span>Total</span>
                        <span>৳{(getCartTotal() + 50).toFixed(2)}</span>
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment / User Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5 h-fit">
               <h2 className="text-xl font-bold text-brand-maroon mb-6 font-outfit">Customer Information</h2>
               
               <div className="flex items-center gap-4 mb-6 p-4 bg-brand-pink/10 rounded-xl">
                  {session.user?.image ? (
                     <img src={session.user.image} alt={session.user.name || "User"} className="h-12 w-12 rounded-full object-cover border-2 border-brand-pink" />
                  ) : (
                     <div className="h-12 w-12 rounded-full bg-brand-pink flex items-center justify-center text-brand-maroon font-bold text-xl">
                        {session.user?.name?.charAt(0).toUpperCase()}
                     </div>
                  )}
                  <div>
                     <p className="font-bold text-brand-maroon">{session.user?.name}</p>
                     <p className="text-sm text-brand-maroon/70">{session.user?.email}</p>
                  </div>
               </div>

               <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-brand-maroon text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
               >
                  {loading ? (
                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : "Pay with Stripe"}
               </button>
               <p className="text-xs text-center text-brand-maroon/40 mt-4">
                  Secure payment powered by Stripe. You will be redirected to complete your purchase.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
