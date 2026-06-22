"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConexusLogo } from "@/components/redesign/ConexusLogo";

const NAV_LINKS = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Como funciona", href: "/#processo" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/85 backdrop-blur-md border-b shadow-[0_1px_20px_-8px_rgba(13,22,48,0.18)]"
            : "bg-transparent"
        )}
        style={isScrolled ? { borderColor: "var(--cnx-line)" } : undefined}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" aria-label="Conexus - página inicial" className="flex items-center">
              <ConexusLogo className="h-6 md:h-7 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" role="navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--cnx-ink-2)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a href="/#contato" className="cnx-btn cnx-btn-primary text-sm py-2.5 px-5">
                Fale com a gente
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: "var(--cnx-ink-2)" }}
              aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300 bg-white",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <nav className="flex flex-col gap-1 flex-1" role="navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center py-4 text-xl font-medium border-b transition-colors"
                style={{ color: "var(--cnx-ink)", borderColor: "var(--cnx-line)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="/#contato"
            onClick={() => setIsMobileOpen(false)}
            className="cnx-btn cnx-btn-primary w-full text-base mt-6"
          >
            Fale com a gente
          </a>
        </div>
      </div>
    </>
  );
}
