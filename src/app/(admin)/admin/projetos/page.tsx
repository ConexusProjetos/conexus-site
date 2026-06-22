"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { FormField } from "@/components/admin/FormField";
import { formatDate } from "@/lib/utils";
import {
  Plus, Pencil, Trash2, Loader2, X, Briefcase,
  Star, StarOff, ToggleLeft, ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectForm = {
  title: string;
  excerpt: string;
  description: string;
  client: string;
  clientSector: string;
  categoryId: string;
  tags: string;
  imageUrl: string;
  projectUrl: string;
  isFeatured: boolean;
  isActive: boolean;
};

const EMPTY: ProjectForm = {
  title: "", excerpt: "", description: "", client: "", clientSector: "",
  categoryId: "", tags: "", imageUrl: "", projectUrl: "",
  isFeatured: false, isActive: true,
};

export default function AdminProjetosPage() {
  const utils = api.useUtils();
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: projects, isLoading } = api.projects.adminList.useQuery();
  const { data: categories } = api.projects.categories.useQuery();

  const createMutation = api.projects.create.useMutation({
    onSuccess: () => { utils.projects.adminList.invalidate(); closeForm(); },
  });
  const updateMutation = api.projects.update.useMutation({
    onSuccess: () => { utils.projects.adminList.invalidate(); closeForm(); },
  });
  const deleteMutation = api.projects.delete.useMutation({
    onSuccess: () => { utils.projects.adminList.invalidate(); setDeleteId(null); },
  });

  function openEdit(proj: NonNullable<typeof projects>[0]) {
    setEditId(proj.id);
    setForm({
      title: proj.title,
      excerpt: proj.excerpt ?? "",
      description: proj.description,
      client: proj.client ?? "",
      clientSector: proj.clientSector ?? "",
      categoryId: proj.categoryId ? String(proj.categoryId) : "",
      tags: ((proj.tags ?? []) as string[]).join(", "),
      imageUrl: proj.imageUrl ?? "",
      projectUrl: proj.projectUrl ?? "",
      isFeatured: proj.isFeatured,
      isActive: proj.isActive,
    });
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditId(null); setForm(EMPTY); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      excerpt: form.excerpt || undefined,
      description: form.description,
      client: form.client || undefined,
      clientSector: form.clientSector || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      imageUrl: form.imageUrl || undefined,
      projectUrl: form.projectUrl || undefined,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };
    if (editId) updateMutation.mutate({ id: editId, data: payload });
    else createMutation.mutate(payload);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const categoryOptions = (categories ?? []).map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-outfit text-2xl font-semibold mb-1">Projetos</h1>
          <p className="text-sm text-conexus-text-muted">Portfólio de projetos entregues</p>
        </div>
        <button onClick={() => { setEditId(null); setForm(EMPTY); setShowForm(true); }} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Novo projeto
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="card-glass p-6 mb-6 border-conexus-cyan/20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-semibold">{editId ? "Editar projeto" : "Novo projeto"}</h2>
            <button onClick={closeForm} className="p-1.5 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <FormField id="title" label="Título" name="title" value={form.title} onChange={handleChange} required placeholder="Nome do projeto" className="sm:col-span-2" />
            <FormField id="client" label="Cliente" name="client" value={form.client} onChange={handleChange} placeholder="Nome da empresa" />
            <FormField id="clientSector" label="Setor" name="clientSector" value={form.clientSector} onChange={handleChange} placeholder="Varejo, ONG, Saúde..." />
            <FormField as="select" id="categoryId" label="Categoria" name="categoryId" value={form.categoryId} onChange={handleChange} options={categoryOptions} />
            <FormField id="tags" label="Tags (separadas por vírgula)" name="tags" value={form.tags} onChange={handleChange} placeholder="estoque, automação, react" />
            <FormField id="excerpt" label="Resumo (aparece no card)" name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Uma frase sobre o projeto" className="sm:col-span-2" />
            <FormField as="textarea" id="description" label="Descrição completa" name="description" value={form.description} onChange={handleChange} rows={4} required className="sm:col-span-2" />
            <FormField id="imageUrl" label="URL da imagem (capa)" name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
            <FormField id="projectUrl" label="URL do projeto (opcional)" name="projectUrl" type="url" value={form.projectUrl} onChange={handleChange} placeholder="https://..." />
            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-conexus-cyan w-4 h-4" />
                Ativo (visível no portfólio)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-conexus-cyan w-4 h-4" />
                Destaque (aparece primeiro)
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={isSaving} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
                {isSaving ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : "Salvar projeto"}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary text-sm py-2 px-4">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-glass h-16 animate-pulse" />)}</div>
      ) : !projects?.length ? (
        <div className="card-glass p-16 text-center">
          <Briefcase size={40} className="mx-auto mb-3 text-conexus-text-muted opacity-40" />
          <p className="text-conexus-text-muted mb-4">Nenhum projeto ainda. Adicione o primeiro case!</p>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          {projects.map((proj, i) => (
            <div key={proj.id} className={cn("flex items-center gap-4 p-4", i < projects.length - 1 && "border-b border-conexus-dark-border")}>
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-conexus-cyan/10 border border-conexus-dark-border flex-shrink-0">
                {proj.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-conexus-text-muted">
                    <Briefcase size={14} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{proj.title}</span>
                  {proj.isFeatured && <Star size={12} className="text-amber-400" />}
                  {!proj.isActive && <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Inativo</span>}
                  {proj.category && <span className="text-xs text-conexus-text-muted border border-conexus-dark-border px-2 py-0.5 rounded-full">{proj.category.name}</span>}
                </div>
                <p className="text-xs text-conexus-text-muted mt-0.5">{proj.client ?? "Cliente não informado"}</p>
              </div>

              <div className="text-xs text-conexus-text-muted hidden sm:block flex-shrink-0">
                {proj.completedAt ? formatDate(proj.completedAt, { month: "short", year: "numeric" }) : "Em andamento"}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => updateMutation.mutate({ id: proj.id, data: { isFeatured: !proj.isFeatured } })} className="p-2 rounded-lg text-conexus-text-muted hover:text-amber-400 hover:bg-amber-500/5 transition-colors" title="Toggle destaque">
                  {proj.isFeatured ? <Star size={14} className="text-amber-400" /> : <StarOff size={14} />}
                </button>
                <button onClick={() => openEdit(proj)} className="p-2 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors">
                  <Pencil size={14} />
                </button>
                {deleteId === proj.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteMutation.mutate({ id: proj.id })} className="text-xs text-red-400 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20">Confirmar</button>
                    <button onClick={() => setDeleteId(null)} className="text-xs text-conexus-text-muted px-2 py-1">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(proj.id)} className="p-2 rounded-lg text-conexus-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors">
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
