"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  D800,
  D1000,
  DASHED_DUR,
  EASE,
  EASE_BOUNCE,
  LINE_PHASE_DROP,
  LINE_PHASE_TO_NAV,
  STEPS,
} from "@/app/lib/anim";
import {
  BLACK_TITLE_LINES,
  DESCRIPTION_LINES,
  fitDescriptionFontSize,
  fitTitleFontSize,
  measureDescriptionHeight,
  PURPLE_TITLE_LINES,
} from "@/app/lib/fitText";
import {
  BALL_COL_W_BASE,
  BALL_SIZE_BASE,
  CENTER_LINE_DROP_BASE,
  DASH_GAP_BASE,
  DASH_LENGTH_BASE,
  DESC_PX_DESIGN,
  DESCRIPTION_GAP_BASE,
  DESIGN_WIDTH,
  INTRO_LOGO_W_BASE,
  LINE_WIDTH_BASE,
  NAV_HEIGHT_BASE,
  scalePx,
  TITLE_DIVERGE_BLACK_BASE,
  TITLE_DIVERGE_PURPLE_BASE,
  TITLE_PX_DESIGN,
} from "@/app/lib/scale";
import Nav from "./Nav";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [logoInNav, setLogoInNav] = useState(false);
  const [showNavExtras, setShowNavExtras] = useState(false);
  const [viewportH, setViewportH] = useState(800);
  const [viewportW, setViewportW] = useState(1024);

  useEffect(() => {
    const t1 = window.setTimeout(
      () => setLogoInNav(true),
      STEPS.logoToNav.delay * 1000,
    );
    const t2 = window.setTimeout(
      () => setShowNavExtras(true),
      STEPS.navReveal.delay * 1000,
    );

    const updateSize = () => {
      setViewportH(window.innerHeight);
      setViewportW(window.innerWidth);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const preScale = Math.min(1, viewportW / DESIGN_WIDTH);
  const preBallColW = scalePx(BALL_COL_W_BASE, preScale, 40);

  const horizontalPad = viewportW * 0.06;
  const gapBetweenCols = viewportW * 0.02 * 2;
  const titleMaxW = Math.max(
    80,
    Math.floor((viewportW - horizontalPad - preBallColW - gapBetweenCols) / 2),
  );

  const viewportTitleCap = Math.round(
    viewportW * (TITLE_PX_DESIGN / DESIGN_WIDTH),
  );
  const viewportDescCap = Math.round(
    viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH),
  );
  const [titleFontPx, setTitleFontPx] = useState(() =>
    Math.max(10, Math.min(TITLE_PX_DESIGN, viewportTitleCap)),
  );
  const [descFontPx, setDescFontPx] = useState(() =>
    Math.max(10, Math.min(DESC_PX_DESIGN, viewportDescCap)),
  );
  const [titleFromCenter, setTitleFromCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useLayoutEffect(() => {
    const fontFamily =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-noto-serif-jp")
        .trim() || "serif";

    setTitleFontPx(
      fitTitleFontSize(titleMaxW, viewportTitleCap, fontFamily, 10, TITLE_PX_DESIGN),
    );

    const bricolageFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bricolage-grotesque")
        .trim() || "sans-serif";
    const descContentWidth = Math.max(40, titleMaxW);

    setDescFontPx(
      fitDescriptionFontSize(
        descContentWidth,
        viewportDescCap,
        bricolageFont,
        10,
        DESC_PX_DESIGN,
      ),
    );
  }, [titleMaxW, viewportTitleCap, viewportDescCap]);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setTitleFromCenter({
      x: viewportW / 2 - centerX,
      y: viewportH / 2 - centerY,
    });
  }, [titleFontPx, titleMaxW, viewportH, viewportW]);

  const contentScale = titleFontPx / TITLE_PX_DESIGN;

  const navHeight = scalePx(NAV_HEIGHT_BASE, contentScale, 56);
  const ballSize = scalePx(BALL_SIZE_BASE, contentScale, 24);
  const lineWidth = scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const dashLength = scalePx(DASH_LENGTH_BASE, contentScale, 16);
  const dashGap = scalePx(DASH_GAP_BASE, contentScale, 16);
  const dashPeriod = dashLength + dashGap;
  const ballColW = Math.max(ballSize + 12, scalePx(BALL_COL_W_BASE, contentScale, 40));
  const centerLineDrop = Math.min(
    Math.round(viewportH * 0.27),
    scalePx(CENTER_LINE_DROP_BASE, contentScale, 80),
  );
  const blackDiverge = scalePx(TITLE_DIVERGE_BLACK_BASE, contentScale, 40);
  const purpleDiverge = scalePx(TITLE_DIVERGE_PURPLE_BASE, contentScale, 50);
  const descriptionGap = scalePx(DESCRIPTION_GAP_BASE, contentScale, 12);
  const columnHeight = Math.min(440, Math.round(viewportH * 0.55));
  const introLogoW = Math.min(
    Math.round(viewportW * 0.9),
    scalePx(INTRO_LOGO_W_BASE, contentScale, 180),
  );

  const descLineHeightRatio = 1.35;
  const descContentWidth = Math.max(40, titleMaxW);
  const descHeight = measureDescriptionHeight(
    DESCRIPTION_LINES.length,
    descFontPx,
    descLineHeightRatio,
  );
  const ballDrop = columnHeight / 2 + descriptionGap + descHeight / 2;
  const titleLineH = titleFontPx * 1.15;
  const ballGapOffset = titleLineH * 0.5;
  const ballStartY = viewportH / 2 - ballGapOffset;
  const ballEndY = viewportH / 2 + ballDrop;
  const finalLineHeight = Math.max(ballEndY - navHeight, 120);
  const titleOffsetY = 0;

  const lineRightStart = viewportW + 0.95 * viewportW + ballSize / 2;
  const lineRightEnd = viewportW / 2 + ballSize / 2;
  const dashedDur = DASHED_DUR;
  const dashedEntryEnd = STEPS.ballEnter.duration / dashedDur;
  const dashedRetractStart = (STEPS.ballEnter.duration + D1000) / dashedDur;

  const linePhaseDrop = LINE_PHASE_DROP;
  const linePhaseToNav = LINE_PHASE_TO_NAV;

  const hlDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.headlineEnter.delay;
  const hl_t1 = STEPS.headlineEnter.duration / hlDur;
  const hl_t2 =
    (STEPS.headlineEnter.duration + STEPS.headlineCenterPause.duration) /
    hlDur;
  const hl_t3 =
    (STEPS.headlineEnter.duration +
      STEPS.headlineCenterPause.duration +
      STEPS.headlineShiftLeft.duration) /
    hlDur;
  const hl_t4 = (STEPS.lineDrop.delay - STEPS.headlineEnter.delay) / hlDur;
  const hl_t5 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseDrop -
      STEPS.headlineEnter.delay) /
    hlDur;
  const hl_t6 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseToNav -
      STEPS.headlineEnter.delay) /
    hlDur;

  const shDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.subheadEnter.delay;
  const sh_t1 = STEPS.subheadEnter.duration / shDur;
  const sh_t2 = (STEPS.lineDrop.delay - STEPS.subheadEnter.delay) / shDur;
  const sh_t3 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseDrop -
      STEPS.subheadEnter.delay) /
    shDur;
  const sh_t4 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseToNav -
      STEPS.subheadEnter.delay) /
    shDur;

  const ballDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.ballEnter.delay;
  const ball_t1 = STEPS.ballEnter.duration / ballDur;
  const ball_t_fuse =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseDrop -
      STEPS.ballEnter.delay) /
    ballDur;
  const ball_t_nav =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * linePhaseToNav -
      STEPS.ballEnter.delay) /
    ballDur;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream">
      <Nav
        logoInNav={logoInNav}
        showExtras={showNavExtras}
        contentScale={contentScale}
      />

      {!logoInNav && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            layoutId="srLogo"
            className="block"
            style={{ width: introLogoW }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: STEPS.logoIntro.duration,
              ease: EASE,
            }}
          >
            <Image
              src="/simply-rational-logo.png"
              alt="Simply Rational"
              width={1024}
              height={512}
              priority
              className="block h-auto w-full"
            />
          </motion.div>
        </div>
      )}

      <motion.div
        aria-hidden
        className="absolute left-1/2 z-10 -translate-x-1/2 bg-purple"
        style={{ width: lineWidth }}
        initial={{ top: ballStartY, height: 0, opacity: 1 }}
        animate={{
          top: [ballStartY, ballStartY, navHeight, navHeight],
          height: [0, centerLineDrop, finalLineHeight, finalLineHeight],
          opacity: 1,
        }}
        transition={{
          duration: STEPS.lineDrop.duration,
          delay: STEPS.lineDrop.delay,
          times: [0, linePhaseDrop, linePhaseToNav, 1],
          ease: EASE,
        }}
      />

      <motion.div
        aria-hidden
        className="absolute z-5"
        style={{
          top: `calc(50vh - ${ballGapOffset + lineWidth / 2}px)`,
          height: lineWidth,
          backgroundImage: `repeating-linear-gradient(90deg, #661aae 0, #661aae ${dashLength}px, transparent ${dashLength}px, transparent ${dashPeriod}px)`,
          backgroundRepeat: "repeat-x",
          backgroundSize: `${dashPeriod}px ${lineWidth}px`,
        }}
        initial={{ right: lineRightStart, width: viewportW, opacity: 1 }}
        animate={{
          right: [
            lineRightStart,
            lineRightEnd,
            lineRightEnd,
            lineRightEnd,
          ],
          width: [viewportW, viewportW, viewportW, 0],
        }}
        transition={{
          duration: dashedDur,
          delay: STEPS.ballEnter.delay,
          times: [0, dashedEntryEnd, dashedRetractStart, 1],
          ease: EASE,
        }}
      />

      <main className="relative flex h-screen items-center">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-[2vw] px-[3vw]">
          <motion.h1
            ref={titleRef}
            className="relative z-30 mx-auto text-center font-serif font-extrabold tracking-tight text-ink"
            style={{
              fontSize: titleFontPx,
              lineHeight: `${titleLineH}px`,
              transformOrigin: "center center",
            }}
            initial={
              titleFromCenter
                ? {
                    x: titleFromCenter.x,
                    y: titleFromCenter.y,
                    scale: 1.6,
                    opacity: 0,
                  }
                : { opacity: 0 }
            }
            animate={
              titleFromCenter
                ? {
                    x: [
                      titleFromCenter.x,
                      titleFromCenter.x,
                      titleFromCenter.x,
                      0,
                      0,
                      0,
                      0,
                      0,
                    ],
                    scale: [1.6, 1.6, 1.6, 1, 1, 1, 1, 1],
                    y: [
                      titleFromCenter.y,
                      titleFromCenter.y,
                      titleFromCenter.y,
                      titleOffsetY,
                      titleOffsetY,
                      titleOffsetY - blackDiverge,
                      titleOffsetY,
                      titleOffsetY,
                    ],
                    opacity: [0, 1, 1, 1, 1, 1, 1, 1],
                  }
                : { opacity: 0 }
            }
            transition={
              titleFromCenter
                ? {
                    duration: hlDur,
                    delay: STEPS.headlineEnter.delay,
                    times: [0, hl_t1, hl_t2, hl_t3, hl_t4, hl_t5, hl_t6, 1],
                    ease: [
                      EASE,
                      EASE,
                      EASE_BOUNCE,
                      EASE,
                      EASE,
                      EASE,
                      EASE,
                    ],
                  }
                : { duration: 0 }
            }
          >
            {BLACK_TITLE_LINES.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </motion.h1>

          <div
            className="relative"
            style={{ width: ballColW, height: columnHeight }}
          >
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple"
              style={{ width: ballSize, height: ballSize }}
              initial={{ x: "-95vw", y: -ballGapOffset, opacity: 0 }}
              animate={{
                x: ["-95vw", "0vw", "0vw", "0vw", "0vw"],
                y: [
                  -ballGapOffset,
                  -ballGapOffset,
                  -ballGapOffset,
                  ballDrop,
                  ballDrop,
                ],
                opacity: [0, 1, 1, 1, 1],
              }}
              transition={{
                duration: ballDur,
                delay: STEPS.ballEnter.delay,
                times: [0, ball_t1, ball_t_fuse, ball_t_nav, 1],
                ease: EASE,
              }}
            />
          </div>

          <div
            className="relative flex items-center justify-center"
            style={{ height: columnHeight }}
          >
            <motion.h2
              className="mx-auto text-center font-serif font-extrabold tracking-tight text-purple-deep"
              style={{
                fontSize: titleFontPx,
                lineHeight: `${titleLineH}px`,
              }}
              initial={{ x: "60vw", y: titleOffsetY, opacity: 0 }}
              animate={{
                x: ["60vw", "0vw", "0vw", "0vw", "0vw", "0vw"],
                y: [
                  titleOffsetY,
                  titleOffsetY,
                  titleOffsetY,
                  titleOffsetY + purpleDiverge,
                  titleOffsetY,
                  titleOffsetY,
                ],
                opacity: [0, 1, 1, 1, 1, 1],
              }}
              transition={{
                duration: shDur,
                delay: STEPS.subheadEnter.delay,
                times: [0, sh_t1, sh_t2, sh_t3, sh_t4, 1],
                ease: EASE,
              }}
            >
              {PURPLE_TITLE_LINES.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </motion.h2>

            <motion.p
              className="font-bricolage absolute inset-x-0 mx-auto text-left font-medium text-ink"
              style={{
                top: `calc(100% + ${descriptionGap}px)`,
                width: descContentWidth,
                fontSize: descFontPx,
                lineHeight: descLineHeightRatio,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: STEPS.subtextFade.duration,
                delay: STEPS.subtextFade.delay,
                ease: EASE,
              }}
            >
              {DESCRIPTION_LINES.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </motion.p>
          </div>
        </div>
      </main>
    </div>
  );
}
