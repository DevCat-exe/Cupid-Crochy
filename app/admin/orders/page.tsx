import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderManagementClient from "@/components/admin/OrderManagement";

export const dynamic = "force-dynamic";

async function getOrders() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Order Management</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">Track fulfillment status and customer purchases</p>
      </div>
      
      <OrderManagementClient initialOrders={orders} />
    </div>
  );
}
