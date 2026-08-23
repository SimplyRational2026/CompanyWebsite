"use client";

import { motion, useInView } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { EASE, EASE_BOUNCE } from "@/app/lib/anim";

export type RevealPhase = "hidden" | "playing" | "done";

// A section stays hidden until it scrolls into view, then plays its
// choreography once. Scrolling is never blocked: sections animate
// independently as the reader reaches them.
export function useGatedSection({ endSec }: { endSec: number }): {
  sectionRef: RefObject<HTMLElement | null>;
  phase: RevealPhase;
} {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.35 });
  const [phase, setPhase] = useState<RevealPhase>("hidden");

  useEffect(() => {
    if (phase === "hidden" && isInView) {
      setPhase("playing");
    }
  }, [phase, isInView]);

  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    const t = window.setTimeout(() => {
      setPhase("done");
    }, endSec * 1000);

    return () => window.clearTimeout(t);
  }, [phase, endSec]);

  return { sectionRef, phase };
}

type RevealFrom = "left" | "right" | "up" | "fade";

const STATIC_TRANSITION = { duration: 0 };

export function Reveal({
  children,
  phase,
  from = "left",
  delay = 0,
  dur = 1.0,
  bounce = false,
  className,
  style,
}: {
  children: ReactNode;
  phase: RevealPhase;
  from?: RevealFrom;
  delay?: number;
  dur?: number;
  bounce?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const x = from === "left" ? "-55vw" : from === "right" ? "55vw" : "0vw";
  const y = from === "up" ? 80 : 0;
  const hidden = { x, y, opacity: 0 };
  const visible = { x: "0vw", y: 0, opacity: 1 };

  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      animate={phase === "hidden" ? hidden : visible}
      transition={
        phase === "playing"
          ? { duration: dur, delay, ease: bounce ? EASE_BOUNCE : EASE }
          : STATIC_TRANSITION
      }
    >
      {children}
    </motion.div>
  );
}

// Renders the design's exact line breaks: each entry is one line.
//
// Those breaks are measured for the desktop column. Forcing them on a phone
// broke each one again wherever it ran out of room, stranding a word or two
// on a line of its own. `joined` hands the copy back to the browser as one
// run of text so it wraps to whatever measure it actually has.
export function TextLines({
  lines,
  joined = false,
}: {
  lines: readonly string[];
  joined?: boolean;
}) {
  if (joined) {
    return <>{lines.join(" ")}</>;
  }

  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

export function SectionHeading({
  lines,
  fontPx,
  align = "center",
  className,
}: {
  lines: readonly { text: string; purple?: boolean }[];
  fontPx: number;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <h2
      className={`font-serif font-extrabold tracking-tight hyphens-auto break-words ${
        align === "center" ? "text-center" : "text-left"
      } ${className ?? ""}`}
      style={{ fontSize: fontPx, lineHeight: 1.15 }}
    >
      {lines.map((line) => (
        <span
          key={line.text}
          className={`block ${line.purple ? "text-purple" : "text-ink"}`}
        >
          {line.text}
        </span>
      ))}
    </h2>
  );
}

// Bullet row with the design's 22px purple dot.
export function BulletItem({
  children,
  dotSize,
  fontPx,
  gap,
}: {
  children: ReactNode;
  dotSize: number;
  fontPx: number;
  gap: number;
}) {
  return (
    <li className="flex items-start" style={{ gap }}>
      <span
        aria-hidden
        className="shrink-0 rounded-full bg-purple"
        style={{
          width: dotSize,
          height: dotSize,
          marginTop: Math.round(fontPx * 0.65 - dotSize / 2),
        }}
      />
      <span
        className="font-bricolage font-medium text-ink"
        style={{ fontSize: fontPx, lineHeight: 1.3, textWrap: "pretty" }}
      >
        {children}
      </span>
    </li>
  );
}
