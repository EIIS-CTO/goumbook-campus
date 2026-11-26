import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUp, X } from "lucide-react";
import { useI18n, type Lang } from "../i18n";
import { course, lessonsInOrder, type Course } from "../data/course";
import { EVENTS, FAQ } from "../data/mock";
import { useStore } from "../store";
import { AiMark } from "./ui";

/**
 * L'assistente AI del campus («Ask AI»). Nell'anteprima non c'è un'AI dietro: le
 * risposte si compongono dai contenuti veri del corso (lezioni, calendario,
 * FAQ), nella lingua scelta. Una domanda libera cerca la lezione più vicina.
 */
type Answer = { text: string; link?: { to: string; label: string } };

const plain = (html: string) =>
  html
    .replace(/<\/(p|li|h\d)>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

function firstSentences(text: string, n = 2) {
  const parts = text.match(/[^.!?؟]+[.!?؟]+/g) ?? [text];
  return parts.slice(0, n).join(" ").trim();
}

function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

export function useAssistant() {
  const { lang, t, l, locale } = useI18n();
  const store = useStore();
  const c = course(lang);

  return (question: string, currentLessonId?: string | null): Answer => {
    const q = question.toLowerCase();
    const has = (...k: string[]) => k.some((x) => q.includes(x));

    if (has("impact", "index", "مؤشر", "الأثر")) {
      return {
        text: t(
          "Your Impact Index is {total}%. It is made of three parts: profile {profile}% (weighs 20%), community {community}% (weighs 35%) and course {course}% (weighs 45%). The quickest way to raise it is to finish the next lesson and share one takeaway in the group of the course.",
          { ...store.impact },
        ),
        link: { to: "/profile", label: t("See your profile") },
      };
    }
    if (has("live", "session", "event", "calendar", "when", "next", "جلسة", "موعد", "متى", "التقويم", "فعالية")) {
      const prossimo = EVENTS.filter((e) => e.start > new Date()).sort((a, b) => +a.start - +b.start)[0];
      const quando = prossimo.start.toLocaleString(locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
      return {
        text: t("The next appointment is “{title}”, {when} ({where}). {description}", {
          title: l(prossimo.title),
          when: quando,
          where: l(prossimo.where),
          description: l(prossimo.description),
        }),
        link: { to: `/calendar?event=${prossimo.id}`, label: t("Open the calendar") },
      };
    }
    if (has("certificate", "شهادة")) {
      return { text: l(FAQ[3].a), link: { to: "/certifications", label: t("Certifications") } };
    }
    if (has("summar", "this lesson", "current", "لخص", "لخّص", "ملخص", "الدرس الذي", "الدرس الحالي")) {
      return summary(c, currentLessonId ?? store.lastLesson, lang, t);
    }
    if (has("about", "program", "modules", "البرنامج", "الوحدات", "عن ماذا")) {
      const temi = c.sections.slice(1, -1).map((s) => s.title);
      return {
        text: t(
          "“{course}” is a journey through five themes of innovation for sustainability: {themes}. Each module has short readings, a video with an expert and an exercise. You can follow them in any order after the welcome.",
          { course: c.title, themes: temi.join(lang === "ar" ? "، " : ", ") },
        ),
        link: { to: "/course", label: t("Open my program") },
      };
    }

    // Domanda libera: la lezione che ha più parole in comune.
    const cercate = new Set(words(question));
    let migliore: { score: number; id: string; title: string; text: string } | null = null;
    for (const { lesson } of lessonsInOrder(c)) {
      const testo = plain(lesson.html ?? lesson.questions?.map((x) => x.text).join(" ") ?? "");
      const ww = words(lesson.title + " " + testo);
      const score = ww.filter((w) => cercate.has(w)).length;
      if (testo && score > (migliore?.score ?? 0)) migliore = { score, id: lesson.id, title: lesson.title, text: testo };
    }
    if (migliore && migliore.score >= 1) {
      return {
        text: t("This is covered in the lesson “{title}”. In short: {summary}", { title: migliore.title, summary: firstSentences(migliore.text, 3) }),
        link: { to: `/course/${migliore.id}`, label: t("Open the lesson") },
      };
    }
    return {
      text: t(
        "In this preview I can answer about the lessons, the calendar, the certificate and your Impact Index. On the real campus I answer any question on the course, in your language, quoting the lesson I took the answer from.",
      ),
    };
  };
}

function summary(c: Course, lessonId: string | null, _lang: Lang, t: (s: string, v?: Record<string, string | number>) => string): Answer {
  const tutte = lessonsInOrder(c);
  const trovata = tutte.find((x) => x.lesson.id === lessonId && x.lesson.html) ?? tutte.find((x) => x.lesson.html);
  if (!trovata) return { text: "" };
  const testo = plain(trovata.lesson.html ?? "");
  return {
    text: t("Summary of “{title}” ({section}): {summary}", { title: trovata.lesson.title, section: trovata.section.title, summary: firstSentences(testo, 3) }),
    link: { to: `/course/${trovata.lesson.id}`, label: t("Open the lesson") },
  };
}

type Msg = { from: "me" | "ai"; text: string; link?: Answer["link"] };

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const ask = useAssistant();
  const loc = useLocation();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const fine = useRef<HTMLDivElement>(null);
  const lessonId = loc.pathname.startsWith("/course/") ? loc.pathname.split("/")[2] : null;

  useEffect(() => {
    fine.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setDraft("");
    setTyping(true);
    const a = ask(q, lessonId);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "ai", text: a.text, link: a.link }]);
    }, 900 + Math.min(1400, a.text.length * 6));
  };

  const suggerimenti = [
    t("What is this program about?"),
    t("Summarise the lesson I'm on"),
    t("When is the next live session?"),
    t("How does the Impact Index work?"),
  ];

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} aria-hidden="true" />
      <section
        role="dialog"
        aria-label={t("Ask AI")}
        className="fade-up fixed inset-y-0 end-0 z-50 flex w-full max-w-[440px] flex-col border-s border-line bg-surface shadow-lift"
      >
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <AiMark size={36} />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-[15px] font-semibold">{t("AI assistant")}</p>
            <p className="text-[12px] text-content-2">{t("The assistant of the campus · knows your course")}</p>
          </div>
          <button onClick={onClose} aria-label={t("Close")} className="flex h-10 w-10 items-center justify-center rounded-full text-content-2 hover:bg-subtle">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex gap-3">
            <AiMark size={30} />
            <div className="rounded-2xl rounded-ss-sm bg-ai-soft px-4 py-3 text-[14px]">
              {t("Hi Mariam! I'm the AI assistant of the campus. Ask me about the lessons, the calendar or how you're doing.")}
            </div>
          </div>

          {msgs.length === 0 && (
            <div className="mt-4 flex flex-wrap gap-2 ps-10">
              {suggerimenti.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-start text-[13px] hover:border-ai hover:text-ai">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-4">
            {msgs.map((m, i) =>
              m.from === "me" ? (
                <div key={i} className="ms-10 self-end rounded-2xl rounded-se-sm bg-brand-soft px-4 py-3 text-[14px]">
                  {m.text}
                </div>
              ) : (
                <div key={i} className="fade-up flex gap-3">
                  <AiMark size={30} />
                  <div className="rounded-2xl rounded-ss-sm bg-ai-soft px-4 py-3 text-[14px]">
                    <p>{m.text}</p>
                    {m.link && (
                      <Link to={m.link.to} onClick={onClose} className="mt-2 inline-block font-semibold text-ai hover:underline">
                        {m.link.label} ›
                      </Link>
                    )}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex gap-3">
                <AiMark size={30} />
                <div className="flex items-center gap-1 rounded-2xl bg-ai-soft px-4 py-3" aria-label={t("The AI is writing")}>
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
                </div>
              </div>
            )}
            <div ref={fine} />
          </div>
        </div>

        <form
          className="border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-line bg-inset py-1.5 ps-4 pe-1.5 focus-within:border-ai">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("Ask the AI something…")}
              className="min-w-0 flex-1 bg-transparent outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              aria-label={t("Send")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ai text-white disabled:opacity-40"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-content-2">{t("Preview: answers are built from the course content, without a live AI.")}</p>
        </form>
      </section>
    </>
  );
}
