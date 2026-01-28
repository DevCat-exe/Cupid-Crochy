"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Tag } from "lucide-react";
import Image from "next/image";

interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discount: number;
  discountAmount: number;
  finalAmount: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");

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

  const subtotal = getCartTotal();
  const shipping = 50;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderAmount: subtotal }),
      });

      const data = await response.json();

      if (response.ok) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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
          email: session.user?.email,
          couponCode: appliedCoupon?.code,
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
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
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
                        <span>৳{subtotal.toFixed(2)}</span>
                     </div>
                     {appliedCoupon && (
                       <div className="flex justify-between text-green-600">
                         <span className="flex items-center">
                           <CheckCircle2 className="h-4 w-4 mr-1" />
                           Coupon ({appliedCoupon.code})
                         </span>
                         <span>-৳{discount.toFixed(2)}</span>
                       </div>
                     )}
                     <div className="flex justify-between text-brand-maroon/70">
                        <span>Shipping</span>
                        <span>৳{shipping.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-xl font-bold text-brand-maroon pt-4 border-t border-brand-maroon/10">
                        <span>Total</span>
                        <span>৳{total.toFixed(2)}</span>
                     </div>
                  </div>
                </div>
              )}
             </div>

             {/* Coupon Code & Customer Info */}
             <div className="space-y-6">
               {/* Coupon Code */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5">
                  <h2 className="text-xl font-bold text-brand-maroon mb-4 font-outfit flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Have a Coupon?
                  </h2>
                  
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-bold text-green-800">{appliedCoupon.code}</p>
                            <p className="text-sm text-green-600">
                              {appliedCoupon.discountType === "percentage" 
                                ? `${appliedCoupon.discount}% off` 
                                : `৳${appliedCoupon.discount} off`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-red-600 hover:text-red-700 font-bold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        className="flex-1 border border-brand-maroon/20 rounded-xl px-4 py-3 font-bold text-brand-maroon outline-none focus:ring-2 focus:ring-brand-maroon/20"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="bg-brand-pink text-brand-maroon font-bold px-6 py-3 rounded-xl hover:bg-brand-pink/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                      >
                        {validatingCoupon ? <Loader2 className="h-5 w-5 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                  
                  {couponError && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      {couponError}
                    </div>
                  )}
               </div>

               {/* Customer Information */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5">
                  <h2 className="text-xl font-bold text-brand-maroon mb-6 font-outfit">Customer Information</h2>
               
               <div className="flex items-center gap-4 mb-6 p-4 bg-brand-pink/10 rounded-xl">
                  {session.user?.image ? (
                     <div className="h-12 w-12 relative rounded-full overflow-hidden border-2 border-brand-pink shrink-0">
                        <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                     </div>
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
           </div>
         </motion.div>
       </div>
     </div>
   );
 }
