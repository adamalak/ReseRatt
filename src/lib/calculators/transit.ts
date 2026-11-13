import {
  OWN_CAR_KR_PER_KM,
  REGIONAL_RAIL_DISTANCE_LIMIT_KM,
  RULES_YEAR,
} from "../data/constants";
import { getOperatorBySlug, type OperatorProfile } from "../data/operators";
import { formatSEK } from "../format";

export type TransitTicketType = "single" | "period_30" | "annual";
export type RouteDistanceBand = "under_150km" | "over_150km";

export interface TransitCalculationInput {
  operatorSlug: string;
  ticketType: TransitTicketType;
  ticketPriceKr: number;
  delayMinutes: number;
  routeDistanceBand: RouteDistanceBand;
  usedTaxi: boolean;
  taxiCostKr: number;
  passengersSharingTaxi: number;
  usedOwnCar: boolean;
  ownCarKm: number;
  tollsAndParkingKr: number;
  preferVoucher: boolean;
  hadValidTicketBeforeDelay: boolean;
  /** Enbart aktuellt för Snälltågets nattåg vid avgång > 180 min sen. */
  isNightTrainDepartureOver180Min?: boolean;
}

export interface TransitCalculationResult {
  operator: OperatorProfile;
  eligibleForTicketRefund: boolean;
  legalBasisLabel: string;
  effectiveThresholdMinutes: number;
  ticketBaseValueKr: number;
  ticketCompensationPercent: number;
  ticketCompensationKr: number;
  voucherBonusPercent: number;
  voucherBonusKr: number;
  totalTicketWithBonusKr: number;
  alternativeTransportAllowed: boolean;
  alternativeTransportCapKr: number;
  claimedAlternativeCostKr: number;
  reimbursedAlternativeKr: number;
  outOfPocketExcessKr: number;
  estimatedTotalValueKr: number;
  periodSchablonUsed: string | null;
  warnings: string[];
  shareSummaryText: string;
  claimTextTemplate: string;
}

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function getEffectiveRuleMode(op: OperatorProfile, distanceBand: RouteDistanceBand) {
  if (op.ruleMode === "regional_under_150km") return "regional" as const;
  if (op.ruleMode === "eu_rail_over_150km") return "eu_rail" as const;
  return distanceBand === "over_150km" ? ("eu_rail" as const) : ("regional" as const);
}

function computeTicketPercent(mode: "regional" | "eu_rail", delayMinutes: number): number {
  if (mode === "eu_rail") {
    if (delayMinutes >= 120) return 50;
    if (delayMinutes >= 60) return 25;
    return 0;
  }
  if (delayMinutes >= 60) return 100;
  if (delayMinutes >= 40) return 75;
  if (delayMinutes >= 20) return 50;
  return 0;
}

/**
 * Beräknar förseningsersättning och taxitak för svenska tåg- och kollektivtrafikbolag.
 */
