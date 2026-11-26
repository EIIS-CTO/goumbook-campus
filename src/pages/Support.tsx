import { useState } from "react";
import { Link } from "react-router";
import { Award, ChevronDown, Download, Linkedin, Lock, NotebookPen, Share2, Trash2 } from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { FAQ, ME } from "../data/mock";
import { course, lessonsInOrder } from "../data/course";
import { Bar, Button, Empty, PageTitle, PartnerLogos } from "../components/ui";

export function Notes() {
  const { t, lang, locale } = useI18n();
  const { notes, removeNote } = useStore();
  const tutte = lessonsInOrder(course(lang));
  return (
    <>
      <PageTitle title={t("Notes")} subtitle={t("What you wrote along the lessons, private to you.")} />
      {notes.length === 0 ? (
        <Empty icon={<NotebookPen size={22} />} title={t("No notes yet")} text={t("Write a note from any lesson: it appears here.")} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((n) => {
            const x = tutte.find((y) => y.lesson.id === n.lessonId);
            return (
              <article key={n.id} className="card flex flex-col p-5">
                {x && (
                  <Link to={`/course/${x.lesson.id}`} className="eyebrow hover:text-link">
                    {x.section.title} · {x.lesson.title}
                  </Link>
                )}
                <p className="mt-2 flex-1 whitespace-pre-line text-[15px]">{n.text}</p>
                <div className="mt-3 flex items-center justify-between text-[12px] text-content-2">
                  {new Date(n.at).toLocaleDateString(locale, { day: "numeric", month: "long" })}
                  <button onClick={() => removeNote(n.id)} aria-label={t("Delete the note")} className="rounded-md p-1 hover:text-error">
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

export function Faq() {
  const { t, l } = useI18n();
  const [aperta, setAperta] = useState<number | null>(0);
  return (
    <>
      <PageTitle title={t("FAQ")} subtitle={t("The questions participants ask most often.")} />
      <div className="mx-auto flex max-w-[860px] flex-col gap-3">
        {FAQ.map((f, i) => (
          <section key={i} className="card overflow-hidden">
            <button onClick={() => setAperta(aperta === i ? null : i)} aria-expanded={aperta === i} className="flex w-full items-center gap-3 p-5 text-start">
              <span className="flex-1 font-semibold">{l(f.q)}</span>
              <ChevronDown size={18} className={`text-content-2 transition-transform ${aperta === i ? "rotate-180" : ""}`} />
            </button>
            {aperta === i && <p className="fade-up px-5 pb-5 text-[15px] leading-relaxed text-content-2">{l(f.a)}</p>}
          </section>
        ))}
      </div>
    </>
  );
}

export function Certifications() {
  const { t, lang } = useI18n();
  const { progress } = useStore();
  const pronto = progress.done === progress.total;
  return (
    <>
      <PageTitle title={t("Certifications")} subtitle={t("Your certificates, with a public link to share.")} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="card p-5 sm:p-6">
          <div className="relative">
            <Certificate />
            {!pronto && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface/75 p-6 text-center backdrop-blur-[2px]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
                  <Lock size={20} />
                </span>
                <p className="font-semibold">{t("Your certificate is waiting for you")}</p>
                <p className="max-w-sm text-[13px] text-content-2">{t("It unlocks when you complete all the lessons of “{course}”.", { course: course(lang).title })}</p>
                <Bar value={progress.percent} className="mt-2 w-48" />
                <p className="text-[12px] text-content-2 tabular-nums">{t("{done}/{total} lessons", { done: progress.done, total: progress.total })}</p>
              </div>
            )}
          </div>
        </section>
        <section className="card flex flex-col gap-3 self-start p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-link">
            <Award size={20} />
          </span>
          <h2 className="text-[18px] font-semibold">{t("Certificate of completion")}</h2>
          <p className="text-content-2">{t("Download it as PDF, add it to LinkedIn or share the public page: anyone can check it is real with its code.")}</p>
          <Button disabled={!pronto}>
            <Download size={15} /> {t("Download PDF")}
          </Button>
          <Button variant="secondary" disabled={!pronto}>
            <Linkedin size={15} /> {t("Add to LinkedIn")}
          </Button>
          <Button variant="secondary" disabled={!pronto}>
            <Share2 size={15} /> {t("Copy the public link")}
          </Button>
          {!pronto && (
            <Link to="/course" className="mt-1 text-[13px] font-semibold text-link hover:underline">
              {t("Continue the course")} ›
            </Link>
          )}
        </section>
      </div>
    </>
  );
}

function Certificate() {
  const { t, l, lang, locale } = useI18n();
  const base = import.meta.env.BASE_URL;
  return (
    <div className="cert-paper relative overflow-hidden rounded-2xl border border-[#e4e7ea] p-6 text-center sm:p-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div aria-hidden="true" className="absolute inset-3 rounded-xl border border-[#0bc1d5]/40" />
      <img src={`${base}brand/miis-logo.png`} alt="MiiS" className="relative mx-auto h-10 w-auto sm:h-12" />
      <p className="relative mt-6 text-[11px] font-semibold tracking-[0.2em] text-[#52606b] uppercase">{t("Certificate of completion")}</p>
      <p className="relative mt-4 text-[13px] text-[#52606b]">{t("This certifies that")}</p>
      <p className="relative mt-2 font-heading text-[26px] font-semibold sm:text-[34px]">{l(ME.name)}</p>
      <p className="relative mt-3 text-[13px] text-[#52606b]">{t("has successfully completed the program")}</p>
      <p className="relative mt-2 font-heading text-[18px] font-semibold text-[#06798a] sm:text-[22px]">{course(lang).title}</p>
      <div className="relative mt-8 flex items-end justify-between gap-4 text-start text-[11px] text-[#52606b]">
        <PartnerLogos tone="light" height={30} label={t("A program by Goumbook and EIIS")} className="flex-wrap" />
        <span className="text-end">
          {new Date().toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          <span className="block font-mono">MIIS-2027-0142</span>
        </span>
      </div>
    </div>
  );
}
