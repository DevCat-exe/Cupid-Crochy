import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import CouponManagementClient from "@/components/admin/CouponManagement";

export const dynamic = "force-dynamic";

async function getCoupons() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(coupons));
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Promotion Management</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">Create and track discount codes for your customers</p>
      </div>
      
      <CouponManagementClient initialCoupons={coupons} />
    </div>
  );
}
