"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ContactForm from "@/app/components/ui/ContactForm";
import { EASE } from "@/app/lib/anim";
import { scalePx } from "@/app/lib/scale";
import {
  BulbGraphic,
  CheckGraphic,
  DiceGraphic,
  GaugeGraphic,
  MagnifierGraphic,
  MobileRulerGraphic,
  PersonIcon,
  RulerGraphic,
} from "./graphics";
import {
  BulletItem,
  Reveal,
  SectionHeading,
  TextLines,
  useGatedSection,
  type RevealPhase,
} from "./shared";

export interface SectionProps {
  titlePx: number;
  bodyPx: number;
  contentScale: number;
  isMobile: boolean;
  quotePx: number;
  misstPx: number;
  befragungTitlePx: number;
}

const STATIC_TRANSITION = { duration: 0 };
const BODY_LINE_HEIGHT = 1.3;

// Body copy keeps the exact line breaks of the design (1920px frame).
const ZUFALL_BODY_LINES = [
  "Sie entstehen dort, wo Entscheidungsverhalten, Teamdynamiken",
  "und der Einsatz von KI die richtigen Voraussetzungen schaffen.",
  "Das Entscheidungsbarometer zeigt, wie diese Voraussetzungen",
  "in Ihrer Organisation ausgeprägt sind.",
] as const;

const SYMPTOME_BULLETS = [
  "Fehler werden nicht offen zur Sprache gebracht",
  "Niemand widerspricht der Führung direkt",
  "Teams bewerten Risiken nicht hinreichend",
  "Entscheidungen dauern zu lange – oder fallen zu schnell",
] as const;

const MISST_LEFT_LINES = [
  "Nicht, wie geschult oder intelligent Ihre",
  "Mitarbeitenden sind – sondern unter",
  "welchen Bedingungen Entscheidungen",
  "entstehen.",
] as const;

const MISST_RIGHT_LINES = [
  "Es fehlt der Blick auf die",
  "Entscheidungsprozesse - genau den liefert",
  "das Barometer",
] as const;

// Like the quotes, these two columns keep the design's line breaks, so their
// font is fitted to a column instead of being allowed to re-wrap.
export const MISST_GRID_GAP_BASE = 56;
export const MISST_GAUGE_W_BASE = 485;
export const MISST_FIT_LINES = [
  ...MISST_LEFT_LINES,
  ...MISST_RIGHT_LINES,
] as const;

const QUOTES = [
  {
    lines: [
      "„Ich treffe Entscheidungen auch dann,",
      "wenn ich ihre Konsequenzen nicht bis",
      'ins letzte Detail abschätzen kann."',
    ],
    label: "(Entscheiden unter Unsicherheit)",
  },
  {
    lines: [
      "„Bei wichtigen Entscheidungen bilde",
      "ich mir zuerst ein eigenes Urteil, bevor",
      'ich ein KI-Tool zurate ziehe."',
    ],
    label: "(KI-Kompetenz)",
  },
  {
    lines: [
      "„In meinem Team kann man Probleme",
      "und schwierige Themen offen",
      'ansprechen."',
    ],
    label: "(Team & Zusammenarbeit)",
  },
] as const;

// The quotes keep the design's exact line breaks, so their font size is fitted
// to one grid column rather than being allowed to re-wrap on narrow screens.
export const BEFRAGUNG_COLUMN_GAP_BASE = 72;
export const BEFRAGUNG_QUOTE_FIT_LINES = QUOTES.flatMap((q) => q.lines);
export const BEFRAGUNG_LABEL_FIT_LINES = QUOTES.map((q) => q.label);

const BEFRAGUNG_CAPTION_LINES = [
  "Beispielhafte Aussagen werden auf einer Skala bewertet und geben Einblick in die",
  "Wechselwirkungen, unter denen Entscheidungen in Ihrer Organisation entstehen.",
] as const;

const WISSEN_BULLETS_LEFT = [
  ["Wie leistungsfähig Ihre", "Entscheidungsprozesse sind."],
  [
    "Wie konsequent Risiken und",
    "Chancen in Entscheidungen",
    "berücksichtigt werden.",
  ],
] as const;

