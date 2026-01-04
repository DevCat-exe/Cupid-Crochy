import { useState } from "react";
import { getOrderByNumber } from "@/lib/supabase";
import { motion } from "framer-motion";
import Layout from "../layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  email: string;
  name: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState(
    sessionStorage.getItem("latestOrderId") || "",
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderId) {
      setError("Please enter an order ID");
      return;
    }

    try {
      // Get order from Supabase (with localStorage fallback)
      const foundOrder = await getOrderByNumber(orderId);

      if (foundOrder) {
        setOrder(foundOrder);
        setError("");
      } else {
        setOrder(null);
        setError("Order not found. Please check the order ID and try again.");
      }
    } catch (e) {
      console.error("Error finding order:", e);
      setOrder(null);
      setError(
        "An error occurred while searching for your order. Please try again.",
      );
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-[#F5DDEB]/30 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5B1A1A] mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-[#5B1A1A]/70 max-w-2xl mx-auto">
              Enter your order ID to check the current status of your order
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-md mb-8"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId" className="text-[#5B1A1A]">
                    Order ID
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter your order ID (e.g., ORD-123456-789)"
                      className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                    />
                    <Button
                      className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </motion.div>

            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#5B1A1A]">
                    Order Status
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Progress */}
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-[#5B1A1A]"
                        style={{
                          width: `${(getStatusStep(order.status) / 3) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div className="text-center">
                        <div
                          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            getStatusStep(order.status) >= 1
                              ? "bg-[#5B1A1A] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="mt-2 text-sm font-medium text-[#5B1A1A]">
                          Processing
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            getStatusStep(order.status) >= 2
                              ? "bg-[#5B1A1A] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="mt-2 text-sm font-medium text-[#5B1A1A]">
                          Shipped
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            getStatusStep(order.status) >= 3
                              ? "bg-[#5B1A1A] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="mt-2 text-sm font-medium text-[#5B1A1A]">
                          Delivered
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#5B1A1A]/70">Order ID</p>
                      <p className="font-medium text-[#5B1A1A]">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#5B1A1A]/70">Order Date</p>
                      <p className="font-medium text-[#5B1A1A]">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-[#5B1A1A]/70 mb-2">
                      Customer Information
                    </p>
                    <p className="font-medium text-[#5B1A1A]">{order.name}</p>
                    <p className="text-[#5B1A1A]/70">{order.email}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-[#5B1A1A]/70 mb-2">
                      Order Items
                    </p>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-[#5B1A1A]">
                              {item.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-[#5B1A1A]/70">
                                {item.quantity} × ৳{item.price.toFixed(2)}
                              </p>
                              <p className="font-medium text-[#5B1A1A]">
                                ৳{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#5B1A1A]">
                      Total Amount
                    </span>
                    <span className="font-bold text-[#5B1A1A]">
                      ৳{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#F5DDEB]/20 rounded-xl">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#5B1A1A] mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-[#5B1A1A]">
                        Estimated Delivery
                      </h3>
                      <p className="text-sm text-[#5B1A1A]/70 mt-1">
                        {order.status === "Delivered"
                          ? "Your order has been delivered."
                          : order.status === "Shipped"
                            ? "Your order is on the way and should arrive within 2-3 business days."
                            : "Your order is being processed and will be shipped soon."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
