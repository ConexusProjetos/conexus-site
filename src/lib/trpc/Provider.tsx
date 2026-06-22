"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { api } from "./client";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // relative in browser
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data fresh for 30s on the client
        staleTime: 30 * 1000,
        // Don't retry on 4xx errors
        retry: (failureCount, error) => {
          if ((error as any)?.data?.httpStatus >= 400) return false;
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // Log tRPC errors in development
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          // Attach auth token from cookie (httpOnly) is handled server-side;
          // this is for client-side requests that need the cookie forwarded
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