const WISSEN_BULLETS_RIGHT = [
  ["Wie sicher Entscheidungen auch", "unter Unsicherheit getroffen", "werden."],
  ["Wie reif der Einsatz von KI in", "Entscheidungsprozessen ist."],
] as const;

// Timeline geometry from the Figma frame (1920 wide, content 100..1820).
const PROZESS_TOP = [
  { x: 11.16, label: "Entscheidungsbarometer" },
  { x: 43.26, label: "Zielbild-Workshop Entscheidungsstärke" },
  { x: 75.23, label: "Organisations-Boosting" },
] as const;

// The ball rides on the horizontal line: it rests at the first step and rolls
// to the far end of the line while the cursor is over the timeline.
const PROZESS_BALL_START = 11.16;
const PROZESS_BALL_END = 91.69;
const PROZESS_BALL_TRAVEL_SEC = 3.2;

const PROZESS_BOTTOM = [
  { x: 27.27, label: "Auswertungsgespräch" },
  { x: 59.24, label: "Adaptions-Roadmap" },
  { x: 91.69, label: "Entscheidungs-Governance" },
] as const;

const PROZESS_STEPS = [
  "Entscheidungsbarometer",
  "Auswertungsgespräch",
  "Zielbild-Workshop Entscheidungsstärke",
  "Adaptions-Roadmap",
  "Organisations-Boosting",
  "Entscheidungs-Governance",
] as const;

const PROZESS_TEXT_LINES = [
  "Bessere Entscheidungen sind kein Selbstzweck. Sie sparen Zeit, reduzieren Risiken,",
  "verbessern die Zusammenarbeit und schaffen die Voraussetzungen dafür, dass Menschen",
  "und KI ihr Potenzial gemeinsam entfalten können. Das Entscheidungsbarometer zeigt, an",
  "welchen Stellhebeln Ihre Organisation ansetzen kann.",
] as const;

const ERGEBNIS_BULLETS = [
  ["Entscheidungen schneller und fundierter zu treffen."],
  ["Fehlentscheidungen und deren Folgekosten zu", "reduzieren."],
  [
    "Zusammenarbeit und gegenseitiges Vertrauen in",
    "Entscheidungen zu stärken.",
  ],
  [
    "KI verantwortungsvoll und wirksam in",
    "Entscheidungsprozesse einzubinden.",
  ],
  ["Auch unter Unsicherheit handlungsfähig zu bleiben."],
  ["Die Leistungsfähigkeit Ihrer Organisation nachhaltig", "zu steigern."],
] as const;

// Mobile keeps the home page's section rhythm -- pt-[3vh] pb-[8vh], as every
// section there does -- and the sub page's wider spacing moves to lg:, where
// it was always aimed. Applying it at every breakpoint put 18vh between
// sections on a phone against the home page's 11vh.
function sectionClass(): string {
  return "relative w-full overflow-hidden bg-cream px-[6vw] pt-[3vh] pb-[8vh] lg:pt-[8vh] lg:pb-[10vh]";
}

const ZUFALL_END = 3.4;

export function ZufallSection({
  titlePx,
  bodyPx,
  contentScale,
  isMobile,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: ZUFALL_END,
  });
  const diceW = isMobile
    ? Math.round(Math.min(240, contentScale * 342))
    : scalePx(342, contentScale, 140);
  const bodyGap = scalePx(33, contentScale, 16);
  // Stacked on mobile the eye reads top to bottom, so the dice lands between
  // the heading and the body. Desktop sits them side by side and keeps the
  // original order, where the dice arrives last.
  const diceDelay = isMobile ? 0.9 : 1.9;
  const bodyDelay = isMobile ? 1.9 : 0.9;

  const heading = (
    <Reveal phase={phase} from="left" className="w-full">
      <SectionHeading
        align={isMobile ? "center" : "left"}
        fontPx={titlePx}
        lines={[
          { text: "Gute Entscheidungen" },
          { text: "sind kein Zufallsprodukt", purple: true },
        ]}
      />
    </Reveal>
  );

  const body = (
    <Reveal phase={phase} from="left" delay={bodyDelay} className="w-full">
      <p
        className="font-bricolage font-medium text-ink text-left"
        style={{
          marginTop: bodyGap,
          fontSize: bodyPx,
          lineHeight: BODY_LINE_HEIGHT,
          textWrap: "pretty",
        }}
      >
        <TextLines lines={ZUFALL_BODY_LINES} joined={isMobile} />
      </p>
    </Reveal>
  );

  const dice = (
    <Reveal
      phase={phase}
      from="right"
      delay={diceDelay}
      dur={1.4}
      bounce
      className="shrink-0"
    >
      <DiceGraphic width={diceW} />
    </Reveal>
  );

  return (
    <section
      ref={sectionRef}
      data-scroll-section="zufall"
      className={sectionClass()}
    >
      {isMobile ? (
        <div className="flex w-full flex-col items-center">
          {heading}
          <div className="mt-[4vh] flex justify-center">{dice}</div>
          {body}
        </div>
      ) : (
        <div className="mx-auto flex w-full flex-row items-center justify-between gap-[8vw]">
          <div className="w-fit">
            {heading}
            {body}
          </div>
          {dice}
        </div>
      )}
    </section>
  );
}