export function calculateTransitCompensation(
  raw: TransitCalculationInput
): TransitCalculationResult {
  const operator = getOperatorBySlug(raw.operatorSlug) ?? getOperatorBySlug("sj")!;
  const delayMinutes = Math.round(clampNonNegative(raw.delayMinutes));
  const ticketPriceKr = clampNonNegative(raw.ticketPriceKr);
  const taxiCostKr = raw.usedTaxi ? clampNonNegative(raw.taxiCostKr) : 0;
  const passengersSharingTaxi = Math.max(1, Math.min(8, Math.round(raw.passengersSharingTaxi || 1)));
  const ownCarKm = raw.usedOwnCar ? clampNonNegative(raw.ownCarKm) : 0;
  const tollsAndParkingKr = raw.usedOwnCar ? clampNonNegative(raw.tollsAndParkingKr) : 0;

  const effectiveMode = getEffectiveRuleMode(operator, raw.routeDistanceBand);
  const effectiveThresholdMinutes = effectiveMode === "eu_rail" ? 60 : 20;
  const legalBasisLabel =
    effectiveMode === "eu_rail"
      ? `EU:s tågpassagerarförordning (sträcka ≥ ${REGIONAL_RAIL_DISTANCE_LIMIT_KM} km)`
      : `Lagen om kollektivtrafikresenärers rättigheter (< ${REGIONAL_RAIL_DISTANCE_LIMIT_KM} km)`;

  const ticketCompensationPercent = computeTicketPercent(effectiveMode, delayMinutes);
  const eligibleForTicketRefund = ticketCompensationPercent > 0;

  let ticketBaseValueKr = ticketPriceKr;
  let ticketCompensationKr = 0;
  let periodSchablonUsed: string | null = null;
  const warnings: string[] = [];

  // Beräkna biljettersättning utifrån biljettyp och verifierade schabloner
  if (raw.ticketType === "single") {
    ticketBaseValueKr = ticketPriceKr;
    ticketCompensationKr = Math.round((ticketPriceKr * ticketCompensationPercent) / 100);
  } else if (raw.ticketType === "period_30") {
    const fixed = operator.periodTicketRule.fixedAdult30DayPayoutsKr;
    if (fixed && effectiveMode === "regional") {
      ticketBaseValueKr = fixed.p100;
      if (ticketCompensationPercent === 100) ticketCompensationKr = fixed.p100;
      else if (ticketCompensationPercent === 75) ticketCompensationKr = fixed.p75;
      else if (ticketCompensationPercent === 50) ticketCompensationKr = fixed.p50;
      periodSchablonUsed = `SL vuxen 30-dagars schablon (${fixed.p50}/${fixed.p75}/${fixed.p100} kr)`;
    } else if (operator.periodTicketRule.divisor30Day) {
      const div = operator.periodTicketRule.divisor30Day;
      ticketBaseValueKr = Math.round(ticketPriceKr / div);
      ticketCompensationKr = Math.round(((ticketPriceKr / div) * ticketCompensationPercent) / 100);
      periodSchablonUsed = `30-dagars schablon (pris ÷ ${div} resor ≈ ${formatSEK(ticketBaseValueKr)}/resa)`;
    } else {
      // Standard schablonuppskattning när exakt regional tabell saknas öppet (ca 40 resor/30 dgr)
      const fallbackDivisor = 40;
      ticketBaseValueKr = Math.round(ticketPriceKr / fallbackDivisor);
      ticketCompensationKr = Math.round(
        ((ticketPriceKr / fallbackDivisor) * ticketCompensationPercent) / 100
      );
      periodSchablonUsed = `Riktvärde periodkort (uppskattat resvärde ≈ ${formatSEK(ticketBaseValueKr)}/resa – exakt schablon sätts av bolaget)`;
    }
  } else {
    // Årskort
    const annualDivisor = operator.periodTicketRule.divisorAnnual ?? 160;
    ticketBaseValueKr = Math.round(ticketPriceKr / annualDivisor);
    ticketCompensationKr = Math.round(
      ((ticketPriceKr / annualDivisor) * ticketCompensationPercent) / 100
    );
    periodSchablonUsed = `Årskortsschablon (pris ÷ ${annualDivisor} resor ≈ ${formatSEK(ticketBaseValueKr)}/resa)`;
  }

  // Värdekodsbonus (Västtrafik +20 %, Skånetrafiken +30 %)
  const voucherBonusPercent =
    raw.preferVoucher && operator.taxiAndCar.voucherBonusPercent
      ? operator.taxiAndCar.voucherBonusPercent
      : 0;
  const voucherBonusKr = Math.round((ticketCompensationKr * voucherBonusPercent) / 100);
  const totalTicketWithBonusKr = ticketCompensationKr + voucherBonusKr;

  // Alternativ transport (taxi / egen bil)
  const alternativeTransportAllowed =
    effectiveMode === "regional" && delayMinutes >= operator.taxiAndCar.allowedFromMinutes;

  let alternativeTransportCapKr = 0;
  let claimedAlternativeCostKr = 0;
  let reimbursedAlternativeKr = 0;

  if (raw.usedTaxi) {
    claimedAlternativeCostKr = taxiCostKr;
    if (operator.taxiAndCar.taxiSupported && alternativeTransportAllowed) {
      const baseCap = operator.taxiAndCar.taxiMaxPerPersonKr ?? 0;
      alternativeTransportCapKr =
        baseCap > 0 && operator.taxiAndCar.taxiStacksPerPassenger
          ? baseCap * passengersSharingTaxi
          : baseCap;
      reimbursedAlternativeKr =
        alternativeTransportCapKr > 0
          ? Math.min(claimedAlternativeCostKr, alternativeTransportCapKr)
          : claimedAlternativeCostKr;
    }
  } else if (raw.usedOwnCar) {
    const carMileageKr = Math.round(ownCarKm * OWN_CAR_KR_PER_KM);
    const extras = operator.slug === "vasttrafik" ? tollsAndParkingKr : 0;
    claimedAlternativeCostKr = carMileageKr + extras;
    if (tollsAndParkingKr > 0 && operator.slug !== "vasttrafik") {
      warnings.push(
        "Trängselskatt och parkering ersätts uttryckligen inom Västtrafiks villkor; kontrollera med detta bolag innan du tar med p-avgifter i kravet."
      );
    }
    if (operator.taxiAndCar.ownCarSupported && alternativeTransportAllowed) {
      const cap =
        operator.taxiAndCar.ownCarMaxTotalKr ??
        (operator.taxiAndCar.ownCarSharesTaxiCap
          ? operator.taxiAndCar.taxiMaxPerPersonKr ?? 0
          : 0);
      alternativeTransportCapKr = cap;
      reimbursedAlternativeKr =
        cap > 0 ? Math.min(claimedAlternativeCostKr, cap) : claimedAlternativeCostKr;
    }
  }

  const outOfPocketExcessKr = Math.max(0, claimedAlternativeCostKr - reimbursedAlternativeKr);

  // Man kan normalt inte få både biljettavdrag OCH full taxi för samma uteblivna resa – visa största värdet / relevant sammanhang
  const estimatedTotalValueKr =
    claimedAlternativeCostKr > 0 && reimbursedAlternativeKr > 0
      ? reimbursedAlternativeKr
      : totalTicketWithBonusKr;

  // Viktiga varningar per bolag och scenario
  if (!raw.hadValidTicketBeforeDelay && operator.taxiAndCar.deductUnboughtSingleTicketNote) {
    warnings.push(operator.taxiAndCar.deductUnboughtSingleTicketNote);
  }
  if ((raw.usedTaxi || raw.usedOwnCar) && effectiveMode === "eu_rail") {
    warnings.push(
      `På fjärrtåg (≥ ${REGIONAL_RAIL_DISTANCE_LIMIT_KM} km) har bolaget först rätt att ordna ombokning/ersättningstrafik vid > 60 min försening. Boka inte egen taxi eller bil utan kontakt med personal eller kundservice.`
    );
  }
  if ((raw.usedTaxi || raw.usedOwnCar) && delayMinutes < operator.taxiAndCar.allowedFromMinutes) {
    warnings.push(
      `Ersättning för alternativ transport kräver som regel minst ${operator.taxiAndCar.allowedFromMinutes} minuters befarad försening.`
    );
  }
  if (operator.slug === "snalltaget" && raw.isNightTrainDepartureOver180Min === false) {
    warnings.push(
      "Observera för Snälltågets nattåg: Bolaget kräver ofta > 180 min försening redan vid avgång för förtida antagande om slutstationsförsening."
    );
  }
  if (operator.slug === "movingo") {
    warnings.push(
      "Movingo-komihåg: Skicka kravet till det trafikbolag som körde den försenade avgången (t.ex. Mälartåg, SJ, SL eller UL)."
    );
  }
  if (operator.slug === "oresundstag") {
    warnings.push(
      "Öresundståg-komihåg: Vid regional biljett söker du via det länstrafikbolag där resan startade (t.ex. Skånetrafiken, Hallandstrafiken eller Västtrafik)."
    );
  }

  const summaryHeadline =
    claimedAlternativeCostKr > 0 && reimbursedAlternativeKr > 0
      ? `Alternativ transport upp till ${formatSEK(reimbursedAlternativeKr)}`
      : eligibleForTicketRefund
        ? `${ticketCompensationPercent} % (${formatSEK(totalTicketWithBonusKr)})`
        : "Troligen ingen kontant ersättning ännu";

  const shareSummaryText = `${operator.shortName} (${RULES_YEAR}, ${delayMinutes} min sen): ${summaryHeadline}. Ansök ${operator.deadlineText.toLowerCase()}.`;

  const claimTextTemplate = [
    `Ämne: Ansökan om förseningsersättning – ${operator.name}`,
    ``,
    `Hej ${operator.shortName},`,
    ``,
    `Jag drabbades av en försening på ca ${delayMinutes} minuter till min planerade slutdestination och ansöker härmed om ersättning enligt gällande resevillkor (${legalBasisLabel}).`,
    ``,
    `• Biljettyp: ${
      raw.ticketType === "single"
        ? `Enkelbiljett (${formatSEK(ticketPriceKr)})`
        : raw.ticketType === "period_30"
          ? `30-dagarsbiljett / periodkort (${formatSEK(ticketPriceKr)})`
          : `Årskort (${formatSEK(ticketPriceKr)})`
    }`,
    `• Biljettnummer / Boknings-ID: [FYLL I BILJETTNUMMER]`,
    `• Resdatum, linje & avgång: [FYLL I DATUM, TÅG/LINJE, FRÅN–TILL]`,
    raw.usedTaxi
      ? `• Utlägg alternativ transport (taxi): ${formatSEK(taxiCostKr)} (specificerat originalkvitto bifogas)`
      : raw.usedOwnCar
        ? `• Alternativ transport (egen bil): ${ownCarKm} km (${formatSEK(claimedAlternativeCostKr)})`
        : `• Beräknat ersättningsanspråk (prisavdrag): ca ${ticketCompensationPercent} % (${formatSEK(totalTicketWithBonusKr)})`,
    ``,
    `Jag önskar utbetalning till bankkonto / Swish / värdekod enligt bifogade uppgifter.`,
    ``,
    `Med vänlig hälsning,`,
    `[DITT NAMN OCH TELEFONNUMMER]`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    operator,
    eligibleForTicketRefund,
    legalBasisLabel,
    effectiveThresholdMinutes,
    ticketBaseValueKr,
    ticketCompensationPercent,
    ticketCompensationKr,
    voucherBonusPercent,
    voucherBonusKr,
    totalTicketWithBonusKr,
    alternativeTransportAllowed,
    alternativeTransportCapKr,
    claimedAlternativeCostKr,
    reimbursedAlternativeKr,
    outOfPocketExcessKr,
    estimatedTotalValueKr,
    periodSchablonUsed,
    warnings,
    shareSummaryText,
    claimTextTemplate,
  };
}
