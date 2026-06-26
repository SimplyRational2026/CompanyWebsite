"use client";

import { useEffect, useLayoutEffect } from "react";

export function ScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  return null;
}

export function useIntroScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("touchmove", prevent, { passive: false });

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("touchmove", prevent);
    };
  }, [locked]);
}

export function useScrollGate(enabled: boolean, frontierKey: string | null) {
  useEffect(() => {
    if (!enabled || !frontierKey) {
      return;
    }

    const getMaxScroll = (): number => {
      const el = document.querySelector(
        `[data-scroll-section="${frontierKey}"]`,
      ) as HTMLElement | null;
      if (!el) {
        return Number.POSITIVE_INFINITY;
      }
      const bottom = el.offsetTop + el.offsetHeight;
      return Math.max(0, bottom - window.innerHeight);
    };

    const clamp = () => {
      const max = getMaxScroll();
      if (window.scrollY > max) {
        window.scrollTo(0, max);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && window.scrollY >= getMaxScroll() - 1) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      if (currentY < touchStartY && window.scrollY >= getMaxScroll() - 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("scroll", clamp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    clamp();

    return () => {
      window.removeEventListener("scroll", clamp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [enabled, frontierKey]);
}
