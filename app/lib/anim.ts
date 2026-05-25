export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_BOUNCE = [0.34, 1.18, 0.64, 1] as const;

export const D800 = 0.8;
const D600 = 0.6;
export const D1000 = 1.0;
export const DASHED_DUR = D800 * 3.75;
const LINE_DROP = 2.8;

const DASHED_RETRACT_START = 4.0 + D1000 + D1000;
const LINE_DROP_DELAY = DASHED_RETRACT_START + D1000;
export const LINE_PHASE_DROP = 0.38;
export const LINE_PHASE_TO_NAV = 0.88;

export const STEPS = {
  logoIntro: { delay: 0.0, duration: D800 },
  logoToNav: { delay: 0.8, duration: D800 },
  headlineEnter: { delay: 0.8, duration: D800 },
  headlineCenterPause: { delay: 1.6, duration: D600 },
  headlineShiftLeft: { delay: 2.2, duration: D600 },
  navReveal: { delay: 2.8, duration: D800 },
  ballEnter: { delay: 4.0, duration: D1000 },
  subheadEnter: { delay: DASHED_RETRACT_START, duration: D800 },
  lineDrop: { delay: LINE_DROP_DELAY, duration: LINE_DROP },
  subtextFade: {
    delay: LINE_DROP_DELAY + LINE_DROP * LINE_PHASE_TO_NAV,
    duration: D800,
  },
} as const;

export const INTRO_END =
  STEPS.subtextFade.delay + STEPS.subtextFade.duration;

export const SECTION_TITLE_ENTER = D1000;
export const SECTION_TITLE_PAUSE = D800;
export const SECTION_TITLE_SHIFT = D800;
export const SECTION_BODY_ENTER = D1000;
export const SECTION_MARK_ENTER = D1000 * 1.5;

export const SECTION_TITLE_PHASE =
  SECTION_TITLE_ENTER + SECTION_TITLE_PAUSE + SECTION_TITLE_SHIFT;
export const SECTION_BODY_START = SECTION_TITLE_PHASE;
export const SECTION_MARK_START = SECTION_BODY_START + SECTION_BODY_ENTER;
export const SECTION_ANIM_END = SECTION_MARK_START + SECTION_MARK_ENTER;
