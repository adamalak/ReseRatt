import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: "Integritetspolicy, GDPR & Ansvarsfriskrivning",
  description: `Läs om hur ${SITE_CONFIG.name} hanterar integritet utan spårningscookies, delade länkar, reklammärkning och juridisk ansvarsfriskrivning.`,
  path: "/integritet",
});

export default function IntegritetPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-lg border border-[#DDD9CE] bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Integritetspolicy &amp; Ansvarsfriskrivning
        </h1>
        <p className="font-mono-num mt-2 text-xs text-stone-500">
          Senast uppdaterad: {SITE_CONFIG.year}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-700">
          <section>
            <h2 className="text-base font-bold text-zinc-900">1. All beräkning sker lokalt</h2>
            <p className="mt-2">
              {SITE_CONFIG.name} samlar inte in några personuppgifter. Alla uppgifter du fyller i –
              som biljettpris, försening, taxibelopp eller text i reklamationsmallen – behandlas
              uteslutande lokalt i din egen webbläsare och skickas aldrig till någon server.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-zinc-900">2. Inga spårningscookies</h2>
            <p className="mt-2">
              Webbplatsen använder inga cookies för annonsering eller spårning. Om webbplatsen i
              framtiden aktiverar besöksanalys eller annonser (t.ex. Google AdSense) kommer en tydlig
              samtyckesbanner enligt GDPR att visas innan några cookies sätts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-zinc-900">3. Delade länkar</h2>
            <p className="mt-2">
              När du klickar på ”Dela till medresenär” läggs dina valda kalkylatorvärden (bolag,
              minuter och belopp) i webbadressens parametrar. Dela bara sådana länkar med personer
              som får se dessa uppgifter.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-zinc-900">
              4. Oberoende &amp; eventuell reklammärkning
            </h2>
            <p className="mt-2">
              {SITE_CONFIG.name} rekommenderar i första hand att du söker ersättning kostnadsfritt
              direkt hos trafik- eller flygbolaget. Om eventuella partnerlänkar (affiliatelänkar)
              eller annonser visas på sajten märks de alltid tydligt med{" "}
              <strong>”Annons”</strong> i enlighet med svensk marknadsföringslag.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-zinc-900">
              5. Ingen juridisk rådgivning
            </h2>
            <p className="mt-2">
              Resultaten på {SITE_CONFIG.name} är matematiska och informationsmässiga uppskattningar
              utifrån gällande regelverk och trafikbolagens publicerade villkor för {SITE_CONFIG.year}.
              Trafikbolagens egna villkor och lagstiftning gäller alltid i slutändan. Vid tvist kan
              du kostnadsfritt vända dig till{" "}
              <a
                href="https://www.konsumentverket.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#143A66] underline"
              >
                Konsumentverket
              </a>{" "}
              och{" "}
              <a
                href="https://www.arn.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#143A66] underline"
              >
                Allmänna reklamationsnämnden (ARN)
              </a>
              .
            </p>
          </section>

          <div className="border-t border-stone-200 pt-6">
            <Link href="/" className="text-sm font-semibold text-[#143A66] hover:underline">
              &larr; Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
