import { ENTSCHEIDBAR_BRANCHES, TEAM_MEMBERS } from "@/app/lib/fitText";

function preloadImage(src: string): Promise<void> {
  const img = new window.Image();
  img.src = src;

  if (typeof img.decode === "function") {
    return img.decode().catch(() => undefined);
  }

  return new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

function preloadImages(srcs: readonly string[]): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return Promise.all(srcs.map(preloadImage)).then(() => undefined);
}

export function preloadTeamMemberImages(): Promise<void> {
  return preloadImages(TEAM_MEMBERS.map((member) => member.image));
}

const SITE_PRELOAD_IMAGES: readonly string[] = [
  "/exclamation_point.svg",
  "/question_mark.svg",
  "/left_brain.svg",
  "/right_brain.svg",
  "/simply-rational-logo.png",
  "/simply_rational_white_logo.svg",
  "/philipp-poster.jpg",
  "/susanne-poster.jpg",
  ...ENTSCHEIDBAR_BRANCHES.map((branch) => branch.icon),
  ...TEAM_MEMBERS.map((member) => member.image),
];

export function preloadSiteImages(): Promise<void> {
  return preloadImages(SITE_PRELOAD_IMAGES);
}
