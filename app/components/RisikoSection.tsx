"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EASE,
  EASE_BOUNCE,
  SECTION_ANIM_END,
  SECTION_BODY_ENTER,
  SECTION_BODY_START,
  SECTION_MARK_ENTER,
  SECTION_MARK_START,
  SECTION_TITLE_ENTER,
  SECTION_TITLE_PAUSE,
  SECTION_TITLE_PHASE,
} from "@/app/lib/anim";
import { fitDescriptionFontSize, RISIKO_BODY_LINES } from "@/app/lib/fitText";
import { useSectionScrollGate } from "@/app/lib/scrollLock";
import {
  DESC_PX_DESIGN,
  DESIGN_WIDTH,
  EXCLAMATION_DOT_X_RATIO,
  EXCLAMATION_DOT_Y_RATIO,
  EXCLAMATION_H_BASE,
  EXCLAMATION_W_BASE,
  LINE_WIDTH_BASE,
  QUESTION_H_BASE,
  RISIKO_DASH_GAP_BASE,
  RISIKO_DASH_LENGTH_BASE,
  SECTION_TITLE_ENTER_PX_DESIGN,
  SECTION_TITLE_PX_DESIGN,
  scalePx,
} from "@/app/lib/scale";

const RISIKO_BULLETS = [
  "Transparente, erklärbare Analysen",
  "EU-AI-Act-konform",
  "Nachvollziehbar & auditierbar",
] as const;

const BODY_LINE_HEIGHT = 1.35;
const STATIC_TRANSITION = { duration: 0 };
const EXCLAMATION_MARK_W_BASE = Math.round(
  EXCLAMATION_W_BASE * (QUESTION_H_BASE / EXCLAMATION_H_BASE),
);

function measureLineExtendWidth(
  sectionEl: HTMLElement,
  hostEl: HTMLElement,
  markW: number,
): number {
  const sectionRect = sectionEl.getBoundingClientRect();
  const hostRect = hostEl.getBoundingClientRect();
  const dotCenterX = hostRect.left + markW * EXCLAMATION_DOT_X_RATIO;
  return Math.max(0, sectionRect.right - dotCenterX);
}

