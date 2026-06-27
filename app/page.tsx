"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import EntscheidungSection from "./components/EntscheidungSection";
import EntscheidbarSection from "./components/EntscheidbarSection";
import FooterSection from "./components/FooterSection";
import RisikoSection from "./components/RisikoSection";
import TeamSection from "./components/TeamSection";
import UngewissheitSection from "./components/UngewissheitSection";
import WasAndersSection from "./components/WasAndersSection";
import ContactModalProvider from "./components/ContactModalProvider";
import { useScrollGate } from "./lib/scrollLock";
import { preloadSiteImages } from "./lib/teamEntrance";

const GATED_SECTIONS = [
  "risiko",
  "ungewissheit",
  "entscheidung",
  "was-anders",
  "entscheidbar",
  "team",
] as const;

export default function Home() {
  const [heroIntroComplete, setHeroIntroComplete] = useState(false);
  const [finishedSections, setFinishedSections] = useState<
    Record<string, boolean>
  >({});
  const [startedSections, setStartedSections] = useState<
    Record<string, boolean>
  >({});
  const [footerReached, setFooterReached] = useState(false);

  useEffect(() => {
    void preloadSiteImages();
  }, []);

  useEffect(() => {
    const el = document.querySelector('[data-scroll-section="contact-footer"]');
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setFooterReached(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleHeroIntroComplete = useCallback(() => {
    setHeroIntroComplete(true);
  }, []);
  const handleSectionFinished = useCallback((key: string) => {
    setFinishedSections((prev) =>
      prev[key] ? prev : { ...prev, [key]: true },
    );
  }, []);
  const handleSectionStarted = useCallback((key: string) => {
    setStartedSections((prev) =>
      prev[key] ? prev : { ...prev, [key]: true },
    );
  }, []);

  const frontierKey = useMemo(() => {
    return GATED_SECTIONS.find((key) => !finishedSections[key]) ?? null;
  }, [finishedSections]);

  useScrollGate(heroIntroComplete, frontierKey);

  const activeArrowKey = useMemo((): string | null => {
    if (!heroIntroComplete || footerReached) {
      return null;
    }

    let lastFinished: string | null = null;
    for (const key of GATED_SECTIONS) {
      if (finishedSections[key]) {
        lastFinished = key;
      } else {
        break;
      }
    }

    if (frontierKey && startedSections[frontierKey] && !finishedSections[frontierKey]) {
      return null;
    }

    if (lastFinished) {
      return lastFinished;
    }

    return "hero";
  }, [finishedSections, startedSections, heroIntroComplete, frontierKey, footerReached]);

  return (
    <ContactModalProvider>
      <Hero
        onIntroComplete={handleHeroIntroComplete}
        showScrollHint={activeArrowKey === "hero"}
      />
      <RisikoSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("risiko")}
        onStarted={() => handleSectionStarted("risiko")}
        showScrollHint={activeArrowKey === "risiko"}
      />
      <UngewissheitSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("ungewissheit")}
        onStarted={() => handleSectionStarted("ungewissheit")}
        showScrollHint={activeArrowKey === "ungewissheit"}
      />
      <EntscheidungSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("entscheidung")}
        onStarted={() => handleSectionStarted("entscheidung")}
        showScrollHint={activeArrowKey === "entscheidung"}
      />
      <WasAndersSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("was-anders")}
        onStarted={() => handleSectionStarted("was-anders")}
        showScrollHint={activeArrowKey === "was-anders"}
      />
      <EntscheidbarSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("entscheidbar")}
        onStarted={() => handleSectionStarted("entscheidbar")}
        showScrollHint={activeArrowKey === "entscheidbar"}
      />
      <TeamSection
        heroIntroComplete={heroIntroComplete}
        onFinished={() => handleSectionFinished("team")}
        onStarted={() => handleSectionStarted("team")}
        showScrollHint={activeArrowKey === "team"}
      />
      <FooterSection />
    </ContactModalProvider>
  );
}
