"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { ConexusMark } from "@/components/redesign/ConexusLogo";
import { LoginBackdrop } from "@/components/illustrations/Illustrations";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState("");

  const loginMutation = api.auth.login.useMutation({
    onSuccess: async ({ token }) => {
      // Store token as httpOnly cookie
      const res = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        setClientError("Erro ao salvar sessão. Tente novamente.");
        return;
      }
      router.push("/admin");
      router.refresh();
    },
    onError: (err) => {
      setClientError(err.message ?? "Credenciais inválidas.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError("");

    if (!email || !password) {
      setClientError("Preencha e-mail e senha.");
      return;
    }
    loginMutation.mutate({ email, password });
  }

  const isLoading = loginMutation.isPending;
  const errorMessage = clientError || (loginMutation.isError ? loginMutation.error?.message : "");

  return (
    <div className="cnx-theme min-h-screen flex items-center justify-center bg-conexus-dark px-4">
      {/* Fundo de marca (órbitas + gradiente) */}
      <LoginBackdrop className="fixed inset-0 pointer-events-none overflow-hidden" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <ConexusMark className="w-14 h-14 mx-auto mb-4" />
          <h1 className="font-outfit text-2xl font-semibold">Painel Admin</h1>
          <p className="text-sm text-conexus-text-muted mt-1">Conexus Tecnologia</p>
        </div>

        {/* Card */}
        <div className="card-glass p-8" style={{ boxShadow: "var(--cnx-shadow-lg)" }}>
          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conexus.com.br"
                className="input-base w-full"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base w-full pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-conexus-text-muted hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={18} aria-hidden="true" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6 text-sm text-conexus-text-muted">
          <a href="/" className="hover:text-conexus-cyan transition-colors">
            ← Voltar ao site
          </a>
        </p>
      </div>
    </div>
  );
}
