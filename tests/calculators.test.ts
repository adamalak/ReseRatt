import { describe, expect, it } from "vitest";
import { calculateFlightCompensation } from "@/lib/calculators/flight";
import { calculateTransitCompensation } from "@/lib/calculators/transit";
import {
  ONE_FORTIETH_PBB_2026,
  ONE_TWENTIETH_PBB_2026,
  PRISBASBELOPP_2026,
} from "@/lib/data/constants";
import { CONSUMER_GUIDES } from "@/lib/data/guides";
import { OPERATORS } from "@/lib/data/operators";

describe("2026 svenska regelkonstanter", () => {
  it("härleder 1/20 och 1/40 av 2026 års prisbasbelopp exakt", () => {
    expect(PRISBASBELOPP_2026).toBe(59200);
    expect(ONE_TWENTIETH_PBB_2026).toBe(2960);
    expect(ONE_FORTIETH_PBB_2026).toBe(1480);
  });

  it("har unika slugs för alla bolag och guider", () => {
    const opSlugs = OPERATORS.map((o) => o.slug);
    expect(new Set(opSlugs).size).toBe(OPERATORS.length);
    const guideSlugs = CONSUMER_GUIDES.map((g) => g.slug);
    expect(new Set(guideSlugs).size).toBe(CONSUMER_GUIDES.length);
  });
});

