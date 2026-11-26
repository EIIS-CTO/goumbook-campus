import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronsUpDown,
  CircleHelp,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  RotateCcw,
  Sun,
  User,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { ME, NOTICES } from "../data/mock";
import { course } from "../data/course";
import { AiMark, Avatar, Bar, useAgo } from "./ui";
import { AssistantPanel } from "./Assistant";

/**
 * La cornice del campus lato partecipante: barra laterale con le due aree
 * (Formazione e Community), barra in alto a vetro, barra in basso sul
 * telefono. Ricalca `app-shell` del Digital Campus.
 */
type Item = { to: string; label: string; icon: typeof LayoutGrid; end?: boolean };

function useNav() {
  const { t } = useI18n();
  const learning: { label: string; items: Item[] }[] = [
    {
      label: t("Course"),
      items: [
        { to: "/overview", label: t("Overview"), icon: LayoutGrid },
        { to: "/course", label: t("My program"), icon: BookOpen },
        { to: "/calendar", label: t("Calendar"), icon: CalendarDays },
        { to: "/notes", label: t("Notes"), icon: NotebookPen },
      ],
    },
    {
      label: t("Support"),
      items: [
        { to: "/faq", label: t("FAQ"), icon: CircleHelp },
        { to: "/certifications", label: t("Certifications"), icon: Award },
      ],
    },
  ];
  const community: { label: string; items: Item[] }[] = [
    {
      label: t("Community"),
      items: [
        { to: "/community", label: t("Overview"), icon: LayoutGrid, end: true },
        { to: "/community/people", label: t("Connections"), icon: Users },
        { to: "/community/groups", label: t("Groups"), icon: UsersRound },
        { to: "/profile", label: t("My profile"), icon: User },
      ],
    },
  ];
  return { learning, community };
}

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [ask, setAsk] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0 });
  }, [loc.pathname]);

  return (
    <div id="shell" className="min-h-screen lg:ps-[248px]">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <Topbar onMenu={() => setMenu(true)} onAsk={() => setAsk(true)} />
      <main id="main" className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-28 sm:px-8 lg:pb-12">
        {children}
      </main>
      <TabBar onAsk={() => setAsk(true)} />
      <AssistantPanel open={ask} onClose={() => setAsk(false)} />
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const loc = useLocation();
  const nav = useNav();
  const { impact, progress } = useStore();
  const inCommunity = loc.pathname.startsWith("/community") || loc.pathname.startsWith("/profile");
  const gruppi = inCommunity ? nav.community : nav.learning;
  const c = course(lang);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 start-0 z-40 flex w-[248px] flex-col border-e border-line bg-canvas transition-transform duration-200 ${
          open ? "" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"
        }`}
        aria-label={t("Main menu")}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 px-4">
          <Link to="/overview" className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}brand/miis-mark.png`} alt="" className="h-9 w-9" />
            <span className="font-heading text-[17px] font-semibold tracking-tight">MiiS</span>
          </Link>
          <button onClick={onClose} aria-label={t("Close the menu")} className="ms-auto flex h-10 w-10 items-center justify-center rounded-lg text-content-2 hover:bg-subtle lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="mx-3 mb-3 flex gap-1 rounded-full border border-line bg-inset p-1">
          <NavLink
            to="/overview"
            className={`flex min-h-9 flex-1 items-center justify-center rounded-full px-3 text-[13px] font-semibold transition-colors ${
              !inCommunity ? "bg-brand text-on-brand" : "text-content-2 hover:text-content"
            }`}
          >
            {t("Learning")}
          </NavLink>
          <NavLink
            to="/community"
            className={`flex min-h-9 flex-1 items-center justify-center rounded-full px-3 text-[13px] font-semibold transition-colors ${
              inCommunity ? "bg-brand text-on-brand" : "text-content-2 hover:text-content"
            }`}
          >
            {t("Community")}
          </NavLink>
        </div>

        {!inCommunity && (
          <Link to="/course" className="mx-3 mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 hover:border-line-strong">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-link">
              <BookOpen size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">{c.title}</span>
              <span className="block text-[11.5px] text-content-2">{t("Cohort 1")} · {progress.percent}%</span>
            </span>
            <ChevronsUpDown size={15} className="text-content-2" />
          </Link>
        )}

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-2">
          {gruppi.map((g) => (
            <div key={g.label} className="mb-3">
              <p className="eyebrow mb-1.5 px-3">{g.label}</p>
              <ul className="flex flex-col gap-0.5">
                {g.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `flex min-h-10 items-center gap-3 rounded-full px-3 py-2 text-[13.5px] transition-colors ${
                          isActive ? "bg-brand font-semibold text-on-brand" : "text-content hover:bg-subtle"
                        }`
                      }
                    >
                      <Icon size={18} aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-3">
          <Link to="/profile" className="mb-2 block rounded-xl border border-line bg-inset p-3 transition-colors hover:border-brand">
            <p className="flex items-baseline justify-between text-xs font-semibold">
              <span>{t("Impact Index")}</span>
              <span className="tabular-nums">{impact.total}%</span>
            </p>
            <Bar value={impact.total} className="mt-1.5" />
            <p className="mt-1.5 text-[11px] leading-snug text-content-2">
              {inCommunity ? t("The community is 35% of the index.") : t("Keep going with the course to raise it.")}
            </p>
          </Link>
          <PreviewPill />
        </div>
      </aside>
    </>
  );
}

function PreviewPill() {
  const { t } = useI18n();
  return (
    <p className="flex items-center gap-2 rounded-full bg-pink/10 px-3 py-1.5 text-[11.5px] font-semibold text-pink">
      <span className="h-1.5 w-1.5 rounded-full bg-pink" aria-hidden="true" />
      {t("Preview with fictional data")}
    </p>
  );
}

function Topbar({ onMenu, onAsk }: { onMenu: () => void; onAsk: () => void }) {
  const { t } = useI18n();
  return (
    <header id="topbar" className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line px-4 backdrop-blur-md sm:px-8">
      <button onClick={onMenu} aria-label={t("Open the menu")} className="flex h-10 w-10 items-center justify-center rounded-lg text-content-2 hover:bg-subtle lg:hidden">
        <Menu size={20} />
      </button>
      <button onClick={onAsk} className="hidden h-11 items-center gap-2.5 rounded-full border border-line-strong bg-surface ps-1.5 pe-4 text-[14px] hover:border-ai sm:flex">
        <AiMark size={30} />
        {t("Ask AI")}
      </button>
      <p className="mx-auto truncate font-heading text-[16px] font-medium">{t("MiiS Digital Campus")}</p>
      <div className="flex items-center gap-2">
        <LangSwitch />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}

export function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("Language")} className={`flex rounded-full bg-subtle p-1 ${compact ? "" : "hidden sm:flex"}`}>
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`h-7 min-w-9 rounded-full px-2 text-[12.5px] font-semibold transition-colors ${lang === l ? "bg-surface text-content shadow-card" : "text-content-2"}`}
        >
          {l === "en" ? "EN" : "عربي"}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { t } = useI18n();
  const toggle = () => {
    const root = document.documentElement;
    const scuro =
      root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const nuovo = scuro ? "light" : "dark";
    root.dataset.theme = nuovo;
    try {
      localStorage.setItem("miis-theme", nuovo);
    } catch {
      /* il tema vale per la visita */
    }
  };
  return (
    <button onClick={toggle} aria-label={t("Light or dark theme")} className="relative hidden h-9 w-[60px] items-center rounded-full bg-subtle md:flex">
      <span className="theme-switch-knob absolute top-1 start-0 h-7 w-7 rounded-full bg-surface shadow-card" aria-hidden="true" />
      <span className="relative z-10 flex w-full justify-between px-2 text-content-2">
        <Sun size={14} />
        <Moon size={14} />
      </span>
    </button>
  );
}

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const fuori = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function NotificationBell() {
  const { t, l } = useI18n();
  const { readNotices, readNotice, readAllNotices } = useStore();
  const { open, setOpen, ref } = usePopover();
  const ago = useAgo();
  const navigate = useNavigate();
  const nonLette = NOTICES.filter((n) => !readNotices[n.id]).length;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={nonLette ? t("Notifications, {count} unread", { count: nonLette }) : t("Notifications")}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-content-2 hover:bg-subtle"
      >
        <Bell size={19} />
        {nonLette > 0 && (
          <span className="absolute top-1 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {nonLette}
          </span>
        )}
      </button>
      {open && (
        <div className="fade-up bg-raised absolute end-0 top-12 z-30 w-[340px] max-w-[calc(100vw-24px)] rounded-2xl border border-line p-2 shadow-lift">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="font-heading font-semibold">{t("Notifications")}</p>
            {nonLette > 0 && (
              <button onClick={() => readAllNotices(NOTICES.map((n) => n.id))} className="text-[12.5px] font-semibold text-link hover:underline">
                {t("Mark all as read")}
              </button>
            )}
          </div>
          <ul className="flex flex-col">
            {NOTICES.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => {
                    readNotice(n.id);
                    setOpen(false);
                    navigate(n.to);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-start hover:bg-subtle"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${readNotices[n.id] ? "bg-transparent" : "bg-brand"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className={`block text-[13.5px] ${readNotices[n.id] ? "text-content-2" : "font-medium"}`}>{l(n.text)}</span>
                    <span className="block text-[11.5px] text-content-2">{ago(n.at)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { t, l } = useI18n();
  const { reset } = useStore();
  const { open, setOpen, ref } = usePopover();
  const navigate = useNavigate();
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex h-11 items-center gap-2.5 rounded-2xl border border-line bg-surface ps-1.5 pe-1.5 hover:border-line-strong sm:pe-3"
      >
        <Avatar id="me" size={32} />
        <span className="hidden text-start leading-tight sm:block">
          <span className="block text-[13.5px] font-medium">{l(ME.name)}</span>
          <span className="block text-[11.5px] text-content-2">{t("Participant")}</span>
        </span>
      </button>
      {open && (
        <div className="fade-up bg-raised absolute end-0 top-13 z-30 w-[260px] rounded-2xl border border-line p-2 shadow-lift">
          <div className="px-3 py-2">
            <p className="font-medium">{l(ME.name)}</p>
            <p className="text-[12px] text-content-2">{l(ME.role)}</p>
          </div>
          <div className="my-1 flex items-center justify-between gap-2 px-3 py-1.5 sm:hidden">
            <LangSwitch compact />
          </div>
          <MenuItem icon={User} label={t("My profile")} onClick={() => { setOpen(false); navigate("/profile"); }} />
          <MenuItem icon={Award} label={t("Certifications")} onClick={() => { setOpen(false); navigate("/certifications"); }} />
          <MenuItem
            icon={RotateCcw}
            label={t("Start the preview again")}
            onClick={() => {
              reset();
              setOpen(false);
              navigate("/overview");
            }}
          />
          <div className="my-1 border-t border-line" />
          <MenuItem icon={LogOut} label={t("Sign out")} onClick={() => { setOpen(false); navigate("/"); }} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }: { icon: typeof User; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-start text-[13.5px] hover:bg-subtle">
      <Icon size={16} className="text-content-2" />
      {label}
    </button>
  );
}

/** Sul telefono: cinque voci in basso, come la tab bar del campus. */
function TabBar({ onAsk }: { onAsk: () => void }) {
  const { t } = useI18n();
  const voce = "flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium";
  return (
    <nav
      aria-label={t("Main menu")}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-canvas/90 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {[
        { to: "/overview", icon: LayoutGrid, label: t("Overview") },
        { to: "/course", icon: BookOpen, label: t("Course") },
      ].map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${voce} ${isActive ? "text-link" : "text-content-2"}`}>
          <Icon size={21} />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
      <button onClick={onAsk} className={`${voce} text-ai`}>
        <AiMark size={26} />
        <span className="truncate">{t("AI")}</span>
      </button>
      {[
        { to: "/community", icon: UsersRound, label: t("Community") },
        { to: "/calendar", icon: CalendarDays, label: t("Calendar") },
      ].map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${voce} ${isActive ? "text-link" : "text-content-2"}`}>
          <Icon size={21} />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
