"use client";

import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { ClaimCopyBox } from "@/components/ClaimCopyBox";
import { OPERATORS } from "@/lib/data/operators";

type TemplateKind =
  | "transit_delay"
  | "transit_taxi"
  | "flight_eu261"
  | "flight_dispute_extraordinary";

export function ClaimTemplateGenerator() {
  const [kind, setKind] = useState<TemplateKind>("transit_delay");
  const [operatorSlug, setOperatorSlug] = useState<string>("sj");
  const [bookingRef, setBookingRef] = useState<string>("");
  const [travelDate, setTravelDate] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [delayText, setDelayText] = useState<string>("65 minuter");
  const [amountText, setAmountText] = useState<string>("");
  const [passengerName, setPassengerName] = useState<string>("");

  const operator = useMemo(
    () => OPERATORS.find((o) => o.slug === operatorSlug) ?? OPERATORS[0],
    [operatorSlug]
  );

  const generated = useMemo(() => {
    const ref = bookingRef.trim() || "[BOKNINGSNUMMER / BILJETT-ID]";
    const date = travelDate.trim() || "[RESDATUM]";
    const trip = route.trim() || "[AVGÅNG – ANKOMST / LINJE]";
    const delay = delayText.trim() || "[FÖRSENING I MINUTER/TIMMAR]";
    const amount = amountText.trim() || "[BELOPP I KR / EUR]";
    const name = passengerName.trim() || "[DITT FÖR- OCH EFTERNAMN]";

    if (kind === "transit_delay") {
      return {
        sv: `Ämne: Begäran om förseningsersättning – ${operator.shortName} (${date})

Hej ${operator.shortName},

Jag reste med er den ${date} på sträckan ${trip} (biljett-/bokningsnr: ${ref}) och blev försenad med ${delay} till min slutdestination.

Enligt gällande resevillkor och tillämplig lagstiftning (Lag (2015:953) / EU-förordning 2021/782) begär jag härmed förseningsersättning om ${amount}.

Kontouppgifter / Swish för utbetalning:
[CLEARING- OCH KONTONUMMER / TELEFONNUMMER]

Vänligen bekräfta mottagandet.

Med vänlig hälsning,
${name}`,
      };
    }

    if (kind === "transit_taxi") {
      return {
        sv: `Ämne: Ansökan om ersättning för alternativ transport (taxi/bil) – ${operator.shortName}

Hej ${operator.shortName},

Den ${date} på sträckan ${trip} (biljett-/kortnr: ${ref}) uppstod en störning som innebar skälig risk att jag skulle bli försenad med minst 20 minuter (${delay}) till mitt resmål.

Jag valde därför skäligt alternativt färdsätt i enlighet med er resegaranti (Lag 2015:953, prisbasbelopp 2026: 59 200 kr).
• Yrkad ersättning för utlägg: ${amount}
• Specificerat taxameter-/originalkvitto bifogas denna ansökan.

Jag önskar utbetalning till bankkonto enligt bifogade uppgifter.

Med vänlig hälsning,
${name}`,
      };
    }

    if (kind === "flight_eu261") {
      return {
        sv: `Ämne: Krav enligt EU-förordning 261/2004 – Bokning ${ref} (${date})

Hej ${operator.shortName},

Jag kräver härmed lagstadgad schablonersättning (samt eventuell ersättning för utlägg enligt Artikel 9) med stöd av Europaparlamentets och rådets förordning (EG) nr 261/2004.

• Bokningsreferens (PNR): ${ref}
• Datum & sträcka/flight: ${date}, ${trip}
• Försening vid ankomst (när dörren öppnades): ${delay}
• Totalt yrkat belopp: ${amount}

Jag motsätter mig värdecheck/poäng och begär kontant utbetalning via banköverföring till nedanstående konto:
IBAN: [DITT IBAN]
BIC/SWIFT: [DIN BANK-BIC]

Vänligen återkom med besked och ärendenummer inom skälig tid.

Med vänlig hälsning,
${name}`,
        en: `Subject: Claim under Regulation (EC) No 261/2004 – Booking ${ref} (${date})

Dear ${operator.shortName} Customer Relations,

I am writing to claim statutory compensation under Regulation (EC) No 261/2004 following the disruption to my flight.

- Booking reference (PNR): ${ref}
- Date & flight/route: ${date}, ${trip}
- Arrival delay (door opening): ${delay}
- Total amount claimed: ${amount}

Please arrange monetary reimbursement via bank transfer (not travel vouchers):
IBAN: [YOUR IBAN]
BIC/SWIFT: [YOUR BIC]

Please confirm receipt with a case reference number.

Yours sincerely,
${name}`,
      };
    }

    return {
      sv: `Ämne: Bestridande av avslag / Begäran om omprövning (EU 261/2004) – ${ref}

Hej ${operator.shortName},

Tack för ert svar i ärende ${ref} gällande flygningen ${trip} den ${date} (försening ${delay}).

Jag bestrider ert avslag där ni hänvisar till extraordinära omständigheter. Enligt EU-domstolens fasta praxis ligger tekniska fel på flygplanet, personalbrist och flygbolagets egna fackliga konflikter inom flygbolagets kontroll och utgör INTE extraordinära omständigheter.

Flygbolaget har bevisbördan och jag ber er därför att inom 14 dagar inkomma med:
1. Konkret dokumentation som styrker vilken exakt extraordinär händelse som drabbade just vår flygning, samt
2. Redovisning av vilka rimliga åtgärder ni vidtog för att undvika förseningen.

I annat fall vidhåller jag mitt krav på ${amount} enligt EU 261/2004 och kommer att föra ärendet vidare till Allmänna reklamationsnämnden (ARN).

Med vänlig hälsning,
${name}`,
      en: `Subject: Formal Dispute of Refusal under Regulation (EC) No 261/2004 – ${ref}

Dear ${operator.shortName} Customer Relations,

Thank you for your response regarding booking ${ref} (${date}, ${trip}, delay ${delay}).

I formally dispute your reliance on "extraordinary circumstances". Under settled CJEU case law, technical aircraft defects, crew shortages, and internal airline staff strikes fall within the air carrier's operational responsibility and do not exempt compensation.

As the burden of proof lies with the carrier, please provide within 14 days specific evidence demonstrating the exact extraordinary event affecting this flight and all reasonable measures taken to avoid the delay.

Absent such proof, I maintain my claim of ${amount} under Regulation (EC) No 261/2004.

Yours sincerely,
${name}`,
    };
  }, [kind, operator, bookingRef, travelDate, route, delayText, amountText, passengerName]);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="space-y-4 rounded border border-[#CBD5E1] bg-white p-4 sm:p-6 lg:col-span-5 print:hidden">
        <div>
          <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
            Välj typ av kravbrev
          </label>
          <div className="mt-2 grid gap-1.5">
            {(
              [
                ["transit_delay", "Tåg / Lokaltrafik – Förseningsersättning"],
                ["transit_taxi", "Tåg / Lokaltrafik – Taxikvitto / Egen bil"],
                ["flight_eu261", "Flyg (EU 261) – Första ersättningskrav"],
                ["flight_dispute_extraordinary", "Flyg (EU 261) – Bestrida ’extraordinära omständigheter’"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setKind(val)}
                className={`rounded-[4px] border px-3 py-2 text-left text-xs font-semibold transition ${
                  kind === val
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                    : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tpl-op" className="block text-xs font-semibold text-slate-700">
            Bolag / trafikhuvudman
          </label>
          <select
            id="tpl-op"
            value={operatorSlug}
            onChange={(e) => setOperatorSlug(e.target.value)}
            className="mt-1 w-full rounded-[4px] border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A]"
          >
            {OPERATORS.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="tpl-ref" className="block text-xs font-semibold text-slate-700">
              Bokningsnr / Biljett-ID
            </label>
            <input
              id="tpl-ref"
              type="text"
              placeholder="t.ex. A8F29C"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="tpl-date" className="block text-xs font-semibold text-slate-700">
              Resdatum
            </label>
            <input
              id="tpl-date"
              type="text"
              placeholder="t.ex. 2026-11-15"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tpl-route" className="block text-xs font-semibold text-slate-700">
            Sträcka / Tåg- eller flightnummer
          </label>
          <input
            id="tpl-route"
            type="text"
            placeholder="t.ex. Stockholm–Göteborg / X2000 421"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="tpl-delay" className="block text-xs font-semibold text-slate-700">
              Försening
            </label>
            <input
              id="tpl-delay"
              type="text"
              value={delayText}
              onChange={(e) => setDelayText(e.target.value)}
              className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="tpl-amount" className="block text-xs font-semibold text-slate-700">
              Yrkad ersättning
            </label>
            <input
              id="tpl-amount"
              type="text"
              placeholder="t.ex. 400 EUR / 680 kr"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tpl-name" className="block text-xs font-semibold text-slate-700">
            Ditt namn (valfritt – stannar i webbläsaren)
          </label>
          <input
            id="tpl-name"
            type="text"
            placeholder="Förnamn Efternamn"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="space-y-3 lg:col-span-7">
        <div className="print:hidden">
          <ClaimCopyBox
            title="Färdigt kravbrev (100 % lokalt i din webbläsare)"
            primaryText={generated.sv}
            secondaryEnglishText={generated.en}
          />
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 inline-flex items-center gap-2 rounded-[4px] border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#0B1F3A] transition hover:bg-slate-100"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Spara kravbrev som PDF / Skriv ut</span>
          </button>
        </div>

        <div className="hidden border border-[#CBD5E1] p-4 print:block">
          <p className="border-b border-[#0B1F3A] pb-2 font-serif text-base font-bold text-[#0B1F3A]">
            ReseRätt.se &mdash; Utskrift av reklamationsbrev ({operator.shortName})
          </p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[10pt] leading-relaxed text-[#0F172A]">
            {generated.sv}
          </pre>
        </div>
      </div>
    </div>
  );
}
