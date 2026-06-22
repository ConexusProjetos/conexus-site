"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AdminBlogPage() {
  const utils = api.useUtils();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: posts, isLoading } = api.blog.adminList.useQuery();

  const updateMutation = api.blog.update.useMutation({
    onSuccess: () => utils.blog.adminList.invalidate(),
  });
  const deleteMutation = api.blog.delete.useMutation({
    onSuccess: () => { utils.blog.adminList.invalidate(); setDeleteId(null); },
  });

  function togglePublish(post: NonNullable<typeof posts>[0]) {
    updateMutation.mutate({
      id: post.id,
      data: {
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date() : undefined,
      },
    });
  }

  const published = posts?.filter((p) => p.isPublished).length ?? 0;
  const drafts = (posts?.length ?? 0) - published;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-outfit text-2xl font-semibold mb-1">Blog</h1>
          <p className="text-sm text-conexus-text-muted">
            {published} publicados · {drafts} rascunhos
          </p>
        </div>
        <Link href="/admin/blog/novo" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Novo post
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { label: `Todos (${posts?.length ?? 0})`, value: "all" },
          { label: `Publicados (${published})`, value: "published" },
          { label: `Rascunhos (${drafts})`, value: "draft" },
        ].map((tab) => (
          <button
            key={tab.value}
            className="text-xs px-3 py-1.5 rounded-lg border border-conexus-dark-border text-conexus-text-muted hover:text-white hover:border-conexus-cyan/30 transition-all"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-glass h-16 animate-pulse" />
          ))}
        </div>
      ) : !posts?.length ? (
        <div className="card-glass p-16 text-center">
          <FileText size={40} className="mx-auto mb-3 text-conexus-text-muted opacity-40" />
          <p className="text-conexus-text-muted mb-4">
            Nenhum post ainda. Crie o primeiro artigo do blog!
          </p>
          <Link href="/admin/blog/novo" className="btn-primary text-sm py-2 px-5 inline-flex items-center gap-2">
            <Plus size={14} /> Criar post
          </Link>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={cn(
                "flex items-start gap-4 p-4",
                i < posts.length - 1 && "border-b border-conexus-dark-border"
              )}
            >
              {/* Cover thumbnail */}
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-conexus-cyan/5 border border-conexus-dark-border flex-shrink-0 hidden sm:block">
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={14} className="text-conexus-text-muted" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <span className="font-medium text-sm">{post.title}</span>
                  {post.isFeatured && <Star size={12} className="text-amber-400 mt-0.5" />}
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      post.isPublished
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-conexus-dark-border text-conexus-text-muted border-conexus-dark-border"
                    )}
                  >
                    {post.isPublished ? "Publicado" : "Rascunho"}
                  </span>
                  {post.category && (
                    <span className="text-xs text-conexus-text-muted border border-conexus-dark-border px-2 py-0.5 rounded-full">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-conexus-text-muted">
                  {post.isPublished && post.publishedAt
                    ? `Publicado em ${formatDate(post.publishedAt, { day: "2-digit", month: "short", year: "numeric" })}`
                    : `Criado em ${formatDate(post.createdAt, { day: "2-digit", month: "short", year: "numeric" })}`}
                  {post.readTimeMinutes && ` · ${post.readTimeMinutes} min de leitura`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Toggle publish */}
                <button
                  onClick={() => togglePublish(post)}
                  disabled={updateMutation.isPending}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    post.isPublished
                      ? "text-emerald-400 hover:text-conexus-text-muted hover:bg-white/5"
                      : "text-conexus-text-muted hover:text-emerald-400 hover:bg-emerald-500/5"
                  )}
                  title={post.isPublished ? "Despublicar" : "Publicar"}
                >
                  {post.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                {/* Edit */}
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </Link>

                {/* Delete */}
                {deleteId === post.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteMutation.mutate({ id: post.id })} className="text-xs text-red-400 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20">Confirmar</button>
                    <button onClick={() => setDeleteId(null)} className="text-xs text-conexus-text-muted px-2 py-1">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(post.id)} className="p-2 rounded-lg text-conexus-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
