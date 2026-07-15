"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { D800, EASE, EASE_BOUNCE, STEPS } from "@/app/lib/anim";
import { useContactModal } from "@/app/components/ui/ContactModalProvider";
import type { Locale } from "@/app/lib/content";
import { useContent, useLocale } from "@/app/lib/i18n";
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
  staticExtras?: boolean;
}

export default function Nav({
  logoInNav,
  showExtras,
  contentScale,
  staticExtras = false,
}: NavProps) {
  const { openContactModal } = useContactModal();
  const { locale, setLocale } = useLocale();
  const content = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navHeight = scalePx(NAV_HEIGHT_BASE, contentScale, 56);
  const logoWidth = scalePx(NAV_LOGO_W_BASE, contentScale, 72);
  const logoSlotHeight = scalePx(NAV_LOGO_H_BASE, contentScale, 32);
  const buttonPaddingX = scalePx(NAV_BUTTON_PX_X, contentScale, 24);
  const buttonPaddingY = scalePx(NAV_BUTTON_PX_Y, contentScale, 8);
  const buttonFontSize = scalePx(NAV_BUTTON_FONT, contentScale, 11);
  const buttonRadius = scalePx(NAV_BUTTON_RADIUS, contentScale, 10);
  const dividerHeight = scalePx(NAV_DIVIDER_H, contentScale, 2);
  const navPaddingX = scalePx(56, contentScale, 16);
  const linkedinSize = scalePx(22, contentScale, 22);
  const navExtraTransition = staticExtras
    ? { duration: 0 }
    : {
        duration: STEPS.navReveal.duration,
        ease: EASE,
        delay: D800 * 0.2,
      };

  const pdfLinkClass =
    "font-bricolage cursor-pointer whitespace-nowrap font-semibold tracking-wide text-ink transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple";
  const ctaClass =
    "font-bricolage cursor-pointer whitespace-nowrap bg-purple font-semibold tracking-wide text-cream shadow-[0_10px_28px_-10px_rgba(102,26,174,0.55)] transition hover:bg-purple-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple";

  return (
    <header className="pointer-events-none relative z-40 w-full">
      <div
        className="pointer-events-auto flex items-center justify-between"
        style={{ height: navHeight, paddingInline: navPaddingX }}
      >
        <div className="flex items-center gap-8 lg:gap-20">
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
            {showExtras &&
              (staticExtras ? (
                <div className="hidden items-center gap-6 lg:flex">
                  <a
                    href="/20260608SR_FourPager_EntscheidungsbarometerWirtschaft_final.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pdfLinkClass}
                    style={{ fontSize: buttonFontSize }}
                  >
                    {content.nav.pdf1}
                  </a>
                  <a
                    href="/20260618_FourPager_.Insurance_Entscheidungsintelligenz.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pdfLinkClass}
                    style={{ fontSize: buttonFontSize }}
                  >
                    {content.nav.pdf2}
                  </a>
                </div>
              ) : (
                <motion.div
                  className="hidden items-center gap-6 lg:flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={navExtraTransition}
                >
                  <a
                    href="/20260608SR_FourPager_EntscheidungsbarometerWirtschaft_final.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pdfLinkClass}
                    style={{ fontSize: buttonFontSize }}
                  >
                    {content.nav.pdf1}
                  </a>
                  <a
                    href="/20260618_FourPager_.Insurance_Entscheidungsintelligenz.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pdfLinkClass}
                    style={{ fontSize: buttonFontSize }}
                  >
                    {content.nav.pdf2}
                  </a>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showExtras &&
              (staticExtras ? (
                <a
                  href="https://www.linkedin.com/company/simply-rational/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.nav.linkedin}
                  className="hidden text-purple transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple lg:block"
                >
                  <LinkedInIcon size={linkedinSize} />
                </a>
              ) : (
                <motion.a
                  href="https://www.linkedin.com/company/simply-rational/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.nav.linkedin}
                  className="hidden text-purple transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple lg:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={navExtraTransition}
                >
                  <LinkedInIcon size={linkedinSize} />
                </motion.a>
              ))}
          </AnimatePresence>

          <AnimatePresence>
            {showExtras &&
              (staticExtras ? (
                <button
                  type="button"
                  onClick={openContactModal}
                  className={`hidden lg:block ${ctaClass}`}
                  style={{
                    paddingInline: buttonPaddingX,
                    paddingBlock: buttonPaddingY,
                    fontSize: buttonFontSize,
                    borderRadius: buttonRadius,
                  }}
                >
                  {content.nav.cta}
                </button>
              ) : (
                <motion.button
                  type="button"
                  onClick={openContactModal}
                  className={`hidden lg:block ${ctaClass}`}
                  style={{
                    paddingInline: buttonPaddingX,
                    paddingBlock: buttonPaddingY,
                    fontSize: buttonFontSize,
                    borderRadius: buttonRadius,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={navExtraTransition}
                >
                  {content.nav.cta}
                </motion.button>
              ))}
          </AnimatePresence>

          <AnimatePresence>
            {showExtras &&
              (staticExtras ? (
                <LangToggle
                  locale={locale}
                  setLocale={setLocale}
                  labels={content.langSwitch}
                  className="hidden lg:flex"
                  fontSize={buttonFontSize}
                />
              ) : (
                <motion.div
                  className="hidden lg:flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={navExtraTransition}
                >
                  <LangToggle
                    locale={locale}
                    setLocale={setLocale}
                    labels={content.langSwitch}
                    fontSize={buttonFontSize}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          <AnimatePresence>
            {showExtras && (
              <motion.button
                type="button"
                aria-label={
                  mobileMenuOpen ? content.nav.menuClose : content.nav.menuOpen
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="pointer-events-auto flex h-10 w-10 flex-col items-end justify-center gap-[6px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={navExtraTransition}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.svg
                      key="close"
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-ink"
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <line x1="5" y1="5" x2="23" y2="23" />
                      <line x1="23" y1="5" x2="5" y2="23" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="burger"
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-ink"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <line x1="4" y1="8" x2="24" y2="8" />
                      <line x1="9" y1="14" x2="24" y2="14" />
                      <line x1="4" y1="20" x2="24" y2="20" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showExtras &&
          (staticExtras ? (
            <div className="bg-purple" style={{ height: dividerHeight }} />
          ) : (
            <motion.div
              className="bg-purple"
              style={{ height: dividerHeight }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={navExtraTransition}
            />
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="pointer-events-auto absolute left-0 right-0 top-full z-50 flex flex-col items-center gap-6 bg-cream px-6 py-8 shadow-[0_16px_48px_-4px_rgba(0,0,0,0.28)] lg:hidden" style={{ borderRadius: "0 0 28px 28px" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <a
              href="/20260608SR_FourPager_EntscheidungsbarometerWirtschaft_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bricolage text-base font-semibold tracking-wide text-ink transition-opacity hover:opacity-60"
            >
              {content.nav.pdf1}
            </a>
            <a
              href="/20260618_FourPager_.Insurance_Entscheidungsintelligenz.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bricolage text-base font-semibold tracking-wide text-ink transition-opacity hover:opacity-60"
            >
              {content.nav.pdf2}
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openContactModal();
              }}
              className="font-bricolage mt-2 cursor-pointer rounded-xl bg-purple px-8 py-3 text-base font-semibold tracking-wide text-cream shadow-[0_10px_28px_-10px_rgba(102,26,174,0.55)] transition hover:bg-purple-deep"
            >
              {content.nav.cta}
            </button>
            <a
              href="https://www.linkedin.com/company/simply-rational/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.nav.linkedin}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-purple transition-opacity hover:opacity-60"
            >
              <LinkedInIcon size={26} />
            </a>
            <LangToggle
              locale={locale}
              setLocale={setLocale}
              labels={content.langSwitch}
              className="mt-2 text-base"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangToggle({
  locale,
  setLocale,
  labels,
  className = "",
  fontSize,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  labels: { de: string; en: string };
  className?: string;
  fontSize?: number;
}) {
  const options: { value: Locale; label: string }[] = [
    { value: "de", label: labels.de },
    { value: "en", label: labels.en },
  ];

  return (
    <div
      className={`pointer-events-auto flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Language"
      style={fontSize ? { fontSize } : undefined}
    >
      {options.map((option, index) => {
        const active = locale === option.value;
        return (
          <div key={option.value} className="flex items-center">
            {index > 0 && (
              <span aria-hidden className="mr-1 text-ink/40">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setLocale(option.value)}
              aria-pressed={active}
              className={`font-bricolage cursor-pointer font-semibold tracking-wide transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple ${
                active ? "text-purple" : "text-ink/60"
              }`}
            >
              {option.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function LinkedInIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="block"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
