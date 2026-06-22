"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_ID, pageview } from "@/lib/analytics";

/** Tracks client-side navigation for SPA-like route changes */
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Injects the GA4 scripts and tracks route changes.
 * Rendered in root layout - only active in production with GA_ID set.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              send_page_view: false,
              anonymize_ip: true
            });
          `,
        }}
      />
      {/* Suspense required because useSearchParams() suspends */}
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
