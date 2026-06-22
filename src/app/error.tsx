"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Global error boundary for the Next.js App Router.
 * Catches unhandled errors in the component tree and renders a recovery UI.
 * Must be a Client Component.
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to an error reporting service in production
    if (process.env.NODE_ENV === "production") {
      console.error("[GlobalError]", error.digest ?? error.message);
    } else {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-conexus-dark px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={24} className="text-red-400" aria-hidden="true" />
        </div>

        <h1 className="font-outfit text-2xl font-semibold mb-3">
          Algo deu errado
        </h1>

        <p className="text-conexus-text-secondary mb-2 leading-relaxed">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>

        {/* Error digest for support reference */}
        {error.digest && (
          <p className="text-xs text-conexus-text-muted mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Tentar novamente
          </button>
          <a href="/" className="btn-secondary">
            Voltar ao início
          </a>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-4 font-mono">
            <summary className="cursor-pointer mb-2 font-semibold">
              Stack trace (dev only)
            </summary>
            <pre className="whitespace-pre-wrap overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
