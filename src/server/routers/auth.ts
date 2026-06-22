import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { users } from "../db/schema";
import { signToken } from "@/lib/auth";

export const authRouter = createTRPCRouter({
  /**
   * Login - validates credentials and returns a signed JWT.
   * The client must then call POST /api/auth/set-token to store
   * the token as an httpOnly cookie.
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "Senha muito curta"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email.toLowerCase()),
      });

      if (!user || !user.isActive) {
        // Use same message to avoid user enumeration
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "E-mail ou senha inválidos.",
        });
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "E-mail ou senha inválidos.",
        });
      }

      const token = await signToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      };
    }),

  /**
   * Returns the currently authenticated user.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
    }

    return user;
  }),

  /**
   * Change password (requires current password).
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(6),
        newPassword: z
          .string()
          .min(8, "A nova senha precisa ter pelo menos 8 caracteres"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const match = await bcrypt.compare(input.currentPassword, user.password);
      if (!match) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Senha atual incorreta.",
        });
      }

      const hashed = await bcrypt.hash(input.newPassword, 12);
      await ctx.db
        .update(users)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
});
