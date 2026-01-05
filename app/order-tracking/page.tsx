"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Box,
  MapPin,
  ArrowRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateInvoice } from "@/lib/pdf-generator";
import Image from "next/image";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    city: string;
  };
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedId = sessionStorage.getItem("latestOrderId");
    if (savedId) setOrderId(savedId);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(orderId)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Order not found. Please check your ID.");
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { id: "pending", label: "Confirmed", icon: Clock },
    { id: "processing", label: "Crafting", icon: Box },
    { id: "shipped", label: "On the way", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.id === (order?.status === "cancelled" ? "pending" : order?.status || "pending"));

  return (
    <div className="min-h-screen bg-brand-beige/20 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-brand-pink/30 px-4 py-2 rounded-full text-brand-maroon font-bold text-xs uppercase tracking-widest"
          >
            <Truck className="h-4 w-4" />
            <span>Real-time Tracking</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-brand-maroon"
          >
            Where is your treasure?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-maroon/60 text-lg"
          >
            Enter your order number to see the status of your handcrafted delights.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-16 group"
        >
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="Order ID (e.g. 65db...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-white rounded-4xl py-8 pl-16 pr-40 shadow-2xl border border-brand-maroon/5 focus:ring-4 focus:ring-brand-maroon/5 outline-none text-xl font-bold text-brand-maroon transition-all"
          />
          <button
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-maroon text-white font-bold py-4 px-10 rounded-2xl hover:bg-brand-maroon/90 shadow-lg active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Track</span> <ArrowRight className="h-5 w-5" /></>}
          </button>
          
          {error && <p className="absolute -bottom-8 left-6 text-red-500 text-sm font-bold">{error}</p>}
        </motion.form>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-brand-maroon/5"
            >
              {/* Status Header */}
              <div className="bg-brand-maroon p-12 text-center text-brand-beige">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Current Status</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                    {order.status === "delivered" ? <CheckCircle2 className="h-10 w-10 text-brand-pink" /> : 
                     order.status === "shipped" ? <Truck className="h-10 w-10 text-brand-pink" /> : 
                     <Package className="h-10 w-10 text-brand-pink" />}
                  </div>
                  <h2 className="text-4xl font-bold capitalize">{order.status}</h2>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-12 md:p-20">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-brand-pink/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStepIndex / 3) * 100}%` }}
                      className="h-full bg-brand-maroon transition-all duration-1000"
                    />
                  </div>

                  <div className="relative flex justify-between">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      
                      return (
                        <div key={step.id} className="flex flex-col items-center group">
                          <div className={cn(
                            "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
                            isCompleted ? "bg-brand-maroon text-brand-beige scale-110" : "bg-white text-brand-maroon/20 border-2 border-brand-pink/20"
                          )}>
                            <step.icon className={cn("h-7 w-7", isCurrent && "animate-pulse")} />
                          </div>
                          <div className="mt-4 text-center">
                            <span className={cn(
                              "text-sm font-bold block",
                              isCompleted ? "text-brand-maroon" : "text-brand-maroon/20"
                            )}>{step.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-20 pt-10 border-t border-brand-maroon/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-maroon/40">
                      <Box className="h-4 w-4 mr-2" />
                      Ordered Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-brand-pink/10 shrink-0 border border-brand-maroon/5">
                            <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-maroon text-sm leading-tight">{item.name}</p>
                            <p className="text-xs text-brand-maroon/40 font-bold mt-1 uppercase tracking-tighter">{item.quantity} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-maroon/40">
                      <MapPin className="h-4 w-4 mr-2" />
                      Delivery Details
                    </h4>
                    <div className="bg-brand-pink/10 p-6 rounded-4xl border border-brand-maroon/5">
                      <p className="text-brand-maroon text-sm font-bold mb-1">Shipping for {order.userName}</p>
                      <p className="text-brand-maroon/60 text-sm font-medium">Location: {order.shippingAddress?.city || "Handled with care"}</p>
                      <div className="mt-6 pt-4 border-t border-brand-maroon/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">Total Paid</span>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <span className="text-2xl font-bold text-brand-maroon">৳{order.total}</span>
                          <button 
                            onClick={() => generateInvoice(order)}
                            className="bg-brand-maroon text-white font-bold py-2 px-6 rounded-xl text-xs hover:bg-brand-maroon/90 shadow-md transition-all whitespace-nowrap"
                          >
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
