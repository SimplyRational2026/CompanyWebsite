"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EASE, EASE_BOUNCE } from "@/app/lib/anim";
import type { RevealPhase } from "./shared";

// All illustrations are exact SVG exports from the Figma file
// (public/barometer/*), so stroke weights and proportions match the design.
// Sizes are given as the Figma 1920-design width and scaled by the caller.

const STATIC_TRANSITION = { duration: 0 };

export function DiceGraphic({ width }: { width: number }) {
  return (
    <Image
      src="/barometer/dice.svg"
      alt=""
      aria-hidden
      width={342}
      height={400}
      className="block h-auto"
      style={{ width }}
    />
  );
}

// Magnifier group (563.014 x 500.581) plus the separate lens dot that pops in.
export function MagnifierGraphic({
  width,
  phase,
  ballDelay = 0,
}: {
  width: number;
  phase: RevealPhase;
  ballDelay?: number;
}) {
  const s = width / 563.014;
  return (
    <div
      className="relative"
      style={{ width, height: Math.round(500.581 * s) }}
    >
      <Image
        src="/barometer/magnifier.svg"
        alt=""
        aria-hidden
        width={563}
        height={501}
        className="block h-full w-full"
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-purple"
        style={{
          left: 207 * s,
          top: 194 * s,
          width: 71.27 * s,
          height: 71.27 * s,
        }}
        initial={{ scale: 0 }}
        animate={phase === "hidden" ? { scale: 0 } : { scale: 1 }}
        transition={
          phase === "playing"
            ? { duration: 0.6, delay: ballDelay, ease: EASE_BOUNCE }
            : STATIC_TRANSITION
        }
      />
    </div>
  );
}

// Gauge composed from the design's parts (485 x 485 group) so the needle can
// sweep into place.
export function GaugeGraphic({
  width,
  phase,
  needleDelay = 0,
}: {
  width: number;
  phase: RevealPhase;
  needleDelay?: number;
}) {
  const s = width / 485;
  return (
    <div className="relative" style={{ width, height: width }}>
      <Image
        src="/barometer/gauge-outer.svg"
        alt=""
        aria-hidden
        width={485}
        height={485}
        className="absolute left-0 top-0 h-full w-full"
      />
      <Image
        src="/barometer/gauge-dashed.png"
        alt=""
        aria-hidden
        width={738}
        height={738}
        className="absolute"
        style={{ left: 58 * s, top: 58 * s, width: 369 * s, height: 369 * s }}
      />
      {/* dashed diagonal from the center up-left */}
      <div
        aria-hidden
        className="absolute flex items-center justify-center"
        style={{
          left: 75.76 * s,
          top: 79.29 * s,
          width: 167.535 * s,
          height: 167.535 * s,
        }}
      >
        <Image
          src="/barometer/gauge-diagonal.svg"
          alt=""
          width={232}
          height={5}
          className="max-w-none shrink-0"
          style={{
            width: 231.931 * s,
            height: Math.max(2, 5 * s),
            transform: "rotate(-135deg)",
          }}
        />
      </div>
      {/* needle sweeps from the diagonal down to horizontal */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          left: 9 * s,
          top: 243 * s,
          width: 266 * s,
          height: Math.max(2, 5 * s),
          transformOrigin: "87.8% 50%",
        }}
        initial={{ rotate: 45 }}
        animate={phase === "hidden" ? { rotate: 45 } : { rotate: 0 }}
        transition={
          phase === "playing"
            ? { duration: 1.2, delay: needleDelay, ease: EASE }
            : STATIC_TRANSITION
        }
      >
        <Image
          src="/barometer/gauge-needle.svg"
          alt=""
          width={266}
          height={5}
          className="block h-full w-full max-w-none"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute rounded-full bg-purple"
        style={{
          left: 200 * s,
          top: 200 * s,
          width: 85.66 * s,
          height: 85.66 * s,
        }}
      />
    </div>
  );
}

export function PersonIcon({ size }: { size: number }) {
  return (
    <Image
      src="/barometer/person.svg"
      alt=""
      aria-hidden
      width={99}
      height={99}
      className="block"
      style={{ width: size, height: size }}
    />
  );
}

export function BulbGraphic({ width }: { width: number }) {
  return (
    <Image
      src="/barometer/bulb.svg"
      alt=""
      aria-hidden
      width={393}
      height={393}
      className="block h-auto"
      style={{ width }}
    />
  );
}

// The desktop ruler is a 1384px SVG with ten ticks. Squeezed onto a phone the
// ticks crowd together and the ball shrinks to a dot, so mobile draws its own:
// four ticks, and a ball sized to read at that width.
const MOBILE_RULER_TICKS = [0.12, 0.33, 0.54, 0.75];

export function MobileRulerGraphic({
  width,
  phase,
  ballDelay = 0,
}: {
  width: number;
  phase: RevealPhase;
  ballDelay?: number;
}) {
  const lineW = Math.max(2, Math.round(width * 0.009));
  const tickH = Math.round(width * 0.085);
  const ballSize = Math.round(width * 0.11);
  const height = Math.max(tickH, ballSize);

  return (
    <div className="relative" style={{ width, height }}>
      <div
        aria-hidden
        className="absolute inset-x-0 bg-purple"
        style={{ top: Math.round((height - lineW) / 2), height: lineW }}
      />

      {MOBILE_RULER_TICKS.map((at) => (
        <div
          key={at}
          aria-hidden
          className="absolute bg-purple"
          style={{
            left: Math.round(width * at),
            top: Math.round((height - tickH) / 2),
            width: lineW,
            height: tickH,
          }}
        />
      ))}

      <motion.div
        aria-hidden
        className="absolute rounded-full bg-purple"
        style={{
          left: Math.round(width * 0.9 - ballSize / 2),
          top: Math.round((height - ballSize) / 2),
          width: ballSize,
          height: ballSize,
        }}
        initial={{ scale: 0 }}
        animate={phase === "hidden" ? { scale: 0 } : { scale: 1 }}
        transition={
          phase === "playing"
            ? { duration: 0.6, delay: ballDelay, ease: EASE_BOUNCE }
            : STATIC_TRANSITION
        }
      />
    </div>
  );
}

// Rating scale (1384 x 82 group) plus the separate ball on the ninth tick.
export function RulerGraphic({
  width,
  phase,
  ballDelay = 0,
}: {
  width: number;
  phase: RevealPhase;
  ballDelay?: number;
}) {
  const s = width / 1384;
  return (
    <div className="relative" style={{ width, height: Math.round(82 * s) }}>
      <Image
        src="/barometer/ruler.svg"
        alt=""
        aria-hidden
        width={1384}
        height={82}
        className="block h-full w-full"
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-purple"
        style={{
          left: 994 * s,
          top: -2 * s,
          width: 85.66 * s,
          height: 85.66 * s,
        }}
        initial={{ scale: 0 }}
        animate={phase === "hidden" ? { scale: 0 } : { scale: 1 }}
        transition={
          phase === "playing"
            ? { duration: 0.6, delay: ballDelay, ease: EASE_BOUNCE }
            : STATIC_TRANSITION
        }
      />
    </div>
  );
}

// Check circle with the ball and the line running off the right edge
// (1276 x 329 group; the circle itself is the left 329px).
export function CheckGraphic({ width }: { width: number }) {
  return (
    <Image
      src="/barometer/check.svg"
      alt=""
      aria-hidden
      width={1276}
      height={329}
      className="block max-w-none"
      style={{ width, height: "auto" }}
    />
  );
}
