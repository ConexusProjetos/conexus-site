"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { formatDate, formatRelativeDate, truncate } from "@/lib/utils";
import {
  MessageSquare,
  FileText,
  Briefcase,
  Package,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

function MetricCard({
  label,
  value,
  icon: Icon,
  href,
  color = "cyan",
  isLoading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
  color?: "cyan" | "purple" | "green" | "amber";
  isLoading?: boolean;
}) {
  const colors = {
    cyan: "bg-conexus-cyan/10 text-conexus-cyan border-conexus-cyan/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <Link
      href={href}
      className="card-glass p-5 flex items-start gap-4 group hover:border-conexus-cyan/30 transition-all"
    >
      <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-conexus-text-muted mb-1">{label}</p>
        {isLoading ? (
          <div className="h-7 w-12 bg-white/5 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-outfit font-bold">{value}</p>
        )}
      </div>
      <ArrowRight
        size={16}
        className="text-conexus-text-muted group-hover:text-conexus-cyan transition-colors mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data: messages, isLoading: loadingMessages } =
    api.contact.adminList.useQuery({ limit: 5 });

  const { data: unread } = api.contact.unreadCount.useQuery();

  const { data: blogData, isLoading: loadingBlog } =
    api.blog.adminList.useQuery();

  const { data: projects, isLoading: loadingProjects } =
    api.projects.adminList.useQuery();

  const { data: services, isLoading: loadingServices } =
    api.services.adminList.useQuery();

  const publishedPosts = blogData?.filter((p) => p.isPublished).length ?? 0;
  const activeProjects = projects?.filter((p) => p.isActive).length ?? 0;
  const activeServices = services?.filter((s) => s.isActive).length ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-outfit text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-conexus-text-muted">
          Visão geral da Conexus - {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Mensagens não lidas"
          value={unread?.count ?? 0}
          icon={MessageSquare}
          href="/admin/mensagens"
          color="cyan"
          isLoading={loadingMessages}
        />
        <MetricCard
          label="Posts publicados"
          value={publishedPosts}
          icon={FileText}
          href="/admin/blog"
          color="purple"
          isLoading={loadingBlog}
        />
        <MetricCard
          label="Projetos ativos"
          value={activeProjects}
          icon={Briefcase}
          href="/admin/projetos"
          color="green"
          isLoading={loadingProjects}
        />
        <MetricCard
          label="Serviços ativos"
          value={activeServices}
          icon={Package}
          href="/admin/servicos"
          color="amber"
          isLoading={loadingServices}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent messages */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-outfit font-semibold flex items-center gap-2">
              <Clock size={16} className="text-conexus-cyan" />
              Últimas mensagens
            </h2>
            <Link
              href="/admin/mensagens"
              className="text-xs text-conexus-cyan hover:underline"
            >
              Ver todas →
            </Link>
          </div>

          <div className="card-glass overflow-hidden">
            {loadingMessages ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !messages?.length ? (
              <div className="p-8 text-center text-conexus-text-muted text-sm">
                Nenhuma mensagem ainda.
              </div>
            ) : (
              <ul>
                {messages.map((msg, i) => (
                  <li
                    key={msg.id}
                    className={`flex items-start gap-3 p-4 ${i < messages.length - 1 ? "border-b border-conexus-dark-border" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-conexus-cyan/10 border border-conexus-cyan/20 flex items-center justify-center text-xs font-semibold text-conexus-cyan flex-shrink-0">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white truncate">
                          {msg.name}
                        </span>
                        {!msg.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-conexus-cyan flex-shrink-0" aria-label="Não lida" />
                        )}
                        {msg.service && (
                          <span className="text-xs bg-conexus-cyan/10 text-conexus-cyan border border-conexus-cyan/20 px-2 py-0.5 rounded-full truncate">
                            {msg.service}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-conexus-text-secondary truncate">
                        {truncate(msg.message, 80)}
                      </p>
                    </div>

                    <span className="text-xs text-conexus-text-muted flex-shrink-0">
                      {formatRelativeDate(msg.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-outfit font-semibold flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-conexus-cyan" />
            Ações rápidas
          </h2>

          <div className="flex flex-col gap-3">
            {[
              { label: "Novo post no blog", href: "/admin/blog/novo", icon: FileText },
              { label: "Adicionar projeto", href: "/admin/projetos", icon: Briefcase },
              { label: "Gerenciar serviços", href: "/admin/servicos", icon: Package },
              { label: "Ver mensagens", href: "/admin/mensagens", icon: MessageSquare },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3.5 card-glass hover:border-conexus-cyan/30 transition-all group"
                >
                  <Icon size={16} className="text-conexus-text-muted group-hover:text-conexus-cyan transition-colors" aria-hidden="true" />
                  <span className="text-sm text-conexus-text-secondary group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                  <ArrowRight size={14} className="ml-auto text-conexus-text-muted group-hover:text-conexus-cyan transition-colors" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
