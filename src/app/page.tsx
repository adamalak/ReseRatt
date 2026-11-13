import type { Metadata } from "next";
import { ArrowRight, BookOpen, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { HeroDualCalculator } from "@/components/HeroDualCalculator";
import { CONSUMER_GUIDES } from "@/lib/data/guides";
import { OPERATORS } from "@/lib/data/operators";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_CONFIG.name} – Räkna ut förseningsersättning på tåg, SL & flyg ${SITE_CONFIG.year}`,
  description: SITE_CONFIG.tagline,
  path: "/",
});

const BENCHMARKS_2026 = [
  {
    label: "SL taxi / alternativ transport (1/40 pbb)",
    value: "Upp till 1 480 kr",
    href: "/bolag/sl",
  },
  {
    label: "Västtrafik taxi (slås ihop per person)",
    value: "1 500 kr / pers (+20 % värdekod)",
    href: "/bolag/vasttrafik",
  },
  {
    label: "Skånetrafiken taxi (1/20 prisbasbelopp)",
    value: "Upp till 2 960 kr (+30 % värdekod)",
    href: "/bolag/skanetrafiken",
  },
  {
    label: "SJ 15-milsregel & Snabbtåg 30-dagars",
    value: "20 / 60 min · kortpris ÷ 22",
    href: "/bolag/sj",
  },
  {
    label: "Flygersättning EU 261/2004 (> 3 tim)",
    value: "250 / 400 / 600 EUR",
    href: "/flygersattning",
  },
  {
    label: "Prisbasbelopp Sverige 2026",
    value: "59 200 kr",
    href: "/om",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Editorial Header */}
      <section className="border-b border-[#DDD9CE] pb-7">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#143A66]">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-mono-num tracking-wider uppercase">
            Oberoende konsumentverktyg &middot; Sverige {SITE_CONFIG.year}
          </span>
        </div>
        <h1 className="mt-2.5 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Försenat tåg, buss eller flyg? Se exakt vad du har rätt till.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          Kolla biljettersättning, taxigräns, periodkortsschablon och EU 261 på 10 sekunder –
          direkt i webbläsaren utan konto eller ombudsavgifter.
        </p>
      </section>

      {/* Above-the-fold Emergency Calculator */}
      <section aria-label="Ersättningskalkylator" className="mt-7">
        <HeroDualCalculator />
      </section>

      {/* 2026 Quick Benchmarks */}
      <section className="mt-14 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="font-editorial text-2xl font-semibold tracking-tight text-zinc-900">
            Viktiga svenska gränser {SITE_CONFIG.year}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Sammanställning av 2026 års officiella taxigränser, periodkortsschabloner och
            ersättningsnivåer. Klicka på en rad för regler, fällor och direktansökan.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/bolag"
              className="text-sm font-semibold text-[#143A66] hover:underline"
            >
              Jämför alla {OPERATORS.length} bolag &rarr;
            </Link>
            <Link
              href="/reklamationsmall"
              className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-800 hover:text-[#143A66] hover:underline"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Öppna kravbrevsgeneratorn</span>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#DDD9CE] bg-white lg:col-span-7">
          <dl className="divide-y divide-stone-200 text-sm">
            {BENCHMARKS_2026.map((row) => (
              <Link
                key={row.label}
                href={row.href}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAF9F6]"
              >
                <dt className="font-medium text-stone-700">{row.label}</dt>
                <dd className="font-mono-num shrink-0 font-semibold text-zinc-900">
                  {row.value}
                </dd>
              </Link>
            ))}
          </dl>
        </div>
      </section>

      {/* Operator Quick Directory */}
      <section aria-label="Bolagsguider" className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-editorial text-2xl font-semibold tracking-tight text-zinc-900">
            Särskilda regler per bolag
          </h2>
          <Link href="/bolag" className="text-xs font-semibold text-[#143A66] hover:underline">
            Se alla {OPERATORS.length} &rarr;
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OPERATORS.slice(0, 9).map((op) => (
            <Link
              key={op.slug}
              href={`/bolag/${op.slug}`}
              className="group flex flex-col justify-between rounded-lg border border-[#DDD9CE] bg-white p-4 transition hover:border-[#143A66]/50 hover:bg-[#FAF9F6]"
            >
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-[#143A66] uppercase">
                  {op.categoryLabel}
                </span>
                <h3 className="mt-1 text-base font-bold text-zinc-900 group-hover:text-[#143A66]">
                  {op.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-600">
                  {op.heroSummary}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs font-semibold text-[#143A66]">
                <span>Kalkylator &amp; direktlänk</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deep Consumer Guides */}
      <section aria-label="Fördjupande guider" className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-editorial flex items-center gap-2 text-2xl font-semibold tracking-tight text-zinc-900">
            <BookOpen className="h-5 w-5 text-[#143A66]" />
            <span>Guider som räddar din ersättning</span>
          </h2>
          <Link href="/guider" className="text-xs font-semibold text-[#143A66] hover:underline">
            Alla {CONSUMER_GUIDES.length} guider &rarr;
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {CONSUMER_GUIDES.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              href={`/guider/${guide.slug}`}
              className="group rounded-lg border border-[#DDD9CE] bg-white p-5 transition hover:border-[#143A66]/50 hover:bg-[#FAF9F6]"
            >
              <span className="text-[11px] font-semibold tracking-wider text-[#143A66] uppercase">
                {guide.category}
              </span>
              <h3 className="mt-1.5 text-base font-bold text-zinc-900 group-hover:text-[#143A66]">
                {guide.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">{guide.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
