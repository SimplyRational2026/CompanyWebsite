"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EASE, EASE_BOUNCE, STEPS } from "@/app/lib/anim";

interface NavProps {
  logoInNav: boolean;
  showExtras: boolean;
}

export default function Nav({ logoInNav, showExtras }: NavProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-auto flex h-[120px] items-center justify-between px-8 md:px-14">
        <div className="flex h-[72px] w-[170px] items-center">
          {logoInNav && (
            <motion.div
              layoutId="srLogo"
              className="block w-[170px]"
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

        {showExtras && (
          <motion.button
            type="button"
            className="font-bricolage cursor-pointer rounded-[20px] bg-purple px-20 py-4 text-[24px] font-semibold tracking-wide text-cream shadow-[0_10px_28px_-10px_rgba(92,29,190,0.55)] transition hover:bg-purple-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: STEPS.navReveal.duration,
              ease: EASE,
              delay: 0.15,
            }}
          >
            Gute Entscheidung
          </motion.button>
        )}
      </div>

      {showExtras && (
        <motion.div
          className="origin-left bg-purple"
          style={{ height: 6 }}
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
