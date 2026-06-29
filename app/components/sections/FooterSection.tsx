"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import {
  ENTSCHEIDBAR_TITLE_LINES,
  fitMobileBodyFontPx,
  FOOTER_CONTACT,
  FOOTER_HEADLINE_LINES,
} from "@/app/lib/fitText";
import {
  fitMobileHeadlinePx,
  fitSectionHeadlineFontPx,
  sectionAvailableWidth,
  useSectionContentScale,
} from "@/app/lib/sectionTypography";
import ContactForm from "@/app/components/ui/ContactForm";
import {
  FOOTER_CONTACT_PX_DESIGN,
  FOOTER_ARCH_R_BASE,
  FOOTER_ARCH_CUT_DROP_BASE,
  FOOTER_ARCH_VISIBLE_RATIO,
  FOOTER_BAR_H_BASE,
  FOOTER_BAR_PAD_Y_BASE,
  FOOTER_LOGO_W_BASE,
  FOOTER_LOGO_OFFSET_Y_BASE,
  FOOTER_CREAM_BOTTOM_VH,
  ENTSCHEIDBAR_TITLE_PX_DESIGN,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  scalePx,
} from "@/app/lib/scale";

const TITLE_LINE_HEIGHT = 1.15;
const CONTACT_LINE_HEIGHT = 1.45;

