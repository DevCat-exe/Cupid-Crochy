import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AuthSession } from "@/types/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "admin" && (session.user as any).role !== "staff")) {
    redirect("/login");
    return null; // unreachable but satisfies TS
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="grow ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-bold text-brand-maroon">Admin Dashboard</h2>
            <p className="text-xs text-brand-maroon/40 font-medium">Manage your store with ease</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-brand-maroon">{session.user?.name}</p>
              <p className="text-[10px] font-bold text-brand-maroon/40 uppercase tracking-widest">{(session.user as any).role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-pink border-2 border-brand-maroon/10 flex items-center justify-center text-brand-maroon font-bold">
              {session.user?.name?.[0]}
            </div>
          </div>
        </header>
        
        <main className="grow overflow-y-auto bg-brand-beige/20 p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
