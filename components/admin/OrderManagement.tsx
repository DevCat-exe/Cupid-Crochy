"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  Loader2,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  shortOrderId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export default function OrderManagement({
  initialOrders,
  currentUserRole,
}: {
  initialOrders: Order[];
  currentUserRole: string;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
  const isAdmin = currentUserRole === "admin";
  const canEdit = currentUserRole === "admin" || currentUserRole === "staff";

  const filteredOrders = orders.filter(
    (o) =>
      (o.shortOrderId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (o.userName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (o.userEmail?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const downloadInvoice = async (order: Order) => {
    if (!order) return;
    setDownloadingInvoice(order._id);
    try {
      const response = await fetch(`/api/orders/invoice?id=${order.shortOrderId}`);
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.shortOrderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    if (!canEdit) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Update modal selected status used for display if it's open
      if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders(orders.filter((o) => o._id !== id));
      if (selectedOrder?._id === id) {
        setSelectedOrder(null);
        setIsModalOpen(false);
      }
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

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
    <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5">
      <div className="p-6 border-b border-brand-maroon/5 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-maroon/40" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-pink/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all placeholder:text-brand-maroon/40 font-medium text-brand-maroon"
          />
        </div>
        <div className="px-4 py-2 bg-brand-pink/10 rounded-xl text-brand-maroon font-bold text-xs uppercase tracking-widest">
            {filteredOrders.length} Orders
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
            <Package className="h-16 w-16 text-brand-maroon/20 mx-auto mb-4" />
          <p className="text-brand-maroon/60 font-medium">No orders found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4 rounded-tl-[2.5rem] pl-8">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right rounded-tr-[2.5rem] pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-maroon/5">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-brand-pink/5 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-brand-maroon">#{order.shortOrderId}</span>
                      <span className="text-[10px] text-brand-maroon/40 font-bold uppercase tracking-widest">{order.items.length} items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-maroon text-sm">{order.userName}</p>
                    <p className="text-xs text-brand-maroon/60">{order.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-maroon/60 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                     <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                         {order.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-brand-maroon text-sm">৳{order.total}</span>
                  </td>
                  
                  <td className="px-8 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white border border-brand-maroon/10 text-brand-maroon/60 hover:text-brand-maroon hover:border-brand-maroon/30 shadow-sm hover:shadow-md transition-all"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        disabled={downloadingInvoice === order._id}
                        className="p-2 rounded-xl bg-white border border-brand-maroon/10 text-brand-maroon/60 hover:text-brand-maroon hover:border-brand-maroon/30 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                        title="Download Invoice"
                      >
                        {downloadingInvoice === order._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="h-4 w-4 font-bold text-xs flex items-center justify-center">PDF</div>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modern Modal with AnimatePresence */}
      <AnimatePresence>
      {isModalOpen && selectedOrder && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             transition={{ type: "spring", duration: 0.5 }}
             className="bg-[#FDF9FB] rounded-4xl w-full max-w-2xl shadow-2xl overflow-hidden border border-brand-maroon/10" // Matches Product Modal style
             onClick={(e) => e.stopPropagation()}
          >
             {/* Modal Header */}
            <div className="bg-white px-8 py-6 border-b border-brand-maroon/5 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-pink/20 p-3 rounded-xl text-brand-maroon">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-maroon">Order Details</h3>
                        <p className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">ID: #{selectedOrder.shortOrderId}</p>
                    </div>
                </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setIsModalOpen(false);
                }}
                className="p-2 hover:bg-brand-pink/10 rounded-full transition-all text-brand-maroon/40 hover:text-brand-maroon"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Status & Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-brand-maroon/5 shadow-sm mb-8">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">Current Status:</div>
                        {canEdit ? (
                             <select
                                value={selectedOrder.status}
                                onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value as Order["status"])}
                                className={cn(
                                    "bg-transparent font-bold text-sm outline-none cursor-pointer py-1 px-2 rounded-lg transition-colors hover:bg-gray-50",
                                    getStatusColor(selectedOrder.status)
                                )}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        ) : (
                             <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(selectedOrder.status))}>
                                {selectedOrder.status}
                            </span>
                        )}
                       
                    </div>
                    <button
                        onClick={() => deleteOrder(selectedOrder._id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Order"
                        disabled={!isAdmin}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">
                      <CheckCircle2 className="h-3 w-3" /> Customer Info
                  </h4>
                  <div className="bg-white p-5 rounded-2xl border border-brand-maroon/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-sm">
                            {selectedOrder.userName.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-brand-maroon">{selectedOrder.userName}</div>
                            <div className="text-xs text-brand-maroon/60">{selectedOrder.userEmail}</div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">
                      <Truck className="h-3 w-3" /> Shipping Address
                  </h4>
                  <div className="bg-white p-5 rounded-2xl border border-brand-maroon/5 shadow-sm h-full">
                    <p className="text-brand-maroon font-medium text-sm leading-relaxed">
                        {selectedOrder.shippingAddress.line1}
                    </p>
                    <p className="text-brand-maroon/60 text-xs mt-1">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-brand-maroon/60 text-xs mt-0.5 font-bold uppercase tracking-wide">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

               {/* Items List */}
               <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest">Ordered Items ({selectedOrder.items.length})</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-brand-maroon/5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                             <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-maroon truncate">{item.name}</p>
                          <p className="text-brand-maroon/40 text-xs font-medium uppercase tracking-wider mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right whitespace-nowrap px-2">
                           <p className="font-bold text-brand-maroon">৳{item.price * item.quantity}</p>
                           <p className="text-[10px] text-brand-maroon/40">৳{item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                
                {/* Order Summary Footer */}
                <div className="bg-brand-maroon/5 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                     <div className="text-center sm:text-left">
                         <p className="text-xs text-brand-maroon/60 uppercase tracking-widest font-bold mb-1">Total Paid</p>
                         <p className="text-3xl font-bold text-brand-maroon">৳{selectedOrder.total}</p>
                     </div>
                     <button
                        onClick={() => downloadInvoice(selectedOrder)}
                        disabled={downloadingInvoice === selectedOrder._id}
                        className="px-8 py-3 rounded-xl bg-brand-maroon text-white font-bold hover:bg-brand-maroon/90 shadow-lg hover:shadow-brand-maroon/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {downloadingInvoice === selectedOrder._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                             <><span>Download Invoice</span></>
                        )}
                    </button>
                </div>

            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}