export default function RisikoSection({
  heroIntroComplete,
}: {
  heroIntroComplete: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const markHostRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const lineBaselineRef = useRef<{
    contentScale: number;
    lineExtendWidth: number;
  } | null>(null);

  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [isAnimPlaying, setIsAnimPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [scrollGateActive, setScrollGateActive] = useState(false);
  const [viewportW, setViewportW] = useState(1024);
  const [lineExtendWidth, setLineExtendWidth] = useState(0);
  const [markTopOffset, setMarkTopOffset] = useState(0);

  useSectionScrollGate(sectionRef, scrollGateActive);

  const preScale = Math.min(1, viewportW / DESIGN_WIDTH);
  const preMarkW = scalePx(EXCLAMATION_MARK_W_BASE, preScale, 24);
  const horizontalPad = viewportW * 0.06 * 2;
  const layoutGaps = viewportW * 0.14;
  const textMaxW = Math.max(
    80,
    Math.floor(viewportW - horizontalPad - layoutGaps - preMarkW),
  );
  const viewportDescCap = Math.round(
    viewportW * (DESC_PX_DESIGN / DESIGN_WIDTH),
  );

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

    setBodyFontPx(
      fitDescriptionFontSize(
        textMaxW,
        viewportDescCap,
        bricolageFont,
        RISIKO_BODY_LINES,
        10,
        DESC_PX_DESIGN,
      ),
    );
  }, [textMaxW, viewportDescCap]);

  const contentScale = bodyFontPx / DESC_PX_DESIGN;
  const titleRestPx = scalePx(SECTION_TITLE_PX_DESIGN, contentScale, 28);
  const titleLargePx = scalePx(SECTION_TITLE_ENTER_PX_DESIGN, contentScale, 40);
  const lineWidth = scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const dashLength = scalePx(RISIKO_DASH_LENGTH_BASE, contentScale, 8);
  const dashGap = scalePx(RISIKO_DASH_GAP_BASE, contentScale, 6);
  const dashPeriod = dashLength + dashGap;
  const markW = scalePx(EXCLAMATION_MARK_W_BASE, contentScale, 24);
  const markH = scalePx(QUESTION_H_BASE, contentScale, 72);
  const dotX = markW * EXCLAMATION_DOT_X_RATIO;
  const dotY = markH * EXCLAMATION_DOT_Y_RATIO;
  const bodyGap = scalePx(40, contentScale, 16);
  const bulletGap = scalePx(32, contentScale, 12);
  const titleLineH = titleRestPx * 1.05;

  useLayoutEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    const bodyH = bodyRef.current.offsetHeight;
    setMarkTopOffset(Math.round(titleLineH + bodyGap + bodyH - markH));
  }, [titleLineH, bodyGap, markH, bodyFontPx, contentScale]);

  useEffect(() => {
    if (!heroIntroComplete || !isInView || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    isAnimPlayingRef.current = true;
    setScrollGateActive(true);
    setIsAnimPlaying(true);
  }, [heroIntroComplete, isInView]);

  useEffect(() => {
    if (!isAnimPlaying) {
      return;
    }

    const t = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);
      setScrollGateActive(false);

      if (sectionRef.current && markHostRef.current) {
        const width = measureLineExtendWidth(
          sectionRef.current,
          markHostRef.current,
          markW,
        );
        lineBaselineRef.current = {
          contentScale,
          lineExtendWidth: width,
        };
        setLineExtendWidth(width);
      }
    }, SECTION_ANIM_END * 1000);

    return () => window.clearTimeout(t);
  }, [isAnimPlaying, markW, contentScale]);

  useLayoutEffect(() => {
    if (
      !isAnimPlaying ||
      !sectionRef.current ||
      !markHostRef.current ||
      lineBaselineRef.current
    ) {
      return;
    }

    setLineExtendWidth(
      measureLineExtendWidth(sectionRef.current, markHostRef.current, markW),
    );
  }, [isAnimPlaying, markW]);

  useLayoutEffect(() => {
    if (!hasFinished || !lineBaselineRef.current) {
      return;
    }

    const base = lineBaselineRef.current;
    const scaleRatio = base.contentScale > 0 ? contentScale / base.contentScale : 1;
    setLineExtendWidth(base.lineExtendWidth * scaleRatio);
  }, [hasFinished, contentScale]);

  useEffect(() => {
    const onResize = () => {
      if (isAnimPlayingRef.current) {
        return;
      }
      setViewportW(window.innerWidth);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const titleTimes = [
    0,
    SECTION_TITLE_ENTER / SECTION_TITLE_PHASE,
    (SECTION_TITLE_ENTER + SECTION_TITLE_PAUSE) / SECTION_TITLE_PHASE,
    1,
  ];

  return (
    <section
      ref={sectionRef}
      data-scroll-section="risiko"
      className="relative -mt-[3vh] w-full overflow-hidden bg-cream px-[6vw] pt-[5vh] pb-[10vh]"
    >
      <div className="flex w-full flex-row flex-nowrap items-start gap-x-[4vw] pt-[2vh]">
        <div className="relative z-10 w-fit max-w-full shrink-0">
          <motion.h2
            className="w-fit font-serif font-extrabold tracking-tight text-purple"
            style={{
              fontSize: titleRestPx,
              lineHeight: 1.05,
              transformOrigin: "center center",
            }}
            initial={
              isAnimPlaying
                ? { x: "-120vw", opacity: 0, fontSize: titleLargePx }
                : false
            }
            animate={
              isAnimPlaying
                ? {
                    x: ["-120vw", "32vw", "32vw", "0vw"],
                    opacity: [0, 1, 1, 1],
                    fontSize: [titleLargePx, titleLargePx, titleLargePx, titleRestPx],
                  }
                : hasFinished
                  ? { x: "0vw", opacity: 1, fontSize: titleRestPx }
                  : { x: "-120vw", opacity: 0, fontSize: titleLargePx }
            }
            transition={
              isAnimPlaying
                ? {
                    duration: SECTION_TITLE_PHASE,
                    times: titleTimes,
                    ease: [EASE, EASE, EASE_BOUNCE, EASE],
                  }
                : STATIC_TRANSITION
            }
          >
            Risiko
          </motion.h2>

          <motion.div
            ref={bodyRef}
            className="w-fit max-w-full"
            style={{
              marginTop: bodyGap,
              fontSize: bodyFontPx,
              lineHeight: BODY_LINE_HEIGHT,
            }}
            initial={isAnimPlaying ? { x: "-100vw", opacity: 0 } : false}
            animate={
              isAnimPlaying
                ? { x: ["-100vw", "0vw"], opacity: [0, 1] }
                : hasFinished
                  ? { x: "0vw", opacity: 1 }
                  : { x: "-100vw", opacity: 0 }
            }
            transition={
              isAnimPlaying
                ? {
                    duration: SECTION_BODY_ENTER,
                    delay: SECTION_BODY_START,
                    ease: EASE,
                  }
                : STATIC_TRANSITION
            }
          >
            <p className="font-bricolage font-medium text-ink">
              {RISIKO_BODY_LINES.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </p>
            <ul
              className="font-bricolage space-y-3 font-bold text-ink"
              style={{ marginTop: bulletGap }}
            >
              {RISIKO_BULLETS.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-purple">
                    •
                  </span>
                  <span className="whitespace-nowrap">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div aria-hidden className="w-[8vw] shrink-0 min-w-4" />

        <div
          ref={markHostRef}
          className="relative shrink-0 self-start mr-[2vw]"
          style={{ width: markW, height: markH, marginTop: markTopOffset }}
        >
          <motion.div
            className="absolute top-0 left-0 z-10 overflow-visible"
            style={{ width: markW, height: markH }}
            initial={isAnimPlaying ? { x: "95vw", opacity: 0 } : false}
            animate={
              isAnimPlaying
                ? { x: ["95vw", "0vw"], opacity: [0, 1] }
                : hasFinished
                  ? { x: "0vw", opacity: 1 }
                  : { x: "95vw", opacity: 0 }
            }
            transition={
              isAnimPlaying
                ? {
                    duration: SECTION_MARK_ENTER,
                    delay: SECTION_MARK_START,
                    ease: EASE,
                  }
                : STATIC_TRANSITION
            }
          >
            <div
              aria-hidden
              className="absolute z-0"
              style={{
                left: dotX,
                top: dotY - lineWidth / 2,
                width: lineExtendWidth,
                height: lineWidth,
                backgroundImage: `repeating-linear-gradient(90deg, var(--purple) 0, var(--purple) ${dashLength}px, transparent ${dashLength}px, transparent ${dashPeriod}px)`,
                backgroundRepeat: "repeat-x",
                backgroundSize: `${dashPeriod}px ${lineWidth}px`,
              }}
            />

            <Image
              src="/exclamation_point.svg"
              alt=""
              width={189}
              height={568}
              className="relative z-10 block h-full w-full"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
