"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  EASE,
  EASE_BOUNCE,
  ENT_ANIM_END,
  ENT_BALL_DESCENT_START,
  ENT_BALL_MOVE,
  ENT_BALL_ENTER,
  ENT_BRANCH_CYCLE,
  ENT_BRANCH_REVEAL,
  ENT_BRANCH_START,
  ENT_ENTER_PAUSE,
  ENT_LINE_RETRACT,
  ENT_LINE_RETRACT_END,
  ENT_LINE_RETRACT_START,
  ENT_PRE_TREE,
  ENT_SPINE_GROW,
  ENT_TITLE_SHRINK,
  ENT_TITLE_SHRINK_START,
} from "@/app/lib/anim";
import {
  ENTSCHEIDBAR_BRANCHES,
  ENTSCHEIDBAR_TITLE_LINES,
} from "@/app/lib/fitText";
import {
  fitEntscheidbarTreeLayout,
  fitSectionHeadlineFontPx,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  ENTSCHEIDBAR_TITLE_ENTER_PX_DESIGN,
  ENTSCHEIDBAR_TITLE_PX_DESIGN,
  ENT_TREE_BALL_SIZE_BASE,
  ENT_TREE_BULLET_DOT_BASE,
  ENT_TREE_ICON_SIZE_BASE,
  ENT_TREE_LINE_W_BASE,
  ENT_TREE_ICON_LINE_NUDGE,
  ENT_TREE_FIRST_BRANCH_RATIO,
  ENT_TREE_SPINE_BOTTOM_BASE,
  ENT_TREE_TITLE_GAP_BASE,
  scalePx,
} from "@/app/lib/scale";

const TITLE_LINE_HEIGHT = 1.05;
const BRANCH_TEXT_LINE_HEIGHT = 1.3;
const STATIC_TRANSITION = { duration: 0 };

