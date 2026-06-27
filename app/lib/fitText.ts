import {
  DESC_PX_DESIGN,
  MOBILE_BALL_SIZE_BASE,
  MOBILE_DESC_BALL_GAP_BASE,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  MOBILE_FINAL_LINE_W_BASE,
  scalePx,
  TITLE_PX_DESIGN,
} from "@/app/lib/scale";

const BLACK_TITLE_LINES = [
  "Gute Entscheidungen",
  "scheitern nicht an zu",
  "wenig Daten.",
] as const;

const PURPLE_TITLE_LINES = [
  "Sondern an fehlender",
  "Klarheit, Struktur",
  "und",
  "Nachvollziehbarkeit.",
] as const;

const MOBILE_PURPLE_TITLE_LINES = [
  "Sondern an fehlender",
  "Klarheit, Struktur",
  "und",
  "Nachvollziehbarkeit.",
] as const;

const DESCRIPTION_LINES = [
  "Wir ermöglichen Entscheidungen unter Risiko und",
  "Ungewissheit – damit Teams auch dann sicher",
  "entscheiden, wenn es keine eindeutige Antwort gibt.",
] as const;

const MOBILE_DESCRIPTION_LINES = [
  "Wir ermöglichen Entscheidungen",
  "unter Risiko und Ungewissheit –",
  "damit Teams auch dann sicher",
  "entscheiden, wenn es keine",
  "eindeutige Antwort gibt.",
] as const;

const RISIKO_BODY_LINES = [
  "Wenn Wahrscheinlichkeiten bekannt sind, entscheiden Daten. Wir",
  "machen komplexe Informationen verständlich, nachvollziehbar",
  "und regulatorisch belastbar – damit datenbasierte",
  "Entscheidungen wirklich tragfähig sind.",
] as const;

const MOBILE_RISIKO_BODY_LINES = [
  "Wenn Wahrscheinlichkeiten bekannt sind,",
  "entscheiden Daten. Wir machen komplexe",
  "Informationen verständlich, nachvollziehbar",
  "und regulatorisch belastbar – damit",
  "datenbasierte Entscheidungen wirklich",
  "tragfähig sind.",
] as const;

const ENTSCHEIDUNG_HEADLINE_LINES = [
  "Das Problem ist nicht fehlendes Wissen,",
  "sondern die Qualität der Entscheidung.",
] as const;

const ENTSCHEIDUNG_MOBILE_HEADLINE_FIT_LINES = [
  "Das Problem ist nicht",
  "fehlendes Wissen,",
  "sondern die Qualität",
  "der Entscheidung.",
] as const;

const WAS_ANDERS_TITLE = "Was anders wird mit uns" as const;

const WAS_ANDERS_BULLETS = [
  [
    "Entscheidungen werden",
    "nachvollziehbar - auch wenn KI im",
    "Spiel ist",
  ],
  [
    "Komplexität steht Entscheidungen",
    "nicht mehr im Weg",
  ],
  [
    "Erfahrung wird zugänglich -",
    "unabhängig von Einzelpersonen",
  ],
  [
    "Entscheidungen werden",
    "getroffen, auch wenn noch nicht",
    "alles klar ist",
  ],
] as const;

const ENTSCHEIDBAR_TITLE_LINES = [
  "Wir machen Entscheidungen",
  "entscheidbar",
] as const;

const TEAM_TITLE_LINES = [
  "Ein Team aus international",
  "renommierten Experten aus",
  "Wissenschaft und Praxis",
] as const;

const TEAM_FOOTER_TEXT =
  "Basierend auf jahrzehntelanger, wissenschaftlicher Arbeit." as const;

const FOOTER_HEADLINE_LINES = [
  "Menschliche Urteilskraft, klare Entscheidungslogik",
  "und transparente KI - für weiterhin gute",
  "Entscheidungen",
] as const;

const FOOTER_CONTACT = {
  company: "SIMPLY RATIONAL GmbH",
  address: "Alte Brauerei 14 | 10965 Berlin | Germany",
  email: "GuteEntscheidung@simplyrational.de",
  phones: [
    { name: "Philipp", number: "+49 162 269 026 2" },
    { name: "Susanne", number: "+49 176 400 566 76" },
  ],
} as const;

