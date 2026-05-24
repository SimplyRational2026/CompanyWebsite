"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { D800, EASE, EASE_BOUNCE, STEPS } from "@/app/lib/anim";
import {
  NAV_BUTTON_FONT,
  NAV_BUTTON_PX_X,
  NAV_BUTTON_PX_Y,
  NAV_BUTTON_RADIUS,
  NAV_DIVIDER_H,
  NAV_HEIGHT_BASE,
  NAV_LOGO_H_BASE,
  NAV_LOGO_W_BASE,
  scalePx,
} from "@/app/lib/scale";

interface NavProps {
  logoInNav: boolean;
  showExtras: boolean;
  contentScale: number;
}

export default function Nav({ logoInNav, showExtras, contentScale }: NavProps) {
  const navHeight = scalePx(NAV_HEIGHT_BASE, contentScale, 56);
  const logoWidth = scalePx(NAV_LOGO_W_BASE, contentScale, 72);
  const logoSlotHeight = scalePx(NAV_LOGO_H_BASE, contentScale, 32);
  const buttonPaddingX = scalePx(NAV_BUTTON_PX_X, contentScale, 24);
  const buttonPaddingY = scalePx(NAV_BUTTON_PX_Y, contentScale, 8);
  const buttonFontSize = scalePx(NAV_BUTTON_FONT, contentScale, 11);
  const buttonRadius = scalePx(NAV_BUTTON_RADIUS, contentScale, 10);
  const dividerHeight = scalePx(NAV_DIVIDER_H, contentScale, 2);
  const navPaddingX = scalePx(56, contentScale, 16);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div
        className="pointer-events-auto flex items-center justify-between"
        style={{ height: navHeight, paddingInline: navPaddingX }}
      >
        <div
          className="flex items-center"
          style={{ height: logoSlotHeight, width: logoWidth }}
        >
          {logoInNav && (
            <motion.div
              layoutId="srLogo"
              className="block"
              style={{ width: logoWidth }}
              transition={{
                duration: STEPS.logoToNav.duration,
                ease: EASE_BOUNCE,
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
          )}
        </div>

        <AnimatePresence>
          {showExtras && (
            <motion.button
              type="button"
              className="font-bricolage cursor-pointer whitespace-nowrap bg-purple font-semibold tracking-wide text-cream shadow-[0_10px_28px_-10px_rgba(92,29,190,0.55)] transition hover:bg-purple-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
              style={{
                paddingInline: buttonPaddingX,
                paddingBlock: buttonPaddingY,
                fontSize: buttonFontSize,
                borderRadius: buttonRadius,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: STEPS.navReveal.duration,
                ease: EASE,
                delay: D800 * 0.2,
              }}
            >
              Gute Entscheidung
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {showExtras && (
        <motion.div
          className="origin-left bg-purple"
          style={{ height: dividerHeight }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: STEPS.navReveal.duration,
            ease: EASE,
          }}
        />
      )}
    </header>
  );
}