export default function EntscheidbarSection({
  heroIntroComplete,
}: {
  heroIntroComplete: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [isAnimPlaying, setIsAnimPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [showSpine, setShowSpine] = useState(false);
  const [horizLineRetracted, setHorizLineRetracted] = useState(false);
  const [titleShrinking, setTitleShrinking] = useState(false);
  const [visibleBranches, setVisibleBranches] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [ballCanMove, setBallCanMove] = useState(false);
  const [titleRestPx, setTitleRestPx] = useState(ENTSCHEIDBAR_TITLE_PX_DESIGN);

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
        ENTSCHEIDBAR_TITLE_LINES,
        ENTSCHEIDBAR_TITLE_PX_DESIGN,
        bodyFontPx,
      ),
    );
  }, [viewportW, bodyFontPx]);

  const titleLargePx = scalePx(
    ENTSCHEIDBAR_TITLE_ENTER_PX_DESIGN,
    contentScale,
    40,
  );
  const titleTreeGap = scalePx(ENT_TREE_TITLE_GAP_BASE, contentScale, 24);
  const ballSize = scalePx(ENT_TREE_BALL_SIZE_BASE, contentScale, 32);
  const lineW = scalePx(ENT_TREE_LINE_W_BASE, contentScale, 2);
  const bulletDotSize = scalePx(ENT_TREE_BULLET_DOT_BASE, contentScale, 10);
  const branchFontPx = bodyFontPx;
  const spineBottomPad = scalePx(ENT_TREE_SPINE_BOTTOM_BASE, contentScale, 32);

  const {
    branchLineW,
    iconSize,
    textMaxW,
    branchSpacing,
    branchInnerGap,
    treeStageW,
  } = fitEntscheidbarTreeLayout(contentScale, viewportW);

  const iconLineReach = Math.round(iconSize / 2);
  const firstBranchTop = Math.round(branchSpacing * ENT_TREE_FIRST_BRANCH_RATIO);

  const branchTops = useMemo(
    () =>
      ENTSCHEIDBAR_BRANCHES.map((_, index) =>
        index === 0
          ? firstBranchTop
          : firstBranchTop + branchSpacing * index,
      ),
    [branchSpacing, firstBranchTop],
  );
  const ballTargets = useMemo(
    () => [
      ...branchTops,
      branchSpacing * ENTSCHEIDBAR_BRANCHES.length + spineBottomPad,
    ],
    [branchTops, branchSpacing, spineBottomPad],
  );
  const spineHeight = ballTargets[ballTargets.length - 1] + ballSize / 2;
  const spineBodyHeight = spineHeight - ballSize / 2;
  const treeStageH = spineHeight + ballSize;
  const horizLineLength = Math.ceil(viewportW * 0.58);

  const titleBlockH = Math.round(
    Math.max(titleRestPx, titleLargePx) * TITLE_LINE_HEIGHT * 2,
  );

  useEffect(() => {
    if (!heroIntroComplete || !isInView || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    isAnimPlayingRef.current = true;
    setIsAnimPlaying(true);
    setShowTree(true);
  }, [heroIntroComplete, isInView]);

  useEffect(() => {
    if (!isAnimPlaying) {
      return;
    }

    const timers: number[] = [];

    timers.push(
      window.setTimeout(
        () => setHorizLineRetracted(true),
        ENT_LINE_RETRACT_START * 1000,
      ),
    );

    timers.push(
      window.setTimeout(
        () => setTitleShrinking(true),
        ENT_TITLE_SHRINK_START * 1000,
      ),
    );

    timers.push(
      window.setTimeout(() => setShowSpine(true), ENT_PRE_TREE * 1000),
    );

    for (let i = 0; i < ENTSCHEIDBAR_BRANCHES.length; i++) {
      const moveAt = (ENT_BRANCH_START + i * ENT_BRANCH_CYCLE) * 1000;

      timers.push(
        window.setTimeout(() => {
          if (i === 0) {
            setBallCanMove(true);
          }
          setBallY(ballTargets[i]);
          setVisibleBranches(i + 1);
        }, moveAt),
      );
    }

    timers.push(
      window.setTimeout(() => {
        setBallY(ballTargets[ballTargets.length - 1]);
      }, ENT_BALL_DESCENT_START * 1000),
    );

    timers.push(
      window.setTimeout(() => {
        isAnimPlayingRef.current = false;
        setIsAnimPlaying(false);
        setHasFinished(true);
        setVisibleBranches(ENTSCHEIDBAR_BRANCHES.length);
        setBallY(ballTargets[ballTargets.length - 1]);
        setBallCanMove(true);
        setHorizLineRetracted(true);
        setTitleShrinking(true);
        setShowSpine(true);
      }, ENT_ANIM_END * 1000),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [isAnimPlaying, ballTargets]);

  const showTitle = isAnimPlaying || hasFinished;
  const showTreeStage = showTree || hasFinished;
  const spineVisible = showSpine || hasFinished;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="entscheidbar"
      className="relative w-full overflow-x-hidden bg-cream px-[6vw] pt-[6vh] pb-[8vh]"
    >
      <div
        className="flex w-full justify-center"
        style={{ minHeight: titleBlockH }}
      >
        {showTitle && (
          <motion.h2
            className="w-fit text-center font-serif font-extrabold tracking-tight"
            style={{
              fontSize: titleLargePx,
              lineHeight: TITLE_LINE_HEIGHT,
              transformOrigin: "center center",
            }}
            initial={
              isAnimPlaying && !hasFinished
                ? { x: "-120vw", opacity: 0 }
                : false
            }
            animate={
              isAnimPlaying && !hasFinished
                ? {
                    x: 0,
                    opacity: 1,
                    fontSize:
                      titleShrinking || hasFinished ? titleRestPx : titleLargePx,
                  }
                : hasFinished
                  ? { x: "0px", opacity: 1, fontSize: titleRestPx }
                  : { x: "-120vw", opacity: 0, fontSize: titleLargePx }
            }
            transition={
              isAnimPlaying && !hasFinished
                ? {
                    x: { duration: ENT_BALL_ENTER, ease: EASE },
                    opacity: { duration: ENT_BALL_ENTER, ease: EASE },
                    fontSize: titleShrinking
                      ? { duration: ENT_TITLE_SHRINK, ease: EASE_BOUNCE }
                      : { duration: 0 },
                  }
                : STATIC_TRANSITION
            }
          >
            <span className="block whitespace-nowrap text-ink">
              {ENTSCHEIDBAR_TITLE_LINES[0]}
            </span>
            <span className="block whitespace-nowrap text-purple">
              {ENTSCHEIDBAR_TITLE_LINES[1]}
            </span>
          </motion.h2>
        )}
      </div>

      {showTreeStage && (
        <div
          className="relative mx-auto overflow-visible"
          style={{
            marginTop: titleTreeGap,
            width: treeStageW,
            height: treeStageH,
          }}
        >
          {spineVisible && (
            <motion.div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 bg-purple"
              style={{
                top: ballSize / 2,
                width: lineW,
                transformOrigin: "top center",
              }}
              initial={
                isAnimPlaying && !hasFinished ? { height: 0 } : false
              }
              animate={{ height: spineBodyHeight }}
              transition={
                isAnimPlaying && !hasFinished
                  ? {
                      duration: ENT_SPINE_GROW,
                      ease: EASE,
                    }
                  : STATIC_TRANSITION
              }
            />
          )}

          <motion.div
            aria-hidden
            className="absolute z-20"
            style={{
              top: 0,
              left: "50%",
              marginTop: -ballSize / 2,
              marginLeft: -ballSize / 2,
            }}
            initial={
              isAnimPlaying && !hasFinished ? { x: "120vw", y: 0 } : false
            }
            animate={{
              x: 0,
              y: ballCanMove || hasFinished ? ballY : 0,
            }}
            transition={
              isAnimPlaying && !hasFinished
                ? {
                    x: { duration: ENT_BALL_ENTER, ease: EASE },
                    ...(ballCanMove
                      ? { y: { duration: ENT_BALL_MOVE, ease: EASE } }
                      : {}),
                  }
                : STATIC_TRANSITION
            }
          >
            <div className="flex items-center">
              <div
                className="shrink-0 rounded-full bg-purple"
                style={{ width: ballSize, height: ballSize }}
              />
              {!showSpine && !hasFinished && (
                <motion.div
                  className="shrink-0 bg-purple"
                  style={{
                    height: lineW,
                    width: horizLineLength,
                    transformOrigin: "left center",
                  }}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: horizLineRetracted ? 0 : 1 }}
                  transition={
                    isAnimPlaying && horizLineRetracted
                      ? { duration: ENT_LINE_RETRACT, ease: EASE }
                      : STATIC_TRANSITION
                  }
                />
              )}
            </div>
          </motion.div>

          {ENTSCHEIDBAR_BRANCHES.map((branch, index) => {
            const isLeft = branch.side === "left";
            const iconYOffset = Math.round(
              (0.5 - branch.lineAnchorY) * iconSize -
                (isLeft ? 0 : iconSize * ENT_TREE_ICON_LINE_NUDGE),
            );
            const sideStyle = isLeft
              ? { right: "50%", justifyContent: "flex-end" as const }
              : { left: "50%", justifyContent: "flex-start" as const };

            return (
              <div
                key={branch.icon}
                className="absolute flex items-center"
                style={{
                  ...sideStyle,
                  top: branchTops[index],
                  transform: "translateY(-50%)",
                  maxWidth: branchLineW + iconSize + textMaxW + branchInnerGap * 2,
                }}
              >
                {(visibleBranches > index || hasFinished) && (
                  <motion.div
                    className={`flex items-center ${isLeft ? "flex-row-reverse" : "flex-row"}`}
                    initial={
                      isAnimPlaying && !hasFinished
                        ? {
                            x: isLeft ? "-120vw" : "120vw",
                            opacity: 0,
                          }
                        : false
                    }
                    animate={{ x: 0, opacity: 1 }}
                    transition={
                      isAnimPlaying && !hasFinished
                        ? { duration: ENT_BRANCH_REVEAL, ease: EASE }
                        : STATIC_TRANSITION
                    }
                  >
                    <div
                      aria-hidden
                      className="shrink-0 bg-purple"
                      style={{
                        width: branchLineW + iconLineReach,
                        height: lineW,
                      }}
                    />
                    <div
                      className="relative z-10 shrink-0 overflow-visible"
                      style={{
                        width: iconSize,
                        height: iconSize,
                        marginLeft: isLeft ? 0 : -iconLineReach,
                        marginRight: isLeft ? -iconLineReach : 0,
                        transform:
                          iconYOffset !== 0
                            ? `translateY(${iconYOffset}px)`
                            : undefined,
                      }}
                    >
                      <Image
                        src={branch.icon}
                        alt=""
                        fill
                        sizes={`${iconSize}px`}
                        className="object-contain"
                        style={{
                          transform: `scale(${branch.iconVisualScale})`,
                          transformOrigin: "center center",
                        }}
                        aria-hidden
                      />
                    </div>
                    <div
                      className="flex items-center flex-row"
                      style={{
                        gap: branchInnerGap,
                        maxWidth: textMaxW,
                        marginLeft: isLeft ? 0 : branchInnerGap,
                        marginRight: isLeft ? branchInnerGap : 0,
                      }}
                    >
                      <span
                        aria-hidden
                        className="shrink-0 rounded-full bg-purple"
                        style={{
                          width: bulletDotSize,
                          height: bulletDotSize,
                        }}
                      />
                      <p
                        className="font-bricolage font-bold text-ink"
                        style={{
                          fontSize: branchFontPx,
                          lineHeight: BRANCH_TEXT_LINE_HEIGHT,
                        }}
                      >
                        {branch.text}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!showTreeStage && (
        <div
          aria-hidden
          style={{
            marginTop: titleTreeGap,
            height: treeStageH,
          }}
        />
      )}
    </section>
  );
}
