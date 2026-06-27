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
import ScrollHintArrow from "@/app/components/ScrollHintArrow";
import {
  ENTSCHEIDBAR_TITLE_LINES,
  fitMobileBodyFontPx,
  TEAM_FOOTER_TEXT,
  TEAM_MEMBERS,
} from "@/app/lib/fitText";
import {
  fitMobileHeadlinePx,
  fitSectionHeadlineFontPx,
  fitTeamFooterLayout,
  fitTeamLayout,
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import {
  DESC_PX_DESIGN,
  getRingDashStyle,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  MOBILE_LINE_WIDTH_BASE,
  scalePx,
  TEAM_FOOTER_DOT_SIZE_BASE,
  TEAM_FOOTER_RING_DASH_COUNT,
  TEAM_FOOTER_RING_SIZE_BASE,
  TEAM_MEMBER_FOOTER_GAP_BASE,
  ENTSCHEIDBAR_TITLE_PX_DESIGN,
  TEAM_TITLE_ENTER_PX_DESIGN,
  TEAM_TITLE_MEMBER_GAP_BASE,
  TEAM_TITLE_PX_DESIGN,
} from "@/app/lib/scale";
import { preloadTeamMemberImages } from "@/app/lib/teamEntrance";

const STATIC_TRANSITION = { duration: 0 };
const FOOTER_TEXT_LINE_HEIGHT = 1.3;
const TITLE_LINE_HEIGHT = 1.05;

export default function TeamSection({
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
  const isAnimPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const profilesEnteredRef = useRef(false);
  const footerEnteredRef = useRef(false);

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

  const [titleRestPx, setTitleRestPx] = useState(TEAM_TITLE_PX_DESIGN);
  const [mobileTitlePx, setMobileTitlePx] = useState(36);
  const [mobileBodyFontPx, setMobileBodyFontPx] = useState(MOBILE_DESC_PX_DESIGN);
  const [mobileFooterTextPx, setMobileFooterTextPx] = useState(MOBILE_DESC_PX_DESIGN);
  const [footerRingHovered, setFooterRingHovered] = useState(false);
  const [stageMounted, setStageMounted] = useState(false);
  const [slideOffsetPx, setSlideOffsetPx] = useState(1200);

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
      setMobileBodyFontPx(MOBILE_DESC_PX_DESIGN);
      setMobileFooterTextPx(fitMobileBodyFontPx(viewportW, bricolageFont));
    } else {
      setTitleRestPx(
        fitSectionHeadlineFontPx(
          viewportW,
          serifFont,
          ENTSCHEIDBAR_TITLE_LINES,
          ENTSCHEIDBAR_TITLE_PX_DESIGN,
          bodyFontPx,
        ),
      );
    }
  }, [viewportW, bodyFontPx, isMobile, mobileDescCap]);

  const titleLargePx = scalePx(
    TEAM_TITLE_ENTER_PX_DESIGN,
    contentScale,
    40,
  );
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
    Math.max(titleRestPx, titleLargePx) * TITLE_LINE_HEIGHT * 3,
  );

  useEffect(() => {
    if (!heroIntroComplete || (!mountImmediately && !isInView) || stageMounted) {
      return;
    }

    setStageMounted(true);
    void preloadTeamMemberImages();
  }, [heroIntroComplete, isInView, stageMounted, mountImmediately]);

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

  const mobileMemberW = Math.round(sectionAvailableWidth(viewportW));
  const mobileCardScale = mobileBodyFontPx / DESC_PX_DESIGN;
  const mobileFooterBallSize = scalePx(44, mobileScale, 24);
  const mobileFooterLineW = scalePx(MOBILE_LINE_WIDTH_BASE, mobileScale, 1);
  const mobileFooterLineLen = scalePx(52, mobileScale, 28);
  const mobileFooterTextGap = scalePx(14, mobileScale, 8);
  const mobileMemberGap = scalePx(48, mobileScale, 28);

  return (
    <section
      ref={sectionRef}
      data-scroll-section="team"
      className="relative w-full overflow-x-hidden bg-cream px-[6vw] pt-[3vh] pb-[8vh] lg:pt-[6vh] lg:pb-[10vh]"
    >
      <div className="flex w-full flex-col items-center lg:hidden">
        <motion.h2
          className="w-full text-center font-serif font-extrabold tracking-tight"
          style={{ fontSize: mobileTitlePx, lineHeight: TITLE_LINE_HEIGHT }}
          initial={false}
          animate={
            entranceActive
              ? { x: [-slideOffsetPx, 0, 0], opacity: [0, 1, 1] }
              : hasFinished
                ? { x: 0, opacity: 1 }
                : { x: -slideOffsetPx, opacity: 0 }
          }
          transition={
            entranceActive
              ? { duration: TEAM_TITLE_PHASE, times: [0, TEAM_TITLE_ENTER / TEAM_TITLE_PHASE, 1], ease: [EASE, EASE] }
              : STATIC_TRANSITION
          }
        >
          <span className="text-ink">Ein Team aus </span>
          <span className="text-purple">international renommierten Experten</span>
          <span className="text-ink"> aus Wissenschaft und Praxis</span>
        </motion.h2>

        {showProfiles && (
          <motion.div
            layout={false}
            className="flex w-full flex-col items-center"
            style={{ marginTop: scalePx(TEAM_TITLE_MEMBER_GAP_BASE, mobileScale, 4), gap: mobileMemberGap }}
            initial={false}
            animate={
              hasFinished || profilesEnteredRef.current
                ? { x: 0, opacity: 1 }
                : entranceActive
                  ? { x: 0, opacity: 1 }
                  : { x: slideOffsetPx, opacity: 0 }
            }
            transition={slideInTransition(() => { profilesEnteredRef.current = true; })}
          >
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard
                key={member.image}
                member={member}
                memberW={mobileMemberW}
                contentScale={mobileCardScale}
              />
            ))}
          </motion.div>
        )}

        {showFooter && (
          <motion.div
            layout={false}
            className="flex w-full items-center"
            style={{ marginTop: scalePx(TEAM_MEMBER_FOOTER_GAP_BASE, mobileScale, 28), gap: mobileFooterTextGap }}
            initial={false}
            animate={
              hasFinished || footerEnteredRef.current
                ? { x: 0, opacity: 1 }
                : entranceActive
                  ? { x: 0, opacity: 1 }
                  : { x: -slideOffsetPx, opacity: 0 }
            }
            transition={slideInTransition(() => { footerEnteredRef.current = true; })}
          >
            <div
              className="relative shrink-0"
              style={{ width: mobileFooterLineLen + mobileFooterBallSize, height: mobileFooterBallSize }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple"
                style={{ width: mobileFooterLineLen + mobileFooterBallSize, height: mobileFooterLineW }}
              />
              <div
                aria-hidden
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-purple"
                style={{ width: mobileFooterBallSize, height: mobileFooterBallSize }}
              />
            </div>
            <p className="font-bricolage font-medium text-ink" style={{ fontSize: mobileFooterTextPx, lineHeight: FOOTER_TEXT_LINE_HEIGHT }}>
              {TEAM_FOOTER_TEXT}
            </p>
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
            className="w-fit text-center font-serif font-extrabold tracking-tight"
            style={{
              fontSize: titleLargePx,
              lineHeight: TITLE_LINE_HEIGHT,
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
                    fontSize: [titleLargePx, titleLargePx, titleLargePx, titleRestPx],
                  }
                : hasFinished
                  ? { x: 0, opacity: 1, fontSize: titleRestPx }
                  : { x: -slideOffsetPx, opacity: 0, fontSize: titleLargePx }
            }
            transition={
              entranceActive
                ? { duration: TEAM_TITLE_PHASE, times: titleTimes, ease: [EASE, EASE, EASE_BOUNCE, EASE] }
                : STATIC_TRANSITION
            }
          >
            <span className="block whitespace-nowrap text-ink">
              Ein Team aus <span className="text-purple">international</span>
            </span>
            <span className="block whitespace-nowrap">
              <span className="text-purple">renommierten Experten</span>
              <span className="text-ink"> aus</span>
            </span>
            <span className="block whitespace-nowrap text-ink">Wissenschaft und Praxis</span>
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
            transition={slideInTransition(() => { profilesEnteredRef.current = true; })}
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
            transition={slideInTransition(() => { footerEnteredRef.current = true; })}
          >
            <div aria-hidden className="absolute top-1/2 z-0 -translate-y-1/2 bg-purple"
              style={{ left: ringCenter, width: lineExtend, height: lineWidth }} />
            <div className="absolute left-0 top-0 z-[1]"
              style={{ width: ringSize, height: ringSize }}
              onMouseEnter={() => setFooterRingHovered(true)}
              onMouseLeave={() => setFooterRingHovered(false)}
            >
              <svg aria-hidden width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="block">
                <motion.g
                  style={{ transformOrigin: `${ringCenter}px ${ringCenter}px` }}
                  initial={false}
                  animate={{ rotate: footerRingHovered ? -360 : 0 }}
                  transition={footerRingHovered
                    ? { duration: TEAM_FOOTER_RING_SPIN_DUR, ease: EASE }
                    : { duration: TEAM_FOOTER_RING_RESET_DUR, ease: EASE }}
                >
                  <circle cx={ringCenter} cy={ringCenter} r={ringRadius} fill="none"
                    stroke="var(--purple)" strokeWidth={ringStroke}
                    strokeDasharray={`${ringDashLength} ${ringDashGap}`} strokeLinecap="butt" />
                </motion.g>
              </svg>
            </div>
            <div aria-hidden className="absolute z-[2] rounded-full bg-purple"
              style={{ left: ringCenter, top: ringCenter, width: dotSize, height: dotSize, transform: "translate(-50%, -50%)" }} />
            <p className="absolute top-1/2 -translate-y-1/2 font-bricolage font-medium text-ink"
              style={{ left: ringCenter + lineExtend + textGap, fontSize: bodyFontPx, lineHeight: FOOTER_TEXT_LINE_HEIGHT, whiteSpace: "nowrap" }}>
              {TEAM_FOOTER_TEXT}
            </p>
          </motion.div>
        )}
      </div>
      </div>
      <ScrollHintArrow visible={showScrollHint} />
    </section>
  );
}
