import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AR } from "./i18n-ar";

/**
 * Due lingue, come il campus: la chiave è la frase inglese, l'arabo sta in
 * `i18n-ar.ts`. In arabo la pagina va da destra a sinistra (`dir="rtl"`), e i
 * componenti usano le proprietà logiche di Tailwind (ps-, me-, start-…) così
 * si specchiano da soli.
 */
export type Lang = "en" | "ar";
/** Un testo dei dati, nelle due lingue. */
export type L = { en: string; ar: string };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (en: string, vars?: Record<string, string | number>) => string;
  l: (v: L | string) => string;
  /** Le date nella lingua scelta, con le cifre latine come nei contenuti. */
  locale: string;
};

const I18n = createContext<Ctx | null>(null);

function leggi(): Lang {
  try {
    return localStorage.getItem("miis-lang") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(leggi);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("miis-lang", lang);
    } catch {
      /* senza memoria del browser la lingua vale per la visita */
    }
  }, [lang]);

  const t = useCallback(
    (en: string, vars?: Record<string, string | number>) => {
      let s = lang === "ar" ? (AR[en] ?? en) : en;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );
  const l = useCallback((v: L | string) => (typeof v === "string" ? v : v[lang]), [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang: setLangState,
      t,
      l,
      locale: lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB",
    }),
    [lang, t, l],
  );
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n fuori da I18nProvider");
  return c;
}
