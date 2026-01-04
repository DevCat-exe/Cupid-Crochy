"use client";

import { useState } from "react";
import { 
  Search, 
  Eye, 
  Mail, 
  Trash2, 
  ExternalLink,
  Loader2,
  X,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { generateInvoice } from "@/lib/pdf-generator";

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
  paymentStatus: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export default function OrderManagementClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updatedOrder = await res.json();
      setOrders(orders.map(o => o._id === id ? updatedOrder : o));
      if (selectedOrder?._id === id) setSelectedOrder(updatedOrder);
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    } finally {
      setLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-3 w-3" />;
      case "processing": return <PackageCheck className="h-3 w-3" />;
      case "shipped": return <Truck className="h-3 w-3" />;
      case "delivered": return <CheckCircle2 className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search orders by name, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-maroon/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
              <th className="px-8 py-6">Order</th>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Date</th>
              <th className="px-8 py-6">Total</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/5">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-brand-pink/5 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-maroon text-sm leading-tight">#{order._id.toString().slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-brand-maroon/40 font-bold uppercase tracking-wider mt-1">{order.items.length} items</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col text-sm">
                    <span className="font-bold text-brand-maroon">{order.userName}</span>
                    <span className="text-brand-maroon/40 font-medium">{order.userEmail}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-brand-maroon font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 font-bold text-brand-maroon text-lg">৳{order.total}</td>
                <td className="px-8 py-5">
                  <select
                    disabled={loading === order._id}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest appearance-none border-none ring-0 outline-none cursor-pointer flex items-center min-w-[130px]",
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "pending" ? "bg-orange-100 text-orange-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-brand-pink text-brand-maroon"
                    )}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-3 rounded-xl bg-brand-pink/20 text-brand-maroon hover:bg-brand-maroon hover:text-white transition-all shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-maroon/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-brand-maroon/5 flex justify-between items-center bg-brand-pink/10">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-2xl font-bold text-brand-maroon">Order Details</h3>
                    <span className="text-xs font-bold text-brand-maroon/40 bg-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-brand-maroon/5">
                      #{selectedOrder._id.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-brand-maroon/60 font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl hover:bg-white text-brand-maroon/40 hover:text-brand-maroon transition-all shadow-sm"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Items & Fulfillment */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-[0.2em]">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-4 rounded-3xl bg-brand-pink/5 border border-brand-maroon/5 group">
                          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white shrink-0 shadow-lg border-2 border-white">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex-grow">
                            <h5 className="font-bold text-brand-maroon text-lg leading-tight">{item.name}</h5>
                            <p className="text-sm text-brand-maroon/60 mt-1 font-medium italic">Handmade with love</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-maroon text-lg">৳{item.price}</p>
                            <p className="text-xs font-bold text-brand-maroon/40">{item.quantity} pcs</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-maroon text-brand-beige p-8 rounded-[2rem] shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-pink/60">Payment Summary</h4>
                      <CheckCircle2 className="h-5 w-5 text-brand-pink/60" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm opacity-60">
                        <span>Subtotal</span>
                        <span>৳{selectedOrder.total - 100}</span>
                      </div>
                      <div className="flex justify-between text-sm opacity-60">
                        <span>Shipping Fee</span>
                        <span>৳100</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total Paid</span>
                        <span>৳{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[2rem] border border-brand-maroon/5 shadow-sm space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-[0.2em] mb-4">Customer</h4>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-brand-pink flex items-center justify-center font-bold text-brand-maroon">
                          {selectedOrder.userName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-maroon text-sm leading-tight">{selectedOrder.userName}</span>
                          <span className="text-[10px] text-brand-maroon/40 font-bold">{selectedOrder.userEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-[0.2em] mb-4">Shipping Address</h4>
                      <div className="text-sm text-brand-maroon/70 font-medium leading-relaxed bg-brand-pink/5 p-4 rounded-2xl border border-brand-maroon/5">
                        <p>{selectedOrder.shippingAddress.line1}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                        <p>{selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-maroon/5 space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-maroon text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg group">
                        <span className="flex items-center"><Mail className="h-4 w-4 mr-2" /> Contact Customer</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => generateInvoice(selectedOrder)}
                        className="w-full flex items-center justify-center p-4 rounded-2xl bg-brand-pink text-brand-maroon font-bold text-sm hover:bg-brand-maroon hover:text-white transition-all shadow-md group"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> 
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
