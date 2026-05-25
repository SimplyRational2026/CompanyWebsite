"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";

const SCROLL_SECTION_ATTR = "data-scroll-section";

export function ScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, []);

  return null;
}

function findNextScrollSection(section: HTMLElement): HTMLElement | null {
  let sibling = section.nextElementSibling;

  while (sibling) {
    if (
      sibling instanceof HTMLElement &&
      sibling.hasAttribute(SCROLL_SECTION_ATTR)
    ) {
      return sibling;
    }

    sibling = sibling.nextElementSibling;
  }

  return null;
}

function getMaxScrollYBeforeNextSection(section: HTMLElement): number | null {
  const next = findNextScrollSection(section);
  if (!next) {
    return null;
  }

  const nextTop = next.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, nextTop - window.innerHeight);
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

export function useSectionScrollGate(
  sectionRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useLayoutEffect(() => {
    if (!active) {
      return;
    }

    const section = sectionRef.current;
    if (!section || !findNextScrollSection(section)) {
      return;
    }

    const maxScrollY = getMaxScrollYBeforeNextSection(section);
    if (maxScrollY !== null && window.scrollY > maxScrollY) {
      window.scrollTo(0, maxScrollY);
    }
  }, [active, sectionRef]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const getSection = () => sectionRef.current;

    function getMaxScrollY(): number | null {
      const section = getSection();
      if (!section) {
        return null;
      }

      return getMaxScrollYBeforeNextSection(section);
    }

    function clampScroll() {
      const maxScrollY = getMaxScrollY();
      if (maxScrollY === null) {
        return;
      }

      if (window.scrollY > maxScrollY) {
        window.scrollTo(0, maxScrollY);
      }
    }

    function wouldCrossIntoNextSection(deltaY: number): boolean {
      const maxScrollY = getMaxScrollY();
      if (maxScrollY === null || deltaY <= 0) {
        return false;
      }

      return window.scrollY + deltaY > maxScrollY + 1;
    }

    function onWheel(event: WheelEvent) {
      if (event.deltaY <= 0) {
        return;
      }

      const maxScrollY = getMaxScrollY();
      if (maxScrollY === null) {
        return;
      }

      if (window.scrollY >= maxScrollY - 1 || wouldCrossIntoNextSection(event.deltaY)) {
        event.preventDefault();
      }
    }

    let touchStartY = 0;

    function onTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? 0;
    }

    function onTouchMove(event: TouchEvent) {
      const touchY = event.touches[0]?.clientY ?? touchStartY;
      const fingerDelta = touchStartY - touchY;

      if (wouldCrossIntoNextSection(fingerDelta)) {
        event.preventDefault();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowDown" && event.key !== "PageDown" && event.key !== " ") {
        return;
      }

      const maxScrollY = getMaxScrollY();
      if (maxScrollY === null) {
        return;
      }

      if (window.scrollY >= maxScrollY - 1) {
        event.preventDefault();
      }
    }

    clampScroll();
    window.addEventListener("scroll", clampScroll, { passive: true });
    window.addEventListener("resize", clampScroll);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", clampScroll);
      window.removeEventListener("resize", clampScroll);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, sectionRef]);
}
