import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { getAbsoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Conexus. Diagnóstico gratuito do seu processo e proposta em até 48 horas. Sem compromisso.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Fale com a Conexus - Diagnóstico gratuito",
    description: "Diagnóstico gratuito do seu processo e proposta em 48h.",
    url: getAbsoluteUrl("/contato"),
  },
};

export default function ContatoPage() {
  return (
    <>
      {/* JSON-LD: ContactPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contato - Conexus Tecnologia",
            url: getAbsoluteUrl("/contato"),
            description:
              "Entre em contato com a Conexus para um diagnóstico gratuito.",
          }),
        }}
      />

      {/* Page header */}
      <div className="pt-32 pb-4 section-container">
        <span className="cnx-eyebrow mb-5"><span className="dot" />Entre em contato</span>
        <h1 className="cnx-display text-4xl md:text-5xl mb-4 max-w-2xl">
          Vamos resolver seu{" "}
          <span className="cnx-grad-text">problema juntos</span>
        </h1>
        <p className="cnx-lead max-w-xl">
          Diagnóstico gratuito. Proposta em 48 horas. Sem jargão técnico,
          sem enrolação.
        </p>
      </div>

      {/* Reuse the landing page ContactSection - id="contato" for anchor nav */}
      <ContactSection />
    </>
  );
}
