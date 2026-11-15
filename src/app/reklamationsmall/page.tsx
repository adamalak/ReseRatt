import type { Metadata } from "next";
import Link from "next/link";
import { ClaimTemplateGenerator } from "@/components/ClaimTemplateGenerator";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildWebAppJsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Reklamationsmall för tåg, taxi & flyg ${SITE_CONFIG.year} – Kopiera färdigt kravbrev`,
  description:
    "Skapa färdiga reklamationstexter på svenska och engelska för försenat tåg, taxikvitto och EU 261-flygersättning – inklusive bestridande av extraordinära omständigheter.",
  path: "/reklamationsmall",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Sparas uppgifterna jag skriver in i kravbrevet?",
    answer:
      "Nej, allt skapas lokalt i din webbläsare och skickas aldrig till någon server eller databas.",
  },
  {
    question: "När ska jag använda mallen för att bestrida extraordinära omständigheter?",
    answer:
      "Om flygbolaget avslår din EU 261-ansökan med hänvisning till extraordinära omständigheter utan att ge konkret bevis – eller om felet egentligen var ett tekniskt fel eller personalbrist.",
  },
];

export default function ReklamationsmallPage() {
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Hem", path: "/" },
      { name: "Reklamationsmall", path: "/reklamationsmall" },
    ]),
    buildWebAppJsonLd({
      name: `Reklamationsmall för reseersättning ${SITE_CONFIG.year}`,
      description: "Skapa kopierbara reklamationsbrev för tåg, taxi och EU 261-flygersättning.",
      path: "/reklamationsmall",
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-4 border-b border-[#CBD5E1] pb-2.5 print:hidden">
        <nav aria-label="Brödsmulor" className="hidden text-xs font-medium text-slate-500 sm:block">
          <Link href="/" className="hover:text-[#0B1F3A] hover:underline">
            Hem
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#0F172A]">Reklamationsmall</span>
        </nav>
        <h1 className="mt-0.5 text-lg font-bold tracking-tight text-[#0B1F3A] sm:text-2xl">
          Kravbrevs- &amp; reklamationsgenerator ({SITE_CONFIG.year})
        </h1>
      </div>

      <ClaimTemplateGenerator />

      <FaqSection title="Vanliga frågor om reklamation" items={FAQ_ITEMS} />
    </div>
  );
}
