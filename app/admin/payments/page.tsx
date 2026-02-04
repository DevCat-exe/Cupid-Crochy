
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import { DollarSign, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentType {
  _id: string;
  orderId: string;
  orderShortId?: string; // Add this
  amount: number;
  status: string;
  createdAt: string;
}

async function getPaymentStats() {
  await connectDB();
  
  const [totalPayments, successfulPayments, failedPayments, paymentsData] = await Promise.all([
    Payment.countDocuments(),
    Payment.countDocuments({ status: "succeeded" }),
    Payment.countDocuments({ status: "failed" }),
    Payment.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  // Manually fetch order details to get shortOrderId
  const orderIds = paymentsData.map(p => p.orderId);
  const orders = await Order.find({ _id: { $in: orderIds } }).select("shortOrderId").lean();
  
  const orderMap = new Map(orders.map(o => [o._id.toString(), o.shortOrderId]));

  const payments = paymentsData.map(p => ({
    ...p,
    orderShortId: orderMap.get(p.orderId.toString()) || "N/A"
  }));

  const totalRevenue = paymentsData.reduce((acc, payment) => acc + (payment.amount || 0), 0);
  const pendingPayments = await Payment.countDocuments({ status: "pending" });
  const refundedPayments = await Payment.countDocuments({ status: { $in: ["refunded", "partially_refunded"] } });

  return {
    totalPayments,
    successfulPayments,
    failedPayments,
    pendingPayments,
    refundedPayments,
    totalRevenue,
    recentPayments: JSON.parse(JSON.stringify(payments)) as PaymentType[],
  };
}

export default async function PaymentsPage() {
  const stats = await getPaymentStats();

  const cards = [
    {
      label: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      description: "All time earnings"
    },
    {
      label: "Successful Payments",
      value: stats.successfulPayments,
      icon: CheckCircle2,
      color: "bg-blue-50 text-blue-600",
      description: "Completed transactions"
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      description: "Awaiting completion"
    },
    {
      label: "Failed/Refunded",
      value: stats.failedPayments + stats.refundedPayments,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      description: "Unsuccessful transactions"
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-maroon">Payment History</h1>
          <p className="text-sm text-brand-maroon/40 font-medium mt-1">Track all transactions and revenue</p>
        </div>
      </div>

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

      {/* Payment History Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-brand-maroon/5">
          <h3 className="text-xl font-bold text-brand-maroon">Recent Transactions</h3>
          <p className="text-sm text-brand-maroon/40 font-medium mt-1">Latest payment activity</p>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
              <th className="px-8 py-5">Payment ID</th>
              <th className="px-8 py-5">Order ID</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/5">
            {stats.recentPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-brand-maroon/40 italic">No payments yet</td>
              </tr>
            ) : (
              stats.recentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-brand-pink/5 transition-colors group">
                  <td className="px-8 py-5 font-bold text-brand-maroon text-sm">{payment._id.toString().slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-5 font-bold text-brand-maroon text-sm">
                    #{payment.orderShortId}
                  </td>
                  <td className="px-8 py-5 font-bold text-brand-maroon">৳{payment.amount}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      payment.status === "succeeded" ? "bg-green-100 text-green-700" :
                      payment.status === "pending" ? "bg-orange-100 text-orange-700" :
                      payment.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {payment.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-brand-maroon/40">
                    {new Date(payment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