const TEAM_MEMBERS = [
  {
    image: "/gerd_gigerenzer.svg",
    width: 400,
    height: 345,
    role: "Prof. Dr.",
    name: "Gerd Gigerenzer",
  },
  {
    image: "/florian_artinger.svg",
    width: 411,
    height: 345,
    role: "Prof. Dr.",
    name: "Florian Artinger",
  },
  {
    image: "/susanne_jung.svg",
    width: 411,
    height: 345,
    role: "Dipl. Andragogin, M.A.",
    name: "Susanne Jung",
  },
  {
    image: "/philip_leipold.svg",
    width: 412,
    height: 345,
    role: "Dipl. Psychologe",
    name: "Philipp Leipold",
  },
] as const;

const ENTSCHEIDBAR_ICON_REF_MAX = 155;

const entIconScale = (viewBoxW: number, viewBoxH: number) =>
  Math.max(viewBoxW, viewBoxH) / ENTSCHEIDBAR_ICON_REF_MAX;

const ENTSCHEIDBAR_BRANCHES = [
  {
    side: "left" as const,
    text: "Investitionen werden klar entschieden - statt subjektiv",
    icon: "/icon_1.svg",
    lineAnchorY: 78.5 / 155,
    iconVisualScale: entIconScale(155, 155),
  },
  {
    side: "right" as const,
    text: "Risiken werden klar erkannt und bewertet",
    icon: "/icon_2.svg",
    lineAnchorY: 166.339 / 265,
    iconVisualScale: entIconScale(198, 265),
  },
  {
    side: "left" as const,
    text: "Strategie wird klar und umsetzbar",
    icon: "/icon_3.svg",
    lineAnchorY: 76.7932 / 165,
    iconVisualScale: entIconScale(141, 165),
  },
  {
    side: "right" as const,
    text: "Potenziale werden aus Unsicherheit sichtbar",
    icon: "/icon_4.svg",
    lineAnchorY: 121.402 / 183,
    iconVisualScale: entIconScale(140, 183),
  },
  {
    side: "left" as const,
    text: "Governance wird wirksam",
    icon: "/icon_5.svg",
    lineAnchorY: 65.5 / 143,
    iconVisualScale: entIconScale(143, 143),
  },
] as const;

const UNGEWISSHEIT_BODY_LINES = [
  "Wenn Zukunft nicht berechenbar ist, braucht es menschliche",
  "Urteilskraft.",
  "Wir schaffen Strukturen, damit Erfahrung, Intuition und Wissen",
  "klar genutzt werden können.",
] as const;

const REFERENCE_SIZE = TITLE_PX_DESIGN;
const DESC_REFERENCE_SIZE = DESC_PX_DESIGN;

function measureLongestTitleLine(
  lines: readonly string[],
  fontFamily: string,
): { text: string; widthAtReference: number } {
  if (typeof document === "undefined") {
    return { text: lines[0], widthAtReference: lines[0].length * 36 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { text: lines[0], widthAtReference: lines[0].length * 36 };
  }

  let longest = lines[0];
  let maxWidth = 0;

  for (const line of lines) {
    ctx.font = `800 ${REFERENCE_SIZE}px ${fontFamily}, serif`;
    const width = ctx.measureText(line).width;
    if (width > maxWidth) {
      maxWidth = width;
      longest = line;
    }
  }

  return { text: longest, widthAtReference: maxWidth };
}

function measureLongestHeadlineLine(
  lines: readonly string[],
  fontFamily: string,
  referenceSize: number,
): { text: string; widthAtReference: number } {
  if (typeof document === "undefined") {
    return { text: lines[0], widthAtReference: lines[0].length * 36 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { text: lines[0], widthAtReference: lines[0].length * 36 };
  }

  let longest = lines[0];
  let maxWidth = 0;

  for (const line of lines) {
    ctx.font = `800 ${referenceSize}px ${fontFamily}, serif`;
    const width = ctx.measureText(line).width;
    if (width > maxWidth) {
      maxWidth = width;
      longest = line;
    }
  }

  return { text: longest, widthAtReference: maxWidth };
}

export function fitHeadlineFontSize(
  maxWidth: number,
  viewportCap: number,
  fontFamily: string,
  lines: readonly string[],
  minPx = 10,
  maxPx = REFERENCE_SIZE,
): number {
  if (maxWidth <= 0) {
    return Math.max(minPx, Math.min(maxPx, viewportCap));
  }

  const { widthAtReference } = measureLongestHeadlineLine(
    lines,
    fontFamily,
    maxPx,
  );
  const widthRatio = widthAtReference / maxPx;
  const fitPx = Math.floor(maxWidth / widthRatio);

  return Math.max(minPx, Math.min(maxPx, viewportCap, fitPx));
}

export function fitTitleFontSize(
  maxWidth: number,
  viewportCap: number,
  fontFamily: string,
  minPx = 10,
  maxPx = REFERENCE_SIZE,
): number {
  if (maxWidth <= 0) {
    return Math.max(minPx, Math.min(maxPx, viewportCap));
  }

  const allLines = [...BLACK_TITLE_LINES, ...PURPLE_TITLE_LINES];
  const { widthAtReference } = measureLongestTitleLine(allLines, fontFamily);
  const widthRatio = widthAtReference / REFERENCE_SIZE;
  const fitPx = Math.floor(maxWidth / widthRatio);

  return Math.max(minPx, Math.min(maxPx, viewportCap, fitPx));
}

function measureLongestDescriptionLine(
  lines: readonly string[],
  fontFamily: string,
  fontWeight = 500,
): { text: string; widthAtReference: number } {
  if (typeof document === "undefined") {
    const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), lines[0]);
    return { text: longest, widthAtReference: longest.length * 14 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), lines[0]);
    return { text: longest, widthAtReference: longest.length * 14 };
  }

  let longest = lines[0];
  let maxWidth = 0;

  for (const line of lines) {
    ctx.font = `${fontWeight} ${DESC_REFERENCE_SIZE}px ${fontFamily}, sans-serif`;
    const width = ctx.measureText(line).width;
    if (width > maxWidth) {
      maxWidth = width;
      longest = line;
    }
  }

  return { text: longest, widthAtReference: maxWidth };
}

