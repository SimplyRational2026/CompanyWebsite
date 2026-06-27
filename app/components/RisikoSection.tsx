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
  MOBILE_RISIKO_ANIM_END,
  MOBILE_RISIKO_BODY_START,
  MOBILE_RISIKO_MARK_START,
  MOBILE_RISIKO_TITLE_PHASE,
  SECTION_TITLE_ENTER,
  SECTION_TITLE_PAUSE,
  SECTION_TITLE_PHASE,
} from "@/app/lib/anim";
import ScrollHintArrow from "@/app/components/ScrollHintArrow";
import {
  fitSectionBodyFontPx,
  sectionContentScale,
  sectionTitleLargePx,
  sectionTitleRestPx,
  sectionViewportDescCap,
} from "@/app/lib/sectionTypography";
import { fitHeadlineFontSize, MOBILE_RISIKO_BODY_LINES, RISIKO_BODY_LINES } from "@/app/lib/fitText";
import {
  DESC_PX_DESIGN,
  DESIGN_WIDTH,
  EXCLAMATION_DOT_X_RATIO,
  EXCLAMATION_DOT_Y_RATIO,
  EXCLAMATION_H_BASE,
  EXCLAMATION_W_BASE,
  LINE_WIDTH_BASE,
  MOBILE_DESC_LINE_HEIGHT,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  MOBILE_SINGLE_TITLE_PX_DESIGN,
  MOBILE_EXCLAMATION_MARK_H_BASE,
  MOBILE_EXCLAMATION_MARK_W_BASE,
  QUESTION_H_BASE,
  RISIKO_DASH_GAP_BASE,
  RISIKO_DASH_LENGTH_BASE,
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
  mountImmediately = false,
  onFinished,
  onStarted,
  showScrollHint = false,
}: {
  heroIntroComplete: boolean;
  mountImmediately?: boolean;
  onFinished?: () => void;
  onStarted?: () => void;
  showScrollHint?: boolean;
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

  useEffect(() => {
    if (hasFinished) {
      onFinished?.();
    }
  }, [hasFinished, onFinished]);

  useEffect(() => {
    if (isAnimPlaying) {
      onStarted?.();
    }
  }, [isAnimPlaying, onStarted]);
  const [viewportW, setViewportW] = useState(1024);
  const [lineExtendWidth, setLineExtendWidth] = useState(0);
  const [markTopOffset, setMarkTopOffset] = useState(0);

  const isMobile = viewportW < DESIGN_WIDTH;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const mobileDescCap = Math.round(MOBILE_DESC_PX_DESIGN * mobileScale);
  const viewportDescCap = sectionViewportDescCap(viewportW);

  const [bodyFontPx, setBodyFontPx] = useState(() =>
    Math.max(10, Math.min(DESC_PX_DESIGN, viewportDescCap)),
  );
  const [mobileTitlePx, setMobileTitlePx] = useState(88);

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
      isMobile
        ? MOBILE_DESC_PX_DESIGN
        : fitSectionBodyFontPx(viewportW, bricolageFont),
    );

    if (isMobile) {
      const serifFont =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-noto-serif-jp")
          .trim() || "serif";
      setMobileTitlePx(
        fitHeadlineFontSize(
          viewportW * 0.9,
          MOBILE_SINGLE_TITLE_PX_DESIGN,
          serifFont,
          ["Risiko"],
          10,
          MOBILE_SINGLE_TITLE_PX_DESIGN,
        ),
      );
    }
  }, [viewportW, isMobile, mobileDescCap]);

  const contentScale = isMobile
    ? bodyFontPx / MOBILE_DESC_PX_DESIGN
    : sectionContentScale(bodyFontPx);
  const bodyLineHeight = isMobile ? MOBILE_DESC_LINE_HEIGHT : BODY_LINE_HEIGHT;
  const titleRestPx = isMobile ? mobileTitlePx : sectionTitleRestPx(contentScale);
  const titleLargePx = sectionTitleLargePx(contentScale);
  const lineWidth = scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const dashLength = scalePx(RISIKO_DASH_LENGTH_BASE, contentScale, 8);
  const dashGap = scalePx(RISIKO_DASH_GAP_BASE, contentScale, 6);
  const dashPeriod = dashLength + dashGap;
  const markW = isMobile
    ? scalePx(MOBILE_EXCLAMATION_MARK_W_BASE, mobileScale, 18)
    : scalePx(EXCLAMATION_MARK_W_BASE, contentScale, 24);
  const markH = isMobile
    ? scalePx(MOBILE_EXCLAMATION_MARK_H_BASE, mobileScale, 50)
    : scalePx(QUESTION_H_BASE, contentScale, 72);
  const dotX = markW * EXCLAMATION_DOT_X_RATIO;
  const dotY = markH * EXCLAMATION_DOT_Y_RATIO;
  const bodyGap = scalePx(40, contentScale, 16);
  const bulletGap = scalePx(32, contentScale, 12);
  const markGapMobile = scalePx(28, contentScale, 14);
  const bodyGapMobile = scalePx(36, contentScale, 18);
  const titleLineH = titleRestPx * 1.05;
  const bodyLines = isMobile ? MOBILE_RISIKO_BODY_LINES : RISIKO_BODY_LINES;

  useLayoutEffect(() => {
    if (isMobile || !bodyRef.current) {
      return;
    }

    const bodyH = bodyRef.current.offsetHeight;
    setMarkTopOffset(Math.round(titleLineH + bodyGap + bodyH - markH));
  }, [isMobile, titleLineH, bodyGap, markH, bodyFontPx, contentScale]);

  useEffect(() => {
    if (!heroIntroComplete || (!mountImmediately && !isInView) || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    isAnimPlayingRef.current = true;
    setIsAnimPlaying(true);
  }, [heroIntroComplete, isInView, mountImmediately]);

  useEffect(() => {
    if (!isAnimPlaying) {
      return;
    }

    const t = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);

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
    }, (isMobile ? MOBILE_RISIKO_ANIM_END : SECTION_ANIM_END) * 1000);

    return () => window.clearTimeout(t);
  }, [isAnimPlaying, markW, contentScale, isMobile]);

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

  const mobileTitleDur = MOBILE_RISIKO_TITLE_PHASE;
  const mobileTitleTimes = [
    0,
    SECTION_TITLE_ENTER / mobileTitleDur,
    1,
  ];
  const markDelay = isMobile ? MOBILE_RISIKO_MARK_START : SECTION_MARK_START;
  const bodyDelay = isMobile ? MOBILE_RISIKO_BODY_START : SECTION_BODY_START;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="risiko"
      className="relative -mt-[3vh] w-full overflow-hidden bg-cream px-[6vw] pt-[3vh] pb-[8vh] lg:pt-[5vh] lg:pb-[10vh]"
    >
      <div className="flex w-full flex-col items-center pt-[2vh] lg:grid lg:grid-cols-[min-content_8vw_min-content] lg:items-start lg:gap-x-[4vw]">
        <motion.h2
          className="z-10 w-full text-center font-serif font-extrabold tracking-tight text-purple lg:col-start-1 lg:row-start-1 lg:w-fit lg:self-start lg:text-left"
          style={{
            fontSize: titleRestPx,
            lineHeight: 1.05,
            transformOrigin: "center center",
          }}
          initial={
            isAnimPlaying
              ? { scale: isMobile ? 1 : 1.86, y: isMobile ? "20vh" : "30vh", opacity: 0 }
              : false
          }
          animate={
            isAnimPlaying
              ? isMobile
                ? {
                    x: ["-110vw", "0vw", "0vw"],
                    opacity: [0, 1, 1],
                    fontSize: [titleRestPx, titleRestPx, titleRestPx],
                  }
                : {
                    x: ["-120vw", "32vw", "32vw", "0vw"],
                    opacity: [0, 1, 1, 1],
                    fontSize: [titleLargePx, titleLargePx, titleLargePx, titleRestPx],
                  }
              : hasFinished
                ? { x: "0vw", opacity: 1, fontSize: titleRestPx }
                : isMobile
                  ? { x: "-110vw", opacity: 0, fontSize: titleRestPx }
                  : { x: "-120vw", opacity: 0, fontSize: titleLargePx }
          }
          transition={
            isAnimPlaying
              ? isMobile
                ? {
                    duration: mobileTitleDur,
                    times: mobileTitleTimes,
                    ease: [EASE_BOUNCE, EASE],
                  }
                : {
                    duration: SECTION_TITLE_PHASE,
                    times: titleTimes,
                    ease: [EASE, EASE, EASE_BOUNCE, EASE],
                  }
              : STATIC_TRANSITION
          }
        >
          Risiko
        </motion.h2>

        <div
          ref={markHostRef}
          className="relative shrink-0 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:mr-[2vw] lg:self-start"
          style={{
            width: markW,
            height: markH,
            marginTop: isMobile ? markGapMobile : markTopOffset,
          }}
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
                    delay: markDelay,
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

        <motion.div
          ref={bodyRef}
          className="z-10 w-full max-w-full text-left lg:col-start-1 lg:row-start-2 lg:w-fit"
          style={{
            marginTop: isMobile ? bodyGapMobile : bodyGap,
            fontSize: bodyFontPx,
            lineHeight: bodyLineHeight,
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
                  delay: bodyDelay,
                  ease: EASE,
                }
              : STATIC_TRANSITION
          }
        >
          <p className="font-bricolage font-medium text-ink">
            {isMobile
              ? "Wenn Wahrscheinlichkeiten bekannt sind, entscheiden Daten. Wir machen komplexe Informationen verständlich, nachvollziehbar und regulatorisch belastbar – damit datenbasierte Entscheidungen wirklich tragfähig sind."
              : bodyLines.map((line) => (
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
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      <ScrollHintArrow visible={showScrollHint} />
    </section>
  );
}
