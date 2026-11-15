import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Kontakt & rättelser – ${SITE_CONFIG.name}`,
  description: `Kontakta ${SITE_CONFIG.name} via ${SITE_CONFIG.contactEmail} för rättelser och frågor, eller rapportera tekniska fel öppet på GitHub.`,
  path: "/kontakt",
});

export default function KontaktPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", path: "/" },
    { name: "Kontakt", path: "/kontakt" },
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
        <span className="text-[#0F172A]">Kontakt</span>
      </nav>

      <div className="rounded border border-[#CBD5E1] bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
          Kontakt &amp; rättelser
        </h1>
        <p className="font-mono-num mt-2 text-xs text-slate-500">
          {SITE_CONFIG.publisherName}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          Har ett trafikbolag ändrat sitt maxbelopp för taxi, uppdaterat sina ansökningslänkar
          eller hittat något i en kalkylator som bör justeras?
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="rounded border border-[#CBD5E1] bg-[#F8FAFC] p-5">
            <h2 className="text-base font-bold text-[#0B1F3A]">Viktigt: Vi är inte ett trafikbolag</h2>
            <p className="mt-1.5">
              {SITE_CONFIG.name} kan inte ta emot faktiska ansökningar om förseningsersättning eller
              se bokningsnummer. Använd direktlänkarna på respektive{" "}
              <Link href="/bolag" className="font-semibold text-[#0B1F3A] underline">
                bolagssida
              </Link>{" "}
              för att skicka in ditt ärende direkt till rätt bolag.
            </p>
          </section>

          <section className="rounded border border-[#CBD5E1] border-l-4 border-l-[#0B1F3A] bg-[#F8FAFC] p-5">
            <h2 className="text-base font-bold text-[#0B1F3A]">
              Kontakt för konsumenter, rättelser &amp; press
            </h2>
            <p className="mt-2">
              Hittat en inaktuell regel, ändrad schablon eller vill komma i kontakt med redaktionen
              bakom {SITE_CONFIG.domainLabel}? Mejla oss direkt på:
            </p>
            <p className="mt-3">
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="inline-flex items-center rounded-[4px] bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#163763]"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0B1F3A]">
              Öppen källgranskning &amp; teknisk felrapportering
            </h2>
            <p className="mt-2">
              Projektets beräkningskod, enhetstester och regeldata underhålls öppet via GitHub.
              Utvecklare och granskare kan alltid öppna en issue eller granska ändringshistoriken
              direkt i kodbasen:
            </p>
            <p className="mt-3">
              <a
                href={SITE_CONFIG.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-[4px] border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#0B1F3A] hover:bg-slate-100"
              >
                Öppna GitHub-repot (källkod &amp; issues) &rarr;
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
