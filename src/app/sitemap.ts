import type { MetadataRoute } from "next";
import { CONSUMER_GUIDES } from "@/lib/data/guides";
import { OPERATORS } from "@/lib/data/operators";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/tag-och-kollektivtrafik", priority: 0.95, freq: "monthly" as const },
    { path: "/flygersattning", priority: 0.95, freq: "monthly" as const },
    { path: "/reklamationsmall", priority: 0.9, freq: "monthly" as const },
    { path: "/bolag", priority: 0.9, freq: "monthly" as const },
    { path: "/guider", priority: 0.85, freq: "monthly" as const },
    { path: "/om", priority: 0.5, freq: "yearly" as const },
    { path: "/kontakt", priority: 0.4, freq: "yearly" as const },
    { path: "/integritet", priority: 0.3, freq: "yearly" as const },
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((r) => ({
    url: `${SITE_CONFIG.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const operatorEntries: MetadataRoute.Sitemap = OPERATORS.map((op) => ({
    url: `${SITE_CONFIG.url}/bolag/${op.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const guideEntries: MetadataRoute.Sitemap = CONSUMER_GUIDES.map((g) => ({
    url: `${SITE_CONFIG.url}/guider/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...coreEntries, ...operatorEntries, ...guideEntries];
}
