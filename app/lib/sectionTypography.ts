import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import {
  fitDescriptionFontSize,
  fitHeadlineFontSize,
  RISIKO_BODY_LINES,
  UNGEWISSHEIT_BODY_LINES,
} from "@/app/lib/fitText";
import {
  DESC_PX_DESIGN,
  DESIGN_WIDTH,
  EXCLAMATION_W_BASE,
  EXCLAMATION_H_BASE,
  QUESTION_H_BASE,
  QUESTION_W_BASE,
  SECTION_TITLE_ENTER_PX_DESIGN,
  SECTION_TITLE_PX_DESIGN,
  WAS_HUB_BULLET_MAX_W_BASE,
  WAS_HUB_COLUMN_GAP_BASE,
  WAS_HUB_RING_SIZE_BASE,
  scalePx,
} from "@/app/lib/scale";

const EXCLAMATION_MARK_W_BASE = Math.round(
  EXCLAMATION_W_BASE * (QUESTION_H_BASE / EXCLAMATION_H_BASE),
);

/** Shared mark reservation so Risiko + Ungewissheit get identical text column width. */
export const SECTION_MARK_W_BASE = Math.max(
  EXCLAMATION_MARK_W_BASE,
  QUESTION_W_BASE,
);

const SECTION_BODY_FIT_LINES = [
  ...RISIKO_BODY_LINES,
  ...UNGEWISSHEIT_BODY_LINES,
] as const;

export function sectionTextMaxW(viewportW: number): number {
  const preScale = Math.min(1, viewportW / DESIGN_WIDTH);
  const horizontalPad = viewportW * 0.06 * 2;
  const layoutGaps = viewportW * 0.14;
  const preMarkW = scalePx(SECTION_MARK_W_BASE, preScale, 24);

  return Math.max(
    80,
    Math.floor(viewportW - horizontalPad - layoutGaps - preMarkW),
  );
}

export function sectionViewportDescCap(viewportW: number): number {
  return Math.round(viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH));
}

export function fitSectionBodyFontPx(
  viewportW: number,
  fontFamily: string,
): number {
  return fitDescriptionFontSize(
    sectionTextMaxW(viewportW),
    sectionViewportDescCap(viewportW),
    fontFamily,
    SECTION_BODY_FIT_LINES,
    10,
    DESC_PX_DESIGN,
  );
}

export function sectionContentScale(bodyFontPx: number): number {
  return bodyFontPx / DESC_PX_DESIGN;
}

export function sectionTitleRestPx(contentScale: number): number {
  return scalePx(SECTION_TITLE_PX_DESIGN, contentScale, 28);
}

export function sectionTitleLargePx(contentScale: number): number {
  return scalePx(SECTION_TITLE_ENTER_PX_DESIGN, contentScale, 40);
}

export function fitSectionHeadlineFontPx(
  viewportW: number,
  fontFamily: string,
  lines: readonly string[],
  designPx: number,
  bodyFontPx: number,
): number {
  const contentScale = sectionContentScale(bodyFontPx);
  const scaledPx = scalePx(designPx, contentScale, 28);
  const viewportCap = Math.round(viewportW * (designPx / DESIGN_WIDTH));

  return fitHeadlineFontSize(
    sectionTextMaxW(viewportW),
    viewportCap,
    fontFamily,
    lines,
    10,
    scaledPx,
  );
}

export function sectionAvailableWidth(viewportW: number): number {
  const horizontalPad = viewportW * 0.06 * 2;
  return Math.max(200, Math.floor(viewportW - horizontalPad));
}

export function fitWasHubLayout(
  contentScale: number,
  viewportW: number,
): {
  ringSize: number;
  hubColumnGap: number;
  bulletMaxW: number;
  hubGridW: number;
} {
  const availableW = sectionAvailableWidth(viewportW);
  let ringSize = scalePx(WAS_HUB_RING_SIZE_BASE, contentScale, 80);
  let hubColumnGap = scalePx(WAS_HUB_COLUMN_GAP_BASE, contentScale, 16);
  let bulletMaxW = scalePx(WAS_HUB_BULLET_MAX_W_BASE, contentScale, 80);

  let hubGridW = bulletMaxW * 2 + ringSize + hubColumnGap * 2;
  if (hubGridW > availableW) {
    const shrink = availableW / hubGridW;
    ringSize = Math.max(72, Math.round(ringSize * shrink));
    hubColumnGap = Math.max(12, Math.round(hubColumnGap * shrink));
    bulletMaxW = Math.max(
      72,
      Math.floor((availableW - ringSize - hubColumnGap * 2) / 2),
    );
    hubGridW = bulletMaxW * 2 + ringSize + hubColumnGap * 2;
  }

  return { ringSize, hubColumnGap, bulletMaxW, hubGridW };
}

export function useSectionContentScale(
  isAnimPlayingRef: RefObject<boolean>,
): {
  viewportW: number;
  bodyFontPx: number;
  contentScale: number;
} {
  const [viewportW, setViewportW] = useState(1024);
  const viewportDescCap = sectionViewportDescCap(viewportW);
  const [bodyFontPx, setBodyFontPx] = useState(() =>
    Math.max(10, Math.min(DESC_PX_DESIGN, viewportDescCap)),
  );

  useLayoutEffect(() => {
    setViewportW(window.innerWidth);
  }, []);

  useLayoutEffect(() => {
    if (isAnimPlayingRef.current) {
      return;
    }

    const bricolageFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bricolage-grotesque")
        .trim() || "sans-serif";

    setBodyFontPx(fitSectionBodyFontPx(viewportW, bricolageFont));
  }, [viewportW, isAnimPlayingRef]);

  useEffect(() => {
    const onResize = () => {
      if (isAnimPlayingRef.current) {
        return;
      }
      setViewportW(window.innerWidth);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isAnimPlayingRef]);

  return {
    viewportW,
    bodyFontPx,
    contentScale: sectionContentScale(bodyFontPx),
  };
}
