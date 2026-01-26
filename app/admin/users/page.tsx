import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserManagementClient from "@/components/admin/UserManagement";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

async function getUsers() {
  await connectDB();
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const currentUserRole = (session?.user as any)?.role;
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">User Directory</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">
          {currentUserRole === "staff" ? "View all registered users" : "Manage permissions and oversee your community"}
        </p>
      </div>
      
      <UserManagementClient initialUsers={users} currentUserRole={currentUserRole} />
    </div>
  );
}
