import {
  APPROX_EUR_TO_SEK,
  EU261_AMOUNTS_EUR,
  RULES_YEAR,
} from "../data/constants";
import { getOperatorBySlug, type OperatorProfile } from "../data/operators";
import { formatEUR, formatSEK } from "../format";

export type FlightDisruptionType =
  | "delay"
  | "cancelled_under_14d"
  | "cancelled_over_14d"
  | "denied_boarding";

export type FlightDistanceBand = keyof typeof EU261_AMOUNTS_EUR;

export type FlightDisruptionCause =
  | "technical_or_crew"
  | "airline_strike"
  | "weather_or_atc"
  | "unknown";

export interface FlightCalculationInput {
  airlineSlug: string;
  disruptionType: FlightDisruptionType;
  arrivalDelayMinutes: number;
  distanceBand: FlightDistanceBand;
  cause: FlightDisruptionCause;
  /** Vissa ombokningar inom 2 / 3 / 4 timmars fönster halverar schablonersättningen (50 %). */
  reroutedWithinHalfCutLimit: boolean;
  passengerCount: number;
  waitingHoursAtAirport: number;
  reasonableCareExpensesKr: number;
  /** Valfria ärendeuppgifter som fylls direkt i färdig kravtext och A4-underlag. */
  travelDate?: string;
  flightNumber?: string;
  bookingRef?: string;
  routeDescription?: string;
  passengerName?: string;
}

export interface FlightCalculationResult {
  airline: OperatorProfile;
  eligibleForCashCompensation: boolean;
  extraordinaryExempt: boolean;
  basePerPassengerEur: number;
  effectivePerPassengerEur: number;
  totalEur: number;
  approxTotalSek: number;
  careRightsActive: boolean;
  refundRightActive: boolean;
  careThresholdHours: number;
  reasonableCareExpensesKr: number;
  statusHeadline: string;
  hdDeadlineNote: string;
  warnings: string[];
  shareSummaryText: string;
  claimTextSwedish: string;
  claimTextEnglish: string;
}

function clampNonNegative(val: number): number {
  return Number.isFinite(val) && val > 0 ? val : 0;
}

function getCareThresholdHours(distanceBand: FlightDistanceBand): number {
  if (distanceBand === "le_1500") return 2;
  if (distanceBand === "gt_3500") return 4;
  return 3;
}

/**
 * Beräknar ersättning och omvårdnadsrättigheter enligt EU-förordning 261/2004.
 */
