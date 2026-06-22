import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ConexusLogo } from "@/components/redesign/ConexusLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin - Conexus", template: "%s | Admin Conexus" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Double-check auth (middleware already guards, but we need user data)
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let user: { id: number; name: string; email: string; role: string } | null = null;
  try {
    const payload = await verifyToken(token);
    if (payload.role !== "admin") redirect("/");
    user = {
      id: payload.id as number,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    redirect("/login");
  }

  return (
    <div className="cnx-theme flex h-screen bg-conexus-dark overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar user={user!} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-conexus-dark-border bg-conexus-dark-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ConexusLogo className="h-5 w-auto" />
            <span className="text-xs font-medium cnx-muted">Admin</span>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--cnx-blue), var(--cnx-teal))" }}
          >
            {user!.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
