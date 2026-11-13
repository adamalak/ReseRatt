/**
 * Centrala svenska regelvärden och riktbelopp för ReseRätt.
 * Uppdateras årligen i januari när regeringen fastställer nytt prisbasbelopp.
 */
export const RULES_YEAR = 2026 as const;

export const PRISBASBELOPP_2026 = 59_200;

/** 1/20 av 2026 års prisbasbelopp (t.ex. Skånetrafiken maxbelopp för taxi). */
export const ONE_TWENTIETH_PBB_2026 = Math.round(PRISBASBELOPP_2026 / 20); // 2 960 kr

/** 1/40 av 2026 års prisbasbelopp (t.ex. SL, UL, Mälartåg, Östgötatrafiken, X-trafik). */
export const ONE_FORTIETH_PBB_2026 = Math.round(PRISBASBELOPP_2026 / 40); // 1 480 kr

/** Skatteverkets schablon för skattefri milersättning med egen bil (25 kr/mil). */
export const OWN_CAR_KR_PER_MIL = 25;
export const OWN_CAR_KR_PER_KM = 2.5;

/** Lagen om kollektivtrafikresenärers rättigheter gäller när tågets/linjens totalsträcka är < 150 km. */
export const REGIONAL_RAIL_DISTANCE_LIMIT_KM = 150;

/**
 * Ungefärlig växelkurs för att illustrera EU 261-ersättning i SEK.
 * Används enbart som vägledande riktvärde i gränssnittet.
 */
export const APPROX_EUR_TO_SEK = 11.4;

export const EU261_AMOUNTS_EUR = {
  le_1500: 250,
  intra_eu_gt_1500: 400,
  non_eu_1500_3500: 400,
  gt_3500: 600,
} as const;
