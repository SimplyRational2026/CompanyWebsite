import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import {
  fitDescriptionFontSize,
  fitHeadlineFontSize,
  RISIKO_BODY_LINES,
  TEAM_TITLE_LINES,
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
  ENT_TREE_BRANCH_GAP_BASE,
  ENT_TREE_BRANCH_INNER_GAP_BASE,
  ENT_TREE_H_BRANCH_W_BASE,
  ENT_TREE_ICON_SIZE_BASE,
  ENT_TREE_TEXT_MAX_W_BASE,
  TEAM_FOOTER_TEXT_GAP_BASE,
  TEAM_MEMBER_GAP_BASE,
  TEAM_TITLE_ENTER_PX_DESIGN,
  TEAM_TITLE_PX_DESIGN,
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

/** Fit rest + enter sizes so all three title lines stay on one row each. */
export function fitTeamTitleSizes(
  viewportW: number,
  fontFamily: string,
  bodyFontPx: number,
): { titleRestPx: number; titleLargePx: number } {
  const contentScale = sectionContentScale(bodyFontPx);
  const maxWidth = sectionAvailableWidth(viewportW);
  const restMaxPx = scalePx(TEAM_TITLE_PX_DESIGN, contentScale, 28);
  const largeMaxPx = scalePx(TEAM_TITLE_ENTER_PX_DESIGN, contentScale, 40);
  const restViewportCap = Math.round(
    viewportW * (TEAM_TITLE_PX_DESIGN / DESIGN_WIDTH),
  );
  const largeViewportCap = Math.round(
    viewportW * (TEAM_TITLE_ENTER_PX_DESIGN / DESIGN_WIDTH),
  );

  const titleRestPx = fitHeadlineFontSize(
    maxWidth,
    restViewportCap,
    fontFamily,
    TEAM_TITLE_LINES,
    10,
    restMaxPx,
  );

  const titleLargePx = Math.max(
    titleRestPx,
    fitHeadlineFontSize(
      maxWidth,
      largeViewportCap,
      fontFamily,
      TEAM_TITLE_LINES,
      10,
      largeMaxPx,
    ),
  );

  return { titleRestPx, titleLargePx };
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

export function fitEntscheidbarTreeLayout(
  contentScale: number,
  viewportW: number,
): {
  branchLineW: number;
  iconSize: number;
  textMaxW: number;
  branchSpacing: number;
  branchInnerGap: number;
  treeStageW: number;
} {
  const availableW = sectionAvailableWidth(viewportW);
  let branchLineW = scalePx(ENT_TREE_H_BRANCH_W_BASE, contentScale, 60);
  let iconSize = scalePx(ENT_TREE_ICON_SIZE_BASE, contentScale, 40);
  let textMaxW = scalePx(ENT_TREE_TEXT_MAX_W_BASE, contentScale, 100);
  let branchSpacing = scalePx(ENT_TREE_BRANCH_GAP_BASE, contentScale, 48);
  let branchInnerGap = scalePx(ENT_TREE_BRANCH_INNER_GAP_BASE, contentScale, 8);

  const halfTreeW = branchLineW + iconSize + textMaxW + branchInnerGap * 2;
  const treeStageW = halfTreeW * 2;

  if (treeStageW > availableW) {
    const shrink = availableW / treeStageW;
    branchLineW = Math.max(48, Math.round(branchLineW * shrink));
    iconSize = Math.max(56, Math.round(iconSize * shrink));
    textMaxW = Math.max(
      88,
      Math.floor(
        (availableW -
          (branchLineW + iconSize + branchInnerGap * 2) * 2) /
          2,
      ),
    );
    branchSpacing = Math.max(48, Math.round(branchSpacing * shrink));
    branchInnerGap = Math.max(6, Math.round(branchInnerGap * shrink));
  }

  return {
    branchLineW,
    iconSize,
    textMaxW,
    branchSpacing,
    branchInnerGap,
    treeStageW: Math.min(
      availableW,
      (branchLineW + iconSize + textMaxW + branchInnerGap * 2) * 2,
    ),
  };
}

export function fitTeamLayout(
  contentScale: number,
  viewportW: number,
): {
  memberW: number;
  memberGap: number;
  rowW: number;
} {
  const availableW = sectionAvailableWidth(viewportW);
  const memberGap = scalePx(TEAM_MEMBER_GAP_BASE, contentScale, 8);
  let memberW = Math.floor((availableW - memberGap * 3) / 4);
  memberW = Math.max(80, memberW);
  const rowW = memberW * 4 + memberGap * 3;

  return { memberW, memberGap, rowW };
}

export function fitTeamFooterLayout(
  rowW: number,
  ringCenter: number,
  contentScale: number,
  textFontPx: number,
  text: string,
  fontFamily: string,
): {
  lineExtend: number;
  textGap: number;
  textWidth: number;
} {
  const textGap = scalePx(TEAM_FOOTER_TEXT_GAP_BASE, contentScale, 16);

  let textWidth = text.length * textFontPx * 0.52;
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = `500 ${textFontPx}px ${fontFamily}, sans-serif`;
      textWidth = ctx.measureText(text).width;
    }
  }

  const lineExtend = Math.max(
    48,
    Math.floor(rowW - ringCenter - textGap - textWidth),
  );

  return { lineExtend, textGap, textWidth };
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
