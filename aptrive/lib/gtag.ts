// GA4 helper. Keep the measurement ID here (with an env override) so it's
// not hardcoded in multiple places. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to
// your env if you ever want to point a preview/staging deploy at a
// different GA4 property.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-P54K9EKZBY";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Send a pageview. Needed because gtag.js's automatic pageview only fires
 * on a hard load — client-side route changes in the App Router need this
 * called manually (see components/analytics/GoogleAnalytics.tsx). */
export function pageview(url: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: url,
  });
}

type GAEventParams = Record<string, string | number | boolean | undefined>;

/** Send a custom GA4 event, e.g. event("calculator_used", { university: "NUST" }). */
export function event(action: string, params: GAEventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}
