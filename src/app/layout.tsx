import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_CONFIG } from "@/lib/siteConfig";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} – Förseningsersättning på tåg, SL & flyg ${SITE_CONFIG.year}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.tagline,
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(SITE_CONFIG.googleVerificationToken
    ? {
        verification: {
          google: SITE_CONFIG.googleVerificationToken,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${ibmPlexSans.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[#F6F5F1] text-zinc-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {SITE_CONFIG.cloudflareAnalyticsToken ? (
          <Script
            id="cf-web-analytics"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: SITE_CONFIG.cloudflareAnalyticsToken,
              spa: true,
            })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
