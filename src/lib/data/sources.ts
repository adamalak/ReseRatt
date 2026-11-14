export interface AuthoritySource {
  id:
    | "lag-2015-953"
    | "forordning-2025-872"
    | "preskriptionslag-1981-130"
    | "eu-2021-782"
    | "eg-261-2004"
    | "scb-prisbasbelopp-2026"
    | "skatteverket-bilersattning"
    | "konsumentverket-kollektivtrafik"
    | "konsumentverket-tag"
    | "konsumentverket-flyg"
    | "konsumentverket-flygkalkylatorn"
    | "arn"
    | "nja-2018-s-127";
  title: string;
  publisher: string;
  url: string;
  summary: string;
}

export type AuthoritySourceId = AuthoritySource["id"];

/**
 * Verifierade svenska och europeiska primärkällor för lagtext, belopp och myndighetsvägledning.
 * Används som vanliga, följbara käll-länkar på /om och i respektive konsumentguide.
 */
export const AUTHORITY_SOURCES: readonly AuthoritySource[] = [
  {
    id: "lag-2015-953",
    title: "Lag (2015:953) om kollektivtrafikresenärers rättigheter",
    publisher: "Sveriges riksdag",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2015953-om-kollektivtrafikresenarers_sfs-2015-953/",
    summary: "Styr ersättning vid försening (50/75/100 % vid 20/40/60 min) samt annan transport i lokal- och regionaltrafik under 150 km.",
  },
  {
    id: "eu-2021-782",
    title: "Europaparlamentets och rådets förordning (EU) 2021/782 om rättigheter för tågresenärer",
    publisher: "EUR-Lex",
    url: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32021R0782",
    summary: "Styr fjärrtåg från 150 km och uppåt (25 % vid 60 min och 50 % vid 120+ min) samt assistans och ombokning.",
  },
  {
    id: "eg-261-2004",
    title: "EU-förordning (EG) nr 261/2004 om flygpassagerares rättigheter",
    publisher: "EUR-Lex",
    url: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32004R0261",
    summary: "Reglerar schablonersättning på 250–600 EUR samt Artikel 9-omvårdnad (mat, dryck och hotell) vid flygförsening och inställt flyg.",
  },
  {
    id: "scb-prisbasbelopp-2026",
    title: "Prisbasbeloppet för år 2026 (59 200 kr)",
    publisher: "Statistiska centralbyrån (SCB)",
    url: "https://www.scb.se/hitta-statistik/statistik-efter-amne/priser-och-ekonomiska-tendenser/priser/konsumentprisindex-kpi/pong/statistiknyhet/prisbasbeloppet-for-ar-2026/",
    summary: "Ligger till grund för trafikbolagens taxitak på 1/40 (1 480 kr) respektive 1/20 (2 960 kr) av prisbasbeloppet.",
  },
  {
    id: "forordning-2025-872",
    title: "Förordning (2025:872) om prisbasbelopp och förhöjt prisbasbelopp för år 2026",
    publisher: "Sveriges riksdag",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/forordning-2025872-om-prisbasbelopp-och-forhojt_sfs-2025-872/",
    summary: "Regeringens fastställda författning med 2026 års prisbasbelopp på 59 200 kr.",
  },
  {
    id: "skatteverket-bilersattning",
    title: "Avdrag för resor med bil & skattefri schablon (25 kr/mil)",
    publisher: "Skatteverket",
    url: "https://www.skatteverket.se/privat/skatter/bilochtrafik/avdragforresortillochfranarbetet/resormedbilmotorcykelellermopedbil.4.5c281c7015abecc2e203f23d.html",
    summary: "Riktmärke på 25 kr per mil (2,50 kr/km) som svenska länstrafikbolag tillämpar vid resegaranti med egen bil.",
  },
  {
    id: "nja-2018-s-127",
    title: "NJA 2018 s. 127 (”Flyget till Antalya” – skälig reklamationstid 2 månader)",
    publisher: "Högsta domstolen via Lagen.nu",
    url: "https://lagen.nu/dom/nja/2018s127",
    summary: "Slår fast att reklamation inom två månader vid försenat flyg alltid anses ha lämnats i rätt tid enligt svensk rätt.",
  },
  {
    id: "preskriptionslag-1981-130",
    title: "Preskriptionslag (1981:130) – 10 års allmän preskriptionstid",
    publisher: "Sveriges riksdag",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/preskriptionslag-1981130_sfs-1981-130/",
    summary: "Ger upp till 10 års preskriptionstid för fordran när reklamation lämnats i rätt tid.",
  },
  {
    id: "konsumentverket-kollektivtrafik",
    title: "Problem med resa i kollektivtrafik – dina rättigheter",
    publisher: "Konsumentverket",
    url: "https://www.konsumentverket.se/varor-och-tjanster/problem-med-resa-i-kollektivtrafik/",
    summary: "Tillsynsmyndighetens vägledning om förseningar, prisavdrag och ersättning för annan transport i lokaltrafik.",
  },
  {
    id: "konsumentverket-tag",
    title: "Försenat eller inställt tåg",
    publisher: "Konsumentverket",
    url: "https://www.konsumentverket.se/varor-och-tjanster-process/forsenat-eller-installt-tag/",
    summary: "Officiell vägledning om skillnaden mellan korta tågsträckor (< 150 km) och fjärrtåg (≥ 150 km).",
  },
  {
    id: "konsumentverket-flyg",
    title: "Försenat flyg – när kan du få ersättning och hjälp?",
    publisher: "Konsumentverket",
    url: "https://www.konsumentverket.se/varor-och-tjanster-process/forsenat-flyg/",
    summary: "Svensk konsumentvägledning om ersättningsnivåer, omvårdnad (Artikel 9) och reklamation vid flygstörningar.",
  },
  {
    id: "konsumentverket-flygkalkylatorn",
    title: "Konsumentverkets Flygkalkylator",
    publisher: "Konsumentverket",
    url: "https://flygkalkylatorn.konsumentverket.se/",
    summary: "Myndighetens eget beräkningsstöd för flygresenärers rättigheter inom EU.",
  },
  {
    id: "arn",
    title: "Allmänna reklamationsnämnden (ARN)",
    publisher: "ARN",
    url: "https://www.arn.se/",
    summary: "Kostnadsfri statlig tvistprövning om trafik- eller flygbolag avslår ett ersättningskrav.",
  },
] as const;

const SOURCE_MAP = new Map<AuthoritySourceId, AuthoritySource>(
  AUTHORITY_SOURCES.map((source) => [source.id, source])
);

/**
 * Hämtar en ordnad lista av verifierade myndighets- och lagkällor utifrån angivna id:n.
 */
export function getAuthoritySources(ids: readonly AuthoritySourceId[]): AuthoritySource[] {
  return ids
    .map((id) => SOURCE_MAP.get(id))
    .filter((source): source is AuthoritySource => Boolean(source));
}
