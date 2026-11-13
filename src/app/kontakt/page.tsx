import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Kontakt & rättelser – ${SITE_CONFIG.name}`,
  description: `Rapportera ändrade biljett- eller taxivillkor, felaktiga länkar eller ge förslag på nya funktioner till ${SITE_CONFIG.name}.`,
  path: "/kontakt",
});

export default function KontaktPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Kontakt", path: "/kontakt" },
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
        <span className="text-zinc-900">Kontakt</span>
      </nav>

      <div className="rounded-lg border border-[#DDD9CE] bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Kontakt &amp; rättelser
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          Har ett trafikbolag ändrat sitt maxbelopp för taxi, uppdaterat sina ansökningslänkar
          eller hittat något i en kalkylator som bör justeras?
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-700">
          <section className="rounded-md border border-stone-200 bg-[#FAF9F6] p-5">
            <h2 className="text-base font-bold text-zinc-900">Viktigt: Vi är inte ett trafikbolag</h2>
            <p className="mt-1.5">
              {SITE_CONFIG.name} kan inte ta emot faktiska ansökningar om förseningsersättning eller
              se bokningsnummer. Använd direktlänkarna på respektive{" "}
              <Link href="/bolag" className="font-semibold text-[#143A66] underline">
                bolagssida
              </Link>{" "}
              för att skicka in ditt ärende direkt till rätt bolag.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-zinc-900">Skicka förslag eller rättelse</h2>
            <p className="mt-2">
              Projektets kod och regeldata underhålls öppet via GitHub. Du kan alltid lämna en
              felrapport eller förslag på nya trafikbolag via projektägarens GitHub-profil:
            </p>
            <p className="mt-3">
              <a
                href={SITE_CONFIG.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-[#143A66] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E294A]"
              >
                Öppna GitHub (feedback &amp; issues) &rarr;
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