export function calculateFlightCompensation(
  raw: FlightCalculationInput
): FlightCalculationResult {
  const airline = getOperatorBySlug(raw.airlineSlug) ?? getOperatorBySlug("sas")!;
  const arrivalDelayMinutes = Math.round(clampNonNegative(raw.arrivalDelayMinutes));
  const passengerCount = Math.max(1, Math.min(9, Math.round(raw.passengerCount || 1)));
  const waitingHoursAtAirport = clampNonNegative(raw.waitingHoursAtAirport);
  const reasonableCareExpensesKr = Math.round(clampNonNegative(raw.reasonableCareExpensesKr));

  const basePerPassengerEur = EU261_AMOUNTS_EUR[raw.distanceBand];
  const careThresholdHours = getCareThresholdHours(raw.distanceBand);
  const careRightsActive = waitingHoursAtAirport >= careThresholdHours;
  const refundRightActive =
    waitingHoursAtAirport >= 5 || raw.disruptionType === "cancelled_under_14d" || raw.disruptionType === "cancelled_over_14d";

  const extraordinaryExempt = raw.cause === "weather_or_atc";
  const warnings: string[] = [];

  // Grundvillkor för EU 261 kontantersättning
  let timeEligible = false;
  if (raw.disruptionType === "delay") {
    timeEligible = arrivalDelayMinutes >= 180;
  } else if (raw.disruptionType === "cancelled_under_14d") {
    // Inställt < 14 dagar före avgång ger normalt rätt om ny ankomst inte klarar snäva tidsfönster
    timeEligible = arrivalDelayMinutes >= 120 || arrivalDelayMinutes === 0;
    if (arrivalDelayMinutes > 0 && arrivalDelayMinutes < 120) {
      timeEligible = false;
    }
  } else if (raw.disruptionType === "denied_boarding") {
    timeEligible = true;
  } else {
    // cancelled_over_14d: avbokat >= 14 dagar i förväg ger rätt till ombokning/återbetalning men ej schablonersättning
    timeEligible = false;
  }

  const eligibleForCashCompensation = timeEligible && !extraordinaryExempt;
  const halfCutApplies = eligibleForCashCompensation && raw.reroutedWithinHalfCutLimit;
  const effectivePerPassengerEur = eligibleForCashCompensation
    ? halfCutApplies
      ? basePerPassengerEur / 2
      : basePerPassengerEur
    : 0;

  const totalEur = effectivePerPassengerEur * passengerCount;
  const approxTotalSek = Math.round(totalEur * APPROX_EUR_TO_SEK);

  if (raw.disruptionType === "cancelled_over_14d") {
    warnings.push(
      "Ställdes flyget in 14 dagar eller mer före avgång utgår ingen schablonersättning (250–600 EUR), men du har alltid rätt till ombokning eller full återbetalning av biljetten."
    );
  }
  if (extraordinaryExempt) {
    warnings.push(
      "Extremväder, luftrumsstängning och extern flygledarstrejk räknas normalt som extraordinära omständigheter (ingen schablonersättning) – MEN flygbolaget är ändå alltid skyldigt att stå för mat, dryck och hotell vid lång väntan!"
    );
  }
  if (raw.cause === "unknown") {
    warnings.push(
      "Vet du inte orsaken ännu? Skicka kravet ändå – flygbolaget har bevisbördan om de påstår att en extraordinär omständighet förelåg."
    );
  }
  if (raw.cause === "technical_or_crew" || raw.cause === "airline_strike") {
    warnings.push(
      "Vanliga tekniska fel och flygbolagets egen personals strejk ger enligt EU-domstolens praxis normalt full rätt till schablonersättning."
    );
  }

  const statusHeadline = eligibleForCashCompensation
    ? `Troligen rätt till ${formatEUR(totalEur)} (ca ${formatSEK(approxTotalSek)})`
    : extraordinaryExempt
      ? "Ej schablonersättning vid extraordinärt väder/ATC – men rätt till mat & hotell"
      : "Troligen ingen schablonersättning";

  const hdDeadlineNote =
    "Svensk praxis (Högsta domstolen, NJA 2018 s. 127): Reklamera till flygbolaget inom 2 månader efter resan för att vara inom ”skälig tid”. Själva fordran har därefter 10 års preskriptionstid i Sverige.";

  const shareSummaryText = `${airline.shortName} EU 261 (${RULES_YEAR}, ${passengerCount} resenär${passengerCount > 1 ? "er" : ""}): ${statusHeadline}.`;

  const distanceText =
    raw.distanceBand === "le_1500"
      ? "≤ 1 500 km"
      : raw.distanceBand === "gt_3500"
        ? "> 3 500 km utanför EU"
        : "1 500–3 500 km / > 1 500 km inom EU";

  const pnrLabel = raw.bookingRef?.trim() || "[PNR]";
  const flightLabel = raw.flightNumber?.trim() || "[FLIGHTNR]";
  const dateLabel = raw.travelDate?.trim() || "[DATUM]";
  const routeLabel = raw.routeDescription?.trim() || "[AVGÅNG – ANKOMST]";
  const senderLabelSv = raw.passengerName?.trim() || "[DITT NAMN & KONTAKTUPPGIFTER]";
  const senderLabelEn = raw.passengerName?.trim() || "[YOUR FULL NAME]";

  const claimTextSwedish = [
    `Ämne: Krav på ersättning enligt EU-förordning 261/2004 – Bokning ${pnrLabel} (${dateLabel})`,
    ``,
    `Hej ${airline.shortName},`,
    ``,
    `Jag ansöker härmed om kompensation samt eventuell ersättning för utlägg enligt Europaparlamentets och rådets förordning (EG) nr 261/2004 (reklamerat i rätt tid enligt NJA 2018 s. 127).`,
    ``,
    `• Bokningsreferens (PNR): ${pnrLabel}`,
    `• Flightnummer & datum: ${flightLabel}, ${dateLabel}`,
    `• Sträcka: ${routeLabel} (${distanceText})`,
    `• Antal passagerare i ansökan: ${passengerCount} st`,
    `• Händelse: ${
      raw.disruptionType === "delay"
        ? `Ankomstförsening på ca ${arrivalDelayMinutes} minuter när flygplansdörren öppnades`
        : raw.disruptionType === "cancelled_under_14d"
          ? `Inställt flyg meddelat mindre än 14 dagar före avgång`
          : raw.disruptionType === "denied_boarding"
            ? `Nekad ombordstigning mot min vilja`
            : `Inställt flyg`
    }`,
    eligibleForCashCompensation
      ? `• Yrkad schablonersättning: ${formatEUR(totalEur)} (${passengerCount} x ${formatEUR(effectivePerPassengerEur)}, ca ${formatSEK(approxTotalSek)})`
      : null,
    reasonableCareExpensesKr > 0
      ? `• Styrkta utlägg för mat/dryck/hotell (artikel 9, omvårdnad): ${formatSEK(reasonableCareExpensesKr)} (kvitton bifogas)`
      : null,
    ``,
    `Jag emotser kontant utbetalning via banköverföring (ej värdecheck) och bekräftelse med ärendenummer.`,
    ``,
    `Med vänlig hälsning,`,
    senderLabelSv,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const claimTextEnglish = [
    `Subject: EU 261/2004 Compensation Claim – Booking Reference ${pnrLabel} (${dateLabel})`,
    ``,
    `Dear ${airline.shortName} Customer Relations,`,
    ``,
    `I am writing to claim statutory compensation under Regulation (EC) No 261/2004 following the disruption to my flight.`,
    ``,
    `- Booking reference (PNR): ${pnrLabel}`,
    `- Flight number & date: ${flightLabel}, ${dateLabel}`,
    `- Route: ${routeLabel} (${distanceText})`,
    `- Passengers included: ${passengerCount}`,
    `- Disruption: ${
      raw.disruptionType === "delay"
        ? `Arrival delay of approx. ${arrivalDelayMinutes} minutes upon aircraft door opening`
        : raw.disruptionType === "cancelled_under_14d"
          ? `Flight cancellation notified less than 14 days prior to departure`
          : raw.disruptionType === "denied_boarding"
            ? `Involuntary denied boarding`
            : `Flight cancellation`
    }`,
    eligibleForCashCompensation
      ? `- Statutory compensation claimed: EUR ${totalEur} (${passengerCount} x EUR ${effectivePerPassengerEur})`
      : null,
    reasonableCareExpensesKr > 0
      ? `- Article 9 care expenses (meals/refreshments/hotel, receipts attached): SEK ${reasonableCareExpensesKr}`
      : null,
    ``,
    `Please confirm receipt and arrange direct monetary payment via bank transfer (not travel vouchers).`,
    ``,
    `Yours sincerely,`,
    senderLabelEn,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return {
    airline,
    eligibleForCashCompensation,
    extraordinaryExempt,
    basePerPassengerEur,
    effectivePerPassengerEur,
    totalEur,
    approxTotalSek,
    careRightsActive,
    refundRightActive,
    careThresholdHours,
    reasonableCareExpensesKr,
    statusHeadline,
    hdDeadlineNote,
    warnings,
    shareSummaryText,
    claimTextSwedish,
    claimTextEnglish,
  };
}
