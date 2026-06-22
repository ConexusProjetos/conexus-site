"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

/**
 * React hook-based tRPC client.
 * Import `api` in any Client Component to make type-safe API calls.
 *
 * @example
 * const { data } = api.services.list.useQuery();
 */
export const api = createTRPCReact<AppRouter>();
