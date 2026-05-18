export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_BOUNCE = [0.34, 1.18, 0.64, 1] as const;

export const STEPS = {
  logoIntro: { delay: 0.0, duration: 1.6 },
  logoToNav: { delay: 1.6, duration: 1.2 },
  headlineEnter: { delay: 1.9, duration: 1.3 },
  headlineCenterPause: { delay: 3.2, duration: 0.55 },
  headlineShiftLeft: { delay: 3.75, duration: 0.8 },
  navReveal: { delay: 3.55, duration: 0.8 },
  ballEnter: { delay: 4.75, duration: 1.5 },
  subheadEnter: { delay: 7.05, duration: 1.1 },
  lineDrop: { delay: 8.35, duration: 3.2 },
  subtextFade: { delay: 10.85, duration: 0.9 },
} as const;
