import type { Metadata } from "next";
import Link from "next/link";
import { FlightCalculator } from "@/components/calculators/FlightCalculator";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { FLIGHT_OPERATORS } from "@/lib/data/operators";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildWebAppJsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Flygersättning EU 261/2004 kalkylator ${SITE_CONFIG.year} – Sök själv utan ombud`,
  description:
    "Beräkna flygersättning enligt EU 261/2004 (250, 400 eller 600 EUR) för SAS, Norwegian, Ryanair och alla EU-flyg. Inkluderar Artikel 9 mat/hotell och HD:s 2-månadersregel.",
  path: "/flygersattning",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Hur mycket får jag vid försenat eller inställt flyg enligt EU 261/2004?",
    answer:
      "Standardnivåerna per passagerare vid > 3 timmars ankomstförsening (eller inställt < 14 dagar före avgång) är 250 EUR upp till 1 500 km, 400 EUR för flyg > 1 500 km inom EU/EES eller 1 500–3 500 km utanför EU, samt 600 EUR för flyg > 3 500 km utanför EU.",
  },
  {
    question: "Måste man betala 25–35 % till ett ersättningsföretag?",
    answer:
      "Nej! Du kan alltid skicka kravet gratis direkt till flygbolaget först och behålla 100 % själv. Ombud behövs bara om bolaget nekar och du inte själv vill skicka in en gratis anmälan till Allmänna reklamationsnämnden (ARN).",
  },
  {
    question: "Varför måste svenskar reklamera inom 2 månader?",
    answer:
      "Enligt Högsta domstolens prejudikat NJA 2018 s. 127 gäller en reklamationsplikt inom skälig tid – inom 2 månader anses alltid i rätt tid. Därefter gäller 10 års preskription i Sverige.",
  },
  {
    question: "Får jag mat och hotell även om förseningen beror på snöstorm?",
    answer:
      "Ja! Även om extremväder eller extern flygledarstrejk befriar flygbolaget från 250–600 EUR i kontantersättning gäller alltid omvårdnadsplikten (Artikel 9): skälig mat, dryck och vid behov hotell + transfer efter 2–4 timmars väntan.",
  },
];

export default function FlygersattningPage() {
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Hem", path: "/" },
      { name: "Flygersättning EU 261/2004", path: "/flygersattning" },
    ]),
    buildWebAppJsonLd({
      name: `Flygersättning EU 261/2004 kalkylator ${SITE_CONFIG.year}`,
      description: "Räkna ut EU 261-kompensation och rätt till mat/hotell utan ombudsavgifter.",
      path: "/flygersattning",
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
          <span className="text-[#0F172A]">Flygersättning (EU 261/2004)</span>
        </nav>
        <h1 className="mt-0.5 text-lg font-bold tracking-tight text-[#0B1F3A] sm:text-2xl">
          Flygersättning EU 261/2004 &ndash; Sök gratis själv ({SITE_CONFIG.year})
        </h1>
      </div>

      <FlightCalculator initialAirlineSlug="sas" />

      <section className="mt-10 rounded border border-[#CBD5E1] bg-white p-5 sm:p-6 print:hidden">
        <h2 className="font-editorial text-xl font-semibold text-[#0B1F3A]">
          Flygbolagsspecifika guider
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLIGHT_OPERATORS.map((op) => (
            <Link
              key={op.slug}
              href={`/bolag/${op.slug}`}
              className="rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm font-semibold text-[#0F172A] transition hover:border-[#0B1F3A] hover:text-[#0B1F3A]"
            >
              {op.name}
            </Link>
          ))}
        </div>
      </section>

      <FaqSection title="Vanliga frågor om EU 261/2004" items={FAQ_ITEMS} />
    </div>
  );
}
