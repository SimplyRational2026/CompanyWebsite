"use client";

import { useCallback, useState } from "react";
import Hero from "./components/Hero";
import EntscheidungSection from "./components/EntscheidungSection";
import EntscheidbarSection from "./components/EntscheidbarSection";
import RisikoSection from "./components/RisikoSection";
import TeamSection from "./components/TeamSection";
import UngewissheitSection from "./components/UngewissheitSection";
import WasAndersSection from "./components/WasAndersSection";

export default function Home() {
  const [heroIntroComplete, setHeroIntroComplete] = useState(false);
  const handleHeroIntroComplete = useCallback(() => {
    setHeroIntroComplete(true);
  }, []);

  return (
    <>
      <Hero onIntroComplete={handleHeroIntroComplete} />
      <RisikoSection heroIntroComplete={heroIntroComplete} />
      <UngewissheitSection heroIntroComplete={heroIntroComplete} />
      <EntscheidungSection heroIntroComplete={heroIntroComplete} />
      <WasAndersSection heroIntroComplete={heroIntroComplete} />
      <EntscheidbarSection heroIntroComplete={heroIntroComplete} />
      <TeamSection heroIntroComplete={heroIntroComplete} />
    </>
  );
}
