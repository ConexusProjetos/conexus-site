import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

// Fontes locais (woff2 variáveis) — sem dependência de rede no build.
const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const outfit = localFont({
  src: "./fonts/outfit.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://conexus.com.br"
  ),
  title: {
    default: "Conexus - Tecnologia que resolve. Simples assim.",
    template: "%s | Conexus",
  },
  description:
    "Resolvemos problemas operacionais de pequenas e médias empresas com soluções tecnológicas simples, personalizadas e entregues sob demanda.",
  keywords: [
    "desenvolvimento de software",
    "sistemas para pequenas empresas",
    "automação de processos",
    "controle de estoque",
    "dashboard",
    "integração de sistemas",
    "Fortaleza",
    "Ceará",
    "tecnologia",
  ],
  authors: [{ name: "Conexus Tecnologia" }],
  creator: "Conexus Tecnologia",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://conexus.com.br",
    siteName: "Conexus",
    title: "Conexus - Tecnologia que resolve. Simples assim.",
    description:
      "Resolvemos problemas operacionais de pequenas e médias empresas com soluções tecnológicas simples, personalizadas e entregues sob demanda.",
    images: [
      {
        url: "/api/og?title=Conexus+Tecnologia&description=Tecnologia+que+resolve.+Simples+assim.&type=default",
        width: 1200,
        height: 630,
        alt: "Conexus Tecnologia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conexus - Tecnologia que resolve.",
    description:
      "Soluções tecnológicas simples e personalizadas para pequenas e médias empresas.",
    images: ["/api/og?title=Conexus+Tecnologia&type=default"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Add your Google Search Console verification token here
    // google: "your-verification-token",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00A5B7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-conexus-dark text-white antialiased font-sans"
        suppressHydrationWarning
      >
        <TRPCProvider>{children}</TRPCProvider>
        {/* GA4 - only renders when NEXT_PUBLIC_GA_MEASUREMENT_ID is set */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
