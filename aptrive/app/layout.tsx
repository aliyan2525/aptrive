import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import appleIcon180 from "./apple-icon-180x180.png";
import icon192 from "./icon-192x192.png";
import icon32 from "./icon-32x32.png";
import logoTransparentFull from "./logo-transparent-full.webp";


import { OrganizationSchema } from "@/components/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";


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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // allows a11y zooming but handles default sizing well
  themeColor: "#ffffff",
};

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
    images: [
      {
        url: logoTransparentFull.src,
        alt: "Aptrive",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aptrive — Master the Test. Unlock Your Future.",
    description:
      "Intelligent preparation platform for Pakistan's competitive university entrance examinations.",
    images: [logoTransparentFull.src],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: icon32.src, type: "image/png", sizes: "32x32" },
      { url: icon192.src, type: "image/png", sizes: "192x192" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: appleIcon180.src, type: "image/png", sizes: "180x180" }],
    other: [
      { rel: "android-chrome", url: icon192.src, sizes: "192x192" },
      { rel: "mask-icon", url: icon32.src, color: "#6f45ff" },
    ],
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

        <main className="flex-1">
          {children}
        </main>

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
