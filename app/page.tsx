"use client";

import { useCallback, useState } from "react";
import Hero from "./components/Hero";
import EntscheidungSection from "./components/EntscheidungSection";
import EntscheidbarSection from "./components/EntscheidbarSection";
import FooterSection from "./components/FooterSection";
import RisikoSection from "./components/RisikoSection";
import TeamSection from "./components/TeamSection";
import UngewissheitSection from "./components/UngewissheitSection";
import WasAndersSection from "./components/WasAndersSection";
import { scrollToContactForm } from "./lib/scrollLock";

export default function Home() {
  const [heroIntroComplete, setHeroIntroComplete] = useState(false);
  const [mountAllSections, setMountAllSections] = useState(false);
  const handleHeroIntroComplete = useCallback(() => {
    setHeroIntroComplete(true);
  }, []);
  const handleNavigateToContact = useCallback(() => {
    setHeroIntroComplete(true);
    setMountAllSections(true);
    scrollToContactForm();
  }, []);

  return (
    <>
      <Hero
        onIntroComplete={handleHeroIntroComplete}
        onNavigateToContact={handleNavigateToContact}
      />
      <RisikoSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <UngewissheitSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <EntscheidungSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <WasAndersSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <EntscheidbarSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <TeamSection heroIntroComplete={heroIntroComplete} mountImmediately={mountAllSections} />
      <FooterSection />
    </>
  );
}
