"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { formatDate, truncate } from "@/lib/utils";
import {
  Mail,
  MailOpen,
  Archive,
  MessageSquare,
  X,
  Phone,
  Building2,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/server/db/schema";

function MessageModal({
  message,
  onClose,
}: {
  message: ContactMessage;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const [notes, setNotes] = useState(message.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);

  const markRead = api.contact.markRead.useMutation({
    onSuccess: () => utils.contact.adminList.invalidate(),
  });
  const archive = api.contact.archive.useMutation({
    onSuccess: () => { utils.contact.adminList.invalidate(); onClose(); },
  });
  const saveNotes = api.contact.saveNotes.useMutation({
    onSuccess: () => {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
      utils.contact.adminList.invalidate();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-conexus-dark-card border border-conexus-dark-border rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-conexus-dark-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-conexus-cyan/10 border border-conexus-cyan/20 flex items-center justify-center font-semibold text-conexus-cyan">
              {message.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold">{message.name}</h2>
              <p className="text-sm text-conexus-text-muted">{formatDate(message.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-conexus-text-muted hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-conexus-cyan flex-shrink-0" />
              <a href={`mailto:${message.email}`} className="text-conexus-cyan hover:underline truncate">{message.email}</a>
            </div>
            {message.whatsapp && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-conexus-cyan flex-shrink-0" />
                <a href={`https://wa.me/${message.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-conexus-cyan hover:underline">{message.whatsapp}</a>
              </div>
            )}
            {message.company && (
              <div className="flex items-center gap-2 text-sm text-conexus-text-secondary">
                <Building2 size={14} className="flex-shrink-0" />
                {message.company}
              </div>
            )}
            {message.service && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-conexus-cyan/10 text-conexus-cyan border border-conexus-cyan/20 px-2 py-1 rounded-full">{message.service}</span>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-2">Mensagem</p>
            <div className="p-4 bg-black/20 rounded-xl text-sm text-conexus-text-secondary leading-relaxed whitespace-pre-wrap border border-conexus-dark-border">
              {message.message}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-2">Notas internas</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Adicione anotações internas sobre este lead..."
              className="input-base w-full resize-none text-sm"
            />
            <button
              onClick={() => saveNotes.mutate({ id: message.id, notes })}
              disabled={saveNotes.isPending}
              className="mt-2 flex items-center gap-2 text-xs text-conexus-cyan hover:text-conexus-cyan-light transition-colors disabled:opacity-50"
            >
              {saveNotes.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {notesSaved ? "Salvo!" : "Salvar notas"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-conexus-dark-border flex-shrink-0">
          <button
            onClick={() => markRead.mutate({ id: message.id, isRead: !message.isRead })}
            disabled={markRead.isPending}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            {message.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
            {message.isRead ? "Marcar como não lida" : "Marcar como lida"}
          </button>
          <button
            onClick={() => archive.mutate({ id: message.id })}
            disabled={archive.isPending}
            className="flex items-center gap-2 text-sm text-conexus-text-muted hover:text-red-400 transition-colors ml-auto"
          >
            <Archive size={14} />
            Arquivar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMensagensPage() {
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const utils = api.useUtils();

  const { data: messages, isLoading } = api.contact.adminList.useQuery({ unreadOnly });

  const markRead = api.contact.markRead.useMutation({
    onSuccess: () => utils.contact.adminList.invalidate(),
  });

  return (
    <>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-2xl font-semibold mb-1">Mensagens</h1>
            <p className="text-sm text-conexus-text-muted">Leads e contatos recebidos pelo site</p>
          </div>
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={cn(
              "flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all",
              unreadOnly
                ? "bg-conexus-cyan/10 text-conexus-cyan border-conexus-cyan/30"
                : "border-conexus-dark-border text-conexus-text-muted hover:text-white"
            )}
          >
            <Filter size={14} />
            {unreadOnly ? "Todas" : "Não lidas"}
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card-glass h-16 animate-pulse" />
            ))}
          </div>
        ) : !messages?.length ? (
          <div className="card-glass p-16 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-conexus-text-muted opacity-40" />
            <p className="text-conexus-text-muted">
              {unreadOnly ? "Nenhuma mensagem não lida." : "Nenhuma mensagem ainda."}
            </p>
          </div>
        ) : (
          <div className="card-glass overflow-hidden">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-4 p-4 cursor-pointer transition-colors",
                  i < messages.length - 1 && "border-b border-conexus-dark-border",
                  !msg.isRead && "bg-conexus-cyan/[0.03]",
                  "hover:bg-white/[0.03]"
                )}
                onClick={() => { setSelected(msg); if (!msg.isRead) markRead.mutate({ id: msg.id, isRead: true }); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(msg)}
              >
                {/* Unread indicator */}
                <div className="flex-shrink-0 mt-1">
                  {!msg.isRead ? (
                    <div className="w-2 h-2 rounded-full bg-conexus-cyan" aria-label="Não lida" />
                  ) : (
                    <div className="w-2 h-2" />
                  )}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-conexus-cyan/10 border border-conexus-cyan/20 flex items-center justify-center text-xs font-semibold text-conexus-cyan flex-shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={cn("text-sm font-medium", !msg.isRead ? "text-white" : "text-conexus-text-secondary")}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-conexus-text-muted">{msg.email}</span>
                    {msg.service && (
                      <span className="text-xs bg-conexus-cyan/10 text-conexus-cyan border border-conexus-cyan/20 px-2 py-0.5 rounded-full">
                        {msg.service}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-conexus-text-muted truncate">{truncate(msg.message, 100)}</p>
                </div>

                {/* Date */}
                <div className="text-xs text-conexus-text-muted flex-shrink-0 text-right">
                  <div>{new Date(msg.createdAt).toLocaleDateString("pt-BR")}</div>
                  {msg.company && <div className="text-conexus-text-muted/60">{msg.company}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <MessageModal message={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