describe("calculateTransitCompensation", () => {
  it("beräknar SL enkelbiljett och vuxen 30-dagars schablon korrekt", () => {
    const single45 = calculateTransitCompensation({
      operatorSlug: "sl",
      ticketType: "single",
      ticketPriceKr: 43,
      delayMinutes: 45,
      routeDistanceBand: "under_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(single45.ticketCompensationPercent).toBe(75);
    expect(single45.ticketCompensationKr).toBe(32);

    const period60 = calculateTransitCompensation({
      operatorSlug: "sl",
      ticketType: "period_30",
      ticketPriceKr: 1060,
      delayMinutes: 65,
      routeDistanceBand: "under_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(period60.ticketCompensationKr).toBe(12);
    expect(period60.periodSchablonUsed).toContain("6/9/12 kr");
  });

  it("begränsar SL-taxi till 1 480 kr och varnar om biljett saknades", () => {
    const taxi = calculateTransitCompensation({
      operatorSlug: "sl",
      ticketType: "single",
      ticketPriceKr: 43,
      delayMinutes: 30,
      routeDistanceBand: "under_150km",
      usedTaxi: true,
      taxiCostKr: 1900,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: false,
    });
    expect(taxi.alternativeTransportAllowed).toBe(true);
    expect(taxi.alternativeTransportCapKr).toBe(1480);
    expect(taxi.reimbursedAlternativeKr).toBe(1480);
    expect(taxi.outOfPocketExcessKr).toBe(420);
    expect(taxi.warnings.some((w) => w.includes("enkelbiljett"))).toBe(true);
  });

  it("hanterar Västtrafiks sammanslagna taxitak, egen bil 25 kr/mil + trängselskatt och +20 % värdekod", () => {
    const sharedTaxi = calculateTransitCompensation({
      operatorSlug: "vasttrafik",
      ticketType: "single",
      ticketPriceKr: 37,
      delayMinutes: 25,
      routeDistanceBand: "under_150km",
      usedTaxi: true,
      taxiCostKr: 2400,
      passengersSharingTaxi: 2,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(sharedTaxi.alternativeTransportCapKr).toBe(3000);
    expect(sharedTaxi.reimbursedAlternativeKr).toBe(2400);

    const ownCar = calculateTransitCompensation({
      operatorSlug: "vasttrafik",
      ticketType: "single",
      ticketPriceKr: 100,
      delayMinutes: 60,
      routeDistanceBand: "under_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: true,
      ownCarKm: 500, // 50 mil * 25 = 1250 kr + 350 tolls = 1600 -> capped 1500
      tollsAndParkingKr: 350,
      preferVoucher: true,
      hadValidTicketBeforeDelay: true,
    });
    expect(ownCar.alternativeTransportCapKr).toBe(1500);
    expect(ownCar.reimbursedAlternativeKr).toBe(1500);
    expect(ownCar.voucherBonusKr).toBe(20); // 100 kr + 20%
  });

  it("hanterar Skånetrafikens 44-resors schablon, +30 % värdekod och 2 960 kr taxitak", () => {
    const skane = calculateTransitCompensation({
      operatorSlug: "skanetrafiken",
      ticketType: "period_30",
      ticketPriceKr: 880, // 880 / 44 = 20 kr per resa
      delayMinutes: 60, // 100% -> 20 kr, +30% = 26 kr
      routeDistanceBand: "under_150km",
      usedTaxi: true,
      taxiCostKr: 2960,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: true,
      hadValidTicketBeforeDelay: true,
    });
    expect(skane.ticketCompensationKr).toBe(20);
    expect(skane.voucherBonusKr).toBe(6);
    expect(skane.totalTicketWithBonusKr).toBe(26);
    expect(skane.reimbursedAlternativeKr).toBe(2960);
  });

  it("skiljer rätt på SJ under 15 mil och över 15 mil samt Snabbtåg ÷ 22", () => {
    const sjShort = calculateTransitCompensation({
      operatorSlug: "sj",
      ticketType: "single",
      ticketPriceKr: 200,
      delayMinutes: 45,
      routeDistanceBand: "under_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(sjShort.ticketCompensationPercent).toBe(75);
    expect(sjShort.ticketCompensationKr).toBe(150);

    const sjLongUnder60 = calculateTransitCompensation({
      operatorSlug: "sj",
      ticketType: "single",
      ticketPriceKr: 800,
      delayMinutes: 45,
      routeDistanceBand: "over_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(sjLongUnder60.ticketCompensationPercent).toBe(0);
    expect(sjLongUnder60.eligibleForTicketRefund).toBe(false);

    const sj30Day = calculateTransitCompensation({
      operatorSlug: "sj",
      ticketType: "period_30",
      ticketPriceKr: 4400, // 4400 / 22 = 200 kr/resa
      delayMinutes: 125, // 50% -> 100 kr
      routeDistanceBand: "over_150km",
      usedTaxi: false,
      taxiCostKr: 0,
      passengersSharingTaxi: 1,
      usedOwnCar: false,
      ownCarKm: 0,
      tollsAndParkingKr: 0,
      preferVoucher: false,
      hadValidTicketBeforeDelay: true,
    });
    expect(sj30Day.ticketCompensationPercent).toBe(50);
    expect(sj30Day.ticketCompensationKr).toBe(100);
  });
});

describe("calculateFlightCompensation", () => {
  it("beräknar 250 / 400 / 600 EUR korrekt för försening > 3 timmar", () => {
    const res400 = calculateFlightCompensation({
      airlineSlug: "sas",
      disruptionType: "delay",
      arrivalDelayMinutes: 210,
      distanceBand: "intra_eu_gt_1500",
      cause: "technical_or_crew",
      reroutedWithinHalfCutLimit: false,
      passengerCount: 2,
      waitingHoursAtAirport: 4,
      reasonableCareExpensesKr: 320,
    });
    expect(res400.eligibleForCashCompensation).toBe(true);
    expect(res400.effectivePerPassengerEur).toBe(400);
    expect(res400.totalEur).toBe(800);
    expect(res400.careRightsActive).toBe(true);
  });

  it("halverar belopp vid ombokning inom tidsramarna och nekar ej tekniskt fel eller intern strejk", () => {
    const resStrike = calculateFlightCompensation({
      airlineSlug: "norwegian",
      disruptionType: "cancelled_under_14d",
      arrivalDelayMinutes: 150,
      distanceBand: "gt_3500",
      cause: "airline_strike",
      reroutedWithinHalfCutLimit: true,
      passengerCount: 1,
      waitingHoursAtAirport: 5,
      reasonableCareExpensesKr: 0,
    });
    expect(resStrike.eligibleForCashCompensation).toBe(true);
    expect(resStrike.effectivePerPassengerEur).toBe(300);
    expect(resStrike.refundRightActive).toBe(true);
  });

  it("ger 0 EUR schablonersättning vid extremväder men behåller omvårdnadsrätt > 2h", () => {
    const weather = calculateFlightCompensation({
      airlineSlug: "ryanair",
      disruptionType: "delay",
      arrivalDelayMinutes: 260,
      distanceBand: "le_1500",
      cause: "weather_or_atc",
      reroutedWithinHalfCutLimit: false,
      passengerCount: 2,
      waitingHoursAtAirport: 3,
      reasonableCareExpensesKr: 450,
    });
    expect(weather.eligibleForCashCompensation).toBe(false);
    expect(weather.extraordinaryExempt).toBe(true);
    expect(weather.totalEur).toBe(0);
    expect(weather.careRightsActive).toBe(true);
    expect(weather.reasonableCareExpensesKr).toBe(450);
  });

  it("ger 0 EUR vid inställt flyg >= 14 dagar före avgång", () => {
    const earlyCancel = calculateFlightCompensation({
      airlineSlug: "sas",
      disruptionType: "cancelled_over_14d",
      arrivalDelayMinutes: 300,
      distanceBand: "le_1500",
      cause: "technical_or_crew",
      reroutedWithinHalfCutLimit: false,
      passengerCount: 1,
      waitingHoursAtAirport: 0,
      reasonableCareExpensesKr: 0,
    });
    expect(earlyCancel.eligibleForCashCompensation).toBe(false);
    expect(earlyCancel.totalEur).toBe(0);
    expect(earlyCancel.refundRightActive).toBe(true);
  });
});
