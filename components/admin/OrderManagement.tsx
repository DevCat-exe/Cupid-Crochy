"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Mail,
  Trash2,
  Download,
  X,
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
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

  const contactCustomer = (order: Order) => {
    const subject = encodeURIComponent(`Re: Your Order ${order.shortOrderId}`);
    const body = encodeURIComponent(
      `Hello ${order.userName},\n\nI'm writing regarding your order ${order.shortOrderId}.\n\nBest regards`
    );
    window.location.href = `mailto:${order.userEmail}?subject=${subject}&body=${body}`;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "processing":
        return <PackageCheck className="h-3 w-3" />;
      case "shipped":
        return <Truck className="h-3 w-3" />;
      case "delivered":
        return <CheckCircle2 className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5">
      <div className="p-6 border-b border-brand-maroon/5">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-maroon/40" />
          <input
            type="text"
            placeholder="Search orders by name, email or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all"
          />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brand-maroon/60">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-maroon/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-brand-pink/5">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-maroon">#{order.shortOrderId}</span>
                        <span className="text-xs text-brand-maroon/70">{order.items.length} items</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="font-medium text-brand-maroon">{order.userName}</p>
                      <p className="text-xs text-brand-maroon/70">{order.userEmail}</p>
                    </td>
                    <td className="px-8 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-brand-maroon text-lg">৳{order.total}</span>
                    </td>
                    <td className="px-8 py-4">
                      <select
                        value={order.status}
                        disabled={!isAdmin}
                        className="w-full bg-brand-pink/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-maroon/20 outline-none font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-brand-pink/20"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadInvoice(order)}
                          disabled={downloadingInvoice === order._id}
                          className="p-2 rounded-lg hover:bg-brand-pink/20 disabled:opacity-50"
                          title="Download Invoice"
                        >
                          {downloadingInvoice === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Download Invoice"
                          )}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="p-2 rounded-lg hover:bg-red-100"
                            title="Delete Order"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-maroon">
                Order #{selectedOrder.shortOrderId}
              </h3>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setIsModalOpen(false);
                }}
                className="p-2 hover:bg-brand-pink/10 rounded-lg transition-all"
              >
                <X className="h-5 w-5 text-brand-maroon" />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest mb-2">
                    Customer
                  </h4>
                  <div className="font-medium text-brand-maroon">{selectedOrder.userName}</div>
                  <p className="text-sm text-brand-maroon/70">{selectedOrder.userEmail}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest mb-2">
                    Status
                  </h4>
                  <select
                    value={selectedOrder.status}
                    disabled={!isAdmin}
                    className="w-full bg-brand-pink/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest mb-2">
                    Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-brand-pink/10 p-4 rounded-2xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-brand-maroon">{item.name}</p>
                          <p className="text-brand-maroon/60">{item.quantity} × ৳{item.price}</p>
                          <p className="font-bold text-brand-maroon">৳{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest mb-2">
                    Shipping Address
                  </h4>
                  <div className="bg-brand-pink/10 p-4">
                    <p className="text-brand-maroon">{selectedOrder.shippingAddress.line1}</p>
                    <p className="text-brand-maroon/70">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-brand-maroon/70">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => downloadInvoice(selectedOrder)}
                  disabled={downloadingInvoice === selectedOrder._id}
                  className="flex-1 px-6 py-3 rounded-xl bg-brand-maroon font-medium hover:bg-brand-pink/20 transition-all"
                >
                  <span className="text-brand-white">Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}