const SYMPTOME_END = 3.8;

export function SymptomeSection({
  titlePx,
  bodyPx,
  contentScale,
  isMobile,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: SYMPTOME_END,
  });
  const magnifierW = isMobile
    ? Math.round(Math.min(300, contentScale * 563))
    : scalePx(563, contentScale, 220);
  const listGap = scalePx(30, contentScale, 14);
  // Same reordering as Zufall: heading, then magnifier, then the bullets.
  const magnifierDelay = isMobile ? 0.9 : 1.9;
  const magnifierBallDelay = magnifierDelay + 1.2;
  const bulletsDelay = isMobile ? 1.9 : 0.9;

  const heading = (
    <Reveal phase={phase} from="right" className="w-full">
      <h2
        className={`font-serif font-extrabold tracking-tight ${
          isMobile ? "text-center" : "text-left"
        }`}
        style={{ fontSize: titlePx, lineHeight: 1.15 }}
      >
        <span className="text-ink">Die typischen </span>
        <span className="text-purple">Symptome</span>
      </h2>
    </Reveal>
  );

  const bullets = (
    <Reveal phase={phase} from="right" delay={bulletsDelay} className="w-full">
      <ul
        className="list-disc font-bricolage font-medium text-ink"
        style={{
          marginTop: listGap,
          paddingLeft: scalePx(42, contentScale, 20),
          fontSize: bodyPx,
          lineHeight: 1.3,
        }}
      >
        {SYMPTOME_BULLETS.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </Reveal>
  );

  const magnifier = (
    <Reveal
      phase={phase}
      from="left"
      delay={magnifierDelay}
      dur={1.4}
      bounce
      className="shrink-0"
    >
      <MagnifierGraphic
        width={magnifierW}
        phase={phase}
        ballDelay={magnifierBallDelay}
      />
    </Reveal>
  );

  return (
    <section
      ref={sectionRef}
      data-scroll-section="symptome"
      className={sectionClass()}
    >
      {isMobile ? (
        <div className="flex w-full flex-col items-center">
          {heading}
          <div className="mt-[4vh] flex justify-center">{magnifier}</div>
          {bullets}
        </div>
      ) : (
        <div className="mx-auto flex w-full flex-row items-center justify-between gap-[8vw]">
          {magnifier}
          <div className="w-fit">
            {heading}
            {bullets}
          </div>
        </div>
      )}
    </section>
  );
}

const MISST_END = 3.6;

