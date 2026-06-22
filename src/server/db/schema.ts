import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("user"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES  (portfólio de serviços da Conexus - 5 categorias do Kit Fundação)
// ─────────────────────────────────────────────────────────────────────────────
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: varchar("short_description", { length: 300 }),
  icon: varchar("icon", { length: 100 }),         // emoji ou nome de ícone
  features: json("features").$type<string[]>().default([]),
  basePriceCents: integer("base_price_cents"),     // preço em centavos
  monthlyPriceCents: integer("monthly_price_cents"),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const projectCategories = pgTable(
  "project_categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("project_categories_slug_idx").on(t.slug)]
);

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS  (portfólio dinâmico)
// ─────────────────────────────────────────────────────────────────────────────
export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 400 }),
    description: text("description").notNull(),
    client: varchar("client", { length: 255 }),
    clientSector: varchar("client_sector", { length: 255 }),
    categoryId: integer("category_id").references(() => projectCategories.id, {
      onDelete: "set null",
    }),
    tags: json("tags").$type<string[]>().default([]),
    imageUrl: varchar("image_url", { length: 500 }),
    images: json("images").$type<string[]>().default([]),
    projectUrl: varchar("project_url", { length: 500 }),
    // Métricas de resultado (para cases)
    resultMetrics: json("result_metrics").$type<
      { label: string; value: string }[]
    >().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    completedAt: timestamp("completed_at"),
    // SEO
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("projects_slug_idx").on(t.slug),
    index("projects_category_idx").on(t.categoryId),
    index("projects_featured_idx").on(t.isFeatured),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// BLOG CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const blogCategories = pgTable(
  "blog_categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    color: varchar("color", { length: 7 }).default("#00A5B7"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("blog_categories_slug_idx").on(t.slug)]
);

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS  (indexável via SSG - cada post gera página estática)
// ─────────────────────────────────────────────────────────────────────────────
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),     // Markdown ou HTML
    coverImageUrl: varchar("cover_image_url", { length: 500 }),
    categoryId: integer("category_id").references(() => blogCategories.id, {
      onDelete: "set null",
    }),
    authorId: integer("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    tags: json("tags").$type<string[]>().default([]),
    readTimeMinutes: integer("read_time_minutes").default(5),
    // SEO fields
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    ogImageUrl: varchar("og_image_url", { length: 500 }),
    // Status
    isPublished: boolean("is_published").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("blog_posts_slug_idx").on(t.slug),
    index("blog_posts_published_idx").on(t.isPublished),
    index("blog_posts_category_idx").on(t.categoryId),
    index("blog_posts_author_idx").on(t.authorId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT MESSAGES  (leads do formulário + WhatsApp)
// ─────────────────────────────────────────────────────────────────────────────
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    whatsapp: varchar("whatsapp", { length: 50 }),
    service: varchar("service", { length: 255 }),  // serviço selecionado no form
    message: text("message").notNull(),
    // Rastreabilidade
    source: varchar("source", { length: 100 }).default("website"),
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    // Status
    isRead: boolean("is_read").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    notes: text("notes"),                           // notas internas do admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("contact_messages_read_idx").on(t.isRead),
    index("contact_messages_created_idx").on(t.createdAt),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS  (depoimentos - inclui Herbênia S. de repo B)
// ─────────────────────────────────────────────────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 255 }),
  authorCompany: varchar("author_company", { length: 255 }),
  authorAvatarUrl: varchar("author_avatar_url", { length: 500 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
}));

export const projectCategoriesRelations = relations(
  projectCategories,
  ({ many }) => ({ projects: many(projects) })
);

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(projectCategories, {
    fields: [projects.categoryId],
    references: [projectCategories.id],
  }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS  (infer types from schema for use throughout the app)
// ─────────────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ProjectCategory = typeof projectCategories.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
