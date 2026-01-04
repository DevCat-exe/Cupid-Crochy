import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserManagementClient from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

async function getUsers() {
  await connectDB();
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">User Directory</h1>
        <p className="text-sm text-brand-maroon/40 font-medium">Manage permissions and oversee your community</p>
      </div>
      
      <UserManagementClient initialUsers={users} />
    </div>
  );
}