export function MisstSection({
  titlePx,
  contentScale,
  isMobile,
  misstPx,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: MISST_END,
  });
  const gaugeW = isMobile
    ? Math.round(Math.min(300, contentScale * MISST_GAUGE_W_BASE))
    : scalePx(MISST_GAUGE_W_BASE, contentScale, 200);
  const gridGap = scalePx(MISST_GRID_GAP_BASE, contentScale, 24);

  const gauge = (
    <Reveal
      phase={phase}
      from="fade"
      delay={0.9}
      dur={1.2}
      className="shrink-0"
    >
      <GaugeGraphic width={gaugeW} phase={phase} needleDelay={2.1} />
    </Reveal>
  );

  return (
    <section
      ref={sectionRef}
      data-scroll-section="misst"
      className={sectionClass()}
    >
      <Reveal phase={phase} from="up">
        <SectionHeading
          fontPx={titlePx}
          lines={[{ text: "Was das Barometer misst", purple: true }]}
        />
      </Reveal>

      <div
        className="mx-auto mt-[6vh] flex w-full flex-col items-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center"
        style={{ gap: gridGap }}
      >
        <Reveal
          phase={phase}
          from="left"
          delay={2.1}
          className="w-full lg:self-start"
        >
          <p
            className={`font-bricolage font-medium text-ink text-left ${
              isMobile ? "" : "whitespace-nowrap"
            }`}
            style={{
              fontSize: misstPx,
              lineHeight: BODY_LINE_HEIGHT,
              textWrap: "pretty",
            }}
          >
            <TextLines lines={MISST_LEFT_LINES} joined={isMobile} />
          </p>
        </Reveal>

        {gauge}

        <Reveal
          phase={phase}
          from="right"
          delay={2.5}
          className="flex w-full lg:self-end lg:justify-end"
        >
          <p
            className={`font-bricolage font-medium text-ink text-left ${
              isMobile ? "" : "whitespace-nowrap"
            }`}
            style={{
              fontSize: misstPx,
              lineHeight: BODY_LINE_HEIGHT,
              textWrap: "pretty",
            }}
          >
            <TextLines lines={MISST_RIGHT_LINES} joined={isMobile} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// "Entscheidungsbarometer" is wider than the mobile measure at the shared
// title size, so the heading hyphenated it mid-word and pushed "einer" onto a
// line of its own -- five lines in all. These breaks keep the compound word
// whole and land the heading in four; typography.ts fits the font to the
// longest of them. The colour split has to fall on a line boundary, so the
// ink and purple halves each take two lines.
export const BEFRAGUNG_TITLE_FIT_LINES = [
  "Das Entscheidungsbarometer",
  "basiert auf einer",
  "anonymen Befragung Ihrer",
  "Mitarbeitenden.",
] as const;

const BEFRAGUNG_TITLE_MOBILE = [
  { text: BEFRAGUNG_TITLE_FIT_LINES[0] },
  { text: BEFRAGUNG_TITLE_FIT_LINES[1] },
  { text: BEFRAGUNG_TITLE_FIT_LINES[2], purple: true },
  { text: BEFRAGUNG_TITLE_FIT_LINES[3], purple: true },
] as const;

const BEFRAGUNG_TITLE_DESKTOP = [
  { text: "Das Entscheidungsbarometer basiert auf einer" },
  { text: "anonymen Befragung Ihrer Mitarbeitenden.", purple: true },
] as const;

const BEFRAGUNG_END = 4.5;

export function BefragungSection({
  bodyPx,
  contentScale,
  isMobile,
  quotePx,
  befragungTitlePx,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: BEFRAGUNG_END,
  });
  const personSize = scalePx(99, contentScale, 52);
  const rulerW = isMobile
    ? Math.round(Math.min(360, contentScale * 1384))
    : scalePx(1384, contentScale, 280);
  const columnGap = scalePx(BEFRAGUNG_COLUMN_GAP_BASE, contentScale, 32);
  const quoteGap = scalePx(29, contentScale, 14);

  return (
    <section
      ref={sectionRef}
      data-scroll-section="befragung"
      className={sectionClass()}
    >
      <Reveal phase={phase} from="up">
        <SectionHeading
          fontPx={befragungTitlePx}
          lines={isMobile ? BEFRAGUNG_TITLE_MOBILE : BEFRAGUNG_TITLE_DESKTOP}
        />
      </Reveal>

      <div
        className="mx-auto mt-[7vh] grid w-full grid-cols-1 lg:grid-cols-3"
        style={{ gap: columnGap }}
      >
        {QUOTES.map((item, i) => (
          <Reveal
            key={item.label}
            phase={phase}
            from="up"
            delay={0.9 + i * 0.3}
            className="flex flex-col items-center text-center"
          >
            <PersonIcon size={personSize} />
            <p
              className="whitespace-nowrap font-bricolage font-medium text-ink"
              style={{
                marginTop: quoteGap,
                fontSize: quotePx,
                lineHeight: BODY_LINE_HEIGHT,
              }}
            >
              <TextLines lines={item.lines} />
            </p>
            <p
              className="whitespace-nowrap font-bricolage font-medium text-purple"
              style={{ fontSize: quotePx, lineHeight: BODY_LINE_HEIGHT }}
            >
              {item.label}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal
        phase={phase}
        from="fade"
        delay={2.4}
        className="mt-[7vh] flex w-full justify-center"
      >
        {isMobile ? (
          <MobileRulerGraphic width={rulerW} phase={phase} ballDelay={3.3} />
        ) : (
          <RulerGraphic width={rulerW} phase={phase} ballDelay={3.3} />
        )}
      </Reveal>

      <Reveal
        phase={phase}
        from="fade"
        delay={3.6}
        dur={0.8}
        className={`mt-[6vh] flex ${
          isMobile ? "justify-start" : "justify-center"
        }`}
      >
        <p
          className={`font-bricolage font-medium text-purple ${
            isMobile ? "text-left" : "text-center"
          }`}
          style={{
            fontSize: bodyPx,
            lineHeight: BODY_LINE_HEIGHT,
            textWrap: "pretty",
          }}
        >
          <TextLines lines={BEFRAGUNG_CAPTION_LINES} joined={isMobile} />
        </p>
      </Reveal>
    </section>
  );
}

const WISSEN_END = 3.4;
// Every bullet reveals together rather than one after another.
const WISSEN_BULLET_DELAY = 2.0;

export function WissenSection({
  titlePx,
  bodyPx,
  contentScale,
  isMobile,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: WISSEN_END,
  });
  const bulbW = isMobile
    ? Math.round(Math.min(280, contentScale * 393))
    : scalePx(393, contentScale, 170);
  // The design pairs a 22px dot with 32px body copy. Scaling the dot off the
  // viewport instead left it near twice the height of the fitted mobile text,
  // so on mobile derive it from the text and keep that ratio.
  const dotSize = isMobile
    ? Math.max(8, Math.round(bodyPx * (22 / 32)))
    : scalePx(22, contentScale, 10);
  // Stacked on mobile the gap is vertical; side by side it is the breathing
  // room between the bullets and the bulb, which the design sets much wider.
  const columnGap = isMobile
    ? scalePx(56, contentScale, 24)
    : scalePx(160, contentScale, 40);
  const bulletSpread = scalePx(40, contentScale, 20);

  const bulb = (
    <Reveal
      phase={phase}
      from="fade"
      delay={0.9}
      dur={1.2}
      className="shrink-0"
    >
      <BulbGraphic width={bulbW} />
    </Reveal>
  );

  const bulletList = (
    bullets: readonly (readonly string[])[],
    from: "left" | "right",
    delay: number,
  ) => (
    <ul className="flex flex-col" style={{ gap: bulletSpread }}>
      {bullets.map((lines) => (
        <Reveal
          key={lines[0]}
          phase={phase}
          from={from}
          delay={delay}
          dur={0.8}
        >
          <BulletItem
            dotSize={dotSize}
            fontPx={bodyPx}
            gap={scalePx(18, contentScale, 10)}
          >
            <TextLines lines={lines} joined={isMobile} />
          </BulletItem>
        </Reveal>
      ))}
    </ul>
  );

  return (
    <section
      ref={sectionRef}
      data-scroll-section="wissen"
      className={sectionClass()}
    >
      <Reveal phase={phase} from="up">
        <SectionHeading
          fontPx={titlePx}
          lines={[{ text: "Nach 20 Minuten wissen Sie:", purple: true }]}
        />
      </Reveal>

      {isMobile && <div className="mt-[4vh] flex justify-center">{bulb}</div>}

      <div
        className="mx-auto mt-[7vh] flex w-full flex-col items-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center"
        style={{ gap: columnGap }}
      >
        <div className="w-full lg:w-fit lg:justify-self-end">
          {bulletList(WISSEN_BULLETS_LEFT, "left", WISSEN_BULLET_DELAY)}
        </div>

        {!isMobile && bulb}

        <div className="w-full lg:w-fit">
          {bulletList(WISSEN_BULLETS_RIGHT, "right", WISSEN_BULLET_DELAY)}
        </div>
      </div>
    </section>
  );
}

// Mobile stands the timeline on its end: one vertical rail with the steps
// branching off to the right, and the ball riding down it as the reader
// scrolls rather than on hover, which phones do not have.
function ProzessMobileTimeline({
  contentScale,
  bodyPx,
  phase,
}: {
  contentScale: number;
  bodyPx: number;
  phase: RevealPhase;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 55%"],
  });

  const s = contentScale;
  const lineW = Math.max(2, Math.round(4 * s));
  const railX = scalePx(28, s, 16);
  const ballSize = scalePx(35, s, 20);
  const rowH = scalePx(86, s, 48);
  const tickW = scalePx(41, s, 24);
  const labelX = scalePx(92, s, 52);
  const tailH = scalePx(75, s, 40);

  const rowCenter = (i: number) => Math.round(i * rowH + rowH / 2);
  const trackH = PROZESS_STEPS.length * rowH + tailH;
  const ballTop = useTransform(
    scrollYProgress,
    [0, 1],
    [rowCenter(0) - ballSize / 2, trackH - ballSize],
  );

  return (
    <div
      ref={trackRef}
      className="relative mx-auto mt-[6vh] w-full"
      style={{ height: trackH }}
    >
      <motion.div
        aria-hidden
        className="absolute bg-purple"
        style={{
          left: railX - lineW / 2,
          top: rowCenter(0),
          height: trackH - rowCenter(0),
          width: lineW,
          transformOrigin: "top center",
        }}
        initial={{ scaleY: 0 }}
        animate={phase === "hidden" ? { scaleY: 0 } : { scaleY: 1 }}
        transition={
          phase === "playing"
            ? { duration: 1.2, delay: 0.6, ease: EASE }
            : STATIC_TRANSITION
        }
      />

      {PROZESS_STEPS.map((step, i) => (
        <Reveal
          key={step}
          phase={phase}
          from="left"
          delay={1.0 + i * 0.12}
          dur={0.6}
          className="absolute inset-x-0"
          style={{ top: rowCenter(i) }}
        >
          <div className="relative">
            {i > 0 && (
              <span
                aria-hidden
                className="absolute bg-purple"
                style={{
                  left: railX,
                  top: -lineW / 2,
                  width: tickW,
                  height: lineW,
                }}
              />
            )}
            <span
              className="absolute font-bricolage font-medium text-ink"
              style={{
                left: labelX,
                right: 0,
                top: 0,
                transform: "translateY(-50%)",
                fontSize: bodyPx,
                lineHeight: 1.3,
              }}
            >
              {step}
            </span>
          </div>
        </Reveal>
      ))}

      <motion.div
        aria-hidden
        className="absolute rounded-full bg-purple"
        style={{
          left: railX - ballSize / 2,
          top: ballTop,
          width: ballSize,
          height: ballSize,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "hidden" ? 0 : 1 }}
        transition={
          phase === "playing"
            ? { duration: 0.6, delay: 1.0, ease: EASE }
            : STATIC_TRANSITION
        }
      />
    </div>
  );
}

const PROZESS_END = 4.0;

export function ProzessSection({
  titlePx,
  bodyPx,
  contentScale,
  isMobile,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: PROZESS_END,
  });
  const s = contentScale;
  const lineH = Math.max(2, Math.round(5 * s));
  const ballSize = Math.round(39 * s);
  const lineTop = Math.round(191 * s);
  const labelW = Math.round(356 * s);
  const timelineH = Math.round(364 * s);
  const [ballAtEnd, setBallAtEnd] = useState(false);

  const itemTransition = (delay: number) =>
    phase === "playing"
      ? { duration: 0.6, delay, ease: EASE }
      : STATIC_TRANSITION;
  const itemAnimate = phase === "hidden" ? { opacity: 0 } : { opacity: 1 };

  return (
    <section
      ref={sectionRef}
      data-scroll-section="prozess"
      className={sectionClass()}
    >
      <Reveal phase={phase} from="up">
        <SectionHeading
          fontPx={titlePx}
          lines={[
            { text: "Machen Sie die Entscheidungsfähigkeit Ihrer" },
            { text: "Organisation sichtbar – und schaffen Sie die" },
            { text: "Grundlage für bessere Entscheidungen.", purple: true },
          ]}
        />
      </Reveal>

      {!isMobile && (
        <div
          className="relative mx-auto mt-[7vh] w-full"
          style={{ height: timelineH }}
          onMouseEnter={() => setBallAtEnd(true)}
          onMouseLeave={() => setBallAtEnd(false)}
        >
          <motion.div
            aria-hidden
            className="absolute bg-purple"
            style={{
              // The rail runs from the first tick to the last -- the same two
              // points the ball rests at and rolls to. Those percentages are
              // the connectors' centres, and the connectors are lineH wide,
              // so extend by half that at each end to reach their outer edge.
              // The connectors offset themselves by the identical expression
              // rather than a -50% transform, so both edges round to the same
              // pixel and the corner closes with no seam and no overhang.
              left: `calc(${PROZESS_BALL_START}% - ${lineH / 2}px)`,
              right: `calc(${100 - PROZESS_BALL_END}% - ${lineH / 2}px)`,
              top: lineTop,
              height: lineH,
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0 }}
            animate={phase === "hidden" ? { scaleX: 0 } : { scaleX: 1 }}
            transition={
              phase === "playing"
                ? { duration: 1.4, delay: 1.0, ease: EASE }
                : STATIC_TRANSITION
            }
          />

          {PROZESS_TOP.map((item, i) => (
            <motion.div
              key={item.label}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={itemAnimate}
              transition={itemTransition(1.4 + i * 0.25)}
            >
              <div
                className="absolute flex -translate-x-1/2 items-end justify-center text-center font-bricolage font-medium text-ink"
                style={{
                  left: `${item.x}%`,
                  top: 0,
                  height: Math.round(74 * s),
                  width: labelW,
                  fontSize: bodyPx,
                  lineHeight: BODY_LINE_HEIGHT,
                }}
              >
                {item.label}
              </div>
              <div
                aria-hidden
                className="absolute bg-purple"
                style={{
                  left: `calc(${item.x}% - ${lineH / 2}px)`,
                  top: Math.round(83 * s),
                  height: lineTop - Math.round(83 * s),
                  width: lineH,
                }}
              />
            </motion.div>
          ))}

          {PROZESS_BOTTOM.map((item, i) => (
            <motion.div
              key={item.label}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={itemAnimate}
              transition={itemTransition(1.55 + i * 0.25)}
            >
              <div
                aria-hidden
                className="absolute bg-purple"
                style={{
                  left: `calc(${item.x}% - ${lineH / 2}px)`,
                  top: lineTop,
                  height: Math.round(294 * s) - lineTop,
                  width: lineH,
                }}
              />
              <div
                className="absolute flex -translate-x-1/2 items-start justify-center text-center font-bricolage font-medium text-ink"
                style={{
                  left: `${item.x}%`,
                  top: Math.round(292 * s),
                  width: labelW,
                  fontSize: bodyPx,
                  lineHeight: BODY_LINE_HEIGHT,
                }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}

          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-purple"
            style={{
              top: lineTop + Math.round((lineH - ballSize) / 2),
              marginLeft: -ballSize / 2,
              width: ballSize,
              height: ballSize,
            }}
            initial={{ left: `${PROZESS_BALL_START}%`, opacity: 0 }}
            animate={{
              left: `${ballAtEnd ? PROZESS_BALL_END : PROZESS_BALL_START}%`,
              opacity: phase === "hidden" ? 0 : 1,
            }}
            transition={{
              left: { duration: PROZESS_BALL_TRAVEL_SEC, ease: EASE },
              opacity: itemTransition(1.4),
            }}
          />
        </div>
      )}

      {isMobile && (
        <ProzessMobileTimeline
          contentScale={contentScale}
          bodyPx={bodyPx}
          phase={phase}
        />
      )}

      <Reveal
        phase={phase}
        from="fade"
        delay={3.1}
        dur={0.8}
        className={`mt-[6vh] flex ${
          isMobile ? "justify-start" : "justify-center"
        }`}
      >
        <p
          className={`font-bricolage font-medium text-purple ${
            isMobile ? "text-left" : "text-center"
          }`}
          style={{
            fontSize: bodyPx,
            lineHeight: BODY_LINE_HEIGHT,
            textWrap: "pretty",
          }}
        >
          <TextLines lines={PROZESS_TEXT_LINES} joined={isMobile} />
        </p>
      </Reveal>
    </section>
  );
}

const ERGEBNIS_END = 3.7;

export function ErgebnisSection({
  titlePx,
  bodyPx,
  contentScale,
  isMobile,
}: SectionProps) {
  const { sectionRef, phase } = useGatedSection({
    endSec: ERGEBNIS_END,
  });
  const s = contentScale;
  const checkW = Math.round(1276 * s);
  const checkBleed = Math.round(528 * s);
  const dotSize = isMobile
    ? Math.max(8, Math.round(bodyPx * (22 / 32)))
    : scalePx(22, s, 10);
  const listGap = scalePx(33, s, 16);
  const bodyGap = scalePx(56, s, 24);
  const mobileCheckW = Math.round(640 * contentScale);
  // The ring occupies x 0..329 of the 1276-wide artwork, so its centre sits at
  // 164.5. Offsetting by that puts the ring on the screen's centre line while
  // the tail still runs off the right edge, as it does on desktop.
  const mobileCheckRingX = Math.round(mobileCheckW * (164.5 / 1276));
  // Stacked on mobile the ring sits under the heading, so it lands between the
  // heading and the bullets. Desktop bleeds it off the right edge alongside
  // the list and keeps the original order, where it arrives last.
  const checkDelay = isMobile ? 0.9 : 2.2;
  const bulletDelay = isMobile ? 1.9 : 0.7;

  return (
    <section
      ref={sectionRef}
      data-scroll-section="ergebnis"
      className={sectionClass()}
    >
      <div className="relative mx-auto w-full">
        <div className="w-full lg:w-fit">
          <Reveal phase={phase} from="left">
            <SectionHeading
              align={isMobile ? "center" : "left"}
              fontPx={titlePx}
              lines={[{ text: "Das Ergebnis:", purple: true }]}
            />
          </Reveal>

          {isMobile && (
            <Reveal
              phase={phase}
              from="right"
              delay={checkDelay}
              dur={1.4}
              bounce
              className="mt-[4vh] flex"
              style={{ marginLeft: `calc(50% - ${mobileCheckRingX}px)` }}
            >
              <CheckGraphic width={mobileCheckW} />
            </Reveal>
          )}

          <ul
            className="flex flex-col"
            style={{ marginTop: bodyGap, gap: listGap }}
          >
            {ERGEBNIS_BULLETS.map((lines, i) => (
              <Reveal
                key={lines[0]}
                phase={phase}
                from="left"
                delay={bulletDelay + i * 0.18}
                dur={0.8}
              >
                <BulletItem
                  dotSize={dotSize}
                  fontPx={bodyPx}
                  gap={scalePx(18, s, 10)}
                >
                  <TextLines lines={lines} joined={isMobile} />
                </BulletItem>
              </Reveal>
            ))}
          </ul>
        </div>

        {!isMobile && (
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ right: -checkBleed - Math.round(115 * s) }}
          >
            <Reveal
              phase={phase}
              from="right"
              delay={checkDelay}
              dur={1.4}
              bounce
            >
              <CheckGraphic width={checkW} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

const KONTAKT_END = 1.8;

export function KontaktSection({
  titlePx,
  contentScale,
  creamBottomVh,
}: SectionProps & { creamBottomVh: number }) {
  const { sectionRef, phase } = useGatedSection({
    endSec: KONTAKT_END,
  });
  const formMaxW = scalePx(880, contentScale, 300);

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      data-scroll-section="kontakt"
      className="relative w-full overflow-hidden bg-cream px-[6vw] pt-[3vh] lg:pt-[8vh]"
      style={{ paddingBottom: `${creamBottomVh}vh` }}
    >
      <Reveal phase={phase} from="up">
        <SectionHeading
          fontPx={titlePx}
          lines={[
            { text: "Ihr Weg zu mehr Entscheidungsstärke", purple: true },
          ]}
        />
      </Reveal>

      <Reveal
        phase={phase}
        from="fade"
        delay={0.9}
        dur={0.8}
        className="mt-[6vh] flex justify-center"
      >
        <div className="w-full" style={{ maxWidth: formMaxW }}>
          <ContactForm formId="barometer-contact-form" />
        </div>
      </Reveal>
    </section>
  );
}
