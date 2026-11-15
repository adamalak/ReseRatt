import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlightCalculator } from "@/components/calculators/FlightCalculator";
import { TransitCalculator } from "@/components/calculators/TransitCalculator";
import { FaqSection } from "@/components/FaqSection";
import { OperatorFactsCard } from "@/components/OperatorFactsCard";
import { CONSUMER_GUIDES } from "@/lib/data/guides";
import { getOperatorBySlug, OPERATORS } from "@/lib/data/operators";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildWebAppJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return OPERATORS.map((op) => ({ slug: op.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const operator = getOperatorBySlug(slug);
  if (!operator) return {};
  return buildPageMetadata({
    title: operator.seoTitle,
    description: operator.metaDescription,
    path: `/bolag/${operator.slug}`,
  });
}

export default async function OperatorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const operator = getOperatorBySlug(slug);
  if (!operator) notFound();

  const relatedGuides = CONSUMER_GUIDES.filter((g) =>
    g.relatedOperatorSlugs.includes(operator.slug)
  );
  const siblingOperators = OPERATORS.filter(
    (o) => o.category === operator.category && o.slug !== operator.slug
  ).slice(0, 4);

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Hem", path: "/" },
      { name: "Alla bolag", path: "/bolag" },
      { name: operator.shortName, path: `/bolag/${operator.slug}` },
    ]),
    buildWebAppJsonLd({
      name: `${operator.shortName} förseningsersättning kalkylator`,
      description: operator.metaDescription,
      path: `/bolag/${operator.slug}`,
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
          <Link href="/bolag" className="hover:text-[#0B1F3A] hover:underline">
            Alla bolag
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#0F172A]">{operator.name}</span>
        </nav>
        <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-lg font-bold tracking-tight text-[#0B1F3A] sm:text-2xl">
            {operator.name} &ndash; Förseningsersättning 2026
          </h1>
          <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
            {operator.categoryLabel} &middot; {operator.lawFramework}
          </span>
        </div>
      </div>

      {operator.category === "flyg" ? (
        <FlightCalculator initialAirlineSlug={operator.slug} />
      ) : (
        <TransitCalculator initialOperatorSlug={operator.slug} hideOperatorGuideLink />
      )}

      <OperatorFactsCard operator={operator} />

      <FaqSection title={`Vanliga frågor om ${operator.shortName}`} items={operator.faqs} />

      {/* Internal cross-links for topical authority */}
      {(relatedGuides.length > 0 || siblingOperators.length > 0) && (
        <section className="mt-10 grid gap-6 md:grid-cols-2 print:hidden">
          {relatedGuides.length > 0 && (
            <div className="rounded border border-[#CBD5E1] bg-white p-6">
              <h2 className="text-sm font-semibold tracking-wider text-slate-600 uppercase">
                Fördjupande guider
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                {relatedGuides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guider/${g.slug}`}
                      className="font-semibold text-[#0B1F3A] hover:underline"
                    >
                      {g.title} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {siblingOperators.length > 0 && (
            <div className="rounded border border-[#CBD5E1] bg-white p-6">
              <h2 className="text-sm font-semibold tracking-wider text-slate-600 uppercase">
                Liknande bolag
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                {siblingOperators.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/bolag/${s.slug}`}
                      className="font-semibold text-[#0B1F3A] hover:underline"
                    >
                      {s.name} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
