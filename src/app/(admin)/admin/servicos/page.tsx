"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { FormField } from "@/components/admin/FormField";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceIcon, SERVICE_ICONS, resolveServiceIconKey } from "@/lib/service-icons";

type ServiceForm = {
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string; // comma-separated in the form
  basePriceCents: string;
  monthlyPriceCents: string;
  isActive: boolean;
  isFeatured: boolean;
  order: string;
};

const EMPTY_FORM: ServiceForm = {
  title: "",
  shortDescription: "",
  description: "",
  icon: "boxes",
  features: "",
  basePriceCents: "",
  monthlyPriceCents: "",
  isActive: true,
  isFeatured: false,
  order: "0",
};

export default function AdminServicosPage() {
  const utils = api.useUtils();
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: services, isLoading } = api.services.adminList.useQuery();

  const createMutation = api.services.create.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); closeForm(); },
  });
  const updateMutation = api.services.update.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); closeForm(); },
  });
  const deleteMutation = api.services.delete.useMutation({
    onSuccess: () => { utils.services.adminList.invalidate(); setDeleteId(null); },
  });
  const toggleMutation = api.services.update.useMutation({
    onSuccess: () => utils.services.adminList.invalidate(),
  });

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(svc: NonNullable<typeof services>[0]) {
    setEditId(svc.id);
    setForm({
      title: svc.title,
      shortDescription: svc.shortDescription ?? "",
      description: svc.description,
      icon: resolveServiceIconKey(svc.icon),
      features: ((svc.features ?? []) as string[]).join(", "),
      basePriceCents: svc.basePriceCents ? String(svc.basePriceCents / 100) : "",
      monthlyPriceCents: svc.monthlyPriceCents ? String(svc.monthlyPriceCents / 100) : "",
      isActive: svc.isActive,
      isFeatured: svc.isFeatured,
      order: String(svc.order),
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const features = form.features.split(",").map((f) => f.trim()).filter(Boolean);
    const basePriceCents = form.basePriceCents ? Math.round(parseFloat(form.basePriceCents) * 100) : undefined;
    const monthlyPriceCents = form.monthlyPriceCents ? Math.round(parseFloat(form.monthlyPriceCents) * 100) : undefined;

    const payload = {
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription || undefined,
      icon: form.icon || undefined,
      features,
      basePriceCents,
      monthlyPriceCents,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      order: parseInt(form.order) || 0,
    };

    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-outfit text-2xl font-semibold mb-1">Serviços</h1>
          <p className="text-sm text-conexus-text-muted">Gerencie o portfólio de serviços da Conexus</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Novo serviço
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="card-glass p-6 mb-6 border-conexus-cyan/20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-semibold">{editId ? "Editar serviço" : "Novo serviço"}</h2>
            <button onClick={closeForm} className="p-1.5 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <FormField id="title" label="Título" name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Controle de Estoque" />
            <FormField id="order" label="Ordem" name="order" type="number" value={form.order} onChange={handleChange} />
            {/* Seletor visual de ícone (SVG) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--cnx-ink)" }}>Ícone</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_ICONS.map(({ key, label, Icon }) => {
                  const active = form.icon === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      title={label}
                      aria-label={label}
                      aria-pressed={active}
                      onClick={() => setForm((p) => ({ ...p, icon: key }))}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors"
                      style={
                        active
                          ? { background: "var(--cnx-grad)", borderColor: "transparent", color: "#fff", boxShadow: "0 6px 14px -6px rgba(47, 68, 159,0.5)" }
                          : { background: "#fff", borderColor: "var(--cnx-line)", color: "var(--cnx-ink-2)" }
                      }
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
            <FormField id="shortDescription" label="Descrição curta" name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Uma linha para o card" className="sm:col-span-2" />
            <FormField as="textarea" id="description" label="Descrição completa" name="description" value={form.description} onChange={handleChange} rows={3} required placeholder="Descrição detalhada..." className="sm:col-span-2" />
            <FormField id="features" label="Funcionalidades (separadas por vírgula)" name="features" value={form.features} onChange={handleChange} placeholder="Funcionalidade 1, Funcionalidade 2" className="sm:col-span-2" hint="Cada vírgula cria um item na lista." />
            <FormField id="basePriceCents" label="Preço base (R$)" name="basePriceCents" type="number" step="0.01" value={form.basePriceCents} onChange={handleChange} placeholder="800" />
            <FormField id="monthlyPriceCents" label="Manutenção mensal (R$)" name="monthlyPriceCents" type="number" step="0.01" value={form.monthlyPriceCents} onChange={handleChange} placeholder="150" />
            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-conexus-cyan w-4 h-4" />
                Ativo (aparece no site)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-conexus-cyan w-4 h-4" />
                Destaque
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={isSaving} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
                {isSaving ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : "Salvar serviço"}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary text-sm py-2 px-4">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Services list */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card-glass h-16 animate-pulse" />)}</div>
      ) : !services?.length ? (
        <div className="card-glass p-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-conexus-text-muted opacity-40" />
          <p className="text-conexus-text-muted mb-4">Nenhum serviço cadastrado ainda.</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-5">Criar primeiro serviço</button>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          {services.map((svc, i) => (
            <div key={svc.id} className={cn("flex items-center gap-4 p-4", i < services.length - 1 && "border-b border-conexus-dark-border")}>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(47, 68, 159,0.07)", color: "var(--cnx-blue)" }}>
                <ServiceIcon icon={svc.icon} size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{svc.title}</span>
                  {svc.isFeatured && <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Destaque</span>}
                  {!svc.isActive && <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Inativo</span>}
                </div>
                <p className="text-xs text-conexus-text-muted truncate mt-0.5">{svc.shortDescription ?? svc.description.slice(0, 80)}</p>
              </div>
              <div className="text-xs text-conexus-text-muted text-right flex-shrink-0 hidden sm:block">
                {svc.basePriceCents ? formatCurrency(svc.basePriceCents) : "-"}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleMutation.mutate({ id: svc.id, data: { isActive: !svc.isActive } })} className="p-2 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors" title={svc.isActive ? "Desativar" : "Ativar"}>
                  {svc.isActive ? <ToggleRight size={16} className="text-conexus-cyan" /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEdit(svc)} className="p-2 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors">
                  <Pencil size={14} />
                </button>
                {deleteId === svc.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteMutation.mutate({ id: svc.id })} className="text-xs text-red-400 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20">Confirmar</button>
                    <button onClick={() => setDeleteId(null)} className="text-xs text-conexus-text-muted px-2 py-1">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(svc.id)} className="p-2 rounded-lg text-conexus-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors">
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
