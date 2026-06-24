"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BRAIN_ANIM_END,
  BRAIN_BALL_DUR,
  BRAIN_BALL_START,
  BRAIN_CLOSE_DELAY,
  BRAIN_CLOSE_DUR,
  BRAIN_CROSSFADE_DUR,
  BRAIN_EXIT_DUR,
  BRAIN_EXIT_START,
  BRAIN_SHIFT_DUR,
  BRAIN_SHIFT_START,
  BRAIN_TEXT_DUR,
  BRAIN_TEXT_START,
  BRAIN_VIDEO_START,
  EASE,
  EASE_BRAIN_CLOSE,
} from "@/app/lib/anim";
import { ENTSCHEIDBAR_TITLE_LINES, ENTSCHEIDUNG_HEADLINE_LINES, ENTSCHEIDUNG_MOBILE_HEADLINE_FIT_LINES } from "@/app/lib/fitText";
import {
  fitMobileHeadlinePx,
  fitSectionHeadlineFontPx,
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  BRAIN_BALL_SIZE_BASE,
  BRAIN_BALL_DROP_BASE,
  BRAIN_GAP_BASE,
  BRAIN_H_BASE,
  ENTSCHEIDBAR_TITLE_PX_DESIGN,
  BRAIN_VIDEO_BORDER_BASE,
  BRAIN_VIDEO_H_BASE,
  BRAIN_VIDEO_RADIUS_BASE,
  BRAIN_VIDEO_W_BASE,
  BRAIN_W_BASE,
  LINE_WIDTH_BASE,
  MOBILE_BRAIN_BALL_DROP_BASE,
  MOBILE_BRAIN_BALL_SIZE_BASE,
  MOBILE_BRAIN_GAP_BASE,
  MOBILE_BRAIN_H_BASE,
  MOBILE_BRAIN_W_BASE,
  MOBILE_BRAIN_VIDEO_W_BASE,
  MOBILE_BRAIN_VIDEO_H_BASE,
  MOBILE_BRAIN_VIDEO_RADIUS_BASE,
  MOBILE_BRAIN_VIDEO_BORDER_BASE,
  MOBILE_LINE_WIDTH_BASE,
  MOBILE_DESIGN_WIDTH,
  scalePx,
} from "@/app/lib/scale";

const HEADLINE_LINE_HEIGHT = 1.05;
const STATIC_TRANSITION = { duration: 0 };

