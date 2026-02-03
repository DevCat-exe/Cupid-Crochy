"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import UserSidebar from "@/components/ui/UserSidebar";

interface Payment {
  _id: string;
  orderId: string;
  shortOrderId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Order {
  _id: string;
  shortOrderId?: string;
  status: string;
}

export default function UserPaymentsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/payments");
    } else if (status === "authenticated") {
      fetchPayments();
    }
  }, [status, router]);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderMap = new Map(orders.map((o: Order) => [o._id, o]));

  if (loading) {
    return (
      <>
        <UserSidebar />
        <div className="ml-64 min-h-screen bg-brand-beige/20 pt-16 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
        </div>
      </>
    );
  }

  return (
    <>
      <UserSidebar />

      <div className="ml-64 min-h-screen bg-brand-beige/20 pt-16 pb-16">
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-brand-maroon mb-2">Payment History</h1>
              <p className="text-lg text-brand-maroon/60">Track all your transactions and payments</p>
            </div>

            {payments.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-brand-maroon/5">
                <CreditCard className="h-24 w-24 mx-auto text-brand-pink/20 mb-6" />
                <h3 className="text-2xl font-bold text-brand-maroon mb-2">No Payments Yet</h3>
                <p className="text-brand-maroon/60 mb-6">Your payment history will appear here after you make purchases.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
                      <th className="px-8 py-5">Payment ID</th>
                      <th className="px-8 py-5">Order</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-maroon/5">
                    {payments.map((payment) => {
                      const order = orderMap.get(payment.orderId);
                      return (
                        <tr key={payment._id} className="hover:bg-brand-pink/5 transition-colors">
                          <td className="px-8 py-5 font-bold text-brand-maroon text-sm">
                            {payment._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-8 py-5">
                            {order && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-brand-maroon">
                                  #{order.shortOrderId || order._id.slice(-6).toUpperCase()}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5 font-bold text-brand-maroon">৳{payment.amount}</td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              payment.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                              payment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {payment.status === 'succeeded' && <CheckCircle2 className="h-3 w-3" />}
                              {payment.status === 'pending' && <Clock className="h-3 w-3" />}
                              {payment.status === 'failed' && <XCircle className="h-3 w-3" />}
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs text-brand-maroon/40">
                            {new Date(payment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
