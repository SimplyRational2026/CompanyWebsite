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

export function unlockPageScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

export function scrollToContactForm() {
  unlockPageScroll();

  const scroll = () => {
    const form = document.getElementById("contact-form");
    if (!form) {
      return false;
    }

    const offset = 24;
    const top = form.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return true;
  };

  // Sections expand after heroIntroComplete — retry until layout settles.
  requestAnimationFrame(() => {
    requestAnimationFrame(scroll);
  });
  window.setTimeout(scroll, 120);
  window.setTimeout(scroll, 400);
  window.setTimeout(scroll, 900);
  window.setTimeout(scroll, 1500);

  return scroll();
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
