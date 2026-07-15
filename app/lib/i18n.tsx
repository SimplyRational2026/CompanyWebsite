"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CONTENT, type Content, type Locale } from "./content";

const STORAGE_KEY = "sr-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("de");

  useEffect(() => {
    // The /en path always forces English (temporary English entry point,
    // e.g. via the .com -> .de/en/ redirect); it wins over any stored choice.
    const path = window.location.pathname;
    if (path === "/en" || path.startsWith("/en/")) {
      setLocaleState("en");
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "de" || stored === "en") {
        setLocaleState(stored);
        return;
      }
    } catch {
      // ignore storage access errors
    }
    // No explicit choice yet: default from the domain (.com → English).
    if (window.location.hostname.endsWith(".com")) {
      setLocaleState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage access errors
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useContent(): Content {
  const { locale } = useLocale();
  return CONTENT[locale];
}
