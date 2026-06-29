"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EASE,
  EASE_BOUNCE,
  MOBILE_RISIKO_ANIM_END,
  MOBILE_RISIKO_BODY_START,
  MOBILE_RISIKO_MARK_START,
  MOBILE_RISIKO_TITLE_PHASE,
  SECTION_ANIM_END,
  SECTION_BODY_ENTER,
  SECTION_BODY_START,
  SECTION_MARK_ENTER,
  SECTION_MARK_START,
  SECTION_TITLE_ENTER,
  SECTION_TITLE_PAUSE,
  SECTION_TITLE_PHASE,
} from "@/app/lib/anim";
import ScrollHintArrow from "@/app/components/ui/ScrollHintArrow";
import {
  fitSectionBodyFontPx,
  sectionContentScale,
  sectionTitleLargePx,
  sectionTitleRestPx,
  sectionViewportDescCap,
} from "@/app/lib/sectionTypography";
import { fitHeadlineFontSize, fitMobileBodyFontPx, UNGEWISSHEIT_BODY_LINES } from "@/app/lib/fitText";
import {
  DESC_PX_DESIGN,
  DESIGN_WIDTH,
  LINE_WIDTH_BASE,
  MOBILE_DESC_LINE_HEIGHT,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  MOBILE_SINGLE_TITLE_PX_DESIGN,
  MOBILE_QUESTION_MARK_H_BASE,
  MOBILE_QUESTION_MARK_W_BASE,
  QUESTION_DOT_X_RATIO,
  QUESTION_DOT_Y_RATIO,
  QUESTION_H_BASE,
  QUESTION_W_BASE,
  RISIKO_DASH_GAP_BASE,
  RISIKO_DASH_LENGTH_BASE,
  scalePx,
} from "@/app/lib/scale";

const UNGEWISSHEIT_BULLETS = [
  "Es entstehen Entscheidungslogiken",
  "Erfahrung wird nutzbar gemacht",
  "Wissen bleibt im Unternehmen",
] as const;

const BODY_LINE_HEIGHT = 1.35;
const STATIC_TRANSITION = { duration: 0 };

function measureLineExtendWidthLeft(
  sectionEl: HTMLElement,
  hostEl: HTMLElement,
  markW: number,
): number {
  const sectionRect = sectionEl.getBoundingClientRect();
  const hostRect = hostEl.getBoundingClientRect();
  const dotCenterX = hostRect.left + markW * QUESTION_DOT_X_RATIO;
  return Math.max(0, dotCenterX - sectionRect.left);
}

