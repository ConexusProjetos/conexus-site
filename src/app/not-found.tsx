import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home, MessageSquare } from "lucide-react";
import { NotFoundArt } from "@/components/illustrations/Illustrations";

export const metadata: Metadata = {
  title: "Página não encontrada - Conexus",
  description: "A página que você procura não existe ou foi movida.",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { label: "Início", href: "/", icon: Home },
  { label: "Serviços", href: "/#servicos", icon: null },
  { label: "Portfólio", href: "/portfolio", icon: null },
  { label: "Blog", href: "/blog", icon: null },
  { label: "Contato", href: "/contato", icon: MessageSquare },
];

export default function NotFound() {
  return (
    <div className="cnx-theme">
      <Header />

      <main className="min-h-[80vh] flex items-center justify-center px-4 py-32">
        {/* Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,165,183,0.07), transparent)",
          }}
        />

        <div className="relative z-10 text-center max-w-lg">
          {/* 404 number */}
          <div
            className="font-outfit text-[160px] font-bold leading-none mb-4 select-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,165,183,0.15) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            aria-hidden="true"
          >
            404
          </div>

          {/* Ilustração */}
          <NotFoundArt className="w-56 sm:w-64 mx-auto mb-4" />

          <h1 className="font-outfit text-2xl font-semibold mb-3">
            Página não encontrada
          </h1>

          <p className="text-conexus-text-secondary leading-relaxed mb-8">
            A página que você procura não existe, foi movida ou o endereço
            está incorreto. Mas a gente pode te ajudar a encontrar o que
            precisa.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link href="/" className="btn-primary">
              <Home size={16} aria-hidden="true" />
              Voltar ao início
            </Link>
            <Link href="/contato" className="btn-secondary">
              <MessageSquare size={16} aria-hidden="true" />
              Falar com a gente
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-conexus-dark-border pt-8">
            <p className="text-xs text-conexus-text-muted mb-4 uppercase tracking-wider">
              Ou acesse diretamente
            </p>
            <nav className="flex flex-wrap justify-center gap-2" aria-label="Links rápidos">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-conexus-text-secondary hover:text-conexus-cyan border border-conexus-dark-border hover:border-conexus-cyan/30 px-4 py-1.5 rounded-full transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