export function fitDescriptionFontSize(
  maxWidth: number,
  viewportCap: number,
  fontFamily: string,
  lines: readonly string[] = DESCRIPTION_LINES,
  minPx = 10,
  maxPx = DESC_REFERENCE_SIZE,
  fontWeight = 500,
): number {
  if (maxWidth <= 0) {
    return Math.max(minPx, Math.min(maxPx, viewportCap));
  }

  const { widthAtReference } = measureLongestDescriptionLine(
    lines,
    fontFamily,
    fontWeight,
  );
  const widthRatio = widthAtReference / DESC_REFERENCE_SIZE;
  const fitPx = Math.floor(maxWidth / widthRatio);

  return Math.max(minPx, Math.min(maxPx, viewportCap, fitPx));
}

// Shared mobile description/body font size. Mirrors the Hero's mobile
// description fit exactly so every section's body text renders at the same px.
export function fitMobileBodyFontPx(
  viewportW: number,
  fontFamily: string,
): number {
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const descContentWidth = Math.max(
    40,
    viewportW -
      scalePx(MOBILE_FINAL_LINE_W_BASE, mobileScale, 36) -
      scalePx(MOBILE_BALL_SIZE_BASE, mobileScale, 24) -
      scalePx(MOBILE_DESC_BALL_GAP_BASE, mobileScale, 8) -
      viewportW * 0.05,
  );

  return fitDescriptionFontSize(
    descContentWidth,
    MOBILE_DESC_PX_DESIGN,
    fontFamily,
    MOBILE_DESCRIPTION_LINES,
    10,
    MOBILE_DESC_PX_DESIGN,
  );
}

export function measureDescriptionHeight(
  lineCount: number,
  fontSize: number,
  lineHeightRatio: number,
): number {
  return lineCount * fontSize * lineHeightRatio;
}

export {
  BLACK_TITLE_LINES,
  DESCRIPTION_LINES,
  MOBILE_DESCRIPTION_LINES,
  MOBILE_PURPLE_TITLE_LINES,
  ENTSCHEIDBAR_BRANCHES,
  ENTSCHEIDBAR_TITLE_LINES,
  ENTSCHEIDUNG_HEADLINE_LINES,
  ENTSCHEIDUNG_MOBILE_HEADLINE_FIT_LINES,
  PURPLE_TITLE_LINES,
  MOBILE_RISIKO_BODY_LINES,
  RISIKO_BODY_LINES,
  TEAM_FOOTER_TEXT,
  FOOTER_CONTACT,
  FOOTER_HEADLINE_LINES,
  TEAM_MEMBERS,
  TEAM_TITLE_LINES,
  UNGEWISSHEIT_BODY_LINES,
  WAS_ANDERS_BULLETS,
  WAS_ANDERS_TITLE,
};
