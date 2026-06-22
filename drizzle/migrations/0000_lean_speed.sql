CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#00A5B7',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image_url" varchar(500),
	"category_id" integer,
	"author_id" integer,
	"tags" json DEFAULT '[]'::json,
	"read_time_minutes" integer DEFAULT 5,
	"meta_title" varchar(255),
	"meta_description" text,
	"og_image_url" varchar(500),
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"whatsapp" varchar(50),
	"service" varchar(255),
	"message" text NOT NULL,
	"source" varchar(100) DEFAULT 'website',
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"ip_address" varchar(45),
	"is_read" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" varchar(400),
	"description" text NOT NULL,
	"client" varchar(255),
	"client_sector" varchar(255),
	"category_id" integer,
	"tags" json DEFAULT '[]'::json,
	"image_url" varchar(500),
	"images" json DEFAULT '[]'::json,
	"project_url" varchar(500),
	"result_metrics" json DEFAULT '[]'::json,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"completed_at" timestamp,
	"meta_title" varchar(255),
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"short_description" varchar(300),
	"icon" varchar(100),
	"features" json DEFAULT '[]'::json,
	"base_price_cents" integer,
	"monthly_price_cents" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(255),
	"author_company" varchar(255),
	"author_avatar_url" varchar(500),
	"content" text NOT NULL,
	"rating" integer DEFAULT 5,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"avatar_url" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "blog_posts_category_idx" ON "blog_posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "contact_messages_read_idx" ON "contact_messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "contact_messages_created_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_categories_slug_idx" ON "project_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_category_idx" ON "projects" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("is_featured");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");