"use client";

import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Printer,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClaimCopyBox } from "@/components/ClaimCopyBox";
import { PrintSpecSheet } from "@/components/PrintSpecSheet";
import { ShareSummaryBar } from "@/components/ShareSummaryBar";
import { StickyMobileResultBar } from "@/components/StickyMobileResultBar";
import {
  calculateTransitCompensation,
  type RouteDistanceBand,
  type TransitTicketType,
} from "@/lib/calculators/transit";
import { PRISBASBELOPP_2026, RULES_YEAR } from "@/lib/data/constants";
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

  const [travelDate, setTravelDate] = useState<string>("");
  const [bookingRef, setBookingRef] = useState<string>("");
  const [routeDescription, setRouteDescription] = useState<string>("");

  useEffect(() => {
    setTravelDate(new Date().toISOString().slice(0, 10));

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
        travelDate,
        bookingRef,
        routeDescription,
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
      travelDate,
      bookingRef,
      routeDescription,
    ]
  );

  const op = result.operator;
  const shareQueryString = `op=${encodeURIComponent(op.slug)}&ticket=${ticketType}&price=${ticketPriceKr}&delay=${delayMinutes}&dist=${routeDistanceBand}&taxi=${usedTaxi ? "1" : "0"}&taxiCost=${taxiCostKr}&pax=${passengersSharingTaxi}&car=${usedOwnCar ? "1" : "0"}&km=${ownCarKm}&tolls=${tollsAndParkingKr}&voucher=${preferVoucher ? "1" : "0"}&valid=${hadValidTicketBeforeDelay ? "1" : "0"}`;

  const hasAlternativeClaim = usedTaxi || usedOwnCar;
  const isPositiveOutcome =
    (hasAlternativeClaim && result.reimbursedAlternativeKr > 0) ||
    (!hasAlternativeClaim && result.eligibleForTicketRefund);

  const isEuRailEffective =
    op.ruleMode === "eu_rail_over_150km" ||
    (op.ruleMode === "hybrid_150km" && routeDistanceBand === "over_150km");

  const capScaleMax = Math.max(
    result.claimedAlternativeCostKr,
    result.alternativeTransportCapKr,
    1
  );
  const reimbursedRatioPct = Math.min(
    100,
    Math.round((result.reimbursedAlternativeKr / capScaleMax) * 100)
  );
  const excessRatioPct = Math.min(
    100 - reimbursedRatioPct,
    Math.round((result.outOfPocketExcessKr / capScaleMax) * 100)
  );

  const ticketLabel =
    ticketType === "single"
      ? `Enkelbiljett (${formatSEK(ticketPriceKr)})`
      : ticketType === "period_30"
        ? `30-dagarskort (${formatSEK(ticketPriceKr)})`
        : `Årskort (${formatSEK(ticketPriceKr)})`;

  const headlineValue = hasAlternativeClaim
    ? formatSEK(result.reimbursedAlternativeKr)
    : formatSEK(result.totalTicketWithBonusKr);

  const stickySubText = hasAlternativeClaim
    ? usedTaxi
      ? "taxi"
      : "egen bil"
    : result.eligibleForTicketRefund
      ? `${result.ticketCompensationPercent} % biljett`
      : `krav från ${result.effectiveThresholdMinutes} min`;

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-12 print:hidden">
        {/* Left: Thumb-friendly Inputs */}
        <div className="space-y-5 rounded border border-[#CBD5E1] bg-white p-4 sm:p-6 lg:col-span-6">
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              1. Vilket bolag reser du med?
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {POPULAR_SLUGS.map((slug) => {
                const item = TRANSIT_OPERATORS.find((o) => o.slug === slug);
                if (!item) return null;
                const active = operatorSlug === slug;
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setOperatorSlug(slug)}
                    className={`rounded-[4px] border px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm ${
                      active
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                        : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
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
              className="mt-2 w-full rounded-[4px] border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] focus:border-[#0B1F3A] focus:outline-none"
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
            <div className="rounded-[4px] border border-[#CBD5E1] border-l-4 border-l-[#0B1F3A] bg-[#F8FAFC] p-3">
              <label className="block text-xs font-bold text-[#0B1F3A]">
                Tågets totala linjesträcka (15-milsgränsen)
              </label>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                Räkna hela linjens sträcka från första till sista station i tidtabellen.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRouteDistanceBand("under_150km")}
                  className={`rounded-[4px] border px-2.5 py-2 text-xs font-semibold transition ${
                    routeDistanceBand === "under_150km"
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-white text-[#0F172A]"
                  }`}
                >
                  Under 15 mil (&lt; 150 km)
                  <span className="mt-0.5 block font-normal opacity-85">Från 20 min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRouteDistanceBand("over_150km")}
                  className={`rounded-[4px] border px-2.5 py-2 text-xs font-semibold transition ${
                    routeDistanceBand === "over_150km"
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-white text-[#0F172A]"
                  }`}
                >
                  15 mil+ (&ge; 150 km)
                  <span className="mt-0.5 block font-normal opacity-85">Från 60 min</span>
                </button>
              </div>
            </div>
          )}

          {/* Delay selector */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="delay-minutes-input"
                className="text-xs font-semibold tracking-wider text-slate-600 uppercase"
              >
                2. Försening till slutdestination
              </label>
              <span className="font-mono-num text-base font-bold text-[#0B1F3A]">
                {formatDelayDuration(delayMinutes)}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_DELAYS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDelayMinutes(m)}
                  className={`font-mono-num rounded-[4px] border px-2.5 py-1.5 text-xs font-semibold transition ${
                    delayMinutes === m
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex items-center gap-3">
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
                className="font-mono-num w-20 rounded-[4px] border border-[#CBD5E1] px-2.5 py-1.5 text-right text-sm font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          {/* Ticket type & cost */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
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
                  className={`rounded-[4px] border px-2 py-2 text-xs font-semibold transition ${
                    ticketType === val
                      ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <label htmlFor="ticket-price-input" className="text-sm text-slate-700">
                {ticketType === "single"
                  ? "Pris för enkelbiljetten (kr):"
                  : ticketType === "period_30"
                    ? "Pris för 30-dagarskortet (kr):"
                    : "Pris för årskortet (kr):"}
              </label>
              <input
                id="ticket-price-input"
                type="number"
                min={0}
                max={100000}
                value={ticketPriceKr}
                onChange={(e) => setTicketPriceKr(Math.max(0, Number(e.target.value)))}
                className="font-mono-num w-28 rounded-[4px] border border-[#CBD5E1] px-3 py-1.5 text-right text-sm font-semibold text-[#0F172A]"
              />
            </div>
            {op.periodTicketRule.fixedAdult30DayPayoutsKr && ticketType === "period_30" && (
              <p className="tabular-nums mt-1.5 text-xs text-slate-500">
                Hos SL vuxen 30-dagars används fasta schablonbelopp (6 / 9 / 12 kr) oavsett
                inköpspris.
              </p>
            )}
          </div>

          {/* Voucher bonus toggle when supported */}
          {op.taxiAndCar.voucherBonusPercent && (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-[4px] border border-emerald-700/30 bg-emerald-50 p-3">
              <input
                type="checkbox"
                checked={preferVoucher}
                onChange={(e) => setPreferVoucher(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#0B1F3A]"
              />
              <span className="tabular-nums text-xs leading-relaxed text-[#0F172A]">
                <strong>Få +{op.taxiAndCar.voucherBonusPercent} % extra som värdekod</strong> i
                stället för kontanter till bankkonto ({op.shortName}-förmån).
              </span>
            </label>
          )}

          {/* Taxi / Own car emergency expander */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              4. Behövde du ta taxi eller egen bil?
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsedTaxi((prev) => !prev);
                  setUsedOwnCar(false);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-[4px] border px-3 py-2 text-xs font-semibold transition ${
                  usedTaxi
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                    : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                <Car className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Taxi ({op.taxiAndCar.taxiSupported ? "Ja" : "Se villkor"})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsedOwnCar((prev) => !prev);
                  setUsedTaxi(false);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-[4px] border px-3 py-2 text-xs font-semibold transition ${
                  usedOwnCar
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                    : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                <Car className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Egen bil (25 kr/mil)</span>
              </button>
            </div>

            {usedTaxi && (
              <div className="mt-2.5 space-y-2.5 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="taxi-cost-input" className="text-xs font-medium text-slate-700">
                    Taxikostnad på kvittot (kr):
                  </label>
                  <input
                    id="taxi-cost-input"
                    type="number"
                    min={0}
                    max={25000}
                    value={taxiCostKr}
                    onChange={(e) => setTaxiCostKr(Math.max(0, Number(e.target.value)))}
                    className="font-mono-num w-28 rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-right text-sm font-semibold text-[#0F172A]"
                  />
                </div>
                {op.taxiAndCar.taxiStacksPerPassenger && (
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="pax-taxi-input" className="text-xs font-medium text-slate-700">
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
                      className="font-mono-num w-20 rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-right text-sm font-semibold text-[#0F172A]"
                    />
                  </div>
                )}
                {op.taxiAndCar.deductUnboughtSingleTicketNote && (
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={hadValidTicketBeforeDelay}
                      onChange={(e) => setHadValidTicketBeforeDelay(e.target.checked)}
                      className="h-4 w-4 accent-[#0B1F3A]"
                    />
                    <span>Jag hade redan giltig biljett innan störningen uppstod</span>
                  </label>
                )}
              </div>
            )}

            {usedOwnCar && (
              <div className="mt-2.5 space-y-2.5 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="car-km-input" className="text-xs font-medium text-slate-700">
                    Körd sträcka med bil (km):
                  </label>
                  <input
                    id="car-km-input"
                    type="number"
                    min={0}
                    max={1000}
                    value={ownCarKm}
                    onChange={(e) => setOwnCarKm(Math.max(0, Number(e.target.value)))}
                    className="font-mono-num w-24 rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-right text-sm font-semibold text-[#0F172A]"
                  />
                </div>
                {op.slug === "vasttrafik" && (
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="car-tolls-input"
                      className="text-xs font-medium text-slate-700"
                    >
                      Trängselskatt &amp; parkering (kr):
                    </label>
                    <input
                      id="car-tolls-input"
                      type="number"
                      min={0}
                      max={2000}
                      value={tollsAndParkingKr}
                      onChange={(e) =>
                        setTollsAndParkingKr(Math.max(0, Number(e.target.value)))
                      }
                      className="font-mono-num w-24 rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-right text-sm font-semibold text-[#0F172A]"
                    />
                  </div>
                )}
              </div>
            )}

            {op.slug === "snalltaget" && (
              <label className="mt-2.5 flex cursor-pointer items-start gap-2 rounded-[4px] border border-[#F59E0B] bg-[#FFFBEB] p-2.5 text-xs text-[#78350F]">
                <input
                  type="checkbox"
                  checked={isNightTrainDepartureOver180Min}
                  onChange={(e) => setIsNightTrainDepartureOver180Min(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#0B1F3A]"
                />
                <span>Dagtåg (eller nattåg med &gt; 180 min försening vid avgång)</span>
              </label>
            )}
          </div>
        </div>

        {/* Right: Integrated Authority Result, Claim Text, Link & PDF */}
        <div
          id="transit-result-panel"
          className="scroll-mt-28 space-y-4 lg:col-span-6 lg:scroll-mt-20"
        >
          <div className="rounded border border-[#CBD5E1] bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                {isPositiveOutcome ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-800" aria-hidden="true" />
                    <span className="text-emerald-900">Trolig rätt till ersättning</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-slate-600" aria-hidden="true" />
                    <span className="text-slate-700">
                      Under tidsgräns ({result.effectiveThresholdMinutes} min)
                    </span>
                  </>
                )}
              </div>

              <span className="font-mono-num text-xs font-semibold text-slate-600">
                {op.shortName} &middot; {RULES_YEAR}
              </span>
            </div>

            <div className="mt-4">
              {hasAlternativeClaim ? (
                <>
                  <p className="text-xs font-medium text-slate-600">
                    Beräknad ersättning för {usedTaxi ? "taxi" : "egen bil"}
                  </p>
                  <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
                    {formatSEK(result.reimbursedAlternativeKr)}
                  </p>
                  {result.alternativeTransportCapKr > 0 && (
                    <p className="tabular-nums mt-1.5 text-sm text-slate-600">
                      Maxbelopp hos {op.shortName}:{" "}
                      <strong className="font-mono-num text-[#0B1F3A]">
                        {formatSEK(result.alternativeTransportCapKr)}
                      </strong>
                      {result.outOfPocketExcessKr > 0 && (
                        <span className="font-semibold text-[#92400E]">
                          {" "}
                          ({formatSEK(result.outOfPocketExcessKr)} över taket betalas själv)
                        </span>
                      )}
                    </p>
                  )}

                  {/* Proportional Cap Visualization Bar */}
                  {result.claimedAlternativeCostKr > 0 && (
                    <div className="mt-3 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3">
                      <div className="tabular-nums flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Ersätts: {formatSEK(result.reimbursedAlternativeKr)}</span>
                        {result.outOfPocketExcessKr > 0 ? (
                          <span className="text-[#92400E]">
                            Egen del: {formatSEK(result.outOfPocketExcessKr)}
                          </span>
                        ) : (
                          <span>Tak: {formatSEK(result.alternativeTransportCapKr)}</span>
                        )}
                      </div>
                      <div className="mt-1.5 flex h-2.5 w-full overflow-hidden border border-[#CBD5E1] bg-white">
                        <div
                          className="h-full bg-[#0B1F3A]"
                          style={{ width: `${reimbursedRatioPct}%` }}
                        />
                        {excessRatioPct > 0 && (
                          <div
                            className="h-full bg-[#D97706]"
                            style={{ width: `${excessRatioPct}%` }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-slate-600">
                    Beräknad biljettersättning ({result.ticketCompensationPercent} %)
                  </p>
                  <p className="font-mono-num mt-1 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
                    {formatSEK(result.totalTicketWithBonusKr)}
                  </p>
                  {result.voucherBonusKr > 0 && (
                    <p className="tabular-nums mt-1 text-xs font-semibold text-emerald-900">
                      Inkluderar +{formatSEK(result.voucherBonusKr)} värdekodsbonus (+
                      {result.voucherBonusPercent} %)
                    </p>
                  )}
                  {result.periodSchablonUsed && (
                    <p className="tabular-nums mt-1.5 text-xs leading-relaxed text-slate-600">
                      <Ticket className="mr-1 inline h-3.5 w-3.5 text-[#0B1F3A]" aria-hidden="true" />
                      {result.periodSchablonUsed}
                    </p>
                  )}

                  {/* Delay Threshold Ladder Visualization */}
                  <div className="mt-3 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
                      Ersättningstrappa vid nuvarande försening ({delayMinutes} min)
                    </p>
                    {isEuRailEffective ? (
                      <div className="tabular-nums mt-1.5 grid grid-cols-3 gap-1 text-center text-[11px] font-semibold">
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes < 60
                              ? "border-[#0B1F3A] bg-white text-[#0B1F3A]"
                              : "border-[#CBD5E1] bg-white text-slate-500"
                          }`}
                        >
                          &lt; 60 min: 0 %
                        </div>
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes >= 60 && delayMinutes < 120
                              ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                              : "border-[#CBD5E1] bg-white text-slate-700"
                          }`}
                        >
                          60+ min: 25 %
                        </div>
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes >= 120
                              ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                              : "border-[#CBD5E1] bg-white text-slate-700"
                          }`}
                        >
                          120+ min: 50 %
                        </div>
                      </div>
                    ) : (
                      <div className="tabular-nums mt-1.5 grid grid-cols-3 gap-1 text-center text-[11px] font-semibold">
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes >= 20 && delayMinutes < 40
                              ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                              : "border-[#CBD5E1] bg-white text-slate-700"
                          }`}
                        >
                          20+ min: 50 %
                        </div>
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes >= 40 && delayMinutes < 60
                              ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                              : "border-[#CBD5E1] bg-white text-slate-700"
                          }`}
                        >
                          40+ min: 75 %
                        </div>
                        <div
                          className={`border px-2 py-1 ${
                            delayMinutes >= 60
                              ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                              : "border-[#CBD5E1] bg-white text-slate-700"
                          }`}
                        >
                          60+ min: 100 %
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Signal Amber Warning Box (Taxameterkvitto & warnings) */}
            {(usedTaxi || result.warnings.length > 0) && (
              <div className="mt-4 space-y-2">
                {usedTaxi && (
                  <div className="flex items-start gap-2 rounded-[4px] border border-[#F59E0B] border-l-4 border-l-[#D97706] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" aria-hidden="true" />
                    <span>
                      <strong>Viktigt taxikvitto-krav:</strong> Begär{" "}
                      <strong>specificerat taxameterkvitto</strong> med tid, sträcka, reg.nr och
                      moms – enbart kortterminalens betalningskvitto räcker normalt inte.
                    </span>
                  </div>
                )}
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

            {/* Taxi quick badge when taxi not active */}
            {!hasAlternativeClaim && op.taxiAndCar.taxiSupported && (
              <div className="mt-4 rounded-[4px] border border-[#CBD5E1] border-l-4 border-l-[#0B1F3A] bg-[#F8FAFC] p-3 text-xs leading-relaxed text-[#0F172A]">
                <strong>Taxi vid störning?</strong> {op.taxiAndCar.taxiNote}
              </div>
            )}

            {/* Legal & deadline ledger */}
            <dl className="mt-4 divide-y divide-[#E2E8F0] rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] text-xs">
              <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-slate-600">Lagstöd</dt>
                <dd className="text-right font-semibold text-[#0B1F3A]">
                  {result.legalBasisLabel}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-slate-600">Prisbasbelopp ({RULES_YEAR})</dt>
                <dd className="font-mono-num text-right font-semibold text-[#0F172A]">
                  {formatSEK(PRISBASBELOPP_2026)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                <dt className="text-slate-600">Sista ansökningsdag</dt>
                <dd className="tabular-nums text-right font-semibold text-[#0F172A]">
                  {op.deadlineText}
                </dd>
              </div>
            </dl>

            {/* Primary Actions: Claim Link + Print PDF */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <a
                href={op.claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163763]"
              >
                <span>{op.claimCtaLabel}</span>
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

            {/* Inline Quick Claim Details + Always-Ready Copyable Claim Text */}
            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Anpassa kravtexten &amp; A4-underlaget (valfritt)
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  type="date"
                  aria-label="Resdatum"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="font-mono-num rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
                <input
                  type="text"
                  aria-label="Linje, tåg eller sträcka"
                  placeholder="Linje/sträcka (t.ex. Tåg 421)"
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  className="rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
                <input
                  type="text"
                  aria-label="Biljettnummer eller boknings-ID"
                  placeholder="Biljett-/bokningsnr"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  className="font-mono-num rounded-[4px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                />
              </div>

              <div className="mt-3">
                <ClaimCopyBox compact primaryText={result.claimTextTemplate} />
              </div>
            </div>

            {/* Spara detta NU checklist */}
            <div className="mt-4 rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A]">
                <ShieldCheck className="h-4 w-4 text-[#0B1F3A]" aria-hidden="true" />
                <span>Spara detta NU som bevis</span>
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                {op.evidenceChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#0B1F3A]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
              <ShareSummaryBar
                summaryText={result.shareSummaryText}
                shareQueryString={shareQueryString}
                sharePath={`/bolag/${op.slug}`}
              />
              {!hideOperatorGuideLink && (
                <Link
                  href={`/bolag/${op.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B1F3A] hover:underline"
                >
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Alla {op.shortName}-regler</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <StickyMobileResultBar
        targetId="transit-result-panel"
        label="Din ersättning:"
        valueText={headlineValue}
        subText={stickySubText}
        isPositive={isPositiveOutcome}
        ctaLabel="Visa krav & länk"
      />

      <PrintSpecSheet
        title={`Förseningsersättning – ${op.name}`}
        operatorName={op.name}
        amountHeadline={
          hasAlternativeClaim
            ? `${formatSEK(result.reimbursedAlternativeKr)} (${usedTaxi ? "taxi" : "egen bil"})`
            : `${formatSEK(result.totalTicketWithBonusKr)} (${result.ticketCompensationPercent} %)`
        }
        legalBasis={result.legalBasisLabel}
        deadline={op.deadlineText}
        rows={[
          { label: "Resdatum", value: travelDate || "Ej angivet" },
          { label: "Linje / sträcka", value: routeDescription || "Ej angiven" },
          { label: "Biljett / bokning", value: `${ticketLabel} · ${bookingRef || "Ej angett nr"}` },
          { label: "Försening", value: formatDelayDuration(delayMinutes) },
          ...(hasAlternativeClaim
            ? [
                {
                  label: "Yrkat utlägg & tak",
                  value: `${formatSEK(result.claimedAlternativeCostKr)} (maxtak ${op.shortName}: ${formatSEK(result.alternativeTransportCapKr)})`,
                },
              ]
            : []),
        ]}
        warnings={result.warnings}
        evidenceChecklist={op.evidenceChecklist}
        claimUrl={op.claimUrl}
        claimText={result.claimTextTemplate}
      />
    </>
  );
}
