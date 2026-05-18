"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE, EASE_BOUNCE, STEPS } from "@/app/lib/anim";
import Nav from "./Nav";

const NAV_HEIGHT = 120;
const BALL_DROP = 340;
const BALL_SIZE = 68;
const LINE_WIDTH = 6;
const CENTER_LINE_DROP = 220;

export default function Hero() {
  const [logoInNav, setLogoInNav] = useState(false);
  const [showNavExtras, setShowNavExtras] = useState(false);
  const [viewportH, setViewportH] = useState(800);
  const [viewportW, setViewportW] = useState(1024);

  useEffect(() => {
    const t1 = window.setTimeout(
      () => setLogoInNav(true),
      STEPS.logoIntro.duration * 1000,
    );
    const t2 = window.setTimeout(
      () => setShowNavExtras(true),
      STEPS.navReveal.delay * 1000,
    );

    const updateSize = () => {
      setViewportH(window.innerHeight);
      setViewportW(window.innerWidth);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const titleFontPx = Math.max(32, Math.min(64, viewportW * 0.05));
  const titleLineH = titleFontPx * 1.15;
  const ballGapOffset = titleLineH * 0.5;
  const ballStartY = viewportH / 2 - ballGapOffset;
  const ballEndY = viewportH / 2 + BALL_DROP;
  const finalLineHeight = Math.max(ballEndY - NAV_HEIGHT, 160);
  const titleOffsetY = 0;
  const titleRaiseY = -36;

  const lineRightStart = viewportW + 0.95 * viewportW + BALL_SIZE / 2;
  const lineRightEnd = viewportW / 2 + BALL_SIZE / 2;
  const dashedDur = 2.5;
  const dashedEntryEnd = STEPS.ballEnter.duration / dashedDur;
  const dashedRetractStart = (STEPS.ballEnter.duration + 0.5) / dashedDur;

  const hlDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.headlineEnter.delay;
  const hl_t1 = STEPS.headlineEnter.duration / hlDur;
  const hl_t2 =
    (STEPS.headlineEnter.duration + STEPS.headlineCenterPause.duration) /
    hlDur;
  const hl_t3 =
    (STEPS.headlineEnter.duration +
      STEPS.headlineCenterPause.duration +
      STEPS.headlineShiftLeft.duration) /
    hlDur;
  const hl_t4 = (STEPS.lineDrop.delay - STEPS.headlineEnter.delay) / hlDur;
  const hl_t5 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.25 -
      STEPS.headlineEnter.delay) /
    hlDur;
  const hl_t6 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.42 -
      STEPS.headlineEnter.delay) /
    hlDur;

  const shDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.subheadEnter.delay;
  const sh_t1 = STEPS.subheadEnter.duration / shDur;
  const sh_t2 = (STEPS.lineDrop.delay - STEPS.subheadEnter.delay) / shDur;
  const sh_t3 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.25 -
      STEPS.subheadEnter.delay) /
    shDur;
  const sh_t4 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.42 -
      STEPS.subheadEnter.delay) /
    shDur;

  const ballDur =
    STEPS.lineDrop.delay + STEPS.lineDrop.duration - STEPS.ballEnter.delay;
  const ball_t1 = STEPS.ballEnter.duration / ballDur;
  const ball_t2 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.42 -
      STEPS.ballEnter.delay) /
    ballDur;
  const ball_t3 =
    (STEPS.lineDrop.delay +
      STEPS.lineDrop.duration * 0.85 -
      STEPS.ballEnter.delay) /
    ballDur;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream">
      <Nav logoInNav={logoInNav} showExtras={showNavExtras} />

      {!logoInNav && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            layoutId="srLogo"
            className="block w-[min(640px,55vw)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: STEPS.logoIntro.duration * 0.65,
              ease: EASE,
            }}
          >
            <Image
              src="/simply-rational-logo.png"
              alt="Simply Rational"
              width={1024}
              height={512}
              priority
              className="block h-auto w-full"
            />
          </motion.div>
        </div>
      )}

      <motion.div
        aria-hidden
        className="absolute left-1/2 z-10 -translate-x-1/2 bg-purple"
        style={{ width: LINE_WIDTH }}
        initial={{ top: ballStartY, height: 0, opacity: 1 }}
        animate={{
          top: [ballStartY, ballStartY, ballStartY, NAV_HEIGHT, NAV_HEIGHT],
          height: [0, CENTER_LINE_DROP, 0, finalLineHeight, finalLineHeight],
          opacity: 1,
        }}
        transition={{
          duration: STEPS.lineDrop.duration,
          delay: STEPS.lineDrop.delay,
          times: [0, 0.25, 0.42, 0.85, 1],
          ease: EASE,
        }}
      />

      <motion.div
        aria-hidden
        className="absolute z-5 border-t-[6px] border-dashed border-purple"
        style={{ top: `calc(50vh - ${ballGapOffset + 3}px)` }}
        initial={{ right: lineRightStart, width: viewportW, opacity: 1 }}
        animate={{
          right: [
            lineRightStart,
            lineRightEnd,
            lineRightEnd,
            lineRightEnd,
          ],
          width: [viewportW, viewportW, viewportW, 0],
        }}
        transition={{
          duration: dashedDur,
          delay: STEPS.ballEnter.delay,
          times: [0, dashedEntryEnd, dashedRetractStart, 1],
          ease: EASE,
        }}
      />

      <main className="relative flex h-screen items-center">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-[2vw] px-[3vw]">
          <motion.h1
            className="mx-auto text-center font-serif font-extrabold leading-[1.15] tracking-tight text-ink"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              maxWidth: "clamp(420px, 56vw, 880px)",
              transformOrigin: "center center",
            }}
            initial={{ x: "120vw", scale: 1.6, y: titleOffsetY, opacity: 0 }}
            animate={{
              x: [
                "120vw",
                "26vw",
                "26vw",
                "0vw",
                "0vw",
                "0vw",
                "0vw",
                "0vw",
              ],
              scale: [1.6, 1.6, 1.6, 1, 1, 1, 1, 1],
              y: [
                titleOffsetY,
                titleOffsetY,
                titleOffsetY,
                titleOffsetY,
                titleOffsetY,
                titleOffsetY - 120,
                titleOffsetY,
                titleRaiseY,
              ],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1],
            }}
            transition={{
              duration: hlDur,
              delay: STEPS.headlineEnter.delay,
              times: [0, hl_t1, hl_t2, hl_t3, hl_t4, hl_t5, hl_t6, 1],
              ease: [
                EASE_BOUNCE,
                EASE,
                EASE_BOUNCE,
                EASE,
                EASE,
                EASE,
                EASE,
              ],
            }}
          >
            Gute Entscheidungen
            <br />
            scheitern nicht an
            <br />
            Daten.
          </motion.h1>

          <div className="relative h-[440px] w-[80px]">
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple"
              style={{ width: BALL_SIZE, height: BALL_SIZE }}
              initial={{ x: "-95vw", y: -ballGapOffset, opacity: 0 }}
              animate={{
                x: ["-95vw", "0vw", "0vw", "0vw", "0vw"],
                y: [
                  -ballGapOffset,
                  -ballGapOffset,
                  -ballGapOffset,
                  BALL_DROP,
                  BALL_DROP,
                ],
                opacity: [0, 1, 1, 1, 1],
              }}
              transition={{
                duration: ballDur,
                delay: STEPS.ballEnter.delay,
                times: [0, ball_t1, ball_t2, ball_t3, 1],
                ease: EASE,
              }}
            />
          </div>

          <div className="relative flex h-[440px] items-center justify-center">
            <motion.h2
              className="mx-auto text-center font-serif font-extrabold leading-[1.15] tracking-tight text-purple-deep"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                maxWidth: "clamp(420px, 56vw, 880px)",
              }}
              initial={{ x: "60vw", y: titleOffsetY, opacity: 0 }}
              animate={{
                x: ["60vw", "0vw", "0vw", "0vw", "0vw", "0vw"],
                y: [
                  titleOffsetY,
                  titleOffsetY,
                  titleOffsetY,
                  titleOffsetY + 160,
                  titleOffsetY,
                  titleRaiseY,
                ],
                opacity: [0, 1, 1, 1, 1, 1],
              }}
              transition={{
                duration: shDur,
                delay: STEPS.subheadEnter.delay,
                times: [0, sh_t1, sh_t2, sh_t3, sh_t4, 1],
                ease: EASE,
              }}
            >
              Sondern daran, dass
              <br />
              sie nicht
              <br />
              entscheidbar sind.
            </motion.h2>

            <motion.p
              className="font-bricolage absolute inset-x-0 mx-auto max-w-[clamp(360px,46vw,760px)] px-2 font-medium leading-snug text-ink"
              style={{
                top: "calc(100% + 32px)",
                fontSize: "clamp(1.125rem, 2.4vw, 1.75rem)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: STEPS.subtextFade.duration,
                delay: STEPS.subtextFade.delay,
                ease: EASE,
              }}
            >
              Wir schaffen{" "}
              <span className="text-purple">
                Klarheit, Struktur und Nachvollziehbarkeit
              </span>{" "}
              für Entscheidungen unter Risiko und Unsicherheit – damit Teams
              auch dann sicher entscheiden, wenn es keine eindeutige Antwort
              gibt.
            </motion.p>
          </div>
        </div>
      </main>
    </div>
  );
}
