import { useEffect, useLayoutEffect, useState } from "react";
import {
  BLACK_TITLE_LINES,
  fitHeadlineFontSize,
  fitMobileBodyFontPx,
  fitTitleFontSize,
  MOBILE_PURPLE_TITLE_LINES,
} from "@/app/lib/fitText";
import { fitSectionBodyFontPx } from "@/app/lib/sectionTypography";
import { fitDescriptionFontSize } from "@/app/lib/fitText";
import {
  BEFRAGUNG_COLUMN_GAP_BASE,
  BEFRAGUNG_TITLE_FIT_LINES,
  BEFRAGUNG_LABEL_FIT_LINES,
  BEFRAGUNG_QUOTE_FIT_LINES,
  MISST_FIT_LINES,
  MISST_GAUGE_W_BASE,
  MISST_GRID_GAP_BASE,
} from "./BarometerSections";
import {
  BALL_COL_W_BASE,
  DESC_PX_DESIGN,
  DESIGN_WIDTH,
  MOBILE_DESIGN_WIDTH,
  MOBILE_TITLE_PX_DESIGN,
  scalePx,
  TITLE_PX_DESIGN,
} from "@/app/lib/scale";

// Mirrors the Hero's font sizing exactly (same fit functions, same reference
// lines, same caps) so titles and body text on the sub page always render at
// the identical pixel size as the main page for a given viewport.
// The Befragung quotes sit in three equal columns and must keep the design's
// hardcoded line breaks. Body copy is sized against a full-width reference, so
// on narrower screens it outgrows a third of the row and wraps; cap it at
// whatever actually fits one column instead.
function fitBefragungQuotePx(
  viewportW: number,
  isMobile: boolean,
  bodyFontPx: number,
  fontFamily: string,
): number {
  if (isMobile) {
    return bodyFontPx;
  }

  const contentScale = bodyFontPx / DESC_PX_DESIGN;
  const columnGap = scalePx(BEFRAGUNG_COLUMN_GAP_BASE, contentScale, 32);
  // 6vw of padding either side, less a scrollbar allowance innerWidth includes.
  const columnW = Math.max(
    80,
    Math.floor((viewportW * 0.88 - 16 - columnGap * 2) / 3),
  );

  // Quotes and labels now share one weight, so one fit covers both.
  return fitDescriptionFontSize(
    columnW,
    bodyFontPx,
    fontFamily,
    [...BEFRAGUNG_QUOTE_FIT_LINES, ...BEFRAGUNG_LABEL_FIT_LINES],
    10,
    bodyFontPx,
  );
}

// Misst puts a paragraph either side of the gauge, both keeping the design's
// line breaks. Same problem as the quotes: a full-width-fitted body size does
// not fit a side column, so cap it at what one column actually holds.
function fitMisstBodyPx(
  viewportW: number,
  isMobile: boolean,
  bodyFontPx: number,
  fontFamily: string,
): number {
  if (isMobile) {
    return bodyFontPx;
  }

  const contentScale = bodyFontPx / DESC_PX_DESIGN;
  const gridGap = scalePx(MISST_GRID_GAP_BASE, contentScale, 24);
  const gaugeW = scalePx(MISST_GAUGE_W_BASE, contentScale, 200);
  const columnW = Math.max(
    80,
    Math.floor((viewportW * 0.88 - 16 - gridGap * 2 - gaugeW) / 2),
  );

  return fitDescriptionFontSize(
    columnW,
    bodyFontPx,
    fontFamily,
    MISST_FIT_LINES,
    10,
    bodyFontPx,
  );
}

