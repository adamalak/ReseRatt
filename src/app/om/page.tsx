import type { Metadata } from "next";
import Link from "next/link";
import { AuthoritySourcesList } from "@/components/AuthoritySourcesList";
import {
  ONE_FORTIETH_PBB_2026,
  ONE_TWENTIETH_PBB_2026,
  OWN_CAR_KR_PER_MIL,
  PRISBASBELOPP_2026,
} from "@/lib/data/constants";
import { AUTHORITY_SOURCES } from "@/lib/data/sources";
import { formatSEK } from "@/lib/format";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Om ${SITE_CONFIG.name} & vår källmetod (${SITE_CONFIG.year})`,
  description: `Läs om hur ${SITE_CONFIG.name} granskas och uppdateras utifrån svensk lagtext, prisbasbelopp ${SITE_CONFIG.year}, Skatteverket, Konsumentverket och trafikbolagens resevillkor.`,
  path: "/om",
});

export default function OmPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Om ReseRätt", path: "/om" },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Brödsmulor" className="mb-3 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0B1F3A] hover:underline">
          Hem
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#0F172A]">Om ReseRätt</span>
      </nav>

      <div className="rounded border border-[#CBD5E1] bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
          Om {SITE_CONFIG.name} &amp; vår källmetod
        </h1>
        <p className="font-mono-num mt-2 text-xs text-slate-500">
          Utgivare: {SITE_CONFIG.publisherName} &middot; Senast granskad:{" "}
          {SITE_CONFIG.lastReviewedDate} &middot; Regelår: {SITE_CONFIG.year}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {SITE_CONFIG.name} är ett oberoende svenskt konsumentverktyg skapat för att ge resenärer
          ett snabbt, kontrollerbart svar mitt i en försening – utan reklamkrångel, krav på
          inloggning eller dyra ombudsavgifter.
        </p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-slate-700">
          <section className="rounded border border-[#CBD5E1] border-l-4 border-l-[#0B1F3A] bg-[#F8FAFC] p-5">
            <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">
              Så granskas och uppdateras våra beräkningar
            </h2>
            <ul className="mt-2.5 list-disc space-y-2 pl-5">
              <li>
                <strong>Kontroll mot primärkällor:</strong> Samtliga ersättningsnivåer och
                tidsgränser kontrolleras direkt mot svensk författningstext (SFS), EU-förordningar,
                Högsta domstolens praxis och respektive trafikbolags aktuella resevillkor.
              </li>
              <li>
                <strong>Fastställda nyckeltal för {SITE_CONFIG.year}:</strong>{" "}
                Prisbasbeloppet är{" "}
                <span className="font-mono-num font-semibold">{formatSEK(PRISBASBELOPP_2026)}</span>{" "}
                (vilket ger taxitaken 1/20 ={" "}
                <span className="font-mono-num font-semibold">
                  {formatSEK(ONE_TWENTIETH_PBB_2026)}
                </span>{" "}
                och 1/40 ={" "}
                <span className="font-mono-num font-semibold">
                  {formatSEK(ONE_FORTIETH_PBB_2026)}
                </span>
                ) och bilersättningen är{" "}
                <span className="font-mono-num font-semibold">{OWN_CAR_KR_PER_MIL} kr/mil</span>.
              </li>
              <li>
                <strong>Årlig &amp; löpande revidering:</strong> Regelkonstanterna revideras i
                januari varje år när nytt prisbasbelopp träder i kraft, samt löpande vid ändrade
                resevillkor eller länkvägar hos bolagen.
              </li>
              <li>
                <strong>Automatiserad regelverifiering:</strong> Beräkningslogiken verifieras
                löpande med automatiska enhetstester innan varje ny version publiceras.
              </li>
            </ul>
          </section>

          <AuthoritySourcesList
            title="Primärkällor, lagar och myndigheter vi lutar oss mot"
            intro="Här hittar du de officiella lagtexter, förordningar, domstolsavgöranden och myndighetssidor som våra kalkylatorer och guider bygger på:"
            sources={AUTHORITY_SOURCES}
          />

          <section>
            <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">
              Varför uppmanar vi dig att söka direkt själv?
            </h2>
            <p className="mt-2">
              Många ersättningsföretag tar 25–35 % i provision för ärenden som du kan fylla i på
              3 minuter direkt hos trafik- eller flygbolaget. Vi länkar därför alltid till bolagens
              egna formulär i första hand så att du behåller 100 % av dina pengar, samt till{" "}
              <a
                href="https://www.arn.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B1F3A] underline"
              >
                ARN
              </a>{" "}
              och{" "}
              <a
                href="https://www.konsumentverket.se/varor-och-tjanster/resor/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B1F3A] underline"
              >
                Konsumentverket
              </a>{" "}
              om ett bolag avslår ett befogat krav.
            </p>
          </section>

          <section className="rounded border border-[#CBD5E1] bg-white p-5">
            <h2 className="font-editorial text-lg font-semibold text-[#0B1F3A]">
              Avsändare, kontakt &amp; öppen källgranskning
            </h2>
            <p className="mt-2">
              <strong>Avsändare:</strong> {SITE_CONFIG.publisherName}
            </p>
            <p className="mt-1.5">
              <strong>Rättelser, frågor &amp; redaktionell kontakt:</strong>{" "}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="font-semibold text-[#0B1F3A] underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>{" "}
              (se även vår{" "}
              <Link href="/kontakt" className="font-semibold text-[#0B1F3A] underline">
                kontaktsida
              </Link>
              ).
            </p>
            <p className="mt-1.5">
              <strong>Öppen källgranskning:</strong> Hela kodbasen och samtliga regeldata kan
              granskas öppet på{" "}
              <a
                href={SITE_CONFIG.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B1F3A] underline"
              >
                GitHub (ReseRätt)
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
