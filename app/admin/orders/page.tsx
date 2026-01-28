import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderManagementClient from "@/components/admin/OrderManagement";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { AuthSession } from "@/types/auth";

export const dynamic = "force-dynamic";

async function getOrders() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions) as AuthSession | null;
  const currentUserRole = session?.user?.role;
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Order Management</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">
          {currentUserRole === "staff" ? "View and update order fulfillment status" : "Track fulfillment status and customer purchases"}
        </p>
      </div>
      
      <OrderManagementClient initialOrders={orders} currentUserRole={currentUserRole} />
    </div>
  );
}
