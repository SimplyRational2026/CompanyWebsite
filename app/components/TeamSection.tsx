"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TeamMemberCard from "@/app/components/TeamMemberCard";
import {
  EASE,
  EASE_BOUNCE,
  TEAM_ANIM_END,
  TEAM_FOOTER_RING_RESET_DUR,
  TEAM_FOOTER_RING_SPIN_DUR,
  TEAM_PROFILES_ENTER,
  TEAM_PROFILES_START,
  TEAM_TITLE_ENTER,
  TEAM_TITLE_PAUSE,
  TEAM_TITLE_PHASE,
} from "@/app/lib/anim";
import { TEAM_FOOTER_TEXT, TEAM_MEMBERS } from "@/app/lib/fitText";
import {
  fitTeamFooterLayout,
  fitTeamLayout,
  fitTeamTitleSizes,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  getRingDashStyle,
  scalePx,
  TEAM_FOOTER_DOT_SIZE_BASE,
  TEAM_FOOTER_RING_DASH_COUNT,
  TEAM_FOOTER_RING_SIZE_BASE,
  TEAM_MEMBER_FOOTER_GAP_BASE,
  TEAM_TITLE_MEMBER_GAP_BASE,
  TEAM_TITLE_PX_DESIGN,
} from "@/app/lib/scale";
import { preloadTeamMemberImages } from "@/app/lib/teamEntrance";

const STATIC_TRANSITION = { duration: 0 };
const FOOTER_TEXT_LINE_HEIGHT = 1.35;

