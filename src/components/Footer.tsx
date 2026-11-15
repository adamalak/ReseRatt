import Link from "next/link";
import { OPERATORS } from "@/lib/data/operators";
import { SITE_CONFIG } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#CBD5E1] bg-white print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-serif text-lg font-bold text-[#0B1F3A]">{SITE_CONFIG.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Oberoende svensk snabbkoll för förseningsersättning, taxigaranti och EU 261/2004.
              All beräkning sker lokalt i din webbläsare utan databas eller spårningscookies.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {SITE_CONFIG.publisherName}. Frågor &amp; rättelser:{" "}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="font-semibold text-[#0B1F3A] underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Kalkylatorer ({SITE_CONFIG.year})
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link href="/tag-och-kollektivtrafik" className="hover:text-[#0B1F3A] hover:underline">
                  Tåg, pendel &amp; buss
                </Link>
              </li>
              <li>
                <Link href="/flygersattning" className="hover:text-[#0B1F3A] hover:underline">
                  Flygersättning (EU 261/2004)
                </Link>
              </li>
              <li>
                <Link href="/reklamationsmall" className="hover:text-[#0B1F3A] hover:underline">
                  Reklamationsgenerator
                </Link>
              </li>
              <li>
                <Link href="/bolag" className="hover:text-[#0B1F3A] hover:underline">
                  Alla {OPERATORS.length} bolag &amp; villkor
                </Link>
              </li>
              <li>
                <Link href="/guider" className="hover:text-[#0B1F3A] hover:underline">
                  Konsumentguider
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Populära bolag
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link href="/bolag/sl" className="hover:text-[#0B1F3A] hover:underline">
                  SL (Taxi 1 480 kr &amp; 30-dagars)
                </Link>
              </li>
              <li>
                <Link href="/bolag/sj" className="hover:text-[#0B1F3A] hover:underline">
                  SJ (Under &amp; över 15 mil)
                </Link>
              </li>
              <li>
                <Link href="/bolag/vasttrafik" className="hover:text-[#0B1F3A] hover:underline">
                  Västtrafik (+20 % värdekod)
                </Link>
              </li>
              <li>
                <Link href="/bolag/skanetrafiken" className="hover:text-[#0B1F3A] hover:underline">
                  Skånetrafiken (Taxi 2 960 kr)
                </Link>
              </li>
              <li>
                <Link href="/bolag/sas" className="hover:text-[#0B1F3A] hover:underline">
                  SAS &amp; Norwegian (EU 261)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Om &amp; källor
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link href="/om" className="hover:text-[#0B1F3A] hover:underline">
                  Om ReseRätt &amp; källmetod
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-[#0B1F3A] hover:underline">
                  Kontakt &amp; rättelser
                </Link>
              </li>
              <li>
                <Link href="/integritet" className="hover:text-[#0B1F3A] hover:underline">
                  Integritetspolicy &amp; friskrivning
                </Link>
              </li>
              <li>
                <a
                  href="https://www.konsumentverket.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0B1F3A] hover:underline"
                >
                  Konsumentverket.se
                </a>
              </li>
              <li>
                <a
                  href="https://www.arn.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0B1F3A] hover:underline"
                >
                  Allmänna reklamationsnämnden (ARN)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6 text-xs leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong>Ingen juridisk rådgivning:</strong> Uträkningarna är vägledande utifrån
            offentliga resevillkor ({SITE_CONFIG.year} års prisbasbelopp: 59 200 kr). Kontrollera
            alltid exakta villkor hos respektive bolag innan du bokar taxi eller skickar krav.
          </p>
          <p className="font-mono-num shrink-0">
            &copy; {SITE_CONFIG.year} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
