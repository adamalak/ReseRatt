import type { Metadata } from "next";
import Link from "next/link";
import { ONE_FORTIETH_PBB_2026, ONE_TWENTIETH_PBB_2026, PRISBASBELOPP_2026 } from "@/lib/data/constants";
import { formatSEK } from "@/lib/format";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Om ${SITE_CONFIG.name} & vår källmetod (${SITE_CONFIG.year})`,
  description: `Läs om hur ${SITE_CONFIG.name} tar fram beräkningar för tåg-, lokaltrafik- och flygersättning utifrån svenska lagar, prisbasbelopp ${SITE_CONFIG.year} och trafikbolagens resevillkor.`,
  path: "/om",
});

export default function OmPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Om ReseRätt", path: "/om" },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Brödsmulor" className="mb-4 text-xs font-medium text-stone-500">
        <Link href="/" className="hover:text-[#143A66] hover:underline">
          Hem
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">Om ReseRätt</span>
      </nav>

      <div className="rounded-lg border border-[#DDD9CE] bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Om {SITE_CONFIG.name} &amp; vår källmetod
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          {SITE_CONFIG.name} är ett oberoende svenskt konsumentverktyg skapat för att ge resenärer
          ett snabbt och begripligt svar mitt i en försening – utan reklamkrångel, krav på
          inloggning eller dyra ombudsavgifter.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-700">
          <section>
            <h2 className="font-editorial text-lg font-semibold text-zinc-900">
              Vilka källor och lagar bygger kalkylatorerna på?
            </h2>
            <ul className="mt-2.5 list-disc space-y-2 pl-5">
              <li>
                <strong>Lagen om kollektivtrafikresenärers rättigheter (2015:953):</strong> Styr
                bussar, tunnelbana, spårvagn och tåg vars totala linjesträcka är kortare än 150 km
                (50 % vid 20 min, 75 % vid 40 min och 100 % vid 60+ min).
              </li>
              <li>
                <strong>EU:s tågpassagerarförordning (2021/782):</strong> Styr längre tågsträckor
                från 150 km och uppåt (25 % vid 60 min och 50 % vid 120+ min).
              </li>
              <li>
                <strong>EU-förordning 261/2004 &amp; Högsta domstolen (NJA 2018 s. 127):</strong>{" "}
                250–600 EUR i flygersättning, Artikel 9 omvårdnadsrätt samt svensk reklamation inom
                2 månader (skälig tid) och 10 års preskription.
              </li>
              <li>
                <strong>Fastställt prisbasbelopp {SITE_CONFIG.year}:</strong>{" "}
                <span className="font-mono-num font-semibold">{formatSEK(PRISBASBELOPP_2026)}</span>{" "}
                (ger 1/20 ={" "}
                <span className="font-mono-num font-semibold">
                  {formatSEK(ONE_TWENTIETH_PBB_2026)}
                </span>{" "}
                hos t.ex. Skånetrafiken och 1/40 ={" "}
                <span className="font-mono-num font-semibold">
                  {formatSEK(ONE_FORTIETH_PBB_2026)}
                </span>{" "}
                hos t.ex. SL, UL, Mälartåg och X-trafik).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-lg font-semibold text-zinc-900">
              Varför uppmanar vi dig att söka direkt själv?
            </h2>
            <p className="mt-2">
              Många ersättningsföretag tar 25–35 % i provision för ärenden som du kan fylla i på
              3 minuter direkt hos trafik- eller flygbolaget. Vi länkar därför alltid till bolagens
              egna formulär i första hand så att du behåller 100 % av dina pengar.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-lg font-semibold text-zinc-900">
              Syskonprojekt
            </h2>
            <p className="mt-2">
              {SITE_CONFIG.name} drivs som ett fristående systerprojekt till{" "}
              <a
                href={SITE_CONFIG.sisterSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#143A66] underline"
              >
                {SITE_CONFIG.sisterSiteName}
              </a>{" "}
              (gratis svenska kalkylatorer för lön, kommunalskatt, CSN och ISK).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
