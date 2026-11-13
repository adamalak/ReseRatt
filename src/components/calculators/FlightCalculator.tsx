"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plane,
  Scale,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClaimCopyBox } from "@/components/ClaimCopyBox";
import { ShareSummaryBar } from "@/components/ShareSummaryBar";
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
  const [showClaimText, setShowClaimText] = useState<boolean>(false);

  useEffect(() => {
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
    ]
  );

  const shareQueryString = `airline=${encodeURIComponent(result.airline.slug)}&type=${disruptionType}&delay=${arrivalDelayMinutes}&dist=${distanceBand}&cause=${cause}&half=${reroutedWithinHalfCutLimit ? "1" : "0"}&pax=${passengerCount}&wait=${waitingHoursAtAirport}&care=${reasonableCareExpensesKr}`;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left: Inputs */}
      <div className="space-y-5 rounded-lg border border-[#DDD9CE] bg-white p-5 sm:p-6 lg:col-span-6">
        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            1. Flygbolag
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FLIGHT_OPERATORS.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setAirlineSlug(item.slug)}
                className={`rounded-md border px-2.5 py-2 text-xs font-semibold transition ${
                  airlineSlug === item.slug
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/70"
                }`}
              >
                {item.shortName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
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
                className={`rounded-md border px-3 py-2 text-left text-xs font-semibold transition ${
                  disruptionType === val
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {disruptionType === "delay" && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <label htmlFor="flight-delay-input" className="text-sm text-stone-700">
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
                className="font-mono-num w-24 rounded-md border border-stone-300 px-3 py-1.5 text-right text-sm font-semibold"
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            3. Flygsträcka &amp; antal passagerare
          </label>
          <div className="mt-2 space-y-2">
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
                className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition ${
                  distanceBand === val
                    ? "border-[#143A66] bg-[#143A66] font-semibold text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/70"
                }`}
              >
                <span>{label}</span>
                <span className="font-mono-num shrink-0 font-bold">{amt}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <label htmlFor="flight-pax-input" className="text-sm text-stone-700">
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
              className="font-mono-num w-20 rounded-md border border-stone-300 px-3 py-1.5 text-right text-sm font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
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
                className={`rounded-md border px-2.5 py-2 text-left text-xs font-semibold transition ${
                  cause === val
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="wait-hours-input" className="block text-xs text-stone-600">
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
                className="font-mono-num mt-1 w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label htmlFor="care-expenses-input" className="block text-xs text-stone-600">
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
                className="font-mono-num mt-1 w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm font-semibold"
              />
            </div>
          </div>

          <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-stone-700">
            <input
              type="checkbox"
              checked={reroutedWithinHalfCutLimit}
              onChange={(e) => setReroutedWithinHalfCutLimit(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#143A66]"
            />
            <span>
              Jag blev ombokad och landade nära ny tidsgräns (2/3/4 tim – kan halvera schablonen
              med 50 %)
            </span>
          </label>
        </div>
      </div>

      {/* Right: Result + Transparent Direct vs Partner Guidance */}
      <div className="space-y-5 lg:col-span-6">
        <div
          className={`rounded-lg border p-5 sm:p-6 ${
            result.eligibleForCashCompensation
              ? "border-emerald-300 bg-white"
              : "border-[#DDD9CE] bg-white"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                result.eligibleForCashCompensation
                  ? "bg-emerald-100 text-[#0B6B4F]"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {result.eligibleForCashCompensation ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Rätt till EU 261-kompensation</span>
                </>
              ) : (
                <>
                  <Plane className="h-3.5 w-3.5" />
                  <span>Ingen schablonersättning (se omvårdnad)</span>
                </>
              )}
            </span>
            <span className="font-mono-num text-xs text-stone-500">
              {result.airline.shortName} &middot; {passengerCount} pers
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-stone-500">
              Beräknad EU 261-schablonersättning
            </p>
            <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {formatEUR(result.totalEur)}
            </p>
            {result.totalEur > 0 && (
              <p className="mt-1 text-sm text-stone-600">
                Motsvarar ca{" "}
                <strong className="font-mono-num text-zinc-900">
                  {formatSEK(result.approxTotalSek)}
                </strong>{" "}
                <span className="text-xs text-stone-500">(riktkurs 11,40 kr/EUR)</span>
              </p>
            )}
          </div>

          {/* Care rights > 2-4h (Article 9) */}
          {(result.careRightsActive || result.reasonableCareExpensesKr > 0) && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs leading-relaxed text-zinc-800">
              <p className="flex items-center gap-1.5 font-semibold text-[#0B6B4F]">
                <Utensils className="h-4 w-4" />
                <span>Omvårdnadsrätt aktiv (Artikel 9 – gäller även vid oväder!)</span>
              </p>
              <p className="mt-1">
                Efter {result.careThresholdHours} timmars väntan på denna sträcka måste{" "}
                {result.airline.shortName} stå för skälig mat, dryck och vid behov hotell +
                transfer. Dina angivna utlägg på{" "}
                <strong className="font-mono-num">
                  {formatSEK(result.reasonableCareExpensesKr)}
                </strong>{" "}
                ska krävas separat mot originalkvitton.
              </p>
            </div>
          )}

          {/* HD 2-month reminder */}
          <div className="mt-4 rounded-md border border-[#CBD5E1] bg-[#EEF3F8] p-3.5 text-xs leading-relaxed text-zinc-800">
            <p className="flex items-center gap-1.5 font-semibold text-[#143A66]">
              <Scale className="h-4 w-4" />
              <span>Viktig svensk tidsgräns (NJA 2018 s. 127)</span>
            </p>
            <p className="mt-1">{result.hdDeadlineNote}</p>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="mt-4 space-y-2">
              {result.warnings.map((w) => (
                <div
                  key={w}
                  className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Direct free claim FIRST */}
          <div className="mt-5 space-y-2.5">
            <a
              href={result.airline.claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#143A66] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0E294A]"
            >
              <span>Steg 1: {result.airline.claimCtaLabel} (0 kr avgift · behåll 100 %)</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setShowClaimText((prev) => !prev)}
              className="w-full rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-stone-100"
            >
              {showClaimText
                ? "Dölj färdig EU 261-kravtext"
                : "Visa färdig EU 261-kravtext (Svenska & English)"}
            </button>
          </div>

          {/* Step 2: Transparent comparison (free direct vs ARN vs partner when configured) */}
          <div className="mt-4 rounded-md border border-stone-200 bg-[#FAF9F6] p-3.5 text-xs leading-relaxed text-stone-700">
            <p className="flex items-center gap-1.5 font-semibold text-zinc-900">
              <ShieldCheck className="h-4 w-4 text-[#143A66]" />
              <span>Steg 2 om flygbolaget vägrar betala:</span>
            </p>
            <p className="mt-1">
              Du kan anmäla avslaget gratis till{" "}
              <a
                href="https://www.arn.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#143A66] underline"
              >
                Allmänna reklamationsnämnden (ARN)
              </a>{" "}
              eller välja att anlita ett ersättningsombud (som normalt tar ca 25–35 % i provision
              endast vid vinst).
            </p>
            {SITE_CONFIG.flightPartnerUrl && (
              <div className="mt-2.5 border-t border-stone-200 pt-2.5">
                <span className="mr-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-900 uppercase">
                  Annons
                </span>
                <a
                  href={SITE_CONFIG.flightPartnerUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="font-semibold text-[#143A66] underline"
                >
                  Pröva ärendet via partnerombud ({SITE_CONFIG.flightPartnerName || "Ombud"}) &rarr;
                </a>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <ShareSummaryBar
              summaryText={result.shareSummaryText}
              shareQueryString={shareQueryString}
              sharePath={`/bolag/${result.airline.slug}`}
            />
            <Link
              href={`/bolag/${result.airline.slug}`}
              className="pt-2 text-xs font-semibold text-[#143A66] hover:underline"
            >
              Alla {result.airline.shortName}-regler &rarr;
            </Link>
          </div>
        </div>

        {showClaimText && (
          <ClaimCopyBox
            title="EU 261-kravtext (Svenska & English)"
            primaryText={result.claimTextSwedish}
            secondaryEnglishText={result.claimTextEnglish}
          />
        )}
      </div>
    </div>
  );
}
