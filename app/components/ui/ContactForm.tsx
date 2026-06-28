"use client";

import { useRef } from "react";
import { fitMobileBodyFontPx } from "@/app/lib/fitText";
import { useSectionContentScale } from "@/app/lib/sectionTypography";
import {
  FOOTER_CONTACT_PX_DESIGN,
  FOOTER_FORM_GAP_BASE,
  FOOTER_FORM_PAD_BASE,
  FOOTER_FORM_RADIUS_BASE,
  FOOTER_FORM_TEXTAREA_H_BASE,
  MOBILE_DESC_PX_DESIGN,
  MOBILE_DESIGN_WIDTH,
  NAV_BUTTON_PX_X,
  NAV_BUTTON_PX_Y,
  NAV_BUTTON_RADIUS,
  scalePx,
} from "@/app/lib/scale";

export default function ContactForm({ formId }: { formId?: string }) {
  const isAnimPlayingRef = useRef(false);
  const { viewportW, bodyFontPx, contentScale } =
    useSectionContentScale(isAnimPlayingRef);

  const isMobile = viewportW < 1024;
  const mobileScale = Math.min(1, viewportW / MOBILE_DESIGN_WIDTH);

  const mobileBodyFontPx = isMobile
    ? fitMobileBodyFontPx(
        viewportW,
        typeof document !== "undefined"
          ? getComputedStyle(document.documentElement)
              .getPropertyValue("--font-bricolage-grotesque")
              .trim() || "sans-serif"
          : "sans-serif",
      )
    : MOBILE_DESC_PX_DESIGN;

  const activeScale = isMobile ? mobileScale : contentScale;
  const contactFontPx = isMobile
    ? mobileBodyFontPx
    : scalePx(FOOTER_CONTACT_PX_DESIGN, contentScale, 13);
  const smallFontPx = isMobile
    ? Math.max(11, Math.round(mobileBodyFontPx * 0.82))
    : Math.max(12, Math.round(bodyFontPx * 0.76));

  const formRadius = scalePx(FOOTER_FORM_RADIUS_BASE, activeScale, 16);
  const formPad = isMobile
    ? scalePx(18, mobileScale, 14)
    : scalePx(FOOTER_FORM_PAD_BASE, contentScale, 20);
  const formGap = scalePx(FOOTER_FORM_GAP_BASE, activeScale, 10);
  const textareaH = scalePx(FOOTER_FORM_TEXTAREA_H_BASE, activeScale, 120);
  const buttonPaddingX = isMobile
    ? scalePx(16, mobileScale, 12)
    : scalePx(NAV_BUTTON_PX_X, contentScale, 20);
  const buttonPaddingY = isMobile
    ? scalePx(14, mobileScale, 10)
    : scalePx(NAV_BUTTON_PX_Y, contentScale, 10);
  const buttonRadius = scalePx(NAV_BUTTON_RADIUS, activeScale, 10);
  const inputPadY = scalePx(15, activeScale, 10);

  return (
    <form
      id={formId}
      className="flex w-full flex-col bg-purple shadow-[0_24px_48px_-12px_rgba(102,26,174,0.35)]"
      style={{ borderRadius: formRadius, padding: formPad }}
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full rounded-2xl bg-cream px-4 font-bricolage text-ink outline-none placeholder:text-ink/45"
        style={{ fontSize: contactFontPx, paddingBlock: inputPadY }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full rounded-2xl bg-cream px-4 font-bricolage text-ink outline-none placeholder:text-ink/45"
        style={{
          fontSize: contactFontPx,
          marginTop: formGap,
          paddingBlock: inputPadY,
        }}
      />
      <input
        type="text"
        name="subject"
        placeholder="Betreff"
        className="w-full rounded-2xl bg-cream px-4 font-bricolage text-ink outline-none placeholder:text-ink/45"
        style={{
          fontSize: contactFontPx,
          marginTop: formGap,
          paddingBlock: inputPadY,
        }}
      />

      <textarea
        name="message"
        placeholder="Ihre Nachricht"
        className="resize-none rounded-2xl bg-cream px-4 py-3 font-bricolage text-ink outline-none placeholder:text-ink/45"
        style={{
          fontSize: contactFontPx,
          marginTop: formGap,
          height: textareaH,
        }}
      />

      <label
        className="flex shrink-0 items-start gap-3 font-bricolage text-cream"
        style={{ fontSize: smallFontPx, marginTop: formGap }}
      >
        <input
          type="checkbox"
          name="privacy"
          className="mt-1 size-4 shrink-0 rounded border-cream bg-white accent-purple"
        />
        <span>
          Mit dem Absenden dieses Formulars akzeptiere ich die Verarbeitung
          meiner persönlichen Daten gemäß den Datenschutzbestimmungen.
        </span>
      </label>

      <button
        type="submit"
        className="w-full shrink-0 bg-white font-bricolage font-semibold text-purple transition hover:bg-cream"
        style={{
          paddingInline: buttonPaddingX,
          paddingBlock: buttonPaddingY,
          fontSize: contactFontPx,
          borderRadius: buttonRadius,
          marginTop: formGap,
        }}
      >
        Klarheit in Entscheidungen bringen
      </button>
    </form>
  );
}
