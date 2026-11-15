import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { OPERATORS } from "@/lib/data/operators";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Alla ${OPERATORS.length} trafikbolag & flygbolag – Regler för förseningsersättning ${SITE_CONFIG.year}`,
  description:
    "Komplett översikt av svenska kollektivtrafikbolag, tågoperatörer och flygbolag: tidsgränser (20 min vs 60 min), taxitak 2026, periodkortsschabloner och direktansökan.",
  path: "/bolag",
});

export default function BolagIndexPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Alla bolag", path: "/bolag" },
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
        <span className="text-[#0F172A]">Alla bolag ({OPERATORS.length})</span>
      </nav>

      <header className="mb-6 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
          Alla trafik- &amp; flygbolag ({SITE_CONFIG.year})
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Jämför ersättningsgränser, maxbelopp för taxi, ansökningsfrister och öppna
          förifyllda kalkylatorer per bolag.
        </p>
      </header>

      <div className="overflow-x-auto rounded border border-[#CBD5E1] bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-xs font-semibold tracking-wider text-slate-600 uppercase">
            <tr>
              <th className="px-4 py-3">Bolag</th>
              <th className="px-4 py-3">Typ</th>
              <th className="px-4 py-3">Gräns</th>
              <th className="px-4 py-3">Tidsfrist</th>
              <th className="px-4 py-3 text-right">Guide</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {OPERATORS.map((op) => (
              <tr key={op.slug} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3.5 font-semibold text-[#0F172A]">
                  <Link href={`/bolag/${op.slug}`} className="hover:text-[#0B1F3A] hover:underline">
                    {op.name}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{op.categoryLabel}</td>
                <td className="font-mono-num px-4 py-3.5 text-xs font-semibold text-[#0B1F3A]">
                  {op.delayThresholdMinutes} min
                </td>
                <td className="tabular-nums px-4 py-3.5 text-xs text-slate-600">
                  {op.deadlineText}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    href={`/bolag/${op.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B1F3A] hover:underline"
                  >
                    <span>Öppna</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
