import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductManagementClient from "@/components/admin/ProductManagement";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

async function getProducts() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  const currentUserRole = (session?.user as any)?.role;
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Product Management</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">
          {currentUserRole === "staff" ? "View product catalog and stock" : "Manage your handcrafted catalog and stock levels"}
        </p>
      </div>
      
      <ProductManagementClient initialProducts={products} currentUserRole={currentUserRole} />
    </div>
  );
}
