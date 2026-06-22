/**
 * Google Analytics 4 utilities.
 * Only active when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('contact_form_submitted', { service: 'Controle de Estoque' });
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/** Send a pageview to GA4 */
export function pageview(url: string): void {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("config", GA_ID, { page_path: url });
}

/** Track a custom event */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("event", action, params);
}

// ─── Convenience event helpers ────────────────────────────────────────────────

export const analytics = {
  /** Contact form successfully submitted */
  contactSubmitted(service?: string) {
    trackEvent("contact_form_submitted", {
      service: service ?? "unknown",
      event_category: "lead",
    });
  },

  /** CTA button clicked */
  ctaClicked(label: string, location: string) {
    trackEvent("cta_clicked", {
      cta_label: label,
      page_location: location,
      event_category: "engagement",
    });
  },

  /** Blog post read (scroll > 50%) */
  articleRead(slug: string, title: string) {
    trackEvent("article_read", {
      article_slug: slug,
      article_title: title,
      event_category: "content",
    });
  },

  /** Portfolio project viewed */
  projectViewed(slug: string, client?: string) {
    trackEvent("project_viewed", {
      project_slug: slug,
      client: client ?? "unknown",
      event_category: "portfolio",
    });
  },

  /** WhatsApp link clicked */
  whatsappClicked(source: string) {
    trackEvent("whatsapp_clicked", {
      source,
      event_category: "contact",
    });
  },
};
