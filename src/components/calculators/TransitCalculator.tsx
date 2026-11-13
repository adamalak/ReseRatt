"use client";

import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClaimCopyBox } from "@/components/ClaimCopyBox";
import { ShareSummaryBar } from "@/components/ShareSummaryBar";
import {
  calculateTransitCompensation,
  type RouteDistanceBand,
  type TransitTicketType,
} from "@/lib/calculators/transit";
import { TRANSIT_OPERATORS } from "@/lib/data/operators";
import { formatDelayDuration, formatSEK } from "@/lib/format";

interface TransitCalculatorProps {
  initialOperatorSlug?: string;
  hideOperatorGuideLink?: boolean;
}

const POPULAR_SLUGS = ["sl", "sj", "vasttrafik", "skanetrafiken", "malartag", "oresundstag"];
const QUICK_DELAYS = [15, 25, 45, 65, 125];

export function TransitCalculator({
  initialOperatorSlug = "sl",
  hideOperatorGuideLink = false,
}: TransitCalculatorProps) {
  const [operatorSlug, setOperatorSlug] = useState<string>(initialOperatorSlug);
  const [ticketType, setTicketType] = useState<TransitTicketType>("single");
  const [ticketPriceKr, setTicketPriceKr] = useState<number>(220);
  const [delayMinutes, setDelayMinutes] = useState<number>(45);
  const [routeDistanceBand, setRouteDistanceBand] =
    useState<RouteDistanceBand>("under_150km");
  const [usedTaxi, setUsedTaxi] = useState<boolean>(false);
  const [taxiCostKr, setTaxiCostKr] = useState<number>(480);
  const [passengersSharingTaxi, setPassengersSharingTaxi] = useState<number>(1);
  const [usedOwnCar, setUsedOwnCar] = useState<boolean>(false);
  const [ownCarKm, setOwnCarKm] = useState<number>(30);
  const [tollsAndParkingKr, setTollsAndParkingKr] = useState<number>(0);
  const [preferVoucher, setPreferVoucher] = useState<boolean>(false);
  const [hadValidTicketBeforeDelay, setHadValidTicketBeforeDelay] =
    useState<boolean>(true);
  const [isNightTrainDepartureOver180Min, setIsNightTrainDepartureOver180Min] =
    useState<boolean>(true);
  const [showClaimLetter, setShowClaimLetter] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const op = params.get("op");
    const ticket = params.get("ticket");
    const price = Number(params.get("price"));
    const delay = Number(params.get("delay"));
    const dist = params.get("dist");
    const taxi = params.get("taxi");
    const taxiCost = Number(params.get("taxiCost"));
    const pax = Number(params.get("pax"));
    const car = params.get("car");
    const km = Number(params.get("km"));
    const tolls = Number(params.get("tolls"));
    const voucher = params.get("voucher");
    const valid = params.get("valid");

    if (op && TRANSIT_OPERATORS.some((o) => o.slug === op)) setOperatorSlug(op);
    if (ticket === "single" || ticket === "period_30" || ticket === "annual") {
      setTicketType(ticket);
    }
    if (Number.isFinite(price) && price > 0) setTicketPriceKr(price);
    if (Number.isFinite(delay) && delay >= 0 && delay <= 600) setDelayMinutes(delay);
    if (dist === "under_150km" || dist === "over_150km") setRouteDistanceBand(dist);
    if (taxi === "1" || taxi === "0") setUsedTaxi(taxi === "1");
    if (Number.isFinite(taxiCost) && taxiCost >= 0) setTaxiCostKr(taxiCost);
    if (Number.isFinite(pax) && pax >= 1 && pax <= 8) setPassengersSharingTaxi(pax);
    if (car === "1" || car === "0") setUsedOwnCar(car === "1");
    if (Number.isFinite(km) && km >= 0) setOwnCarKm(km);
    if (Number.isFinite(tolls) && tolls >= 0) setTollsAndParkingKr(tolls);
    if (voucher === "1" || voucher === "0") setPreferVoucher(voucher === "1");
    if (valid === "1" || valid === "0") setHadValidTicketBeforeDelay(valid === "1");
  }, []);

  const handleTicketTypeChange = (nextType: TransitTicketType) => {
    setTicketType(nextType);
    if (nextType === "single" && ticketPriceKr > 1500) setTicketPriceKr(220);
    if (nextType === "period_30" && ticketPriceKr < 500) setTicketPriceKr(1060);
    if (nextType === "annual" && ticketPriceKr < 3000) setTicketPriceKr(11000);
  };

  const result = useMemo(
    () =>
      calculateTransitCompensation({
        operatorSlug,
        ticketType,
        ticketPriceKr,
        delayMinutes,
        routeDistanceBand,
        usedTaxi,
        taxiCostKr,
        passengersSharingTaxi,
        usedOwnCar,
        ownCarKm,
        tollsAndParkingKr,
        preferVoucher,
        hadValidTicketBeforeDelay,
        isNightTrainDepartureOver180Min,
      }),
    [
      operatorSlug,
      ticketType,
      ticketPriceKr,
      delayMinutes,
      routeDistanceBand,
      usedTaxi,
      taxiCostKr,
      passengersSharingTaxi,
      usedOwnCar,
      ownCarKm,
      tollsAndParkingKr,
      preferVoucher,
      hadValidTicketBeforeDelay,
      isNightTrainDepartureOver180Min,
    ]
  );

  const op = result.operator;

  const shareQueryString = `op=${encodeURIComponent(op.slug)}&ticket=${ticketType}&price=${ticketPriceKr}&delay=${delayMinutes}&dist=${routeDistanceBand}&taxi=${usedTaxi ? "1" : "0"}&taxiCost=${taxiCostKr}&pax=${passengersSharingTaxi}&car=${usedOwnCar ? "1" : "0"}&km=${ownCarKm}&tolls=${tollsAndParkingKr}&voucher=${preferVoucher ? "1" : "0"}&valid=${hadValidTicketBeforeDelay ? "1" : "0"}`;

  const hasAlternativeClaim = usedTaxi || usedOwnCar;
  const isPositiveOutcome =
    (hasAlternativeClaim && result.reimbursedAlternativeKr > 0) ||
    (!hasAlternativeClaim && result.eligibleForTicketRefund);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left: Thumb-friendly Inputs */}
      <div className="space-y-5 rounded-lg border border-[#DDD9CE] bg-white p-5 sm:p-6 lg:col-span-6">
        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            1. Vilket bolag reser du med?
          </label>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {POPULAR_SLUGS.map((slug) => {
              const item = TRANSIT_OPERATORS.find((o) => o.slug === slug);
              if (!item) return null;
              const active = operatorSlug === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setOperatorSlug(slug)}
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "border-[#143A66] bg-[#143A66] text-white"
                      : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/70"
                  }`}
                >
                  {item.shortName}
                </button>
              );
            })}
          </div>

          <select
            aria-label="Välj trafikbolag eller länstrafik"
            value={operatorSlug}
            onChange={(e) => setOperatorSlug(e.target.value)}
            className="mt-2.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 focus:border-[#143A66] focus:outline-none"
          >
            {TRANSIT_OPERATORS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name} ({item.categoryLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Hybrid 150 km rule selector when applicable */}
        {op.ruleMode === "hybrid_150km" && (
          <div className="rounded-md border border-[#CBD5E1] bg-[#EEF3F8] p-3.5">
            <label className="block text-xs font-semibold text-[#143A66]">
              Hur lång är tågets totala linjesträcka? (Viktig 15-milsregel!)
            </label>
            <p className="mt-1 text-xs leading-relaxed text-stone-700">
              Räkna från tågets första till sista station på tidtabellen – inte bara hur långt du
              själv åker.
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRouteDistanceBand("under_150km")}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                  routeDistanceBand === "under_150km"
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-white text-zinc-800"
                }`}
              >
                Under 15 mil (&lt; 150 km)
                <span className="mt-0.5 block font-normal opacity-85">Ersättning från 20 min</span>
              </button>
              <button
                type="button"
                onClick={() => setRouteDistanceBand("over_150km")}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                  routeDistanceBand === "over_150km"
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-white text-zinc-800"
                }`}
              >
                15 mil eller mer (≥ 150 km)
                <span className="mt-0.5 block font-normal opacity-85">Ersättning från 60 min</span>
              </button>
            </div>
          </div>
        )}

        {/* Delay selector */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="delay-minutes-input"
              className="text-xs font-semibold tracking-wider text-stone-500 uppercase"
            >
              2. Försening till slutdestination
            </label>
            <span className="font-mono-num text-base font-bold text-[#143A66]">
              {formatDelayDuration(delayMinutes)}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_DELAYS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDelayMinutes(m)}
                className={`font-mono-num rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                  delayMinutes === m
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-700 hover:bg-stone-200/60"
                }`}
              >
                {m} min
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={240}
              step={5}
              value={Math.min(240, delayMinutes)}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="rr-slider flex-1"
              aria-label="Försening i minuter"
            />
            <input
              id="delay-minutes-input"
              type="number"
              min={0}
              max={1440}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Math.max(0, Number(e.target.value)))}
              className="font-mono-num w-20 rounded-md border border-stone-300 px-2.5 py-1.5 text-right text-sm font-semibold text-zinc-900"
            />
          </div>
        </div>

        {/* Ticket type & cost */}
        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            3. Biljettyp &amp; pris
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ["single", "Enkelbiljett"],
                ["period_30", "30-dagarskort"],
                ["annual", "Årskort"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => handleTicketTypeChange(val)}
                className={`rounded-md border px-2.5 py-2 text-xs font-semibold transition ${
                  ticketType === val
                    ? "border-[#143A66] bg-[#143A66] text-white"
                    : "border-stone-300 bg-[#FAF9F6] text-zinc-800 hover:bg-stone-200/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <label htmlFor="ticket-price-input" className="text-sm text-stone-700">
              {ticketType === "single"
                ? "Pris för enkelbiljetten (kr):"
                : ticketType === "period_30"
                  ? "Vad kostade 30-dagarskortet (kr)?"
                  : "Vad kostade årskortet (kr)?"}
            </label>
            <input
              id="ticket-price-input"
              type="number"
              min={0}
              max={100000}
              value={ticketPriceKr}
              onChange={(e) => setTicketPriceKr(Math.max(0, Number(e.target.value)))}
              className="font-mono-num w-28 rounded-md border border-stone-300 px-3 py-1.5 text-right text-sm font-semibold text-zinc-900"
            />
          </div>
          {op.periodTicketRule.fixedAdult30DayPayoutsKr && ticketType === "period_30" && (
            <p className="mt-1.5 text-xs text-stone-500">
              Hos SL vuxen 30-dagars används fasta schablonbelopp (6 / 9 / 12 kr) oavsett
              inköpspris.
            </p>
          )}
        </div>

        {/* Voucher bonus toggle when supported */}
        {op.taxiAndCar.voucherBonusPercent && (
          <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50/70 p-3">
            <input
              type="checkbox"
              checked={preferVoucher}
              onChange={(e) => setPreferVoucher(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#0B6B4F]"
            />
            <span className="text-xs leading-relaxed text-zinc-800">
              <strong>Få +{op.taxiAndCar.voucherBonusPercent} % extra som värdekod/värdebevis</strong>{" "}
              i stället för kontanter till bankkonto ({op.shortName}-förmån).
            </span>
          </label>
        )}

        {/* Taxi / Own car emergency expander */}
        <div className="border-t border-stone-200 pt-4">
          <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            4. Behövde du ta taxi eller egen bil?
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setUsedTaxi((prev) => !prev);
                setUsedOwnCar(false);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                usedTaxi
                  ? "border-[#143A66] bg-[#143A66] text-white"
                  : "border-stone-300 bg-[#FAF9F6] text-zinc-800"
              }`}
            >
              <Car className="h-3.5 w-3.5" />
              <span>Taxi ({op.taxiAndCar.taxiSupported ? "Ja" : "Se villkor"})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUsedOwnCar((prev) => !prev);
                setUsedTaxi(false);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                usedOwnCar
                  ? "border-[#143A66] bg-[#143A66] text-white"
                  : "border-stone-300 bg-[#FAF9F6] text-zinc-800"
              }`}
            >
              <Car className="h-3.5 w-3.5" />
              <span>Egen bil (25 kr/mil)</span>
            </button>
          </div>

          {usedTaxi && (
            <div className="mt-3 space-y-2.5 rounded-md border border-stone-200 bg-[#FAF9F6] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="taxi-cost-input" className="text-xs font-medium text-stone-700">
                  Taxikostnad på kvittot (kr):
                </label>
                <input
                  id="taxi-cost-input"
                  type="number"
                  min={0}
                  max={25000}
                  value={taxiCostKr}
                  onChange={(e) => setTaxiCostKr(Math.max(0, Number(e.target.value)))}
                  className="font-mono-num w-28 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-right text-sm font-semibold"
                />
              </div>
              {op.taxiAndCar.taxiStacksPerPassenger && (
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="pax-taxi-input" className="text-xs font-medium text-stone-700">
                    Antal betalande resenärer i taxin:
                  </label>
                  <input
                    id="pax-taxi-input"
                    type="number"
                    min={1}
                    max={8}
                    value={passengersSharingTaxi}
                    onChange={(e) =>
                      setPassengersSharingTaxi(Math.max(1, Math.min(8, Number(e.target.value))))
                    }
                    className="font-mono-num w-20 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-right text-sm font-semibold"
                  />
                </div>
              )}
              {op.taxiAndCar.deductUnboughtSingleTicketNote && (
                <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={hadValidTicketBeforeDelay}
                    onChange={(e) => setHadValidTicketBeforeDelay(e.target.checked)}
                    className="h-4 w-4 accent-[#143A66]"
                  />
                  <span>Jag hade redan köpt giltig biljett innan störningen uppstod</span>
                </label>
              )}
            </div>
          )}

          {usedOwnCar && (
            <div className="mt-3 space-y-2.5 rounded-md border border-stone-200 bg-[#FAF9F6] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="car-km-input" className="text-xs font-medium text-stone-700">
                  Körd sträcka med bil (km):
                </label>
                <input
                  id="car-km-input"
                  type="number"
                  min={0}
                  max={1000}
                  value={ownCarKm}
                  onChange={(e) => setOwnCarKm(Math.max(0, Number(e.target.value)))}
                  className="font-mono-num w-24 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-right text-sm font-semibold"
                />
              </div>
              {op.slug === "vasttrafik" && (
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="car-tolls-input" className="text-xs font-medium text-stone-700">
                    Trängselskatt &amp; parkering (kr):
                  </label>
                  <input
                    id="car-tolls-input"
                    type="number"
                    min={0}
                    max={2000}
                    value={tollsAndParkingKr}
                    onChange={(e) => setTollsAndParkingKr(Math.max(0, Number(e.target.value)))}
                    className="font-mono-num w-24 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-right text-sm font-semibold"
                  />
                </div>
              )}
            </div>
          )}

          {op.slug === "snalltaget" && (
            <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-zinc-800">
              <input
                type="checkbox"
                checked={isNightTrainDepartureOver180Min}
                onChange={(e) => setIsNightTrainDepartureOver180Min(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#143A66]"
              />
              <span>
                Dagtåg (eller nattåg med &gt; 180 min försening vid avgång)
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Right: Above-the-fold Perrong Result Card */}
      <div className="space-y-5 lg:col-span-6">
        <div
          className={`rounded-lg border p-5 sm:p-6 ${
            isPositiveOutcome
              ? "border-emerald-300 bg-white"
              : "border-[#DDD9CE] bg-white"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isPositiveOutcome
                  ? "bg-emerald-100 text-[#0B6B4F]"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {isPositiveOutcome ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Trolig rätt till ersättning</span>
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  <span>Under tidsgräns ({result.effectiveThresholdMinutes} min)</span>
                </>
              )}
            </span>

            <span className="font-mono-num text-xs text-stone-500">{op.shortName}</span>
          </div>

          <div className="mt-4">
            {hasAlternativeClaim ? (
              <>
                <p className="text-xs font-medium text-stone-500">
                  Beräknad ersättning för {usedTaxi ? "taxi" : "egen bil"}
                </p>
                <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  {formatSEK(result.reimbursedAlternativeKr)}
                </p>
                {result.alternativeTransportCapKr > 0 && (
                  <p className="mt-1.5 text-sm text-stone-600">
                    Maxbelopp hos {op.shortName}:{" "}
                    <strong className="font-mono-num text-zinc-900">
                      {formatSEK(result.alternativeTransportCapKr)}
                    </strong>
                    {result.outOfPocketExcessKr > 0 && (
                      <span className="text-amber-800">
                        {" "}
                        ({formatSEK(result.outOfPocketExcessKr)} över taket betalas själv)
                      </span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-stone-500">
                  Beräknad biljettersättning ({result.ticketCompensationPercent} %)
                </p>
                <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  {formatSEK(result.totalTicketWithBonusKr)}
                </p>
                {result.voucherBonusKr > 0 && (
                  <p className="mt-1 text-xs font-medium text-[#0B6B4F]">
                    Inkluderar +{formatSEK(result.voucherBonusKr)} värdekodsbonus (+
                    {result.voucherBonusPercent} %)
                  </p>
                )}
                {result.periodSchablonUsed && (
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                    <Ticket className="mr-1 inline h-3.5 w-3.5 text-[#143A66]" />
                    {result.periodSchablonUsed}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Taxi quick badge even if user didn't open taxi yet */}
          {!hasAlternativeClaim && op.taxiAndCar.taxiSupported && (
            <div className="mt-4 rounded-md border border-[#CBD5E1] bg-[#EEF3F8] p-3 text-xs leading-relaxed text-zinc-800">
              <strong>Behöver du ta taxi i stället?</strong> {op.taxiAndCar.taxiNote}
            </div>
          )}

          {/* Key facts grid */}
          <dl className="mt-4 divide-y divide-stone-200 rounded-md border border-stone-200 bg-[#FAF9F6] text-xs">
            <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
              <dt className="text-stone-500">Regelverk</dt>
              <dd className="text-right font-medium text-zinc-900">{result.legalBasisLabel}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
              <dt className="text-stone-500">Sista ansökningsdag</dt>
              <dd className="text-right font-semibold text-zinc-900">{op.deadlineText}</dd>
            </div>
          </dl>

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

          {/* Spara detta NU checklist */}
          <div className="mt-4 rounded-md border border-stone-200 bg-[#FAF9F6] p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
              <ShieldCheck className="h-4 w-4 text-[#143A66]" />
              <span>Spara detta NU som bevis</span>
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-700">
              {op.evidenceChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#143A66]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Action CTA + Share */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={op.claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#143A66] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0E294A]"
            >
              <span>{op.claimCtaLabel}</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setShowClaimLetter((prev) => !prev)}
              className="rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-800 transition hover:bg-stone-100"
            >
              {showClaimLetter ? "Dölj kravtext" : "Visa färdig kravtext"}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <ShareSummaryBar
              summaryText={result.shareSummaryText}
              shareQueryString={shareQueryString}
              sharePath={`/bolag/${op.slug}`}
            />
            {!hideOperatorGuideLink && (
              <Link
                href={`/bolag/${op.slug}`}
                className="inline-flex items-center gap-1 pt-2 text-xs font-semibold text-[#143A66] hover:underline"
              >
                <Info className="h-3.5 w-3.5" />
                <span>Alla {op.shortName}-regler</span>
              </Link>
            )}
          </div>
        </div>

        {showClaimLetter && <ClaimCopyBox primaryText={result.claimTextTemplate} />}
      </div>
    </div>
  );
}
