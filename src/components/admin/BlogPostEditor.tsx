"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/client";
import { FormField } from "@/components/admin/FormField";
import { estimateReadTime } from "@/lib/utils";
import { Save, Eye, EyeOff, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost, BlogCategory } from "@/server/db/schema";
import slugify from "slugify";

type Props = {
  post?: BlogPost;
  categories: BlogCategory[];
};

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  categoryId: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const EMPTY: PostForm = {
  title: "", slug: "", excerpt: "", content: "",
  coverImageUrl: "", categoryId: "", tags: "",
  metaTitle: "", metaDescription: "",
  isPublished: false, isFeatured: false,
};

export function BlogPostEditor({ post, categories }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const isEditing = !!post;

  const [form, setForm] = useState<PostForm>(
    post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? "",
          categoryId: post.categoryId ? String(post.categoryId) : "",
          tags: ((post.tags ?? []) as string[]).join(", "),
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          isPublished: post.isPublished,
          isFeatured: post.isFeatured,
        }
      : EMPTY
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Auto-generate slug from title (only when creating)
  useEffect(() => {
    if (autoSlug && form.title) {
      setForm((p) => ({
        ...p,
        slug: slugify(form.title, { lower: true, strict: true }),
      }));
    }
  }, [form.title, autoSlug]);

  const createMutation = api.blog.create.useMutation({
    onSuccess: (post) => {
      utils.blog.adminList.invalidate();
      router.push(`/admin/blog/${post.id}`);
    },
  });
  const updateMutation = api.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.adminList.invalidate();
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (name === "slug") setAutoSlug(false);
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      coverImageUrl: form.coverImageUrl || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      isPublished: publish ?? form.isPublished,
      isFeatured: form.isFeatured,
      readTimeMinutes: estimateReadTime(form.content),
    };

    if (isEditing && post) {
      updateMutation.mutate({ id: post.id, data: payload });
      if (publish !== undefined) setForm((p) => ({ ...p, isPublished: publish }));
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const savedAt = updateMutation.isSuccess ? new Date() : null;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/blog")}
            className="p-2 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-outfit text-xl font-semibold">
              {isEditing ? "Editar post" : "Novo post"}
            </h1>
            {savedAt && (
              <p className="text-xs text-emerald-400 mt-0.5">
                Salvo às {savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full border",
            form.isPublished
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-conexus-dark-border text-conexus-text-muted border-conexus-dark-border"
          )}>
            {form.isPublished ? "Publicado" : "Rascunho"}
          </span>

          {/* Save */}
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={isSaving}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar
          </button>

          {/* Publish/Unpublish */}
          <button
            onClick={(e) => handleSubmit(e, !form.isPublished)}
            disabled={isSaving}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            {form.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {form.isPublished ? "Despublicar" : "Publicar"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor - main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <FormField
            id="title"
            label="Título do post"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ex: 5 razões para automatizar seu estoque agora"
            className="text-lg"
          />

          {/* Slug */}
          <FormField
            id="slug"
            label="Slug (URL)"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="5-razoes-para-automatizar-estoque"
            hint={`URL final: /blog/${form.slug || "seu-slug-aqui"}`}
          />

          {/* Excerpt */}
          <FormField
            as="textarea"
            id="excerpt"
            label="Resumo (aparece na listagem)"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            placeholder="Uma ou duas frases que descrevem o artigo..."
            hint="Máximo 160 caracteres recomendado."
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Conteúdo <span className="text-conexus-cyan" aria-hidden="true">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={20}
              placeholder="Escreva o conteúdo do post aqui... (Markdown suportado)"
              className="input-base w-full resize-y font-mono text-sm leading-relaxed"
              required
            />
            <p className="text-xs text-conexus-text-muted mt-1.5 flex justify-between">
              <span>Markdown suportado</span>
              <span>
                ~{estimateReadTime(form.content)} min de leitura ·{" "}
                {form.content.split(/\s+/).filter(Boolean).length} palavras
              </span>
            </p>
          </div>

          {/* SEO section (collapsible) */}
          <div className="card-glass overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-white/[0.02] transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={14} className="text-conexus-cyan" />
                SEO e Open Graph
              </span>
              <span className="text-conexus-text-muted text-xs">{seoOpen ? "▲" : "▼"}</span>
            </button>
            {seoOpen && (
              <div className="px-4 pb-4 border-t border-conexus-dark-border pt-4 space-y-4">
                <FormField
                  id="metaTitle"
                  label="Meta title"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  placeholder={form.title || "Meta title para SEO"}
                  hint={`${form.metaTitle.length}/60 caracteres`}
                />
                <FormField
                  as="textarea"
                  id="metaDescription"
                  label="Meta description"
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descrição para mecanismos de busca (160 chars)"
                  hint={`${form.metaDescription.length}/160 caracteres`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Cover image */}
          <div className="card-glass p-4">
            <h3 className="text-sm font-medium mb-3">Imagem de capa</h3>
            {form.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImageUrl}
                alt="Preview da capa"
                className="w-full h-32 object-cover rounded-lg mb-3 border border-conexus-dark-border"
              />
            )}
            <FormField
              id="coverImageUrl"
              label="URL da imagem"
              name="coverImageUrl"
              type="url"
              value={form.coverImageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* Category + tags */}
          <div className="card-glass p-4 space-y-4">
            <h3 className="text-sm font-medium">Classificação</h3>
            <FormField
              as="select"
              id="categoryId"
              label="Categoria"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              options={categoryOptions}
            />
            <FormField
              id="tags"
              label="Tags (separadas por vírgula)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="tecnologia, automação, ceará"
            />
          </div>

          {/* Options */}
          <div className="card-glass p-4 space-y-3">
            <h3 className="text-sm font-medium">Opções</h3>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="accent-conexus-cyan w-4 h-4"
              />
              Post em destaque
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="accent-conexus-cyan w-4 h-4"
              />
              Publicar imediatamente
            </label>
          </div>

          {/* Save button (mobile / sidebar) */}
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={isSaving}
            className="btn-primary w-full justify-center py-3 text-sm"
          >
            {isSaving ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : <><Save size={14} /> Salvar rascunho</>}
          </button>
        </div>
      </div>
    </div>
  );
}
