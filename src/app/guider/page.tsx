import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { CONSUMER_GUIDES } from "@/lib/data/guides";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Konsumentguider för försenat tåg, taxi & flyg (${SITE_CONFIG.year})`,
  description:
    "Fördjupande svenska guider om taxameterkvitton, periodkortsschabloner, egen bil (25 kr/mil), extraordinära omständigheter på flyg och 2-månadersregeln.",
  path: "/guider",
});

export default function GuiderIndexPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Guider", path: "/guider" },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Brödsmulor" className="mb-3 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0B1F3A] hover:underline">
          Hem
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#0F172A]">Guider &amp; regler</span>
      </nav>

      <header className="mb-6 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#0B1F3A] uppercase">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Konsumentguider {SITE_CONFIG.year}</span>
        </span>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
          Guider som räddar din reseersättning
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Praktiska genomgångar av de vanligaste fällorna som gör att trafik- och flygbolag avslår
          krav – och hur du vinner rätt i första försöket.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {CONSUMER_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guider/${guide.slug}`}
            className="group flex flex-col justify-between rounded border border-[#CBD5E1] bg-white p-5 transition hover:border-[#0B1F3A] hover:bg-[#F8FAFC] sm:p-6"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold tracking-wider text-[#0B1F3A] uppercase">
                  {guide.category}
                </span>
                <span className="font-mono-num text-slate-500">{guide.readTime}</span>
              </div>
              <h2 className="font-editorial mt-2 text-xl font-semibold text-[#0F172A] group-hover:text-[#0B1F3A]">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.summary}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs font-semibold text-[#0B1F3A]">
              <span>Läs hela guiden</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
