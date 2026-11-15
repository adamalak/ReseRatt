import type { Metadata } from "next";
import Link from "next/link";
import { TransitCalculator } from "@/components/calculators/TransitCalculator";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { TRANSIT_OPERATORS } from "@/lib/data/operators";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildWebAppJsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Förseningsersättning på tåg, SL & länstrafik ${SITE_CONFIG.year}`,
  description:
    "Räkna ut förseningsersättning, taxigaranti och periodkortsschablon för SJ, SL, Västtrafik, Skånetrafiken, Mälartåg, UL, Öresundståg, VR och Snälltåget 2026.",
  path: "/tag-och-kollektivtrafik",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "När gäller 20 minuter och när gäller 60 minuter på tåg?",
    answer:
      "På lokaltrafik och tåg vars totala linjesträcka (från första till sista station) är kortare än 150 km (15 mil) gäller Lag (2015:953) om kollektivtrafikresenärers rättigheter: 50 % från 20 min, 75 % från 40 min och 100 % från 60 min. Är tågets totala linje 150 km eller längre gäller EU:s tågpassagerarförordning (EU) 2021/782: 25 % vid 60–119 min och 50 % vid 120+ min.",
  },
  {
    question: "Vad är maxbeloppet för taxi år 2026?",
    answer:
      "Det varierar mellan bolagen: SL, UL, Mälartåg, Östgötatrafiken och X-trafik ligger på 1/40 av prisbasbeloppet (1 480 kr år 2026). Västtrafik ersätter upp till 1 500 kr per person för taxi (slås ihop om flera delar taxi). Skånetrafiken ersätter upp till 1/20 av prisbasbeloppet (2 960 kr år 2026).",
  },
  {
    question: "Vad gäller för 30-dagarsbiljett och Movingo?",
    answer:
      "SL använder fasta vuxenschabloner på 6/9/12 kr per resa, Skånetrafiken delar biljettpriset med 44 resor, och SJ delar 30-dagarskort Snabbtåg med 22 (Årskort ÷ 160). Med Movingo söker du hos det trafikbolag som körde den försenade avgången.",
  },
  {
    question: "Hur lång tid har jag på mig att söka förseningsersättning?",
    answer:
      "De flesta bolag (t.ex. SJ, Mälartåg, UL, Östgötatrafiken, Hallandstrafiken, X-trafik) kräver ansökan inom 2 månader. SL ger 3 månader.",
  },
];

export default function TransitPage() {
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Hem", path: "/" },
      { name: "Tåg & kollektivtrafik", path: "/tag-och-kollektivtrafik" },
    ]),
    buildWebAppJsonLd({
      name: `Förseningsersättning tåg & lokaltrafik ${SITE_CONFIG.year}`,
      description:
        "Kalkylator för förseningsersättning, taxi och periodkort inom svensk tåg- och kollektivtrafik.",
      path: "/tag-och-kollektivtrafik",
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
          <span className="text-[#0F172A]">Tåg &amp; kollektivtrafik</span>
        </nav>
        <h1 className="mt-0.5 text-lg font-bold tracking-tight text-[#0B1F3A] sm:text-2xl">
          Förseningsersättning på tåg, pendeltåg &amp; buss ({SITE_CONFIG.year})
        </h1>
      </div>

      <TransitCalculator initialOperatorSlug="sj" />

      <section className="mt-10 rounded border border-[#CBD5E1] bg-white p-5 sm:p-6 print:hidden">
        <h2 className="font-editorial text-xl font-semibold text-[#0B1F3A]">
          Välj specifik operatörssida
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {TRANSIT_OPERATORS.map((op) => (
            <Link
              key={op.slug}
              href={`/bolag/${op.slug}`}
              className="flex items-center justify-between rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#0B1F3A] hover:text-[#0B1F3A]"
            >
              <span>{op.name}</span>
              <span className="font-mono-num text-xs text-slate-600">{op.delayThresholdMinutes}+ min</span>
            </Link>
          ))}
        </div>
      </section>

      <FaqSection title="Vanliga frågor om tåg & kollektivtrafik" items={FAQ_ITEMS} />
    </div>
  );
}
