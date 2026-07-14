"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { ContactModal } from "@/components/ui/ContactModal";
import { cn } from "@/lib/utils";
import { Send, Loader2, Mail } from "lucide-react";

const SERVICE_OPTIONS = [
  "Controle de Estoque",
  "Sistema Interno Personalizado",
  "Dashboard / Relatórios",
  "Automação de Tarefas",
  "Integração entre Sistemas",
  "Outro / Não sei ainda",
];

type FormState = {
  name: string;
  email: string;
  company: string;
  whatsapp: string;
  service: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  whatsapp: "",
  service: "",
  message: "",
};

export function ContactSection() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      setSubmittedName(form.name);
      setForm(INITIAL_STATE);
      setErrors({});
      setModalOpen(true);
    },
    onError: (err) => {
      console.error("Contact submit error:", err);
    },
  });

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim() || form.name.length < 2)
      newErrors.name = "Nome obrigatório (mínimo 2 caracteres)";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "E-mail inválido";
    if (!form.message.trim() || form.message.length < 20)
      newErrors.message = "Mensagem muito curta (mínimo 20 caracteres)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      company: form.company || undefined,
      whatsapp: form.whatsapp || undefined,
      service: form.service || undefined,
      message: form.message,
    });
  }

  const isLoading = submitMutation.isPending;
  const req = <span style={{ color: "var(--cnx-teal)" }} aria-hidden="true">*</span>;
  const labelCls = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--cnx-ink)" } as const;

  return (
    <>
      <section id="contato" className="cnx-section cnx-subtle" aria-label="Entre em contato">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: info */}
            <div>
              <span className="cnx-eyebrow mb-5"><span className="dot" />Vamos conversar</span>
              <h2 className="cnx-h2 mb-6">
                Diagnóstico gratuito,{" "}
                <span className="cnx-grad-text">proposta em 48h</span>
              </h2>
              <p className="cnx-body leading-relaxed mb-8">
                Conta seu problema. A gente escuta, entende e te diz exatamente
                o que pode ser feito, sem compromisso, sem enrolação.
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/5585985535362"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 cnx-card cnx-card-hover"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,211,102,0.1)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--cnx-ink)" }}>WhatsApp</div>
                    <div className="text-xs cnx-muted">(85) 9 8553-5362</div>
                  </div>
                </a>

                <a href="mailto:contato@conexus.com.br" className="flex items-center gap-4 p-4 cnx-card cnx-card-hover">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(47, 68, 159,0.08)", color: "var(--cnx-blue)" }}>
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--cnx-ink)" }}>E-mail</div>
                    <div className="text-xs cnx-muted">contato@conexus.com.br</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className="cnx-card p-7 md:p-9">
              {submitMutation.isError && (
                <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c" }}>
                  Erro ao enviar mensagem. Tente novamente ou entre em contato
                  pelo WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelCls} style={labelStyle}>Nome {req}</label>
                    <input
                      id="name" name="name" type="text" autoComplete="name"
                      value={form.name} onChange={handleChange}
                      placeholder="Seu nome completo"
                      className={cn("cnx-input", errors.name && "!border-red-500")}
                      aria-required="true" aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p id="name-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls} style={labelStyle}>E-mail {req}</label>
                    <input
                      id="email" name="email" type="email" autoComplete="email"
                      value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className={cn("cnx-input", errors.email && "!border-red-500")}
                      aria-required="true" aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className={labelCls} style={labelStyle}>Empresa <span className="text-xs cnx-muted">(opcional)</span></label>
                    <input id="company" name="company" type="text" autoComplete="organization" value={form.company} onChange={handleChange} placeholder="Nome da empresa" className="cnx-input" />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className={labelCls} style={labelStyle}>WhatsApp <span className="text-xs cnx-muted">(opcional)</span></label>
                    <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" value={form.whatsapp} onChange={handleChange} placeholder="(85) 9 0000-0000" className="cnx-input" />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className={labelCls} style={labelStyle}>Qual serviço te interessa?</label>
                  <select
                    id="service" name="service" value={form.service} onChange={handleChange}
                    className="cnx-input appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7488' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Selecionar serviço...</option>
                    {SERVICE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelCls} style={labelStyle}>Seu problema ou projeto {req}</label>
                  <textarea
                    id="message" name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Descreva brevemente o que você precisa resolver. Ex: Hoje controlamos o estoque em planilha Excel e perdemos muito tempo..."
                    className={cn("cnx-input resize-none", errors.message && "!border-red-500")}
                    aria-required="true" aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && <p id="message-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.message}</p>}
                  <p className="mt-1.5 text-xs cnx-muted">{form.message.length}/5000</p>
                </div>

                <button type="submit" disabled={isLoading} className="cnx-btn cnx-btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Enviando...</>
                  ) : (
                    <><Send size={18} aria-hidden="true" />Enviar mensagem</>
                  )}
                </button>

                <p className="text-xs cnx-muted text-center">
                  Suas informações são confidenciais. Respondemos em até 48h úteis.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} leadName={submittedName} />
    </>
  );
}
