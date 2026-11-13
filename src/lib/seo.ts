import type { Metadata } from "next";
import { SITE_CONFIG } from "./siteConfig";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

/**
 * Bygger konsekvent Next.js Metadata med kanonisk URL och svensk OpenGraph-data.
 */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const canonicalUrl = `${SITE_CONFIG.url}${normalizedPath}`;
  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath || "/",
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: "website",
    },
  };
}

/**
 * Bygger BreadcrumbList JSON-LD för tydliga brödsmulor i sökresultat.
 */
export function buildBreadcrumbJsonLd(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * Bygger WebApplication JSON-LD för interaktiva kalkylatorsidor.
 */
export function buildWebAppJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: `${SITE_CONFIG.url}${input.path === "/" ? "" : input.path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "sv-SE",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
  };
}

/**
 * Bygger Article JSON-LD för djupa rättighetsguider.
 */
export function buildArticleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  dateModified: string;
}) {
  const url = `${SITE_CONFIG.url}${input.path === "/" ? "" : input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: url,
    inLanguage: "sv-SE",
    datePublished: input.dateModified,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}
