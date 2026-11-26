import type { ButtonHTMLAttributes, ReactNode } from "react";
import { BADGES, person, type Badge } from "../data/mock";
import { useI18n } from "../i18n";

/** I pulsanti del campus: pillole alte 40px, tre varianti. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "ai" }) {
  const stile = {
    primary: "bg-brand text-on-brand hover:bg-brand-hover font-semibold",
    secondary: "border border-line bg-surface text-content hover:border-line-strong font-semibold",
    ghost: "text-content-2 hover:bg-subtle hover:text-content",
    ai: "border border-line bg-surface text-content hover:border-ai",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-[13.5px] transition-colors disabled:opacity-50 ${stile} ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({ id, size = 40, ring = false }: { id: string; size?: number; ring?: boolean }) {
  if (id === "ai") return <AiMark size={size} />;
  const p = person(id);
  const badge = p.badges.map((b) => BADGES.find((x) => x.id === b)).find(Boolean);
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        aria-hidden="true"
        className={`flex h-full w-full items-center justify-center rounded-full font-heading font-semibold text-white ${ring ? "border-[3px] border-surface" : ""}`}
        style={{ background: p.color, fontSize: Math.max(11, size * 0.36) }}
      >
        {p.initials}
      </span>
      {badge && size >= 36 && (
        <span
          aria-hidden="true"
          className="absolute -end-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface"
          style={{ background: badge.color }}
        />
      )}
    </span>
  );
}

export function AiMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-ai-soft text-ai"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
      </svg>
    </span>
  );
}

/** L'etichetta accanto al nome: tinta, contorno o piena, come sul campus. */
export function BadgeChip({ badge, size = "sm" }: { badge: Badge; size?: "sm" | "full" }) {
  const { l } = useI18n();
  const base = size === "full" ? "px-3 py-1 text-[12.5px]" : "px-2 py-0.5 text-[11px]";
  const stile =
    badge.shape === "solid"
      ? { background: badge.color, color: "#fff", borderColor: badge.color }
      : badge.shape === "outline"
        ? { background: "transparent", color: badge.color, borderColor: badge.color }
        : { background: `${badge.color}22`, color: badge.color, borderColor: "transparent" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap ${base}`} style={stile}>
      {l(badge.label)}
    </span>
  );
}

export function PersonBadges({ id }: { id: string }) {
  const p = person(id);
  const b = p.badges.map((x) => BADGES.find((y) => y.id === x)).filter((x): x is Badge => Boolean(x));
  if (!b.length) return null;
  // Come l'esclusiva di ruolo: si vede la prima.
  return <BadgeChip badge={b[0]} />;
}

export function Bar({ value, className = "", tone = "brand" }: { value: number; className?: string; tone?: "brand" | "community" | "ai" }) {
  const colore = { brand: "bg-brand", community: "bg-community", ai: "bg-ai" }[tone];
  return (
    <span className={`block h-1.5 overflow-hidden rounded-full bg-subtle ${className}`} role="presentation">
      <span className={`block h-full rounded-full ${colore} transition-[width] duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  );
}

export function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-[28px] leading-tight font-semibold sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-content-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <span className="text-content-2">{icon}</span>
      <p className="font-semibold">{title}</p>
      {text && <p className="max-w-sm text-[13px] text-content-2">{text}</p>}
    </div>
  );
}

/** «5 minuti fa», «2 giorni fa», nella lingua scelta. */
export function useAgo() {
  const { locale } = useI18n();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return (d: Date) => {
    const s = (d.getTime() - Date.now()) / 1000;
    const a = Math.abs(s);
    if (a < 60) return rtf.format(Math.round(s), "second");
    if (a < 3600) return rtf.format(Math.round(s / 60), "minute");
    if (a < 86400) return rtf.format(Math.round(s / 3600), "hour");
    return rtf.format(Math.round(s / 86400), "day");
  };
}

/**
 * I loghi di chi fa il programma, Goumbook e EIIS, divisi da un filo. `tone`
 * dice su che fondo stanno: "auto" segue il tema (le due versioni, una nascosta
 * dal CSS), "dark" è un fondo sempre scuro (scritte chiare), "light" uno
 * sempre chiaro, come il certificato.
 */
export function PartnerLogos({
  height = 28,
  tone = "auto",
  label,
  className = "",
}: {
  height?: number;
  tone?: "auto" | "dark" | "light";
  label?: string;
  className?: string;
}) {
  const base = `${import.meta.env.BASE_URL}brand/`;
  const logo = (file: string, ext: string, alt: string, h: number, ratio: number) => {
    const style = { height: h, width: Math.round(h * ratio) };
    const chiaro = `${base}${file}.${ext}`;
    const scuro = `${base}${file}-light.${ext}`;
    if (tone === "light") return <img src={chiaro} alt={alt} style={style} />;
    if (tone === "dark") return <img src={scuro} alt={alt} style={style} />;
    return (
      <span className="inline-flex shrink-0">
        <img src={chiaro} alt={alt} style={style} className="logo-for-light" />
        <img src={scuro} alt={alt} style={style} className="logo-for-dark" />
      </span>
    );
  };
  const filo = tone === "dark" ? "bg-white/25" : tone === "light" ? "bg-[#d5dade]" : "bg-line-strong";
  return (
    <div role="group" aria-label={label} title={label} className={`flex items-center gap-3.5 ${className}`}>
      {logo("goumbook-logo", "png", "Goumbook", height, 4.5)}
      <span aria-hidden="true" className={`w-px shrink-0 ${filo}`} style={{ height: Math.round(height * 0.9) }} />
      {logo("eiis-logo", "svg", "EIIS", Math.round(height * 1.1), 2.535)}
    </div>
  );
}
