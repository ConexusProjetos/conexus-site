import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemsSection } from "@/components/sections/ProblemsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Conexus - Tecnologia que resolve. Simples assim.",
  description:
    "Resolvemos problemas operacionais de pequenas e médias empresas com soluções tecnológicas simples, personalizadas e entregues sob demanda. Controle de estoque, sistemas internos, automação e muito mais.",
  alternates: {
    canonical: "/",
  },
};

/**
 * Home page - Landing page da Conexus.
 * Mixes Server Components (HeroSection, ServicesSection, TestimonialsSection)
 * with Client Components (ContactSection) for optimal performance + interactivity.
 */
export default function HomePage() {
  return (
    <div className="cnx-theme">
      {/* JSON-LD: LocalBusiness schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Conexus Tecnologia",
            description:
              "Resolvemos problemas operacionais de pequenas e médias empresas com soluções tecnológicas simples e personalizadas.",
            url: "https://conexus.com.br",
            telephone: "+55-85-98553-5362",
            email: "contato@conexus.com.br",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Fortaleza",
              addressRegion: "CE",
              addressCountry: "BR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -3.7172,
              longitude: -38.5431,
            },
            areaServed: {
              "@type": "State",
              name: "Ceará",
            },
            serviceType: [
              "Desenvolvimento de Software",
              "Automação de Processos",
              "Controle de Estoque",
              "Sistemas de CRM",
              "Dashboards e Relatórios",
              "Integrações de Sistemas",
            ],
            priceRange: "R$500 a R$1500",
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:00",
              closes: "18:00",
            },
            sameAs: [
              "https://wa.me/5585985535362",
            ],
          }),
        }}
      />

      <Header />

      <main id="main-content">
        <HeroSection />
        <ProblemsSection />
        <ServicesSection />
        <ProcessSection />
        <HowWeWorkSection />
        <ValuesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