export default function UngewissheitSection({
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
  const [titleRestOffsetPx, setTitleRestOffsetPx] = useState(0);
  const [titleCenterOffsetPx, setTitleCenterOffsetPx] = useState(0);
  const [titleEnterOffsetPx, setTitleEnterOffsetPx] = useState(0);
  const titleMeasureRef = useRef<HTMLSpanElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);

  const isMobile = viewportW < DESIGN_WIDTH;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const mobileDescCap = Math.round(MOBILE_DESC_PX_DESIGN * mobileScale);
  const viewportDescCap = sectionViewportDescCap(viewportW);

  const [bodyFontPx, setBodyFontPx] = useState(() =>
    Math.max(10, Math.min(DESC_PX_DESIGN, viewportDescCap)),
  );
  const [mobileTitlePx, setMobileTitlePx] = useState(88);
  const [mobileBodyTextPx, setMobileBodyTextPx] = useState(MOBILE_DESC_PX_DESIGN);

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
      setMobileBodyTextPx(fitMobileBodyFontPx(viewportW, bricolageFont));
      const serifFont =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-noto-serif-jp")
          .trim() || "serif";
      setMobileTitlePx(
        fitHeadlineFontSize(
          viewportW * 0.9,
          MOBILE_SINGLE_TITLE_PX_DESIGN,
          serifFont,
          ["Ungewissheit"],
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
    ? scalePx(MOBILE_QUESTION_MARK_W_BASE, mobileScale, 18)
    : scalePx(QUESTION_W_BASE, contentScale, 24);
  const markH = isMobile
    ? scalePx(MOBILE_QUESTION_MARK_H_BASE, mobileScale, 50)
    : scalePx(QUESTION_H_BASE, contentScale, 72);
  const dotX = markW * QUESTION_DOT_X_RATIO;
  const dotY = markH * QUESTION_DOT_Y_RATIO;
  const bodyGap = scalePx(40, contentScale, 16);
  const bulletGap = scalePx(32, contentScale, 12);
  const markGapMobile = scalePx(28, contentScale, 14);
  const bodyGapMobile = scalePx(36, contentScale, 18);
  const titleScale = titleLargePx / titleRestPx;
  const titleLineH = titleRestPx * 1.15;

  useLayoutEffect(() => {
    if (
      isMobile ||
      !titleMeasureRef.current ||
      !textColumnRef.current ||
      !sectionRef.current
    ) {
      return;
    }

    const titleW = titleMeasureRef.current.offsetWidth;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const columnLeft =
      textColumnRef.current.getBoundingClientRect().left - sectionRect.left;
    const sectionCenter = sectionRect.width / 2;
    const centerOffsetPx = -(titleW * titleScale) / 2;

    setTitleCenterOffsetPx(Math.round(centerOffsetPx));
    setTitleEnterOffsetPx(Math.round(viewportW * 1.2));
    setTitleRestOffsetPx(Math.round(columnLeft - sectionCenter));
  }, [isMobile, viewportW, titleRestPx, titleScale, contentScale]);

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
        const width = measureLineExtendWidthLeft(
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
      measureLineExtendWidthLeft(sectionRef.current, markHostRef.current, markW),
    );
  }, [isAnimPlaying, markW]);

  useLayoutEffect(() => {
    if (!hasFinished || !sectionRef.current || !markHostRef.current) {
      return;
    }

    const width = measureLineExtendWidthLeft(
      sectionRef.current,
      markHostRef.current,
      markW,
    );
    lineBaselineRef.current = { contentScale, lineExtendWidth: width };
    setLineExtendWidth(width);
  }, [hasFinished, contentScale, markW, isMobile, viewportW]);

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

  const markLine = (
    <div
      aria-hidden
      className="absolute z-0"
      style={{
        left: dotX - lineExtendWidth,
        top: dotY - lineWidth / 2,
        width: lineExtendWidth,
        height: lineWidth,
        backgroundImage: `repeating-linear-gradient(90deg, var(--purple) 0, var(--purple) ${dashLength}px, transparent ${dashLength}px, transparent ${dashPeriod}px)`,
        backgroundRepeat: "repeat-x",
        backgroundSize: `${dashPeriod}px ${lineWidth}px`,
      }}
    />
  );

  const markImage = (
    <Image
      src="/question_mark.svg"
      alt=""
      width={349}
      height={459}
      className="relative z-10 block h-full w-full"
      aria-hidden
    />
  );

  return (
    <section
      ref={sectionRef}
      data-scroll-section="ungewissheit"
      className="relative w-full overflow-hidden bg-cream px-[6vw] pt-[3vh] pb-[8vh] lg:pt-[6vh] lg:pb-[8vh]"
    >
      {!isMobile && (
        <>
          <span
            ref={titleMeasureRef}
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap font-serif font-extrabold tracking-tight"
            style={{ fontSize: titleRestPx }}
          >
            Ungewissheit
          </span>

          {(isAnimPlaying || hasFinished) && (
            <motion.h2
              className="pointer-events-none absolute top-[8vh] left-1/2 z-30 w-fit whitespace-nowrap font-serif font-extrabold tracking-tight text-purple"
              style={{
                fontSize: titleRestPx,
                lineHeight: 1.15,
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                willChange: isAnimPlaying ? "transform" : undefined,
              }}
              initial={
                isAnimPlaying
                  ? {
                      x: titleEnterOffsetPx,
                      opacity: 0,
                      scale: titleScale,
                    }
                  : false
              }
              animate={
                isAnimPlaying
                  ? {
                      x: [
                        titleEnterOffsetPx,
                        titleCenterOffsetPx,
                        titleCenterOffsetPx,
                        titleRestOffsetPx,
                      ],
                      opacity: [0, 1, 1, 1],
                      scale: [titleScale, titleScale, titleScale, 1],
                    }
                  : hasFinished
                    ? { x: titleRestOffsetPx, opacity: 1, scale: 1 }
                    : {
                        x: titleEnterOffsetPx,
                        opacity: 0,
                        scale: titleScale,
                      }
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
              Ungewissheit
            </motion.h2>
          )}
        </>
      )}

      <div className="flex w-full flex-col items-center pt-[2vh] lg:hidden">
        <motion.h2
          className="z-10 w-full text-center font-serif font-extrabold tracking-tight text-purple"
          style={{
            fontSize: titleRestPx,
            lineHeight: 1.15,
            transformOrigin: "center center",
          }}
          initial={isAnimPlaying ? { x: "110vw", opacity: 0 } : false}
          animate={
            isAnimPlaying
              ? {
                  x: ["110vw", "0vw", "0vw"],
                  opacity: [0, 1, 1],
                }
              : hasFinished
                ? { x: "0vw", opacity: 1 }
                : { x: "110vw", opacity: 0 }
          }
          transition={
            isAnimPlaying
              ? {
                  duration: mobileTitleDur,
                  times: mobileTitleTimes,
                  ease: [EASE_BOUNCE, EASE],
                }
              : STATIC_TRANSITION
          }
        >
          Ungewissheit
        </motion.h2>

        <div
          ref={isMobile ? markHostRef : undefined}
          className="relative shrink-0"
          style={{
            width: markW,
            height: markH,
            marginTop: markGapMobile,
          }}
        >
          <motion.div
            className="absolute top-0 left-0 z-10 overflow-visible"
            style={{ width: markW, height: markH }}
            initial={isAnimPlaying ? { x: "-110vw", opacity: 0 } : false}
            animate={
              isAnimPlaying
                ? { x: ["-110vw", "0vw"], opacity: [0, 1] }
                : hasFinished
                  ? { x: "0vw", opacity: 1 }
                  : { x: "-110vw", opacity: 0 }
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
            {markLine}
            {markImage}
          </motion.div>
        </div>

        <motion.div
          ref={isMobile ? bodyRef : undefined}
          className="z-10 w-full max-w-full text-left"
          style={{
            marginTop: bodyGapMobile,
            fontSize: mobileBodyTextPx,
            lineHeight: bodyLineHeight,
          }}
          initial={isAnimPlaying ? { x: "100vw", opacity: 0 } : false}
          animate={
            isAnimPlaying
              ? { x: "0vw", opacity: [0, 1] }
              : hasFinished
                ? { x: "0vw", opacity: 1 }
                : { x: "100vw", opacity: 0 }
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
            Wenn Zukunft nicht berechenbar ist, braucht es menschliche
            Urteilskraft. Wir schaffen Strukturen, damit Erfahrung, Intuition
            und Wissen klar genutzt werden können.
          </p>
          <ul
            className="font-bricolage space-y-3 font-bold text-ink"
            style={{ marginTop: bulletGap }}
          >
            {UNGEWISSHEIT_BULLETS.map((item) => (
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

      <div className="hidden w-full flex-row-reverse flex-nowrap items-start gap-x-[4vw] pt-[2vh] lg:flex">
        <div
          ref={!isMobile ? textColumnRef : undefined}
          className="relative z-10 w-fit max-w-full shrink-0 text-left"
        >
          <div aria-hidden style={{ height: titleLineH }} />

          <motion.div
            ref={!isMobile ? bodyRef : undefined}
            className="w-fit max-w-full text-left"
            style={{
              marginTop: bodyGap,
              fontSize: bodyFontPx,
              lineHeight: bodyLineHeight,
            }}
            initial={isAnimPlaying ? { x: "100vw", opacity: 0 } : false}
            animate={
              isAnimPlaying
                ? { x: ["100vw", "0vw"], opacity: [0, 1] }
                : hasFinished
                  ? { x: "0vw", opacity: 1 }
                  : { x: "100vw", opacity: 0 }
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
              {UNGEWISSHEIT_BODY_LINES.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </p>
            <ul
              className="font-bricolage space-y-3 font-bold text-ink"
              style={{ marginTop: bulletGap }}
            >
              {UNGEWISSHEIT_BULLETS.map((item) => (
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
          ref={!isMobile ? markHostRef : undefined}
          className="relative shrink-0 self-start ml-[2vw]"
          style={{ width: markW, height: markH, marginTop: markTopOffset }}
        >
          <motion.div
            className="absolute top-0 left-0 z-10 overflow-visible"
            style={{ width: markW, height: markH }}
            initial={isAnimPlaying ? { x: "-95vw", opacity: 0 } : false}
            animate={
              isAnimPlaying
                ? { x: ["-95vw", "0vw"], opacity: [0, 1] }
                : hasFinished
                  ? { x: "0vw", opacity: 1 }
                  : { x: "-95vw", opacity: 0 }
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
            {markLine}
            {markImage}
          </motion.div>
        </div>
      </div>
      <ScrollHintArrow visible={showScrollHint} />
    </section>
  );
}
