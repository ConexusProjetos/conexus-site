"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Briefcase,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ConexusLogo, ConexusMark } from "@/components/redesign/ConexusLogo";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare, badge: true },
  { href: "/admin/servicos", label: "Serviços", icon: Package },
  { href: "/admin/projetos", label: "Projetos", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export function AdminSidebar({ user }: { user: AdminUser }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: unreadData } = api.contact.unreadCount.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const unreadCount = unreadData?.count ?? 0;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className={cn(
        "admin-sidebar flex flex-col transition-all duration-300 flex-shrink-0",
        "hidden md:flex",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Navegação administrativa"
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-conexus-dark-border flex-shrink-0">
        <Link href="/" aria-label="Ir para o site" className={cn("flex items-center", collapsed && "mx-auto")}>
          {collapsed ? (
            <ConexusMark className="w-8 h-8" />
          ) : (
            <ConexusLogo className="h-6 w-auto" />
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded-md text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors",
            collapsed && "hidden"
          )}
          aria-label="Recolher menu"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1 rounded-md text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Expandir menu"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto" role="navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const badge = item.badge && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative",
                active ? "font-semibold" : "font-medium text-conexus-text-secondary hover:text-white hover:bg-white/5",
                collapsed && "justify-center px-2"
              )}
              style={active ? { background: "rgba(47,68,159,0.07)", color: "var(--cnx-blue)" } : undefined}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
            >
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: "var(--cnx-grad)" }} aria-hidden="true" />
              )}
              <div className="relative flex-shrink-0">
                <Icon size={18} aria-hidden="true" />
                {badge && collapsed && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "var(--cnx-grad)" }} />
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {badge && (
                    <span className="ml-auto text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center" style={{ background: "var(--cnx-grad)" }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-conexus-dark-border p-2 flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Ver site" : undefined}
        >
          <ExternalLink size={15} aria-hidden="true" />
          {!collapsed && "Ver site"}
        </a>

        <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", collapsed && "justify-center")}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--cnx-blue), var(--cnx-teal))" }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-conexus-text-muted truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1 rounded text-conexus-text-muted hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
