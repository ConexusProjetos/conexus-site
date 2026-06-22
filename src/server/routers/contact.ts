import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { contactMessages } from "../db/schema";
import { sendLeadNotification } from "@/lib/email";

const contactInput = z.object({
  name: z.string().min(2, "Nome muito curto").max(255),
  email: z.string().email("E-mail inválido"),
  company: z.string().max(255).optional(),
  whatsapp: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,20}$/, "WhatsApp inválido")
    .optional(),
  service: z.string().max(255).optional(),
  message: z.string().min(20, "Mensagem muito curta").max(5000),
  // UTM tracking
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export const contactRouter = createTRPCRouter({
  /**
   * Public - submit a contact / lead form.
   * Saves to DB and sends email notification to the team.
   */
  submit: publicProcedure
    .input(contactInput)
    .mutation(async ({ ctx, input }) => {
      // Extract IP from request headers (X-Forwarded-For from Vercel/Railway)
      const ipAddress =
        ctx.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        ctx.req.headers.get("x-real-ip") ??
        null;

      const [message] = await ctx.db
        .insert(contactMessages)
        .values({
          ...input,
          ipAddress: ipAddress ?? undefined,
          source: "website",
        })
        .returning();

      // Fire-and-forget email - don't fail the request if email fails
      sendLeadNotification(message).catch((err) => {
        console.error("[contact] Failed to send lead notification:", err);
      });

      return {
        success: true,
        id: message.id,
      };
    }),

  // ─── Admin endpoints ─────────────────────────────────────────────────────

  adminList: adminProcedure
    .input(
      z.object({
        unreadOnly: z.boolean().default(false),
        limit: z.number().int().min(1).max(100).default(50),
        page: z.number().int().min(1).default(1),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const filters = [eq(contactMessages.isArchived, false)];
      if (input?.unreadOnly) {
        filters.push(eq(contactMessages.isRead, false));
      }

      return ctx.db.query.contactMessages.findMany({
        where: and(...filters),
        orderBy: desc(contactMessages.createdAt),
        limit: input?.limit ?? 50,
        offset: ((input?.page ?? 1) - 1) * (input?.limit ?? 50),
      });
    }),

  /** Mark message as read */
  markRead: adminProcedure
    .input(z.object({ id: z.number(), isRead: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(contactMessages)
        .set({ isRead: input.isRead })
        .where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  /** Archive message */
  archive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(contactMessages)
        .set({ isArchived: true })
        .where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  /** Save internal notes for a message */
  saveNotes: adminProcedure
    .input(z.object({ id: z.number(), notes: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(contactMessages)
        .set({ notes: input.notes })
        .where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  /** Unread count - for admin nav badge */
  unreadCount: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(contactMessages)
      .where(
        and(
          eq(contactMessages.isRead, false),
          eq(contactMessages.isArchived, false)
        )
      );
    return { count: result.length };
  }),
});
