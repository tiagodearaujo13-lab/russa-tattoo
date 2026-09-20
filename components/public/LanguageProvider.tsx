"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getTranslationValue, type Language, type TranslationValue } from "@/lib/i18n/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  tObject: <T extends TranslationValue>(key: string) => T;
};

const STORAGE_KEY = "russa-language";
const LANGUAGE_CHANGE_EVENT = "russa-language-change";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLanguage(): Language {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "en" ? "en" : "pt";
}

function subscribeToLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore<Language>(subscribeToLanguage, getStoredLanguage, () => "pt");

  const setLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => {
      const translation = getTranslationValue(language, key);
      return typeof translation === "string" ? translation : key;
    },
    tObject: <T extends TranslationValue>(key: string) => getTranslationValue(language, key) as T,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
