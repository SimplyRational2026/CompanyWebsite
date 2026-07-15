"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EASE,
  EASE_BOUNCE,
  MOBILE_WAS_ANIM_END,
  MOBILE_WAS_HUB_START,
  MOBILE_WAS_VIDEO_START,
  WAS_ANIM_END,
  WAS_CIRCLE_ENTER,
  WAS_CIRCLE_START,
  WAS_HUB_START,
  WAS_REVEAL_DUR,
  WAS_RING_SPIN_DUR,
  WAS_RING_SPIN_STEP,
  WAS_TEXT_CYCLE,
  WAS_TITLE_ENTER,
  WAS_TITLE_PAUSE,
  WAS_TITLE_PHASE,
  WAS_VIDEO_ENTER,
  WAS_VIDEO_START,
} from "@/app/lib/anim";
import ScrollHintArrow from "@/app/components/ui/ScrollHintArrow";
import VideoPlayer from "@/app/components/ui/VideoPlayer";
import { fitMobileBodyFontPx, WAS_ANDERS_BULLETS, WAS_ANDERS_TITLE } from "@/app/lib/fitText";
import { useContent } from "@/app/lib/i18n";
import {
  fitMobileHeadlinePx,
  fitSectionHeadlineFontPx,
  fitWasHubLayout,
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  BRAIN_VIDEO_BORDER_BASE,
  BRAIN_VIDEO_RADIUS_BASE,
  BRAIN_VIDEO_W_BASE,
  LINE_WIDTH_BASE,
  MOBILE_BRAIN_VIDEO_BORDER_BASE,
  MOBILE_BRAIN_VIDEO_RADIUS_BASE,
  MOBILE_BRAIN_VIDEO_W_BASE,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  MOBILE_LINE_WIDTH_BASE,
  MOBILE_WAS_BULLET_DOT_BASE,
  MOBILE_WAS_HUB_DOT_SIZE_BASE,
  MOBILE_WAS_RING_SIZE_BASE,
  scalePx,
  WAS_ANDERS_TITLE_ENTER_PX_DESIGN,
  WAS_ANDERS_TITLE_PX_DESIGN,
  WAS_HUB_BULLET_DOT_BASE,
  WAS_HUB_DOT_SIZE_BASE,
  WAS_HUB_GAP_BASE,
  WAS_HUB_RING_DASH_COUNT,
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
  const content = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const videoEnteredRef = useRef(false);
  const hubEnteredRef = useRef(false);

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

  const [visibleBullets, setVisibleBullets] = useState(0);
  const [ringRotation, setRingRotation] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);
  const [titleRestPx, setTitleRestPx] = useState(WAS_ANDERS_TITLE_PX_DESIGN);
  const [mobileTitlePx, setMobileTitlePx] = useState(36);
  const [mobileBodyFontPx, setMobileBodyFontPx] = useState(MOBILE_DESC_PX_DESIGN);

  const { viewportW, bodyFontPx, contentScale } =
    useSectionContentScale(isAnimPlayingRef);

  const isMobile = viewportW < 1024;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const mobileDescCap = Math.round(MOBILE_DESC_PX_DESIGN * mobileScale);

  useLayoutEffect(() => {
    if (isAnimPlayingRef.current) {
      return;
    }

    const serifFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-noto-serif-jp")
        .trim() || "serif";

    if (isMobile) {
      const bricolageFont =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-bricolage-grotesque")
          .trim() || "sans-serif";
      setMobileTitlePx(fitMobileHeadlinePx());
      setMobileBodyFontPx(fitMobileBodyFontPx(viewportW, bricolageFont));
    } else {
      setTitleRestPx(
        fitSectionHeadlineFontPx(
          viewportW,
          serifFont,
          [WAS_ANDERS_TITLE],
          WAS_ANDERS_TITLE_PX_DESIGN,
          bodyFontPx,
        ),
      );
    }
  }, [viewportW, bodyFontPx, isMobile, mobileDescCap]);

  const mobileRingSize = scalePx(MOBILE_WAS_RING_SIZE_BASE, mobileScale, 80);
  const mobileRingStroke = scalePx(MOBILE_LINE_WIDTH_BASE, mobileScale, 1);
  const mobileHubDotSize = scalePx(MOBILE_WAS_HUB_DOT_SIZE_BASE, mobileScale, 12);
  const mobileBulletDotSize = scalePx(MOBILE_WAS_BULLET_DOT_BASE, mobileScale, 6);
  const mobileRingRadius = Math.max(0, (mobileRingSize - mobileRingStroke) / 2);
  const mobileRingCircum = 2 * Math.PI * mobileRingRadius;
  const mobileRingDashCount = Math.round(WAS_HUB_RING_DASH_COUNT * 0.66);
  const mobileRingDashLength = (mobileRingCircum / mobileRingDashCount) * 0.58;
  const mobileRingDashGap = (mobileRingCircum / mobileRingDashCount) * 0.42;
  const mobileRingCenter = mobileRingSize / 2;
  const mobileVideoW = Math.min(
    scalePx(MOBILE_BRAIN_VIDEO_W_BASE, mobileScale, 120),
    sectionAvailableWidth(viewportW),
  );
  const mobileVideoH = mobileVideoW;
  const mobileVideoRadius = scalePx(MOBILE_BRAIN_VIDEO_RADIUS_BASE, mobileScale, 12);
  const mobileVideoBorder = scalePx(MOBILE_BRAIN_VIDEO_BORDER_BASE, mobileScale, 3);
  const mobileVideoGap = scalePx(WAS_VIDEO_GAP_BASE, mobileScale, 32);
  const mobileBulletGap = scalePx(28, mobileScale, 14);

  const titleLargePx = scalePx(
    WAS_ANDERS_TITLE_ENTER_PX_DESIGN,
    contentScale,
    40,
  );
  const bulletFontPx = bodyFontPx;
  const titleHubGap = scalePx(WAS_HUB_GAP_BASE, contentScale, 24);
  const hubDotSize = scalePx(WAS_HUB_DOT_SIZE_BASE, contentScale, 32);
  const ringStroke = scalePx(LINE_WIDTH_BASE, contentScale, 2);
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
  const videoH = videoW;
  const videoRadius = scalePx(BRAIN_VIDEO_RADIUS_BASE, contentScale, 12);
  const videoBorder = scalePx(BRAIN_VIDEO_BORDER_BASE, contentScale, 3);
  const videoGap = scalePx(WAS_VIDEO_GAP_BASE, contentScale, 32);
  const titleBlockH = Math.round(
    Math.max(titleRestPx, titleLargePx) * 1.15,
  );

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

    const hubStart = isMobile ? MOBILE_WAS_HUB_START : WAS_HUB_START;
    const videoStart = isMobile ? MOBILE_WAS_VIDEO_START : WAS_VIDEO_START;
    const animEnd = isMobile ? MOBILE_WAS_ANIM_END : WAS_ANIM_END;

    const revealTimers: number[] = [];

    for (let i = 0; i < 4; i++) {
      const revealAt = (hubStart + i * WAS_TEXT_CYCLE) * 1000;

      revealTimers.push(
        window.setTimeout(() => {
          setRingRotation((prev) => prev + WAS_RING_SPIN_STEP);
          setVisibleBullets(i + 1);
        }, revealAt),
      );
    }

    const videoTimer = window.setTimeout(
      () => setVideoVisible(true),
      videoStart * 1000,
    );

    const endTimer = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);
      setVisibleBullets(4);
      setRingRotation(WAS_RING_SPIN_STEP * 4);
    }, animEnd * 1000);

    return () => {
      revealTimers.forEach(window.clearTimeout);
      window.clearTimeout(videoTimer);
      window.clearTimeout(endTimer);
    };
  }, [isAnimPlaying, isMobile]);

  const titleTimes = [
    0,
    WAS_TITLE_ENTER / WAS_TITLE_PHASE,
    (WAS_TITLE_ENTER + WAS_TITLE_PAUSE) / WAS_TITLE_PHASE,
    1,
  ];

  const showHub = isAnimPlaying || hasFinished || isMobile;
  const showVideoFrame = videoVisible || hasFinished;
  const hubEnterY = scalePx(WAS_HUB_ENTER_DROP_BASE, contentScale, 120);
  const showTitle = isAnimPlaying || hasFinished;
  const videoReservedH =
    isAnimPlaying || hasFinished ? videoGap + videoH : 0;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="was-anders"
      className="relative w-full overflow-x-hidden bg-cream px-[6vw] pt-[3vh] pb-[8vh] lg:pt-[6vh] lg:pb-[16vh]"
    >
      <div className="flex w-full flex-col lg:hidden">
        <motion.h2
          className="w-full text-center font-serif font-extrabold tracking-tight text-purple"
          style={{ fontSize: mobileTitlePx, lineHeight: 1.15 }}
          initial={{ x: "-120vw", opacity: 0 }}
          animate={
            isAnimPlaying && !hasFinished
              ? { x: ["-120vw", "0px", "0px"], opacity: [0, 1, 1] }
              : hasFinished
                ? { x: "0px", opacity: 1 }
                : { x: "-120vw", opacity: 0 }
          }
          transition={
            isAnimPlaying && !hasFinished
              ? {
                  duration: WAS_TITLE_PHASE,
                  times: [0, WAS_TITLE_ENTER / WAS_TITLE_PHASE, 1],
                  ease: [EASE, EASE],
                }
              : STATIC_TRANSITION
          }
        >
          {content.wasAnders.title}
        </motion.h2>

        <div
          className="relative overflow-hidden"
          style={{
            marginTop: scalePx(WAS_HUB_GAP_BASE, mobileScale, 16),
            marginLeft: -Math.round(viewportW * 0.06),
            width: viewportW,
          }}
        >
          <div
            className="flex flex-col"
            style={{
              gap: mobileBulletGap,
              paddingLeft: Math.round(mobileRingSize / 2) + scalePx(16, mobileScale, 8),
              paddingRight: Math.round(viewportW * 0.06),
            }}
          >
            {WAS_ANDERS_BULLETS.map((_, i) => {
              const revealed = visibleBullets > i || hasFinished;
              return (
                <motion.div
                  key={i}
                  className="flex items-start text-left"
                  style={{
                    gap: scalePx(12, mobileScale, 6),
                    fontSize: mobileBodyFontPx,
                    lineHeight: BULLET_LINE_HEIGHT,
                  }}
                  initial={{ x: "120vw", opacity: 0 }}
                  animate={
                    revealed
                      ? { x: 0, opacity: 1 }
                      : { x: "120vw", opacity: 0 }
                  }
                  transition={
                    revealed && (isAnimPlaying || hasFinished)
                      ? { duration: WAS_REVEAL_DUR, ease: EASE }
                      : STATIC_TRANSITION
                  }
                >
                  <span
                    aria-hidden
                    className="mt-[0.3em] shrink-0 rounded-full bg-purple"
                    style={{ width: mobileBulletDotSize, height: mobileBulletDotSize }}
                  />
                  <p className="font-bricolage font-bold text-ink">
                    {content.wasAnders.bullets[i].join(" ")}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
            <div
              className="relative"
              style={{ marginLeft: -Math.round(mobileRingSize / 2), width: mobileRingSize, height: mobileRingSize }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={{ rotate: ringRotation }}
                transition={{ duration: WAS_RING_SPIN_DUR, ease: EASE }}
              >
                <svg
                  width={mobileRingSize}
                  height={mobileRingSize}
                  viewBox={`0 0 ${mobileRingSize} ${mobileRingSize}`}
                  className="block"
                >
                  <circle
                    cx={mobileRingCenter}
                    cy={mobileRingCenter}
                    r={mobileRingRadius}
                    fill="none"
                    stroke="var(--purple)"
                    strokeWidth={mobileRingStroke}
                    strokeDasharray={`${mobileRingDashLength} ${mobileRingDashGap}`}
                    strokeLinecap="butt"
                  />
                </svg>
              </motion.div>
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple"
                style={{ width: mobileHubDotSize, height: mobileHubDotSize }}
              />
            </div>
          </div>
        </div>

        {showVideoFrame && (
          <motion.div
            layout={false}
            className="overflow-hidden bg-purple-deep"
            style={{
              marginTop: mobileVideoGap,
              width: mobileVideoW,
              height: mobileVideoH,
              borderRadius: mobileVideoRadius,
              padding: mobileVideoBorder,
              alignSelf: "center",
            }}
            initial={!videoEnteredRef.current ? { x: "-120vw" } : false}
            animate={{ x: 0 }}
            transition={
              !videoEnteredRef.current && isAnimPlaying
                ? {
                    duration: WAS_VIDEO_ENTER,
                    ease: EASE,
                    onComplete: () => { videoEnteredRef.current = true; },
                  }
                : STATIC_TRANSITION
            }
          >
            <VideoPlayer
              src="/susanne-video.mp4"
              poster="/susanne-poster.jpg"
              radius={Math.max(0, mobileVideoRadius - mobileVideoBorder)}
              label="Susanne video"
            />
          </motion.div>
        )}
      </div>

      <div className="hidden w-full lg:block">
        <div
          className="flex w-full justify-center"
          style={{ minHeight: titleBlockH }}
        >
          {showTitle && (
            <motion.h2
              className="w-fit whitespace-nowrap text-center font-serif font-extrabold tracking-tight text-purple"
              style={{
                fontSize: titleRestPx,
                lineHeight: 1.15,
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
                      fontSize: [titleLargePx, titleLargePx, titleLargePx, titleRestPx],
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
              {content.wasAnders.title}
            </motion.h2>
          )}
        </div>

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center">
          {showHub && (
            <div
              className="relative overflow-visible"
              style={{ marginTop: titleHubGap, width: hubGridW, height: hubStageH }}
            >
              <motion.div
                layout={false}
                className="absolute left-1/2 z-10 -translate-x-1/2"
                style={{ top: hubRestTop, width: ringSize, height: ringSize }}
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
                        onComplete: () => { hubEnteredRef.current = true; },
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
                      ? { duration: WAS_RING_SPIN_DUR, ease: EASE }
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
                      strokeLinecap="butt"
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
                    ? { right: `calc(50% + ${hubSideOffset}px)`, width: bulletMaxW }
                    : { left: `calc(50% + ${hubSideOffset}px)`, width: bulletMaxW };

                return (
                  <div
                    key={slot.key}
                    className="absolute flex"
                    style={{ ...sideStyle, top: bulletTops[slot.index], justifyContent: "flex-start" }}
                  >
                    {(visibleBullets > slot.index || hasFinished) && (
                      <motion.div
                        className="flex items-center text-left"
                        style={{ gap: bulletGap, fontSize: bulletFontPx, lineHeight: BULLET_LINE_HEIGHT }}
                        initial={
                          isAnimPlaying && !hasFinished
                            ? { x: slot.from === "left" ? "-120vw" : "120vw", opacity: 0 }
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
                          style={{ width: bulletDotSize, height: bulletDotSize }}
                        />
                        <p className="font-bricolage font-bold text-ink">
                          {content.wasAnders.bullets[slot.index].map((line) => (
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
              style={{ marginTop: videoGap, width: videoW, height: videoH, borderRadius: videoRadius, padding: videoBorder }}
              initial={!videoEnteredRef.current ? { x: "-120vw" } : false}
              animate={{ x: 0 }}
              transition={
                !videoEnteredRef.current && isAnimPlaying
                  ? {
                      duration: WAS_VIDEO_ENTER,
                      ease: EASE,
                      onComplete: () => { videoEnteredRef.current = true; },
                    }
                  : STATIC_TRANSITION
              }
            >
              <VideoPlayer
                src="/susanne-video.mp4"
                poster="/susanne-poster.jpg"
                radius={Math.max(0, videoRadius - videoBorder)}
                label="Susanne video"
              />
            </motion.div>
          )}

          {videoReservedH > 0 && !showVideoFrame && (
            <div aria-hidden style={{ height: videoReservedH }} />
          )}
        </div>
      </div>
      <ScrollHintArrow visible={showScrollHint} />
    </section>
  );
}
