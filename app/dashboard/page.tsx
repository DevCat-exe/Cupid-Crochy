"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import UserSidebar from "@/components/ui/UserSidebar";
import { useToast } from "@/components/providers/ToastProvider";

interface Order {
  _id: string;
  shortOrderId: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  if (!session) return null;

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
                        <Link
                          href={`/order-tracking?orderId=${order.shortOrderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-brand-pink/20 text-brand-maroon/60 hover:text-brand-maroon transition-all"
                          title="Track Order"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
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
    </>
  );
}
