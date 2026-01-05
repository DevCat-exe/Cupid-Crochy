"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Package, Calendar, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Order {
  _id: string;
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

  const [activeTab, setActiveTab] = useState("orders");
  const [newName, setNewName] = useState(session?.user?.name || "");
  const [newImage, setNewImage] = useState(session?.user?.image || "");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
      setNewName(session.user.name || "");
      setNewImage(session.user.image || "");
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
       const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, image: newImage }),
       });
       if (res.ok) {
          router.refresh(); // Refresh session
          alert("Profile updated! You might need to re-login to see changes in common areas.");
       }
    } catch (error) {
       console.error("Update failed", error);
    } finally {
       setUpdateLoading(false);
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

  return (
    <div className="min-h-screen bg-brand-beige/30 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Sidebar / Profile Card */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5 text-center">
                 <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-brand-pink/30">
                   {session.user?.image ? (
                     <div className="relative w-full h-full">
                       <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                     </div>
                   ) : (
                     <div className="w-full h-full bg-brand-pink flex items-center justify-center text-3xl font-bold text-brand-maroon">
                        {session.user?.name?.charAt(0).toUpperCase()}
                     </div>
                   )}
                 </div>
                 <h2 className="text-xl font-bold text-brand-maroon mb-1">{session.user?.name}</h2>
                 <p className="text-brand-maroon/60 text-sm mb-6">{session.user?.email}</p>
                 
                 <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setActiveTab("profile");
                      }}
                      className="w-full py-2 px-4 rounded-xl border border-brand-maroon/20 text-brand-maroon font-medium hover:bg-brand-maroon/5 transition-colors flex items-center justify-center gap-2"
                    >
                       <UserIcon className="h-4 w-4" /> Edit Profile
                    </button>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className={cn(
                        "w-full py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border",
                        activeTab === "orders" ? "bg-brand-maroon text-white border-brand-maroon" : "bg-white text-brand-maroon border-brand-maroon/20 hover:bg-brand-maroon/5"
                      )}
                    >
                       <Package className="h-4 w-4" /> My Orders
                    </button>
                 </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <AnimatePresence mode="wait">
                {activeTab === "orders" ? (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-3xl font-bold text-brand-maroon mb-6 font-outfit">Order History</h1>
                    {loadingOrders ? (
                      <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="bg-white h-40 rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white p-12 rounded-2xl shadow-sm border border-brand-maroon/5 text-center">
                        <Package className="h-12 w-12 mx-auto text-brand-maroon/20 mb-4" />
                        <h3 className="text-xl font-bold text-brand-maroon mb-2">No orders yet</h3>
                        <p className="text-brand-maroon/60 mb-6">Looks like you haven&apos;t purchased anything yet.</p>
                        <Link href="/shop" className="inline-block bg-brand-maroon text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-maroon/90 transition-colors">
                            Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-maroon/5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-brand-maroon/5 gap-4">
                                <div>
                                  <p className="text-xs text-brand-maroon/40 font-bold uppercase tracking-wider mb-1">Order ID</p>
                                  <p className="font-mono text-sm font-bold text-brand-maroon">#{order._id.slice(-6)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-brand-maroon/40 font-bold uppercase tracking-wider mb-1">Date</p>
                                  <div className="flex items-center text-sm font-medium text-brand-maroon">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {new Date(order.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-brand-maroon/40 font-bold uppercase tracking-wider mb-1">Status</p>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                      {order.status}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-brand-maroon/40 font-bold uppercase tracking-wider mb-1">Total</p>
                                  <p className="font-bold text-brand-maroon">৳{order.total}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4">
                                      <div className="relative h-12 w-12 bg-brand-pink/20 rounded-lg overflow-hidden shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-bold text-brand-maroon text-sm">{item.name}</p>
                                        <p className="text-xs text-brand-maroon/60">Qty: {item.quantity} × ৳{item.price}</p>
                                      </div>
                                  </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-brand-maroon/5 pt-4">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-brand-maroon/40 uppercase">Payment:</p>
                                  <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-md",
                                    order.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                  )}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                                <Link href={`/order-tracking?id=${order._id}`} className="text-sm font-bold text-brand-maroon hover:underline flex items-center">
                                    Details & Invoice <MapPin className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-brand-maroon/5"
                  >
                    <h2 className="text-2xl font-bold text-brand-maroon mb-8 font-outfit">Profile Settings</h2>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-maroon">Display Name</label>
                        <input 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-maroon">Profile Image URL</label>
                        <input 
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="https://images.com/user.jpg"
                          className="w-full p-3 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none"
                        />
                        <p className="text-[10px] text-brand-maroon/40">Paste a link to your profile picture.</p>
                      </div>

                      <button 
                        type="submit"
                        disabled={updateLoading}
                        className="bg-brand-maroon text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-maroon/90 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {updateLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save Changes
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
