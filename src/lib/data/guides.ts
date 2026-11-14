import type { AuthoritySourceId } from "./sources";

export interface GuideSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface ConsumerGuide {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  readTime: string;
  summary: string;
  keyTakeaway: string;
  dateModified: string;
  sections: GuideSection[];
  relatedOperatorSlugs: string[];
  sourceIds: AuthoritySourceId[];
  faqs: Array<{ question: string; answer: string }>;
}

export const CONSUMER_GUIDES: ConsumerGuide[] = [
  {
    slug: "taxameterkvitto-vs-kortkvitto",
    shortTitle: "Taxikvitto som godkänns",
    title: "Därför nekas kortkvitton för taxi – och kvittot du måste kräva",
    category: "Taxi & Resegaranti",
    readTime: "3 min läsning",
    dateModified: "2026-11-14",
    summary:
      "En av de vanligaste anledningarna till att SL, Västtrafik och Skånetrafiken avslår taxiersättning är fel kvitto. Så undviker du fällan redan i taxin.",
    keyTakeaway:
      "Tacka aldrig bara ja till kortterminalens lilla slips – be chauffören om ett specificerat taxameter- eller originalkvitto med sträcka, datum, klockslag och organisationsnummer.",
    relatedOperatorSlugs: ["sl", "vasttrafik", "skanetrafiken", "ul"],
    sourceIds: ["lag-2015-953", "konsumentverket-kollektivtrafik", "konsumentverket-tag", "arn"],
    sections: [
      {
        heading: "Varför räcker inte vanligt bankkortskvitto?",
        body: "Ett vanligt kortkvitto visar bara att du dragit kortet för ett visst belopp hos en terminal – det visar inte varifrån eller vart du åkte, vilket klockslag resan skedde eller vem som utförde körningen.",
        bullets: [
          "Trafikbolagen måste kontrollera att taxiresan ersatte just den försenade kollektivtrafiksträckan.",
          "Hos bland annat Västtrafik och SL anges uttryckligen att enbart terminal- eller handskrivna kvitton normalt inte godkänns.",
        ],
      },
      {
        heading: "Det här måste synas på taxikvittot",
        body: "Säg till föraren eller kolla ditt app-kvitto innan du lämnar bilen att följande uppgifter finns med:",
        bullets: [
          "Datum samt start- och sluttid för körningen.",
          "Adresser eller hållplatser för start och destination.",
          "Taxiföretagets namn, organisationsnummer och totalsumma inklusive moms.",
        ],
      },
      {
        heading: "App-taxi (Uber / Bolt) vs vanlig taxi",
        body: "Åker du app-taxi får du oftast ett detaljerat PDF-/e-postkvitto med karta, adresser, klockslag och företagsuppgifter – spara hela PDF-kvittot, inte bara en skärmdump av bankens reservation.",
      },
    ],
    faqs: [
      {
        question: "Vad gör jag om jag redan hunnit slänga taxikvittot och bara har kontoutdraget?",
        answer:
          "Kontakta taxibolagets kundtjänst med exakt datum, tidpunkt och kortets fyra sista siffror – många taxibolag kan mejla ut en kvittokopia i efterhand.",
      },
      {
        question: "Gäller taxikvittot även om jag inte hann köpa lokaltrafikbiljett innan?",
        answer:
          "Ja, ofta – men bolag som SL och UL drar då av vad en ordinarie enkelbiljett skulle ha kostat från din ersättning.",
      },
    ],
  },
  {
    slug: "extraordinara-omstandigheter-flyg",
    shortTitle: "Extraordinära omständigheter",
    title: "Extraordinära omständigheter på flyg: När bolaget luras eller har rätt",
    category: "Flyg · EU 261/2004",
    readTime: "4 min läsning",
    dateModified: "2026-11-14",
    summary:
      "Många flygbolag avslår EU 261-krav reflexmässigt genom att hänvisa till extraordinära omständigheter. Lär dig skilja på verkliga undantag och vanliga driftfel.",
    keyTakeaway:
      "Tekniskt fel på flygplanet och intern flygbolagsstrejk är INTE extraordinära omständigheter. Dessutom gäller rätten till mat och hotell ALLTID – även vid snöstorm.",
    relatedOperatorSlugs: ["sas", "norwegian", "ryanair", "eu261-alla-flyg"],
    sourceIds: ["eg-261-2004", "konsumentverket-flyg", "konsumentverket-flygkalkylatorn", "arn"],
    sections: [
      {
        heading: "Vad som INTE är extraordinärt (du ska ha 250–600 EUR)",
        body: "EU-domstolen har i flera prejudikat klargjort att vardagliga problem i driften ingår i flygbolagets ansvar:",
        bullets: [
          "Tekniska fel på flygplanet som upptäcks vid underhåll eller före avgång.",
          "Sjukdom hos besättning eller personalbrist.",
          "Facklig strejk utlyst av flygbolagets egen personal.",
        ],
      },
      {
        heading: "Vad som faktiskt ÄR extraordinärt (ej kontant kompensation)",
        body: "Om orsaken låg helt utanför flygbolagets kontroll och inte kunde undvikas trots alla rimliga åtgärder utgår ingen schablonersättning:",
        bullets: [
          "Extremväder som gör flygning osäker (t.ex. stängd bana eller kraftig storm vid er avgång/ankomst).",
          "Beslut från flygledningen (ATC-restriktioner) eller stängt luftrum.",
          "Extern strejk (t.ex. flygplatsens säkerhetspersonal eller flygledare).",
        ],
      },
      {
        heading: "Viktigast att veta: Mat, dryck & hotell gäller ändå",
        body: "Även vid snöstorm eller askmoln kvarstår flygbolagets omvårdnadsplikt enligt Artikel 9. Efter > 2 timmars försening har du rätt till skälig mat, dryck och vid behov hotell och transfer – spara kvitton om bolaget inte delar ut kuponger.",
      },
    ],
    faqs: [
      {
        question: "Hur bemöter jag ett flygbolag som bara svarar ’extraordinära omständigheter’?",
        answer:
          "Be skriftligen om exakt orsak, tidpunkt och förklaring till varför omständigheten drabbade just er flight och inte gick att undvika. Får du inget rimligt svar kan ärendet prövas gratis hos ARN.",
      },
      {
        question: "Räknas följdförsening från gårdagens väder som extraordinärt?",
        answer:
          "Domstolar granskar följdverkningar hårt – bolaget måste visa att de vidtog alla rimliga åtgärder för att begränsa förseningen för just din flygning.",
      },
    ],
  },
  {
    slug: "periodkort-schablon-forseningsersattning",
    shortTitle: "Periodkort & schabloner",
    title: "Så beräknas 30-dagarskort, årskort & Movingo vid tågförsening",
    category: "Periodkort & Schablon",
    readTime: "3 min läsning",
    dateModified: "2026-11-14",
    summary:
      "Ett 30-dagarskort har inget fast pris per resa. Därför använder SL, Skånetrafiken och SJ helt olika matematiska schabloner när du begär förseningsersättning.",
    keyTakeaway:
      "SL ger fasta 6/9/12 kr (vuxen 30 dgr), Skånetrafiken delar biljettpriset på 44 resor (+30 % med värdekod), och SJ delar 30-dagars Snabbtåg på 22 resor.",
    relatedOperatorSlugs: ["sl", "skanetrafiken", "sj", "movingo"],
    sourceIds: [
      "lag-2015-953",
      "eu-2021-782",
      "scb-prisbasbelopp-2026",
      "forordning-2025-872",
      "konsumentverket-kollektivtrafik",
    ],
    sections: [
      {
        heading: "Jämförelse av kända schabloner 2026",
        body: "Varje trafikhuvudman sätter sin egen beräkningsnyckel i resevillkoren:",
        bullets: [
          "SL 30-dagarsbiljett (vuxen): fasta schabloner 6 kr (20–39 min), 9 kr (40–59 min) och 12 kr (60+ min).",
          "Skånetrafiken 30-dagarsbiljett: kortpris ÷ 44 resor = enskild resa, därefter 50 / 75 / 100 % (+30 % om du väljer värdekod).",
          "SJ 30-dagarskort Snabbtåg: kortpris ÷ 22 resor. SJ Årskort: årspris ÷ 160 resor. Därefter 25 % (60 min) eller 50 % (120+ min).",
        ],
      },
      {
        heading: "Varför taxi kan vara mycket mer värt än prisavdrag",
        body: "Om du åker på periodkort och blir kraftigt sen är rent biljettavdrag ofta bara en tia eller två. Bedöms du bli > 20 minuter sen i regionaltrafik får du i stället ta taxi upp till bolagets tak (t.ex. 1 480 kr hos SL/UL/Mälartåg, 1 500 kr hos Västtrafik, 2 960 kr hos Skånetrafiken).",
      },
    ],
    faqs: [
      {
        question: "Kan jag få tillbaka mer pengar än vad mitt månadskort kostade?",
        answer:
          "Nej, sammanlagd prisavdragsersättning under kortets giltighetstid är alltid begränsad till vad du betalade för periodkortet.",
      },
      {
        question: "Vad gäller om jag har Movingo?",
        answer:
          "Sök alltid hos det trafikbolag som körde just den försenade avgången (t.ex. Mälartåg, SJ, SL eller UL).",
      },
    ],
  },
  {
    slug: "egen-bil-milersattning-resegaranti",
    shortTitle: "Egen bil (25 kr/mil)",
    title: "Ta egen bil i stället för taxi vid inställt tåg: Regler & 25 kr/mil",
    category: "Alternativ transport",
    readTime: "3 min läsning",
    dateModified: "2026-11-14",
    summary:
      "Du behöver inte alltid hitta en ledig taxi när bussen ställs in. Flera svenska länstrafikbolag ersätter egen bil eller skjuts med 25 kr per mil.",
    keyTakeaway:
      "Västtrafik, SL, Skånetrafiken, Hallandstrafiken, Östgötatrafiken och X-trafik ersätter egen bil vid > 20 min befarad försening – Västtrafik ersätter även trängselskatt & parkering.",
    relatedOperatorSlugs: ["vasttrafik", "sl", "hallandstrafiken", "xtrafik"],
    sourceIds: [
      "skatteverket-bilersattning",
      "lag-2015-953",
      "scb-prisbasbelopp-2026",
      "konsumentverket-kollektivtrafik",
    ],
    sections: [
      {
        heading: "Grundregeln för milersättning",
        body: "Skatteverkets schablon för skattefri bilersättning är 25 kr per mil (2,50 kr/km), vilket länstrafikbolagen använder som riktmärke:",
        bullets: [
          "Västtrafik: 25 kr/mil + trängselskatt och parkering upp till totalt 1 500 kr för bilen.",
          "SL / Mälartåg / Östgötatrafiken / X-trafik: upp till 1/40 prisbasbelopp (1 480 kr år 2026).",
          "Viktigt på fjärrtåg (≥ 150 km) som SJ X2000 & Snälltåget: där har bolaget rätt att ordna ombokning själv – ta inte egen bil utan kontakt med kundservice.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kan någon skjutsa mig och få milersättning?",
        answer:
          "Ja, i många regionala resegarantier spelar det ingen roll om det är din egen bil eller att någon kör/skjutsar dig, så länge sträckan och den befarade förseningen på > 20 minuter kan styrkas.",
      },
      {
        question: "Vad skiljer bilersättning från taxi hos Västtrafik?",
        answer:
          "För taxi gäller 1 500 kr per resenär (slås ihop om ni delar taxi), medan taket för egen bil är 1 500 kr totalt för hela bilen.",
      },
    ],
  },
  {
    slug: "reklamera-inom-tva-manader-flyg",
    shortTitle: "2-månadersregeln (HD)",
    title: "Tvåmånadersregeln vs 10 års preskription på flyg (NJA 2018 s. 127)",
    category: "Svensk juridik",
    readTime: "3 min läsning",
    dateModified: "2026-11-14",
    summary:
      "Många internationella sajter säger att du har 3–6 år på dig att söka flygersättning. I Sverige kan du förlora allt om du inte reklamerar inom skälig tid.",
    keyTakeaway:
      "Högsta domstolen (NJA 2018 s. 127) slog fast att en reklamation inom 2 månader alltid anses vara i rätt tid. Skickar du kravet senare riskerar flygbolaget att vinna på sen reklamation.",
    relatedOperatorSlugs: ["sas", "norwegian", "ryanair", "eu261-alla-flyg"],
    sourceIds: [
      "nja-2018-s-127",
      "preskriptionslag-1981-130",
      "eg-261-2004",
      "konsumentverket-flyg",
      "arn",
    ],
    sections: [
      {
        heading: "Så fungerar de två fristerna tillsammans i Sverige",
        body: "Det är lätt att blanda ihop reklamationsplikt och preskriptionstid:",
        bullets: [
          "Reklamationstid (”skälig tid”): Du måste höra av dig till flygbolaget om att du kräver ersättning kort efter resan. Enligt HD:s dom NJA 2018 s. 127 är 2 månader alltid i rätt tid.",
          "Preskriptionstid (10 år): Har du reklamerat i tid har du därefter upp till 10 år enligt Preskriptionslagen för att driva eller fullfölja kravet.",
        ],
      },
    ],
    faqs: [
      {
        question: "Är det automatiskt kört om det gått 3 månader sedan mitt flyg blev försenat?",
        answer:
          "Inte alltid – det prövas vad som varit ”skälig tid” i det enskilda fallet (t.ex. sjukdom eller speciella skäl), men flygbolagen hänvisar ofta direkt till tvåmånadersgränsen. Skicka därför alltid kravet direkt!",
      },
      {
        question: "Vilken tidsfrist gäller för tåg i Sverige?",
        answer:
          "De flesta svenska tåg- och länstrafikbolag har 2 månaders ansökningsfrist i sina villkor (SL ger 3 månader).",
      },
    ],
  },
  {
    slug: "ratt-till-mat-och-hotell-vid-forsening",
    shortTitle: "Mat, dryck & hotell",
    title: "Rätt till mat, dryck & hotell: Även när ovädret stoppar flyget",
    category: "Omvårdnad · Artikel 9",
    readTime: "3 min läsning",
    dateModified: "2026-11-14",
    summary:
      "Står du strandsatt på Arlanda eller Landvetter i timmar? Även om ingen 250–600 EUR-ersättning utgår vid snöstorm måste flygbolaget betala din mat och hotell.",
    keyTakeaway:
      "Vid 2–4 timmars väntan (beroende på distans) inträder Artikel 9: skälig mat, dryck, två samtal/mejl och hotell med transfer vid behov – spara kvittona!",
    relatedOperatorSlugs: ["sas", "norwegian", "ryanair", "eu261-alla-flyg"],
    sourceIds: ["eg-261-2004", "konsumentverket-flyg", "konsumentverket-flygkalkylatorn", "arn"],
    sections: [
      {
        heading: "När slår rätten till omvårdnad till?",
        body: "Gränsen styrs av flygningens längd enligt EU 261/2004:",
        bullets: [
          "2 timmar eller mer: alla flygningar upp till 1 500 km.",
          "3 timmar eller mer: flygningar inom EU > 1 500 km och övriga 1 500–3 500 km.",
          "4 timmar eller mer: flygningar över 3 500 km utanför EU.",
          "Över 5 timmars försening: du har alltid rätt att avstå resan och få full återbetalning av oanvända biljettdelar.",
        ],
      },
      {
        heading: "Tänk på skälighetsnivån",
        body: "Flygbolagen ersätter normal mat och dryck (inte alkohol eller lyxrestauranger). Be personalen om matkuponger först, och om ingen finns på plats: spara alla specificerade originalkvitton.",
      },
    ],
    faqs: [
      {
        question: "Betalar flygbolaget alkohol under väntan?",
        answer:
          "Nej, mat och alkoholfria drycker i rimlig proportion till väntetiden ersätts – inte alkoholhaltiga drycker.",
      },
      {
        question: "Får jag ta hotell själv om flygbolaget inte ordnar något?",
        answer:
          "Ja, om flyget flyttas till nästa dag och flygbolaget inte svarar eller hjälper till på plats kan du boka ett rimligt standardhotell och taxi till/från hotellet mot specificerat kvitto.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): ConsumerGuide | undefined {
  return CONSUMER_GUIDES.find((g) => g.slug === slug);
}