export function useBarometerTypography(): {
  viewportW: number;
  isReady: boolean;
  isMobile: boolean;
  mobileScale: number;
  titlePx: number;
  bodyPx: number;
  contentScale: number;
  navContentScale: number;
  quotePx: number;
  misstPx: number;
  befragungTitlePx: number;
} {
  const [viewportW, setViewportW] = useState(1024);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    setViewportW(window.innerWidth);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportW < DESIGN_WIDTH;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const preScale = Math.min(1, viewportW / DESIGN_WIDTH);

  const preBallColW = scalePx(BALL_COL_W_BASE, preScale, 40);
  const horizontalPad = viewportW * 0.06;
  const gapBetweenCols = viewportW * 0.02 * 2;
  const titleMaxW = isMobile
    ? Math.max(80, Math.floor(viewportW - horizontalPad * 2))
    : Math.max(
        80,
        Math.floor(
          (viewportW - horizontalPad - preBallColW - gapBetweenCols) / 2,
        ),
      );
  const titleDesignPx = isMobile ? MOBILE_TITLE_PX_DESIGN : TITLE_PX_DESIGN;
  const viewportTitleCap = Math.round(
    titleDesignPx * (isMobile ? mobileScale : preScale),
  );

  const [titlePx, setTitlePx] = useState(() =>
    Math.max(10, Math.min(TITLE_PX_DESIGN, viewportTitleCap)),
  );
  const [bodyPx, setBodyPx] = useState(() =>
    Math.max(
      10,
      Math.min(
        DESC_PX_DESIGN,
        Math.round(viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH)),
      ),
    ),
  );
  const [misstPx, setMisstPx] = useState(() =>
    Math.max(
      10,
      Math.min(
        DESC_PX_DESIGN,
        Math.round(viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH)),
      ),
    ),
  );
  // "Entscheidungsbarometer" may not be cut, so the heading can never exceed
  // the size at which that word still fits its (full bleed) line. On anything
  // but the narrowest phones that leaves the shared title size untouched.
  const [befragungTitleMobilePx, setBefragungTitleMobilePx] = useState(
    MOBILE_TITLE_PX_DESIGN,
  );
  const [quotePx, setQuotePx] = useState(() =>
    Math.max(
      10,
      Math.min(
        DESC_PX_DESIGN,
        Math.round(viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH)),
      ),
    ),
  );

  useLayoutEffect(() => {
    const serifFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-noto-serif-jp")
        .trim() || "serif";

    setTitlePx(
      isMobile
        ? fitHeadlineFontSize(
            viewportW * 0.9,
            MOBILE_TITLE_PX_DESIGN,
            serifFont,
            [...BLACK_TITLE_LINES, ...MOBILE_PURPLE_TITLE_LINES],
            10,
            MOBILE_TITLE_PX_DESIGN,
          )
        : fitTitleFontSize(
            titleMaxW,
            viewportTitleCap,
            serifFont,
            10,
            titleDesignPx,
          ),
    );

    // Measured against the full bleed line the heading gets on mobile (the
    // viewport less the 1vw gutter either side), not the section's content box.
    setBefragungTitleMobilePx(
      fitHeadlineFontSize(
        viewportW * 0.98,
        MOBILE_TITLE_PX_DESIGN,
        serifFont,
        BEFRAGUNG_TITLE_FIT_LINES,
        10,
        MOBILE_TITLE_PX_DESIGN,
      ),
    );

    const bricolageFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bricolage-grotesque")
        .trim() || "sans-serif";

    const nextBodyPx = isMobile
      ? fitMobileBodyFontPx(viewportW, bricolageFont)
      : fitSectionBodyFontPx(viewportW, bricolageFont);

    setBodyPx(nextBodyPx);
    setQuotePx(
      fitBefragungQuotePx(viewportW, isMobile, nextBodyPx, bricolageFont),
    );
    setMisstPx(fitMisstBodyPx(viewportW, isMobile, nextBodyPx, bricolageFont));
  }, [viewportW, isMobile, titleMaxW, viewportTitleCap, titleDesignPx]);

  const contentScale = isMobile ? mobileScale : bodyPx / DESC_PX_DESIGN;
  const navContentScale = isMobile
    ? Math.max(preScale, 0.48)
    : titlePx / titleDesignPx;

  // The shared title size, capped only where the compound word would not fit
  // whole -- so the heading matches the other titles unless it physically
  // cannot. Desktop is never capped.
  const befragungTitlePx = isMobile
    ? Math.min(titlePx, befragungTitleMobilePx)
    : titlePx;

  return {
    viewportW,
    isReady,
    isMobile,
    mobileScale,
    titlePx,
    bodyPx,
    contentScale,
    navContentScale,
    quotePx,
    misstPx,
    befragungTitlePx,
  };
}
