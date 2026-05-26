"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EASE,
  EASE_BOUNCE,
  WAS_ANIM_END,
  WAS_CIRCLE_ENTER,
  WAS_CIRCLE_START,
  WAS_HUB_START,
  WAS_REVEAL_DUR,
  WAS_TEXT_CYCLE,
  WAS_TITLE_ENTER,
  WAS_TITLE_PAUSE,
  WAS_TITLE_PHASE,
  WAS_VIDEO_ENTER,
  WAS_VIDEO_START,
} from "@/app/lib/anim";
import { WAS_ANDERS_BULLETS, WAS_ANDERS_TITLE } from "@/app/lib/fitText";
import {
  fitSectionHeadlineFontPx,
  fitWasHubLayout,
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  BRAIN_VIDEO_BORDER_BASE,
  BRAIN_VIDEO_H_BASE,
  BRAIN_VIDEO_RADIUS_BASE,
  BRAIN_VIDEO_W_BASE,
  scalePx,
  WAS_ANDERS_TITLE_ENTER_PX_DESIGN,
  WAS_ANDERS_TITLE_PX_DESIGN,
  WAS_HUB_BULLET_DOT_BASE,
  WAS_HUB_DOT_SIZE_BASE,
  WAS_HUB_GAP_BASE,
  WAS_HUB_RING_DASH_COUNT,
  WAS_HUB_RING_STROKE_BASE,
  WAS_HUB_TEXT_COLUMN_GAP_BASE,
  WAS_HUB_ENTER_DROP_BASE,
  WAS_VIDEO_GAP_BASE,
} from "@/app/lib/scale";

const BULLET_LINE_HEIGHT = 1.3;
const STATIC_TRANSITION = { duration: 0 };

const BULLET_SLOTS = [
  { key: "tl", index: 0, from: "left" as const, side: "left" as const },
  { key: "tr", index: 1, from: "right" as const, side: "right" as const },
  { key: "bl", index: 2, from: "left" as const, side: "left" as const },
  { key: "br", index: 3, from: "right" as const, side: "right" as const },
] as const;

