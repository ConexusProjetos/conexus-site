// ─── Re-export DB types ────────────────────────────────────────────────────────
export type {
  User,
  Service,
  Project,
  ProjectCategory,
  BlogPost,
  BlogCategory,
  ContactMessage,
  Testimonial,
} from "@/server/db/schema";

// ─── Navigation ────────────────────────────────────────────────────────────────
export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

// ─── UI State ─────────────────────────────────────────────────────────────────
export type AlertType = "success" | "error" | "warning" | "info";

export type Alert = {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
};

// ─── API Response wrappers ─────────────────────────────────────────────────────
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
};

// ─── SEO ──────────────────────────────────────────────────────────────────────
export type PageMeta = {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
};

// ─── Contact Form ─────────────────────────────────────────────────────────────
export type ContactFormData = {
  name: string;
  email: string;
  company?: string;
  whatsapp?: string;
  service?: string;
  message: string;
};

export type ContactFormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; messageId: number }
  | { status: "error"; message: string };

// ─── Services (frontend display) ──────────────────────────────────────────────
export type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
  features: string[];
  basePrice?: string;
  monthlyPrice?: string;
  slug: string;
};
