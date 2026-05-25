export const DESIGN_WIDTH = 1024;

export const NAV_HEIGHT_BASE = 120;
export const BALL_DROP_BASE = 340;
export const BALL_SIZE_BASE = 68;
export const LINE_WIDTH_BASE = 6;
export const DASH_LENGTH_BASE = 36;
export const DASH_GAP_BASE = 40;
export const CENTER_LINE_DROP_BASE = 220;
export const TITLE_DIVERGE_BLACK_BASE = 120;
export const TITLE_DIVERGE_PURPLE_BASE = 160;
export const TITLE_RAISE_BASE = 36;
export const DESCRIPTION_GAP_BASE = 32;
export const TITLE_PX_DESIGN = 60;
export const DESC_PX_DESIGN = 26;
export const BALL_COL_W_BASE = 80;
export const INTRO_LOGO_W_BASE = 640;
export const NAV_LOGO_W_BASE = 170;
export const NAV_LOGO_H_BASE = 72;
export const NAV_BUTTON_PX_X = 80;
export const NAV_BUTTON_PX_Y = 16;
export const NAV_BUTTON_FONT = 22;
export const NAV_BUTTON_RADIUS = 20;
export const NAV_DIVIDER_H = 6;

export function scalePx(base: number, scale: number, min = 0): number {
  return Math.max(min, Math.round(base * scale));
}
