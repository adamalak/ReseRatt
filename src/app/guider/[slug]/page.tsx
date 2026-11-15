import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthoritySourcesList } from "@/components/AuthoritySourcesList";
import { FaqSection } from "@/components/FaqSection";
import { CONSUMER_GUIDES, getGuideBySlug } from "@/lib/data/guides";
import { getOperatorBySlug } from "@/lib/data/operators";
import { getAuthoritySources } from "@/lib/data/sources";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CONSUMER_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return buildPageMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guider/${guide.slug}`,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedOps = guide.relatedOperatorSlugs
    .map((s) => getOperatorBySlug(s))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));
  const guideSources = getAuthoritySources(guide.sourceIds);

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Hem", path: "/" },
      { name: "Guider", path: "/guider" },
      { name: guide.shortTitle, path: `/guider/${guide.slug}` },
    ]),
    buildArticleJsonLd({
      headline: guide.title,
      description: guide.summary,
      path: `/guider/${guide.slug}`,
      dateModified: guide.dateModified,
    }),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Brödsmulor" className="mb-3 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0B1F3A] hover:underline">
          Hem
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guider" className="hover:text-[#0B1F3A] hover:underline">
          Guider
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#0F172A]">{guide.shortTitle}</span>
      </nav>

      <article className="rounded border border-[#CBD5E1] bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold tracking-wider text-[#0B1F3A] uppercase">
            {guide.category}
          </span>
          <span className="text-slate-400">&middot;</span>
          <span className="font-mono-num text-slate-500">{guide.readTime}</span>
          <span className="text-slate-400">&middot;</span>
          <span className="font-mono-num text-slate-500">
            Senast granskad {guide.dateModified}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          Granskad av{" "}
          <Link href="/om" className="font-semibold text-[#0B1F3A] underline">
            {SITE_CONFIG.publisherName}
          </Link>
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{guide.summary}</p>

        {/* Key Takeaway Callout */}
        <div className="mt-6 rounded-[4px] border border-[#F59E0B] border-l-4 border-l-[#D97706] bg-[#FFFBEB] p-4 text-sm leading-relaxed text-[#78350F]">
          <p className="text-xs font-bold tracking-wider text-[#92400E] uppercase">
            Viktigast att ta med sig
          </p>
          <p className="mt-1 font-medium">{guide.keyTakeaway}</p>
        </div>

        <div className="mt-8 space-y-7">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-editorial text-xl font-semibold text-[#0B1F3A]">
                {section.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                {section.body}
              </p>
              {section.bullets && (
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#0B1F3A]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {guideSources.length > 0 && (
          <div className="mt-8 border-t border-[#E2E8F0] pt-6">
            <AuthoritySourcesList
              title="Primärkällor & regelverk för den här guiden"
              sources={guideSources}
            />
          </div>
        )}

        {relatedOps.length > 0 && (
          <div className="mt-8 border-t border-[#E2E8F0] pt-6">
            <h2 className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              Beräkna direkt för berörda bolag
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedOps.map((op) => (
                <Link
                  key={op.slug}
                  href={`/bolag/${op.slug}`}
                  className="rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0B1F3A] hover:bg-slate-100"
                >
                  {op.shortName} kalkylator &rarr;
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <FaqSection title="Vanliga frågor om detta tema" items={guide.faqs} />
    </div>
  );
}
