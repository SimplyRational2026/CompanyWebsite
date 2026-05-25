import { DESC_PX_DESIGN, TITLE_PX_DESIGN } from "@/app/lib/scale";

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

const DESCRIPTION_LINES = [
  "Wir ermöglichen Entscheidungen unter Risiko und",
  "Ungewissheit – damit Teams auch dann sicher",
  "entscheiden, wenn es keine eindeutige Antwort gibt.",
] as const;

const RISIKO_BODY_LINES = [
  "Wenn Wahrscheinlichkeiten bekannt sind, entscheiden Daten. Wir",
  "machen komplexe Informationen verständlich, nachvollziehbar",
  "und regulatorisch belastbar – damit datenbasierte",
  "Entscheidungen wirklich tragfähig sind.",
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
    ctx.font = `500 ${DESC_REFERENCE_SIZE}px ${fontFamily}, sans-serif`;
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
): number {
  if (maxWidth <= 0) {
    return Math.max(minPx, Math.min(maxPx, viewportCap));
  }

  const { widthAtReference } = measureLongestDescriptionLine(lines, fontFamily);
  const widthRatio = widthAtReference / DESC_REFERENCE_SIZE;
  const fitPx = Math.floor(maxWidth / widthRatio);

  return Math.max(minPx, Math.min(maxPx, viewportCap, fitPx));
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
  PURPLE_TITLE_LINES,
  RISIKO_BODY_LINES,
  UNGEWISSHEIT_BODY_LINES,
};
