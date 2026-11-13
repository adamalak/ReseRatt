import {
  ONE_FORTIETH_PBB_2026,
  ONE_TWENTIETH_PBB_2026,
  OWN_CAR_KR_PER_MIL,
} from "./constants";

export type OperatorCategory = "lokaltrafik" | "tag" | "sammansatt" | "flyg";

export type TransitRuleMode =
  | "regional_under_150km"
  | "eu_rail_over_150km"
  | "hybrid_150km"
  | "eu261_flight";

export interface CompensationStep {
  label: string;
  minMinutes: number;
  maxMinutes?: number;
  percent: number;
  note?: string;
}

export interface PeriodTicketRule {
  summary: string;
  /** För t.ex. SL 30-dagars vuxen (fasta schablonbelopp 6 / 9 / 12 kr). */
  fixedAdult30DayPayoutsKr?: {
    p50: number;
    p75: number;
    p100: number;
  };
  /** För t.ex. Skånetrafiken (÷ 44) eller SJ 30-dagars Snabbtåg (÷ 22). */
  divisor30Day?: number;
  /** För t.ex. SJ Årskort (÷ 160). */
  divisorAnnual?: number;
  singleTicketFallbackNote?: string;
}

export interface TaxiAndCarRule {
  allowedFromMinutes: number;
  taxiSupported: boolean;
  /** Maxbelopp per resenär i SEK, om fast/pbb-baserat tak gäller. */
  taxiMaxPerPersonKr?: number;
  /** Om flera resenärer som delar taxi kan slå ihop taken. */
  taxiStacksPerPassenger?: boolean;
  taxiNote: string;
  ownCarSupported: boolean;
  ownCarPerMilKr?: number;
  /** Om egen bil har ett totaltak per bil (t.ex. Västtrafik 1 500 kr/bil). */
  ownCarMaxTotalKr?: number;
  /** Om egen bil delar samma beloppstak som taxi (1/40 eller 1/20 pbb). */
  ownCarSharesTaxiCap?: boolean;
  carNote: string;
  /** Extra bonusprocent vid val av värdekod/check i stället för kontanter. */
  voucherBonusPercent?: number;
  /** Avdrag motsvarande enkelbiljett om resenär inte hunnit köpa biljett i förväg. */
  deductUnboughtSingleTicketNote?: string;
}

export interface OperatorFaq {
  question: string;
  answer: string;
}

export interface OperatorProfile {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: OperatorCategory;
  categoryLabel: string;
  ruleMode: TransitRuleMode;
  seoTitle: string;
  metaDescription: string;
  heroSummary: string;
  lawFramework: string;
  delayThresholdMinutes: number;
  compensationLadder: CompensationStep[];
  euRailLadder?: CompensationStep[];
  periodTicketRule: PeriodTicketRule;
  taxiAndCar: TaxiAndCarRule;
  deadlineText: string;
  claimUrl: string;
  claimCtaLabel: string;
  claimInstructions: string[];
  evidenceChecklist: string[];
  pitfalls: string[];
  uniqueGuideNote: string;
  faqs: OperatorFaq[];
}

const REGIONAL_LADDER: CompensationStep[] = [
  { label: "20–39 min försenad", minMinutes: 20, maxMinutes: 39, percent: 50 },
  { label: "40–59 min försenad", minMinutes: 40, maxMinutes: 59, percent: 75 },
  { label: "60+ min försenad", minMinutes: 60, percent: 100 },
];

const EU_RAIL_LADDER: CompensationStep[] = [
  { label: "60–119 min försenad", minMinutes: 60, maxMinutes: 119, percent: 25 },
  { label: "120+ min försenad", minMinutes: 120, percent: 50 },
];

const EU261_FLIGHT_LADDER: CompensationStep[] = [
  {
    label: "Kortdistans (≤ 1 500 km), > 3 tim sen",
    minMinutes: 180,
    percent: 100,
    note: "250 EUR per passagerare",
  },
  {
    label: "Medeldistans (> 1 500 km inom EU eller 1 500–3 500 km), > 3 tim sen",
    minMinutes: 180,
    percent: 100,
    note: "400 EUR per passagerare",
  },
  {
    label: "Långdistans (> 3 500 km utanför EU), > 3 tim sen",
    minMinutes: 180,
    percent: 100,
    note: "600 EUR (kan halveras till 300 EUR vid viss ombokning inom 4 tim)",
  },
];

