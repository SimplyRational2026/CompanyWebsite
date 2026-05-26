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
