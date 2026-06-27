"use client";

import { motion } from "motion/react";
import { EASE, EASE_BOUNCE, MOBILE_STEPS } from "@/app/lib/anim";
import {
  BLACK_TITLE_LINES,
  MOBILE_DESCRIPTION_LINES,
  MOBILE_PURPLE_TITLE_LINES,
} from "@/app/lib/fitText";
import { scalePx, MOBILE_DESIGN_WIDTH, MOBILE_DESC_BALL_GAP_BASE, MOBILE_FINAL_LINE_W_BASE, MOBILE_FINAL_ROW_INSET_BASE } from "@/app/lib/scale";
import ScrollHintArrow from "@/app/components/ScrollHintArrow";

const STATIC_TRANSITION = { duration: 0 };

interface HeroMobileProps {
  isIntroPlaying: boolean;
  isLayoutReady: boolean;
  titleFontPx: number;
  titleLineH: number;
  descFontPx: number;
  descLineHeightRatio: number;
  ballSize: number;
  lineWidth: number;
  dashLength: number;
  dashPeriod: number;
  navHeight: number;
  contentScale: number;
  viewportW: number;
  viewportH: number;
  showScrollHint?: boolean;
}

export default function HeroMobile({
  isIntroPlaying,
  isLayoutReady,
  titleFontPx,
  titleLineH,
  descFontPx,
  descLineHeightRatio,
  ballSize,
  lineWidth,
  dashLength,
  dashPeriod,
  navHeight,
  contentScale,
  viewportW,
  viewportH,
  showScrollHint = false,
}: HeroMobileProps) {
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const navGap = scalePx(32, contentScale, 20);
  const blackTitleH = BLACK_TITLE_LINES.length * titleLineH;
  const blackCenterTop = Math.round(
    viewportH / 2 - blackTitleH / 2 - scalePx(24, contentScale, 16),
  );
  const blackFinalTop = navHeight + navGap;
  const dividerMarginTop = scalePx(36, contentScale, 20);
  const dividerMarginBottom = scalePx(12, contentScale, 8);
  const descMarginTop = scalePx(56, contentScale, 32);
  const descBallGap = scalePx(MOBILE_DESC_BALL_GAP_BASE, mobileScale, 8);
  const finalRowInset = scalePx(MOBILE_FINAL_ROW_INSET_BASE, mobileScale, 12);
  const descExtraInset = scalePx(10, mobileScale, 6);
  const dashGapInGroup = scalePx(8, mobileScale, 4);
  const trailingLineW = Math.round(viewportW * 0.44);
  const finalLineW = scalePx(MOBILE_FINAL_LINE_W_BASE, mobileScale, 36);
  const centerBallSlotH = Math.max(ballSize + 8, scalePx(40, contentScale, 30));
  const descRowBallOffset = Math.max(
    0,
    Math.round((descFontPx * descLineHeightRatio * 2 - ballSize) / 2),
  );

  const offR = Math.round(viewportW);
  const offL = -offR;

  const blackDur =
    MOBILE_STEPS.blackShiftUp.delay +
    MOBILE_STEPS.blackShiftUp.duration -
    MOBILE_STEPS.blackEnter.delay;
  const black_t1 = MOBILE_STEPS.blackEnter.duration / blackDur;
  const black_t2 =
    (MOBILE_STEPS.blackShiftUp.delay - MOBILE_STEPS.blackEnter.delay) / blackDur;

  const ballDur =
    MOBILE_STEPS.ballCrossExit.delay +
    MOBILE_STEPS.ballCrossExit.duration -
    MOBILE_STEPS.ballCrossEnter.delay;
  const ball_tMid = MOBILE_STEPS.ballCrossEnter.duration / ballDur;
  const ball_tExit =
    (MOBILE_STEPS.ballCrossExit.delay - MOBILE_STEPS.ballCrossEnter.delay) / ballDur;
  const lineExpandX = -(viewportW / 2 + ballSize / 2 + dashGapInGroup);

  const dashStyle = {
    height: `${lineWidth}px`,
    backgroundImage: `repeating-linear-gradient(90deg, var(--purple) 0, var(--purple) ${dashLength}px, transparent ${dashLength}px, transparent ${dashPeriod}px)`,
    backgroundRepeat: "repeat-x" as const,
    backgroundSize: `${dashPeriod}px ${lineWidth}px`,
  };

  if (!isLayoutReady) {
    return <main className="relative flex min-h-screen flex-col lg:hidden" />;
  }

  return (
    <main className="relative lg:hidden">
      <motion.h1
        className="absolute inset-x-0 z-30 px-[5vw] text-center font-serif font-extrabold tracking-tight text-ink"
        style={{ fontSize: titleFontPx, lineHeight: `${titleLineH}px` }}
        initial={
          isIntroPlaying
            ? { x: "-110vw", top: blackCenterTop, opacity: 0 }
            : false
        }
        animate={
          isIntroPlaying
            ? {
                x: ["-110vw", "0vw", "0vw", "0vw"],
                top: [blackCenterTop, blackCenterTop, blackCenterTop, blackFinalTop],
                opacity: [0, 1, 1, 1],
              }
            : { x: "0vw", top: blackFinalTop, opacity: 1 }
        }
        transition={
          isIntroPlaying
            ? {
                duration: blackDur,
                delay: MOBILE_STEPS.blackEnter.delay,
                times: [0, black_t1, black_t2, 1],
                ease: [EASE_BOUNCE, EASE, EASE],
              }
            : STATIC_TRANSITION
        }
      >
        {BLACK_TITLE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.h1>

      <div
        className="flex flex-col items-center px-[5vw]"
        style={{
          paddingTop: blackFinalTop + blackTitleH,
          paddingBottom: "8vh",
        }}
      >
        <div className="flex w-full flex-col items-center">
          <div
            className="relative w-screen max-w-none -translate-x-1/2 overflow-hidden"
            style={{
              left: "50%",
              height: centerBallSlotH,
              marginTop: dividerMarginTop,
              marginBottom: dividerMarginBottom,
            }}
          >
            <motion.div
              aria-hidden
              className="absolute top-1/2 flex -translate-y-1/2 items-center"
              style={{ left: "50%" }}
              initial={isIntroPlaying ? { x: offR, opacity: 0 } : false}
              animate={
                isIntroPlaying
                  ? { x: [offR, 0, 0], opacity: [0, 1, 1] }
                  : { x: 0, opacity: 1 }
              }
              transition={
                isIntroPlaying
                  ? {
                      duration: ballDur,
                      delay: MOBILE_STEPS.ballCrossEnter.delay,
                      times: [0, ball_tMid, 1],
                      ease: EASE,
                    }
                  : STATIC_TRANSITION
              }
            >
              <motion.div
                className="shrink-0 rounded-full bg-purple"
                style={{
                  width: ballSize,
                  height: ballSize,
                  marginLeft: -ballSize / 2,
                  zIndex: 1,
                }}
                initial={isIntroPlaying ? { x: 0 } : false}
                animate={
                  isIntroPlaying
                    ? { x: [0, 0, offL] }
                    : { x: offL }
                }
                transition={
                  isIntroPlaying
                    ? {
                        duration: ballDur,
                        delay: MOBILE_STEPS.ballCrossEnter.delay,
                        times: [0, ball_tExit, 1],
                        ease: EASE,
                      }
                    : STATIC_TRANSITION
                }
              />

              <motion.div
                style={{
                  ...dashStyle,
                  width: trailingLineW,
                  marginLeft: dashGapInGroup,
                  flexShrink: 0,
                }}
                initial={isIntroPlaying ? { x: 0 } : false}
                animate={
                  isIntroPlaying
                    ? {
                        width: [trailingLineW, trailingLineW, viewportW],
                        x: [0, 0, lineExpandX],
                      }
                    : {
                        width: viewportW,
                        x: lineExpandX,
                      }
                }
                transition={
                  isIntroPlaying
                    ? {
                        duration: ballDur,
                        delay: MOBILE_STEPS.ballCrossEnter.delay,
                        times: [0, ball_tExit, 1],
                        ease: EASE,
                      }
                    : STATIC_TRANSITION
                }
              />
            </motion.div>
          </div>

          <motion.h2
            className="w-full text-center font-serif font-extrabold tracking-tight text-purple"
            style={{ fontSize: titleFontPx, lineHeight: `${titleLineH}px` }}
            initial={isIntroPlaying ? { x: "-110vw", opacity: 0 } : false}
            animate={
              isIntroPlaying
                ? { x: ["-110vw", "0vw"], opacity: [0, 1] }
                : { x: "0vw", opacity: 1 }
            }
            transition={
              isIntroPlaying
                ? {
                    duration: MOBILE_STEPS.purpleEnter.duration,
                    delay: MOBILE_STEPS.purpleEnter.delay,
                    ease: EASE,
                  }
                : STATIC_TRANSITION
            }
          >
            {MOBILE_PURPLE_TITLE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h2>

          <div
            className="relative left-1/2 w-screen -translate-x-1/2"
            style={{ marginTop: descMarginTop }}
          >
            <div className="flex items-start pr-[5vw]">
              <motion.div
                className="flex shrink-0 items-center"
                style={{ marginTop: descRowBallOffset }}
                initial={isIntroPlaying ? { x: -viewportW, opacity: 0 } : false}
                animate={
                  isIntroPlaying
                    ? { x: [-viewportW, finalRowInset], opacity: [0, 1] }
                    : { x: finalRowInset, opacity: 1 }
                }
                transition={
                  isIntroPlaying
                    ? {
                        duration: MOBILE_STEPS.finalReveal.duration,
                        delay: MOBILE_STEPS.finalReveal.delay,
                        ease: EASE,
                      }
                    : STATIC_TRANSITION
                }
              >
                <div
                  aria-hidden
                  style={{
                    ...dashStyle,
                    width: finalLineW,
                    minWidth: finalLineW,
                    flexShrink: 0,
                    backgroundPosition: "right center",
                  }}
                />
                <div
                  className="shrink-0 rounded-full bg-purple"
                  style={{ width: ballSize, height: ballSize }}
                />
              </motion.div>

              <motion.p
                className="font-bricolage min-w-0 flex-1 text-left font-medium text-ink"
                style={{
                  fontSize: descFontPx,
                  lineHeight: descLineHeightRatio,
                  marginLeft: descBallGap + descExtraInset,
                }}
                initial={isIntroPlaying ? { x: viewportW * 2, opacity: 0 } : false}
                animate={
                  isIntroPlaying
                    ? { x: [viewportW * 2, finalRowInset + descExtraInset], opacity: [0, 1] }
                    : { x: finalRowInset + descExtraInset, opacity: 1 }
                }
                transition={
                  isIntroPlaying
                    ? {
                        duration: MOBILE_STEPS.finalReveal.duration,
                        delay: MOBILE_STEPS.finalReveal.delay,
                        ease: EASE,
                      }
                    : STATIC_TRANSITION
                }
              >
                {MOBILE_DESCRIPTION_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <ScrollHintArrow visible={showScrollHint} />
    </main>
  );
}
