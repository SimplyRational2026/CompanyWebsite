export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_BOUNCE = [0.34, 1.18, 0.64, 1] as const;
export const EASE_BRAIN_CLOSE = [0.4, 0, 0.2, 1] as const;

export const D800 = 0.8;
const D600 = 0.6;
const D400 = 0.4;
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

export const BRAIN_CLOSE_DELAY = D600;
export const BRAIN_CLOSE_DUR = D1000 * 1.75;
export const BRAIN_PAUSE = D800 * 1.15;
export const BRAIN_SHIFT_DUR = D1000 * 1.2;
export const BRAIN_TEXT_DUR = D1000 * 1.2;
export const BRAIN_BALL_DUR = D1000 * 1.65;
export const BRAIN_CROSSFADE_DUR = D1000 * 1.2;
export const BRAIN_EXIT_DUR = D1000 * 1.85;

export const BRAIN_SHIFT_START =
  BRAIN_CLOSE_DELAY + BRAIN_CLOSE_DUR + BRAIN_PAUSE;
export const BRAIN_TEXT_START = BRAIN_SHIFT_START;
export const BRAIN_BALL_START =
  BRAIN_SHIFT_START + BRAIN_SHIFT_DUR + BRAIN_PAUSE;
export const BRAIN_EXIT_START = BRAIN_BALL_START + BRAIN_BALL_DUR;
export const BRAIN_VIDEO_START = BRAIN_EXIT_START;
export const BRAIN_ANIM_END = BRAIN_EXIT_START + BRAIN_EXIT_DUR;

export const WAS_TITLE_ENTER = D1000 * 1.2;
export const WAS_TITLE_PAUSE = D800;
export const WAS_TITLE_SHRINK = D800;
export const WAS_TITLE_PHASE =
  WAS_TITLE_ENTER + WAS_TITLE_PAUSE + WAS_TITLE_SHRINK;

export const WAS_CIRCLE_ENTER = D1000 * 1.2;
export const WAS_CIRCLE_GAP = D600;
export const WAS_CIRCLE_START = WAS_TITLE_PHASE + WAS_CIRCLE_GAP;

export const WAS_SPIN_DUR = D1000;
export const WAS_TEXT_SLIDE_DUR = D1000;
export const WAS_REVEAL_DUR = D1000 * 1.6;
export const WAS_RING_SPIN_STEP = 90;
export const WAS_RING_SPIN_DUR = D1000 * 2.2;
export const WAS_TEXT_GAP = D800 * 0.75;
export const WAS_TEXT_CYCLE = WAS_REVEAL_DUR + WAS_TEXT_GAP;

export const WAS_HUB_START = WAS_CIRCLE_START + WAS_CIRCLE_ENTER;
export const WAS_HUB_PHASE = WAS_TEXT_CYCLE * 4;

export const WAS_VIDEO_ENTER = D1000 * 1.2;
export const WAS_VIDEO_START = WAS_HUB_START + WAS_HUB_PHASE;
export const WAS_ANIM_END = WAS_VIDEO_START + WAS_VIDEO_ENTER;
