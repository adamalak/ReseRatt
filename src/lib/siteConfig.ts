import { RULES_YEAR } from "./data/constants";

export const SITE_CONFIG = {
  name: "ReseRätt",
  domainLabel: "ReseRätt.se",
  tagline:
    "Oberoende svensk kalkylator och checklista för förseningsersättning på tåg, lokaltrafik och flyg (EU 261/2004).",
  year: RULES_YEAR,
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://reseratt.se").replace(/\/+$/, ""),
  locale: "sv_SE",
  /**
   * Sätts till t.ex. Google Search Console HTML-tagg-token vid deploy (utan <meta>-omslag).
   */
  googleVerificationToken: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  /**
   * Valfritt: aktivera verklig affiliate-URL för flygombud senare när partneravtal godkänts.
   * Visar då automatiskt lagstadgad svensk "Annons"-märkning.
   */
  flightPartnerUrl: process.env.NEXT_PUBLIC_FLIGHT_PARTNER_URL || "",
  flightPartnerName: process.env.NEXT_PUBLIC_FLIGHT_PARTNER_NAME || "",
  navLinks: [
    { href: "/tag-och-kollektivtrafik", label: "Tåg & lokaltrafik", shortLabel: "Tåg & SL" },
    { href: "/flygersattning", label: "Flygersättning (EU 261)", shortLabel: "Flyg EU 261" },
    { href: "/bolag", label: "Alla bolag", shortLabel: "Alla bolag" },
    { href: "/reklamationsmall", label: "Reklamationsmall", shortLabel: "Kravbrev" },
    { href: "/guider", label: "Guider & regler", shortLabel: "Guider" },
  ],
  sisterSiteUrl: "https://kollapengar.se",
  sisterSiteName: "KollaPengarna",
  githubRepoUrl: "https://github.com/adamalak",
  /**
   * IndexNow-nyckel för snabbare indexering i Bing & ChatGPT Search.
   * Motsvarande .txt-fil ligger i public/.
   */
  indexNowKey: "reseratt-2026-indexnow-sv",
} as const;
