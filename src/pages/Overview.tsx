import { Link } from "react-router";
import { ChevronRight, MessageCircle, Play, UserRound } from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { course, lessonsInOrder } from "../data/course";
import { EVENTS, GROUPS, person } from "../data/mock";
import { AiMark, Avatar, Bar, PageTitle, useAgo } from "../components/ui";
import { DateChip } from "./Calendar";

/** La panoramica della formazione: il bento del campus. */
export function useNextLesson() {
  const { lang } = useI18n();
  const { done, sectionOpen } = useStore();
  const tutte = lessonsInOrder(course(lang));
  return tutte.find((x) => !done[x.lesson.id] && sectionOpen(x.section.id)) ?? tutte[tutte.length - 1];
}

export function Overview() {
  const { t, l, lang } = useI18n();
  const { progress, impact, answers, posts } = useStore();
  const c = course(lang);
  const next = useNextLesson();
  const sezione = c.sections.findIndex((s) => s.id === next.section.id) + 1;
  const ago = useAgo();
  const prossimi = EVENTS.filter((e) => e.end > new Date()).sort((a, b) => +a.start - +b.start).slice(0, 3);
  const testFatti = Object.values(answers).filter((a) => a.checked).length;
  const ultimi = posts.filter((p) => p.group === "cohort" && !p.official).slice(0, 2);
  const nelSezione = next.section.lessons.findIndex((x) => x.id === next.lesson.id) + 1;

  return (
    <>
      <PageTitle title={t("Learning overview")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <section
          className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[20px] p-6 text-white shadow-card lg:col-span-2 sm:p-7"
          style={{ background: "linear-gradient(140deg, #0b1f26 0%, #0a4f5a 55%, #0bc1d5 130%)" }}
        >
          <svg aria-hidden="true" className="absolute -top-16 -end-16 h-[360px] w-[360px] opacity-25" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="88" stroke="#e0245e" strokeWidth="7" strokeDasharray="120 40 6 60" strokeLinecap="round" />
            <circle cx="100" cy="100" r="66" stroke="#ffffff" strokeWidth="7" strokeDasharray="90 22 140 30" strokeLinecap="round" />
            <circle cx="100" cy="100" r="44" stroke="#8dc63f" strokeWidth="7" strokeDasharray="60 20 90 26" strokeLinecap="round" />
          </svg>
          <span className="relative mb-3 self-start rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-sm">
            {t("In progress · module {n} of {total}", { n: sezione, total: c.sections.length })}
          </span>
          <h2 className="relative text-[28px] leading-tight font-semibold sm:text-[32px]">{c.title}</h2>
          <p className="relative mt-1.5 text-white/75">
            {t("Next: {lesson} · {n} of {total} lessons", { lesson: next.lesson.title, n: nelSezione, total: next.section.lessons.length })}
          </p>
          <div className="relative mt-6 flex items-center gap-4">
            <Link to={`/course/${next.lesson.id}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 font-semibold text-[#0b1f26] hover:bg-white/90">
              <Play size={15} className="rtl:-scale-x-100" />
              {t("Continue")}
            </Link>
            <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
              <span className="block h-full rounded-full bg-white" style={{ width: `${progress.percent}%` }} />
            </span>
            <span className="text-[12px] font-semibold tabular-nums">{progress.percent}%</span>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow">{t("Impact Index")}</p>
            <Link to="/profile" className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-[12.5px] font-semibold hover:border-line-strong">
              {t("Improve")} <ChevronRight size={14} className="rtl:-scale-x-100" />
            </Link>
          </div>
          <p className="mt-1 font-heading text-[42px] leading-none font-semibold tabular-nums">{impact.total}%</p>
          <Bar value={impact.total} className="mt-4" />
          <ul className="mt-5 flex flex-col gap-3.5 text-[13px]">
            {[
              { label: t("Profile"), value: impact.profile, weight: 20, text: t("Photo, bio, role and interests: who you are, for the others."), dot: "bg-brand" },
              { label: t("Community"), value: impact.community, weight: 35, text: t("Posts, replies, reactions and connections."), dot: "bg-pink" },
              { label: t("Course"), value: impact.course, weight: 45, text: t("Lessons completed and exercises done."), dot: "bg-leaf" },
            ].map((r) => (
              <li key={r.label}>
                <p className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${r.dot}`} aria-hidden="true" />
                  <span className="flex-1">{r.label}</span>
                  <span className="text-content-2 tabular-nums">
                    {r.value}% · {t("weighs {w}%", { w: r.weight })}
                  </span>
                </p>
                <p className="mt-0.5 ps-4 text-[12px] leading-snug text-content-2">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="card grid grid-cols-3 divide-x divide-line rtl:divide-x-reverse">
          {[
            { label: t("Lessons"), value: `${progress.done}/${progress.total}` },
            { label: t("Exercises"), value: testFatti },
            { label: t("Certificates"), value: 0 },
          ].map((s) => (
            <div key={s.label} className="min-w-0 px-4 py-4">
              <p className="eyebrow truncate">{s.label}</p>
              <p className="mt-1 font-heading text-[24px] font-semibold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <Link to="/community/groups/cohort" className="card card-lift flex items-center gap-4 p-5 lg:col-span-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-community-soft text-community">
            <MessageCircle size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{t("Write in the group of your course")}</span>
            <span className="block text-content-2">{t("One thing you learned and one question are enough to start a conversation.")}</span>
          </span>
          <ChevronRight size={18} className="text-content-2 rtl:-scale-x-100" />
        </Link>

        <section className="card p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold">{t("Coming up")}</h3>
            <Link to="/calendar" className="text-[13px] font-semibold text-link hover:underline">
              {t("Open the calendar")} ›
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-line">
            {prossimi.map((e) => (
              <li key={e.id}>
                <Link to={`/calendar?event=${e.id}`} className="flex items-center gap-4 py-3 hover:opacity-80">
                  <DateChip date={e.start} kind={e.kind} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{l(e.title)}</span>
                    <span className="block truncate text-[12.5px] text-content-2">{l(e.where)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-4">
          <Link to="/profile" className="card card-lift flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-link">
              <UserRound size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t("Complete your profile")}</span>
              <span className="block text-[13px] text-content-2">{t("Two fields are still empty: a photo and a link.")}</span>
            </span>
            <ChevronRight size={18} className="text-content-2 rtl:-scale-x-100" />
          </Link>
          <section className="flex flex-1 flex-col rounded-[20px] border border-ai/25 bg-ai-soft p-5">
            <div className="flex items-center gap-3">
              <AiMark size={36} />
              <p className="font-semibold">{t("Stuck on a concept?")}</p>
            </div>
            <p className="mt-2 text-[13px] text-content-2">
              {t("The AI knows every lesson of the course: ask in your words, it answers in your language.")}
            </p>
            <p className="mt-auto pt-3 text-[12.5px] font-semibold text-ai">{t("Find “Ask AI” at the top of every page.")}</p>
          </section>
        </div>

        <section className="card p-6 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold">{t("From the community")}</h3>
            <Link to="/community/groups/cohort" className="text-[13px] font-semibold text-link hover:underline">
              {l(GROUPS[0].name)} ›
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {ultimi.map((p) => (
              <Link key={p.id} to={`/community/groups/cohort#${p.id}`} className="flex gap-3 rounded-xl border border-line p-4 hover:border-line-strong">
                <Avatar id={p.author} size={36} />
                <span className="min-w-0">
                  <span className="block text-[13px]">
                    <strong>{l(person(p.author).name)}</strong> <span className="text-content-2">· {ago(p.at)}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13.5px] text-content-2">{l(p.text)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
