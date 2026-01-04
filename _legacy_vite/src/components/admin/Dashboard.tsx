import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Try to load stats from Supabase
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*");

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");

        if (ordersError || productsError)
          throw new Error("Failed to fetch data");

        const orders = ordersData || [];
        const products = productsData || [];

        setOrders(orders);
        setProducts(products);

        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (parseFloat(order.total) || 0),
          0,
        );
        const pendingOrders = orders.filter(
          (order: any) => order.status === "Processing",
        ).length;

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          pendingOrders,
        });
      } catch (e) {
        console.error("Error loading dashboard stats:", e);
        // Set default stats on error
        setStats({
          totalOrders: 0,
          totalProducts: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        });
        setOrders([]);
        setProducts([]);
      }
    };

    // Load stats immediately
    loadStats();

    // Set up interval to refresh stats less frequently to avoid lag
    const interval = setInterval(loadStats, 30000); // 30 seconds instead of 5

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout title="Dashboard" activeTab="dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#5B1A1A]">
                  {index === 0 && "Total Orders"}
                  {index === 1 && "Total Products"}
                  {index === 2 && "Total Revenue"}
                  {index === 3 && "Pending Orders"}
                </CardTitle>
                {index === 0 && (
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                )}
                {index === 1 && (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
                {index === 2 && (
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                )}
                {index === 3 && (
                  <Users className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5B1A1A]">
                  {index === 0 && stats.totalOrders}
                  {index === 1 && stats.totalProducts}
                  {index === 2 && `৳${stats.totalRevenue.toFixed(2)}`}
                  {index === 3 && stats.pendingOrders}
                </div>
                <p className="text-xs text-[#5B1A1A]/70">
                  {index === 0 && "All time orders"}
                  {index === 1 && "Active products"}
                  {index === 2 && "All time revenue"}
                  {index === 3 && "Awaiting processing"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-[#5B1A1A]">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center py-4 text-[#5B1A1A]/70">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium text-[#5B1A1A]">{order.id}</p>
                        <p className="text-sm text-[#5B1A1A]/70">
                          {order.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#5B1A1A]">
                          ৳
                          {typeof order.total === "number"
                            ? order.total.toFixed(2)
                            : order.total}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-white card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-[#5B1A1A]">Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-center py-4 text-[#5B1A1A]/70">
                  No products yet
                </p>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product: any) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden mr-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-[#5B1A1A]">
                          {product.name}
                        </p>
                      </div>
                      <p className="font-medium text-[#5B1A1A]">
                        ৳
                        {typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