export default function WasAndersSection({
  heroIntroComplete,
}: {
  heroIntroComplete: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const videoEnteredRef = useRef(false);
  const hubEnteredRef = useRef(false);

  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [isAnimPlaying, setIsAnimPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [ringRotation, setRingRotation] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);
  const [titleRestPx, setTitleRestPx] = useState(WAS_ANDERS_TITLE_PX_DESIGN);

  const { viewportW, bodyFontPx, contentScale } =
    useSectionContentScale(isAnimPlayingRef);

  useLayoutEffect(() => {
    if (isAnimPlayingRef.current) {
      return;
    }

    const serifFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-noto-serif-jp")
        .trim() || "serif";

    setTitleRestPx(
      fitSectionHeadlineFontPx(
        viewportW,
        serifFont,
        [WAS_ANDERS_TITLE],
        WAS_ANDERS_TITLE_PX_DESIGN,
        bodyFontPx,
      ),
    );
  }, [viewportW, bodyFontPx]);

  const titleLargePx = scalePx(
    WAS_ANDERS_TITLE_ENTER_PX_DESIGN,
    contentScale,
    40,
  );
  const bulletFontPx = bodyFontPx;
  const titleHubGap = scalePx(WAS_HUB_GAP_BASE, contentScale, 24);
  const hubDotSize = scalePx(WAS_HUB_DOT_SIZE_BASE, contentScale, 32);
  const ringStroke = scalePx(WAS_HUB_RING_STROKE_BASE, contentScale, 3);
  const bulletDotSize = scalePx(WAS_HUB_BULLET_DOT_BASE, contentScale, 10);
  const bulletGap = scalePx(16, contentScale, 8);
  const textColumnGap = scalePx(WAS_HUB_TEXT_COLUMN_GAP_BASE, contentScale, 8);

  const { ringSize, hubColumnGap, bulletMaxW, hubGridW } = fitWasHubLayout(
    contentScale,
    viewportW,
  );

  const bulletHeights = WAS_ANDERS_BULLETS.map((lines) =>
    Math.round(lines.length * bulletFontPx * BULLET_LINE_HEIGHT),
  );
  const leftColumnH = bulletHeights[0] + textColumnGap + bulletHeights[2];
  const rightColumnH = bulletHeights[1] + textColumnGap + bulletHeights[3];
  const columnH = Math.max(leftColumnH, rightColumnH);
  const hubStageH = Math.max(ringSize, columnH);
  const leftColumnTop = Math.round((hubStageH - leftColumnH) / 2);
  const rightColumnTop = Math.round((hubStageH - rightColumnH) / 2);
  const hubRestTop = Math.round((hubStageH - ringSize) / 2);
  const bulletTops = [
    leftColumnTop,
    rightColumnTop,
    leftColumnTop + bulletHeights[0] + textColumnGap,
    rightColumnTop + bulletHeights[1] + textColumnGap,
  ];

  const ringRadius = Math.max(0, (ringSize - ringStroke) / 2);
  const ringCenter = ringSize / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringSegmentLength = ringCircumference / WAS_HUB_RING_DASH_COUNT;
  const ringDashLength = ringSegmentLength * 0.58;
  const ringDashGap = ringSegmentLength * 0.42;

  const hubSideOffset = ringSize / 2 + hubColumnGap;

  const availableW = sectionAvailableWidth(viewportW);
  const videoW = Math.min(
    scalePx(BRAIN_VIDEO_W_BASE, contentScale, 120),
    availableW,
  );
  const videoH = scalePx(BRAIN_VIDEO_H_BASE, contentScale, 240);
  const videoRadius = scalePx(BRAIN_VIDEO_RADIUS_BASE, contentScale, 12);
  const videoBorder = scalePx(BRAIN_VIDEO_BORDER_BASE, contentScale, 3);
  const videoGap = scalePx(WAS_VIDEO_GAP_BASE, contentScale, 32);
  const titleBlockH = Math.round(
    Math.max(titleRestPx, titleLargePx) * 1.05,
  );

  useEffect(() => {
    if (!heroIntroComplete || !isInView || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    isAnimPlayingRef.current = true;
    setIsAnimPlaying(true);
  }, [heroIntroComplete, isInView]);

  useEffect(() => {
    if (!isAnimPlaying) {
      return;
    }

    const revealTimers: number[] = [];

    for (let i = 0; i < 4; i++) {
      const revealAt = (WAS_HUB_START + i * WAS_TEXT_CYCLE) * 1000;

      revealTimers.push(
        window.setTimeout(() => {
          setRingRotation((prev) => prev + 360);
          setVisibleBullets(i + 1);
        }, revealAt),
      );
    }

    const videoTimer = window.setTimeout(
      () => setVideoVisible(true),
      WAS_VIDEO_START * 1000,
    );

    const endTimer = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);
      setVisibleBullets(4);
      setRingRotation(1440);
    }, WAS_ANIM_END * 1000);

    return () => {
      revealTimers.forEach(window.clearTimeout);
      window.clearTimeout(videoTimer);
      window.clearTimeout(endTimer);
    };
  }, [isAnimPlaying]);

  const titleTimes = [
    0,
    WAS_TITLE_ENTER / WAS_TITLE_PHASE,
    (WAS_TITLE_ENTER + WAS_TITLE_PAUSE) / WAS_TITLE_PHASE,
    1,
  ];

  const showHub = isAnimPlaying || hasFinished;
  const showVideoFrame = videoVisible || hasFinished;
  const hubEnterY = scalePx(WAS_HUB_ENTER_DROP_BASE, contentScale, 120);
  const showTitle = isAnimPlaying || hasFinished;
  const videoReservedH =
    isAnimPlaying || hasFinished ? videoGap + videoH : 0;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="was-anders"
      className="relative w-full overflow-x-hidden bg-cream px-[6vw] pt-[6vh] pb-[8vh]"
    >
      <div
        className="flex w-full justify-center"
        style={{ minHeight: titleBlockH }}
      >
        {showTitle && (
          <motion.h2
            className="w-fit whitespace-nowrap text-center font-serif font-extrabold tracking-tight text-purple"
            style={{
              fontSize: titleRestPx,
              lineHeight: 1.05,
              transformOrigin: "center center",
            }}
            initial={
              isAnimPlaying && !hasFinished
                ? { x: "-120vw", opacity: 0, fontSize: titleLargePx }
                : false
            }
            animate={
              isAnimPlaying && !hasFinished
                ? {
                    x: ["-120vw", "0px", "0px", "0px"],
                    opacity: [0, 1, 1, 1],
                    fontSize: [
                      titleLargePx,
                      titleLargePx,
                      titleLargePx,
                      titleRestPx,
                    ],
                  }
                : hasFinished
                  ? { x: "0px", opacity: 1, fontSize: titleRestPx }
                  : { x: "-120vw", opacity: 0, fontSize: titleLargePx }
            }
            transition={
              isAnimPlaying && !hasFinished
                ? {
                    duration: WAS_TITLE_PHASE,
                    times: titleTimes,
                    ease: [EASE, EASE, EASE_BOUNCE, EASE],
                  }
                : STATIC_TRANSITION
            }
          >
            {WAS_ANDERS_TITLE}
          </motion.h2>
        )}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center">
        {showHub && (
          <div
            className="relative overflow-visible"
            style={{
              marginTop: titleHubGap,
              width: hubGridW,
              height: hubStageH,
            }}
          >
            <motion.div
              layout={false}
              className="absolute left-1/2 z-10 -translate-x-1/2"
              style={{
                top: hubRestTop,
                width: ringSize,
                height: ringSize,
              }}
              initial={
                !hubEnteredRef.current && isAnimPlaying && !hasFinished
                  ? { y: hubEnterY, opacity: 0 }
                  : false
              }
              animate={{ y: 0, opacity: 1 }}
              transition={
                !hubEnteredRef.current && isAnimPlaying && !hasFinished
                  ? {
                      delay: WAS_CIRCLE_START,
                      duration: WAS_CIRCLE_ENTER,
                      ease: EASE,
                      onComplete: () => {
                        hubEnteredRef.current = true;
                      },
                    }
                  : STATIC_TRANSITION
              }
            >
              <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={{ rotate: ringRotation }}
                transition={
                  isAnimPlaying && !hasFinished
                    ? { duration: WAS_REVEAL_DUR, ease: "linear" }
                    : STATIC_TRANSITION
                }
              >
                <svg
                  width={ringSize}
                  height={ringSize}
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                  className="block"
                >
                  <circle
                    cx={ringCenter}
                    cy={ringCenter}
                    r={ringRadius}
                    fill="none"
                    stroke="var(--purple)"
                    strokeWidth={ringStroke}
                    strokeDasharray={`${ringDashLength} ${ringDashGap}`}
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple"
                style={{ width: hubDotSize, height: hubDotSize }}
              />
            </motion.div>

            {BULLET_SLOTS.map((slot) => {
              const sideStyle =
                slot.side === "left"
                  ? {
                      right: `calc(50% + ${hubSideOffset}px)`,
                      width: bulletMaxW,
                    }
                  : {
                      left: `calc(50% + ${hubSideOffset}px)`,
                      width: bulletMaxW,
                    };

              return (
                <div
                  key={slot.key}
                  className="absolute flex"
                  style={{
                    ...sideStyle,
                    top: bulletTops[slot.index],
                    justifyContent: "flex-start",
                  }}
                >
                  {(visibleBullets > slot.index || hasFinished) && (
                    <motion.div
                      className="flex items-center text-left"
                      style={{
                        gap: bulletGap,
                        fontSize: bulletFontPx,
                        lineHeight: BULLET_LINE_HEIGHT,
                      }}
                      initial={
                        isAnimPlaying && !hasFinished
                          ? {
                              x: slot.from === "left" ? "-120vw" : "120vw",
                              opacity: 0,
                            }
                          : false
                      }
                      animate={{ x: 0, opacity: 1 }}
                      transition={
                        isAnimPlaying && !hasFinished
                          ? { duration: WAS_REVEAL_DUR, ease: EASE }
                          : STATIC_TRANSITION
                      }
                    >
                      <span
                        aria-hidden
                        className="shrink-0 rounded-full bg-purple"
                        style={{
                          width: bulletDotSize,
                          height: bulletDotSize,
                        }}
                      />
                      <p className="font-bricolage font-bold text-ink">
                        {WAS_ANDERS_BULLETS[slot.index].map((line) => (
                          <span key={line} className="block whitespace-nowrap">
                            {line}
                          </span>
                        ))}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showVideoFrame && (
          <motion.div
            layout={false}
            className="overflow-hidden bg-purple-deep"
            style={{
              marginTop: videoGap,
              width: videoW,
              height: videoH,
              borderRadius: videoRadius,
              padding: videoBorder,
            }}
            initial={
              !videoEnteredRef.current
                ? { x: "-120vw" }
                : false
            }
            animate={{ x: 0 }}
            transition={
              !videoEnteredRef.current && isAnimPlaying
                ? {
                    duration: WAS_VIDEO_ENTER,
                    ease: EASE,
                    onComplete: () => {
                      videoEnteredRef.current = true;
                    },
                  }
                : STATIC_TRANSITION
            }
          >
            <div
              className="relative h-full w-full overflow-hidden bg-cream"
              style={{
                borderRadius: Math.max(0, videoRadius - videoBorder),
              }}
            >
              <Image
                src="/simply-rational-logo.png"
                alt=""
                width={1024}
                height={512}
                className="h-full w-full object-cover opacity-30"
                aria-hidden
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-linear-to-t from-purple/80 to-transparent"
                style={{ height: "45%" }}
              />
            </div>
          </motion.div>
        )}

        {videoReservedH > 0 && !showVideoFrame && (
          <div aria-hidden style={{ height: videoReservedH }} />
        )}
      </div>
    </section>
  );
}
