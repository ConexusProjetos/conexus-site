import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export function formatCurrency(cents: number | null | undefined): string {
  if (cents == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceRange(
  baseCents: number | null | undefined,
  monthlyCents: number | null | undefined
): { base: string; monthly: string | null } {
  return {
    base: baseCents ? `A partir de ${formatCurrency(baseCents)}` : "Sob consulta",
    monthly: monthlyCents ? `${formatCurrency(monthlyCents)}/mês` : null,
  };
}

// ─── Date ─────────────────────────────────────────────────────────────────────
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", options).format(new Date(date));
}

export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
}

// ─── Text ──────────────────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// ─── URL / SEO ────────────────────────────────────────────────────────────────
export function getAbsoluteUrl(path: string = "/"): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://conexus.com.br";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function buildOgImageUrl(params: {
  title: string;
  description?: string;
}): string {
  // Placeholder - in a future phase we'll add a /api/og route
  return getAbsoluteUrl("/assets/og-default.png");
}

// ─── Validation ───────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length === 13) return `+${digits}`;
  if (digits.length === 11) return `+55${digits}`;
  return `+${digits}`;
}
