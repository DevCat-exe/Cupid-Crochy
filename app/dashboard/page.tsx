"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Download, Truck, CheckCircle2, Clock, Box, MapPin, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import UserSidebar from "@/components/ui/UserSidebar";
import { useToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  _id: string;
  shortOrderId: string;
  userName?: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: {
    city: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { success, error: toastError } = useToast();

  // Order tracking state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);


  const statusSteps = [
    { id: "pending", label: "Confirmed", icon: Clock },
    { id: "processing", label: "Crafting", icon: Box },
    { id: "shipped", label: "On the way", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/my-orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/invoice?id=${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toastError("Failed to download invoice");
    }
  };

  // Order tracking functions
  const openTrackingModal = (order: Order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setSelectedOrder(null);
    setIsTrackingModalOpen(false);
  };



  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  if (!session) return null;


  const currentStepIndex = statusSteps.findIndex(s => s.id === (selectedOrder?.status === "cancelled" ? "pending" : selectedOrder?.status || "pending"));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-purple-100 text-purple-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <>
      <UserSidebar />

      <div className="ml-64 min-h-screen bg-brand-beige/20 pt-16 pb-16">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-brand-maroon mb-2">My Orders</h1>
                <p className="text-lg text-brand-maroon/60">View and manage your order history</p>
              </div>
              <span className="px-4 py-2 bg-brand-pink text-brand-maroon text-xs font-bold uppercase tracking-widest rounded-full">
              </span>
            </div>

            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white h-40 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-brand-maroon/5">
                <Package className="h-24 w-24 mx-auto text-brand-pink/20 mb-6" />
                <h3 className="text-2xl font-bold text-brand-maroon mb-2">No orders yet</h3>
                <p className="text-brand-maroon/60 mb-6">Start shopping to see your orders here</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-maroon text-white font-bold rounded-2xl hover:bg-brand-maroon/90 transition-all"
                >
                  <Package className="h-5 w-5" />
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl p-6 border border-brand-maroon/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest">Order #{order.shortOrderId}</span>
                        <p className="text-sm text-brand-maroon/40 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadInvoice(order.shortOrderId)}
                          className="p-2 rounded-lg hover:bg-brand-pink/20 text-brand-maroon/60 hover:text-brand-maroon transition-all"
                          title="Download Invoice"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openTrackingModal(order)}
                          className="p-2 rounded-lg hover:bg-brand-pink/20 text-brand-maroon/60 hover:text-brand-maroon transition-all"
                          title="Track Order"
                        >
                          <Truck className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="h-16 w-16 rounded-xl overflow-hidden bg-white shadow-sm border-2 border-white relative">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="h-16 w-16 rounded-xl bg-white/50 flex items-center justify-center text-brand-maroon/60 font-bold text-sm border-2 border-white">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-brand-maroon/10">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          getStatusColor(order.status)
                        )}>
                          {order.status}
                        </span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-brand-maroon/40">Total</p>
                        <p className="text-xl font-bold text-brand-maroon">৳{order.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isTrackingModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeTrackingModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-brand-maroon/5 no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeTrackingModal}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-brand-beige hover:text-white transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Status Header */}
              <div className="bg-brand-maroon p-12 text-center text-brand-beige relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-70 relative z-10">Current Status</h3>
                <div className="flex items-center justify-center space-x-4 relative z-10">
                  <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                    {selectedOrder.status === "delivered" ? <CheckCircle2 className="h-10 w-10 text-brand-pink" /> : 
                     selectedOrder.status === "shipped" ? <Truck className="h-10 w-10 text-brand-pink" /> : 
                     <Package className="h-10 w-10 text-brand-pink" />}
                  </div>
                  <h2 className="text-4xl font-bold capitalize">{selectedOrder.status}</h2>
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
                            "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl relative z-10",
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
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-brand-pink/10 shrink-0 border border-brand-maroon/5 relative">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                      <p className="text-brand-maroon text-sm font-bold mb-1">
                        Shipping for {selectedOrder.userName || "Valued Customer"}
                      </p>
                      <p className="text-brand-maroon/60 text-sm font-medium">
                        Location: {selectedOrder.shippingAddress?.city || "Handled with care"}
                      </p>
                      <div className="mt-6 pt-4 border-t border-brand-maroon/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">Total Paid</span>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <span className="text-2xl font-bold text-brand-maroon">৳{selectedOrder.total}</span>
                          <button 
                            onClick={() => downloadInvoice(selectedOrder.shortOrderId)}
                            className="bg-brand-maroon text-white font-bold py-2 px-6 rounded-xl text-xs hover:bg-brand-maroon/90 shadow-md transition-all whitespace-nowrap flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
