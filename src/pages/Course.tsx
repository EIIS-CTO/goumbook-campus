import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FileText,
  FolderOpen,
  Lock,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  PencilLine,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { course, lessonsInOrder, type Lesson, type Question } from "../data/course";
import { AiMark, Bar, Button, Empty } from "../components/ui";
import { useNextLesson } from "./Overview";
import { useAssistant } from "../components/Assistant";

export function CourseIndex() {
  const next = useNextLesson();
  return <Navigate to={`/course/${next.lesson.id}`} replace />;
}

const ICONA = { reading: FileText, video: PlayCircle, test: PencilLine };

export function CoursePage() {
  const { lessonId } = useParams();
  const { t, lang } = useI18n();
  const store = useStore();
  const navigate = useNavigate();
  const c = course(lang);
  const tutte = lessonsInOrder(c);
  const i = tutte.findIndex((x) => x.lesson.id === lessonId);
  const [lista, setLista] = useState(true);
  const [aperte, setAperte] = useState<Record<string, boolean>>({});
  const corrente = tutte[i];

  useEffect(() => {
    if (corrente) store.visit(corrente.lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!corrente) return <Navigate to="/course" replace />;
  if (!store.sectionOpen(corrente.section.id)) return <Navigate to="/course" replace />;

  const { lesson, section } = corrente;
  const nSezione = c.sections.findIndex((s) => s.id === section.id) + 1;
  const nLezione = section.lessons.findIndex((l) => l.id === lesson.id) + 1;
  const prima = tutte.slice(0, i).reverse().find((x) => store.sectionOpen(x.section.id));
  const dopo = tutte.slice(i + 1).find((x) => store.sectionOpen(x.section.id));
  const tipo = { reading: t("Article"), video: t("Video"), test: t("Exercise") };
  const fatta = Boolean(store.done[lesson.id]);
  const domandeFatte = (lesson.questions ?? []).every((q) => store.answers[q.id]?.checked);

  const avanti = () => {
    if (lesson.type !== "test" || domandeFatte) store.complete(lesson.id);
    if (dopo) navigate(`/course/${dopo.lesson.id}`);
    else navigate("/certifications");
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">{t("My program")}</p>
          <h1 className="text-[28px] leading-tight font-semibold sm:text-[34px]">{c.title}</h1>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-[280px]">
          <Bar value={store.progress.percent} className="flex-1" />
          <span className="text-[12px] whitespace-nowrap text-content-2 tabular-nums">
            {store.progress.percent}% · {t("{done}/{total} lessons", { done: store.progress.done, total: store.progress.total })}
          </span>
        </div>
      </div>

      <button onClick={() => setLista(!lista)} className="mb-4 hidden items-center gap-2 text-content-2 hover:text-content lg:flex">
        {lista ? <PanelLeftClose size={16} className="rtl:-scale-x-100" /> : <PanelLeftOpen size={16} className="rtl:-scale-x-100" />}
        {lista ? t("Hide the list of lessons") : t("Show the list of lessons")}
      </button>

      <div className={`grid gap-5 ${lista ? "lg:grid-cols-[340px_1fr]" : ""}`}>
        {lista && (
          <aside className="card order-last self-start p-2 lg:sticky lg:top-20 lg:order-none lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
            {c.sections.map((s) => {
              const aperta = s.id === section.id ? aperte[s.id] !== false : Boolean(aperte[s.id]);
              const fatteS = s.lessons.filter((l) => store.done[l.id]).length;
              const chiusa = !store.sectionOpen(s.id);
              return (
                <div key={s.id} className="mb-1">
                  <button
                    onClick={() => setAperte({ ...aperte, [s.id]: !aperta })}
                    className={`flex w-full items-start gap-2 rounded-2xl px-3 py-3 text-start ${aperta ? "bg-inset" : "hover:bg-inset"}`}
                    aria-expanded={aperta}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        {s.title}
                        {chiusa && <Lock size={13} className="text-content-2" />}
                      </span>
                      <span className="mt-1.5 flex items-center gap-2 text-[11.5px] text-content-2">
                        <Bar value={(fatteS / s.lessons.length) * 100} className="w-20" />
                        {t("{done}/{total} completed", { done: fatteS, total: s.lessons.length })}
                      </span>
                    </span>
                    <ChevronDown size={16} className={`mt-1 text-content-2 transition-transform ${aperta ? "rotate-180" : ""}`} />
                  </button>
                  {aperta && (
                    <ul className="mt-1 flex flex-col gap-0.5 px-1 pb-1">
                      {chiusa && <li className="px-3 py-2 text-[12.5px] text-content-2">{t("Opens when you have finished the other modules.")}</li>}
                      {s.lessons.map((l) => {
                        const Icon = ICONA[l.type];
                        const attiva = l.id === lesson.id;
                        const stato = store.done[l.id] ? t("Done") : attiva ? t("In progress") : t("To do");
                        const contenuto = (
                          <>
                            <span className="mt-0.5">
                              {store.done[l.id] ? (
                                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand text-on-brand">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : attiva ? (
                                <CircleDot size={18} className="text-link" />
                              ) : (
                                <span className="block h-[18px] w-[18px] rounded-full border-[1.5px] border-line-strong" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13.5px] leading-snug">{l.title}</span>
                              <span className="mt-0.5 flex items-center gap-1 text-[11.5px] text-content-2">
                                <Icon size={12} /> {tipo[l.type]} · {stato}
                              </span>
                            </span>
                          </>
                        );
                        return (
                          <li key={l.id}>
                            {chiusa ? (
                              <span className="flex gap-3 rounded-xl px-3 py-2 opacity-50">{contenuto}</span>
                            ) : (
                              <Link
                                to={`/course/${l.id}`}
                                className={`flex gap-3 rounded-xl px-3 py-2 ${attiva ? "bg-brand-soft" : "hover:bg-subtle"}`}
                                aria-current={attiva ? "page" : undefined}
                              >
                                {contenuto}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
            <Link to="/certifications" className="flex items-center justify-between rounded-2xl px-3 py-3 font-semibold hover:bg-inset">
              <span className="flex items-center gap-1.5">
                {t("Certificate")}
                {store.progress.done < store.progress.total && <Lock size={13} className="text-content-2" />}
              </span>
              <ChevronRight size={16} className="text-content-2 rtl:-scale-x-100" />
            </Link>
          </aside>
        )}

        <div className="flex min-w-0 flex-col gap-5">
          <article className="card overflow-hidden" key={lesson.id}>
            <div className="p-5 sm:p-7">
              <p className="eyebrow">
                {t("Module {m} · lesson {n} of {total}", { m: nSezione - 1, n: nLezione, total: section.lessons.length })}
              </p>
              <h2 className="mt-2 text-[24px] leading-tight font-semibold">{lesson.title}</h2>
              {nLezione === 1 && section.description && (
                <div className="mt-4 rounded-xl border-s-4 border-brand bg-inset px-4 py-3 text-[14px] whitespace-pre-line text-content-2">{section.description}</div>
              )}
              <div className="mt-5">
                <LessonBody lesson={lesson} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-7">
              <AskAbout lesson={lesson} />
              <span className="mx-auto hidden text-[13px] text-content-2 md:block">{fatta ? `✓ ${t("Done")}` : tipo[lesson.type]}</span>
              <div className="ms-auto flex gap-2">
                {prima && (
                  <Button variant="secondary" onClick={() => navigate(`/course/${prima.lesson.id}`)}>
                    <ChevronLeft size={16} className="rtl:-scale-x-100" />
                    {t("Previous")}
                  </Button>
                )}
                <Button onClick={avanti}>
                  {dopo ? t("Continue") : t("Finish")}
                  <ChevronRight size={16} className="rtl:-scale-x-100" />
                </Button>
              </div>
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            <LessonNotes lessonId={lesson.id} />
            <section className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-semibold">{t("Lesson materials")}</h3>
                  <p className="text-[12.5px] text-content-2">{t("Uploaded by the teachers of the course")}</p>
                </div>
                <span className="rounded-full bg-subtle px-2.5 py-1 text-[11.5px] text-content-2">{t("0 files")}</span>
              </div>
              <div className="mt-4">
                <Empty
                  icon={<FolderOpen size={22} />}
                  title={t("No materials yet")}
                  text={t("The attachments of “{module}” will appear here.", { module: section.title })}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function LessonBody({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  if (lesson.type === "reading") return <div className="prose-lesson" dangerouslySetInnerHTML={{ __html: lesson.html ?? "" }} />;
  if (lesson.type === "video") {
    if (!lesson.vimeo) return <p className="text-content-2">{t("Video not available.")}</p>;
    const src = `https://player.vimeo.com/video/${lesson.vimeo.id}?h=${lesson.vimeo.h}&title=0&byline=0&portrait=0&dnt=1`;
    return (
      <div className="overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={src}
          title={lesson.title}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {(lesson.questions ?? []).map((q, n) => (
        <QuestionCard key={q.id} q={q} n={n + 1} total={lesson.questions!.length} />
      ))}
    </div>
  );
}

function QuestionCard({ q, n, total }: { q: Question; n: number; total: number }) {
  const { t } = useI18n();
  const { answers, setAnswer } = useStore();
  const a = answers[q.id] ?? {};
  const [scelta, setScelta] = useState<number | undefined>(a.choice);
  const [testo, setTesto] = useState(a.text ?? "");
  const [modifica, setModifica] = useState(!a.checked);

  if (q.kind === "single-choice") {
    const data = a.checked && a.choice !== undefined ? q.options[a.choice] : null;
    return (
      <fieldset className="rounded-2xl border border-line p-5">
        {total > 1 && <p className="eyebrow mb-2">{t("Question {n} of {total}", { n, total })}</p>}
        <legend className="sr-only">{t("Question")}</legend>
        <div className="prose-lesson mb-4 font-semibold" dangerouslySetInnerHTML={{ __html: q.text }} />
        <div className="flex flex-col gap-2">
          {q.options.map((o, i) => {
            const scelto = scelta === i;
            const esito = a.checked && a.choice === i ? (o.correct ? "border-success bg-success/10" : "border-error bg-error/8") : scelto ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong";
            return (
              <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${esito}`}>
                <input
                  type="radio"
                  name={q.id}
                  checked={scelto}
                  onChange={() => {
                    setScelta(i);
                    if (a.checked && !q.options[a.choice ?? 0]?.correct) setAnswer(q.id, { checked: false });
                  }}
                  disabled={Boolean(data?.correct)}
                  className="mt-1 accent-[var(--eiis-brand-600)]"
                />
                <span>{o.text}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!data?.correct && (
            <Button disabled={scelta === undefined} onClick={() => setAnswer(q.id, { choice: scelta, checked: true })}>
              {t("Check the answer")}
            </Button>
          )}
          {data && (
            <p role="status" className={`font-semibold ${data.correct ? "text-success" : "text-error"}`}>
              {data.correct ? t("Well done!") : t("Not quite. Try again.")}
            </p>
          )}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="rounded-2xl border border-line p-5">
      {total > 1 && <p className="eyebrow mb-2">{t("Question {n} of {total}", { n, total })}</p>}
      <div className="prose-lesson mb-4 font-semibold" dangerouslySetInnerHTML={{ __html: q.text }} />
      {modifica ? (
        <>
          <textarea
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            rows={5}
            placeholder={t("Write your answer…")}
            className="w-full rounded-xl border border-line bg-inset p-3.5 outline-none focus:border-brand"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[12px] text-content-2">{t("{n} words", { n: testo.trim() ? testo.trim().split(/\s+/).length : 0 })}</span>
            <Button
              disabled={!testo.trim()}
              onClick={() => {
                setAnswer(q.id, { text: testo.trim(), checked: true });
                setModifica(false);
              }}
            >
              {t("Submit")}
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-success/8 p-4">
          <p className="mb-1 text-[12px] font-semibold text-success">✓ {t("Answer submitted")}</p>
          <p className="whitespace-pre-line">{a.text}</p>
          <button onClick={() => setModifica(true)} className="mt-2 text-[13px] font-semibold text-link hover:underline">
            {t("Edit")}
          </button>
        </div>
      )}
    </div>
  );
}

function AskAbout({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  const ask = useAssistant();
  const [risposta, setRisposta] = useState<string | null>(null);
  const [attesa, setAttesa] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="ai"
        onClick={() => {
          setAttesa(true);
          setRisposta(null);
          window.setTimeout(() => {
            setRisposta(ask("summarise this lesson", lesson.id).text);
            setAttesa(false);
          }, 1100);
        }}
      >
        <AiMark size={24} />
        {t("Explore with AI")}
      </Button>
      {(attesa || risposta) && (
        <div className="fade-up max-w-xl rounded-2xl bg-ai-soft px-4 py-3 text-[13.5px]">
          {attesa ? (
            <span className="flex gap-1" aria-label={t("The AI is writing")}>
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ai" />
            </span>
          ) : (
            risposta
          )}
        </div>
      )}
    </div>
  );
}

function LessonNotes({ lessonId }: { lessonId: string }) {
  const { t, locale } = useI18n();
  const { notes, addNote, removeNote } = useStore();
  const [nuova, setNuova] = useState<string | null>(null);
  const mie = notes.filter((n) => n.lessonId === lessonId);
  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-semibold">{t("Your notes")}</h3>
          <p className="text-[12.5px] text-content-2">{t("On this lesson · private")}</p>
        </div>
        {nuova === null && (
          <Button onClick={() => setNuova("")}>
            <Plus size={15} />
            {t("New note")}
          </Button>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {nuova !== null && (
          <div className="rounded-xl border border-brand p-3">
            <textarea
              autoFocus
              value={nuova}
              onChange={(e) => setNuova(e.target.value)}
              rows={3}
              placeholder={t("What do you want to remember?")}
              className="w-full bg-transparent outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setNuova(null)}>
                {t("Cancel")}
              </Button>
              <Button
                disabled={!nuova.trim()}
                onClick={() => {
                  addNote(lessonId, nuova.trim());
                  setNuova(null);
                }}
              >
                {t("Save")}
              </Button>
            </div>
          </div>
        )}
        {mie.map((n) => (
          <div key={n.id} className="group rounded-xl bg-inset p-3">
            <p className="whitespace-pre-line">{n.text}</p>
            <div className="mt-2 flex items-center justify-between text-[11.5px] text-content-2">
              {new Date(n.at).toLocaleDateString(locale, { day: "numeric", month: "short" })}
              <button onClick={() => removeNote(n.id)} aria-label={t("Delete the note")} className="rounded-md p-1 hover:text-error">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {mie.length === 0 && nuova === null && (
          <Empty icon={<NotebookPen size={22} />} title={t("No notes on this lesson")} text={t("What you write stays tied to the lesson: you find it again in the Notes page.")} />
        )}
      </div>
    </section>
  );
}
