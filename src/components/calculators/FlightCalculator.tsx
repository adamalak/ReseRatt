"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plane,
  Printer,
  Scale,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClaimCopyBox } from "@/components/ClaimCopyBox";
import { PrintSpecSheet } from "@/components/PrintSpecSheet";
import { ShareSummaryBar } from "@/components/ShareSummaryBar";
import { StickyMobileResultBar } from "@/components/StickyMobileResultBar";
import {
  calculateFlightCompensation,
  type FlightDisruptionCause,
  type FlightDisruptionType,
  type FlightDistanceBand,
} from "@/lib/calculators/flight";
import { FLIGHT_OPERATORS } from "@/lib/data/operators";
import { formatEUR, formatSEK } from "@/lib/format";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface FlightCalculatorProps {
  initialAirlineSlug?: string;
}

export function FlightCalculator({ initialAirlineSlug = "sas" }: FlightCalculatorProps) {
  const [airlineSlug, setAirlineSlug] = useState<string>(initialAirlineSlug);
  const [disruptionType, setDisruptionType] =
    useState<FlightDisruptionType>("delay");
  const [arrivalDelayMinutes, setArrivalDelayMinutes] = useState<number>(210);
  const [distanceBand, setDistanceBand] =
    useState<FlightDistanceBand>("intra_eu_gt_1500");
  const [cause, setCause] = useState<FlightDisruptionCause>("technical_or_crew");
  const [reroutedWithinHalfCutLimit, setReroutedWithinHalfCutLimit] =
    useState<boolean>(false);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [waitingHoursAtAirport, setWaitingHoursAtAirport] = useState<number>(3.5);
  const [reasonableCareExpensesKr, setReasonableCareExpensesKr] =
    useState<number>(250);

  const [travelDate, setTravelDate] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [bookingRef, setBookingRef] = useState<string>("");

  useEffect(() => {
    setTravelDate(new Date().toISOString().slice(0, 10));

    const params = new URLSearchParams(window.location.search);
    const airline = params.get("airline");
    const type = params.get("type");
    const delay = Number(params.get("delay"));
    const dist = params.get("dist");
    const causeParam = params.get("cause");
    const half = params.get("half");
    const pax = Number(params.get("pax"));
    const wait = Number(params.get("wait"));
    const care = Number(params.get("care"));

    if (airline && FLIGHT_OPERATORS.some((o) => o.slug === airline)) setAirlineSlug(airline);
    if (
      type === "delay" ||
      type === "cancelled_under_14d" ||
      type === "cancelled_over_14d" ||
      type === "denied_boarding"
    ) {
      setDisruptionType(type);
    }
    if (Number.isFinite(delay) && delay >= 0) setArrivalDelayMinutes(delay);
    if (
      dist === "le_1500" ||
      dist === "intra_eu_gt_1500" ||
      dist === "non_eu_1500_3500" ||
      dist === "gt_3500"
    ) {
      setDistanceBand(dist);
    }
    if (
      causeParam === "technical_or_crew" ||
      causeParam === "airline_strike" ||
      causeParam === "weather_or_atc" ||
      causeParam === "unknown"
    ) {
      setCause(causeParam);
    }
    if (half === "1" || half === "0") setReroutedWithinHalfCutLimit(half === "1");
    if (Number.isFinite(pax) && pax >= 1 && pax <= 9) setPassengerCount(pax);
    if (Number.isFinite(wait) && wait >= 0) setWaitingHoursAtAirport(wait);
    if (Number.isFinite(care) && care >= 0) setReasonableCareExpensesKr(care);
  }, []);

  const result = useMemo(
    () =>
      calculateFlightCompensation({
        airlineSlug,
        disruptionType,
        arrivalDelayMinutes,
        distanceBand,
        cause,
        reroutedWithinHalfCutLimit,
        passengerCount,
        waitingHoursAtAirport,
        reasonableCareExpensesKr,
        travelDate,
        flightNumber,
        bookingRef,
      }),
    [
      airlineSlug,
      disruptionType,
      arrivalDelayMinutes,
      distanceBand,
      cause,
      reroutedWithinHalfCutLimit,
      passengerCount,
      waitingHoursAtAirport,
      reasonableCareExpensesKr,
      travelDate,
      flightNumber,
      bookingRef,
    ]
  );

  const shareQueryString = `airline=${encodeURIComponent(result.airline.slug)}&type=${disruptionType}&delay=${arrivalDelayMinutes}&dist=${distanceBand}&cause=${cause}&half=${reroutedWithinHalfCutLimit ? "1" : "0"}&pax=${passengerCount}&wait=${waitingHoursAtAirport}&care=${reasonableCareExpensesKr}`;

  const combinedTotalSek = result.approxTotalSek + result.reasonableCareExpensesKr;
  const schablonPct =
    combinedTotalSek > 0 ? Math.round((result.approxTotalSek / combinedTotalSek) * 100) : 0;
  const carePct = combinedTotalSek > 0 ? 100 - schablonPct : 0;

  const stickyValueText =
    result.totalEur > 0
      ? `${formatEUR(result.totalEur)} (ca ${formatSEK(result.approxTotalSek)})`
      : result.careRightsActive
        ? `Omvårdnad (${formatSEK(result.reasonableCareExpensesKr)})`
        : "Ingen schablonersättning";

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-12 print:hidden">
        {/* Left: Inputs */}
        <div className="space-y-5 rounded border border-[#CBD5E1] bg-white p-4 sm:p-6 lg:col-span-6">
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              1. Flygbolag
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FLIGHT_OPERATORS.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setAirlineSlug(item.slug)}
                  className={`rounded-[4px] border px-2.5 py-2 text-xs font-semibold transition ${
                    airlineSlug === item.slug
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  {item.shortName}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              2. Vad hände med flyget?
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["delay", "Försenad ankomst"],
                  ["cancelled_under_14d", "Inställt < 14 dagar före"],
                  ["cancelled_over_14d", "Inställt ≥ 14 dagar före"],
                  ["denied_boarding", "Nekad ombordstigning"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDisruptionType(val)}
                  className={`rounded-[4px] border px-3 py-2 text-left text-xs font-semibold transition ${
                    disruptionType === val
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {disruptionType === "delay" && (
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <label htmlFor="flight-delay-input" className="text-sm text-slate-700">
                  Ankomstförsening när dörren öppnas (min):
                </label>
                <input
                  id="flight-delay-input"
                  type="number"
                  min={0}
                  max={2000}
                  step={15}
                  value={arrivalDelayMinutes}
                  onChange={(e) => setArrivalDelayMinutes(Math.max(0, Number(e.target.value)))}
                  className="font-mono-num w-24 rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-right text-sm font-semibold text-[#0F172A]"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              3. Flygsträcka &amp; antal passagerare
            </label>
            <div className="mt-2 space-y-1.5">
              {(
                [
                  [
                    "le_1500",
                    "≤ 1 500 km (t.ex. Stockholm–London, Berlin, Köpenhamn)",
                    "250 EUR",
                  ],
                  [
                    "intra_eu_gt_1500",
                    "> 1 500 km inom EU/EES (t.ex. Arlanda–Malaga, Rom, Grekland)",
                    "400 EUR",
                  ],
                  [
                    "non_eu_1500_3500",
                    "1 500–3 500 km utanför EU (t.ex. Turkiet, Egypten)",
                    "400 EUR",
                  ],
                  [
                    "gt_3500",
                    "> 3 500 km utanför EU (t.ex. New York, Bangkok, Dubai)",
                    "600 EUR",
                  ],
                ] as const
              ).map(([val, label, amt]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDistanceBand(val)}
                  className={`flex w-full items-center justify-between gap-2 rounded-[4px] border px-3 py-2 text-left text-xs transition ${
                    distanceBand === val
                      ? "border-[#0B1F3A] bg-[#0B1F3A] font-semibold text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  <span>{label}</span>
                  <span className="font-mono-num shrink-0 font-bold">{amt}</span>
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <label htmlFor="flight-pax-input" className="text-sm text-slate-700">
                Antal betalande passagerare i sällskapet:
              </label>
              <input
                id="flight-pax-input"
                type="number"
                min={1}
                max={9}
                value={passengerCount}
                onChange={(e) =>
                  setPassengerCount(Math.max(1, Math.min(9, Number(e.target.value))))
                }
                className="font-mono-num w-20 rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-right text-sm font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              4. Angiven orsak &amp; väntetid på flygplatsen
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["technical_or_crew", "Tekniskt fel / personalbrist"],
                  ["airline_strike", "Flygbolagets egen strejk"],
                  ["weather_or_atc", "Extremväder / ATC / flygplats"],
                  ["unknown", "Okänd orsak ännu"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCause(val)}
                  className={`rounded-[4px] border px-2.5 py-2 text-left text-xs font-semibold transition ${
                    cause === val
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="wait-hours-input" className="block text-xs text-slate-600">
                  Väntan vid avgång (timmar)
                </label>
                <input
                  id="wait-hours-input"
                  type="number"
                  min={0}
                  max={48}
                  step={0.5}
                  value={waitingHoursAtAirport}
                  onChange={(e) => setWaitingHoursAtAirport(Math.max(0, Number(e.target.value)))}
                  className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-2.5 py-1.5 text-sm font-semibold text-[#0F172A]"
                />
              </div>
              <div>
                <label htmlFor="care-expenses-input" className="block text-xs text-slate-600">
                  Utlägg mat/hotell (kr)
                </label>
                <input
                  id="care-expenses-input"
                  type="number"
                  min={0}
                  max={50000}
                  step={50}
                  value={reasonableCareExpensesKr}
                  onChange={(e) =>
                    setReasonableCareExpensesKr(Math.max(0, Number(e.target.value)))
                  }
                  className="font-mono-num mt-1 w-full rounded-[4px] border border-[#CBD5E1] px-2.5 py-1.5 text-sm font-semibold text-[#0F172A]"
                />
              </div>
            </div>

            <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={reroutedWithinHalfCutLimit}
                onChange={(e) => setReroutedWithinHalfCutLimit(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#0B1F3A]"
              />
              <span>
                Jag blev ombokad och landade nära ny tidsgräns (2/3/4 tim – kan halvera schablonen
                med 50 %)
              </span>
            </label>
          </div>
        </div>

        {/* Right: Result + Integrated Claim Text + PDF */}
        <div
          id="flight-result-panel"
          className="scroll-mt-28 space-y-4 lg:col-span-6 lg:scroll-mt-20"
        >
          <div className="rounded border border-[#CBD5E1] bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                {result.eligibleForCashCompensation ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-800" aria-hidden="true" />
                    <span className="text-emerald-900">Rätt till EU 261-kompensation</span>
                  </>
                ) : (
                  <>
                    <Plane className="h-4 w-4 text-slate-600" aria-hidden="true" />
                    <span className="text-slate-700">Ingen schablonersättning (se omvårdnad)</span>
                  </>
                )}
              </div>

              <span className="font-mono-num text-xs font-semibold text-slate-600">
                {result.airline.shortName} &middot; {passengerCount} pers
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-slate-600">
                Beräknad EU 261-schablonersättning
              </p>
              <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
                {formatEUR(result.totalEur)}
              </p>
              {result.totalEur > 0 && (
                <p className="tabular-nums mt-1 text-sm text-slate-600">
                  Motsvarar ca{" "}
                  <strong className="font-mono-num text-[#0B1F3A]">
                    {formatSEK(result.approxTotalSek)}
                  </strong>{" "}
                  <span className="text-xs text-slate-500">(riktkurs 11,40 kr/EUR)</span>
                </p>
              )}

              {/* Visual Compensation Split Bar */}
              {combinedTotalSek > 0 && (
                <div className="mt-3 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3">
                  <div className="tabular-nums flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
                    <span>
                      Schablon: {formatSEK(result.approxTotalSek)} ({schablonPct} %)
                    </span>
                    {result.reasonableCareExpensesKr > 0 && (
                      <span className="text-[#92400E]">
                        Omvårdnad Art. 9: {formatSEK(result.reasonableCareExpensesKr)} ({carePct} %)
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex h-2.5 w-full overflow-hidden border border-[#CBD5E1] bg-white">
                    {schablonPct > 0 && (
                      <div className="h-full bg-[#0B1F3A]" style={{ width: `${schablonPct}%` }} />
                    )}
                    {carePct > 0 && (
                      <div className="h-full bg-[#D97706]" style={{ width: `${carePct}%` }} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Care rights > 2-4h (Article 9) */}
            {(result.careRightsActive || result.reasonableCareExpensesKr > 0) && (
              <div className="mt-4 rounded-[4px] border border-emerald-700/30 border-l-4 border-l-emerald-800 bg-emerald-50 p-3.5 text-xs leading-relaxed text-[#0F172A]">
                <p className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Utensils className="h-4 w-4" aria-hidden="true" />
                  <span>Omvårdnadsrätt aktiv (Artikel 9 – gäller även vid oväder!)</span>
                </p>
                <p className="tabular-nums mt-1">
                  Efter {result.careThresholdHours} timmars väntan måste {result.airline.shortName}{" "}
                  stå för skälig mat, dryck och vid behov hotell + transfer. Utlägg på{" "}
                  <strong className="font-mono-num">
                    {formatSEK(result.reasonableCareExpensesKr)}
                  </strong>{" "}
                  krävs separat mot originalkvitton.
                </p>
              </div>
            )}

            {/* HD 2-month reminder */}
            <div className="mt-4 rounded-[4px] border border-[#CBD5E1] border-l-4 border-l-[#0B1F3A] bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-[#0F172A]">
              <p className="flex items-center gap-1.5 font-bold text-[#0B1F3A]">
                <Scale className="h-4 w-4" aria-hidden="true" />
                <span>Svensk tidsgräns (NJA 2018 s. 127)</span>
              </p>
              <p className="mt-1 text-slate-700">{result.hdDeadlineNote}</p>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="mt-4 space-y-2">
                {result.warnings.map((w) => (
                  <div
                    key={w}
                    className="flex items-start gap-2 rounded-[4px] border border-[#F59E0B] border-l-4 border-l-[#D97706] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" aria-hidden="true" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Primary CTA + PDF */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <a
                href={result.airline.claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163763]"
              >
                <span>Steg 1: {result.airline.claimCtaLabel}</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1F3A] transition hover:bg-slate-100"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>Spara underlag som PDF / Skriv ut</span>
              </button>
            </div>

            {/* Inline quick details + Bilingual ClaimCopyBox always visible */}
            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Anpassa kravtexten &amp; A4-underlaget (valfritt)
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  type="date"
                  aria-label="Flygdatum"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="font-mono-num rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
                <input
                  type="text"
                  aria-label="Flightnummer"
                  placeholder="Flightnr (t.ex. SK525)"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="font-mono-num rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
                <input
                  type="text"
                  aria-label="Bokningsreferens PNR"
                  placeholder="Bokningsnr / PNR"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  className="font-mono-num rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
              </div>

              <div className="mt-3">
                <ClaimCopyBox
                  compact
                  title="EU 261-kravtext (Svenska & English)"
                  primaryText={result.claimTextSwedish}
                  secondaryEnglishText={result.claimTextEnglish}
                />
              </div>
            </div>

            {/* Steg 2: Transparent comparison (ARN vs partner) */}
            <div className="mt-4 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-slate-700">
              <p className="font-bold text-[#0B1F3A]">Steg 2 om flygbolaget vägrar betala:</p>
              <p className="mt-1">
                Du kan anmäla avslaget gratis till{" "}
                <a
                  href="https://www.arn.se/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0B1F3A] underline"
                >
                  Allmänna reklamationsnämnden (ARN)
                </a>{" "}
                eller välja ett ersättningsombud (som normalt tar ca 25–35 % i provision vid vinst).
              </p>
              {SITE_CONFIG.flightPartnerUrl && (
                <div className="mt-2.5 border-t border-[#E2E8F0] pt-2.5">
                  <span className="mr-2 inline-block rounded-[2px] border border-[#F59E0B] bg-[#FFFBEB] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#92400E] uppercase">
                    Annons
                  </span>
                  <a
                    href={SITE_CONFIG.flightPartnerUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="font-semibold text-[#0B1F3A] underline"
                  >
                    Pröva ärendet via partnerombud ({SITE_CONFIG.flightPartnerName || "Ombud"}) &rarr;
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
              <ShareSummaryBar
                summaryText={result.shareSummaryText}
                shareQueryString={shareQueryString}
                sharePath={`/bolag/${result.airline.slug}`}
              />
              <Link
                href={`/bolag/${result.airline.slug}`}
                className="text-xs font-semibold text-[#0B1F3A] hover:underline"
              >
                Alla {result.airline.shortName}-regler &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <StickyMobileResultBar
        targetId="flight-result-panel"
        label="EU 261-bedömning:"
        valueText={stickyValueText}
        isPositive={result.eligibleForCashCompensation || result.careRightsActive}
        ctaLabel="Visa krav & länk"
      />

      <PrintSpecSheet
        title={`Flygersättning EU 261/2004 – ${result.airline.name}`}
        operatorName={result.airline.name}
        amountHeadline={
          result.totalEur > 0
            ? `${formatEUR(result.totalEur)} (ca ${formatSEK(result.approxTotalSek)})`
            : "0 EUR schablon"
        }
        legalBasis="Europaparlamentets och rådets förordning (EG) nr 261/2004 · NJA 2018 s. 127"
        deadline={result.airline.deadlineText}
        rows={[
          { label: "Flygdatum & flight", value: `${travelDate || "Ej angivet"} · ${flightNumber || "Ej angett flightnr"}` },
          { label: "Bokningsnr (PNR)", value: bookingRef || "Ej angett" },
          { label: "Passagerare", value: `${passengerCount} st` },
          { label: "Ankomstförsening", value: `${arrivalDelayMinutes} min` },
          { label: "Utlägg mat/hotell (Art. 9)", value: formatSEK(result.reasonableCareExpensesKr) },
        ]}
        warnings={result.warnings}
        evidenceChecklist={result.airline.evidenceChecklist}
        claimUrl={result.airline.claimUrl}
        claimText={result.claimTextSwedish}
        secondaryEnglishText={result.claimTextEnglish}
      />
    </>
  );
}