function ContactDetails({
  fontPx,
  variant,
  showCompany = true,
  contentScale,
  compact = false,
}: {
  fontPx: number;
  variant: "light" | "dark";
  showCompany?: boolean;
  contentScale: number;
  compact?: boolean;
}) {
  const textClass = variant === "dark" ? "text-ink" : "text-cream";
  const companyClass =
    variant === "dark"
      ? "font-bricolage font-bold text-ink"
      : "font-bricolage font-bold text-cream";
  const linkClass = `underline underline-offset-2 ${textClass}`;
  const emailGap = scalePx(compact ? 6 : 10, contentScale, compact ? 4 : 6);
  const groupGap = scalePx(compact ? 16 : 28, contentScale, compact ? 8 : 14);
  const namePhoneGap = scalePx(compact ? 2 : 4, contentScale, 1);
  const lineHeight = compact ? 1.35 : CONTACT_LINE_HEIGHT;

  return (
    <div
      className={`font-bricolage font-medium ${textClass}`}
      style={{ fontSize: fontPx, lineHeight }}
    >
      {showCompany && <p className={companyClass}>{FOOTER_CONTACT.company}</p>}

      <p style={{ marginTop: showCompany ? groupGap : undefined }}>
        {FOOTER_CONTACT.address}
      </p>

      <p style={{ marginTop: emailGap }} className="break-words">
        <a href={`mailto:${FOOTER_CONTACT.email}`} className={`${linkClass} break-all`}>
          {FOOTER_CONTACT.email}
        </a>
      </p>

      {FOOTER_CONTACT.phones.map((phone) => (
        <div key={phone.name} style={{ marginTop: groupGap }}>
          <p>{phone.name}</p>
          <p style={{ marginTop: namePhoneGap }}>
            <a
              href={`tel:${phone.number.replace(/\s/g, "")}`}
              className={linkClass}
            >
              {phone.number}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}

function PurpleFooterBar({
  contentW,
  contentScale,
  viewportW,
  contactFontPx,
  smallFontPx,
  isMobile,
  mobileBodyFontPx,
  mobileScale,
}: {
  contentW: number;
  contentScale: number;
  viewportW: number;
  contactFontPx: number;
  smallFontPx: number;
  isMobile: boolean;
  mobileBodyFontPx: number;
  mobileScale: number;
}) {
  const archR = Math.min(
    scalePx(FOOTER_ARCH_R_BASE, isMobile ? mobileScale : contentScale, 340),
    Math.round(viewportW * (isMobile ? 0.75 : 0.55)),
  );
  const archD = archR * 2;
  const archVisibleH = Math.round(archR * FOOTER_ARCH_VISIBLE_RATIO);
  const archCutDrop = isMobile
    ? scalePx(80, mobileScale, 50)
    : scalePx(FOOTER_ARCH_CUT_DROP_BASE, contentScale, 96);
  const archClipTop = -archVisibleH + archCutDrop;
  const barPadY = scalePx(FOOTER_BAR_PAD_Y_BASE, contentScale, 16);
  const barMinH = scalePx(FOOTER_BAR_H_BASE, contentScale, 88);
  const logoW = isMobile
    ? Math.round(viewportW * 0.62)
    : scalePx(FOOTER_LOGO_W_BASE, contentScale, 265);
  const logoOffsetY = scalePx(FOOTER_LOGO_OFFSET_Y_BASE, contentScale, 32);
  const copyrightGap = scalePx(20, isMobile ? mobileScale : contentScale, 14);
  const copyrightPad = scalePx(14, isMobile ? mobileScale : contentScale, 10);
  const mobileItemGap = scalePx(20, mobileScale, 12);

  return (
    <footer className="relative overflow-visible text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 overflow-hidden"
        style={{ top: archClipTop, width: archD, height: archVisibleH }}
      >
        <div
          className="absolute rounded-full bg-purple"
          style={{ width: archD, height: archD, left: 0, top: 0 }}
        />
      </div>

      <div className="relative z-10 bg-purple px-[6vw]">
        {isMobile && (
          <div
            className="mx-auto flex flex-col font-bricolage text-cream"
            style={{
              maxWidth: contentW,
              paddingTop: scalePx(6, mobileScale, 4),
              paddingBottom: scalePx(32, mobileScale, 20),
              fontSize: mobileBodyFontPx,
              lineHeight: 1.5,
              gap: mobileItemGap,
            }}
          >
            <div className="flex flex-col items-center text-center" style={{ gap: mobileItemGap }}>
              <Image
                src="/simply_rational_white_logo.svg"
                alt="Simply Rational"
                width={558}
                height={210}
                className="h-auto"
                style={{ width: logoW }}
              />

              <p className="font-bold">{FOOTER_CONTACT.company}</p>

              <p>{FOOTER_CONTACT.address}</p>

              <p className="break-words">
                <a href={`mailto:${FOOTER_CONTACT.email}`} className="underline underline-offset-2 text-cream break-all">
                  {FOOTER_CONTACT.email}
                </a>
              </p>
            </div>

            <div className="flex flex-col items-center text-center" style={{ gap: mobileItemGap }}>
              {FOOTER_CONTACT.phones.map((phone) => (
                <div key={phone.name} className="flex flex-col items-center" style={{ gap: Math.round(mobileItemGap * 0.25) }}>
                  <p>{phone.name}</p>
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className="underline underline-offset-2 font-bold text-cream"
                  >
                    {phone.number}
                  </a>
                </div>
              ))}

              <a href="/impressum" className="underline underline-offset-2 font-medium text-cream">
                Impressum
              </a>
              <a href="/datenschutz" className="underline underline-offset-2 font-medium text-cream">
                Datenschutzerklärung
              </a>

              <div
                className="w-full border-t border-cream/35"
                style={{ paddingTop: copyrightPad, paddingBottom: copyrightPad }}
              >
                <p className="text-center font-bricolage text-cream/90" style={{ fontSize: smallFontPx }}>
                  © 2026 SIMPLY RATIONAL GmbH
                </p>
              </div>
            </div>
          </div>
        )}

        {!isMobile && (
          <div
            className="mx-auto"
            style={{ maxWidth: contentW, paddingTop: barPadY, paddingBottom: barPadY }}
          >
            <div
              className="relative flex items-center"
              style={{ minHeight: barMinH }}
            >
              <ContactDetails
                fontPx={contactFontPx}
                variant="light"
                showCompany
                contentScale={contentScale}
                compact
              />

              <nav
                className="ml-auto flex flex-col items-end gap-2 text-right font-bricolage font-medium text-cream"
                style={{ fontSize: contactFontPx }}
                aria-label="Rechtliches"
              >
                <a
                  href="/impressum"
                  className="underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  Impressum
                </a>
                <a
                  href="/datenschutz"
                  className="underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  Datenschutzerklärung
                </a>
              </nav>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <Image
                  src="/simply_rational_white_logo.svg"
                  alt="Simply Rational"
                  width={558}
                  height={210}
                  className="h-auto"
                  style={{ width: logoW, marginTop: -logoOffsetY }}
                />
              </div>
            </div>

            <div
              className="border-t border-cream/35"
              style={{ marginTop: copyrightGap, paddingTop: copyrightPad, paddingBottom: copyrightPad }}
            >
              <p className="text-center font-bricolage text-cream/90" style={{ fontSize: smallFontPx }}>
                © 2026 SIMPLY RATIONAL GmbH
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default function FooterSection() {
  const isAnimPlayingRef = useRef(false);
  const { viewportW, bodyFontPx, contentScale } =
    useSectionContentScale(isAnimPlayingRef);
  const [headlinePx, setHeadlinePx] = useState(ENTSCHEIDBAR_TITLE_PX_DESIGN);
  const [mobileTitlePx, setMobileTitlePx] = useState(36);
  const [mobileBodyFontPx, setMobileBodyFontPx] = useState(MOBILE_DESC_PX_DESIGN);

  const isMobile = viewportW < 1024;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);
  const mobileDescCap = Math.round(MOBILE_DESC_PX_DESIGN * mobileScale);

  useLayoutEffect(() => {
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
      setMobileBodyFontPx(fitMobileBodyFontPx(viewportW, bricolageFont));
    } else {
      setHeadlinePx(
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

  const contentW = sectionAvailableWidth(viewportW);

  const activeContactFontPx = isMobile ? mobileBodyFontPx : scalePx(FOOTER_CONTACT_PX_DESIGN, contentScale, 13);
  const activeSmallFontPx = isMobile
    ? Math.max(11, Math.round(mobileBodyFontPx * 0.82))
    : Math.max(12, Math.round(bodyFontPx * 0.76));

  const contactFontPx = activeContactFontPx;
  const smallFontPx = activeSmallFontPx;

  return (
    <section data-scroll-section="contact-footer" className="relative w-full">
      <div
        className="bg-cream px-[6vw] pt-[3vh] lg:pt-[8vh]"
        style={{ paddingBottom: `${FOOTER_CREAM_BOTTOM_VH}vh` }}
      >
        <h2
          className="mx-auto w-full text-center font-serif font-extrabold tracking-tight lg:hidden"
          style={{ fontSize: mobileTitlePx, lineHeight: TITLE_LINE_HEIGHT }}
        >
          <span className="text-ink">Menschliche Urteilskraft, klare Entscheidungslogik und transparente KI - </span>
          <span className="text-purple">für weiterhin gute Entscheidungen</span>
        </h2>

        <h2
          className="mx-auto hidden w-fit max-w-full text-center font-serif font-extrabold tracking-tight lg:block"
          style={{ fontSize: headlinePx, lineHeight: TITLE_LINE_HEIGHT }}
        >
          <span className="block whitespace-nowrap text-ink">
            {FOOTER_HEADLINE_LINES[0]}
          </span>
          <span className="block whitespace-nowrap">
            <span className="text-ink">und transparente KI - </span>
            <span className="text-purple">für weiterhin gute</span>
          </span>
          <span className="block whitespace-nowrap text-purple">
            {FOOTER_HEADLINE_LINES[2]}
          </span>
        </h2>

        <div
          className="mx-auto mt-[clamp(2.5rem,6vh,4.5rem)] grid grid-cols-1 items-start gap-[clamp(2rem,4vw,3rem)] lg:grid-cols-2"
          style={{ maxWidth: contentW }}
        >
          <div className="order-2 flex justify-start lg:order-1 lg:pr-6">
            <div className="border-l-[5px] border-purple pl-4 sm:pl-5 lg:max-w-[88%]">
              <ContactDetails
                fontPx={isMobile ? mobileBodyFontPx : bodyFontPx}
                variant="dark"
                showCompany={false}
                contentScale={contentScale}
              />
            </div>
          </div>

          <div className="order-1 w-full min-w-0 lg:order-2">
            <ContactForm formId="contact-form" />
          </div>
        </div>
      </div>

      <PurpleFooterBar
        contentW={contentW}
        contentScale={contentScale}
        viewportW={viewportW}
        contactFontPx={contactFontPx}
        smallFontPx={smallFontPx}
        isMobile={isMobile}
        mobileBodyFontPx={mobileBodyFontPx}
        mobileScale={mobileScale}
      />
    </section>
  );
}