export default function EntscheidungSection({
  heroIntroComplete,
}: {
  heroIntroComplete: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const videoEnteredRef = useRef(false);

  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [isAnimPlaying, setIsAnimPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [headlineFontPx, setHeadlineFontPx] = useState(ENTSCHEIDBAR_TITLE_PX_DESIGN);
  const [mobileHeadlinePx, setMobileHeadlinePx] = useState(32);

  const { viewportW, bodyFontPx, contentScale } =
    useSectionContentScale(isAnimPlayingRef);

  const isMobile = viewportW < 1024;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);

  useLayoutEffect(() => {
    if (isAnimPlayingRef.current) {
      return;
    }

    const serifFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-noto-serif-jp")
        .trim() || "serif";

    if (isMobile) {
      setMobileHeadlinePx(
        fitMobileHeadlinePx(
          ENTSCHEIDUNG_MOBILE_HEADLINE_FIT_LINES,
          viewportW,
          serifFont,
          48,
          18,
        ),
      );
    } else {
      setHeadlineFontPx(
        fitSectionHeadlineFontPx(
          viewportW,
          serifFont,
          ENTSCHEIDBAR_TITLE_LINES,
          ENTSCHEIDBAR_TITLE_PX_DESIGN,
          bodyFontPx,
        ),
      );
    }
  }, [viewportW, bodyFontPx, isMobile]);

  const mediaScale = isMobile ? mobileScale : contentScale;
  const brainW = isMobile
    ? scalePx(MOBILE_BRAIN_W_BASE, mobileScale, 48)
    : scalePx(BRAIN_W_BASE, contentScale, 48);
  const brainH = isMobile
    ? scalePx(MOBILE_BRAIN_H_BASE, mobileScale, 100)
    : scalePx(BRAIN_H_BASE, contentScale, 100);
  const brainGap = isMobile
    ? scalePx(MOBILE_BRAIN_GAP_BASE, mobileScale, 8)
    : scalePx(BRAIN_GAP_BASE, contentScale, 10);
  const ballSize = isMobile
    ? scalePx(MOBILE_BRAIN_BALL_SIZE_BASE, mobileScale, 8)
    : scalePx(BRAIN_BALL_SIZE_BASE, contentScale, 16);
  const lineWidth = isMobile
    ? scalePx(MOBILE_LINE_WIDTH_BASE, mobileScale, 1)
    : scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const headlineGap = scalePx(48, isMobile ? mobileScale : contentScale, 20);
  const activeFontPx = isMobile ? mobileHeadlinePx : headlineFontPx;
  const headlineLineCount = isMobile ? 4 : ENTSCHEIDUNG_HEADLINE_LINES.length;
  const headlineBlockH = Math.round(
    activeFontPx * HEADLINE_LINE_HEIGHT * headlineLineCount,
  );
  const brainShiftToCenter =
    headlineBlockH + headlineGap + scalePx(56, mediaScale, 24);
  const ballRiseEnd = -Math.round(ballSize * 1.2);
  const ballStartTop = brainH + (isMobile
    ? scalePx(MOBILE_BRAIN_BALL_DROP_BASE, mobileScale, 60)
    : scalePx(BRAIN_BALL_DROP_BASE, contentScale, 120));
  const lineRiseHeight = ballStartTop - ballRiseEnd;
  const availableW = sectionAvailableWidth(viewportW);
  const videoW = isMobile
    ? Math.min(scalePx(MOBILE_BRAIN_VIDEO_W_BASE, mobileScale, 120), availableW)
    : Math.min(scalePx(BRAIN_VIDEO_W_BASE, contentScale, 120), availableW);
  const videoH = isMobile
    ? scalePx(MOBILE_BRAIN_VIDEO_H_BASE, mobileScale, 140)
    : scalePx(BRAIN_VIDEO_H_BASE, contentScale, 140);
  const videoRadius = isMobile
    ? scalePx(MOBILE_BRAIN_VIDEO_RADIUS_BASE, mobileScale, 12)
    : scalePx(BRAIN_VIDEO_RADIUS_BASE, contentScale, 12);
  const videoBorder = isMobile
    ? scalePx(MOBILE_BRAIN_VIDEO_BORDER_BASE, mobileScale, 3)
    : scalePx(BRAIN_VIDEO_BORDER_BASE, contentScale, 3);
  const brainRestTop = brainShiftToCenter;
  const brainCenterY = brainRestTop + brainH / 2;
  const videoRestTop = Math.round(brainCenterY - videoH / 2);
  const mediaStageHeight = Math.max(
    brainRestTop + brainH + ballSize * 2,
    videoRestTop + videoH,
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

    const headlineTimer = window.setTimeout(
      () => setHeadlineVisible(true),
      BRAIN_TEXT_START * 1000,
    );
    const videoTimer = window.setTimeout(
      () => setVideoVisible(true),
      BRAIN_VIDEO_START * 1000,
    );
    const endTimer = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);
    }, BRAIN_ANIM_END * 1000);

    return () => {
      window.clearTimeout(headlineTimer);
      window.clearTimeout(videoTimer);
      window.clearTimeout(endTimer);
    };
  }, [isAnimPlaying]);

  const showBrainCluster = isAnimPlaying && !hasFinished;
  const showVideoFrame = videoVisible || hasFinished;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="entscheidung"
      className="relative w-full overflow-hidden bg-cream px-[6vw] pt-[6vh] pb-[5vh]"
    >
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center">
        {(headlineVisible || hasFinished) && (
          <motion.h2
            className="absolute left-1/2 z-20 -translate-x-1/2 text-center font-serif font-extrabold tracking-tight"
            style={{
              fontSize: activeFontPx,
              lineHeight: HEADLINE_LINE_HEIGHT,
              top: 0,
              width: isMobile ? "100%" : "fit-content",
              maxWidth: "100%",
            }}
            initial={
              isAnimPlaying && !hasFinished ? { x: "-120vw", opacity: 0 } : false
            }
            animate={{ x: "0vw", opacity: 1 }}
            transition={
              isAnimPlaying && !hasFinished
                ? { duration: BRAIN_TEXT_DUR, ease: EASE }
                : STATIC_TRANSITION
            }
          >
            {isMobile ? (
              <>
                <span className="text-ink">{ENTSCHEIDUNG_HEADLINE_LINES[0]}</span>
                <span className="text-purple">{" "}{ENTSCHEIDUNG_HEADLINE_LINES[1]}</span>
              </>
            ) : (
              <>
                <span className="block whitespace-nowrap text-ink">
                  {ENTSCHEIDUNG_HEADLINE_LINES[0]}
                </span>
                <span className="block whitespace-nowrap text-purple">
                  {ENTSCHEIDUNG_HEADLINE_LINES[1]}
                </span>
              </>
            )}
          </motion.h2>
        )}

        <div
          className="relative w-full overflow-visible"
          style={{ height: mediaStageHeight }}
        >
          {showBrainCluster && (
            <motion.div
              className="absolute left-1/2 flex items-start"
              style={{ top: 0 }}
              initial={{ x: "-50%", y: 0 }}
              animate={{ x: "calc(-50% + 110vw)", y: brainShiftToCenter }}
              transition={{
                y: {
                  delay: BRAIN_SHIFT_START,
                  duration: BRAIN_SHIFT_DUR,
                  ease: EASE,
                },
                x: {
                  delay: BRAIN_EXIT_START,
                  duration: BRAIN_EXIT_DUR,
                  ease: EASE,
                },
              }}
            >
              <motion.div
                style={{ width: brainW, height: brainH }}
                initial={{ x: "-55vw" }}
                animate={{ x: "0vw" }}
                transition={{
                  delay: BRAIN_CLOSE_DELAY,
                  duration: BRAIN_CLOSE_DUR,
                  ease: EASE_BRAIN_CLOSE,
                }}
              >
                <Image
                  src="/left_brain.svg"
                  alt=""
                  width={232}
                  height={516}
                  className="block h-full w-full"
                  aria-hidden
                />
              </motion.div>

              <div
                className="relative shrink-0 overflow-visible"
                style={{ width: brainGap, height: brainH }}
              >
                <motion.div
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 bg-purple"
                  style={{ width: lineWidth }}
                  initial={{
                    top: ballStartTop,
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    top: ballRiseEnd,
                    height: lineRiseHeight,
                    opacity: 1,
                  }}
                  transition={{
                    duration: BRAIN_BALL_DUR,
                    delay: BRAIN_BALL_START,
                    ease: EASE,
                  }}
                />

                <motion.div
                  aria-hidden
                  className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-purple"
                  style={{ width: ballSize, height: ballSize }}
                  initial={{ top: ballStartTop, opacity: 0 }}
                  animate={{ top: ballRiseEnd, opacity: 1 }}
                  transition={{
                    duration: BRAIN_BALL_DUR,
                    delay: BRAIN_BALL_START,
                    ease: EASE,
                  }}
                />
              </div>

              <motion.div
                style={{ width: brainW, height: brainH }}
                initial={{ x: "55vw" }}
                animate={{ x: "0vw" }}
                transition={{
                  delay: BRAIN_CLOSE_DELAY,
                  duration: BRAIN_CLOSE_DUR,
                  ease: EASE_BRAIN_CLOSE,
                }}
              >
                <Image
                  src="/right_brain.svg"
                  alt=""
                  width={232}
                  height={516}
                  className="block h-full w-full"
                  aria-hidden
                />
              </motion.div>
            </motion.div>
          )}

          {showVideoFrame && (
            <motion.div
              layout={false}
              className="absolute left-1/2 overflow-hidden bg-purple-deep"
              style={{
                top: videoRestTop,
                width: videoW,
                height: videoH,
                borderRadius: videoRadius,
                padding: videoBorder,
              }}
              initial={
                !videoEnteredRef.current
                  ? { x: "calc(-50% - 120vw)", opacity: 0 }
                  : false
              }
              animate={{ x: "-50%", opacity: 1 }}
              transition={
                !videoEnteredRef.current && isAnimPlaying
                  ? {
                      duration: BRAIN_CROSSFADE_DUR,
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
        </div>
      </div>
    </section>
  );
}
