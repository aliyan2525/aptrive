import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";


import { OrganizationSchema } from "@/components/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Scene3DProvider } from "@/components/three/Scene3DProvider";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";
import PageTransition from "@/components/transitions/PageTransition";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aptrive.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Aptrive — Master the Test. Unlock Your Future.",
    template: "%s · Aptrive",
  },

  description:
    "Aptrive is an intelligent learning platform for Pakistan's most competitive university entrance examinations — structured education, analytics, and modern technology built for ambitious students.",

  keywords: [
    "NUST NET",
    "FAST NU",
    "ECAT",
    "MDCAT",
    "Pakistan",
    "University Admission",
    "Entry Test",
    "Practice MCQs",
    "Learning Platform",
    "Aptrive",
  ],

  authors: [
    {
      name: "Aptrive",
    },
  ],

  creator: "Aptrive",

  publisher: "Aptrive",

  robots: {
    index: true,
    follow: true,
  },

  // Google Search Console domain verification (Phase 11). Next.js's
  // Metadata API renders this as
  // <meta name="google-site-verification" content="..." /> in <head>.
  verification: {
    google: "Q59yO2kRrObxD1htTeWTxHH1AEvr-jyJITXkHuB2-ZU",
  },

  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Aptrive",
    title: "Aptrive — Master the Test. Unlock Your Future.",
    description:
      "Intelligent preparation platform for Pakistan's competitive university entrance examinations.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aptrive — Master the Test. Unlock Your Future.",
    description:
      "Intelligent preparation platform for Pakistan's competitive university entrance examinations.",
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-graphite text-fg antialiased">
        <OrganizationSchema />

        <SmoothScrollProvider>
          <Scene3DProvider>
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
          </Scene3DProvider>
        </SmoothScrollProvider>

        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />

        {/* Google Analytics 4 (Phase 11) */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