export const OPERATORS: OperatorProfile[] = [
  {
    id: "sl",
    slug: "sl",
    name: "SL (Storstockholm)",
    shortName: "SL",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "SL förseningsersättning & taxi 2026 – Regler, belopp & krav",
    metaDescription:
      "Räkna ut SL förseningsersättning 2026. Få 50–100 % eller upp till 1 480 kr för taxi vid > 20 min försening. Se schablon för 30-dagarsbiljett och krav.",
    heroSummary:
      "Blir tunnelbana, pendeltåg, tvärbana eller SL-buss minst 20 minuter sen gäller SL:s resegaranti med prisavdrag eller taxi upp till 1 480 kr.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "För SL 30-dagarsbiljett vuxen gäller fasta schablonbelopp per försenad resa (ca 6 kr vid 20 min, 9 kr vid 40 min och 12 kr vid 60+ min).",
      fixedAdult30DayPayoutsKr: { p50: 6, p75: 9, p100: 12 },
      singleTicketFallbackNote:
        "Har du student-/ungdoms- eller UL/SL-biljett anpassas schablonen efter den biljettens pris.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiStacksPerPassenger: false,
      taxiNote: `Taxi eller annan ersättningsresa ersätts upp till 1/40 av prisbasbeloppet (${ONE_FORTIETH_PBB_2026} kr år 2026) vid skälig risk för minst 20 min försening.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: `Egen bil eller samåkning ersätts inom samma tak (${ONE_FORTIETH_PBB_2026} kr) mot redovisad körsträcka.`,
      deductUnboughtSingleTicketNote:
        "Hade du inte köpt en giltig biljett innan förseningen uppstod gör SL avdrag motsvarande en enkelbiljett.",
    },
    deadlineText: "Inom 3 månader från restillfället",
    claimUrl: "https://sl.se/kundservice/forseningsersattning",
    claimCtaLabel: "Ansök hos SL (BankID)",
    claimInstructions: [
      "Ta en skärmdump av SL-appen eller avgångstavlan som visar förseningen innan du byter färdsätt.",
      "Spara originalkvittot från taxin (specificerat taxameterkvitto – enbart kortterminalens kvitto avslås ofta).",
      "Skicka in ansökan digitalt med BankID på sl.se inom 3 månader.",
    ],
    evidenceChecklist: [
      "Biljettnummer eller periodkorts-ID i SL-appen / SL-kort",
      "Skärmdump som visar planerad avgång och avvikelse/inställd tur",
      "Specificerat originalkvitto för taxi med sträcka, datum, klockslag och pris",
    ],
    pitfalls: [
      "Enbart kontokortskvitto utan sträcka och taxiorganisationsnummer blir ofta nekat.",
      "Om du vänder utan att ha biljett innan störningen dras priset för en enkelbiljett av från taxiersättningen.",
      "30-dagarskort ger bara 6–12 kr i ren förseningsersättning, så vid större försening är taxi eller alternativ resa ofta mer värd om du har bråttom.",
    ],
    uniqueGuideNote:
      "SL ger 3 månaders ansökningstid – längre än många andra länstrafikbolag som bara ger 2 månader.",
    faqs: [
      {
        question: "Hur mycket får jag för taxi med SL 2026?",
        answer: `Du kan få upp till ${ONE_FORTIETH_PBB_2026} kr (1/40 av 2026 års prisbasbelopp) om det fanns skälig anledning att anta att du skulle bli minst 20 minuter sen till ditt resmål.`,
      },
      {
        question: "Varför får jag bara 6–12 kr med SL 30-dagarsbiljett?",
        answer:
          "SL slår ut priset för 30-dagarskortet på ett genomsnittligt antal resor. Det ger ett schablonvärde på ca 12 kr per resa (50 % = 6 kr, 75 % = 9 kr, 100 % = 12 kr).",
      },
      {
        question: "Gäller SL:s resegaranti för Arlanda-pendeltåg eller UL/SL?",
        answer:
          "Ja, kombinationsbiljetter som UL/SL har egna, högre fasta schablonbelopp vid försening. Sök hos det bolag som trafikerade den försenade avgången.",
      },
      {
        question: "Hur lång tid har jag på mig att söka hos SL?",
        answer: "Du måste skicka in ansökan till SL senast 3 månader efter restillfället.",
      },
    ],
  },
  {
    id: "vasttrafik",
    slug: "vasttrafik",
    name: "Västtrafik (Göteborg & Västra Götaland)",
    shortName: "Västtrafik",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "Västtrafik resegaranti & förseningsersättning 2026 (1 500 kr + 20 %)",
    metaDescription:
      "Beräkna Västtrafik resegaranti 2026: 50–100 % biljettersättning, taxi upp till 1 500 kr/person, egen bil 25 kr/mil + trängselskatt och +20 % med värdekod.",
    heroSummary:
      "Västtrafik ger ersättning från 20 minuters försening – inklusive unika förmåner som sammanslagen taxigräns (1 500 kr per person) och +20 % värdekod.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "Västtrafik ersätter periodkort via sin schablon per försenad resa om du inte tar taxi, och lägger på +20 % om du väljer värdekod i Västtrafik To Go.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: 1500,
      taxiStacksPerPassenger: true,
      taxiNote:
        "Max 1 500 kr per person för taxi. Är ni flera försenade som delar samma taxi räknas 1 500 kr per resenär (t.ex. 2 personer = upp till 3 000 kr).",
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarMaxTotalKr: 1500,
      carNote:
        "Egen bil ersätts med Skatteverkets schablon 25 kr/mil plus eventuell trängselskatt och parkeringsavgift upp till totalt 1 500 kr för bilen (oavsett antal passagerare).",
      voucherBonusPercent: 20,
    },
    deadlineText: "Inom 2 månader (normal branschfrist via webbformulär)",
    claimUrl: "https://www.vasttrafik.se/kundservice/forseningsersattning/",
    claimCtaLabel: "Ansök hos Västtrafik",
    claimInstructions: [
      "Dokumentera avgången i Västtrafik To Go innan du beställer taxi eller tar bilen.",
      "Begär specificerat taxikvitto (handskrivna kvitton eller enbart kortterminal-kvitto godkänns normalt inte).",
      "Välj om du vill ha pengarna till bankkonto eller +20 % extra som värdekod i Västtrafik To Go.",
    ],
    evidenceChecklist: [
      "Biljettnummer i Västtrafik To Go eller Västtrafikkort",
      "Taxikvitto med resa specificerad (ej enbart kortköpskvitto) eller körsträcka + trängselskatt/p-kvitto",
      "Uppgifter för eventuella medresenärer om ni delar taxikostnad över 1 500 kr",
    ],
    pitfalls: [
      "Taket för egen bil är 1 500 kr totalt för bilen även om flera sitter i den – till skillnad från taxi där ni får 1 500 kr per person.",
      "Handskrivna taxikvitton eller bara bankkortskvitto leder regelmässigt till avslag.",
      "För Öresundstågsbiljetter köpta via Västtrafik finns särskild ansökningsväg hos Västtrafik.",
    ],
    uniqueGuideNote:
      "Västtrafik sticker ut positivt: delar ni taxi på två personer blir taket 3 000 kr, och väljer du värdekod i To Go får du 20 % bonus.",
    faqs: [
      {
        question: "Hur mycket ersätter Västtrafik för taxi om vi är två personer?",
        answer:
          "Västtrafik räknar 1 500 kr per person vid taxi, vilket innebär att två drabbade resenärer som delar samma taxi kan få upp till 3 000 kr totalt.",
      },
      {
        question: "Ersätter Västtrafik trängselskatt och parkering vid egen bil?",
        answer:
          "Ja! Utöver 25 kr/mil kan du få ersättning för trängselskatt och parkeringsavgift som uppstår, upp till max 1 500 kr totalt för bilen.",
      },
      {
        question: "Hur fungerar +20 % extra hos Västtrafik?",
        answer:
          "Om du väljer utbetalning som värdekod i appen Västtrafik To Go i stället för kontanter till bankkontot lägger Västtrafik på 20 % extra på ersättningen.",
      },
      {
        question: "Godkänner Västtrafik kortkvitto från taxin?",
        answer:
          "Nej, som regel krävs ett riktigt specificerat taxikvitto från taxibolaget. Ett naket terminal-/kortkvitto eller handskrivet kvitto godkänns normalt inte.",
      },
    ],
  },
  {
    id: "skanetrafiken",
    slug: "skanetrafiken",
    name: "Skånetrafiken",
    shortName: "Skånetrafiken",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "Skånetrafiken förseningsersättning 2026 – Taxi 2 960 kr & 30 % värdekod",
    metaDescription:
      "Räkna ut Skånetrafiken förseningsersättning 2026: taxi upp till 2 960 kr (1/20 prisbasbelopp), 30-dagarsbiljett delas på 44 resor och +30 % bonus med värdekod.",
    heroSummary:
      "Skånetrafiken har Sveriges högsta taxitak i lokaltrafiken (2 960 kr år 2026) och ger hela +30 % extra om du tar ersättningen som värdekod.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "För Skånetrafikens 30-dagarsbiljett delas biljettpriset på schablonen 44 resor. Ersättningen blir 50 / 75 / 100 % av det beloppet (max kortets pris totalt under giltighetstiden).",
      divisor30Day: 44,
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_TWENTIETH_PBB_2026,
      taxiStacksPerPassenger: true,
      taxiNote: `Ersättning för billigaste skäliga alternativa transport (t.ex. taxi) upp till 1/20 av prisbasbeloppet = ${ONE_TWENTIETH_PBB_2026} kr per betalande resenär år 2026.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: `Egen bil kan ersättas inom samma villkor för alternativ transport vid risk för minst 20 min försening.`,
      voucherBonusPercent: 30,
    },
    deadlineText: "Rekommenderas snarast (normalt inom 2 månader via BankID/Freja+)",
    claimUrl: "https://www.skanetrafiken.se/kundservice/",
    claimCtaLabel: "Ansök hos Skånetrafiken",
    claimInstructions: [
      "Säkerställ skälig risk för minst 20 minuters försening och välj billigaste skäliga alternativ.",
      "Spara originalkvitto/taxameterkvitto eller appbiljett.",
      "Logga in med BankID eller Freja+ via Skånetrafikens kundservice för ersättning.",
    ],
    evidenceChecklist: [
      "Biljettnummer i Skånetrafikens app eller Jojo-/kortuppgifter",
      "Originalkvitto/taxameterkvitto med tid, sträcka och belopp",
      "Skärmdump av trafikstörningen om tåget/bussen var försenad eller inställd",
    ],
    pitfalls: [
      "Har du en stor zon-/länsbiljett men bara åkte en kortare delsträcka kan Skånetrafiken räkna schablonen utifrån periodbiljetten för den kortare sträckan.",
      "Sammanlagd prisavdragsersättning under en periodbiljetts giltighetstid kan aldrig överstiga vad periodbiljetten kostade.",
      "För gränsöverskridande resor till Danmark / Öresundståg kan särskilda regler gälla.",
    ],
    uniqueGuideNote:
      "Skånetrafiken ger 1/20 av prisbasbeloppet i taxitak (2 960 kr år 2026) – dubbelt så högt som många andra regioners 1/40 – plus 30 % värdekodsbonus.",
    faqs: [
      {
        question: "Hur räknar Skånetrafiken ut ersättningen för en 30-dagarsbiljett?",
        answer:
          "Skånetrafiken delar priset på din 30-dagarsbiljett med schablonen 44 resor. På det framräknade respriset får du sedan 50 %, 75 % eller 100 % beroende på försening.",
      },
      {
        question: "Vad är maxbeloppet för taxi hos Skånetrafiken 2026?",
        answer: `Maxbeloppet är 1/20 av gällande prisbasbelopp per betalande resenär, vilket blir ${ONE_TWENTIETH_PBB_2026} kr år 2026 (prisbasbelopp 59 200 kr).`,
      },
      {
        question: "Får man bonus om man väljer värdekod hos Skånetrafiken?",
        answer:
          "Ja, väljer du värdekod i stället för kontant utbetalning lägger Skånetrafiken normalt på 30 % extra.",
      },
      {
        question: "Hur söker jag ersättning utan BankID?",
        answer:
          "Saknar du svenskt personnummer eller BankID/Freja+ tillhandahåller Skånetrafiken en pappersblankett som kan skickas in via post.",
      },
    ],
  },
  {
    id: "sj",
    slug: "sj",
    name: "SJ (Snabbtåg, InterCity & Regional)",
    shortName: "SJ",
    category: "tag",
    categoryLabel: "Tåg",
    ruleMode: "hybrid_150km",
    seoTitle: "SJ förseningsersättning 2026 – Regler under & över 15 mil (X2000, periodkort)",
    metaDescription:
      "Räkna ut SJ förseningsersättning 2026. Rätt procentsats (25–100 %) beroende på om tågets totalsträcka är under eller över 15 mil, plus schablon för 30-dagarskort & årskort.",
    heroSummary:
      "Hos SJ avgör tågets totala linjesträcka (från första till sista station): under 15 mil gäller ersättning redan vid 20 min, från 15 mil gäller EU-gränserna 60 och 120 min.",
    lawFramework: "Hybrid: Kollektivtrafiklagen (< 150 km) eller EU:s tågpassagerarförordning (≥ 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "För SJ 30-dagarskort Snabbtåg delas kortpriset på 22 resor för ett fiktivt biljettpris, och för SJ Årskort delas årspriset på 160 resor.",
      divisor30Day: 22,
      divisorAnnual: 160,
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiNote:
        "På kortare tåg (< 150 km) finns rätt till alternativ transport vid skälig risk för > 20 min försening. På längre tåg (≥ 150 km) ska SJ i första hand ordna ombokning/ersättningstrafik – kontakta personal/kundservice innan du bokar egen taxi!",
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      carNote:
        "Egen bil ersätts främst på sträckor < 150 km eller efter godkännande från SJ när ersättningstrafik saknas.",
    },
    deadlineText: "Senast inom 2 månader från resdagen (efter att resan avslutats)",
    claimUrl: "https://www.sj.se/sv/om-sj/fragor-och-svar/villkor-och-rattigheter/rattigheter-vid-forsening.html",
    claimCtaLabel: "Ansök hos SJ",
    claimInstructions: [
      "Vänta tills hela den planerade resan har avslutats innan du skickar in kravet.",
      "Kontrollera tågets totala linjesträcka – inte bara hur långt just du åkte (t.ex. Stockholm–Uppsala på ett tåg som fortsätter till Dalarna/Norrland räknas som ≥ 15 mil!).",
      "Skicka ansökan via sj.se eller SJ-appen inom 2 månader med bokningsnummer / kortnummer.",
    ],
    evidenceChecklist: [
      "Bokningsnummer (6 tecken) eller SJ-periodkortsnummer + platsreservation",
      "Tågnummer och datum för den försenade avgången",
      "Kvitton för mat/alternativ transport om tåget stod stilla eller krävde övernattning",
    ],
    pitfalls: [
      "Klassisk SJ-fälla: Även om DU bara åker 35 minuter (t.ex. Skövde–Göteborg) gäller 60/120-minutersregeln om tågets hela linje (t.ex. Stockholm–Göteborg) är ≥ 150 km.",
      "Ta inte egen dyr taxi på ett långt Snabbtåg/X2000 utan att först prata med tågvärd eller SJ kundservice – på långa tåg är det bolaget som ska ordna ombokningen.",
      "Total ersättning på SJ periodkort är takad mot vad kortet kostade.",
    ],
    uniqueGuideNote:
      "Kom ihåg 15-milsregeln: Det är alltid tåglinjens totala längd (startstation till slutstation) som styr om du får pengar vid 20 minuter eller först vid 60 minuter.",
    faqs: [
      {
        question: "Varför fick jag ingen ersättning när mitt X2000 var 40 minuter sent?",
        answer:
          "X2000 och andra tåg med total linjesträcka på 150 km eller mer styrs av EU:s tågpassagerarförordning. Där börjar ersättningen först vid 60 minuters försening (25 %).",
      },
      {
        question: "Hur beräknas ersättningen för SJ 30-dagarskort Snabbtåg?",
        answer:
          "SJ delar kortets pris med 22 för att få fram ett beräknat enkelpris per resa, och för SJ Årskort delas priset med 160. Sedan får du 25 % vid 60–119 min och 50 % vid 120+ min.",
      },
      {
        question: "Hur lång tid har man på sig att ansöka hos SJ?",
        answer: "Som huvudregel senast inom 2 månader efter restillfället, efter att hela resan slutförts.",
      },
      {
        question: "Vad gäller för Resplus-biljetter köpta via SJ?",
        answer:
          "Är biljetten märkt med Resplus och kombinerar flera trafikbolag söker du samlad ersättning via Samtrafikens Resplus-portal.",
      },
    ],
  },
  {
    id: "malartag",
    slug: "malartag",
    name: "Mälartåg",
    shortName: "Mälartåg",
    category: "tag",
    categoryLabel: "Tåg",
    ruleMode: "hybrid_150km",
    seoTitle: "Mälartåg förseningsersättning 2026 – Regler, taxi 1 480 kr & 15-milsgräns",
    metaDescription:
      "Kolla din ersättning från Mälartåg 2026. Få 50–100 % på sträckor < 15 mil eller 25–50 % från 60 min på linjer ≥ 15 mil. Taxi upp till 1 480 kr vid > 20 min.",
    heroSummary:
      "Mälartåg trafikerar både regionala sträckor under 15 mil och längre linjer över 15 mil. Vid skälig risk för > 20 min försening gäller taxiersättning upp till ca 1 480 kr.",
    lawFramework: "Hybrid: Kollektivtrafiklagen (< 150 km) och EU:s tågpassagerarförordning (≥ 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "För Mälartåg- och Movingo-periodbiljetter beräknas ett schablonvärde per resa utifrån biljettpriset och typiskt antal resor.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Vid skälig risk för > 20 min försening på berörda sträckor ersätts alternativ transport (t.ex. taxi) upp till 1/40 av prisbasbeloppet (${ONE_FORTIETH_PBB_2026} kr år 2026).`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: "Egen bil ersätts enligt skattefri milersättning (25 kr/mil) inom samma maxbelopp.",
      deductUnboughtSingleTicketNote:
        "Hade du inte köpt biljett innan förseningen dras kostnaden för en enkelbiljett av från ersättningen.",
    },
    deadlineText: "Inom 2 månader via Mälardalstrafiks ersättningsportal",
    claimUrl: "https://www.malartag.se/kundservice/ansok-om-ersattning-vid-forsening",
    claimCtaLabel: "Ansök hos Mälartåg",
    claimInstructions: [
      "Kontrollera om din sträcka är kortare eller längre än 15 mil i tågets hela linjedragning.",
      "Spara biljett-/Movingo-nummer och eventuellt taxikvitto i original.",
      "Skicka ansökan via Mälartågs formulär (om Mälartåg körde den försenade avgången).",
    ],
    evidenceChecklist: [
      "Biljettnummer eller Movingo-ID",
      "Datum, avgångstid och berörd station",
      "Originalkvitto på taxi eller redovisad milsträcka",
    ],
    pitfalls: [
      "Mälartåg-tåg kör ofta långa linjer (t.ex. Örebro–Eskilstuna–Stockholm–Uppsala) över 15 mil – kontrollera linjens totallängd.",
      "Har du Movingo men blev sen med SJ, SL eller UL i stället ska kravet riktas mot det bolag som körde den sena turen.",
    ],
    uniqueGuideNote:
      "Mälartåg har taxiersättning kopplad till 1/40 av prisbasbeloppet (1 480 kr år 2026) och delar ansökningsflöde med Mälardalstrafik/Movingo.",
    faqs: [
      {
        question: "Hur mycket får jag för taxi med Mälartåg 2026?",
        answer: `Taket ligger på 1/40 av prisbasbeloppet, vilket motsvarar ${ONE_FORTIETH_PBB_2026} kr år 2026. Eventuell saknad biljett dras av.`,
      },
      {
        question: "Var söker jag förseningsersättning om jag åker med Movingo?",
        answer:
          "Om tåget som blev försenat kördes av Mälartåg söker du via Mälartågs portal. Kördes det av SJ, SL eller UL söker du hos det bolaget.",
      },
      {
        question: "Gäller 20-minutersregeln alltid på Mälartåg?",
        answer:
          "För kontant prisavdrag gäller 20/40/60 min när tågets totalsträcka är under 150 km. Är linjen 150 km eller längre gäller EU-gränserna 60 och 120 min för biljettavdrag.",
      },
      {
        question: "Hur lång är tidsfristen hos Mälartåg?",
        answer: "Ansök senast 2 månader efter den försenade resan.",
      },
    ],
  },
  {
    id: "movingo",
    slug: "movingo",
    name: "Movingo (Mälardalstrafik)",
    shortName: "Movingo",
    category: "sammansatt",
    categoryLabel: "Periodkort / Samarbete",
    ruleMode: "hybrid_150km",
    seoTitle: "Movingo förseningsersättning 2026 – Vart du söker & taxigräns (1 480 kr)",
    metaDescription:
      "Reser du med Movingo och tåget blev försenat? Se vilket bolag du ska söka hos (Mälartåg, SJ, SL, UL, Sörmlandstrafiken, VL) och maxbelopp för taxi.",
    heroSummary:
      "Movingo är ingen egen tågoperatör – du söker alltid ersättning hos det trafikbolag som faktiskt körde det försenade tåget eller bussen.",
    lawFramework: "Styrs av det utförande trafikbolagets villkor (< 150 km eller ≥ 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "Ersättningen beräknas efter en periodkortsschablon per resa hos det utförande trafikbolag som orsakade förseningen (t.ex. Mälartåg, SJ eller SL).",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Normalt upp till 1/40 av prisbasbeloppet (${ONE_FORTIETH_PBB_2026} kr år 2026) inom Mälardalen vid risk för > 20 min försening, beroende på utförande operatör.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: "Egen bil ersätts enligt gällande villkor hos det trafikbolag som körde den försenade turen.",
    },
    deadlineText: "Normalt 2 månader (SL 3 månader om SL-trafiken var sen)",
    claimUrl: "https://www.malartag.se/kundservice/ansok-om-ersattning-vid-forsening",
    claimCtaLabel: "Ansök via Mälartåg / rätt bolag",
    claimInstructions: [
      "Kolla vilket bolag som stod på tåget eller bussen som blev sen (Mälartåg, SJ, SL, UL, Sörmlandstrafiken, VL eller Västmanland/Östergötland).",
      "Ta fram ditt Movingo biljett-ID i Movingo- eller SJ-appen.",
      "Skicka ansökan till det bolag som körde den försenade avgången.",
    ],
    evidenceChecklist: [
      "Movingo biljettnummer / giltighetssträcka",
      "Tågnummer eller linjenummer för den försenade avgången",
      "Originalkvitto på taxi om du tog alternativ transport",
    ],
    pitfalls: [
      "Att skicka ansökan till Mälartåg när förseningen egentligen skedde på SJ eller SL:s pendeltåg leder ofta till hänvisning vidare och tappad tid.",
      "Kom ihåg att om anslutande lokaltrafik (t.ex. SL) ingick i Movingokortet så gäller SL:s regler för just SL-delen.",
    ],
    uniqueGuideNote:
      "Gyllene Movingo-regeln: Titta inte bara på vem som sålde kortet – sök hos bolaget som körde den försenade turen.",
    faqs: [
      {
        question: "Vem betalar ersättningen när jag har Movingo?",
        answer:
          "Du söker hos den operatör som trafikerade just den försenade avgången – oftast Mälartåg, SJ, SL eller UL.",
      },
      {
        question: "Gäller taxigaranti även när man reser på Movingo?",
        answer:
          "Ja, på samma villkor som för andra resenärer hos det utförande bolaget (ofta upp till 1 480 kr för regional trafik vid risk för > 20 min försening).",
      },
      {
        question: "Vilken tid gäller om mitt SJ-tåg med Movingo är 35 min sent?",
        answer:
          "Om SJ-tågets totala linje är ≥ 150 km krävs normalt 60 min försening för biljettavdrag enligt tågpassagerarförordningen.",
      },
      {
        question: "Vad gör jag om flera bolag var inblandade i samma Movingo-resa?",
        answer:
          "Sök i första hand hos det bolag vars försening orsakade att resan bröt ihop eller missade anslutningen.",
      },
    ],
  },
  {
    id: "oresundstag",
    slug: "oresundstag",
    name: "Öresundståg",
    shortName: "Öresundståg",
    category: "tag",
    categoryLabel: "Tåg",
    ruleMode: "regional_under_150km",
    seoTitle: "Öresundståg förseningsersättning 2026 – Regler, taxi & länstrafik",
    metaDescription:
      "Så får du förseningsersättning på Öresundståg 2026. Räkna ut 50–100 % ersättning, se taxiregler och vilket länstrafikbolag du ska skicka ansökan till.",
    heroSummary:
      "Öresundståg drivs gemensamt av flera sydsvenska regioner. På regionala biljetter söker du oftast hos det länstrafikbolag där resan började.",
    lawFramework: "Regionala trafikhuvudmäns villkor / Kollektivtrafiklagen",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "Ersättningen beräknas enligt periodkortsschablonen hos det länstrafikbolag där du köpte biljetten/påbörjade resan (t.ex. Skånetrafiken ÷ 44).",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Normalt max 1 480–2 960 kr beroende på vilket läns trafikvillkor biljetten köpts under (t.ex. Skånetrafiken 2 960 kr, Västtrafik 1 500 kr/person, Hallandstrafiken ca 1 480 kr).`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: "Egen bil (25 kr/mil) följer startlänets resegarantivillkor.",
    },
    deadlineText: "Inom 2 månader via startlänets trafikhuvudman (eller SJ vid SJ-biljett)",
    claimUrl: "https://www.oresundstag.se/kundservice",
    claimCtaLabel: "Öresundståg kundservice & länkguide",
    claimInstructions: [
      "Identifiera vilket länstrafikbolag din resa började i eller var du köpte biljetten (Skånetrafiken, Hallandstrafiken, Västtrafik, Blekingetrafiken, Kalmar länstrafik eller Länstrafiken Kronoberg).",
      "Har du köpt genomgående SJ- eller Resplus-biljett söker du där.",
      "Skicka in ansökan med biljettnummer och ev. taxikvitto inom 2 månader.",
    ],
    evidenceChecklist: [
      "Biljett-ID / app-kvitto som visar var resan började och slutade",
      "Skärmdump på förseningen eller inställd avgång",
      "Taxameterkvitto i original vid alternativ transport",
    ],
    pitfalls: [
      "Köpte du Öresundstågs-biljett i Västtrafik-regionen finns en särskild Öresundstågs-ansökan hos Västtrafik.",
      "Resor som korsar gränsen till Danmark (Köpenhamn/Kastrup) kan påverkas av gränskontroller eller danska villkor.",
    ],
    uniqueGuideNote:
      "På Öresundståg följer dina rättigheter och taxitaket nästan alltid det regionala bolag som sålde biljetten eller där resan startade.",
    faqs: [
      {
        question: "Var söker jag ersättning för Öresundståg?",
        answer:
          "För regionala enkel- och periodbiljetter söker du hos det länstrafikbolag där resan började (t.ex. Skånetrafiken, Hallandstrafiken eller Västtrafik).",
      },
      {
        question: "Hur stor är ersättningen för Öresundståg?",
        answer:
          "På regionala biljetter gäller normalt 50 % från 20 min, 75 % från 40 min och 100 % från 60 min försening.",
      },
      {
        question: "Får man ta taxi om Öresundståget blir inställt?",
        answer:
          "Ja, om det finns skälig risk att du blir över 20 minuter sen. Maxbeloppet styrs av startlänets villkor (t.ex. 2 960 kr i Skåne, 1 500 kr i Västtrafik).",
      },
      {
        question: "Vad gäller om jag reser till Kastrup eller Köpenhamn?",
        answer:
          "Kontrollera villkoren hos Skånetrafiken/Öresundståg; grundläggande 20-minutersgaranti gäller på många Skånetrafiken-biljetter över sundet, men särskilda taxiregler kan gälla utanför Sverige.",
      },
    ],
  },
  {
    id: "resplus",
    slug: "resplus",
    name: "Resplus (Kombinationsresor / Samtrafiken)",
    shortName: "Resplus",
    category: "sammansatt",
    categoryLabel: "Kombinationsresa",
    ruleMode: "hybrid_150km",
    seoTitle: "Resplus förseningsersättning & Kom-fram-garanti 2026",
    metaDescription:
      "Missade du anslutningen med Resplus-biljett? Se hur Kom-fram-garantin fungerar och hur du söker gemensam förseningsersättning via Samtrafiken.",
    heroSummary:
      "Resplus har den unika ”Kom-fram-garantin”: missar du ett byte mellan olika bolag på en sammanhängande Resplus-biljett tar det bolag du reser med dig hela vägen fram.",
    lawFramework: "Resplus Kom-fram-garanti + Lagen / EU-förordningen beroende på delsträcka",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "Resplus används främst för enkelresor som kombinerar t.ex. länstrafikbuss + SJ + regionaltåg på en biljett.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiNote:
        "Viktigt: Vid hotande missad anslutning ska du alltid vända dig till personal eller kundtjänst på plats först för att få anvisad ersättningstrafik inom Kom-fram-garantin.",
      ownCarSupported: false,
      carNote:
        "Egen bil ersätts normalt inte utan föregående godkännande inom Resplus Kom-fram-garanti.",
    },
    deadlineText: "Inom 2 månader via Samtrafikens gemensamma Resplus-portal",
    claimUrl: "https://forseningsersattning.resplus.se/",
    claimCtaLabel: "Ansök på forseningsersattning.resplus.se",
    claimInstructions: [
      "Kontakta personal på tåget/stationen direkt om du ser att du kommer missa ett byte så att du får ny resa eller taxi ordnad.",
      "Spara hela din Resplus-biljett med bokningsnummer.",
      "Ansök om förseningsersättning i efterhand på forseningsersattning.resplus.se inom 2 månader.",
    ],
    evidenceChecklist: [
      "Hela Resplus-bokningen / biljettnumret",
      "Vilken delsträcka som blev försenad och vilket byte som missades",
      "Eventuella godkända kvitton för ombokning, taxi eller förtäring",
    ],
    pitfalls: [
      "Har du köpt två separata biljetter själv (t.ex. en SL-biljett och en SJ-biljett utan att det står Resplus) gäller INTE Kom-fram-garantin.",
      "Ansök via Resplus portal – inte separat till tre olika bolag.",
    ],
    uniqueGuideNote:
      "Resplus Kom-fram-garanti är guld värd vid byten mellan buss och tåg – men bara om hela resan köptes som en sammanhängande Resplus-biljett.",
    faqs: [
      {
        question: "Vad är Resplus Kom-fram-garanti?",
        answer:
          "Den garanterar att om en försening gör att du missar ett planerat byte på en Resplus-biljett hjälper trafikbolagen dig vidare till slutdestinationen utan extra biljettkostnad.",
      },
      {
        question: "Var söker jag ersättning för en försenad Resplus-resa?",
        answer:
          "Du söker samlat för hela resan på Samtrafikens särskilda portal forseningsersattning.resplus.se.",
      },
      {
        question: "Gäller Resplus om jag själv köpt två separata biljetter?",
        answer:
          "Nej, resan måste vara utfärdad som en sammanhängande Resplus-biljett för att Kom-fram-garantin ska gälla.",
      },
      {
        question: "Gäller 20 eller 60 minuters gräns för ersättning på Resplus?",
        answer:
          "Det beror på vilken typ av trafik som ingick och om huvudsträckan var under eller över 150 km. Själva portalen räknar ut korrekt nivå utifrån ditt bokningsnummer.",
      },
    ],
  },
  {
    id: "ul",
    slug: "ul",
    name: "UL (Uppsala länstrafik)",
    shortName: "UL",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "UL förseningsersättning & resegaranti 2026 – Taxi upp till 1 480 kr",
    metaDescription:
      "Räkna ut UL förseningsersättning 2026: 50–100 % från 20 minuter, taxi upp till 1 480 kr och regler för UL-periodbiljett och pappersbiljett.",
    heroSummary:
      "I Uppsala län ger UL förseningsersättning redan från 20 minuters försening med upp till 1 480 kr för alternativ transport som taxi.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "För UL-periodbiljett räknas värdet för en enskild resa ut genom UL:s fastställda schablon för periodbiljettens genomsnittliga antal resor.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `UL ersätter skäliga faktiska utlägg för alternativ transport upp till ${ONE_FORTIETH_PBB_2026} kr mot originalkvitto.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: `Egen bil kan ersättas inom samma maxbelopp (${ONE_FORTIETH_PBB_2026} kr).`,
      deductUnboughtSingleTicketNote:
        "Om du inte hade hunnit köpa biljett innan förseningen uppstod drar UL av priset för den biljett du skulle ha haft.",
    },
    deadlineText: "Senast inom 2 månader efter händelsen",
    claimUrl: "https://www.ul.se/kundservice/forseningsersattning/",
    claimCtaLabel: "Ansök hos UL",
    claimInstructions: [
      "Spara originalkvitto på taxin och uppgift om resväg + försening.",
      "Observera att pappersbiljetter och taxiutlägg hos UL ibland kräver särskild blankett/svarspost utöver digitalt BankID-flöde.",
      "Skicka ansökan senast 2 månader efter resdagen.",
    ],
    evidenceChecklist: [
      "UL-biljett eller kortnummer",
      "Originalkvitto från taxibolag (med sträcka och pris)",
      "Datum, linjenummer och beräknad kontra faktisk ankomsttid",
    ],
    pitfalls: [
      "Har du UL/SL-kombibiljett kontrolleras ersättningen utifrån vilken operatörs trafik som var försenad.",
      "Saknas biljett vid störningen drar UL av ordinarie enkelbiljettpris.",
    ],
    uniqueGuideNote:
      "UL använder 2-månadersgräns för ansökan och har ett fast maxbelopp på 1 480 kr för alternativ transport år 2026.",
    faqs: [
      {
        question: "Hur mycket ersätter UL för taxi?",
        answer: `UL ersätter faktiska utlägg för alternativ transport upp till ${ONE_FORTIETH_PBB_2026} kr (år 2026) vid skälig risk för mer än 20 minuters försening.`,
      },
      {
        question: "Vad får jag om jag åker med periodbiljett hos UL och inte tar taxi?",
        answer:
          "Du får 50 % (från 20 min), 75 % (från 40 min) eller 100 % (från 60 min) av det schablonvärde som UL beräknar per resa på biljetten.",
      },
      {
        question: "Hur snabbt måste man söka hos UL?",
        answer: "Ansökan ska lämnas in senast 2 månader efter resan.",
      },
      {
        question: "Drar UL av enkelbiljett om jag inte hunnit köpa biljett?",
        answer:
          "Ja, om du inte hade giltig biljett när förseningen blev känd dras motsvarande enkelbiljettpris av från taxiersättningen.",
      },
    ],
  },
  {
    id: "ostgotatrafiken",
    slug: "ostgotatrafiken",
    name: "Östgötatrafiken",
    shortName: "Östgötatrafiken",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "Östgötatrafiken förseningsersättning 2026 – Regler & taxi (1 480 kr)",
    metaDescription:
      "Kolla Östgötatrafikens resegaranti 2026: ersättning från 20 min försening, taxi eller egen bil upp till 1 480 kr och ansökan inom 2 månader.",
    heroSummary:
      "Blir Östgötatrafikens buss, spårvagn eller Östgötapendeln minst 20 minuter sen kan du få biljettersättning eller alternativ transport upp till 1 480 kr.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "För periodbiljetter beräknas ersättningen enligt Östgötatrafikens schablonvärde per enskild resa.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Taxi eller annan skälig transport ersätts upp till ${ONE_FORTIETH_PBB_2026} kr vid risk för minst 20 min försening.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: `Egen bil ersätts enligt Skatteverkets skattefria milersättning (25 kr/mil) upp till ${ONE_FORTIETH_PBB_2026} kr.`,
    },
    deadlineText: "Inom 2 månader från resdagen",
    claimUrl: "https://www.ostgotatrafiken.se/kontakt-och-hjalp",
    claimCtaLabel: "Östgötatrafiken kontakt & ersättning",
    claimInstructions: [
      "Bedöm skäligheten av förseningen och spara trafikinformation om möjligt.",
      "Spara originalkvitto vid taxiutlägg.",
      "Skicka in ansökan digitalt inom 2 månader (gäller det Krösatåg över länsgräns kan t.ex. Kalmar länstrafik bli aktuell).",
    ],
    evidenceChecklist: [
      "Biljett-ID i Östgötatrafikens app eller resekort",
      "Originalkvitto på taxi eller körsträcka vid egen bil",
      "Linje, datum och hållplats",
    ],
    pitfalls: [
      "Vid länsgränsöverskridande Krösatåg kan ett annat grannläns bolag hantera ärendet beroende på var biljetten köptes.",
      "Överskrid inte 2-månadersgränsen.",
    ],
    uniqueGuideNote:
      "Östgötatrafiken använder taket 1/40 av prisbasbeloppet (1 480 kr år 2026) för både taxi och egen bil (25 kr/mil).",
    faqs: [
      {
        question: "Hur mycket ersätter Östgötatrafiken för taxi eller egen bil?",
        answer: `Upp till ${ONE_FORTIETH_PBB_2026} kr (år 2026). För egen bil gäller 25 kr/mil.`,
      },
      {
        question: "När börjar förseningsersättningen gälla hos Östgötatrafiken?",
        answer: "Vid förseningar på minst 20 minuter till din planerade slutdestination.",
      },
      {
        question: "Hur lång tid har man på sig att ansöka hos Östgötatrafiken?",
        answer: "Du måste lämna in ansökan senast inom 2 månader från resdagen.",
      },
      {
        question: "Vad gäller för Östgötapendeln?",
        answer:
          "Östgötapendeln omfattas av Östgötatrafikens villkor med ersättning från 20 minuters försening.",
      },
    ],
  },
  {
    id: "hallandstrafiken",
    slug: "hallandstrafiken",
    name: "Hallandstrafiken",
    shortName: "Hallandstrafiken",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "regional_under_150km",
    seoTitle: "Hallandstrafiken resegaranti & förseningsersättning 2026",
    metaDescription:
      "Räkna ut Hallandstrafikens resegaranti 2026: ersättning vid > 20 min försening, egen bil 25 kr/mil, taxi mot kvitto och ansökan inom 2 månader.",
    heroSummary:
      "Blir bussen eller tåget inom Hallandstrafiken mer än 20 minuter försenat till slutstationen gäller resegarantin – inklusive ersättning för egen bil med 25 kr/mil.",
    lawFramework: "Lagen om kollektivtrafikresenärers rättigheter (< 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    periodTicketRule: {
      summary:
        "För periodbiljetter hos Hallandstrafiken räknas ersättningen ut via bolagets periodkortsschablon per resa.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Alternativ transport som taxi ersätts enligt gällande skälighets- och takregler (normalt upp till ca ${ONE_FORTIETH_PBB_2026} kr) när resan riskerar att bli > 20 min sen.`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: "Milersättning för eget fordon är begränsad till 25 kr/mil.",
    },
    deadlineText: "Senast inom 2 månader efter händelsen",
    claimUrl: "https://www.hallandstrafiken.se/kundservice/",
    claimCtaLabel: "Ansök hos Hallandstrafiken",
    claimInstructions: [
      "Dokumentera förseningen (t.ex. buss som inte stannar eller tågförsening > 20 min).",
      "Spara taxikvitto eller anteckna körd sträcka med egen bil.",
      "Skicka ansökan via Hallandstrafikens hemsida/app inom 2 månader.",
    ],
    evidenceChecklist: [
      "Biljett-ID eller periodkortsnummer",
      "Datum, linjenummer och hållplats",
      "Kvitto på alternativa resekostnader",
    ],
    pitfalls: [
      "För Öresundståg på Hallandskusten avgör startstation/biljettyp om Hallandstrafiken, Skånetrafiken eller Västtrafik handlägger kravet.",
      "Ansök alltid inom 2 månader.",
    ],
    uniqueGuideNote:
      "Hallandstrafiken betalar 25 kr/mil om du väljer att ta egen bil vid risk för mer än 20 minuters försening.",
    faqs: [
      {
        question: "Hur mycket får man per mil med egen bil hos Hallandstrafiken?",
        answer: "Milersättningen för egen bil är 25 kr/mil.",
      },
      {
        question: "Hur sen måste resan vara hos Hallandstrafiken?",
        answer: "Du omfattas om förseningen till slutstationen blir mer än 20 minuter.",
      },
      {
        question: "Gäller resegarantin om bussen kör förbi utan att stanna?",
        answer: "Ja, om det leder till en försening som överstiger 20 minuter omfattas du av resegarantin.",
      },
      {
        question: "Inom hur lång tid måste jag söka hos Hallandstrafiken?",
        answer: "Senast 2 månader efter restillfället.",
      },
    ],
  },
  {
    id: "xtrafik",
    slug: "xtrafik",
    name: "X-trafik (Gävleborg)",
    shortName: "X-trafik",
    category: "lokaltrafik",
    categoryLabel: "Lokaltrafik",
    ruleMode: "hybrid_150km",
    seoTitle: "X-trafik förseningsersättning & resegaranti 2026 (1 480 kr)",
    metaDescription:
      "Räkna ut X-trafiks förseningsersättning 2026: 50–100 % på buss och regionaltåg (< 15 mil), egen bil 25 kr/mil och taxi mellan hållplatser upp till 1 480 kr.",
    heroSummary:
      "X-trafik ger 50–100 % ersättning från 20 min på buss och tåg under 15 mil – plus upp till 1 480 kr för taxi mellan trafikerade hållplatser eller 25 kr/mil för egen bil.",
    lawFramework: "Kollektivtrafiklagen (< 150 km) / EU:s tågförordning (tåg ≥ 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "För periodbiljetter hos X-trafik beräknas ersättningen utifrån biljettens schablonvärde per resa.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiMaxPerPersonKr: ONE_FORTIETH_PBB_2026,
      taxiNote: `Taxi ersätts normalt mellan de hållplatser linjen trafikerar upp till totalt ${ONE_FORTIETH_PBB_2026} kr per resa (år 2026).`,
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      ownCarSharesTaxiCap: true,
      carNote: `Egen bil ersätts med 25 kr/mil upp till max ${ONE_FORTIETH_PBB_2026} kr per resa.`,
    },
    deadlineText: "Inom 2 månader från händelsen",
    claimUrl: "https://xtrafik.se/forseningsersattning",
    claimCtaLabel: "Ansök hos X-trafik",
    claimInstructions: [
      "Kontrollera om resan gick med buss/X-tåg under 15 mil eller ett längre tåg över 15 mil.",
      "Tänk på att taxi normalt ersätts mellan hållplatser som linjen trafikerar.",
      "Skicka ansökan via xtrafik.se/forseningsersattning inom 2 månader.",
    ],
    evidenceChecklist: [
      "Biljettnummer eller periodkortsuppgifter",
      "Originalkvitto på taxi eller körd sträcka med bil",
      "Tidtabellsavgång och faktisk ankomsttid",
    ],
    pitfalls: [
      "X-trafik har tydlig hållplats-till-hållplats-princip för taxi: taxi från dörr till dörr långt utanför linjen kan bli nedsatt.",
      "På tågsträckor över 150 km gäller EU:s tågpassagerarförordning (60/120 min).",
    ],
    uniqueGuideNote:
      "X-trafik kombinerar tydliga 50/75/100 %-nivåer med max 1 480 kr för alternativ transport år 2026.",
    faqs: [
      {
        question: "Vad är maxbeloppet för taxi hos X-trafik 2026?",
        answer: `Maxbeloppet för alternativ transport (taxi eller egen bil à 25 kr/mil) är ${ONE_FORTIETH_PBB_2026} kr per resa år 2026.`,
      },
      {
        question: "Vilka procentsatser ger X-trafik vid bussförsening?",
        answer: "20 minuter ger 50 %, 40 minuter ger 75 % och 60 minuter eller mer ger 100 %.",
      },
      {
        question: "Hur lång tid har man på sig hos X-trafik?",
        answer: "Ansökan ska lämnas in senast inom 2 månader via webbformulär eller blankett.",
      },
      {
        question: "Gäller reglerna även för X-tåget?",
        answer: "Ja, för sträckor under 150 km gäller samma 20/40/60-minutersregler.",
      },
    ],
  },
  {
    id: "snalltaget",
    slug: "snalltaget",
    name: "Snälltåget",
    shortName: "Snälltåget",
    category: "tag",
    categoryLabel: "Fjärrtåg & Nattåg",
    ruleMode: "eu_rail_over_150km",
    seoTitle: "Snälltåget förseningsersättning 2026 – Regler för dagtåg & nattåg",
    metaDescription:
      "Kolla Snälltågets regler för förseningsersättning 2026. Rätt till 25–50 % från 60 min och särskild 180-minutersregel för nattåg vid avgång.",
    heroSummary:
      "Snälltåget kör långa sträckor (över 15 mil) mellan bl.a. Malmö–Stockholm–Åre/Berlin. Därför gäller EU:s 60/120-minutersgränser – plus en viktig specialregel för nattåg.",
    lawFramework: "EU:s tågpassagerarförordning (sträckor ≥ 150 km)",
    delayThresholdMinutes: 60,
    compensationLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary: "Snälltåget säljer främst enkel- och tur/returbiljetter med fast biljettpris.",
    },
    taxiAndCar: {
      allowedFromMinutes: 60,
      taxiSupported: false,
      taxiNote:
        "På fjärrtåg ≥ 150 km ska du i första hand kontakta Snälltåget/personal för ombokning eller ersättningstrafik vid > 60 min befarad försening, innan du bokar eget alternativ.",
      ownCarSupported: false,
      carNote: "Egen bil ersätts normalt inte på fjärrtåg utan uttryckligt godkännande.",
    },
    deadlineText: "Rekommenderas snarast (normalt inom 2 månader via Min resa)",
    claimUrl: "https://www.snalltaget.se/min-resa",
    claimCtaLabel: "Logga in på Snälltåget Min resa",
    claimInstructions: [
      "Kontrollera ankomsttiden vid din slutdestination (inte bara avgångsförsening).",
      "Vid befarad försening ≥ 60 min kan du välja att avbryta resan med full återbetalning eller fortsätta och söka ersättning.",
      "Logga in på ”Min resa” hos Snälltåget eller mejla vid avbokning innan avresa.",
    ],
    evidenceChecklist: [
      "Bokningsnummer / biljett från Snälltåget",
      "Faktisk ankomsttid till slutstationen",
      "Eventuella godkända utlägg vid lång väntan",
    ],
    pitfalls: [
      "Viktigt om Snälltågets nattåg: Eftersom nattåg ofta hinner köra in tid under natten krävs enligt deras beräkningspraxis ofta mer än 180 minuters försening redan vid avgång för att anta att tåget blir ≥ 60 min sent till slutstationen.",
      "Vid under 60 min försening vid slutstation utgår ingen kontant ersättning.",
    ],
    uniqueGuideNote:
      "Se upp med nattågsregeln: Snälltåget bedömer att nattåg kan köra in tid under resan och tillämpar därför särskild 180-minutersbedömning vid avgång.",
    faqs: [
      {
        question: "Hur många minuter sent måste Snälltåget vara för ersättning?",
        answer:
          "Minst 60 minuter till slutdestinationen. Då får du 25 % av biljettpriset, och från 120 minuter får du 50 %.",
      },
      {
        question: "Vad gäller särskilt för Snälltågets nattåg?",
        answer:
          "Eftersom nattåg har marginal att köra in tid under natten krävs ofta över 180 minuters försening vid avgång för att i förväg bedömas bli minst 60 minuter sen till slutdestinationen.",
      },
      {
        question: "Kan jag avbryta resan och få pengarna tillbaka?",
        answer:
          "Ja, om tåget beräknas bli minst 60 minuter försenat till slutdestinationen har du rätt att avbryta resan och få biljettpriset återbetalat.",
      },
      {
        question: "Var ansöker jag om ersättning från Snälltåget?",
        answer: "Via snalltaget.se/min-resa (eller kundservice/e-post vid avbokning).",
      },
    ],
  },
  {
    id: "vr",
    slug: "vr",
    name: "VR (f.d. MTRX)",
    shortName: "VR",
    category: "tag",
    categoryLabel: "Fjärrtåg",
    ruleMode: "eu_rail_over_150km",
    seoTitle: "VR Snabbtåg förseningsersättning 2026 – Automatisk utbetalning",
    metaDescription:
      "Så funkar förseningsersättning hos VR (f.d. MTRX) 2026: automatisk utbetalning vid direktköp på 25 % vid 60 min och 50 % vid 120 min försening.",
    heroSummary:
      "VR (tidigare MTRX) på sträckan Stockholm–Göteborg betalar ofta ut förseningsersättning automatiskt via Trafikverkets data om du bokat direkt hos VR.",
    lawFramework: "EU:s tågpassagerarförordning (sträcka ≥ 150 km)",
    delayThresholdMinutes: 60,
    compensationLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "Reser du med VR:s pendlarkort, företagsavtal eller har bokat via resebyrå sker utbetalningen inte automatiskt – då behöver du själv skicka in ansökan.",
    },
    taxiAndCar: {
      allowedFromMinutes: 60,
      taxiSupported: false,
      taxiNote:
        "På fjärrsträckor ≥ 150 km ansvarar tågbolaget för ombokning eller ersättningstrafik vid > 60 min försening. Rådfråga alltid VR innan egna utlägg.",
      ownCarSupported: false,
      carNote: "Egen bil ersätts normalt inte på fjärrtåg utan godkännande.",
    },
    deadlineText: "Automatiskt vid direktköp, annars snarast / inom 2 månader",
    claimUrl: "https://vrresa.se/kundservice/forseningsersattning",
    claimCtaLabel: "Gå till VR förseningsersättning",
    claimInstructions: [
      "Har du köpt enkelbiljett direkt i VR:s app/webb? Vänta några dagar – VR kontrollerar Trafikverkets ankomstdata och betalar oftast ut automatiskt.",
      "Har du pendlarkort, företagsbokning eller bokat via resebyrå? Kontakta VR manuellt via vrresa.se.",
    ],
    evidenceChecklist: [
      "Bokningsnummer / biljett från VR",
      "Kontouppgifter (om bokningen gick via tredje part eller pendlarkort)",
    ],
    pitfalls: [
      "Många missar att automatiken bara gäller när du bokat själv direkt på vrresa.se eller i VR:s app – tredjepartsbokningar och pendlarkort kräver manuell kontakt.",
    ],
    uniqueGuideNote:
      "VR betalar i regel ut automatiskt mot Trafikverkets ankomsttider när du köpt biljetten direkt – kontrollera kontot innan du söker i onödan.",
    faqs: [
      {
        question: "Betalar VR ut förseningsersättning automatiskt?",
        answer:
          "Ja, om du bokat biljetten själv via VR:s hemsida eller app sköts ersättningen i regel automatiskt via Trafikverkets data.",
      },
      {
        question: "När måste jag ansöka manuellt hos VR?",
        answer:
          "Om du bokat via resebyrå/agent, reser med företagsavtal eller åker på pendlarkort måste du själv kontakta VR för att lämna kontouppgifter.",
      },
      {
        question: "Hur mycket ger VR vid försening på Stockholm–Göteborg?",
        answer: "60–119 minuter ger 25 % av biljettpriset och 120 minuter eller mer ger 50 %.",
      },
      {
        question: "Gäller VR:s automatik om mitt tåg var 45 minuter sent?",
        answer:
          "Nej, eftersom sträckan Stockholm–Göteborg överstiger 150 km börjar ersättningen först vid 60 minuters försening.",
      },
    ],
  },
  {
    id: "vy-norrtag",
    slug: "vy-norrtag",
    name: "Vy & Norrtåg",
    shortName: "Vy / Norrtåg",
    category: "tag",
    categoryLabel: "Tåg & Nattåg",
    ruleMode: "hybrid_150km",
    seoTitle: "Vy & Norrtåg förseningsersättning 2026 – Regler under & över 15 mil",
    metaDescription:
      "Så fungerar förseningsersättning på Norrtåg och Vy 2026. Rätt nivå beroende på linjelängd (< 15 mil vs ≥ 15 mil) och vart du skickar kravet.",
    heroSummary:
      "I norra Sverige körs både korta regionala sträckor (under 15 mil) och långa nattåg/fjärrsträckor (över 15 mil). Försäljningskanal och linjelängd avgör vart du söker.",
    lawFramework: "Hybrid: Kollektivtrafiklagen (< 150 km) eller EU-förordningen (≥ 150 km)",
    delayThresholdMinutes: 20,
    compensationLadder: REGIONAL_LADDER,
    euRailLadder: EU_RAIL_LADDER,
    periodTicketRule: {
      summary:
        "För regionala periodkort beräknas schablon per resa utifrån utfärdande länstrafik/Norrtåg-villkor.",
    },
    taxiAndCar: {
      allowedFromMinutes: 20,
      taxiSupported: true,
      taxiNote:
        "På regionala resor < 15 mil kan alternativ transport ersättas vid risk för > 20 min försening; på långa fjärr-/nattågssträckor ska operatören ordna ombokning/ersättningstrafik.",
      ownCarSupported: true,
      ownCarPerMilKr: OWN_CAR_KR_PER_MIL,
      carNote: "Kontakta alltid kundtjänst/tågpersonal på sträckor i Norrland innan dyr taxi bokas på egen hand.",
    },
    deadlineText: "Inom 2 månader hos säljkanalen (t.ex. Norrtåg, SJ eller Resplus)",
    claimUrl: "https://norrtag.se/kundservice/",
    claimCtaLabel: "Norrtåg kundservice & ersättning",
    claimInstructions: [
      "Kontrollera vem du köpte biljetten av (t.ex. Norrtåg, SJ, Vy eller Resplus).",
      "Kontrollera om tågets totala linje är kortare eller längre än 15 mil.",
      "Skicka ansökan med biljettnummer inom 2 månader.",
    ],
    evidenceChecklist: [
      "Bokningsnummer / biljett och uppgift om säljkanal",
      "Datum, tågnummer och försening till slutdestination",
    ],
    pitfalls: [
      "Norrtåg-biljetter som köpts via SJ eller med Resplus ska ofta reklameras via SJ/Resplus snarare än lokalt formulär.",
    ],
    uniqueGuideNote:
      "På Vy Nattåg och långa Norrtågslinjer är linjen nästan alltid ≥ 15 mil (60/120 min), medan kortare lokalpendel faller under 20-minutersregeln.",
    faqs: [
      {
        question: "Vart vänder jag mig om Norrtåg blir försenat?",
        answer:
          "Till den försäljningskanal där du köpte biljetten (t.ex. Norrtåg/kundservice, SJ eller Resplus vid kombinationsbiljett).",
      },
      {
        question: "Gäller 20 minuter eller 60 minuter på Vy / Norrtåg?",
        answer:
          "Det avgörs av tågets totala sträcka: under 150 km ger ersättning från 20 min (50–100 %), medan sträckor på 150 km eller mer ger 25 % vid 60 min och 50 % vid 120 min.",
      },
      {
        question: "Vad gäller om nattåget med Vy norrut blir kraftigt försenat?",
        answer:
          "Vid ≥ 60 min befarad försening har du rätt till ombokning/alternativ transport ordnad av bolaget, måltid/förfriskningar efter väntetid och prisavdrag (25 % / 50 %).",
      },
      {
        question: "Hur lång tid har jag på mig att söka?",
        answer: "Normalt senast inom 2 månader efter resdagen.",
      },
    ],
  },
  {
    id: "sas",
    slug: "sas",
    name: "SAS (Scandinavian Airlines)",
    shortName: "SAS",
    category: "flyg",
    categoryLabel: "Flyg · EU 261",
    ruleMode: "eu261_flight",
    seoTitle: "SAS förseningsersättning 2026 (EU 261) – 250 till 600 EUR direkt utan ombud",
    metaDescription:
      "Räkna ut SAS förseningsersättning enligt EU 261/2004. Få 250, 400 eller 600 EUR utan att ge bort 30 % till ombud. Se HD:s 2-månadersregel och direktlänk.",
    heroSummary:
      "SAS omfattas alltid av EU 261/2004. Du behöver aldrig betala ett ombud 25–35 % i provision i första steget – sök gratis direkt hos SAS och behåll hela beloppet.",
    lawFramework: "EU-förordning 261/2004 + svensk reklamationsplikt (NJA 2018 s. 127)",
    delayThresholdMinutes: 180,
    compensationLadder: EU261_FLIGHT_LADDER,
    periodTicketRule: {
      summary: "Schablonersättningen (250–600 EUR) är densamma oavsett vad SAS-biljetten kostade (gäller även Youth/bonusresor).",
    },
    taxiAndCar: {
      allowedFromMinutes: 120,
      taxiSupported: true,
      taxiNote:
        "Efter > 2 timmars försening har du rätt till mat & dryck i proportion till väntetiden, samt hotell och transfer mellan flygplats/hotell om övernattning krävs – även vid dåligt väder!",
      ownCarSupported: false,
      carNote: "Hotell/mat betalas ut mot skäliga originalkvitton via SAS claim-formulär.",
    },
    deadlineText: "Reklamera inom 2 månader (NJA 2018 s. 127) • 10 års preskription i Sverige",
    claimUrl: "https://www.flysas.com/se-sv/hjalp-och-kontakt/",
    claimCtaLabel: "Sök gratis direkt hos SAS",
    claimInstructions: [
      "Skriv ner exakt klockslag när flygplansdörren öppnades på ankomstflygplatsen (det är dörröppningen som räknas, inte landningen).",
      "Gå till SAS Hjälp & kontakt -> Claims / Försenat eller inställt flyg och fyll i PNR (bokningsnummer).",
      "Skicka kravet inom 2 månader från flygningen så uppfyller du alltid Högsta domstolens krav på skälig tid.",
    ],
    evidenceChecklist: [
      "6-teckens bokningsreferens (PNR) och flightnummer (t.ex. SK1420)",
      "Boardingkort eller bokningsbekräftelse",
      "Originalkvitton på skälig mat, dryck eller hotell om SAS inte delade ut vouchers",
    ],
    pitfalls: [
      "Många svenska resenärer tror att de har flera år på sig att vänta med första mailet – enligt Högsta domstolen (NJA 2018 s. 127) måste du reklamera inom skälig tid (2 månader anses alltid i tid).",
      "Tekniska fel på planet och intern SAS-personalstrejk räknas INTE som extraordinära omständigheter – du ska alltså kräva dina 250–600 EUR!",
      "Schablonersättningen gäller även om du köpte biljetten billigt på rea eller med EuroBonus-poäng.",
    ],
    uniqueGuideNote:
      "SAS har även ett särskilt ”Flight Delay Certificate”-formulär om du dessutom ska begära ersättning ur din reseförsäkring/hemförsäkring/kortförsäkring.",
    faqs: [
      {
        question: "Hur mycket får jag om mitt SAS-flyg är mer än 3 timmar försenat?",
        answer:
          "250 EUR (upp till 1 500 km), 400 EUR (> 1 500 km inom EU/EES eller 1 500–3 500 km) eller 600 EUR (> 3 500 km utanför EU). Beloppet gäller per betalande passagerare.",
      },
      {
        question: "Gäller ersättningen även om jag flög på EuroBonus-biljett?",
        answer: "Ja, EU 261/2004 gäller fullt ut även för poäng-/bonusresor och billiga kampanjbiljetter.",
      },
      {
        question: "Måste jag reklamera inom 2 månader till SAS?",
        answer:
          "I Sverige slog Högsta domstolen (NJA 2018 s. 127) fast att du måste reklamera inom skälig tid – inom 2 månader är alltid i rätt tid. Därefter gäller 10 års preskription.",
      },
      {
        question: "Räknas tekniskt fel som extraordinär omständighet?",
        answer:
          "Nej! EU-domstolen har upprepade gånger slagit fast att vanliga tekniska fel och intern flygbolagsstrejk ligger inom flygbolagets kontroll och ger rätt till ersättning.",
      },
    ],
  },
  {
    id: "norwegian",
    slug: "norwegian",
    name: "Norwegian",
    shortName: "Norwegian",
    category: "flyg",
    categoryLabel: "Flyg · EU 261",
    ruleMode: "eu261_flight",
    seoTitle: "Norwegian förseningsersättning 2026 – Regler, EU 261 & gratis ansökan",
    metaDescription:
      "Räkna ut Norwegian förseningsersättning 2026 (250–600 EUR). Sök direkt via Norwegians eget reklamationsformulär utan ombudsavgifter.",
    heroSummary:
      "Norwegian följer EU 261/2004 på alla avgångar från Sverige/EES och på ankomster till EES med Norwegian. Ansök gratis via deras digitala reklamationsformulär.",
    lawFramework: "EU/EES-förordning 261/2004 + svensk 2-månadersreklamation",
    delayThresholdMinutes: 180,
    compensationLadder: EU261_FLIGHT_LADDER,
    periodTicketRule: {
      summary: "Fast belopp (250–600 EUR) per passagerare oavsett vad LowFare-biljetten kostade.",
    },
    taxiAndCar: {
      allowedFromMinutes: 120,
      taxiSupported: true,
      taxiNote:
        "Vid väntetid över 2 timmar har du rätt till skälig mat och dryck (och hotell + transport om du måste vänta över natten). Spara kvitton om vouchers inte delas ut.",
      ownCarSupported: false,
      carNote: "Rimliga utlägg söks i kategorin ”Ticket refund or other expenses”.",
    },
    deadlineText: "Reklamera inom 2 månader i Sverige • 10 års preskription om reklamerat i tid",
    claimUrl: "https://www.norwegian.com/uk/ip/customer-service/contact-us/claim-or-feedback/",
    claimCtaLabel: "Sök direkt hos Norwegian",
    claimInstructions: [
      "Välj ”Delay or cancellation” för EU 261-kompensation (och ”other expenses” för mat/hotellkvitton).",
      "Fyll i bokningsreferens, datum, flightnummer (t.ex. D8 / DY) och krav enligt EU 261/2004.",
      "Spara bekräftelsemailet med ärendenummer.",
    ],
    evidenceChecklist: [
      "Bokningsreferens och flightnummer (DY / D8)",
      "Faktisk ankomsttid när dörren öppnades",
      "Kvitton på nödvändig mat, dryck eller hotell",
    ],
    pitfalls: [
      "Blanda inte ihop ”CashPoints” med kontant ersättning – enligt EU 261 har du alltid rätt till utbetalning i pengar (banköverföring) om du inte frivilligt tackar ja till vouchers.",
      "Sök inom 2 månader från resan för att vara helt skyddad enligt svensk rättspraxis.",
    ],
    uniqueGuideNote:
      "Acceptera aldrig bara CashPoints eller värdecheck om du vill ha riktiga pengar – EU 261 ger dig rätt till kontant bankutbetalning.",
    faqs: [
      {
        question: "Måste jag ta emot Norwegian CashPoints i stället för pengar?",
        answer:
          "Nej! EU 261/2004 ger dig rätt till utbetalning i pengar via banköverföring. Du behöver bara acceptera vouchers/CashPoints om du själv skriftligen går med på det.",
      },
      {
        question: "Vad får jag om mitt Norwegian-flyg till Alicante blir över 3 timmar sent?",
        answer:
          "Flyg inom EU/EES över 1 500 km (som Sverige–Spanien) ger normalt 400 EUR per passagerare vid > 3 timmars försening eller sent inställt flyg.",
      },
      {
        question: "Gäller EU 261 på Norwegian-biljetter med LowFare utan bagage?",
        answer: "Ja, biljettklass eller lågpriser påverkar inte din lagstadgade EU 261-ersättning.",
      },
      {
        question: "Vad gör jag om Norwegian skyller på extraordinära omständigheter?",
        answer:
          "Be dem specificera exakt händelse (t.ex. om just ditt plan drabbades av väder/flygledarrestriktioner eller om felet bara var ett tekniskt fel på flygplanet). Du kan också anmäla gratis till ARN.",
      },
    ],
  },
  {
    id: "ryanair",
    slug: "ryanair",
    name: "Ryanair",
    shortName: "Ryanair",
    category: "flyg",
    categoryLabel: "Flyg · EU 261",
    ruleMode: "eu261_flight",
    seoTitle: "Ryanair förseningsersättning 2026 – Behåll 100 % & klara ID-kravet",
    metaDescription:
      "Få 250–400 EUR från Ryanair vid > 3 timmars försening eller inställt flyg. Se hur du ansöker direkt på help.ryanair.com och klarar deras ID-verifiering.",
    heroSummary:
      "Ryanair använder egen EU261-portal och kräver identitetsverifiering (pass/ID) för att du ska söka direkt – men det gör att du behåller hela ersättningen utan ombud.",
    lawFramework: "EU-förordning 261/2004 + svensk reklamation inom 2 månader",
    delayThresholdMinutes: 180,
    compensationLadder: EU261_FLIGHT_LADDER,
    periodTicketRule: {
      summary: "250–600 EUR per passagerare oavsett om biljetten kostade 199 kr.",
    },
    taxiAndCar: {
      allowedFromMinutes: 120,
      taxiSupported: true,
      taxiNote:
        "Ryanair är skyldigt att stå för mat, dryck (> 2 timmar) samt hotell + transfer vid nattförsening, även vid oväder. Spara specificerade kvitton.",
      ownCarSupported: false,
      carNote: "Utlägg söks separat via Ryanairs utläggsformulär med originalkvitton.",
    },
    deadlineText: "Reklamera inom 2 månader från Sverige • Spara PNR + kvitton",
    claimUrl: "https://help.ryanair.com/",
    claimCtaLabel: "Öppna Ryanair Help Centre",
    claimInstructions: [
      "Gå till help.ryanair.com -> Cancelled, Delayed and Rescheduled Flights -> EU261 Disruption Compensation.",
      "Ha bokningsnummer (PNR) samt ditt pass eller nationella ID-kort redo (Ryanair kräver verifiering att du faktiskt var en av passagerarna i bokningen).",
      "Skicka ansökan direkt till Ryanair först – betala inte ett ombud i onödan.",
    ],
    evidenceChecklist: [
      "Ryanair PNR och flightnummer (t.ex. FR...)",
      "Pass eller nationellt ID-kort för ID-verifieringen",
      "Eventuella kvitton på mat/hotell om flighten blev > 2 timmar försenad",
    ],
    pitfalls: [
      "Ryanair kräver ofta pass-/ID-verifiering av dig som bokare för att släppa igenom direktansökan (ett sätt att motverka tredjepartsombud) – gör det i lugn och ro med rätt dokument.",
      "Skriv ut/spara skärmdumpar av formuläret när du skickar in.",
    ],
    uniqueGuideNote:
      "Att Ryanair-biljetten kanske bara kostade 249 kr spelar ingen roll: blir du > 3 timmar sen till London eller Malaga är ersättningen ändå 250 respektive 400 EUR.",
    faqs: [
      {
        question: "Kan jag få 250 eller 400 EUR även om Ryanair-biljetten bara kostade 200 kr?",
        answer:
          "Ja! Ersättningen enligt EU 261/2004 styrs av flygsträckan och förseningstiden, aldrig av biljettpriset.",
      },
      {
        question: "Varför ber Ryanair om pass eller ID när jag ansöker?",
        answer:
          "Ryanair använder dokumentverifiering i sitt formulär för att bekräfta att du själv är passageraren i bokningen.",
      },
      {
        question: "Måste man betala ett flygombud för att få pengar från Ryanair?",
        answer:
          "Nej, försök alltid själv först via help.ryanair.com så behåller du 100 % av ersättningen.",
      },
      {
        question: "Vad gör jag om Ryanair nekar mitt krav trots tekniskt fel?",
        answer:
          "Bestrid svaret skriftligen eller anmäl ärendet kostnadsfritt till Allmänna reklamationsnämnden (ARN) om resan gällde från/till Sverige, eller överväg ett ombud om du inte vill driva det vidare själv.",
      },
    ],
  },
  {
    id: "eu261-alla-flyg",
    slug: "eu261-alla-flyg",
    name: "Alla flygbolag (EU 261/2004)",
    shortName: "Alla flygbolag",
    category: "flyg",
    categoryLabel: "Flyg · EU 261",
    ruleMode: "eu261_flight",
    seoTitle: "Flygersättning EU 261/2004 kalkylator 2026 – Alla flygbolag i Sverige",
    metaDescription:
      "Kolla dina flygrättigheter enligt EU 261/2004 för alla flygbolag (Lufthansa, KLM, Finnair, Wizz Air, TUI m.fl.). 250–600 EUR, mat & hotell och HD:s 2-månadersregel.",
    heroSummary:
      "EU 261/2004 gäller på ALLA flyg som avgår från en flygplats i EU/EES/Storbritannien (oavsett flygbolag) samt på flyg IN till EU/EES med ett EU-flygbolag.",
    lawFramework: "EU-förordning 261/2004 + svensk reklamation (NJA 2018 s. 127)",
    delayThresholdMinutes: 180,
    compensationLadder: EU261_FLIGHT_LADDER,
    periodTicketRule: {
      summary: "Gäller lika mycket för reguljärflyg som för charter (t.ex. TUI, Apollo, Sunclass).",
    },
    taxiAndCar: {
      allowedFromMinutes: 120,
      taxiSupported: true,
      taxiNote:
        "Rätt till förplägning (mat/dryck) inträder efter 2–4 timmars försening vid avgång beroende på distans, plus hotell om resan skjuts upp till nästa dag.",
      ownCarSupported: false,
      carNote: "Utlägg söks med originalkvitton direkt hos respektive flygbolag.",
    },
    deadlineText: "Reklamera inom 2 månader från resan (10 års preskription i Sverige)",
    claimUrl: "https://www.konsumentverket.se/",
    claimCtaLabel: "Konsumentverket om flygrättigheter",
    claimInstructions: [
      "Kontrollera att ditt flyg avgick från EU/EES eller flögs av ett EU/EES-bolag till EU.",
      "Sök upp flygbolagets eget EU 261-formulär på deras webbplats eller använd vår reklamationsmall.",
      "Om flygbolaget säger nej eller inte svarar inom 6–8 veckor: anmäl kostnadsfritt till ARN (Allmänna reklamationsnämnden).",
    ],
    evidenceChecklist: [
      "Bokningsnummer (PNR) och e-ticketnummer",
      "Ankomsttid vid slutdestinationen (inklusive missad anslutning på samma bokning)",
      "Skärmdumpar på SMS/e-post om inställt flyg eller försening + kvitton på mat/hotell",
    ],
    pitfalls: [
      "Missade du en anslutning i t.ex. Frankfurt eller Amsterdam och blev > 3 timmar sen till slutdestinationen räknas HELA sträckan från Sverige till slutdestinationen – om allt låg på samma bokning.",
      "Bokade du två separata biljetter själv ansvarar inte flygbolag 1 för missat flyg 2.",
    ],
    uniqueGuideNote:
      "Även charterresenärer (TUI, Ving, Apollo) och resenärer med missat byte på samma bokning har full rätt till 250–600 EUR enligt EU 261/2004.",
    faqs: [
      {
        question: "Gäller EU 261 om jag missade ett anslutningsflyg?",
        answer:
          "Ja! Så länge alla delsträckor ligger på samma sammanhängande bokning (samma PNR) är det ankomsttiden till din allra sista slutdestination som räknas.",
      },
      {
        question: "Gäller ersättningen för paketresor och charter?",
        answer:
          "Ja, EU 261/2004 gäller även charterflyg, och schablonersättningen krävs normalt direkt från det utförande flygbolaget.",
      },
      {
        question: "Vad räknas som ankomsttid vid försening?",
        answer:
          "Enligt EU-domstolen räknas det ögonblick då minst en av flygplanets dörrar öppnas så att passagerarna kan gå ut – inte när hjulen tar mark.",
      },
      {
        question: "Vad gör jag om flygbolaget vägrar betala?",
        answer:
          "I Sverige kan du anmäla kostnadsfritt till Allmänna reklamationsnämnden (ARN), eller använda vår reklamationsmall för att bestrida hänvisningen till extraordinära omständigheter.",
      },
    ],
  },
];

export const TRANSIT_OPERATORS = OPERATORS.filter((op) => op.category !== "flyg");
export const FLIGHT_OPERATORS = OPERATORS.filter((op) => op.category === "flyg");

export function getOperatorBySlug(slug: string): OperatorProfile | undefined {
  return OPERATORS.find((op) => op.slug === slug);
}
