import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { verifyToken } from "@/lib/auth";
import { db } from "./db";

export type UserContext = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type Context = {
  db: typeof db;
  user: UserContext | null;
  req: Request;
};

export async function createContext({
  req,
}: FetchCreateContextFnOptions): Promise<Context> {
  let user: UserContext | null = null;

  // 1. Try Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = await verifyToken(token);
      user = payload as UserContext;
    } catch {
      // invalid / expired - ignore
    }
  }

  // 2. Try cookie: conexus-token=<token>
  if (!user) {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const match = cookieHeader.match(/(?:^|;\s*)conexus-token=([^;]+)/);
    if (match?.[1]) {
      try {
        const payload = await verifyToken(match[1]);
        user = payload as UserContext;
      } catch {
        // invalid / expired - ignore
      }
    }
  }

  return { db, user, req };
}
