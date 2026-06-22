import {
  Boxes,
  Monitor,
  BarChart3,
  Settings2,
  Link2,
  Database,
  Workflow,
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Calendar,
  Mail,
  Users,
  FileText,
  Zap,
  CreditCard,
  Truck,
  ScanLine,
  Globe,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro de ícones SVG dos serviços.
 * O campo `service.icon` guarda uma CHAVE (string) deste registro, não um emoji.
 * O seletor do admin escolhe entre estas opções; o site renderiza o SVG via <ServiceIcon>.
 */
export const SERVICE_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "boxes", label: "Estoque", Icon: Boxes },
  { key: "monitor", label: "Sistema interno", Icon: Monitor },
  { key: "bar-chart", label: "Dashboard", Icon: BarChart3 },
  { key: "settings", label: "Automação", Icon: Settings2 },
  { key: "integration", label: "Integração", Icon: Link2 },
  { key: "database", label: "Dados", Icon: Database },
  { key: "workflow", label: "Processos", Icon: Workflow },
  { key: "dashboard", label: "Painel", Icon: LayoutDashboard },
  { key: "bot", label: "Bot / IA", Icon: Bot },
  { key: "shield", label: "Segurança", Icon: ShieldCheck },
  { key: "calendar", label: "Agenda", Icon: Calendar },
  { key: "mail", label: "Comunicação", Icon: Mail },
  { key: "users", label: "CRM", Icon: Users },
  { key: "file", label: "Relatórios", Icon: FileText },
  { key: "zap", label: "Performance", Icon: Zap },
  { key: "payments", label: "Financeiro", Icon: CreditCard },
  { key: "logistics", label: "Logística", Icon: Truck },
  { key: "scan", label: "Código de barras", Icon: ScanLine },
  { key: "web", label: "Web", Icon: Globe },
  { key: "wrench", label: "Genérico", Icon: Wrench },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SERVICE_ICONS.map((s) => [s.key, s.Icon])
);

const DEFAULT_KEY = "boxes";

/** Resolve o valor salvo (chave) para uma chave válida; desconhecidos/legados caem no padrão. */
export function resolveServiceIconKey(icon?: string | null): string {
  if (icon && ICON_MAP[icon]) return icon;
  return DEFAULT_KEY;
}

/** Renderiza o ícone SVG do serviço a partir da chave salva. */
export function ServiceIcon({
  icon,
  size = 24,
  className,
}: {
  icon?: string | null;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[resolveServiceIconKey(icon)] ?? Boxes;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