export default function TeamSection({
  heroIntroComplete,
}: {
  heroIntroComplete: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const profilesEnteredRef = useRef(false);
  const footerEnteredRef = useRef(false);

  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [isAnimPlaying, setIsAnimPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [titleRestPx, setTitleRestPx] = useState(TEAM_TITLE_PX_DESIGN);
  const [titleLargePx, setTitleLargePx] = useState(TEAM_TITLE_PX_DESIGN * 1.5);
  const [footerRingHovered, setFooterRingHovered] = useState(false);
  const [stageMounted, setStageMounted] = useState(false);
  const [slideOffsetPx, setSlideOffsetPx] = useState(1200);

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

    const { titleRestPx: restPx, titleLargePx: largePx } = fitTeamTitleSizes(
      viewportW,
      serifFont,
      bodyFontPx,
    );
    setTitleRestPx(restPx);
    setTitleLargePx(largePx);
  }, [viewportW, bodyFontPx]);
  const titleMemberGap = scalePx(TEAM_TITLE_MEMBER_GAP_BASE, contentScale, 4);
  const memberFooterGap = scalePx(
    TEAM_MEMBER_FOOTER_GAP_BASE,
    contentScale,
    32,
  );
  const ringSize = scalePx(TEAM_FOOTER_RING_SIZE_BASE, contentScale, 136);
  const dotSize = scalePx(TEAM_FOOTER_DOT_SIZE_BASE, contentScale, 32);
  const {
    ringStroke,
    ringRadius,
    ringCenter,
    ringDashLength,
    ringDashGap,
  } = getRingDashStyle(ringSize, TEAM_FOOTER_RING_DASH_COUNT, contentScale);
  const lineWidth = ringStroke;

  const bricolageFont =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--font-bricolage-grotesque")
          .trim() || "sans-serif"
      : "sans-serif";

  const { memberW, memberGap, rowW } = fitTeamLayout(contentScale, viewportW);
  const { lineExtend, textGap } = fitTeamFooterLayout(
    rowW,
    ringCenter,
    contentScale,
    bodyFontPx,
    TEAM_FOOTER_TEXT,
    bricolageFont,
  );

  const titleBlockH = Math.round(
    Math.max(titleRestPx, titleLargePx) * 1.05 * 3,
  );

  useEffect(() => {
    if (!heroIntroComplete || !isInView || stageMounted) {
      return;
    }

    setStageMounted(true);
    void preloadTeamMemberImages();
  }, [heroIntroComplete, isInView, stageMounted]);

  useEffect(() => {
    if (!stageMounted || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    setSlideOffsetPx(Math.round(window.innerWidth * 1.2));

    let outerFrame = 0;
    let innerFrame = 0;

    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        isAnimPlayingRef.current = true;
        setIsAnimPlaying(true);
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [stageMounted]);

  useEffect(() => {
    if (!isAnimPlaying) {
      return;
    }

    const endTimer = window.setTimeout(() => {
      isAnimPlayingRef.current = false;
      setIsAnimPlaying(false);
      setHasFinished(true);
    }, TEAM_ANIM_END * 1000);

    return () => window.clearTimeout(endTimer);
  }, [isAnimPlaying]);

  const titleTimes = [
    0,
    TEAM_TITLE_ENTER / TEAM_TITLE_PHASE,
    (TEAM_TITLE_ENTER + TEAM_TITLE_PAUSE) / TEAM_TITLE_PHASE,
    1,
  ];

  const showTitle = stageMounted || hasFinished;
  const showProfiles = stageMounted || hasFinished;
  const showFooter = stageMounted || hasFinished;
  const entranceActive = isAnimPlaying && !hasFinished;
  const slideInTransition = (onComplete?: () => void) =>
    entranceActive
      ? {
          delay: TEAM_PROFILES_START,
          duration: TEAM_PROFILES_ENTER,
          ease: EASE,
          onComplete,
        }
      : STATIC_TRANSITION;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="team"
      className="relative w-full overflow-x-hidden bg-cream px-[6vw] pt-[6vh] pb-[10vh]"
    >
      <div
        className="flex w-full justify-center"
        style={{ minHeight: titleBlockH }}
      >
        {showTitle && (
          <motion.h2
            className="w-fit text-center font-serif font-extrabold tracking-tight"
            style={{
              fontSize: titleRestPx,
              lineHeight: 1.05,
              transformOrigin: "center center",
              backfaceVisibility: "hidden",
              willChange: entranceActive ? "transform, opacity" : undefined,
            }}
            initial={false}
            animate={
              entranceActive
                ? {
                    x: [-slideOffsetPx, 0, 0, 0],
                    opacity: [0, 1, 1, 1],
                    fontSize: [
                      titleLargePx,
                      titleLargePx,
                      titleLargePx,
                      titleRestPx,
                    ],
                  }
                : hasFinished
                  ? { x: 0, opacity: 1, fontSize: titleRestPx }
                  : { x: -slideOffsetPx, opacity: 0, fontSize: titleLargePx }
            }
            transition={
              entranceActive
                ? {
                    duration: TEAM_TITLE_PHASE,
                    times: titleTimes,
                    ease: [EASE, EASE, EASE_BOUNCE, EASE],
                  }
                : STATIC_TRANSITION
            }
          >
            <span className="block whitespace-nowrap text-ink">
              Ein Team aus{" "}
              <span className="text-purple">international</span>
            </span>
            <span className="block whitespace-nowrap">
              <span className="text-purple">renommierten Experten</span>
              <span className="text-ink"> aus</span>
            </span>
            <span className="block whitespace-nowrap text-ink">
              Wissenschaft und Praxis
            </span>
          </motion.h2>
        )}
      </div>

      <div className="relative mx-auto flex w-full flex-col items-center">
        {showProfiles && (
          <motion.div
            layout={false}
            className="flex flex-row flex-nowrap items-start justify-center"
            style={{
              marginTop: titleMemberGap,
              width: rowW,
              gap: memberGap,
              backfaceVisibility: "hidden",
              willChange: entranceActive ? "transform, opacity" : undefined,
            }}
            initial={false}
            animate={
              hasFinished || profilesEnteredRef.current
                ? { x: 0, opacity: 1 }
                : entranceActive
                  ? { x: 0, opacity: 1 }
                  : { x: slideOffsetPx, opacity: 0 }
            }
            transition={slideInTransition(() => {
              profilesEnteredRef.current = true;
            })}
          >
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard
                key={member.image}
                member={member}
                memberW={memberW}
                contentScale={contentScale}
              />
            ))}
          </motion.div>
        )}

        {showFooter && (
          <motion.div
            layout={false}
            className="relative"
            style={{
              marginTop: memberFooterGap,
              width: rowW,
              height: ringSize,
              backfaceVisibility: "hidden",
              willChange: entranceActive ? "transform, opacity" : undefined,
            }}
            initial={false}
            animate={
              hasFinished || footerEnteredRef.current
                ? { x: 0, opacity: 1 }
                : entranceActive
                  ? { x: 0, opacity: 1 }
                  : { x: -slideOffsetPx, opacity: 0 }
            }
            transition={slideInTransition(() => {
              footerEnteredRef.current = true;
            })}
          >
            <div
              aria-hidden
              className="absolute top-1/2 z-0 -translate-y-1/2 bg-purple"
              style={{
                left: ringCenter,
                width: lineExtend,
                height: lineWidth,
              }}
            />

            <div
              className="absolute left-0 top-0 z-[1]"
              style={{ width: ringSize, height: ringSize }}
              onMouseEnter={() => setFooterRingHovered(true)}
              onMouseLeave={() => setFooterRingHovered(false)}
            >
              <svg
                aria-hidden
                width={ringSize}
                height={ringSize}
                viewBox={`0 0 ${ringSize} ${ringSize}`}
                className="block"
              >
                <motion.g
                  style={{ transformOrigin: `${ringCenter}px ${ringCenter}px` }}
                  initial={false}
                  animate={{ rotate: footerRingHovered ? -360 : 0 }}
                  transition={
                    footerRingHovered
                      ? {
                          duration: TEAM_FOOTER_RING_SPIN_DUR,
                          ease: EASE,
                        }
                      : {
                          duration: TEAM_FOOTER_RING_RESET_DUR,
                          ease: EASE,
                        }
                  }
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
                </motion.g>
              </svg>
            </div>

            <div
              aria-hidden
              className="absolute z-[2] rounded-full bg-purple"
              style={{
                left: ringCenter,
                top: ringCenter,
                width: dotSize,
                height: dotSize,
                transform: "translate(-50%, -50%)",
              }}
            />

            <p
              className="absolute top-1/2 -translate-y-1/2 font-bricolage font-medium text-ink"
              style={{
                left: ringCenter + lineExtend + textGap,
                fontSize: bodyFontPx,
                lineHeight: FOOTER_TEXT_LINE_HEIGHT,
                whiteSpace: "nowrap",
              }}
            >
              {TEAM_FOOTER_TEXT}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
