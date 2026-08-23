"use client";

import { SiteFooterBar } from "@/app/components/sections/FooterSection";
import Nav from "@/app/components/sections/Nav";
import ContactModalProvider from "@/app/components/ui/ContactModalProvider";
import {
  FOOTER_CREAM_BOTTOM_VH,
  NAV_DIVIDER_H,
  NAV_HEIGHT_BASE,
  scalePx,
} from "@/app/lib/scale";
import BarometerHero from "./BarometerHero";
import {
  BefragungSection,
  ErgebnisSection,
  KontaktSection,
  MisstSection,
  ProzessSection,
  SymptomeSection,
  WissenSection,
  ZufallSection,
} from "./BarometerSections";
import { useBarometerTypography } from "./typography";

export default function BarometerPage() {
  const {
    isReady,
    isMobile,
    titlePx,
    bodyPx,
    contentScale,
    navContentScale,
    quotePx,
    misstPx,
    befragungTitlePx,
  } = useBarometerTypography();

  const sectionProps = {
    titlePx,
    bodyPx,
    contentScale,
    isMobile,
    quotePx,
    misstPx,
    befragungTitlePx,
  };

  const navTotalHeight =
    scalePx(NAV_HEIGHT_BASE, navContentScale, 56) +
    scalePx(NAV_DIVIDER_H, navContentScale, 2);

  return (
    <ContactModalProvider>
      <div className="w-full bg-cream">
        {/* The same nav as the home page, desktop and mobile menu alike.
            staticExtras skips the reveal animation, which belongs to the
            home page's hero intro and has nothing to play against here. */}
        <Nav logoInNav showExtras contentScale={navContentScale} staticExtras />
        <BarometerHero
          titlePx={titlePx}
          bodyPx={bodyPx}
          contentScale={contentScale}
          isReady={isReady}
          isMobile={isMobile}
          topOffset={navTotalHeight}
        />
        <ZufallSection {...sectionProps} />
        <SymptomeSection {...sectionProps} />
        <MisstSection {...sectionProps} />
        <BefragungSection {...sectionProps} />
        <WissenSection {...sectionProps} />
        <ProzessSection {...sectionProps} />
        <ErgebnisSection {...sectionProps} />
        <KontaktSection
          {...sectionProps}
          creamBottomVh={FOOTER_CREAM_BOTTOM_VH}
        />
        <SiteFooterBar />
      </div>
    </ContactModalProvider>
  );
}
