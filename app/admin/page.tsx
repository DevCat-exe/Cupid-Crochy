import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp,
  Clock
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OrderType {
  _id: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
}

async function getStats() {
  await connectDB();
  
  const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const pendingOrders = await Order.countDocuments({ status: { $in: ["pending", "processing"] } });
  
  const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).lean();

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    pendingOrders,
    recentOrders: JSON.parse(JSON.stringify(orders.slice(0, 5))) as OrderType[],
    recentProducts: JSON.parse(JSON.stringify(recentProducts)) as ProductType[]
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      description: "All time earnings"
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      description: "Successfully placed"
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      description: "Awaiting fulfillment"
    },
    {
      label: "Active Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      description: "Items in catalog"
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-4xl border border-brand-maroon/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", card.color)}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center text-green-500 text-xs font-bold">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </div>
            </div>
            <div>
              <h3 className="text-brand-maroon/40 text-xs font-bold uppercase tracking-widest mb-1">{card.label}</h3>
              <p className="text-3xl font-bold text-brand-maroon">{card.value}</p>
              <p className="text-[10px] text-brand-maroon/30 font-medium mt-2 italic">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-brand-maroon">Recent Orders</h3>
            <button className="text-brand-maroon text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-maroon/5">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-brand-maroon/40 italic">No orders yet</td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-brand-pink/5 transition-colors group">
                      <td className="px-8 py-5 font-bold text-brand-maroon text-sm">#{order._id.toString().slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-maroon text-sm">{order.userName}</span>
                          <span className="text-[10px] text-brand-maroon/40">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-brand-maroon">৳{order.total}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          order.status === "delivered" ? "bg-green-100 text-green-700" : 
                          order.status === "pending" ? "bg-orange-100 text-orange-700" :
                          "bg-brand-pink text-brand-maroon"
                        )}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-brand-maroon">New Arrivals</h3>
            <button className="text-brand-maroon text-sm font-bold hover:underline">Manage</button>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 p-6 shadow-sm space-y-4">
            {stats.recentProducts.length === 0 ? (
              <p className="text-center py-10 text-brand-maroon/40 italic">No products yet</p>
            ) : (
              stats.recentProducts.map((product) => (
                <div key={product._id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-pink/10 transition-colors group">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-brand-pink/20 shrink-0 shadow-lg relative">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="grow">
                    <h4 className="font-bold text-brand-maroon text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-[10px] font-bold text-brand-maroon/40 uppercase tracking-widest">{product.category}</p>
                    <p className="font-bold text-brand-maroon text-sm mt-1">৳{product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
