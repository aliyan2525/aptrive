"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/gtag";

/** Fires a GA4 pageview whenever the App Router's pathname/search params
 * change. Needs its own component wrapped in Suspense because
 * useSearchParams() opts the tree into client-side rendering. */
function GAPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GAPageviewTracker />
      </Suspense>
    </>
  );
}
