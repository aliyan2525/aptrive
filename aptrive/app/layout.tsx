import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-graphite text-fg antialiased">
        <StructuredData />

        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}