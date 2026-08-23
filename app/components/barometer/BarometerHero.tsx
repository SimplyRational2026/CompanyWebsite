"use client";

import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EASE, EASE_BOUNCE } from "@/app/lib/anim";
import { TextLines } from "./shared";
import {
  BALL_SIZE_BASE,
  CENTER_LINE_DROP_BASE,
  LINE_WIDTH_BASE,
  MOBILE_BALL_SIZE_BASE,
  MOBILE_LINE_WIDTH_BASE,
  scalePx,
} from "@/app/lib/scale";

const HERO_DESC_LINES = [
  "Organisationen messen Umsätze, Kosten und Produktivität. Doch kaum",
  "jemand misst die Bedingungen, unter denen Entscheidungen entstehen.",
  "Genau diese macht das Entscheidungsbarometer sichtbar.",
] as const;

// The headline hangs much closer under the ball on narrow screens than the
// desktop layout, which has room to let the pendulum breathe.
const HEADLINE_GAP_BASE = 72;
const MOBILE_HEADLINE_GAP_BASE = 32;

const LINE_DROP_DUR = 1.1;
const BALL_POP_DELAY = LINE_DROP_DUR * 0.85;
const HEADLINE_DELAY = BALL_POP_DELAY + 0.5;
const DESC_DELAY = HEADLINE_DELAY + 1.1;

export default function BarometerHero({
  titlePx,
  bodyPx,
  contentScale,
  isReady,
  isMobile,
  topOffset = 0,
}: {
  titlePx: number;
  bodyPx: number;
  contentScale: number;
  isReady: boolean;
  isMobile: boolean;
  topOffset?: number;
}) {
  const [viewportH, setViewportH] = useState(800);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = useState(0);

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Re-measures on font-fit and reflow, so the drop stays correct without
  // depending on titlePx/bodyPx landing in the same render.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    const measure = () => setContentH(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile gets its own ball and line sizes, same as every other section --
  // the desktop bases render a 68px ball on a 6px line at phone widths.
  const lineWidth = isMobile
    ? scalePx(MOBILE_LINE_WIDTH_BASE, contentScale, 3)
    : scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const ballSize = isMobile
    ? scalePx(MOBILE_BALL_SIZE_BASE, contentScale, 24)
    : scalePx(BALL_SIZE_BASE, contentScale, 24);
  const headlineGap = isMobile
    ? scalePx(MOBILE_HEADLINE_GAP_BASE, contentScale, 20)
    : scalePx(HEADLINE_GAP_BASE, contentScale, 32);
  const descGap = scalePx(40, contentScale, 20);

  // Stretch the pendulum line so line + ball + headline + description fill
  // the viewport exactly and the next section starts below the fold. The
  // block is measured rather than estimated from line counts: the headline
  // wraps to two lines on desktop but four on mobile, and guessing two there
  // overshot the drop far enough to push the description past the fold.
  const availableH = viewportH - topOffset;
  const lineDrop = Math.max(
    scalePx(CENTER_LINE_DROP_BASE, contentScale, 80),
    availableH - contentH - Math.round(viewportH * 0.1),
  );

  return (
    <section
      data-scroll-section="baro-hero"
      className="relative w-full overflow-hidden bg-cream px-[6vw] pb-[10vh]"
      style={{ minHeight: `calc(100svh - ${topOffset}px)` }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          aria-hidden
          className="bg-purple"
          style={{ width: lineWidth }}
          initial={{ height: 0 }}
          animate={isReady ? { height: lineDrop } : undefined}
          transition={{ duration: LINE_DROP_DUR, ease: EASE }}
        />
        <div ref={contentRef} className="flex w-full flex-col items-center">
          <motion.div
            aria-hidden
            className="rounded-full bg-purple"
            style={{ width: ballSize, height: ballSize }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isReady ? { scale: 1, opacity: 1 } : undefined}
            transition={{
              duration: 0.7,
              delay: BALL_POP_DELAY,
              ease: EASE_BOUNCE,
            }}
          />

          <h1
            className="text-center font-serif font-extrabold tracking-tight"
            style={{
              marginTop: headlineGap,
              fontSize: titlePx,
              lineHeight: 1.15,
            }}
          >
            <motion.span
              className="block text-ink"
              initial={{ x: "-60vw", opacity: 0 }}
              animate={isReady ? { x: "0vw", opacity: 1 } : undefined}
              transition={{ duration: 1.0, delay: HEADLINE_DELAY, ease: EASE }}
            >
              Was gute Entscheidungen
            </motion.span>
            <motion.span
              className="block text-purple"
              initial={{ x: "60vw", opacity: 0 }}
              animate={isReady ? { x: "0vw", opacity: 1 } : undefined}
              transition={{
                duration: 1.0,
                delay: HEADLINE_DELAY + 0.35,
                ease: EASE,
              }}
            >
              wirklich möglich macht.
            </motion.span>
          </h1>

          <motion.p
            className="font-bricolage text-center font-medium text-ink"
            style={{
              marginTop: descGap,
              fontSize: bodyPx,
              lineHeight: 1.35,
              textWrap: "pretty",
            }}
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: DESC_DELAY, ease: EASE }}
          >
            <TextLines lines={HERO_DESC_LINES} joined={isMobile} />
          </motion.p>
        </div>
      </div>
    </section>
  );
}
